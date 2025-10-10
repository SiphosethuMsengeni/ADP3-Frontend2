import axios from 'axios';

// Base URL configuration
const API_BASE_URL = '/bookstore/api';

// Create axios instance with default config (do NOT force Content-Type globally)
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If sending FormData, remove Content-Type header so browser/axios can set the multipart boundary
    if (config.data instanceof FormData) {
      if (config.headers && config.headers['Content-Type']) {
        delete config.headers['Content-Type'];
      }
      if (config.headers && config.headers['content-type']) {
        delete config.headers['content-type'];
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication services
export const authService = {
  login: async (email, password, userType = 'customer') => {
    try {
      // Call backend API for authentication
      // backend exposes user login at POST /bookstore/api/users/login
      const response = await api.post('/users/login', { email, password, userType });
      // backend returns { user, token }
      const payload = response.data;
      // persist user+token for convenience
      if (payload.token) {
        localStorage.setItem('authToken', payload.token);
      }
      if (payload.user) {
        localStorage.setItem('userInfo', JSON.stringify(payload.user));
      }
      return { user: payload.user || payload, token: payload.token || null };
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userInfo');
  },

  getCurrentUser: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  setUser: (user, token) => {
    localStorage.setItem('userInfo', JSON.stringify(user));
    if (token) {
      localStorage.setItem('authToken', token);
    }
  }
};

// User services
export const userService = {
  getAll: () => api.get('/users/all'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users/create', userData),
  update: (userData) => api.put('/users/update', userData),
  delete: (id) => api.delete(`/users/delete/${id}`),
};

// Book services
export const bookService = {
  getAll: () => api.get('/book/all'),
  getById: (id) => api.get(`/book/${id}`),
  // create expects multipart/form-data for image uploads. Caller should use `api` directly or set form headers.
  // Let axios/browser set the Content-Type with boundary for multipart requests
  create: (formData) => api.post('/book/create', formData),
  update: (bookData) => api.put('/book/update', bookData),
  delete: (id) => api.delete(`/book/delete/${id}`),
  // backend doesn't currently expose advanced search endpoints; leave client-side filters for now
};

// Order services
export const orderService = {
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  getByUserId: (userId) => api.get(`/orders/customer/${userId}`),
  create: (orderData, userId) => api.post(`/orders/create?userId=${userId}`, orderData),
  update: (orderData) => api.put('/orders/update', orderData),
  delete: (id) => api.delete(`/orders/delete/${id}`),
};

// Order Item services
export const orderItemService = {
  // Not implemented on backend yet
  getAll: () => Promise.reject(new Error('Not implemented')),
  getById: (id) => Promise.reject(new Error('Not implemented')),
  getByOrderId: (orderId) => Promise.reject(new Error('Not implemented')),
  create: (orderItemData) => Promise.reject(new Error('Not implemented')),
  update: (id, orderItemData) => Promise.reject(new Error('Not implemented')),
  delete: (id) => Promise.reject(new Error('Not implemented')),
};

// Payment services
export const paymentService = {
  getAll: () => api.get('/payments'),
  getById: (id) => api.get(`/payments/${id}`),
  // backend exposes some payment-specific endpoints; use repository-style endpoints if available
  create: (paymentData) => api.post('/payments/create', paymentData),
  // process/refund/verify use different paths on backend; caller should use specific endpoints
  process: (paymentId) => api.put(`/payments/process/${paymentId}`),
  refund: (paymentId) => api.put(`/payments/refund/${paymentId}`),
  verify: (paymentId) => api.get(`/payments/verify/${paymentId}`),
};

// Contact services
export const contactService = {
  getAll: () => api.get('/contacts'),
  getById: (id) => api.get(`/contacts/${id}`),
  create: (contactData) => api.post('/contacts', contactData),
  update: (id, contactData) => api.put(`/contacts/${id}`, contactData),
  delete: (id) => api.delete(`/contacts/${id}`),
};

// Supplier and SupplyOrder APIs removed — backend no longer exposes these resources.

// Supply Line services
export const supplyLineService = {
  getAll: () => Promise.reject(new Error('Not implemented')),
  getById: (id) => api.get(`/line/${id}`),
  create: (supplyLineData) => api.post('/line/create', supplyLineData),
  update: (supplyLineData) => api.put('/line/update', supplyLineData),
  delete: (id) => api.delete(`/line/delete/${id}`),
};

// Error handler utility
export const handleAPIError = (error) => {
  if (error.code === 'ECONNREFUSED') {
    return 'Unable to connect to server. Please check if the backend is running.';
  } else if (error.response?.status === 400) {
    return error.response.data?.message || 'Invalid request. Please check your input.';
  } else if (error.response?.status === 401) {
    return 'Unauthorized. Please log in again.';
  } else if (error.response?.status === 403) {
    return 'Access forbidden. You do not have permission to perform this action.';
  } else if (error.response?.status === 404) {
    return 'Resource not found.';
  } else if (error.response?.status === 409) {
    return 'Email already exists. Please use a different email or try logging in.';
  } else if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
};

// Export the axios instance for direct use if needed
export default api;