import axios from "./axios";

/**
 * Booking API Service
 * Handles all booking-related API calls
 */

const bookingApi = {
  /**
   * Create a new booking
   * @param {Object} bookingData - Booking details
   * @returns {Promise} Response with created booking
   */
  create: async (bookingData) => {
    const response = await axios.post("/bookings", bookingData);
    return response.data;
  },

  /**
   * Get all bookings (Admin) or user bookings
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with bookings list
   */
  getAll: async (params = {}) => {
    const response = await axios.get("/bookings", { params });
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
   * Get student's bookings
   * @param {Object} params - Query parameters (status, page, limit)
   * @returns {Promise} Response with student bookings
   */
  getStudentBookings: async (params = {}) => {
    const response = await axios.get("/bookings/my-bookings", { params });
    return response.data;
  },

  /**
   * Get host's bookings (for their properties)
   * @param {Object} params - Query parameters (status, page, limit)
   * @returns {Promise} Response with host bookings
   */
  getHostBookings: async (params = {}) => {
    const response = await axios.get("/bookings/host-bookings", { params });
    return response.data;
  },

  /**
   * Update booking status
   * @param {number} id - Booking ID
   * @param {Object} data - Update data (status, notes)
   * @returns {Promise} Response with updated booking
   */
  update: async (id, data) => {
    const response = await axios.put(`/bookings/${id}`, data);
    return response.data;
  },

  /**
   * Cancel booking
   * @param {number} id - Booking ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} Response with cancelled booking
   */
  cancel: async (id, reason = "") => {
    const response = await axios.post(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },

  /**
   * Accept booking (Host)
   * @param {number} id - Booking ID
   * @returns {Promise} Response with accepted booking
   */
  accept: async (id) => {
    const response = await axios.post(`/bookings/${id}/accept`);
    return response.data;
  },

  /**
   * Reject booking (Host)
   * @param {number} id - Booking ID
   * @param {string} reason - Rejection reason
   * @returns {Promise} Response with rejected booking
   */
  reject: async (id, reason = "") => {
    const response = await axios.post(`/bookings/${id}/reject`, { reason });
    return response.data;
  },

  /**
   * Check accommodation availability
   * @param {number} accommodationId - Accommodation ID
   * @param {Object} params - Date range parameters
   * @returns {Promise} Response with availability data
   */
  checkAvailability: async (accommodationId, params) => {
    const response = await axios.get(
      `/accommodations/${accommodationId}/availability`,
      { params },
    );
    return response.data;
  },

  /**
   * Calculate booking price
   * @param {Object} params - Booking parameters
   * @returns {Promise} Response with price calculation
   */
  calculatePrice: async (params) => {
    const response = await axios.post("/bookings/calculate-price", params);
    return response.data;
  },

  /**
   * Get booking calendar (for host availability management)
   * @param {number} accommodationId - Accommodation ID
   * @param {string} month - Month in YYYY-MM format
   * @returns {Promise} Response with booking calendar
   */
  getBookingCalendar: async (accommodationId, month) => {
    const response = await axios.get(
      `/accommodations/${accommodationId}/bookings`,
      {
        params: { month },
      },
    );
    return response.data;
  },

  /**
   * Download booking receipt
   * @param {number} id - Booking ID
   * @returns {Promise} Blob response with PDF
   */
  downloadReceipt: async (id) => {
    const response = await axios.get(`/bookings/${id}/receipt`, {
      responseType: "blob",
    });
    return response.data;
  },

  /**
   * Request booking modification
   * @param {number} id - Booking ID
   * @param {Object} modifications - Requested changes
   * @returns {Promise} Response with modification request
   */
  requestModification: async (id, modifications) => {
    const response = await axios.post(`/bookings/${id}/modify`, modifications);
    return response.data;
  },

  /**
   * Report booking issue
   * @param {number} id - Booking ID
   * @param {Object} issueData - Issue details
   * @returns {Promise} Response with created issue
   */
  reportIssue: async (id, issueData) => {
    const response = await axios.post(`/bookings/${id}/issue`, issueData);
    return response.data;
  },
};

export default bookingApi;
