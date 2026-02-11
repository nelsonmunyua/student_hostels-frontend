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

  const { user, isAuthenticated, error, successMessage, token } = useSelector(
    (state) => state.auth,
  );

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

  const logout = useCallback(() => {
    dispatch(logoutUser());
  }, [dispatch]);

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
    user,
    token,
    isAuthenticated,
    error,
    successMessage,
    login,
    signup,
    logout,
    requestPasswordReset,
  };
};

export default useAuth;
