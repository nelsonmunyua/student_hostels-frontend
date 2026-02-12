import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://student-hostels-backend-1.onrender.com";

/**
 * Login user thunk - Uses real backend API
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      
      // Store tokens in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("refreshToken", response.data.refresh_token);
      
      return response.data;
    } catch (error) {
      // Handle error response from API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.response?.data?.errors) {
        // Format validation errors
        const errors = error.response.data.errors;
        const errorMessage = Array.isArray(errors) 
          ? errors.map(e => e.msg || e.message || e).join(", ")
          : errors.msg || errors.message || JSON.stringify(errors);
        return rejectWithValue(errorMessage);
      }
      const message = error.message || "Login failed. Please try again.";
      return rejectWithValue(message);
    }
  },
);

/**
 * Signup user thunk - Uses real backend API
 */
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, userData);
      
      // Store tokens in localStorage (signup returns access token only)
      localStorage.setItem("token", response.data.token);
      
      return response.data;
    } catch (error) {
      // Handle error response from API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      if (error.response?.data?.errors) {
        // Format validation errors
        const errors = error.response.data.errors;
        const errorMessage = Array.isArray(errors) 
          ? errors.map(e => e.msg || e.message || e).join(", ")
          : errors.msg || errors.message || JSON.stringify(errors);
        return rejectWithValue(errorMessage);
      }
      const message = error.message || "Signup failed. Please try again.";
      return rejectWithValue(message);
    }
  },
);

/**
 * Logout user thunk - Uses real backend API
 */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Get refresh token from localStorage (logout requires refresh token)
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(
        `${API_BASE_URL}/auth/logout`,
        {},
        { headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {} }
      );
      return response.data;
    } catch (error) {
      // Logout might fail on server but we still want to clear local state
      console.warn("Logout API failed:", error.message);
      return { message: "Logged out locally" };
    }
  },
);

/**
 * Get current user thunk - Uses real backend API
 */
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_BASE_URL}/auth/me`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return response.data;
    } catch (error) {
      // Handle error response from API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      const message = error.message || "Failed to fetch user data";
      return rejectWithValue(message);
    }
  },
);

/**
 * Forgot password thunk - Uses real backend API
 */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, data);
      return response.data;
    } catch (error) {
      // Handle error response from API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      const message = error.message || "Failed to send reset email";
      return rejectWithValue(message);
    }
  },
);

/**
 * Reset password thunk - Uses real backend API
 */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, data);
      return response.data;
    } catch (error) {
      // Handle error response from API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      const message = error.message || "Failed to reset password";
      return rejectWithValue(message);
    }
  },
);

/**
 * Verify email thunk - Uses real backend API
 */
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-email`, data);
      return response.data;
    } catch (error) {
      // Handle error response from API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      const message = error.message || "Email verification failed";
      return rejectWithValue(message);
    }
  },
);

/**
 * Update profile thunk - Uses real backend API
 */
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE_URL}/auth/profile`,
        userData,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return response.data;
    } catch (error) {
      // Handle error response from API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      const message = error.message || "Failed to update profile";
      return rejectWithValue(message);
    }
  },
);

/**
 * Change password thunk - Uses real backend API
 */
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/auth/change-password`,
        data,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      return response.data;
    } catch (error) {
      // Handle error response from API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      const message = error.message || "Failed to change password";
      return rejectWithValue(message);
    }
  },
);

/**
 * Refresh token thunk - Uses real backend API
 */
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : {} }
      );
      return response.data;
    } catch (error) {
      // Handle error response from API
      if (error.response?.data?.message) {
        return rejectWithValue(error.response.data.message);
      }
      const message = error.message || "Failed to refresh token";
      return rejectWithValue(message);
    }
  },
);

