import { createAsyncThunk } from "@reduxjs/toolkit";

// Mock API delay for simulation
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock user database
const mockUsers = [
  {
    id: 1,
    email: "admin@admin.com",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
    is_verified: true,
  },
  {
    id: 2,
    email: "student@test.com",
    first_name: "John",
    last_name: "Doe",
    role: "student",
    is_verified: true,
  },
];

// Generate mock token
const generateMockToken = (userId) => {
  return `mock-token-${userId}-${Date.now()}`;
};

/**
 * Login user thunk - MOCKED
 */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await delay(1000);

      const { email, password } = credentials;

      // Mock validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Find user by email
      const mockUser = mockUsers.find((u) => u.email === email);

      if (!mockUser) {
        // Create a new mock user if not found
        // Check if email contains "admin" to assign admin role
        const isAdminEmail = email.toLowerCase().includes("admin");
        const newUser = {
          id: Date.now(),
          email,
          first_name: email.split("@")[0],
          last_name: "User",
          role: isAdminEmail ? "admin" : "student",
          is_verified: true,
        };
        mockUsers.push(newUser);

        return {
          user: newUser,
          token: generateMockToken(newUser.id),
        };
      }

      return {
        user: mockUser,
        token: generateMockToken(mockUser.id),
      };
    } catch (error) {
      const message = error.message || "Login failed";
      return rejectWithValue(message);
    }
  },
);

/**
 * Signup user thunk - MOCKED
 */
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await delay(1000);

      const { email, first_name, last_name, password, role } = userData;

      // Mock validation
      if (!email || !password || !first_name || !last_name) {
        throw new Error("All fields are required");
      }

      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create new mock user
      // Check if email contains "admin" to assign admin role, otherwise use provided role or default to student
      const isAdminEmail = email.toLowerCase().includes("admin");
      const newUser = {
        id: Date.now(),
        email,
        first_name,
        last_name,
        role: isAdminEmail ? "admin" : role || "student",
        is_verified: false, // Email verification required
        phone: userData.phone || null,
      };

      mockUsers.push(newUser);

      return {
        user: newUser,
        token: generateMockToken(newUser.id),
      };
    } catch (error) {
      const message = error.message || "Signup failed";
      return rejectWithValue(message);
    }
  },
);

/**
 * Logout user thunk - MOCKED
 */
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await delay(500);

      return { message: "Logged out successfully" };
    } catch (error) {
      const message = error.message || "Logout failed";
      return rejectWithValue(message);
    }
  },
);

/**
 * Get current user thunk - MOCKED
 */
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await delay(500);

      // Get token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        // Don't throw - this is expected when not logged in
        return rejectWithValue("No token found");
      }

      // Extract user ID from token (mock logic: mock-token-{userId}-{timestamp})
      // Handle edge cases where token format might be different
      let userId = null;
      if (token && token.startsWith("mock-token-")) {
        const parts = token.split("-");
        if (parts.length >= 3) {
          userId = parseInt(parts[2], 10);
        }
      }

      // If we couldn't extract a valid userId, try to find user by stored user info
      if (!userId || isNaN(userId)) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            // Verify this user exists in our mock database
            const existingUser = mockUsers.find((u) => u.id === parsedUser.id);
            if (existingUser) {
              return { user: existingUser };
            }
          } catch (e) {
            // Invalid stored user, continue with fallback
          }
        }
        // Fallback to no user found (user needs to login)
        return rejectWithValue("Invalid token");
      }

      // Find user in mock database
      const mockUser = mockUsers.find((u) => u.id === userId);

      if (!mockUser) {
        // User not found in mock database
        return rejectWithValue("User not found");
      }

      return { user: mockUser };
    } catch (error) {
      const message = error.message || "Failed to fetch user data";
      return rejectWithValue(message);
    }
  },
);

/**
 * Forgot password thunk - MOCKED
 */
export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (data, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await delay(1000);

      const { email } = data;

      if (!email) {
        throw new Error("Email is required");
      }

      return {
        message: `Password reset email sent to ${email}. Check your inbox for the reset link.`,
      };
    } catch (error) {
      const message = error.message || "Failed to send reset email";
      return rejectWithValue(message);
    }
  },
);

/**
 * Reset password thunk - MOCKED
 */
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await delay(1000);

      const { token, password } = data;

      if (!token || !password) {
        throw new Error("Token and new password are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }

      return {
        message:
          "Password reset successfully. You can now login with your new password.",
      };
    } catch (error) {
      const message = error.message || "Failed to reset password";
      return rejectWithValue(message);
    }
  },
);

/**
 * Verify email thunk - MOCKED
 */
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (data, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await delay(1000);

      const { token } = data;

      if (!token) {
        throw new Error("Verification token is required");
      }

      // Mock: Update user verification status
      return {
        message: "Email verified successfully! Your account is now active.",
      };
    } catch (error) {
      const message = error.message || "Email verification failed";
      return rejectWithValue(message);
    }
  },
);

/**
 * Update profile thunk - MOCKED
 */
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (userData, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await delay(1000);

      // Get current user from localStorage
      const token = localStorage.getItem("token");
      const userId = parseInt(token?.split("-")[2]) || 1;

      // Update mock user
      const userIndex = mockUsers.findIndex((u) => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...userData };
      }

      return {
        user: { ...mockUsers[userIndex], ...userData },
        message: "Profile updated successfully",
      };
    } catch (error) {
      const message = error.message || "Failed to update profile";
      return rejectWithValue(message);
    }
  },
);

/**
 * Change password thunk - MOCKED
 */
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await delay(1000);

      const { old_password, new_password } = data;

      if (!old_password || !new_password) {
        throw new Error("Both old and new passwords are required");
      }

      if (new_password.length < 6) {
        throw new Error("New password must be at least 6 characters long");
      }

      return {
        message:
          "Password changed successfully. Please login with your new password.",
      };
    } catch (error) {
      const message = error.message || "Failed to change password";
      return rejectWithValue(message);
    }
  },
);

/**
 * Refresh token thunk - MOCKED
 */
export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call delay
      await delay(500);

      const token = localStorage.getItem("token");
      const userId = parseInt(token?.split("-")[2]) || 1;

      return {
        token: generateMockToken(userId),
        message: "Token refreshed successfully",
      };
    } catch (error) {
      const message = error.message || "Failed to refresh token";
      return rejectWithValue(message);
    }
  },
);
