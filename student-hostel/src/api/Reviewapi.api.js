import axios from './axios';

/**
 * Review API Service
 * Handles all review-related API calls
 */

const reviewApi = {
  /**
   * Get all reviews for an accommodation
   * @param {number} accommodationId - Accommodation ID
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.sort - Sort order (newest, oldest, highest, lowest)
   * @returns {Promise} Response with reviews list
   */
  getByAccommodation: async (accommodationId, params = {}) => {
    const response = await axios.get(`/accommodations/${accommodationId}/reviews`, {
      params,
    });
    return response.data;
  },

  /**
   * Get single review by ID
   * @param {number} id - Review ID
   * @returns {Promise} Response with review details
   */
  getById: async (id) => {
    const response = await axios.get(`/reviews/${id}`);
    return response.data;
  },

  /**
   * Create new review
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.booking_id - Booking ID
   * @param {number} reviewData.accommodation_id - Accommodation ID
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.comment - Review comment
   * @returns {Promise} Response with created review
   */
  create: async (reviewData) => {
    const response = await axios.post('/reviews', reviewData);
    return response.data;
  },

  /**
   * Update review
   * @param {number} id - Review ID
   * @param {Object} reviewData - Updated review data
   * @returns {Promise} Response with updated review
   */
  update: async (id, reviewData) => {
    const response = await axios.put(`/reviews/${id}`, reviewData);
    return response.data;
  },

  /**
   * Delete review
   * @param {number} id - Review ID
   * @returns {Promise} Response confirming deletion
   */
  delete: async (id) => {
    const response = await axios.delete(`/reviews/${id}`);
    return response.data;
  },

  /**
   * Get user's reviews (Student dashboard)
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with user's reviews
   */
  getMyReviews: async (params = {}) => {
    const response = await axios.get('/student/reviews', { params });
    return response.data;
  },

  /**
   * Get reviews for host's accommodations (Host dashboard)
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with reviews for host's properties
   */
  getHostReviews: async (params = {}) => {
    const response = await axios.get('/host/reviews', { params });
    return response.data;
  },

  /**
   * Check if user can review accommodation
   * @param {number} accommodationId - Accommodation ID
   * @returns {Promise} Response with eligibility status
   */
  canReview: async (accommodationId) => {
    const response = await axios.get(`/reviews/can-review/${accommodationId}`);
    return response.data;
  },

  /**
   * Get review statistics for accommodation
   * @param {number} accommodationId - Accommodation ID
   * @returns {Promise} Response with review statistics
   */
  getStats: async (accommodationId) => {
    const response = await axios.get(`/accommodations/${accommodationId}/reviews/stats`);
    return response.data;
  },

  /**
   * Get average rating for accommodation
   * @param {number} accommodationId - Accommodation ID
   * @returns {Promise} Response with average rating
   */
  getAverageRating: async (accommodationId) => {
    const response = await axios.get(
      `/accommodations/${accommodationId}/reviews/average`
    );
    return response.data;
  },

  /**
   * Like/helpful a review
   * @param {number} id - Review ID
   * @returns {Promise} Response confirming like
   */
  likeReview: async (id) => {
    const response = await axios.post(`/reviews/${id}/like`);
    return response.data;
  },

  /**
   * Unlike a review
   * @param {number} id - Review ID
   * @returns {Promise} Response confirming unlike
   */
  unlikeReview: async (id) => {
    const response = await axios.delete(`/reviews/${id}/like`);
    return response.data;
  },

  /**
   * Report review (spam, inappropriate, etc.)
   * @param {number} id - Review ID
   * @param {Object} reportData - Report data
   * @param {string} reportData.reason - Report reason
   * @param {string} reportData.details - Additional details
   * @returns {Promise} Response confirming report
   */
  reportReview: async (id, reportData) => {
    const response = await axios.post(`/reviews/${id}/report`, reportData);
    return response.data;
  },

  /**
   * Get pending reviews (bookings without reviews)
   * @returns {Promise} Response with bookings awaiting review
   */
  getPendingReviews: async () => {
    const response = await axios.get('/reviews/pending');
    return response.data;
  },

  /**
   * Get recent reviews (site-wide)
   * @param {number} limit - Number of recent reviews
   * @returns {Promise} Response with recent reviews
   */
  getRecent: async (limit = 10) => {
    const response = await axios.get('/reviews/recent', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get top-rated accommodations based on reviews
   * @param {number} limit - Number of top-rated accommodations
   * @returns {Promise} Response with top-rated accommodations
   */
  getTopRated: async (limit = 10) => {
    const response = await axios.get('/reviews/top-rated', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Respond to review (Host only)
   * @param {number} id - Review ID
   * @param {Object} responseData - Host response
   * @param {string} responseData.response - Host's response text
   * @returns {Promise} Response with updated review
   */
  respondToReview: async (id, responseData) => {
    const response = await axios.post(`/reviews/${id}/respond`, responseData);
    return response.data;
  },

  /**
   * Get all reviews (Admin only)
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with all reviews
   */
  getAllReviews: async (params = {}) => {
    const response = await axios.get('/admin/reviews', { params });
    return response.data;
  },

  /**
   * Moderate review (Admin only)
   * @param {number} id - Review ID
   * @param {Object} moderationData - Moderation action
   * @param {string} moderationData.action - Action (approve, reject, delete)
   * @param {string} moderationData.reason - Reason for action
   * @returns {Promise} Response confirming moderation
   */
  moderateReview: async (id, moderationData) => {
    const response = await axios.post(`/admin/reviews/${id}/moderate`, moderationData);
    return response.data;
  },
};

export default reviewApi;