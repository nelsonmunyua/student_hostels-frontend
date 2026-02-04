/**
 * Authentication Error Types
 * Defines specific error categories for better user guidance
 */

export const AuthErrorTypes = {
  // Authentication errors
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  ACCOUNT_LOCKED: "ACCOUNT_LOCKED",
  EMAIL_NOT_VERIFIED: "EMAIL_NOT_VERIFIED",
  ACCOUNT_DISABLED: "ACCOUNT_DISABLED",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",

  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  TIMEOUT_ERROR: "TIMEOUT_ERROR",

  // Validation errors
  EMAIL_REQUIRED: "EMAIL_REQUIRED",
  PASSWORD_REQUIRED: "PASSWORD_REQUIRED",
  INVALID_EMAIL_FORMAT: "INVALID_EMAIL_FORMAT",

  // Unknown
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
};

/**
 * Error messages with user guidance
 */
export const AuthErrorMessages = {
  [AuthErrorTypes.INVALID_CREDENTIALS]: {
    message: "Invalid email or password",
    guidance:
      "Please check your credentials or use 'Forgot Password' to reset your password.",
    severity: "error",
  },
  [AuthErrorTypes.ACCOUNT_LOCKED]: {
    message: "Account temporarily locked",
    guidance:
      "Due to too many failed login attempts. Please try again in 15 minutes or contact support.",
    severity: "warning",
  },
  [AuthErrorTypes.EMAIL_NOT_VERIFIED]: {
    message: "Email not verified",
    guidance:
      "Please check your inbox for the verification email or request a new verification link.",
    severity: "info",
  },
  [AuthErrorTypes.ACCOUNT_DISABLED]: {
    message: "Account disabled",
    guidance:
      "Your account has been disabled. Please contact the administrator for assistance.",
    severity: "error",
  },
  [AuthErrorTypes.INVALID_TOKEN]: {
    message: "Invalid authentication token",
    guidance: "Please log in again to continue.",
    severity: "error",
  },
  [AuthErrorTypes.TOKEN_EXPIRED]: {
    message: "Session expired",
    guidance: "Please log in again to continue.",
    severity: "info",
  },
  [AuthErrorTypes.NETWORK_ERROR]: {
    message: "Unable to connect to server",
    guidance: "Please check your internet connection and try again.",
    severity: "warning",
  },
  [AuthErrorTypes.SERVER_ERROR]: {
    message: "Server error",
    guidance: "Something went wrong on our end. Please try again later.",
    severity: "error",
  },
  [AuthErrorTypes.TIMEOUT_ERROR]: {
    message: "Request timed out",
    guidance: "The server took too long to respond. Please try again.",
    severity: "warning",
  },
  [AuthErrorTypes.EMAIL_REQUIRED]: {
    message: "Email is required",
    guidance: "Please enter your email address.",
    severity: "error",
  },
  [AuthErrorTypes.PASSWORD_REQUIRED]: {
    message: "Password is required",
    guidance: "Please enter your password.",
    severity: "error",
  },
  [AuthErrorTypes.INVALID_EMAIL_FORMAT]: {
    message: "Invalid email format",
    guidance: "Please enter a valid email address (e.g., user@example.com).",
    severity: "error",
  },
  [AuthErrorTypes.UNKNOWN_ERROR]: {
    message: "An error occurred",
    guidance: "Something went wrong. Please try again.",
    severity: "error",
  },
};

/**
 * HTTP status codes mapped to error types
 */
export const httpStatusToErrorType = {
  400: AuthErrorTypes.INVALID_CREDENTIALS,
  401: AuthErrorTypes.INVALID_CREDENTIALS,
  403: AuthErrorTypes.ACCOUNT_DISABLED,
  404: AuthErrorTypes.INVALID_CREDENTIALS,
  422: AuthErrorTypes.INVALID_CREDENTIALS,
  423: AuthErrorTypes.ACCOUNT_LOCKED,
  429: AuthErrorTypes.ACCOUNT_LOCKED,
  500: AuthErrorTypes.SERVER_ERROR,
  502: AuthErrorTypes.SERVER_ERROR,
  503: AuthErrorTypes.SERVER_ERROR,
  504: AuthErrorTypes.TIMEOUT_ERROR,
};

/**
 * Backend error message patterns to error types mapping
 */
export const errorMessagePatterns = {
  "email not verified": AuthErrorTypes.EMAIL_NOT_VERIFIED,
  "verify your email": AuthErrorTypes.EMAIL_NOT_VERIFIED,
  "account.*disabled": AuthErrorTypes.ACCOUNT_DISABLED,
  "account.*locked": AuthErrorTypes.ACCOUNT_LOCKED,
  "too many.*attempt": AuthErrorTypes.ACCOUNT_LOCKED,
  "invalid.*credentials": AuthErrorTypes.INVALID_CREDENTIALS,
  "incorrect.*password": AuthErrorTypes.INVALID_CREDENTIALS,
  "user.*not found": AuthErrorTypes.INVALID_CREDENTIALS,
};

/**
 * Helper to determine error type from error response
 */
export const getErrorType = (error) => {
  // If error already has errorType property, return it
  if (error.errorType) {
    return error.errorType;
  }

  // Check response data for errorType
  if (error.response?.data?.errorType) {
    return error.response.data.errorType;
  }

  // Check for specific messages in response
  const message = error.response?.data?.message || error.message || "";
  const lowerMessage = message.toLowerCase();

  for (const [pattern, errorType] of Object.entries(errorMessagePatterns)) {
    const regex = new RegExp(pattern, "i");
    if (regex.test(lowerMessage)) {
      return errorType;
    }
  }

  // Map HTTP status to error type
  const status = error.response?.status;
  if (status && httpStatusToErrorType[status]) {
    return httpStatusToErrorType[status];
  }

  // Handle network errors
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return AuthErrorTypes.TIMEOUT_ERROR;
    }
    return AuthErrorTypes.NETWORK_ERROR;
  }

  return AuthErrorTypes.UNKNOWN_ERROR;
};

/**
 * Get error display info for UI
 */
export const getErrorDisplay = (error) => {
  const errorType = getErrorType(error);
  const errorInfo =
    AuthErrorMessages[errorType] ||
    AuthErrorMessages[AuthErrorTypes.UNKNOWN_ERROR];

  return {
    errorType,
    ...errorInfo,
  };
};
