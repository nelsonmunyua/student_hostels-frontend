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
      
      if (token) {
        // Only fetch user if we have a token - this verifies the token is valid
        try {
          await store.dispatch(getCurrentUser()).unwrap();
        } catch (error) {
          // Token invalid or expired - clear storage
          console.log("Auth verification failed, clearing tokens");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      // If no token, do nothing - app will proceed as unauthenticated
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
