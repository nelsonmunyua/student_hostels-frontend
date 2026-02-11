import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
} from "./Thunks/wishlistThunks";

const initialState = {
  items: [],
  wishlistAccommodations: [],
  loading: false,
  error: null,
  successMessage: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearAll: (state) => {
      state.items = [];
      state.wishlistAccommodations = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Wishlist
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.wishlist || action.payload || [];
        state.wishlistAccommodations = action.payload.accommodations || [];
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch wishlist";
      });

    // Add to Wishlist
    builder
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.wishlistItem);
        if (action.payload.accommodation) {
          state.wishlistAccommodations.push(action.payload.accommodation);
        }
        state.successMessage = "Added to wishlist";
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add to wishlist";
      });

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload.accommodation_id || action.payload.id;
        state.items = state.items.filter(
          (item) => item.accommodation_id !== id && item.id !== id,
        );
        state.wishlistAccommodations = state.wishlistAccommodations.filter(
          (acc) => acc.id !== id,
        );
        state.successMessage = "Removed from wishlist";
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to remove from wishlist";
      });

    // Toggle Wishlist
    builder
      .addCase(toggleWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.added) {
          state.items.push(action.payload.wishlistItem);
          if (action.payload.accommodation) {
            state.wishlistAccommodations.push(action.payload.accommodation);
          }
          state.successMessage = "Added to wishlist";
        } else {
          const id = action.payload.accommodationId;
          state.items = state.items.filter(
            (item) => item.accommodation_id !== id && item.id !== id,
          );
          state.wishlistAccommodations = state.wishlistAccommodations.filter(
            (acc) => acc.id !== id,
          );
          state.successMessage = "Removed from wishlist";
        }
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to toggle wishlist";
      });
  },
});

export const { clearError, clearSuccessMessage, clearAll } =
  wishlistSlice.actions;
export default wishlistSlice.reducer;
