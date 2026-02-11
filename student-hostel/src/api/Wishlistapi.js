import axios from "./axios";

/**
 * Wishlist API Service
 * Handles all wishlist-related API calls
 */

const wishlistApi = {
  /**
   * Get user's wishlist
   * @returns {Promise} Response with wishlist items
   */
  getWishlist: async () => {
    const response = await axios.get("/wishlist");
    return response.data;
  },

  /**
   * Add accommodation to wishlist
   * @param {number} accommodationId - Accommodation ID
   * @returns {Promise} Response with updated wishlist
   */
  addToWishlist: async (accommodationId) => {
    const response = await axios.post("/wishlist", {
      accommodation_id: accommodationId,
    });
    return response.data;
  },

  /**
   * Remove accommodation from wishlist
   * @param {number} accommodationId - Accommodation ID
   * @returns {Promise} Response with updated wishlist
   */
  removeFromWishlist: async (accommodationId) => {
    const response = await axios.delete(`/wishlist/${accommodationId}`);
    return response.data;
  },

  /**
   * Check if accommodation is in wishlist
   * @param {number} accommodationId - Accommodation ID
   * @returns {Promise} Response with wishlist status
   */
  checkInWishlist: async (accommodationId) => {
    const response = await axios.get(`/wishlist/check/${accommodationId}`);
    return response.data;
  },

  /**
   * Clear all wishlist items
   * @returns {Promise} Response confirming clear
   */
  clearWishlist: async () => {
    const response = await axios.delete("/wishlist/clear");
    return response.data;
  },

  /**
   * Move wishlist item to booking
   * @param {number} accommodationId - Accommodation ID
   * @param {Object} bookingData - Booking details
   * @returns {Promise} Response with created booking
   */
  moveToBooking: async (accommodationId, bookingData) => {
    const response = await axios.post(
      `/wishlist/${accommodationId}/book`,
      bookingData,
    );
    return response.data;
  },
};

export default wishlistApi;
