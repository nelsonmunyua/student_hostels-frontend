import { Outlet, useNavigate } from "react-router-dom";
import DashboardHeader from "./components/Header";
import DashboardSidebar from "./components/sidebar";
import { logoutUser } from "../redux/slices/Thunks/authThunks";
import { useDispatch, useSelector } from "react-redux";

const HostDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

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

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      path: "/host/overview",
      icon: "LayoutDashboard",
    },
    {
      id: "listings",
      label: "My Listings",
      path: "/host/listings",
      icon: "Home",
    },
    {
      id: "bookings",
      label: "Bookings",
      path: "/host/bookings",
      icon: "Calendar",
    },
    { id: "reviews", label: "Reviews", path: "/host/reviews", icon: "Star" },
    {
      id: "analytics",
      label: "Analytics",
      path: "/host/analytics",
      icon: "BarChart3",
    },
    {
      id: "profile",
      label: "Profile Settings",
      path: "/host/profile",
      icon: "Settings",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <DashboardHeader user={user} userType="host" onLogout={handleLogout} />
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
  },
};

export default HostDashboard;
