import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import React, { useEffect, Component } from "react";
import store from "./redux/store";
import { getCurrentUser } from "./redux/slices/Thunks/authThunks";
import "./index.css";
import "./App.css";
import App from "./App.jsx";

// Error Boundary Component - catches React errors gracefully
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Oops! Something went wrong
          </h1>
          <p style={{ marginBottom: "1.5rem", opacity: 0.9 }}>
            We're sorry for the inconvenience. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "12px 24px",
              backgroundColor: "white",
              color: "#667eea",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Refresh Page
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre
              style={{
                marginTop: "20px",
                padding: "16px",
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: "8px",
                textAlign: "left",
                maxWidth: "600px",
                overflow: "auto",
                fontSize: "12px",
              }}
            >
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// Non-blocking Auth initialization component
// Renders immediately and checks auth in background
const AuthInitializer = ({ children }) => {
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      if (token.startsWith("mock-token-")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        return;
      }

      try {
        // Use a timeout to prevent hanging on slow API
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await store.dispatch(getCurrentUser());
        clearTimeout(timeoutId);
      } catch (error) {
        console.warn("Auth check failed:", error.message);
        // Only clear tokens for actual auth failures, not for timeouts
        if (error.name !== "AbortError") {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }
    };

    // Small delay to let initial render complete
    const timer = setTimeout(checkAuth, 100);

    return () => clearTimeout(timer);
  }, []);

  return children;
};

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <AuthInitializer>
            <App />
          </AuthInitializer>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
);
