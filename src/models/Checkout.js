/**
 * Checkout.js
 * Frontend model to represent a payment (checkout) and map to backend payment table.
 * Fields mirror the database/payment DTO expected by the backend:
 *  - paymentId
 *  - amount
 *  - paymentDate
 *  - status
 *  - transactionCode
 *  - paymentTimestamp
 *
 * Provides helpers to validate and serialize to the API payload expected by the backend.
 */

class Checkout {
  /**
   * Create a Checkout instance
   * @param {Object} params
   * @param {number} params.paymentId - optional id (for updates)
   * @param {number} params.amount - numeric amount (required)
   * @param {string|Date} [params.paymentDate] - date or ISO string when payment was made
   * @param {string} [params.status] - e.g., 'PENDING', 'COMPLETED', 'FAILED'
   * @param {string} [params.transactionCode] - provider transaction or reference code
   * @param {string|number} [params.paymentTimestamp] - timestamp (ms) or ISO string
   */
  constructor({ paymentId = null, amount = 0, paymentDate = null, status = 'PENDING', transactionCode = null, paymentTimestamp = null, paymentMethod = null, methodDetails = {} } = {}) {
    this.paymentId = paymentId;
    this.amount = typeof amount === 'string' ? parseFloat(amount) : amount;
    this.paymentDate = paymentDate ? new Date(paymentDate) : new Date();
    this.status = status;
    this.transactionCode = transactionCode;
    this.paymentTimestamp = paymentTimestamp ? new Date(paymentTimestamp) : new Date();
    // paymentMethod: 'card' | 'apple_pay' | 'cash_on_delivery'
    this.paymentMethod = paymentMethod;
    // methodDetails: object containing provider-specific tokens/metadata (e.g., { cardToken, last4, brand } )
    this.methodDetails = methodDetails || {};
  }

  // Basic validation: ensure amount is positive and status is present
  validate() {
    const errors = {};
    // amount must be a finite positive number
    if (this.amount === undefined || this.amount === null || !Number.isFinite(this.amount) || Number.isNaN(this.amount)) {
      errors.amount = 'Amount is required and must be a finite number';
    } else if (this.amount <= 0) {
      errors.amount = 'Amount must be greater than zero';
    }
    if (!this.status) {
      errors.status = 'Status is required';
    }
    // If payment is completed, require a transaction code
    if ((this.status && this.status.toUpperCase() === 'COMPLETED') && !this.transactionCode) {
      errors.transactionCode = 'Transaction code is required for completed payments';
    }

    // Payment method specific validation
    const method = this.paymentMethod ? String(this.paymentMethod).toLowerCase() : null;
    if (method === 'card') {
      // Require either a card token (preferred) or minimal card reference (last4)
      if (!this.methodDetails || (!this.methodDetails.cardToken && !this.methodDetails.last4)) {
        errors.paymentMethod = 'Card payments require a cardToken or last4 reference';
      }
    } else if (method === 'apple_pay') {
      if (!this.methodDetails || !this.methodDetails.applePayToken) {
        errors.paymentMethod = 'Apple Pay requires a payment token';
      }
    } else if (method === 'cash_on_delivery' || method === 'cod') {
      // COD should have delivery contact info
      if (!this.methodDetails || (!this.methodDetails.receiverPhone && !this.methodDetails.deliveryAddress)) {
        errors.paymentMethod = 'Cash on delivery requires a receiverPhone or deliveryAddress';
      }
    }
    return errors;
  }

  // Returns a payload object suitable to send to the backend API
  toApiPayload() {
    return {
      // backend expects camelCase fields that map to the DB columns
      paymentId: this.paymentId,
      amount: this.amount,
      // Use ISO strings for dates
      paymentDate: this.paymentDate ? this.paymentDate.toISOString() : null,
      status: this.status,
      transactionCode: this.transactionCode,
      paymentTimestamp: this.paymentTimestamp ? this.paymentTimestamp.toISOString() : null,
      // include payment method metadata for backend processing
      paymentMethod: this.paymentMethod,
      paymentMethodDetails: this.methodDetails || null
    };
  }

