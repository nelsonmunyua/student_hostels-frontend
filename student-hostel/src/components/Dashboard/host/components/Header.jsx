import { LogOut, Bell, Shield, User as UserIcon, Home } from "lucide-react";
import { useSelector } from "react-redux";

// Theme colors based on userType
const getTheme = (userType) => {
  const themes = {
    admin: {
      primary: "#7c3aed",
      darkBg: "#1e1b4b",
      brandIcon: "🛡️",
      brandName: "StudentHostel",
      brandTagline: "Admin Management System",
      roleIcon: Shield,
      roleText: "Administrator",
    },
    host: {
      primary: "#059669",
      darkBg: "#064e3b",
      brandIcon: "🏠",
      brandName: "StudentHostel",
      brandTagline: "Host Management",
      roleIcon: Home,
      roleText: "Property Host",
    },
    student: {
      primary: "#3b82f6",
      darkBg: "#1e3a8a",
      brandIcon: "🎓",
      brandName: "StudentHostel",
      brandTagline: "Student Portal",
      roleIcon: UserIcon,
      roleText: "Student",
    },
  };

  return themes[userType] || themes.student;
};

const DashboardHeader = ({ userType = "student", onLogout }) => {
  const { user } = useSelector((state) => state.auth);
  const theme = getTheme(userType);
  const RoleIcon = theme.roleIcon;

  // Get current date
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header style={{ ...styles.header, backgroundColor: theme.darkBg }}>
      <div style={styles.container}>
        {/* Left Section - Brand */}
        <div style={styles.brand}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>{theme.brandIcon}</span>
            <div style={styles.brandText}>
              <span style={styles.brandName}>{theme.brandName}</span>
              <span style={styles.brandTagline}>{theme.brandTagline}</span>
            </div>
          </div>
        </div>

        {/* Center Section - Date Display */}
        <div style={styles.centerSection}>
          <div
            style={{
              ...styles.dateDisplay,
              backgroundColor: `${theme.primary}25`,
              borderColor: `${theme.primary}40`,
            }}
          >
            <span style={styles.dateIcon}>📅</span>
            <span style={styles.dateText}>{currentDate}</span>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div style={styles.rightSection}>
          {/* Notifications */}
          <button
            style={{
              ...styles.iconButton,
              backgroundColor: `${theme.primary}25`,
              borderColor: `${theme.primary}50`,
            }}
          >
            <Bell size={20} color={theme.primary} />
            <span style={styles.notificationBadge}>3</span>
          </button>

          {/* User Badge */}
          <div style={styles.userBadge}>
            <div style={{ ...styles.userAvatar, backgroundColor: theme.primary }}>
              <RoleIcon size={18} color="#ffffff" />
            </div>
            <div style={styles.userInfo}>
              <span style={styles.userName}>
                {user?.first_name || "User"} {user?.last_name || ""}
              </span>
              <span style={styles.userRole}>{theme.roleText}</span>
            </div>
          </div>

          {/* Logout Button */}
          <button style={styles.logoutButton} onClick={onLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "72px",
    borderBottom: "1px solid rgba(124, 58, 237, 0.2)",
    zIndex: 1000,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  container: {
    height: "100%",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    maxWidth: "1600px",
    margin: "0 auto",
  },
  brand: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    fontSize: "32px",
  },
  brandText: {
    display: "flex",
    flexDirection: "column",
  },
  brandName: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },
  brandTagline: {
    fontSize: "11px",
    color: "#a5b4fc",
    fontWeight: 400,
  },
  centerSection: {
    display: "flex",
    alignItems: "center",
  },
  dateDisplay: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "20px",
    border: "1px solid",
  },
  dateIcon: {
    fontSize: "14px",
  },
  dateText: {
    fontSize: "13px",
    color: "#c4b5fd",
    fontWeight: 500,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  iconButton: {
    position: "relative",
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  notificationBadge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    width: "20px",
    height: "20px",
    backgroundColor: "#ef4444",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "11px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid #1e1b4b",
  },
  userBadge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "6px 12px 6px 6px",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "12px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  },
  userAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#ffffff",
  },
  userRole: {
    fontSize: "11px",
    color: "#a5b4fc",
    fontWeight: 400,
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    color: "#fca5a5",
    border: "1px solid rgba(239, 68, 68, 0.3)",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

export default DashboardHeader;