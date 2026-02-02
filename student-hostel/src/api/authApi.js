import axios from './axios';

const authApi = {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @param {string} userData.first_name - User's first name
   * @param {string} userData.last_name - User's last name
   * @param {string} userData.email - User's email
   * @param {string} userData.password - User's password
   * @param {string} userData.phone - User's phone number
   * @param {string} userData.role - User role (student, host, admin)
   * @returns {Promise} Response with user data and token
   */
  signup: async (userData) => {
    const response = await axios.post('/auth/signup', userData);
    return response.data;
  },

  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User's email
   * @param {string} credentials.password - User's password
   * @returns {Promise} Response with user data and token
   */
  login: async (credentials) => {
    const response = await axios.post('/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout user
   * @returns {Promise} Response confirming logout
   */
  logout: async () => {
    const response = await axios.post('/auth/logout');
    return response.data;
  },

  /**
   * Request password reset
   * @param {Object} data - Email data
   * @param {string} data.email - User's email
   * @returns {Promise} Response confirming reset email sent
   */
  forgotPassword: async (data) => {
    const response = await axios.post('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   * @param {Object} data - Reset password data
   * @param {string} data.token - Reset token from email
   * @param {string} data.password - New password
   * @returns {Promise} Response confirming password reset
   */
  resetPassword: async (data) => {
    const response = await axios.post('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Verify email with token
   * @param {Object} data - Verification data
   * @param {string} data.token - Verification token from email
   * @returns {Promise} Response confirming email verification
   */
  verifyEmail: async (data) => {
    const response = await axios.post('/auth/verify-email', data);
    return response.data;
  },

  /**
   * Get current user profile
   * @returns {Promise} Response with user profile data
   */
  getCurrentUser: async () => {
    const response = await axios.get('/auth/me');
    return response.data;
  },

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   * @returns {Promise} Response with updated user data
   */
  updateProfile: async (userData) => {
    const response = await axios.put('/auth/profile', userData);
    return response.data;
  },

  /**
   * Change password
   * @param {Object} data - Password change data
   * @param {string} data.old_password - Current password
   * @param {string} data.new_password - New password
   * @returns {Promise} Response confirming password change
   */
  changePassword: async (data) => {
    const response = await axios.post('/auth/change-password', data);
    return response.data;
  },

  /**
   * Refresh authentication token
   * @returns {Promise} Response with new token
   */
  refreshToken: async () => {
    const response = await axios.post('/auth/refresh-token');
    return response.data;
  },
};

export default authApi;