import { LogOut, User, Bell, BookOpen } from "lucide-react";
import { useSelector } from "react-redux";

// Student Theme Colors
const theme = {
  primary: "#3b82f6",
  primaryLight: "#eff6ff",
  primaryHover: "#dbeafe",
  accent: "#1d4ed8",
};

const DashboardHeader = ({ user, userType, onLogout }) => {
  // Get user from Redux if not provided as prop
  const reduxUser = useSelector((state) => state.auth.user);
  const displayUser = user || reduxUser;

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Left Section - Brand */}
        <div style={styles.brand}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🎓</span>
            <div style={styles.brandText}>
              <span style={styles.brandName}>StudentHostel</span>
              <span style={styles.brandTagline}>Find your perfect stay</span>
            </div>
          </div>
        </div>

        {/* Center Section - Quick Links */}
        <div style={styles.centerSection}>
          <a href="/browse" style={styles.quickLink}>
            <BookOpen size={16} />
            <span>Browse Hostels</span>
          </a>
        </div>

        {/* Right Section - User Actions */}
        <div style={styles.rightSection}>
          {/* Notifications */}
          <button style={styles.iconButton}>
            <Bell size={20} color={theme.primary} />
            <span style={styles.notificationBadge}>3</span>
          </button>

          {/* User Info */}
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {displayUser?.profile_picture ? (
                <img
                  src={displayUser.profile_picture}
                  alt={displayUser.first_name}
                  style={styles.avatarImg}
                />
              ) : displayUser?.first_name ? (
                <span style={styles.avatarInitial}>
                  {displayUser.first_name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={20} color="#666" />
              )}
            </div>
            <div style={styles.userDetails}>
              <span style={styles.userName}>
                {displayUser?.first_name || "Student"}{" "}
                {displayUser?.last_name || ""}
              </span>
              <span style={styles.userRole}>Student Account</span>
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
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    zIndex: 1000,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
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
    fontSize: "36px",
  },
  brandText: {
    display: "flex",
    flexDirection: "column",
  },
  brandName: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1e293b",
    letterSpacing: "-0.02em",
    lineHeight: 1.2,
  },
  brandTagline: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: 400,
  },
  centerSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  quickLink: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: 500,
    textDecoration: "none",
    transition: "all 0.2s",
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
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
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
    border: "2px solid #ffffff",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "6px 12px 6px 6px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarInitial: {
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 600,
  },
  userDetails: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1e293b",
  },
  userRole: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: 400,
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

export default DashboardHeader;
