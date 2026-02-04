import { Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import ForgotPassword from "./components/auth/ForgotPassword";
import PrivateRoute from "./components/auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./components/dashboard/admin/AdminDashboard";
import "./App.css";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth Routes with shared layout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Student Dashboard */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute roles={["student", "host"]}>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
