import { Navigate } from "react-router-dom";

/**
 * Get the redirect path based on user role
 * @param {string} role - The user role (admin, host, student, etc.)
 * @returns {string} - The path to redirect to
 */
export const getRedirectPath = (role) => {
  switch (role) {
    case "admin":
      return "/admin";
    case "host":
      return "/host";
    case "student":
    default:
      return "/dashboard";
  }
};

/**
 * RoleRedirect component - redirects users based on their role
 * Use this for the root redirect after authentication
 */
export const RoleRedirect = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const redirectPath = getRedirectPath(user.role);
  return <Navigate to={redirectPath} replace />;
};

/**
 * Higher-order function to create a role-based redirect component
 * @param {string} requiredRole - The role required to access this route
 * @param {string} redirectPath - The path to redirect unauthorized users
 */
export const createRoleRedirect = (requiredRole, redirectPath = "/login") => {
  return function RoleBasedRedirect({ children, user }) {
    if (!user) {
      return <Navigate to="/login" state={{ from: window.location }} replace />;
    }

    if (user.role !== requiredRole) {
      return <Navigate to={redirectPath} replace />;
    }

    return children;
  };
};

/**
 * Role-based navigation helper
 * Use this in navigation handlers
 */
export const navigateToDashboard = (navigate, role) => {
  const path = getRedirectPath(role);
  navigate(path, { replace: true });
};

export default {
  getRedirectPath,
  RoleRedirect,
  createRoleRedirect,
  navigateToDashboard,
};
