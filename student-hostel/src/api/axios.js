import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Create axios instance with base configuration
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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
 * Handles errors gracefully
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

      // Return the actual error response
      return Promise.reject(error);
    }

    // If no response (network error, server down, etc.)
    if (!error.response) {
      // Create a network error with proper structure
      const networkError = new Error("Network error: Unable to connect to server");
      networkError.response = {
        data: { message: "Unable to connect to server. Please check your connection." },
        status: 0,
      };
      return Promise.reject(networkError);
    }

    return Promise.reject(error);
  },
);

/**
 * Helper function to check if running in mock mode
 */
export const isMockMode = () => {
  const token = localStorage.getItem("token");
  return token?.startsWith("mock-token-") || false;
};

export default axiosInstance;

