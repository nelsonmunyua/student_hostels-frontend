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

const DashboardSidebar = ({ menuItems, activeTab, onTabChange }) => {
  return (
    <aside style={styles.sidebar}>
      <nav style={styles.nav}>
        {menuItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                ...styles.menuItem,
                ...(isActive ? styles.menuItemActive : {}),
              }}
            >
              {Icon && (
                <Icon
                  size={20}
                  color={isActive ? "#0369a1" : "#6b7280"}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              )}
              <span style={styles.menuLabel}>{item.label}</span>
              {isActive && <div style={styles.activeIndicator} />}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    position: "fixed",
    left: 0,
    top: "64px",
    width: "260px",
    height: "calc(100vh - 64px)",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "24px 0",
    overflowY: "auto",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "0 16px",
  },
  menuItem: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    fontSize: "14px",
    fontWeight: 500,
    color: "#6b7280",
  },
  menuItemActive: {
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
  },
  menuLabel: {
    flex: 1,
  },
  activeIndicator: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)",
    width: "3px",
    height: "20px",
    backgroundColor: "#0369a1",
    borderRadius: "2px 0 0 2px",
  },
};

export default DashboardSidebar;