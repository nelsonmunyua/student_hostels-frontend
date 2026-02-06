import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAccommodations,
  fetchAccommodationById,
  searchAccommodations,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
  uploadAccommodationImages,
  fetchMyListings,
  fetchFeaturedAccommodations,
} from '../thunks/accommodationThunks';

const initialState = {
  accommodations: [],
  currentAccommodation: null,
  myListings: [],
  featuredAccommodations: [],
  searchResults: [],
  filters: {
    location: '',
    property_type: '',
    min_price: 0,
    max_price: 100000,
    max_guests: 1,
    check_in: null,
    check_out: null,
  },
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  searchLoading: false,
  error: null,
  successMessage: null,
};

const accommodationSlice = createSlice({
  name: 'accommodation',
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
    // Set filters
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    // Clear filters
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    // Set pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    // Clear current accommodation
    clearCurrentAccommodation: (state) => {
      state.currentAccommodation = null;
    },
    // Clear search results
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch All Accommodations
    builder
      .addCase(fetchAccommodations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccommodations.fulfilled, (state, action) => {
        state.loading = false;
        state.accommodations = action.payload.accommodations || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 12,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(fetchAccommodations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch accommodations';
      });

    // Fetch Single Accommodation
    builder
      .addCase(fetchAccommodationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccommodationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAccommodation = action.payload.accommodation;
      })
      .addCase(fetchAccommodationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch accommodation details';
      });

    // Search Accommodations
    builder
      .addCase(searchAccommodations.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchAccommodations.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.accommodations || [];
        state.pagination = {
          page: action.payload.page || 1,
          limit: action.payload.limit || 12,
          total: action.payload.total || 0,
          totalPages: action.payload.totalPages || 0,
        };
      })
      .addCase(searchAccommodations.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload || 'Search failed';
      });

    // Create Accommodation (Host)
    builder
      .addCase(createAccommodation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAccommodation.fulfilled, (state, action) => {
        state.loading = false;
        state.myListings.push(action.payload.accommodation);
        state.successMessage = 'Accommodation created successfully';
      })
      .addCase(createAccommodation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create accommodation';
      });

    // Update Accommodation (Host)
    builder
      .addCase(updateAccommodation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAccommodation.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.myListings.findIndex(
          (item) => item.id === action.payload.accommodation.id
        );
        if (index !== -1) {
          state.myListings[index] = action.payload.accommodation;
        }
        if (state.currentAccommodation?.id === action.payload.accommodation.id) {
          state.currentAccommodation = action.payload.accommodation;
        }
        state.successMessage = 'Accommodation updated successfully';
      })
      .addCase(updateAccommodation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update accommodation';
      });

    // Delete Accommodation (Host)
    builder
      .addCase(deleteAccommodation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccommodation.fulfilled, (state, action) => {
        state.loading = false;
        state.myListings = state.myListings.filter(
          (item) => item.id !== action.payload.id
        );
        state.successMessage = 'Accommodation deleted successfully';
      })
      .addCase(deleteAccommodation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete accommodation';
      });

    // Upload Images
    builder
      .addCase(uploadAccommodationImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadAccommodationImages.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Images uploaded successfully';
      })
      .addCase(uploadAccommodationImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to upload images';
      });

    // Fetch My Listings (Host)
    builder
      .addCase(fetchMyListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.loading = false;
        state.myListings = action.payload.accommodations || [];
      })
      .addCase(fetchMyListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch listings';
      });

    // Fetch Featured Accommodations
    builder
      .addCase(fetchFeaturedAccommodations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedAccommodations.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredAccommodations = action.payload.accommodations || [];
      })
      .addCase(fetchFeaturedAccommodations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch featured accommodations';
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setFilters,
  clearFilters,
  setPagination,
  clearCurrentAccommodation,
  clearSearchResults,
} = accommodationSlice.actions;

export default accommodationSlice.reducer;