import { Component } from "react";
import { RefreshCw, AlertTriangle, Home } from "lucide-react";

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in the child component tree
 * and display a fallback UI instead of crashing the whole app.
 * 
 * @param {React.ReactNode} children - Child components to wrap
 * @param {React.ReactNode} fallback - Custom fallback UI (optional)
 * @param {string} componentName - Name of the component for logging (optional)
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console or send to an error reporting service
    console.error("ErrorBoundary caught an error:", error);
    console.error("Component stack trace:", errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });

    // You can also log to an error reporting service like Sentry
    // logErrorToService(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div style={styles.container}>
          <div style={styles.errorCard}>
            <div style={styles.iconWrapper}>
              <AlertTriangle size={48} color="#f59e0b" />
            </div>

            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.message}>
              We encountered an unexpected error while loading this content.
            </p>

            {/* Show error details in development mode */}
            {import.meta.env.DEV && this.state.error && (
              <details style={styles.errorDetails}>
                <summary style={styles.errorSummary}>Error Details</summary>
                <p style={styles.errorText}>{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <p style={styles.stackTrace}>
                    {this.state.errorInfo.componentStack}
                  </p>
                )}
              </details>
            )}

            <div style={styles.buttonGroup}>
              <button
                onClick={this.handleRetry}
                style={styles.retryButton}
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                style={styles.homeButton}
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
    padding: "24px",
    backgroundColor: "#f9fafb",
  },
  errorCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxWidth: "500px",
    padding: "32px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  iconWrapper: {
    marginBottom: "16px",
    padding: "16px",
    backgroundColor: "#fef3c7",
    borderRadius: "50%",
  },
  title: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1f2937",
    marginBottom: "8px",
  },
  message: {
    fontSize: "16px",
    color: "#6b7280",
    marginBottom: "24px",
  },
  errorDetails: {
    width: "100%",
    padding: "16px",
    backgroundColor: "#fef2f2",
    borderRadius: "8px",
    marginBottom: "24px",
    textAlign: "left",
  },
  errorSummary: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#991b1b",
    cursor: "pointer",
    marginBottom: "8px",
  },
  errorText: {
    fontSize: "14px",
    color: "#dc2626",
    marginBottom: "8px",
  },
  stackTrace: {
    fontSize: "12px",
    color: "#7f1d1d",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    overflow: "auto",
    maxHeight: "200px",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  retryButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  homeButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
};

export default ErrorBoundary;

