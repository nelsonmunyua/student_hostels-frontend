import { createAsyncThunk } from '@reduxjs/toolkit';
import accommodationApi from '../../../api/Accomodationapi';

/**
 * Fetch all accommodations with filters
 */
export const fetchAccommodations = createAsyncThunk(
  'accommodation/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await accommodationApi.getAll(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch accommodations';
      return rejectWithValue(message);
    }
  }
);

/**
 * Fetch single accommodation by ID
 */
export const fetchAccommodationById = createAsyncThunk(
  'accommodation/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await accommodationApi.getById(id);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch accommodation details';
      return rejectWithValue(message);
    }
  }
);

/**
 * Search accommodations
 */
export const searchAccommodations = createAsyncThunk(
  'accommodation/search',
  async (searchParams, { rejectWithValue }) => {
    try {
      const response = await accommodationApi.search(searchParams);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Search failed';
      return rejectWithValue(message);
    }
  }
);

/**
 * Create new accommodation (Host only)
 */
export const createAccommodation = createAsyncThunk(
  'accommodation/create',
  async (accommodationData, { rejectWithValue }) => {
    try {
      const response = await accommodationApi.create(accommodationData);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to create accommodation';
      return rejectWithValue(message);
    }
  }
);

/**
 * Update accommodation (Host only)
 */
export const updateAccommodation = createAsyncThunk(
  'accommodation/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await accommodationApi.update(id, data);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to update accommodation';
      return rejectWithValue(message);
    }
  }
);

/**
 * Delete accommodation (Host only)
 */
export const deleteAccommodation = createAsyncThunk(
  'accommodation/delete',
  async (id, { rejectWithValue }) => {
    try {
      await accommodationApi.delete(id);
      return { id };
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to delete accommodation';
      return rejectWithValue(message);
    }
  }
);

/**
 * Upload accommodation images
 */
export const uploadAccommodationImages = createAsyncThunk(
  'accommodation/uploadImages',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await accommodationApi.uploadImages(id, formData);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to upload images';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get host's accommodations (Host only)
 */
export const fetchMyListings = createAsyncThunk(
  'accommodation/fetchMyListings',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await accommodationApi.getMyListings(params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch listings';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get featured accommodations
 */
export const fetchFeaturedAccommodations = createAsyncThunk(
  'accommodation/fetchFeatured',
  async (limit = 6, { rejectWithValue }) => {
    try {
      const response = await accommodationApi.getFeatured(limit);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch featured accommodations';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get accommodation availability
 */
export const fetchAccommodationAvailability = createAsyncThunk(
  'accommodation/fetchAvailability',
  async ({ id, params }, { rejectWithValue }) => {
    try {
      const response = await accommodationApi.getAvailability(id, params);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch availability';
      return rejectWithValue(message);
    }
  }
);

/**
 * Get nearby accommodations
 */
export const fetchNearbyAccommodations = createAsyncThunk(
  'accommodation/fetchNearby',
  async ({ id, limit = 4 }, { rejectWithValue }) => {
    try {
      const response = await accommodationApi.getNearby(id, limit);
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to fetch nearby accommodations';
      return rejectWithValue(message);
    }
  }
);