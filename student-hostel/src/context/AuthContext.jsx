import { createContext, useContext, useState, useEffect, useCallback } from "react";
import authApi from "../api/authApi";

// Create the Auth Context
const AuthContext = createContext(null);

/**
 * AuthProvider - Manages authentication state
 * Uses real backend API for authentication
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on app start
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user has valid token on app start
   */
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    // If no token or user data, not authenticated
    if (!token || !userData) {
      setLoading(false);
      return;
    }

    // Check if it's a mock token (shouldn't happen with real API)
    if (token.startsWith("mock-token-")) {
      // Clear mock data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setLoading(false);
      return;
    }

    try {
      // Verify token with backend
      const response = await authApi.getCurrentUser();
      setUser(response.user || response.data || response);
      setIsAuthenticated(true);
    } catch (error) {
      // Token invalid or expired
      console.error("Auth check failed:", error.message);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login user with real API
   * @param {Object} credentials - { email, password }
   * @returns {Object} - { success, user, error }
   */
  const login = async (credentials) => {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        return { success: false, error: "Email and password are required" };
      }

      // Call real backend API
      const response = await authApi.login({ email, password });
      
      // Handle different response formats
      const data = response.data || response;
      const { access_token, refresh_token, user: userData } = data;

      // Store tokens
      if (access_token) {
        localStorage.setItem("token", access_token);
      }
      if (refresh_token) {
        localStorage.setItem("refreshToken", refresh_token);
      }
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }

      setIsAuthenticated(true);

      return { success: true, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           "Login failed";
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Signup user with real API
   * @param {Object} userData - { email, password, first_name, last_name, role, phone }
   * @returns {Object} - { success, user, error }
   */
  const signup = async (userData) => {
    try {
      const { email, password, first_name, last_name, role, phone } = userData;

      if (!email || !password || !first_name || !last_name) {
        return { success: false, error: "All fields are required" };
      }

      // Call real backend API
      const response = await authApi.signup({
        email,
        password,
        first_name,
        last_name,
        role: role || "student",
        phone
      });
      
      // Handle different response formats
      const data = response.data || response;
      const { access_token, refresh_token, user: newUser } = data;

      // Store tokens
      if (access_token) {
        localStorage.setItem("token", access_token);
      }
      if (refresh_token) {
        localStorage.setItem("refreshToken", refresh_token);
      }
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      }

      setIsAuthenticated(true);

      return { success: true, user: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           "Signup failed";
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      // Call logout API (optional - will fail silently if backend is down)
      await authApi.logout();
    } catch (error) {
      // Ignore logout API errors
      console.log("Logout API call skipped");
    }
    
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   */
  const updateProfile = async (userData) => {
    try {
      const response = await authApi.updateProfile(userData);
      const data = response.data || response;
      
      if (data.user) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }
      
      return { success: true, user: data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           "Profile update failed";
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Refresh authentication token
   */
  const refreshToken = useCallback(async () => {
    try {
      const response = await authApi.refreshToken();
      const data = response.data || response;
      
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        if (data.refresh_token) {
          localStorage.setItem("refreshToken", data.refresh_token);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error.message);
      return false;
    }
  }, []);

  // Value provided to consumers
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    refreshToken,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * useAuth - Hook to access auth state
 * Usage: const { user, isAuthenticated, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;

