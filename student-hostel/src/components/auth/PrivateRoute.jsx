import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, roles = [] }) => {
  const location = useLocation();

  // Get auth state from Redux
  const { user, token, isAuthenticated, loading } = useSelector(
    (state) => state.auth,
  );

  // If we have a token but still loading, show spinner
  // This means we're fetching the user data
  if (loading && token) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#f8fafc",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "3px solid #e2e8f0",
            borderTopColor: "#0369a1",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        ></div>
      </div>
    );
  }

  // Check if user is authenticated with a valid token
  // If no token, redirect to login immediately (not loading spinner)
  if (!isAuthenticated || !token) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has one of the allowed roles
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // User doesn't have the required role, redirect to their appropriate dashboard
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Add spinner animation via style tag
if (
  typeof document !== "undefined" &&
  !document.head.querySelector("#private-route-spinner-styles")
) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "private-route-spinner-styles";
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}

export default PrivateRoute;
