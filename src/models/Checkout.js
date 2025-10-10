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
  constructor({ paymentId = null, amount = 0, paymentDate = null, status = 'PENDING', transactionCode = null, paymentTimestamp = null } = {}) {
    this.paymentId = paymentId;
    this.amount = typeof amount === 'string' ? parseFloat(amount) : amount;
    this.paymentDate = paymentDate ? new Date(paymentDate) : new Date();
    this.status = status;
    this.transactionCode = transactionCode;
    this.paymentTimestamp = paymentTimestamp ? new Date(paymentTimestamp) : new Date();
  }

  // Basic validation: ensure amount is positive and status is present
  validate() {
    const errors = {};
    if (this.amount === undefined || this.amount === null || Number.isNaN(this.amount)) {
      errors.amount = 'Amount is required and must be a number';
    } else if (this.amount <= 0) {
      errors.amount = 'Amount must be greater than zero';
    }
    if (!this.status) {
      errors.status = 'Status is required';
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
      paymentTimestamp: this.paymentTimestamp ? this.paymentTimestamp.toISOString() : null
    };
  }

  // Convenience: create a Checkout instance from an API response payload
  static fromApi(payload = {}) {
    return new Checkout({
      paymentId: payload.paymentId || payload.payment_id || null,
      amount: payload.amount || 0,
      paymentDate: payload.paymentDate || payload.payment_date || payload.createdAt || null,
      status: payload.status || null,
      transactionCode: payload.transactionCode || payload.transaction_code || null,
      paymentTimestamp: payload.paymentTimestamp || payload.payment_timestamp || null
    });
  }
}

export default Checkout;
