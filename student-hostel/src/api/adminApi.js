import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const adminApi = {
  /**
   * Get admin dashboard stats
   * @returns {Promise} Dashboard statistics
   */
  getDashboardStats: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/dashboard`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Get admin analytics data
   * @returns {Promise} Analytics data
   */
  getAnalytics: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/analytics`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== USERS MANAGEMENT ====================

  /**
   * Get all users
   * @returns {Promise} List of all users
   */
  getUsers: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/users`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data
   * @returns {Promise} Created user
   */
  createUser: async (userData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/admin/users`,
      userData,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Toggle user status (verify/unverify)
   * @param {number} userId - User ID
   * @returns {Promise} Updated user status
   */
  toggleUserStatus: async (userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/users/${userId}`,
      {},
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Delete a user
   * @param {number} userId - User ID
   * @returns {Promise} Delete confirmation
   */
  deleteUser: async (userId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/admin/users/${userId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== HOSTELS MANAGEMENT ====================

  /**
   * Get all hostels
   * @returns {Promise} List of all hostels
   */
  getHostels: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/hostels`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Create a new hostel
   * @param {Object} hostelData - Hostel data
   * @returns {Promise} Created hostel
   */
  createHostel: async (hostelData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/admin/hostels`,
      hostelData,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Toggle hostel active status
   * @param {number} hostelId - Hostel ID
   * @returns {Promise} Updated hostel status
   */
  toggleHostelStatus: async (hostelId) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/hostels/${hostelId}`,
      {},
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Delete a hostel
   * @param {number} hostelId - Hostel ID
   * @returns {Promise} Delete confirmation
   */
  deleteHostel: async (hostelId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/admin/hostels/${hostelId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== BOOKINGS MANAGEMENT ====================

  /**
   * Get all bookings
   * @returns {Promise} List of all bookings
   */
  getBookings: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/bookings`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Update booking status
   * @param {number} bookingId - Booking ID
   * @param {string} status - New status (pending, confirmed, cancelled, completed)
   * @returns {Promise} Updated booking status
   */
  updateBookingStatus: async (bookingId, status) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/bookings`,
      { status },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Delete a booking
   * @param {number} bookingId - Booking ID
   * @returns {Promise} Delete confirmation
   */
  deleteBooking: async (bookingId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/admin/bookings/${bookingId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== PAYMENTS MANAGEMENT ====================

  /**
   * Get all payments
   * @returns {Promise} List of all payments
   */
  getPayments: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/payments`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Update payment status
   * @param {number} paymentId - Payment ID
   * @param {string} status - New status (pending, paid, failed, refunded)
   * @returns {Promise} Updated payment status
   */
  updatePaymentStatus: async (paymentId, status) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/payments/${paymentId}`,
      { status },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== REVIEWS MANAGEMENT ====================

  /**
   * Get all reviews
   * @returns {Promise} List of all reviews
   */
  getReviews: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/reviews`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Update review status (approve/reject)
   * @param {number} reviewId - Review ID
   * @param {string} action - Action (approve, reject)
   * @returns {Promise} Updated review status
   */
  updateReviewStatus: async (reviewId, action) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/reviews/${reviewId}/status`,
      { action },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Delete a review
   * @param {number} reviewId - Review ID
   * @returns {Promise} Delete confirmation
   */
  deleteReview: async (reviewId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/admin/reviews/${reviewId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== VERIFICATIONS MANAGEMENT ====================

  /**
   * Get pending verifications
   * @returns {Promise} List of pending verifications
   */
  getVerifications: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/verifications`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Approve or reject a verification
   * @param {number} verificationId - Verification ID
   * @param {string} status - Status (approved, rejected)
   * @returns {Promise} Updated verification status
   */
  processVerification: async (verificationId, status) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/admin/verifications/${verificationId}`,
      { status },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== SETTINGS ====================

  /**
   * Get all settings
   * @returns {Promise} Settings object
   */
  getSettings: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/admin/settings`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Update settings
   * @param {Object} settings - Settings object to update
   * @returns {Promise} Update confirmation
   */
  updateSettings: async (settings) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/admin/settings`,
      settings,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },
};

export default adminApi;

