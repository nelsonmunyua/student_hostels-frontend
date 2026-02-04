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
      <DashboardHeader userType="admin" onLogout={handleLogout} />
      <DashboardSidebar menuItems={menuItems} />
      <main style={styles.mainContent}>
        <Outlet />
      </main>
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
