import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  loginUser,
  signupUser,
  logoutUser,
  forgotPassword,
} from "../redux/slices/Thunks/authThunks";

const useAuth = () => {
  const dispatch = useDispatch();

  // Get auth state from Redux
  const { user, isAuthenticated, loading, error, successMessage, token } =
    useSelector((state) => state.auth);

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
