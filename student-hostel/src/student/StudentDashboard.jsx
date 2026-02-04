import { useState } from "react";
import useAuth from "../hooks/useAuth";
import DashboardHeader from "./components/Header";
import DashboardSidebar from "./components/Sidebar";
import StudentOverview from "./pages/Overview";
import StudentBookings from "./pages/Bookings";
import StudentWishlist from "./pages/Wishlist";
import StudentReviews from "./pages/Reviews";
import StudentProfile from "./pages/Profile";

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <StudentOverview user={user} />;
      case "bookings":
        return <StudentBookings user={user} />;
      case "wishlist":
        return <StudentWishlist user={user} />;
      case "reviews":
        return <StudentReviews user={user} />;
      case "profile":
        return <StudentProfile user={user} />;
      default:
        return <StudentOverview user={user} />;
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: "LayoutDashboard" },
    { id: "bookings", label: "My Bookings", icon: "Calendar" },
    { id: "wishlist", label: "Wishlist", icon: "Heart" },
    { id: "reviews", label: "My Reviews", icon: "Star" },
    { id: "profile", label: "Profile Settings", icon: "Settings" },
  ];

  return (
    <div style={styles.container}>
      <DashboardHeader
        user={user}
        userType="student"
        onLogout={handleLogout}
      />
      <div style={styles.mainLayout}>
        <DashboardSidebar
          menuItems={menuItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <main style={styles.content}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
  },
  mainLayout: {
    display: "flex",
    paddingTop: "64px", // Header height
  },
  content: {
    flex: 1,
    padding: "24px",
    marginLeft: "260px", // Sidebar width
    minHeight: "calc(100vh - 64px)",
  },
};

export default StudentDashboard;