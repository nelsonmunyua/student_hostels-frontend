import { NavLink } from "react-router-dom";

const AdminSidebar = ({ menuItems = [], userType = "admin" }) => {
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
      Users: "👥",
      BarChart3: "📈",
      Settings: "⚙️",
    };
    return icons[iconName] || "📄";
  };

  const roleColor = "#7c3aed";

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logoSection}>
        <div style={{ ...styles.logo, backgroundColor: roleColor }}>A</div>
        <div style={styles.logoText}>
          <span style={styles.logoTitle}>Admin Panel</span>
          <span style={styles.logoSubtitle}>System Management</span>
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
          <div style={{ ...styles.userAvatar, backgroundColor: roleColor }}>AD</div>
          <div style={styles.userText}>
            <span style={styles.userName}>Admin User</span>
            <span style={styles.userRole}>Administrator</span>
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
    color: "#7c3aed",
    fontSize: "14px",
    fontWeight: "600",
    backgroundColor: "#f5f3ff",
    borderLeft: "3px solid #7c3aed",
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

export default AdminSidebar;
