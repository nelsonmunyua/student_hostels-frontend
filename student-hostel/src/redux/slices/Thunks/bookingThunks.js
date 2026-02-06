import { createAsyncThunk } from '@reduxjs/toolkit';
import bookingApi from '../../../api/Bookingapi';

/**
 * Fetch all bookings
 */
export const fetchBookings = createAsyncThunk(
  'booking/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getAll(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch bookings';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch single booking by ID
 */
export const fetchBookingById = createAsyncThunk(
  'booking/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getById(id);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch booking details';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create new booking
 */
export const createBooking = createAsyncThunk(
  'booking/create',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await bookingApi.create(bookingData);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create booking';
      return rejectWithValue(message);
    }
  }
);

/**
 * Cancel booking
 */
export const cancelBooking = createAsyncThunk(
  'booking/cancel',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.cancel(id, { reason });
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to cancel booking';
      return rejectWithValue(message);
    }
  }
);

/**
 * Check booking availability
 */
export const checkAvailability = createAsyncThunk(
  'booking/checkAvailability',
  async (params, { rejectWithValue }) => {
    try {
      const response = await bookingApi.checkAvailability(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to check availability';
      return rejectWithValue(message);
    }
  }
);

/**
 * Calculate booking price
 */
export const calculateBookingPrice = createAsyncThunk(
  'booking/calculatePrice',
  async (params, { rejectWithValue }) => {
    try {
      const response = await bookingApi.calculatePrice(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to calculate price';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch student bookings (Student dashboard)
 */
export const fetchStudentBookings = createAsyncThunk(
  'booking/fetchStudentBookings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getStudentBookings(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch student bookings';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch host bookings (Host dashboard)
 */
export const fetchHostBookings = createAsyncThunk(
  'booking/fetchHostBookings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getHostBookings(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch host bookings';
      return rejectWithValue(message);
    }
  }
);

/**
 * Accept booking (Host only)
 */
export const acceptBooking = createAsyncThunk(
  'booking/accept',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.accept(id);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to accept booking';
      return rejectWithValue(message);
    }
  }
);

/**
 * Reject booking (Host only)
 */
export const rejectBooking = createAsyncThunk(
  'booking/reject',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const response = await bookingApi.reject(id, { reason });
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to reject booking';
      return rejectWithValue(message);
    }
  }
);

/**
 * Complete booking
 */
export const completeBooking = createAsyncThunk(
  'booking/complete',
  async (id, { rejectWithValue }) => {
    try {
      const response = await bookingApi.complete(id);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to complete booking';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get upcoming bookings
 */
export const fetchUpcomingBookings = createAsyncThunk(
  'booking/fetchUpcoming',
  async (limit = 5, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getUpcoming(limit);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch upcoming bookings';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get active bookings
 */
export const fetchActiveBookings = createAsyncThunk(
  'booking/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingApi.getActive();
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch active bookings';
      return rejectWithValue(message);
    }
  }
);