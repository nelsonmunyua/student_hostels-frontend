import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../api/axios";

/**
 * Fetch host earnings
 */
export const fetchEarnings = createAsyncThunk(
  "earnings/fetchEarnings",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/host/earnings", { params });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch earnings";
      return rejectWithValue(message);
    }
  },
);

/**
 * Fetch earnings stats
 */
export const fetchEarningsStats = createAsyncThunk(
  "earnings/fetchStats",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/host/earnings/stats", { params });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch earnings stats";
      return rejectWithValue(message);
    }
  },
);

/**
 * Withdraw funds
 */
export const withdrawFunds = createAsyncThunk(
  "earnings/withdraw",
  async ({ amount, payment_method }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/host/earnings/withdraw", {
        amount,
        payment_method,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to process withdrawal";
      return rejectWithValue(message);
    }
  },
);

/**
 * Fetch transactions
 */
export const fetchTransactions = createAsyncThunk(
  "earnings/fetchTransactions",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/host/earnings/transactions", {
        params,
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch transactions";
      return rejectWithValue(message);
    }
  },
);

/**
 * Get payout methods
 */
export const fetchPayoutMethods = createAsyncThunk(
  "earnings/fetchPayoutMethods",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/host/earnings/payout-methods");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch payout methods";
      return rejectWithValue(message);
    }
  },
);

/**
 * Add payout method
 */
export const addPayoutMethod = createAsyncThunk(
  "earnings/addPayoutMethod",
  async (methodData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/host/earnings/payout-methods",
        methodData,
      );
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to add payout method";
      return rejectWithValue(message);
    }
  },
);

/**
 * Delete payout method
 */
export const deletePayoutMethod = createAsyncThunk(
  "earnings/deletePayoutMethod",
  async (methodId, { rejectWithValue }) => {
    try {
      await axios.delete(`/host/earnings/payout-methods/${methodId}`);
      return { methodId };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to delete payout method";
      return rejectWithValue(message);
    }
  },
);
