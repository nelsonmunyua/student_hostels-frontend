import { Navigate, useLocation } from "react-router-dom";

// Mock authentication context - replace with actual auth context
const useAuth = () => {
  // Check if user is authenticated
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const PrivateRoute = ({ children, roles = [] }) => {
  const location = useLocation();
  const user = useAuth();

  if (!user) {
    // Redirect to login while saving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role (if roles are specified)
  if (roles.length > 0 && !roles.includes(user.role)) {
    // User doesn't have required role, redirect to dashboard or unauthorized page
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
