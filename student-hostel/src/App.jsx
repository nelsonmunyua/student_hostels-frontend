import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import PrivateRoute from "./components/auth/PrivateRoute";
import StudentDashboard from "./components/Dashboard/student/StudentDashboard";
import AdminDashboard from "./components/Dashboard/admin/AdminDashboard";
import HostDashboard from "./components/Dashboard/host/HostDashboard";

// Public pages imports
import Home from "./pages/Home";
import AccommodationListPage from "./pages/AccommodationListPage";
import AccommodationDetailPage from "./pages/AccommodationDetailPage";
import SearchPage from "./pages/SearchPage";
import BookingPage from "./pages/BookingPage";
import NotFound from "./pages/NotFound";
import CreateListingForm from "./components/accommodation/CreateListingForm";

// Payment components
import PaymentSuccess from "./components/payment/PaymentSuccess";
import StripeCheckout from "./components/payment/StripeCheckout";
import MpesaPayment from "./components/payment/MpesaPayment";

// Admin page imports
import Overview from "./components/Dashboard/admin/pages/Overview";
import Users from "./components/Dashboard/admin/pages/Users";
import Accommodations from "./components/Dashboard/admin/pages/Accommodations";
import Bookings from "./components/Dashboard/admin/pages/Bookings";
import Reviews from "./components/Dashboard/admin/pages/Reviews";
import Settings from "./components/Dashboard/admin/pages/Settings";
import AdminPayments from "./components/Dashboard/admin/pages/Payments";

// Admin Analytics page import
import AdminAnalytics from "./components/Dashboard/admin/pages/Analytics";

// will do

// Host page imports
import HostOverview from "./components/Dashboard/host/pages/Overview";
import HostListings from "./components/Dashboard/host/pages/Listings";
import HostBookings from "./components/Dashboard/host/pages/Bookings";
import HostReviews from "./components/Dashboard/host/pages/Reviews";
import HostAnalytics from "./components/Dashboard/host/pages/Analytics";
import HostProfile from "./components/Dashboard/host/pages/Profile";
import Availability from "./components/Dashboard/host/pages/Availability";
import Earnings from "./components/Dashboard/host/pages/Earnings";
import Verification from "./components/Dashboard/host/pages/Verification";
import HostNotifications from "./components/Dashboard/host/pages/Notifications";
import HostSupport from "./components/Dashboard/host/pages/Support";

// Student page imports
import StudentOverview from "./components/Dashboard/student/pages/Overview";
import StudentBookings from "./components/Dashboard/student/pages/Bookings";
import StudentWishlist from "./components/Dashboard/student/pages/Wishlist";
import StudentReviews from "./components/Dashboard/student/pages/Reviews";
import StudentProfile from "./components/Dashboard/student/pages/Profile";
import FindAccommodation from "./components/Dashboard/student/pages/FindAccommodation";
import StudentPayments from "./components/Dashboard/student/pages/Payments";
import StudentNotifications from "./components/Dashboard/student/pages/Notifications";
import StudentSupport from "./components/Dashboard/student/pages/Support";
import PaymentCheckout from "./components/Dashboard/student/pages/PaymentCheckout";
import AccommodationReviews from "./components/Dashboard/student/pages/AccommodationReviews";

import "./App.css";

function App() {
  return (
    <Routes>
      {/* Public routes - accessible without authentication */}
      <Route path="/" element={<Home />} />

      {/* Public accommodation routes */}
      <Route path="/accommodations" element={<AccommodationListPage />} />
      <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/booking" element={<BookingPage />} />

      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Student dashboard - accessible by student role */}
      <Route
        path="/student"
        element={
          <PrivateRoute roles={["student"]}>
            <StudentDashboard />
          </PrivateRoute>
        }
      >
        {/* Default page - redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Nested student routes */}
        <Route path="dashboard" element={<StudentOverview />} />
        <Route path="find-accommodation" element={<FindAccommodation />} />
        <Route path="my-bookings" element={<StudentBookings />} />
        <Route path="payments" element={<StudentPayments />} />
        <Route path="wishlist" element={<StudentWishlist />} />
        <Route path="my-reviews" element={<StudentReviews />} />
        <Route path="notifications" element={<StudentNotifications />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="support" element={<StudentSupport />} />
        <Route
          path="payment/checkout/:bookingId"
          element={<PaymentCheckout />}
        />
        <Route path="payment/success" element={<PaymentSuccess />} />
        <Route path="reviews/:hostelId" element={<AccommodationReviews />} />
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
        {/* Default page - redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Nested host routes */}
        <Route path="dashboard" element={<HostOverview />} />
        <Route path="my-listings" element={<HostListings />} />
        <Route path="create-listing" element={<CreateListingForm />} />
        <Route path="availability" element={<Availability />} />
        <Route path="bookings" element={<HostBookings />} />
        <Route path="earnings" element={<Earnings />} />
        <Route path="reviews" element={<HostReviews />} />
        <Route path="verification" element={<Verification />} />
        <Route path="notifications" element={<HostNotifications />} />
        <Route path="profile" element={<HostProfile />} />
        <Route path="support" element={<HostSupport />} />
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
        {/* Default page - redirect to dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Nested admin routes */}
        <Route path="dashboard" element={<Overview />} />
        <Route path="users" element={<Users />} />
        <Route path="listings" element={<Accommodations />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="payments" element={<AdminPayments />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analytics" element={<HostAnalytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Redirect legacy /dashboard route to /student/dashboard */}
      <Route
        path="/dashboard"
        element={<Navigate to="/student/dashboard" replace />}
      />

      {/* 404 Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
