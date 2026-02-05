import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import { getCurrentUser } from "./redux/slices/Thunks/authThunks";
import "./index.css";
import "./App.css";
import App from "./App.jsx";

// Check if user is authenticated on app start and fetch user data
const checkAuthAndFetchUser = async () => {
  const token = localStorage.getItem("token");
  if (token) {
    // Dispatch getCurrentUser to verify token and get user data
    try {
      await store.dispatch(getCurrentUser()).unwrap();
    } catch (error) {
      // If getCurrentUser fails (e.g., invalid token), clear localStorage
      console.log("Auth check failed, clearing tokens");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  } else {
    // Even without token, we need to set loading to false
    // so the app doesn't stay in loading state forever
    store.dispatch({
      type: "auth/getCurrentUser/rejected",
      payload: "No token",
    });
  }
};

// Initialize auth check immediately
checkAuthAndFetchUser();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
