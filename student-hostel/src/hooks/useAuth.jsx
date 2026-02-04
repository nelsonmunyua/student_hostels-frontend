import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import {
  loginUser,
  signupUser,
  logoutUser,
  forgotPassword,
} from "../redux/slices/Thunks/authThunks";
import { setCredentials } from "../redux/slices/authSlice";

const useAuth = () => {
  const dispatch = useDispatch();

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
        return result;
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
        return result;
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

  return {
    // State from Redux (primary)
    user,
    token,
    isAuthenticated,
    loading,
    error,
    successMessage,
    // Functions
    login,
    signup,
    logout,
    requestPasswordReset,
  };
};

export default useAuth;
