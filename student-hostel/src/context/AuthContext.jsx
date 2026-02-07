import { createContext, useContext, useState, useEffect } from "react";

// Create the Auth Context
const AuthContext = createContext(null);

/**
 * AuthProvider - Manages authentication state
 * This replaces Redux for authentication
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing auth on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  };

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Object} - { success, user, error }
   */
  const login = async (credentials) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { email, password } = credentials;

      if (!email || !password) {
        return { success: false, error: "Email and password are required" };
      }

      // Mock user for demo
      const isAdminEmail = email.toLowerCase().includes("admin");
      const mockUser = {
        id: Date.now(),
        email,
        first_name: email.split("@")[0],
        last_name: "User",
        role: isAdminEmail ? "admin" : "student",
        is_verified: true,
      };

      const mockToken = `mock-token-${mockUser.id}-${Date.now()}`;

      // Store in localStorage
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUser));

      setUser(mockUser);
      setIsAuthenticated(true);

      return { success: true, user: mockUser };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  /**
   * Signup user
   * @param {Object} userData - { email, password, first_name, last_name, role }
   * @returns {Object} - { success, user, error }
   */
  const signup = async (userData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const { email, password, first_name, last_name, role } = userData;

      if (!email || !password || !first_name || !last_name) {
        return { success: false, error: "All fields are required" };
      }

      const isAdminEmail = email.toLowerCase().includes("admin");
      const newUser = {
        id: Date.now(),
        email,
        first_name,
        last_name,
        role: isAdminEmail ? "admin" : role || "student",
        is_verified: false,
      };

      const mockToken = `mock-token-${newUser.id}-${Date.now()}`;

      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      setUser(newUser);
      setIsAuthenticated(true);

      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message || "Signup failed" };
    }
  };

  /**
   * Logout user
   */
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  /**
   * Update user profile
   * @param {Object} userData - Updated user data
   */
  const updateProfile = (userData) => {
    const updatedUser = { ...user, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  // Value provided to consumers
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateProfile,
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
