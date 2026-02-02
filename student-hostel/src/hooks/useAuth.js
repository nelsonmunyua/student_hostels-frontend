import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import {
  loginUser,
  signupUser,
  logoutUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updateProfile,
  changePassword,
} from '../redux/thunks/authThunks';
import {
  clearError,
  clearSuccessMessage,
  setCredentials,
  clearAuth,
} from '../redux/slices/authSlice';

/**
 * Custom hook for authentication
 * Provides auth state and methods for authentication operations
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Select auth state from Redux store
  const {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    successMessage,
    isEmailVerified,
  } = useSelector((state) => state.auth);

  /**
   * Initialize auth state from localStorage on mount
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setCredentials({ user: parsedUser, token: storedToken }));
        // Optionally verify token is still valid
        dispatch(getCurrentUser());
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        dispatch(clearAuth());
      }
    }
  }, [dispatch]);

  /**
   * Login function
   */
  const login = useCallback(
    async (credentials, redirectPath = '/dashboard') => {
      try {
        const result = await dispatch(loginUser(credentials)).unwrap();
        navigate(redirectPath);
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Signup function
   */
  const signup = useCallback(
    async (userData, redirectPath = '/dashboard') => {
      try {
        const result = await dispatch(signupUser(userData)).unwrap();
        navigate(redirectPath);
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Logout function
   */
  const logout = useCallback(
    async (redirectPath = '/login') => {
      try {
        await dispatch(logoutUser()).unwrap();
        navigate(redirectPath);
      } catch (error) {
        // Even if server logout fails, clear local state
        dispatch(clearAuth());
        navigate(redirectPath);
      }
    },
    [dispatch, navigate]
  );

  /**
   * Forgot password function
   */
  const requestPasswordReset = useCallback(
    async (email) => {
      try {
        const result = await dispatch(forgotPassword({ email })).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Reset password function
   */
  const resetUserPassword = useCallback(
    async (token, password, redirectPath = '/login') => {
      try {
        const result = await dispatch(resetPassword({ token, password })).unwrap();
        navigate(redirectPath);
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch, navigate]
  );

  /**
   * Verify email function
   */
  const verifyUserEmail = useCallback(
    async (token) => {
      try {
        const result = await dispatch(verifyEmail({ token })).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Update user profile function
   */
  const updateUserProfile = useCallback(
    async (userData) => {
      try {
        const result = await dispatch(updateProfile(userData)).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Change password function
   */
  const changeUserPassword = useCallback(
    async (oldPassword, newPassword) => {
      try {
        const result = await dispatch(
          changePassword({ old_password: oldPassword, new_password: newPassword })
        ).unwrap();
        return result;
      } catch (error) {
        throw error;
      }
    },
    [dispatch]
  );

  /**
   * Refresh current user data
   */
  const refreshUser = useCallback(async () => {
    try {
      const result = await dispatch(getCurrentUser()).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  /**
   * Clear error messages
   */
  const clearErrorMessage = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * Clear success messages
   */
  const clearSuccess = useCallback(() => {
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback(
    (role) => {
      return user?.role === role;
    },
    [user]
  );

  /**
   * Check if user is admin
   */
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  /**
   * Check if user is host
   */
  const isHost = useCallback(() => {
    return user?.role === 'host';
  }, [user]);

  /**
   * Check if user is student
   */
  const isStudent = useCallback(() => {
    return user?.role === 'student';
  }, [user]);

  return {
    // State
    user,
    token,
    isAuthenticated,
    loading,
    error,
    successMessage,
    isEmailVerified,
    
    // Methods
    login,
    signup,
    logout,
    requestPasswordReset,
    resetUserPassword,
    verifyUserEmail,
    updateUserProfile,
    changeUserPassword,
    refreshUser,
    clearErrorMessage,
    clearSuccess,
    
    // Role checks
    hasRole,
    isAdmin,
    isHost,
    isStudent,
  };
};

export default useAuth;