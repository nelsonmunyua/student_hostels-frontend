import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useRef } from "react";
import store from "./redux/store";
import { getCurrentUser } from "./redux/slices/Thunks/authThunks";
import "./index.css";
import "./App.css";
import App from "./App.jsx";

// Auth initialization component - handles auth check ONCE on mount
const AuthInitializer = ({ children }) => {
  const initialized = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (initialized.current) return;
    initialized.current = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      
      // Clear mock tokens - these are not valid JWT tokens
      if (token && token.startsWith("mock-token-")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refreshToken");
        return;
      }
      
      if (token) {
        // Verify token with backend
        try {
          await store.dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          // Token invalid or expired - clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
        }
      }
    };

    checkAuth();
  }, []);

  return children;
};

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthInitializer>
        <App />
      </AuthInitializer>
    </BrowserRouter>
  </Provider>,
);

