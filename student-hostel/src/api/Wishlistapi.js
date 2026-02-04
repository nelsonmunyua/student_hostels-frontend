import axios from './axios';

/**
 * Wishlist API Service
 * Handles all wishlist-related API calls
 */

const wishlistApi = {
  /**
   * Get user's wishlist
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} Response with wishlist items
   */
  getAll: async (params = {}) => {
    const response = await axios.get('/wishlist', { params });
    return response.data;
  },

  /**
   * Add accommodation to wishlist
   * @param {number} accommodationId - Accommodation ID
   * @returns {Promise} Response confirming addition
   */
  add: async (accommodationId) => {
    const response = await axios.post('/wishlist', { accommodation_id: accommodationId });
    return response.data;
  },

  /**
   * Remove accommodation from wishlist
   * @param {number} accommodationId - Accommodation ID
   * @returns {Promise} Response confirming removal
   */
  remove: async (accommodationId) => {
    const response = await axios.delete(`/wishlist/${accommodationId}`);
    return response.data;
  },

  /**
   * Check if accommodation is in wishlist
   * @param {number} accommodationId - Accommodation ID
   * @returns {Promise} Response with wishlist status
   */
  isInWishlist: async (accommodationId) => {
    const response = await axios.get(`/wishlist/check/${accommodationId}`);
    return response.data;
  },

  /**
   * Toggle wishlist (add if not exists, remove if exists)
   * @param {number} accommodationId - Accommodation ID
   * @returns {Promise} Response with updated status
   */
  toggle: async (accommodationId) => {
    const response = await axios.post('/wishlist/toggle', {
      accommodation_id: accommodationId,
    });
    return response.data;
  },

  /**
   * Clear all wishlist items
   * @returns {Promise} Response confirming clearance
   */
  clear: async () => {
    const response = await axios.delete('/wishlist/clear');
    return response.data;
  },

  /**
   * Get wishlist count
   * @returns {Promise} Response with total wishlist count
   */
  getCount: async () => {
    const response = await axios.get('/wishlist/count');
    return response.data;
  },

  /**
   * Get wishlist statistics
   * @returns {Promise} Response with wishlist statistics
   */
  getStats: async () => {
    const response = await axios.get('/wishlist/stats');
    return response.data;
  },

  /**
   * Share wishlist
   * @param {Object} shareData - Share data
   * @param {string} shareData.email - Email to share with
   * @returns {Promise} Response confirming share
   */
  share: async (shareData) => {
    const response = await axios.post('/wishlist/share', shareData);
    return response.data;
  },

  /**
   * Get similar accommodations to wishlist items
   * @param {number} limit - Number of recommendations
   * @returns {Promise} Response with recommended accommodations
   */
  getRecommendations: async (limit = 5) => {
    const response = await axios.get('/wishlist/recommendations', {
      params: { limit },
    });
    return response.data;
  },
};

export default wishlistApi;