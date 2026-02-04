import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const location = useLocation();

  // Get auth state from Redux
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  // Check if user is authenticated with a valid token and is admin
  if (!isAuthenticated || !token) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has admin role
  if (user?.role !== "admin") {
    // Non-admin users are redirected to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
