import axios from 'axios';

// Base URL configuration
const API_BASE_URL = 'http://localhost:8081/bookstore';

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
      let response;
      console.log(`Attempting ${userType} login for ${email}`);
      console.log('Login request payload:', { email, password: '***' });
      
      if (userType === 'admin') {
        response = await api.post('/auth/login', { email, password });
      } else {
        response = await api.post('/api/users/login', { email, password });
      }
      console.log('Login API response:', response.data);
      const payload = response.data;
      if (payload.token) {
        localStorage.setItem('authToken', payload.token);
      }
      if (payload.user) {
        localStorage.setItem('userInfo', JSON.stringify(payload.user));
      }
      return { user: payload.user || payload, token: payload.token || null };
    } catch (error) {
      console.error('authService.login error:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
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
  getAll: () => api.get('/api/users/all'),
  getById: (id) => api.get(`/api/users/${id}`),
  create: (userData) => api.post('/api/users/create', userData),
  update: (userData) => api.put('/api/users/update', userData),
  delete: (id) => api.delete(`/api/users/delete/${id}`),
  deactivate: (id) => api.put(`/api/users/deactivate/${id}`),
  reactivate: (id) => api.put(`/api/users/reactivate/${id}`),
};

// Book services
export const bookService = {
  getAll: () => api.get('/api/book'),
  getById: (id) => api.get(`/api/book/${id}`),
  // create expects multipart/form-data for image uploads. Caller should use `api` directly or set form headers.
  // Let axios/browser set the Content-Type with boundary for multipart requests
  create: (formData) => api.post('/api/book/create', formData),
  update: (bookId, bookData) => api.put(`/api/book/${bookId}`, bookData),
  delete: (id) => api.delete(`/api/book/delete/${id}`),
  // backend doesn't currently expose advanced search endpoints; leave client-side filters for now
};

// Order services
export const orderService = {
  getAll: () => api.get('/api/orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
  getByUserId: (userId) => api.get(`/api/orders/customer/${userId}`),
  create: (orderData, userId) => api.post(`/api/orders/create?userId=${userId}`, orderData),
  update: (orderData) => api.put('/api/orders/update', orderData),
  updateStatus: (orderId, status) => api.put(`/api/orders/${orderId}/status`, { status: status.toUpperCase() }),
  getStatuses: () => api.get('/api/orders/statuses'),
  cancel: (orderId) => api.put(`/api/orders/cancel/${orderId}`),
  delete: (id) => api.delete(`/api/orders/delete/${id}`),
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
  getAll: () => api.get('/api/payments'),
  getById: (id) => api.get(`/api/payments/${id}`),
  // backend exposes some payment-specific endpoints; use repository-style endpoints if available
  create: (paymentData) => api.post('/api/payments/create', paymentData),
  // process/refund/verify use different paths on backend; caller should use specific endpoints
  process: (paymentId) => api.put(`/api/payments/process/${paymentId}`),
  refund: (paymentId) => api.put(`/api/payments/refund/${paymentId}`),
  verify: (paymentId) => api.get(`/api/payments/verify/${paymentId}`),
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

// Supply line backend removed; no client service exported.

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