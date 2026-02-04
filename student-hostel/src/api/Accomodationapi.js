import axios from './axios';

/**
 * Accommodation API Service
 * Handles all accommodation-related API calls
 */

const accommodationApi = {
  /**
   * Get all accommodations with filters
   * @param {Object} params - Query parameters
   * @param {string} params.location - Filter by location
   * @param {string} params.property_type - Filter by type (hostel, bedsitter, apartment)
   * @param {number} params.min_price - Minimum price per night
   * @param {number} params.max_price - Maximum price per night
   * @param {number} params.max_guests - Maximum number of guests
   * @param {number} params.page - Page number for pagination
   * @param {number} params.limit - Items per page
   * @returns {Promise} Response with accommodations list
   */
  getAll: async (params = {}) => {
    const response = await axios.get('/accommodations', { params });
    return response.data;
  },

  /**
   * Get single accommodation by ID
   * @param {number} id - Accommodation ID
   * @returns {Promise} Response with accommodation details
   */
  getById: async (id) => {
    const response = await axios.get(`/accommodations/${id}`);
    return response.data;
  },

  /**
   * Search accommodations
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.query - Search query
   * @param {string} searchParams.location - Location filter
   * @param {Date} searchParams.check_in - Check-in date
   * @param {Date} searchParams.check_out - Check-out date
   * @param {number} searchParams.guests - Number of guests
   * @returns {Promise} Response with search results
   */
  search: async (searchParams) => {
    const response = await axios.post('/accommodations/search', searchParams);
    return response.data;
  },

  /**
   * Create new accommodation (Host only)
   * @param {Object} accommodationData - Accommodation data
   * @param {string} accommodationData.title - Accommodation title
   * @param {string} accommodationData.description - Description
   * @param {string} accommodationData.location - Location
   * @param {string} accommodationData.latitude - Latitude coordinate
   * @param {string} accommodationData.longitude - Longitude coordinate
   * @param {number} accommodationData.price_per_night - Price per night
   * @param {number} accommodationData.max_guests - Maximum guests
   * @param {string} accommodationData.property_type - Type (hostel, bedsitter, apartment)
   * @returns {Promise} Response with created accommodation
   */
  create: async (accommodationData) => {
    const response = await axios.post('/accommodations', accommodationData);
    return response.data;
  },

  /**
   * Update accommodation (Host only)
   * @param {number} id - Accommodation ID
   * @param {Object} accommodationData - Updated accommodation data
   * @returns {Promise} Response with updated accommodation
   */
  update: async (id, accommodationData) => {
    const response = await axios.put(`/accommodations/${id}`, accommodationData);
    return response.data;
  },

  /**
   * Delete accommodation (Host only)
   * @param {number} id - Accommodation ID
   * @returns {Promise} Response confirming deletion
   */
  delete: async (id) => {
    const response = await axios.delete(`/accommodations/${id}`);
    return response.data;
  },

  /**
   * Upload accommodation images
   * @param {number} id - Accommodation ID
   * @param {FormData} formData - Form data with images
   * @returns {Promise} Response with uploaded image URLs
   */
  uploadImages: async (id, formData) => {
    const response = await axios.post(
      `/accommodations/${id}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  /**
   * Delete accommodation image
   * @param {number} accommodationId - Accommodation ID
   * @param {number} imageId - Image ID
   * @returns {Promise} Response confirming deletion
   */
  deleteImage: async (accommodationId, imageId) => {
    const response = await axios.delete(
      `/accommodations/${accommodationId}/images/${imageId}`
    );
    return response.data;
  },

  /**
   * Get accommodation availability
   * @param {number} id - Accommodation ID
   * @param {Object} params - Date range parameters
   * @param {Date} params.start_date - Start date
   * @param {Date} params.end_date - End date
   * @returns {Promise} Response with availability data
   */
  getAvailability: async (id, params) => {
    const response = await axios.get(`/accommodations/${id}/availability`, { params });
    return response.data;
  },

  /**
   * Update accommodation availability (Host only)
   * @param {number} id - Accommodation ID
   * @param {Object} availabilityData - Availability data
   * @param {Date} availabilityData.date - Date
   * @param {boolean} availabilityData.is_available - Availability status
   * @returns {Promise} Response confirming update
   */
  updateAvailability: async (id, availabilityData) => {
    const response = await axios.post(
      `/accommodations/${id}/availability`,
      availabilityData
    );
    return response.data;
  },

  /**
   * Get host's accommodations (Host only)
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with host's accommodations
   */
  getMyListings: async (params = {}) => {
    const response = await axios.get('/host/accommodations', { params });
    return response.data;
  },

  /**
   * Get accommodation reviews
   * @param {number} id - Accommodation ID
   * @returns {Promise} Response with reviews
   */
  getReviews: async (id) => {
    const response = await axios.get(`/accommodations/${id}/reviews`);
    return response.data;
  },

  /**
   * Get featured accommodations
   * @param {number} limit - Number of featured items
   * @returns {Promise} Response with featured accommodations
   */
  getFeatured: async (limit = 6) => {
    const response = await axios.get('/accommodations/featured', {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get nearby accommodations
   * @param {number} id - Accommodation ID
   * @param {number} limit - Number of nearby items
   * @returns {Promise} Response with nearby accommodations
   */
  getNearby: async (id, limit = 4) => {
    const response = await axios.get(`/accommodations/${id}/nearby`, {
      params: { limit },
    });
    return response.data;
  },
};

export default accommodationApi;