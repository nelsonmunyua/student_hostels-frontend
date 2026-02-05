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

// Host Theme Colors - Professional Teal
const theme = {
  primary: "#0d9488", // Teal
  primaryLight: "#f0fdfa",
  primaryHover: "#ccfbf1",
  activeIndicator: "#0d9488",
  text: "#0f766e",
  textMuted: "#64748b",
  darkBg: "#134e4a",
};

const DashboardSidebar = ({ menuItems }) => {
  const location = useLocation();

  return (
    <aside style={styles.sidebar}>
      {/* Sidebar Header with Host Branding */}
      <div style={styles.sidebarHeader}>
        <div style={styles.brandLogo}>
          <div style={styles.hostIcon}>
            <span style={styles.hostIconEmoji}>🏨</span>
          </div>
          <div style={styles.brandText}>
            <span style={styles.brandTextMain}>Host Portal</span>
            <span style={styles.brandTextSub}>Property Management</span>
          </div>
        </div>
      </div>

      {/* Host Badge */}
      <div style={styles.hostBadge}>
        <span style={styles.badgeIcon}>🏠</span>
        <span style={styles.badgeText}>Property Owner</span>
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

      {/* Footer Section - Quick Stats */}
      <div style={styles.sidebarFooter}>
        <div style={styles.statsCard}>
          <div style={styles.statsHeader}>
            <span style={styles.statsIcon}>💰</span>
            <span style={styles.statsTitle}>Earnings</span>
          </div>
          <div style={styles.earningsRow}>
            <span style={styles.earningsLabel}>This Month</span>
            <span style={styles.earningsValue}>$2,450</span>
          </div>
          <div style={styles.earningsProgress}>
            <div style={styles.progressBar}>
              <div style={{ ...styles.progressFill, width: "75%" }}></div>
            </div>
            <span style={styles.progressText}>75% of goal</span>
          </div>
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
    gap: "14px",
  },
  hostIcon: {
    width: "48px",
    height: "48px",
    backgroundColor: "#0d9488",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(13, 148, 136, 0.3)",
  },
  hostIconEmoji: {
    fontSize: "24px",
  },
  brandText: {
    display: "flex",
    flexDirection: "column",
  },
  brandTextMain: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#0d9488",
    letterSpacing: "-0.02em",
  },
  brandTextSub: {
    fontSize: "11px",
    color: "#5eead4",
    fontWeight: 400,
    marginTop: "2px",
  },
  hostBadge: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "0 20px 16px 20px",
    padding: "10px 14px",
    backgroundColor: "#f0fdfa",
    borderRadius: "10px",
    border: "1px solid #99f6e4",
  },
  badgeIcon: {
    fontSize: "14px",
  },
  badgeText: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#0d9488",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "8px 12px",
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
    backgroundColor: "#f0fdfa",
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
  statsCard: {
    backgroundColor: "#f0fdfa",
    borderRadius: "12px",
    padding: "16px",
    border: "1px solid #99f6e4",
  },
  statsHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  statsIcon: {
    fontSize: "16px",
  },
  statsTitle: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#0d9488",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  earningsRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  earningsLabel: {
    fontSize: "13px",
    color: "#64748b",
  },
  earningsValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#0d9488",
  },
  earningsProgress: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  progressBar: {
    width: "100%",
    height: "6px",
    backgroundColor: "#ccfbf1",
    borderRadius: "3px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#0d9488",
    borderRadius: "3px",
  },
  progressText: {
    fontSize: "11px",
    color: "#64748b",
    textAlign: "right",
  },
};

export default DashboardSidebar;
