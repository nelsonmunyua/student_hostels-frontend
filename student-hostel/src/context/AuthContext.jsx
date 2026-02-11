import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import authApi from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      return;
    }

    if (token.startsWith("mock-token-")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("refreshToken");
      return;
    }

    try {
      const response = await authApi.getCurrentUser();
      setUser(response.user || response.data || response);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Auth check failed:", error.message);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
    }
  };

  const login = async (credentials) => {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        return { success: false, error: "Email and password are required" };
      }

      const response = await authApi.login({ email, password });
      const data = response.data || response;
      const { access_token, refresh_token, user: userData } = data;

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
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Login failed";
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (userData) => {
    try {
      const { email, password, first_name, last_name, role, phone } = userData;

      if (!email || !password || !first_name || !last_name) {
        return { success: false, error: "All fields are required" };
      }

      const response = await authApi.signup({
        email,
        password,
        first_name,
        last_name,
        role: role || "student",
        phone,
      });

      const data = response.data || response;
      const { access_token, refresh_token, user: newUser } = data;

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
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Signup failed";
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.log("Logout API call skipped");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
  };

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
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Profile update failed";
      return { success: false, error: errorMessage };
    }
  };

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

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    updateProfile,
    refreshToken,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
