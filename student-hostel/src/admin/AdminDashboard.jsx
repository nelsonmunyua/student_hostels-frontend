import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import DashboardHeader from "./components/Header";
import DashboardSidebar from "./components/Sidebar";
import { logoutUser } from "../redux/slices/Thunks/authThunks";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  // Menu items for sidebar - use paths instead of callbacks
  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      path: "/admin/overview",
      icon: "Home",
    },
    { id: "users", label: "Users", path: "/admin/users", icon: "Users" },
    {
      id: "accommodations",
      label: "Accommodations",
      path: "/admin/accommodations",
      icon: "Home",
    },
    {
      id: "bookings",
      label: "Bookings",
      path: "/admin/bookings",
      icon: "Calendar",
    },
    { id: "reviews", label: "Reviews", path: "/admin/reviews", icon: "Star" },
    {
      id: "settings",
      label: "Settings",
      path: "/admin/settings",
      icon: "Settings",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <DashboardHeader userType="admin" onLogout={handleLogout} />
      </div>
      <div style={styles.sidebarWrapper}>
        <DashboardSidebar menuItems={menuItems} />
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

export default AdminDashboard;