  // Format amount for display using Intl.NumberFormat (USD fallback)
  formatCurrency(locale = 'en-US', currency = 'USD') {
    try {
      return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(this.amount);
    } catch (e) {
      // fallback simple formatting
      return `${currency} ${Number.isFinite(this.amount) ? this.amount.toFixed(2) : '0.00'}`;
    }
  }

  // Return true if payment status is COMPLETED
  isCompleted() {
    return typeof this.status === 'string' && this.status.toUpperCase() === 'COMPLETED';
  }

  // Mark the checkout as completed and optionally set a transaction code and timestamp
  markCompleted({ transactionCode = null, timestamp = null } = {}) {
    this.status = 'COMPLETED';
    if (transactionCode) this.transactionCode = transactionCode;
    this.paymentTimestamp = timestamp ? new Date(timestamp) : new Date();
    return this;
  }

  // Friendly display date for the payment
  getDisplayDate(locale = 'en-GB', options = {}) {
    try {
      const defaultOpts = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Intl.DateTimeFormat(locale, Object.assign(defaultOpts, options)).format(this.paymentDate);
    } catch (e) {
      return this.paymentDate ? this.paymentDate.toISOString() : '';
    }
  }

  // Convert to payload suitable for form submissions (e.g., checkout forms)
  toFormPayload() {
    const fd = new FormData();
    if (this.paymentId != null) fd.append('paymentId', String(this.paymentId));
    fd.append('amount', String(this.amount));
    if (this.paymentDate) fd.append('paymentDate', this.paymentDate.toISOString());
    if (this.status) fd.append('status', this.status);
    if (this.transactionCode) fd.append('transactionCode', this.transactionCode);
    if (this.paymentTimestamp) fd.append('paymentTimestamp', this.paymentTimestamp.toISOString());
    if (this.paymentMethod) fd.append('paymentMethod', String(this.paymentMethod));
    // For method details, append a JSON string (backend should parse). For common tokens, also append shallow fields for convenience.
    if (this.methodDetails && Object.keys(this.methodDetails).length > 0) {
      try {
        fd.append('paymentMethodDetails', JSON.stringify(this.methodDetails));
      } catch (e) {
        // fallback: append primitive values if JSON fails
        Object.entries(this.methodDetails).forEach(([k, v]) => {
          if (v != null) fd.append(k, String(v));
        });
      }
      // Convenience shallow fields (don't include sensitive full card numbers)
      if (this.methodDetails.cardToken) fd.append('cardToken', this.methodDetails.cardToken);
      if (this.methodDetails.last4) fd.append('cardLast4', this.methodDetails.last4);
      if (this.methodDetails.brand) fd.append('cardBrand', this.methodDetails.brand);
      if (this.methodDetails.applePayToken) fd.append('applePayToken', this.methodDetails.applePayToken);
      if (this.methodDetails.receiverPhone) fd.append('codReceiverPhone', this.methodDetails.receiverPhone);
      if (this.methodDetails.deliveryAddress) fd.append('codDeliveryAddress', this.methodDetails.deliveryAddress);
    }
    return fd;
  }

  // Convenience: create a Checkout instance from an API response payload
  static fromApi(payload = {}) {
    return new Checkout({
      paymentId: payload.paymentId || payload.payment_id || null,
      amount: payload.amount || 0,
      paymentDate: payload.paymentDate || payload.payment_date || payload.createdAt || null,
      status: payload.status || null,
      transactionCode: payload.transactionCode || payload.transaction_code || null,
      paymentTimestamp: payload.paymentTimestamp || payload.payment_timestamp || null,
      paymentMethod: payload.paymentMethod || payload.payment_method || null,
      methodDetails: payload.paymentMethodDetails || payload.payment_method_details || payload.methodDetails || {}
    });
  }

  // Payment method helpers
  isCard() {
    return !!this.paymentMethod && String(this.paymentMethod).toLowerCase() === 'card';
  }

  isApplePay() {
    return !!this.paymentMethod && String(this.paymentMethod).toLowerCase() === 'apple_pay';
  }

  isCOD() {
    const v = this.paymentMethod ? String(this.paymentMethod).toLowerCase() : '';
    return v === 'cash_on_delivery' || v === 'cod';
  }
}

export default Checkout;
