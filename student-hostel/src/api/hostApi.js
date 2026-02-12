import axios from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const hostApi = {
  /**
   * Get host dashboard overview statistics
   * @returns {Promise} Dashboard statistics
   */
  getDashboard: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/dashboard`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Get host profile
   * @returns {Promise} Host profile data
   */
  getProfile: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/profile`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Update host profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Updated profile
   */
  updateProfile: async (profileData) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/host/profile`,
      profileData,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== LISTINGS MANAGEMENT ====================

  /**
   * Get all hostels for the logged-in host
   * @returns {Promise} List of hostels
   */
  getListings: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/listings`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Create a new hostel
   * @param {Object} hostelData - Hostel data
   * @returns {Promise} Created hostel
   */
  createListing: async (hostelData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/host/listings`,
      hostelData,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Get specific hostel details
   * @param {number} hostelId - Hostel ID
   * @returns {Promise} Hostel details
   */
  getListingDetail: async (hostelId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/listings/${hostelId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Update hostel details
   * @param {number} hostelId - Hostel ID
   * @param {Object} hostelData - Updated hostel data
   * @returns {Promise} Updated hostel
   */
  updateListing: async (hostelId, hostelData) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/host/listings/${hostelId}`,
      hostelData,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Delete a hostel
   * @param {number} hostelId - Hostel ID
   * @returns {Promise} Delete confirmation
   */
  deleteListing: async (hostelId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/host/listings/${hostelId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Toggle hostel active status
   * @param {number} hostelId - Hostel ID
   * @returns {Promise} Updated status
   */
  toggleListingStatus: async (hostelId) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/host/listings/${hostelId}`,
      {},
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== ROOMS MANAGEMENT ====================

  /**
   * Get rooms for a specific hostel
   * @param {number} hostelId - Hostel ID
   * @returns {Promise} List of rooms
   */
  getRooms: async (hostelId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/rooms/${hostelId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Add a room to a hostel
   * @param {number} hostelId - Hostel ID
   * @param {Object} roomData - Room data
   * @returns {Promise} Created room
   */
  addRoom: async (hostelId, roomData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/host/rooms/${hostelId}`,
      roomData,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Update room details
   * @param {number} hostelId - Hostel ID
   * @param {number} roomId - Room ID
   * @param {Object} roomData - Updated room data
   * @returns {Promise} Updated room
   */
  updateRoom: async (hostelId, roomId, roomData) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/host/rooms/${hostelId}/${roomId}`,
      roomData,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Delete a room
   * @param {number} hostelId - Hostel ID
   * @param {number} roomId - Room ID
   * @returns {Promise} Delete confirmation
   */
  deleteRoom: async (hostelId, roomId) => {
    const token = localStorage.getItem("token");
    const response = await axios.delete(
      `${API_BASE_URL}/host/rooms/${hostelId}/${roomId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== BOOKINGS MANAGEMENT ====================

  /**
   * Get all bookings for host's properties
   * @returns {Promise} List of bookings
   */
  getBookings: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/bookings`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Get specific booking details
   * @param {number} bookingId - Booking ID
   * @returns {Promise} Booking details
   */
  getBookingDetail: async (bookingId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/bookings/${bookingId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Update booking status
   * @param {number} bookingId - Booking ID
   * @param {string} status - New status
   * @returns {Promise} Updated booking
   */
  updateBookingStatus: async (bookingId, status) => {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${API_BASE_URL}/host/bookings/${bookingId}`,
      { status },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== EARNINGS MANAGEMENT ====================

  /**
   * Get host earnings
   * @returns {Promise} Earnings data
   */
  getEarnings: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/earnings`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== REVIEWS MANAGEMENT ====================

  /**
   * Get reviews for host's properties
   * @returns {Promise} List of reviews
   */
  getReviews: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/reviews`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== NOTIFICATIONS MANAGEMENT ====================

  /**
   * Get host notifications
   * @returns {Promise} List of notifications
   */
  getNotifications: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/notifications`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} Success message
   */
  markNotificationsRead: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/host/notifications`,
      {},
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Mark specific notification as read
   * @param {number} notificationId - Notification ID
   * @returns {Promise} Success message
   */
  markNotificationRead: async (notificationId) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${API_BASE_URL}/host/notifications/${notificationId}`,
      {},
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== VERIFICATION MANAGEMENT ====================

  /**
   * Get verification status
   * @returns {Promise} Verification status
   */
  getVerificationStatus: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/verification`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Submit verification request
   * @param {Object} verificationData - Verification data
   * @returns {Promise} Submission result
   */
  submitVerification: async (verificationData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/host/verification`,
      verificationData,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== SUPPORT MANAGEMENT ====================

  /**
   * Create support ticket
   * @param {Object} ticketData - Ticket data
   * @returns {Promise} Created ticket
   */
  createSupportTicket: async (ticketData) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/host/support`,
      ticketData,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Get support tickets
   * @returns {Promise} List of tickets
   */
  getSupportTickets: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/support`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== ANALYTICS MANAGEMENT ====================

  /**
   * Get host analytics
   * @returns {Promise} Analytics data
   */
  getAnalytics: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/analytics`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  // ==================== AVAILABILITY MANAGEMENT ====================

  /**
   * Get all hostels with rooms and availability
   * @returns {Promise} Hostels with availability data
   */
  getAvailability: async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/availability`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Get specific hostel availability
   * @param {number} hostelId - Hostel ID
   * @returns {Promise} Hostel availability data
   */
  getHostelAvailability: async (hostelId) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/availability/${hostelId}`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Get room availability for a date range
   * @param {number} roomId - Room ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} Room availability data
   */
  getRoomAvailability: async (roomId, startDate, endDate) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/availability/room/${roomId}`,
      { 
        params: { start_date: startDate, end_date: endDate },
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      }
    );
    return response.data;
  },

  /**
   * Update availability for a specific room and date
   * @param {number} roomId - Room ID
   * @param {string} date - Date (YYYY-MM-DD)
   * @param {boolean} isAvailable - Whether the room is available
   * @returns {Promise} Updated availability
   */
  updateAvailability: async (roomId, date, isAvailable) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/host/availability/room/${roomId}`,
      { date, is_available: isAvailable },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Bulk update availability for multiple dates
   * @param {number} roomId - Room ID
   * @param {Array} dates - Array of dates (YYYY-MM-DD)
   * @param {boolean} isAvailable - Whether the rooms are available
   * @returns {Promise} Bulk update result
   */
  bulkUpdateAvailability: async (roomId, dates, isAvailable) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/host/availability/room/${roomId}/bulk`,
      { dates, is_available: isAvailable },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Get availability calendar for a hostel
   * @param {number} hostelId - Hostel ID
   * @param {string} yearMonth - Year and month (YYYY-MM)
   * @returns {Promise} Calendar data with availability
   */
  getAvailabilityCalendar: async (hostelId, yearMonth) => {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_BASE_URL}/host/availability/${hostelId}/calendar`,
      { 
        params: { year_month: yearMonth },
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      }
    );
    return response.data;
  },

  /**
   * Block a date range for a room (mark as unavailable)
   * @param {number} roomId - Room ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {string} reason - Reason for blocking (optional)
   * @returns {Promise} Block result
   */
  blockDateRange: async (roomId, startDate, endDate, reason = '') => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/host/availability/room/${roomId}/block`,
      { start_date: startDate, end_date: endDate, reason },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },

  /**
   * Unblock a date range for a room
   * @param {number} roomId - Room ID
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise} Unblock result
   */
  unblockDateRange: async (roomId, startDate, endDate) => {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/host/availability/room/${roomId}/unblock`,
      { start_date: startDate, end_date: endDate },
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return response.data;
  },
};

export default hostApi;
