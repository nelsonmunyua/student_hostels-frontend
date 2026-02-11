import { createAsyncThunk } from "@reduxjs/toolkit";
import bookingApi from "../../../api/Bookingapi";

/**
 * Create a new booking
 */
export const createBooking = createAsyncThunk(
  "booking/create",
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookingApi.create(bookingData);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create booking";
      return rejectWithValue(message);
    }
  },
);

/**
 * Fetch all bookings (Admin)
 */
export const fetchBookings = createAsyncThunk(
  "booking/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getAll(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch bookings";
      return rejectWithValue(message);
    }
  },
);

/**
 * Fetch single booking by ID
 */
export const fetchBookingById = createAsyncThunk(
  "booking/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getById(id);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch booking details";
      return rejectWithValue(message);
    }
  },
);

/**
 * Fetch student's bookings
 */
export const fetchStudentBookings = createAsyncThunk(
  "booking/fetchStudentBookings",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getStudentBookings(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch your bookings";
      return rejectWithValue(message);
    }
  },
);

/**
 * Fetch host's bookings
 */
export const fetchHostBookings = createAsyncThunk(
  "booking/fetchHostBookings",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getHostBookings(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch bookings";
      return rejectWithValue(message);
    }
  },
);

/**
 * Update booking status
 */
export const updateBooking = createAsyncThunk(
  "booking/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.update(id, data);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to update booking";
      return rejectWithValue(message);
    }
  },
);

/**
 * Cancel booking
 */
export const cancelBooking = createAsyncThunk(
  "booking/cancel",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.cancel(id, reason);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to cancel booking";
      return rejectWithValue(message);
    }
  },
);

/**
 * Accept booking (Host)
 */
export const acceptBooking = createAsyncThunk(
  "booking/accept",
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.accept(id);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to accept booking";
      return rejectWithValue(message);
    }
  },
);

/**
 * Reject booking (Host)
 */
export const rejectBooking = createAsyncThunk(
  "booking/reject",
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.reject(id, reason);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to reject booking";
      return rejectWithValue(message);
    }
  },
);

/**
 * Check accommodation availability
 */
export const checkAvailability = createAsyncThunk(
  "booking/checkAvailability",
  async ({ accommodationId, params }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.checkAvailability(
        accommodationId,
        params,
      );
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to check availability";
      return rejectWithValue(message);
    }
  },
);

/**
 * Calculate booking price
 */
export const calculateBookingPrice = createAsyncThunk(
  "booking/calculatePrice",
  async (params, { rejectWithValue }) => {
    try {
      const response = await bookingApi.calculatePrice(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to calculate price";
      return rejectWithValue(message);
    }
  },
);

/**
 * Get booking calendar
 */
export const fetchBookingCalendar = createAsyncThunk(
  "booking/fetchCalendar",
  async ({ accommodationId, month }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getBookingCalendar(
        accommodationId,
        month,
      );
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch calendar";
      return rejectWithValue(message);
    }
  },
);

/**
 * Download booking receipt
 */
export const downloadBookingReceipt = createAsyncThunk(
  "booking/downloadReceipt",
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.downloadReceipt(id);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to download receipt";
      return rejectWithValue(message);
    }
  },
);

/**
 * Request booking modification
 */
export const requestBookingModification = createAsyncThunk(
  "booking/requestModification",
  async ({ id, modifications }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.requestModification(id, modifications);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to request modification";
      return rejectWithValue(message);
    }
  },
);

/**
 * Report booking issue
 */
export const reportBookingIssue = createAsyncThunk(
  "booking/reportIssue",
  async ({ id, issueData }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.reportIssue(id, issueData);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to report issue";
      return rejectWithValue(message);
    }
  },
);
