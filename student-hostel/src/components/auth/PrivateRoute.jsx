import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useAuth from "../../hooks/useAuth";

const PrivateRoute = ({ children, roles = [] }) => {
  const location = useLocation();

  // Get auth state from Redux (primary) or useAuth hook (fallback)
  const reduxAuth = useSelector((state) => state.auth);
  const { user, isAuthenticated } = useAuth();

  // Use Redux state if available, otherwise fallback to useAuth
  const authUser = reduxAuth.user || user;
  const authIsAuthenticated = reduxAuth.isAuthenticated || isAuthenticated;

  if (!authIsAuthenticated) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role (if roles are specified)
  if (roles.length > 0 && !roles.includes(authUser?.role)) {
    // User doesn't have required role, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
