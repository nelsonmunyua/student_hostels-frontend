import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import DashboardHeader from "./components/Header.jsx";
import DashboardSidebar from "./components/Sidebar.jsx";
import { logoutUser } from "../../../redux/slices/Thunks/authThunks";
import { useEffect } from "react";

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

  // Inject responsive styles on mount
  useEffect(() => {
    // Create and inject stylesheet
    const styleId = 'student-dashboard-styles';
    let stylesheet = document.getElementById(styleId);
    
    if (!stylesheet) {
      stylesheet = document.createElement('style');
      stylesheet.id = styleId;
      stylesheet.textContent = cssStyles;
      document.head.appendChild(stylesheet);
    }
    
    // Cleanup on unmount
    return () => {
      const existing = document.getElementById(styleId);
      if (existing && document.head.contains(existing)) {
        document.head.removeChild(existing);
      }
    };
  }, []);

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

export default StudentDashboard;

