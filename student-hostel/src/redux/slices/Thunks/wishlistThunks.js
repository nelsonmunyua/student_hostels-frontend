import { createAsyncThunk } from '@reduxjs/toolkit';
import wishlistApi from '../../../api/Wishlistapi';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.getAll(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (accommodationId, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.add(accommodationId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (accommodationId, { rejectWithValue }) => {
    try {
      await wishlistApi.remove(accommodationId);
      return { accommodationId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from wishlist');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggle',
  async (accommodationId, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.toggle(accommodationId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle wishlist');
    }
  }
);