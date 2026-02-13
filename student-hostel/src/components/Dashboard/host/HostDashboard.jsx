import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import DashboardHeader from "./components/Header.jsx";
import DashboardSidebar from "./components/Sidebar.jsx";
import { logoutUser } from "../../../redux/slices/Thunks/authThunks";

const HostDashboard = () => {
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

  // Host menu items - exact from specification
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: "/host/dashboard",
      icon: "LayoutDashboard",
    },
    {
      id: "my-listings",
      label: "My Listings",
      path: "/host/my-listings",
      icon: "Home",
    },
    {
      id: "availability",
      label: "Availability",
      path: "/host/availability",
      icon: "Calendar",
    },
    {
      id: "bookings",
      label: "Bookings",
      path: "/host/bookings",
      icon: "BookOpen",
    },
    {
      id: "earnings",
      label: "Earnings",
      path: "/host/earnings",
      icon: "DollarSign",
    },
    {
      id: "reviews",
      label: "Reviews",
      path: "/host/reviews",
      icon: "Star",
    },
    {
      id: "verification",
      label: "Verification",
      path: "/host/verification",
      icon: "Shield",
    },
    {
      id: "notifications",
      label: "Notifications",
      path: "/host/notifications",
      icon: "Bell",
    },
    {
      id: "profile",
      label: "Profile",
      path: "/host/profile",
      icon: "User",
    },
    {
      id: "support",
      label: "Support",
      path: "/host/support",
      icon: "HelpCircle",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <DashboardHeader userType="host" onLogout={handleLogout} />
      </div>
      <div style={styles.sidebarWrapper}>
        <DashboardSidebar menuItems={menuItems} userType="host" />
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

export default HostDashboard;
