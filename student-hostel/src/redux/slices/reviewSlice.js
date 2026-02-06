import { createSlice } from '@reduxjs/toolkit';
import {
  fetchReviewsByAccommodation,
  createReview,
  updateReview,
  deleteReview,
  fetchMyReviews,
} from './Thunks/reviewThunks';

const initialState = {
  reviews: [],
  myReviews: [],
  currentReview: null,
  loading: false,
  error: null,
  successMessage: null,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsByAccommodation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByAccommodation.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews || [];
      })
      .addCase(fetchReviewsByAccommodation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createReview.fulfilled, (state, action) => {
        state.myReviews.push(action.payload.review);
        state.successMessage = 'Review submitted successfully';
      })
      .addCase(createReview.rejected, (state, action) => {
        state.error = action.payload;
      });

    builder
      .addCase(fetchMyReviews.fulfilled, (state, action) => {
        state.myReviews = action.payload.reviews || [];
      });

    builder
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.myReviews = state.myReviews.filter((r) => r.id !== action.payload.id);
        state.successMessage = 'Review deleted';
      });
  },
});

export const { clearError, clearSuccessMessage } = reviewSlice.actions;
export default reviewSlice.reducer;