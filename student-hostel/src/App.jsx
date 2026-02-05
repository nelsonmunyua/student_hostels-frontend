import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AuthLayout from "./components/auth/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import PrivateRoute from "./components/auth/PrivateRoute";
import StudentDashboard from "./student/StudentDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import HostDashboard from "./host/HostDashboard";

// Admin page imports
import Overview from "./admin/pages/Overview";
import Users from "./admin/pages/Users";
import Accommodations from "./admin/pages/Accommodations";
import Bookings from "./admin/pages/Bookings";
import Reviews from "./admin/pages/Reviews";
import Settings from "./admin/pages/Settings";

// Host page imports
import HostOverview from "./host/pages/Overview";
import HostListings from "./host/pages/Listings";
import HostBookings from "./host/pages/Bookings";
import HostReviews from "./host/pages/Reviews";
import HostAnalytics from "./host/pages/Analytics";
import HostProfile from "./host/pages/Profile";

// Student page imports
import StudentOverview from "./student/pages/Overview";
import StudentBookings from "./student/pages/Bookings";
import StudentWishlist from "./student/pages/Wishlist";
import StudentReviews from "./student/pages/Reviews";
import StudentProfile from "./student/pages/Profile";

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

  if (user?.role === "host") {
    return <Navigate to="/host" replace />;
  }

  // Default for students and any other authenticated users
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

      {/* Student dashboard - accessible by student role */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute roles={["student"]}>
            <StudentDashboard />
          </PrivateRoute>
        }
      >
        {/* Default page - show overview */}
        <Route index element={<StudentOverview />} />

        {/* Nested student routes */}
        <Route path="overview" element={<StudentOverview />} />
        <Route path="bookings" element={<StudentBookings />} />
        <Route path="wishlist" element={<StudentWishlist />} />
        <Route path="reviews" element={<StudentReviews />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Host dashboard - accessible only by host role */}
      <Route
        path="/host"
        element={
          <PrivateRoute roles={["host"]}>
            <HostDashboard />
          </PrivateRoute>
        }
      >
        {/* Default page - redirect to overview */}
        <Route index element={<Navigate to="overview" replace />} />

        {/* Nested host routes */}
        <Route path="overview" element={<HostOverview />} />
        <Route path="listings" element={<HostListings />} />
        <Route path="bookings" element={<HostBookings />} />
        <Route path="reviews" element={<HostReviews />} />
        <Route path="analytics" element={<HostAnalytics />} />
        <Route path="profile" element={<HostProfile />} />
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
