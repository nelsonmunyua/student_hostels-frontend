import { createSlice } from '@reduxjs/toolkit';
import { fetchWishlist, addToWishlist, removeFromWishlist, toggleWishlist } from './Thunks/wishlistThunks';

const initialState = {
  items: [],
  loading: false,
  error: null,
  successMessage: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null; },
    clearSuccessMessage: (state) => { state.successMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload.wishlist || [];
      });
    builder
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items.push(action.payload.item);
        state.successMessage = 'Added to wishlist';
      });
    builder
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.accommodation_id !== action.payload.accommodationId);
        state.successMessage = 'Removed from wishlist';
      });
    builder
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        if (action.payload.added) {
          state.items.push(action.payload.item);
        } else {
          state.items = state.items.filter(item => item.accommodation_id !== action.payload.accommodationId);
        }
      });
  },
});

export const { clearError, clearSuccessMessage } = wishlistSlice.actions;
export default wishlistSlice.reducer;