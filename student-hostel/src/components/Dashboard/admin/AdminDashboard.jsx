import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import DashboardHeader from "./components/Header.jsx";
import DashboardSidebar from "./components/Sidebar.jsx";
import { logoutUser } from "../../../redux/slices/Thunks/authThunks";

const AdminDashboard = () => {
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

  // Admin menu items - exact from specification
  const menuItems = [
    {
      id: "dashboard",
      label: "Admin Dashboard",
      path: "/admin/dashboard",
      icon: "LayoutDashboard",
    },
    {
      id: "users",
      label: "Users",
      path: "/admin/users",
      icon: "Users",
    },
    {
      id: "listings",
      label: "Listings",
      path: "/admin/listings",
      icon: "Home",
    },
    {
      id: "bookings",
      label: "Bookings",
      path: "/admin/bookings",
      icon: "Calendar",
    },
    {
      id: "payments",
      label: "Payments",
      path: "/admin/payments",
      icon: "DollarSign",
    },
    {
      id: "reviews",
      label: "Reviews",
      path: "/admin/reviews",
      icon: "Star",
    },
    {
      id: "analytics",
      label: "Analytics",
      path: "/admin/analytics",
      icon: "BarChart3",
    },
    {
      id: "settings",
      label: "Settings",
      path: "/admin/settings",
      icon: "Settings",
    },
    {
      id: "support",
      label: "Support Tickets",
      path: "/admin/support",
      icon: "MessageSquare",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <DashboardHeader userType="admin" onLogout={handleLogout} />
      </div>
      <div style={styles.sidebarWrapper}>
        <DashboardSidebar menuItems={menuItems} userType="admin" />
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
    zIndex: 900,
  },
  mainContent: {
    flex: 1,
    marginLeft: "280px",
    marginTop: "72px",
    minHeight: "calc(100vh - 72px)",
    backgroundColor: "#f8fafc",
    padding: "24px",
  },
};

// CSS for responsive design
const cssStyles = `
  @media (max-width: 1024px) {
    .sidebarWrapper {
      width: 240px !important;
    }
    .mainContent {
      margin-left: 240px !important;
    }
  }
  @media (max-width: 768px) {
    .sidebarWrapper {
      display: none !important;
    }
    .mainContent {
      margin-left: 0 !important;
      padding: 16px !important;
    }
  }
`;

// Inject CSS styles
const styleSheet = document.createElement("style");
styleSheet.innerText = cssStyles;
document.head.appendChild(styleSheet);

export default AdminDashboard;
