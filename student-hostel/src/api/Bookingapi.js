import axios from './axios';

/**
 * Booking API Service
 * Handles all booking-related API calls
 */

const bookingApi = {
  /**
   * Get all bookings for current user
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (paid, pending, cancelled, completed)
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} Response with bookings list
   */
  getAll: async (params = {}) => {
    const response = await axios.get('/bookings', { params });
    return response.data;
  },

  /**
   * Get single booking by ID
   * @param {number} id - Booking ID
   * @returns {Promise} Response with booking details
   */
  getById: async (id) => {
    const response = await axios.get(`/bookings/${id}`);
    return response.data;
  },

  /**
   * Create new booking
   * @param {Object} bookingData - Booking data
   * @param {number} bookingData.accommodation_id - Accommodation ID
   * @param {Date} bookingData.check_in - Check-in date
   * @param {Date} bookingData.check_out - Check-out date
   * @param {number} bookingData.total_price - Total price
   * @returns {Promise} Response with created booking
   */
  create: async (bookingData) => {
    const response = await axios.post('/bookings', bookingData);
    return response.data;
  },

  /**
   * Update booking
   * @param {number} id - Booking ID
   * @param {Object} bookingData - Updated booking data
   * @returns {Promise} Response with updated booking
   */
  update: async (id, bookingData) => {
    const response = await axios.put(`/bookings/${id}`, bookingData);
    return response.data;
  },

  /**
   * Cancel booking
   * @param {number} id - Booking ID
   * @param {Object} data - Cancellation reason (optional)
   * @returns {Promise} Response confirming cancellation
   */
  cancel: async (id, data = {}) => {
    const response = await axios.post(`/bookings/${id}/cancel`, data);
    return response.data;
  },

  /**
   * Complete booking (mark as completed)
   * @param {number} id - Booking ID
   * @returns {Promise} Response confirming completion
   */
  complete: async (id) => {
    const response = await axios.post(`/bookings/${id}/complete`);
    return response.data;
  },

  /**
   * Get student bookings (Student dashboard)
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with student's bookings
   */
  getStudentBookings: async (params = {}) => {
    const response = await axios.get('/student/bookings', { params });
    return response.data;
  },

  /**
   * Get host bookings (Host dashboard)
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with bookings for host's properties
   */
  getHostBookings: async (params = {}) => {
    const response = await axios.get('/host/bookings', { params });
    return response.data;
  },

  /**
   * Accept booking (Host only)
   * @param {number} id - Booking ID
   * @returns {Promise} Response confirming acceptance
   */
  accept: async (id) => {
    const response = await axios.post(`/bookings/${id}/accept`);
    return response.data;
  },

  /**
   * Reject booking (Host only)
   * @param {number} id - Booking ID
   * @param {Object} data - Rejection reason
   * @returns {Promise} Response confirming rejection
   */
  reject: async (id, data) => {
    const response = await axios.post(`/bookings/${id}/reject`, data);
    return response.data;
  },

  /**
   * Check booking availability
   * @param {Object} params - Availability parameters
   * @param {number} params.accommodation_id - Accommodation ID
   * @param {Date} params.check_in - Check-in date
   * @param {Date} params.check_out - Check-out date
   * @returns {Promise} Response with availability status
   */
  checkAvailability: async (params) => {
    const response = await axios.post('/bookings/check-availability', params);
    return response.data;
  },

  /**
   * Calculate booking price
   * @param {Object} params - Price calculation parameters
   * @param {number} params.accommodation_id - Accommodation ID
   * @param {Date} params.check_in - Check-in date
   * @param {Date} params.check_out - Check-out date
   * @returns {Promise} Response with price breakdown
   */
  calculatePrice: async (params) => {
    const response = await axios.post('/bookings/calculate-price', params);
    return response.data;
  },

  /**
   * Get booking statistics (Dashboard)
   * @returns {Promise} Response with booking statistics
   */
  getStats: async () => {
    const response = await axios.get('/bookings/stats');
    return response.data;
  },

  /**
   * Download booking receipt
   * @param {number} id - Booking ID
   * @returns {Promise} Response with receipt data/URL
   */
  downloadReceipt: async (id) => {
    const response = await axios.get(`/bookings/${id}/receipt`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get upcoming bookings
   * @param {number} limit - Number of upcoming bookings
   * @returns {Promise} Response with upcoming bookings
   */
  getUpcoming: async (limit = 5) => {
    const response = await axios.get('/bookings/upcoming', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get past bookings
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with past bookings
   */
  getPast: async (params = {}) => {
    const response = await axios.get('/bookings/past', { params });
    return response.data;
  },

  /**
   * Get active bookings
   * @returns {Promise} Response with active bookings
   */
  getActive: async () => {
    const response = await axios.get('/bookings/active');
    return response.data;
  },
};

export default bookingApi;