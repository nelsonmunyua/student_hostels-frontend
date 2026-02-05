import {
  LayoutDashboard,
  Calendar,
  Heart,
  Star,
  Settings,
  Home,
  Users,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const iconMap = {
  LayoutDashboard,
  Calendar,
  Heart,
  Star,
  Settings,
  Home,
  Users,
  BarChart3,
  DollarSign,
};

// Student Theme Colors
const theme = {
  primary: "#3b82f6", // Blue
  primaryLight: "#eff6ff",
  primaryHover: "#dbeafe",
  activeIndicator: "#3b82f6",
  text: "#1e40af",
  textMuted: "#64748b",
};

const DashboardSidebar = ({ menuItems }) => {
  const location = useLocation();

  return (
    <aside style={styles.sidebar}>
      {/* Sidebar Header with Student Branding */}
      <div style={styles.sidebarHeader}>
        <div style={styles.brandLogo}>
          <span style={styles.logoIcon}>🎓</span>
          <span style={styles.brandText}>Student Portal</span>
        </div>
      </div>

      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon];
          // Check if this item is active based on current path
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.menuItem,
                ...(isActive ? styles.menuItemActive : {}),
              })}
            >
              {Icon && (
                <Icon
                  size={20}
                  color={isActive ? theme.primary : theme.textMuted}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              )}
              <span
                style={{
                  ...styles.menuLabel,
                  color: isActive ? theme.primary : theme.textMuted,
                  fontWeight: isActive ? 600 : 500,
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  style={{
                    ...styles.activeIndicator,
                    backgroundColor: theme.activeIndicator,
                  }}
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div style={styles.sidebarFooter}>
        <div style={styles.footerCard}>
          <span style={styles.footerIcon}>💡</span>
          <span style={styles.footerText}>Need help?</span>
          <button style={styles.helpButton}>Contact Support</button>
        </div>
      </div>
    </aside>
  );
};

const styles = {
  sidebar: {
    position: "fixed",
    left: 0,
    top: "64px",
    width: "280px",
    height: "calc(100vh - 64px)",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    padding: "0",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    boxShadow: "2px 0 8px rgba(0, 0, 0, 0.02)",
  },
  sidebarHeader: {
    padding: "20px 20px 16px 20px",
    borderBottom: "1px solid #f1f5f9",
  },
  brandLogo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logoIcon: {
    fontSize: "32px",
  },
  brandText: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#3b82f6",
    letterSpacing: "-0.02em",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "16px 12px",
    flex: 1,
  },
  menuItem: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    textDecoration: "none",
  },
  menuItemActive: {
    backgroundColor: "#eff6ff",
  },
  menuLabel: {
    flex: 1,
  },
  activeIndicator: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: "4px",
    height: "24px",
    borderRadius: "2px 0 0 2px",
  },
  sidebarFooter: {
    padding: "16px",
    borderTop: "1px solid #f1f5f9",
  },
  footerCard: {
    backgroundColor: "#eff6ff",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
  },
  footerIcon: {
    fontSize: "24px",
    display: "block",
    marginBottom: "8px",
  },
  footerText: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#3b82f6",
    marginBottom: "12px",
  },
  helpButton: {
    width: "100%",
    padding: "8px 16px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

export default DashboardSidebar;
