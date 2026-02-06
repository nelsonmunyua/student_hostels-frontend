import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updateProfile,
  changePassword,
} from "./Thunks/authThunks";

// Get user from localStorage on initialization
const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error("Error parsing stored user:", error);
  }
  return null;
};

// Check if there's a token in localStorage
const hasToken = !!localStorage.getItem("token");

const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem("token") || null,
  isAuthenticated: hasToken,
  // CRITICAL FIX: loading should NEVER be true on initial load
  // The auth check happens asynchronously - don't block the UI
  loading: false,
  error: null,
  successMessage: null,
  isEmailVerified: getStoredUser()?.is_verified || false,
};

const authSlice = createSlice({
  name: "auth",
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
    // Set credentials from localStorage on app init
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isEmailVerified = user?.is_verified || false;
      state.loading = false;
    },
    // Clear all auth state
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.successMessage = null;
      state.isEmailVerified = false;
      state.loading = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isEmailVerified = action.payload.user.is_verified;
        state.error = null;
        // Store in localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      });

    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isEmailVerified = action.payload.user.is_verified;
        state.successMessage =
          "Account created successfully! Please verify your email.";
        // Store in localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isEmailVerified = false;
        state.successMessage = "Logged out successfully";
        // Clear localStorage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // Even if logout fails on server, clear local state
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isEmailVerified = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });

    // Get Current User
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.isEmailVerified = action.payload.user.is_verified;
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Only clear auth state for actual authentication failures
        // NOT for the case when we're just checking and there's no token yet
        const errorMessage = action.payload?.toLowerCase() || "";
        const isAuthFailure = 
          errorMessage.includes("unauthorized") ||
          errorMessage.includes("invalid token") ||
          errorMessage.includes("expired token") ||
          errorMessage.includes("jwt") ||
          errorMessage.includes("authentication failed") ||
          errorMessage.includes("invalid authentication") ||
          errorMessage.includes("user not found");
        
        // If it's "No token found" or similar, this is expected for unauthenticated users
        // We don't clear auth state in this case - we just stop loading
        const isNoToken = 
          errorMessage.includes("no token");
        
        if (isAuthFailure && !isNoToken) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
          state.isEmailVerified = false;
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Password reset email sent successfully";
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send reset email";
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Password reset successfully";
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reset password";
      });

    // Verify Email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.isEmailVerified = true;
        state.successMessage =
          action.payload.message || "Email verified successfully";
        // Update user verification status
        if (state.user) {
          state.user.is_verified = true;
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Email verification failed";
      });

    // Update Profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.successMessage = "Profile updated successfully";
        // Update localStorage
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update profile";
      });

    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message || "Password changed successfully";
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to change password";
      });
  },
});

export const { clearError, clearSuccessMessage, setCredentials, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;
