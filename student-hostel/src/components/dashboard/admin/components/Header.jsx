import { LogOut, User, Bell } from "lucide-react";

const DashboardHeader = ({ user, userType, onLogout }) => {
  const getUserTypeLabel = () => {
    switch (userType) {
      case "student":
        return "Student";
      case "host":
        return "Host";
      case "admin":
        return "Administrator";
      default:
        return "User";
    }
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🏠</span>
            <span style={styles.brandName}>StudentHostel</span>
          </div>
          <span style={styles.userTypeBadge}>{getUserTypeLabel()}</span>
        </div>

        <div style={styles.rightSection}>
          {/* Notifications */}
          <button style={styles.iconButton}>
            <Bell size={20} />
            <span style={styles.notificationBadge}>3</span>
          </button>

          {/* User Info */}
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {user?.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.first_name}
                  style={styles.avatarImg}
                />
              ) : (
                <User size={20} color="#666" />
              )}
            </div>
            <div style={styles.userDetails}>
              <span style={styles.userName}>
                {user?.first_name} {user?.last_name}
              </span>
              <span style={styles.userEmail}>{user?.email}</span>
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
    height: "64px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    zIndex: 1000,
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },
  container: {
    height: "100%",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logoIcon: {
    fontSize: "28px",
  },
  brandName: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1a1a1a",
    letterSpacing: "-0.02em",
  },
  userTypeBadge: {
    padding: "4px 12px",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  iconButton: {
    position: "relative",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  notificationBadge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    width: "18px",
    height: "18px",
    backgroundColor: "#ef4444",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "10px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#f3f4f6",
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
  userDetails: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  userEmail: {
    fontSize: "12px",
    color: "#6b7280",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

export default DashboardHeader;
