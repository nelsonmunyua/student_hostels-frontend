import { useState, useEffect, useCallback } from "react";

// Mock API delay for simulation
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const useAuth = () => {
  // State for user authentication
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // Login function
  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await delay(1000);

      // Mock validation - in real app, this would be an API call
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Mock successful login
      const mockUser = {
        id: Date.now(),
        email,
        first_name: email.split("@")[0],
        last_name: "User",
        role: "student",
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      return mockUser;
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Signup function
  const signup = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      // Simulate API call
      await delay(1000);

      // Mock validation
      if (!userData.email || !userData.password) {
        throw new Error("Email and password are required");
      }

      if (
        userData.password !== userData.confirmPassword &&
        userData.confirmPassword
      ) {
        throw new Error("Passwords do not match");
      }

      // Mock successful signup
      const mockUser = {
        id: Date.now(),
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        phone: userData.phone,
        role: userData.role || "student",
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      return mockUser;
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    setSuccessMessage(null);
    localStorage.removeItem("user");
  }, []);

  // Request password reset
  const requestPasswordReset = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Simulate API call
      await delay(1000);

      // Mock validation
      if (!email) {
        throw new Error("Email is required");
      }

      // Simulate successful password reset email sent
      setSuccessMessage(
        "Password reset instructions have been sent to your email address.",
      );
      return true;
    } catch (err) {
      setError(err.message || "Failed to send reset email. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error message
  const clearErrorMessage = useCallback(() => {
    setError(null);
  }, []);

  // Clear success message
  const clearSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  return {
    // State
    user,
    isAuthenticated,
    loading,
    error,
    successMessage,
    // Functions
    login,
    signup,
    logout,
    requestPasswordReset,
    // Helpers
    clearErrorMessage,
    clearSuccess,
  };
};

export default useAuth;
