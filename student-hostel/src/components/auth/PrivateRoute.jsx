import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, roles = [] }) => {
  const location = useLocation();

  // Get auth state from Redux
  const { user, isAuthenticated, loading } = useSelector(
    (state) => state.auth,
  );

  // Show loading spinner only while verifying authentication
  if (loading) {
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

  // Check if user is authenticated
  if (!isAuthenticated) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has one of the allowed roles
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // User doesn't have the required role, redirect to their appropriate dashboard
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === "host") {
      return <Navigate to="/host" replace />;
    }
    return <Navigate to="/student" replace />;
  }

  return children;
};

export default PrivateRoute;
