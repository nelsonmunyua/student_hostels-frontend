import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "./components/Header";
import DashboardSidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import Accommodations from "./pages/Accommodations";
import Bookings from "./pages/Bookings";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import { logoutUser } from "../redux/slices/Thunks/authThunks";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get user from Redux store
  const { user } = useSelector((state) => state.auth);

  // Fallback to localStorage if user not in Redux yet
  const userData = user || JSON.parse(localStorage.getItem("user") || "null");

  // Menu items for sidebar
  const menuItems = [
    { id: "overview", label: "Overview", icon: "Home" },
    { id: "users", label: "Users", icon: "Users" },
    { id: "accommodations", label: "Accommodations", icon: "Home" },
    { id: "bookings", label: "Bookings", icon: "Calendar" },
    { id: "reviews", label: "Reviews", icon: "Star" },
    { id: "settings", label: "Settings", icon: "Settings" },
  ];

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      // Even if logout fails, clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigate("/login", { replace: true });
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "users":
        return <Users />;
      case "accommodations":
        return <Accommodations />;
      case "bookings":
        return <Bookings />;
      case "reviews":
        return <Reviews />;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  // Show loading or placeholder if no user
  if (!userData) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <DashboardHeader
        user={userData}
        userType="admin"
        onLogout={handleLogout}
      />
      <DashboardSidebar
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      <main style={styles.mainContent}>{renderContent()}</main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  mainContent: {
    marginLeft: "260px",
    marginTop: "64px",
    minHeight: "calc(100vh - 64px)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e2e8f0",
    borderTopColor: "#0369a1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};

// Add spinner animation via style tag
const spinnerStyles = `
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

// Inject styles
if (!document.head.querySelector("#admin-spinner-styles")) {
  const styleSheet = document.createElement("style");
  styleSheet.id = "admin-spinner-styles";
  styleSheet.textContent = spinnerStyles;
  document.head.appendChild(styleSheet);
}

export default AdminDashboard;
