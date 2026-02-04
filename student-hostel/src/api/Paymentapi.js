import axios from './axios';

/**
 * Payment API Service
 * Handles all payment-related API calls
 */

const paymentApi = {
  /**
   * Initialize payment
   * @param {Object} paymentData - Payment initialization data
   * @param {number} paymentData.booking_id - Booking ID
   * @param {number} paymentData.amount - Payment amount
   * @param {string} paymentData.payment_method - Payment method (card, mpesa, stripe)
   * @returns {Promise} Response with payment initialization data
   */
  initializePayment: async (paymentData) => {
    const response = await axios.post('/payments/initialize', paymentData);
    return response.data;
  },

  /**
   * Process Stripe payment
   * @param {Object} paymentData - Stripe payment data
   * @param {number} paymentData.booking_id - Booking ID
   * @param {string} paymentData.payment_intent_id - Stripe payment intent ID
   * @returns {Promise} Response with payment result
   */
  processStripePayment: async (paymentData) => {
    const response = await axios.post('/payments/stripe', paymentData);
    return response.data;
  },

  /**
   * Process M-Pesa payment
   * @param {Object} paymentData - M-Pesa payment data
   * @param {number} paymentData.booking_id - Booking ID
   * @param {string} paymentData.phone_number - M-Pesa phone number
   * @param {number} paymentData.amount - Payment amount
   * @returns {Promise} Response with M-Pesa STK push result
   */
  processMpesaPayment: async (paymentData) => {
    const response = await axios.post('/payments/mpesa', paymentData);
    return response.data;
  },

  /**
   * Process card payment
   * @param {Object} paymentData - Card payment data
   * @param {number} paymentData.booking_id - Booking ID
   * @param {Object} paymentData.card_details - Card details
   * @returns {Promise} Response with payment result
   */
  processCardPayment: async (paymentData) => {
    const response = await axios.post('/payments/card', paymentData);
    return response.data;
  },

  /**
   * Verify payment status
   * @param {number} paymentId - Payment ID
   * @returns {Promise} Response with payment status
   */
  verifyPayment: async (paymentId) => {
    const response = await axios.get(`/payments/${paymentId}/verify`);
    return response.data;
  },

  /**
   * Get payment by ID
   * @param {number} id - Payment ID
   * @returns {Promise} Response with payment details
   */
  getById: async (id) => {
    const response = await axios.get(`/payments/${id}`);
    return response.data;
  },

  /**
   * Get payment by booking ID
   * @param {number} bookingId - Booking ID
   * @returns {Promise} Response with payment details
   */
  getByBookingId: async (bookingId) => {
    const response = await axios.get(`/payments/booking/${bookingId}`);
    return response.data;
  },

  /**
   * Get all payments for current user
   * @param {Object} params - Query parameters
   * @param {string} params.status - Filter by status (paid, pending, failed)
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @returns {Promise} Response with payments list
   */
  getAll: async (params = {}) => {
    const response = await axios.get('/payments', { params });
    return response.data;
  },

  /**
   * Request refund
   * @param {number} paymentId - Payment ID
   * @param {Object} refundData - Refund request data
   * @param {string} refundData.reason - Refund reason
   * @param {number} refundData.amount - Refund amount (optional, defaults to full amount)
   * @returns {Promise} Response with refund request status
   */
  requestRefund: async (paymentId, refundData) => {
    const response = await axios.post(`/payments/${paymentId}/refund`, refundData);
    return response.data;
  },

  /**
   * Get Stripe client secret for payment intent
   * @param {Object} data - Payment intent data
   * @param {number} data.booking_id - Booking ID
   * @param {number} data.amount - Payment amount
   * @returns {Promise} Response with Stripe client secret
   */
  getStripeClientSecret: async (data) => {
    const response = await axios.post('/payments/stripe/client-secret', data);
    return response.data;
  },

  /**
   * Confirm Stripe payment
   * @param {Object} data - Stripe confirmation data
   * @param {string} data.payment_intent_id - Stripe payment intent ID
   * @param {number} data.booking_id - Booking ID
   * @returns {Promise} Response with payment confirmation
   */
  confirmStripePayment: async (data) => {
    const response = await axios.post('/payments/stripe/confirm', data);
    return response.data;
  },

  /**
   * Check M-Pesa payment status
   * @param {string} checkoutRequestId - M-Pesa checkout request ID
   * @returns {Promise} Response with M-Pesa payment status
   */
  checkMpesaStatus: async (checkoutRequestId) => {
    const response = await axios.get(`/payments/mpesa/status/${checkoutRequestId}`);
    return response.data;
  },

  /**
   * Get payment methods for user
   * @returns {Promise} Response with saved payment methods
   */
  getPaymentMethods: async () => {
    const response = await axios.get('/payments/methods');
    return response.data;
  },

  /**
   * Save payment method
   * @param {Object} methodData - Payment method data
   * @returns {Promise} Response with saved payment method
   */
  savePaymentMethod: async (methodData) => {
    const response = await axios.post('/payments/methods', methodData);
    return response.data;
  },

  /**
   * Delete payment method
   * @param {number} methodId - Payment method ID
   * @returns {Promise} Response confirming deletion
   */
  deletePaymentMethod: async (methodId) => {
    const response = await axios.delete(`/payments/methods/${methodId}`);
    return response.data;
  },

  /**
   * Get payment statistics (Dashboard)
   * @returns {Promise} Response with payment statistics
   */
  getStats: async () => {
    const response = await axios.get('/payments/stats');
    return response.data;
  },

  /**
   * Download payment receipt
   * @param {number} paymentId - Payment ID
   * @returns {Promise} Response with receipt data/URL
   */
  downloadReceipt: async (paymentId) => {
    const response = await axios.get(`/payments/${paymentId}/receipt`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Webhook handler for payment confirmation (Backend use)
   * @param {Object} webhookData - Webhook data from payment provider
   * @returns {Promise} Response confirming webhook processing
   */
  handleWebhook: async (webhookData) => {
    const response = await axios.post('/payments/webhook', webhookData);
    return response.data;
  },
};

export default paymentApi;