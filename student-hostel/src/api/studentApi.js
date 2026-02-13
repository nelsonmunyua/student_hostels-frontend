import axios from './axios';

/**
 * Student API Service
 * Handles all student-specific API calls for the student dashboard
 */

const studentApi = {
  // =========================
  // ACCOMMODATIONS
  // =========================
  
  /**
   * Get all available accommodations with filters
   * @param {Object} params - Query parameters
   * @param {string} params.location - Filter by location
   * @param {number} params.min_price - Minimum price
   * @param {number} params.max_price - Maximum price
   * @param {string} params.room_type - Room type filter
   * @param {string[]} params.amenities - Amenities filter
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} Response with accommodations list
   */
  getAccommodations: async (params = {}) => {
    const response = await axios.get('/student/accommodations', { params });
    return response.data;
  },

  /**
   * Get single accommodation details
   * @param {number} hostelId - Accommodation ID
   * @returns {Promise} Response with accommodation details
   */
  getAccommodationDetail: async (hostelId) => {
    const response = await axios.get(`/student/accommodations/${hostelId}`);
    return response.data;
  },

  // =========================
  // WISHLIST
  // =========================

  /**
   * Get student's wishlist
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} Response with wishlist items
   */
  getWishlist: async (params = {}) => {
    const response = await axios.get('/student/wishlist', { params });
    return response.data;
  },

  /**
   * Add accommodation to wishlist
   * @param {number} hostelId - Accommodation ID
   * @returns {Promise} Response confirming addition
   */
  addToWishlist: async (hostelId) => {
    const response = await axios.post('/student/wishlist', { hostel_id: hostelId });
    return response.data;
  },

  /**
   * Remove accommodation from wishlist
   * @param {number} hostelId - Accommodation ID
   * @returns {Promise} Response confirming removal
   */
  removeFromWishlist: async (hostelId) => {
    const response = await axios.delete(`/student/wishlist/${hostelId}`);
    return response.data;
  },

  /**
   * Toggle wishlist (add if not exists, remove if exists)
   * @param {number} hostelId - Accommodation ID
   * @returns {Promise} Response with updated status
   */
  toggleWishlist: async (hostelId) => {
    const response = await axios.post(`/student/wishlist/${hostelId}`);
    return response.data;
  },

  /**
   * Check if accommodation is in wishlist
   * @param {number} hostelId - Accommodation ID
   * @returns {Promise} Response with wishlist status
   */
  checkWishlist: async (hostelId) => {
    const response = await axios.get(`/student/wishlist/check/${hostelId}`);
    return response.data;
  },

  // =========================
  // REVIEWS
  // =========================

  /**
   * Get student's reviews
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status
   * @returns {Promise} Response with reviews list
   */
  getMyReviews: async (params = {}) => {
    const response = await axios.get('/student/reviews', { params });
    return response.data;
  },

  /**
   * Create a review
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.booking_id - Booking ID
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.comment - Review comment
   * @returns {Promise} Response with created review
   */
  createReview: async (reviewData) => {
    const response = await axios.post('/student/reviews', reviewData);
    return response.data;
  },

  /**
   * Update a review
   * @param {number} reviewId - Review ID
   * @param {Object} reviewData - Updated review data
   * @returns {Promise} Response with updated review
   */
  updateReview: async (reviewId, reviewData) => {
    const response = await axios.put(`/student/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  /**
   * Delete a review
   * @param {number} reviewId - Review ID
   * @returns {Promise} Response confirming deletion
   */
  deleteReview: async (reviewId) => {
    const response = await axios.delete(`/student/reviews/${reviewId}`);
    return response.data;
  },

  /**
   * Get single review details
   * @param {number} reviewId - Review ID
   * @returns {Promise} Response with review details
   */
  getReviewDetail: async (reviewId) => {
    const response = await axios.get(`/student/reviews/${reviewId}`);
    return response.data;
  },

  /**
   * Get bookings pending review
   * @returns {Promise} Response with bookings awaiting review
   */
  getPendingReviews: async () => {
    const response = await axios.get('/student/reviews/pending');
    return response.data;
  },

  // =========================
  // PAYMENTS
  // =========================

  /**
   * Get student's payment history
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status
   * @returns {Promise} Response with payments list
   */
  getPayments: async (params = {}) => {
    const response = await axios.get('/student/payments', { params });
    return response.data;
  },

  /**
   * Get payment statistics
   * @returns {Promise} Response with payment stats
   */
  getPaymentStats: async () => {
    const response = await axios.get('/student/payments/stats');
    return response.data;
  },

  // =========================
  // NOTIFICATIONS
  // =========================

  /**
   * Get student's notifications
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {boolean} params.unread_only - Only unread notifications
   * @returns {Promise} Response with notifications list
   */
  getNotifications: async (params = {}) => {
    const response = await axios.get('/student/notifications', { params });
    return response.data;
  },

  /**
   * Get single notification
   * @param {number} notificationId - Notification ID
   * @returns {Promise} Response with notification details
   */
  getNotificationDetail: async (notificationId) => {
    const response = await axios.get(`/student/notifications/${notificationId}`);
    return response.data;
  },

  /**
   * Mark notification as read
   * @param {number} notificationId - Notification ID
   * @returns {Promise} Response confirming update
   */
  markNotificationRead: async (notificationId) => {
    const response = await axios.put(`/student/notifications/${notificationId}`);
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Response confirming update
   */
  markAllNotificationsRead: async () => {
    const response = await axios.post('/student/notifications');
    return response.data;
  },

  // =========================
  // SUPPORT
  // =========================

  /**
   * Create support ticket
   * @param {Object} ticketData - Ticket data
   * @param {string} ticketData.subject - Ticket subject
   * @param {string} ticketData.message - Ticket message
   * @param {number} ticketData.booking_id - Related booking ID (optional)
   * @returns {Promise} Response with ticket details
   */
  createSupportTicket: async (ticketData) => {
    const response = await axios.post('/student/support', ticketData);
    return response.data;
  },

  /**
   * Get student's support tickets
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.status - Filter by status
   * @returns {Promise} Response with tickets list
   */
  getSupportTickets: async (params = {}) => {
    const response = await axios.get('/student/support/tickets', { params });
    return response.data;
  },

  // =========================
  // DASHBOARD STATS
  // =========================

  /**
   * Get dashboard statistics
   * @returns {Promise} Response with stats and recent bookings
   */
  getDashboardStats: async () => {
    const response = await axios.get('/student/dashboard-stats');
    return response.data;
  },

  // =========================
  // BOOKING
  // =========================

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @param {number} bookingData.hostel_id - Hostel ID
   * @param {number} bookingData.room_id - Room ID (optional, will use first available if not provided)
   * @param {string} bookingData.start_date - Start date (YYYY-MM-DD)
   * @param {string} bookingData.end_date - End date (YYYY-MM-DD)
   * @returns {Promise} Response with created booking
   */
  createBooking: async (bookingData) => {
    const response = await axios.post('/bookings', bookingData);
    return response.data;
  },

  /**
   * Get booking details
   * @param {number} bookingId - Booking ID
   * @returns {Promise} Response with booking details
   */
  getBookingDetail: async (bookingId) => {
    const response = await axios.get(`/student/bookings/${bookingId}`);
    return response.data;
  },

  /**
   * Check room availability
   * @param {Object} availabilityData - Availability check data
   * @param {number} availabilityData.hostel_id - Hostel ID
   * @param {number} availabilityData.room_id - Room ID (optional)
   * @param {string} availabilityData.start_date - Start date
   * @param {string} availabilityData.end_date - End date
   * @returns {Promise} Response with availability info
   */
  checkAvailability: async (availabilityData) => {
    const response = await axios.post('/bookings/check-availability', availabilityData);
    return response.data;
  },
};

export default studentApi;

