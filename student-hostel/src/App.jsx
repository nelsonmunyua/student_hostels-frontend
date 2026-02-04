
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthLayout from "./components/auth/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import PrivateRoute from "./components/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./admin/AdminDashboard";

// Admin page imports
import Overview from "./admin/pages/Overview";
import Users from "./admin/pages/Users";
import Accommodations from "./admin/pages/Accommodations";
import Bookings from "./admin/pages/Bookings";
import Reviews from "./admin/pages/Reviews";
import Settings from "./admin/pages/Settings";

import "./App.css";

// RootRedirect component to handle role-based redirection
const RootRedirect = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Routes>
      {/* Root redirect with role-based navigation */}
      <Route path="/" element={<RootRedirect />} />

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Student / Host dashboard - accessible by student and host roles */}
      <Route element={<PrivateRoute roles={["student", "host"]} />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      {/* Admin dashboard - accessible only by admin role */}
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      >
        {/* Default page - redirect to overview */}
        <Route index element={<Navigate to="overview" replace />} />

        {/* Nested admin routes */}
        <Route path="overview" element={<Overview />} />
        <Route path="users" element={<Users />} />
        <Route path="accommodations" element={<Accommodations />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Catch-all - redirect to root which handles role-based redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
