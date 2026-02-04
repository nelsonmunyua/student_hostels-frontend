import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useState } from "react";
import {
  loginUser,
  signupUser,
  logoutUser,
  forgotPassword,
} from "../redux/slices/Thunks/authThunks";
import { setCredentials, clearAuth } from "../redux/slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();

  // Local state for backwards compatibility (for signup and password reset)
  const [localUser, setUser] = useState(null);
  const [localLoading, setLoading] = useState(false);
  const [localError, setError] = useState(null);
  const [localSuccessMessage, setSuccessMessage] = useState(null);

  // Get auth state from Redux
  const { user, isAuthenticated, loading, error, successMessage, token } =
    useSelector((state) => state.auth);

  // Load auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setCredentials({ user: parsedUser, token: storedToken }));
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [dispatch]);

  // Login function - uses Redux thunk
  const login = useCallback(
    async ({ email, password }) => {
      try {
        const result = await dispatch(loginUser({ email, password })).unwrap();
        return result.user;
      } catch (err) {
        throw err;
      }
    },
    [dispatch],
  );

  // Signup function - uses Redux thunk
  const signup = useCallback(
    async (userData) => {
      try {
        const result = await dispatch(signupUser(userData)).unwrap();
        return result.user;
      } catch (err) {
        throw err;
      }
    },
    [dispatch],
  );

  // Logout function
  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  // Request password reset - uses Redux thunk
  const requestPasswordReset = useCallback(
    async (email) => {
      try {
        const result = await dispatch(forgotPassword({ email })).unwrap();
        return result;
      } catch (err) {
        throw err;
      }
    },
    [dispatch],
  );

  // Clear error message
  const clearErrorMessage = useCallback(() => {
    // This would dispatch a clearError action in a real implementation
  }, []);

  // Clear success message
  const clearSuccess = useCallback(() => {
    // This would dispatch a clearSuccessMessage action in a real implementation
  }, []);

  return {
    // State from Redux (primary)
    user: user || localUser,
    token,
    isAuthenticated: isAuthenticated || localUser !== null,
    loading: loading || localLoading,
    error: error || localError,
    successMessage: successMessage || localSuccessMessage,
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
