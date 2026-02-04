import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Create axios instance with base configuration
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Reduced timeout for faster failure detection
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request interceptor
 * Adds auth token to requests if available
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

/**
 * Response interceptor
 * Handles errors gracefully and provides mock responses for development
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If server responded with an error, handle it
    if (error.response) {
      const { status, data } = error.response;

      // For 401 Unauthorized, try to refresh token
      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");

          if (refreshToken) {
            const response = await axios.post(
              `${API_BASE_URL}/auth/refresh-token`,
              { refreshToken },
            );

            const { token } = response.data;

            localStorage.setItem("token", token);
            originalRequest.headers.Authorization = `Bearer ${token}`;

            return axiosInstance(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");

          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      }

      // For 500 errors and other server errors, log but don't crash
      if (status >= 500) {
        console.warn(
          "Server error (500): Backend may not be running. Using mock data instead.",
        );
        // Return a mock response to prevent app crash
        return {
          data: {
            message: "Mock response - backend not available",
            mock: true,
          },
        };
      }

      // For client errors (400-499), return the error
      return Promise.reject(error);
    }

    // If no response (network error, server down, etc.)
    if (!error.response) {
      console.warn(
        "Network error: Backend server may not be running. API calls will use mock data.",
      );

      // Return a mock response for network errors
      // This prevents the app from crashing when backend is unavailable
      return {
        data: { message: "Mock response - network unavailable", mock: true },
      };
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

/**
 * Helper function to check if running in mock mode
 */
export const isMockMode = () => {
  const token = localStorage.getItem("token");
  return token?.startsWith("mock-token-") || false;
};
