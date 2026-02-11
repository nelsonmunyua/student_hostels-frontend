import axios from "./axios";

/**
 * Payment API Service
 * Handles all payment-related API calls
 */

const paymentApi = {
  /**
   * Create a payment intent for Stripe
   * @param {Object} data - Payment data
   * @returns {Promise} Response with client secret
   */
  getStripeClientSecret: async (data) => {
    const response = await axios.post("/payments/stripe/create-intent", data);
    return response.data;
  },

  /**
   * Process Stripe payment
   * @param {Object} data - Payment data
   * @returns {Promise} Response with payment result
   */
  processStripePayment: async (data) => {
    const response = await axios.post("/payments/stripe/process", data);
    return response.data;
  },

  /**
   * Confirm Stripe payment
   * @param {Object} data - Payment confirmation data
   * @returns {Promise} Response with confirmation
   */
  confirmStripePayment: async (data) => {
    const response = await axios.post("/payments/stripe/confirm", data);
    return response.data;
  },

  /**
   * Initiate M-Pesa STK Push
   * @param {Object} data - Payment data
   * @returns {Promise} Response with payment request
   */
  initiateMpesaPayment: async (data) => {
    const response = await axios.post("/payments/mpesa/stkpush", data);
    return response.data;
  },

  /**
   * Check M-Pesa payment status
   * @param {string} transactionId - Transaction ID
   * @returns {Promise} Response with payment status
   */
  checkMpesaStatus: async (transactionId) => {
    const response = await axios.get(`/payments/mpesa/status/${transactionId}`);
    return response.data;
  },

  /**
   * Process M-Pesa callback
   * @param {Object} data - Callback data
   * @returns {Promise} Response with processed callback
   */
  processMpesaCallback: async (data) => {
    const response = await axios.post("/payments/mpesa/callback", data);
    return response.data;
  },

  /**
   * Get all payments/transactions
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with payments list
   */
  getAllPayments: async (params = {}) => {
    const response = await axios.get("/payments", { params });
    return response.data;
  },

  /**
   * Get single payment by ID
   * @param {number} id - Payment ID
   * @returns {Promise} Response with payment details
   */
  getPaymentById: async (id) => {
    const response = await axios.get(`/payments/${id}`);
    return response.data;
  },

  /**
   * Get user's payment history
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with user's payments
   */
  getUserPayments: async (params = {}) => {
    const response = await axios.get("/payments/my-payments", { params });
    return response.data;
  },

  /**
   * Request refund
   * @param {number} paymentId - Payment ID
   * @param {Object} data - Refund data
   * @returns {Promise} Response with refund request
   */
  requestRefund: async (paymentId, data) => {
    const response = await axios.post(`/payments/${paymentId}/refund`, data);
    return response.data;
  },

  /**
   * Get refund status
   * @param {number} paymentId - Payment ID
   * @returns {Promise} Response with refund status
   */
  getRefundStatus: async (paymentId) => {
    const response = await axios.get(`/payments/${paymentId}/refund`);
    return response.data;
  },

  /**
   * Get host payouts
   * @param {Object} params - Query parameters
   * @returns {Promise} Response with host payouts
   */
  getHostPayouts: async (params = {}) => {
    const response = await axios.get("/payments/host-payouts", { params });
    return response.data;
  },

  /**
   * Request payout (Host)
   * @param {Object} data - Payout request data
   * @returns {Promise} Response with payout request
   */
  requestPayout: async (data) => {
    const response = await axios.post("/payments/payout", data);
    return response.data;
  },

  /**
   * Get wallet balance (Host)
   * @returns {Promise} Response with wallet balance
   */
  getWalletBalance: async () => {
    const response = await axios.get("/payments/wallet-balance");
    return response.data;
  },

  /**
   * Process refund (Admin)
   * @param {number} paymentId - Payment ID
   * @param {Object} data - Refund processing data
   * @returns {Promise} Response with processed refund
   */
  processRefund: async (paymentId, data) => {
    const response = await axios.post(
      `/payments/${paymentId}/process-refund`,
      data,
    );
    return response.data;
  },
};

export default paymentApi;
