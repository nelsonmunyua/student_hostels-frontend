import { createSlice } from '@reduxjs/toolkit';
import {
  fetchBookings,
  fetchBookingById,
  createBooking,
  cancelBooking,
  checkAvailability,
  calculateBookingPrice,
  fetchStudentBookings,
  fetchHostBookings,
  acceptBooking,
  rejectBooking,
} from './Thunks/bookingThunks';

const initialState = {
  bookings: [],
  currentBooking: null,
  studentBookings: [],
  hostBookings: [],
  availability: null,
  priceCalculation: null,
  loading: false,
  availabilityLoading: false,
  priceLoading: false,
  error: null,
  successMessage: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    // Clear error messages
    clearError: (state) => {
      state.error = null;
    },
    // Clear success messages
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    // Clear current booking
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
    // Clear availability
    clearAvailability: (state) => {
      state.availability = null;
    },
    // Clear price calculation
    clearPriceCalculation: (state) => {
      state.priceCalculation = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Bookings
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings || [];
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch bookings';
      });

    // Fetch Single Booking
    builder
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch booking details';
      });

    // Create Booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking;
        state.bookings.push(action.payload.booking);
        state.successMessage = 'Booking created successfully';
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create booking';
      });

    // Cancel Booking
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.booking.id
        );
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        if (state.currentBooking?.id === action.payload.booking.id) {
          state.currentBooking = action.payload.booking;
        }
        state.successMessage = 'Booking cancelled successfully';
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to cancel booking';
      });

    // Check Availability
    builder
      .addCase(checkAvailability.pending, (state) => {
        state.availabilityLoading = true;
        state.error = null;
      })
      .addCase(checkAvailability.fulfilled, (state, action) => {
        state.availabilityLoading = false;
        state.availability = action.payload;
      })
      .addCase(checkAvailability.rejected, (state, action) => {
        state.availabilityLoading = false;
        state.error = action.payload || 'Failed to check availability';
      });

    // Calculate Price
    builder
      .addCase(calculateBookingPrice.pending, (state) => {
        state.priceLoading = true;
        state.error = null;
      })
      .addCase(calculateBookingPrice.fulfilled, (state, action) => {
        state.priceLoading = false;
        state.priceCalculation = action.payload;
      })
      .addCase(calculateBookingPrice.rejected, (state, action) => {
        state.priceLoading = false;
        state.error = action.payload || 'Failed to calculate price';
      });

    // Fetch Student Bookings
    builder
      .addCase(fetchStudentBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.studentBookings = action.payload.bookings || [];
      })
      .addCase(fetchStudentBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch student bookings';
      });

    // Fetch Host Bookings
    builder
      .addCase(fetchHostBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHostBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.hostBookings = action.payload.bookings || [];
      })
      .addCase(fetchHostBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch host bookings';
      });

    // Accept Booking (Host)
    builder
      .addCase(acceptBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.hostBookings.findIndex(
          (booking) => booking.id === action.payload.booking.id
        );
        if (index !== -1) {
          state.hostBookings[index] = action.payload.booking;
        }
        state.successMessage = 'Booking accepted successfully';
      })
      .addCase(acceptBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to accept booking';
      });

    // Reject Booking (Host)
    builder
      .addCase(rejectBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.hostBookings.findIndex(
          (booking) => booking.id === action.payload.booking.id
        );
        if (index !== -1) {
          state.hostBookings[index] = action.payload.booking;
        }
        state.successMessage = 'Booking rejected';
      })
      .addCase(rejectBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to reject booking';
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  clearCurrentBooking,
  clearAvailability,
  clearPriceCalculation,
} = bookingSlice.actions;

export default bookingSlice.reducer;