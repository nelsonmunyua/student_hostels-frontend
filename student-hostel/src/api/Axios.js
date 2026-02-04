import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request in development
    if (import.meta.env.DEV) {
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
        params: config.params,
      });
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle responses and errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data,
      });
    }

    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      console.error('❌ API Error Response:', {
        status,
        url: error.config?.url,
        message: data?.message || data?.error,
        data,
      });

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - Clear auth and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - User doesn't have permission
          console.error('Access forbidden:', data?.message);
          break;

        case 404:
          // Not found
          console.error('Resource not found:', error.config?.url);
          break;

        case 422:
          // Validation error
          console.error('Validation error:', data?.errors || data?.message);
          break;

        case 500:
          // Server error
          console.error('Server error:', data?.message);
          break;

        default:
          console.error('API error:', data?.message || 'Unknown error');
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('❌ No response from server:', error.message);
      
      // Check if it's a network error
      if (!navigator.onLine) {
        console.error('No internet connection');
      }
    } else {
      // Something else happened
      console.error('❌ Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;