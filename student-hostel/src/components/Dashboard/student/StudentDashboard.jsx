import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import DashboardHeader from "./components/Header.jsx";
import DashboardSidebar from "./components/Sidebar.jsx";
import { logoutUser } from "../../../redux/slices/Thunks/authThunks";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigate("/login", { replace: true });
  };

  // Student menu items - exact from specification
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/student/dashboard",
      icon: "LayoutDashboard",
    },
    {
      id: "find-accommodation",
      label: "Find Accommodation",
      path: "/student/find-accommodation",
      icon: "Home",
    },
    {
      id: "my-bookings",
      label: "My Bookings",
      path: "/student/my-bookings",
      icon: "Calendar",
    },
    {
      id: "payments",
      label: "Payments",
      path: "/student/payments",
      icon: "DollarSign",
    },
    {
      id: "wishlist",
      label: "Wishlist",
      path: "/student/wishlist",
      icon: "Heart",
    },
    {
      id: "my-reviews",
      label: "My Reviews",
      path: "/student/my-reviews",
      icon: "Star",
    },
    {
      id: "notifications",
      label: "Notifications",
      path: "/student/notifications",
      icon: "Bell",
    },
    {
      id: "profile",
      label: "Profile",
      path: "/student/profile",
      icon: "User",
    },
    {
      id: "support",
      label: "Support",
      path: "/student/support",
      icon: "HelpCircle",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <DashboardHeader userType="student" onLogout={handleLogout} />
      </div>
      <div style={styles.sidebarWrapper}>
        <DashboardSidebar menuItems={menuItems} userType="student" />
      </div>
      <main style={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  sidebarWrapper: {
    position: "fixed",
    top: "72px",
    left: 0,
    width: "280px",
    height: "calc(100vh - 72px)",
  },
  mainContent: {
    flex: 1,
    marginLeft: "280px",
    marginTop: "72px",
    minHeight: "calc(100vh - 72px)",
    backgroundColor: "#f8fafc",
  },
};

export default StudentDashboard;