import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const HostSidebar = ({ menuItems = [], userType = "host" }) => {
  const { user } = useSelector((state) => state.auth);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.first_name) {
      return user.first_name.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    // Fallback to role-based initials
    return userType === "host" ? "HO" : "AD";
  };

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) {
      return user.first_name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    // Fallback to role-based name
    return userType === "host" ? "Host User" : "Admin User";
  };

  const getIcon = (iconName) => {
    const icons = {
      LayoutDashboard: "📊",
      Home: "🏠",
      Calendar: "📅",
      DollarSign: "💰",
      Star: "⭐",
      Bell: "🔔",
      User: "👤",
      HelpCircle: "❓",
      BookOpen: "📖",
      Shield: "🛡️",
      BarChart: "📊",
      Clock: "🕐",
    };
    return icons[iconName] || "📄";
  };

  const roleColor = "#059669";

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoSection}>
        <div style={{ ...styles.logo, backgroundColor: roleColor }}>H</div>
        <div style={styles.logoText}>
          <span style={styles.logoTitle}>Host Portal</span>
          <span style={styles.logoSubtitle}>Property Management</span>
        </div>
      </div>

      <nav style={styles.nav}>
        <ul style={styles.navList}>
          {menuItems.map((item) => (
            <li key={item.id} style={styles.navItem}>
              <NavLink
                to={item.path}
                style={({ isActive }) =>
                  isActive ? styles.activeNavLink : styles.navLink
                }
              >
                <span style={styles.navIcon}>{getIcon(item.icon)}</span>
                <span style={styles.navLabel}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div style={styles.footer}>
        <div style={styles.userInfo}>
          <div style={{ ...styles.userAvatar, backgroundColor: roleColor }}>
            {getUserInitials()}
          </div>
          <div style={styles.userText}>
            <span style={styles.userName}>{getUserDisplayName()}</span>
            <span style={styles.userRole}>Property Host</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.02)",
  },
  logoSection: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid #e2e8f0",
  },
  logo: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "700",
    fontSize: "18px",
  },
  logoText: {
    display: "flex",
    flexDirection: "column",
  },
  logoTitle: {
    fontWeight: "700",
    fontSize: "16px",
    color: "#1e293b",
  },
  logoSubtitle: {
    fontSize: "12px",
    color: "#64748b",
  },
  nav: {
    flex: 1,
    padding: "16px 12px",
    overflowY: "auto",
  },
  navList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  navItem: {
    margin: 0,
    padding: 0,
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "500",
    transition: "all 0.2s ease",
  },
  activeNavLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    color: "#059669",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#f0fdf4",
    borderLeft: "3px solid #059669",
    transition: "all 0.2s ease",
  },
  navIcon: {
    fontSize: "18px",
    width: "24px",
    textAlign: "center",
  },
  navLabel: {
    flex: 1,
  },
  footer: {
    padding: "16px",
    borderTop: "1px solid #e2e8f0",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
  },
  userText: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontWeight: "600",
    fontSize: "14px",
    color: "#1e293b",
  },
  userRole: {
    fontSize: "12px",
    color: "#64748b",
  },
};

export default HostSidebar;
