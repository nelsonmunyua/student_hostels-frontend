import { createSlice } from "@reduxjs/toolkit";
import {
  fetchEarnings,
  fetchEarningsStats,
  withdrawFunds,
  fetchTransactions,
} from "./Thunks/earningsThunks";

const initialState = {
  earnings: {
    total_earnings: 0,
    pending_payouts: 0,
    available_balance: 0,
    total_bookings: 0,
    average_booking_value: 0,
  },
  monthlyEarnings: [],
  transactions: [],
  withdrawalStatus: {
    loading: false,
    error: null,
    success: false,
  },
  stats: {
    thisMonth: 0,
    lastMonth: 0,
    growth: 0,
  },
  loading: false,
  error: null,
};

const earningsSlice = createSlice({
  name: "earnings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWithdrawalStatus: (state) => {
      state.withdrawalStatus = {
        loading: false,
        error: null,
        success: false,
      };
    },
  },
  extraReducers: (builder) => {
    // Fetch Earnings
    builder
      .addCase(fetchEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.earnings = action.payload.earnings || state.earnings;
        state.monthlyEarnings = action.payload.monthly_earnings || [];
      })
      .addCase(fetchEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch earnings";
      });

    // Fetch Earnings Stats
    builder
      .addCase(fetchEarningsStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEarningsStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats || state.stats;
      })
      .addCase(fetchEarningsStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch stats";
      });

    // Withdraw Funds
    builder
      .addCase(withdrawFunds.pending, (state) => {
        state.withdrawalStatus = {
          loading: true,
          error: null,
          success: false,
        };
      })
      .addCase(withdrawFunds.fulfilled, (state, action) => {
        state.withdrawalStatus = {
          loading: false,
          error: null,
          success: true,
        };
        state.earnings.available_balance -= action.payload.amount;
        state.earnings.pending_payouts += action.payload.amount;
      })
      .addCase(withdrawFunds.rejected, (state, action) => {
        state.withdrawalStatus = {
          loading: false,
          error: action.payload || "Failed to process withdrawal",
          success: false,
        };
      });

    // Fetch Transactions
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload.transactions || [];
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch transactions";
      });
  },
});

export const { clearError, clearWithdrawalStatus } = earningsSlice.actions;

export default earningsSlice.reducer;
