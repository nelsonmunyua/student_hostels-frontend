import React, { useState } from "react";
import DashboardHeader from "./components/Header";
import DashboardSidebar from "./components/Sidebar";
import Overview from "./pages/Overview";
import Accommodations from "./pages/Accommodations";
import Bookings from "./pages/Bookings";
import Reviews from "./pages/Reviews";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import { LogOut } from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data
  const user = {
    first_name: "Admin",
    last_name: "User",
    email: "admin@studenthostel.com",
    profile_picture: null,
  };

  // Menu items for sidebar
  const menuItems = [
    { id: "overview", label: "Overview", icon: "Home" },
    { id: "users", label: "Users", icon: "Users" },
    { id: "accommodations", label: "Accommodations", icon: "Home" },
    { id: "bookings", label: "Bookings", icon: "Calendar" },
    { id: "reviews", label: "Reviews", icon: "Star" },
    { id: "settings", label: "Settings", icon: "Settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
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

  return (
    <div style={styles.container}>
      <DashboardHeader user={user} userType="admin" onLogout={handleLogout} />
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
};

export default AdminDashboard;
