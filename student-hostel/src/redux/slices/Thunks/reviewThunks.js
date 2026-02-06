import { createAsyncThunk } from '@reduxjs/toolkit';
import reviewApi from '../../../api/Reviewapi.api';


export const fetchReviewsByAccommodation = createAsyncThunk(
  'review/fetchByAccommodation',
  async ({ accommodationId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getByAccommodation(accommodationId, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'review/create',
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await reviewApi.create(reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create review');
    }
  }
);

export const updateReview = createAsyncThunk(
  'review/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await reviewApi.update(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'review/delete',
  async (id, { rejectWithValue }) => {
    try {
      await reviewApi.delete(id);
      return { id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete review');
    }
  }
);

export const fetchMyReviews = createAsyncThunk(
  'review/fetchMyReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await reviewApi.getMyReviews(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);