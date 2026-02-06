import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Home,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const Overview = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);

  // Mock data for stats
  const stats = [
    {
      label: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "#0369a1",
      bgColor: "#f0f9ff",
    },
    {
      label: "Active Hostels",
      value: "89",
      change: "+5%",
      icon: Home,
      color: "#0d9488",
      bgColor: "#f0fdfa",
    },
    {
      label: "Total Bookings",
      value: "567",
      change: "+23%",
      icon: Calendar,
      color: "#7c3aed",
      bgColor: "#f5f3ff",
    },
    {
      label: "Revenue",
      value: "$45,678",
      change: "+18%",
      icon: DollarSign,
      color: "#059669",
      bgColor: "#ecfdf5",
    },
  ];

  // Mock data for recent activity
  const recentActivity = [
    {
      id: 1,
      user: "John Doe",
      action: "Booked a room",
      hostel: "University View Hostel",
      time: "2 hours ago",
      type: "booking",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Registered as student",
      hostel: "-",
      time: "3 hours ago",
      type: "registration",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Left a review",
      hostel: "Central Student Living",
      time: "5 hours ago",
      type: "review",
    },
    {
      id: 4,
      user: "Sarah Wilson",
      action: "Updated profile",
      hostel: "-",
      time: "6 hours ago",
      type: "profile",
    },
    {
      id: 5,
      user: "Tom Brown",
      action: "Booked a room",
      hostel: "Campus Edge Apartments",
      time: "8 hours ago",
      type: "booking",
    },
  ];

  // Mock data for quick actions
  const quickActions = [
    {
      label: "Add New Hostel",
      icon: Home,
      color: "#0369a1",
      action: "add-hostel",
    },
    {
      label: "View All Users",
      icon: Users,
      color: "#7c3aed",
      action: "view-users",
    },
    {
      label: "Generate Report",
      icon: Activity,
      color: "#059669",
      action: "generate-report",
    },
    {
      label: "Manage Bookings",
      icon: Calendar,
      color: "#ea580c",
      action: "manage-bookings",
    },
  ];

  // Handle export report
  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      alert("Report exported successfully! (Demo)");
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export report");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle quick action click
  const handleQuickAction = (action) => {
    switch (action) {
      case "add-hostel":
        navigate("/admin/accommodations", { state: { showAddModal: true } });
        break;
      case "view-users":
        navigate("/admin/users");
        break;
      case "generate-report":
        handleExportReport();
        break;
      case "manage-bookings":
        navigate("/admin/bookings");
        break;
      default:
        break;
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Dashboard Overview</h1>
          <p style={styles.subtitle}>
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div style={styles.headerActions}>
          <button
            style={styles.exportBtn}
            onClick={handleExportReport}
            disabled={isExporting}
          >
            {isExporting ? (
              <span className="spinner spinner-sm"></span>
            ) : (
              <TrendingUp size={18} />
            )}
            {isExporting ? "Exporting..." : "Export Report"}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statHeader}>
              <div
                style={{ ...styles.statIcon, backgroundColor: stat.bgColor }}
              >
                <stat.icon size={24} color={stat.color} />
              </div>
              <span style={styles.statChange}>{stat.change}</span>
            </div>
            <div style={styles.statValue}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={styles.contentGrid}>
        {/* Recent Activity */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <Clock size={20} />
              Recent Activity
            </h2>
            <button
              style={styles.viewAllBtn}
              onClick={() => navigate("/admin/bookings")}
            >
              View All
            </button>
          </div>
          <div style={styles.activityList}>
            {recentActivity.map((activity) => (
              <div key={activity.id} style={styles.activityItem}>
                <div style={styles.activityIconWrapper}>
                  <div
                    style={{
                      ...styles.activityIcon,
                      backgroundColor:
                        activity.type === "booking"
                          ? "#f0f9ff"
                          : activity.type === "review"
                            ? "#f5f3ff"
                            : activity.type === "registration"
                              ? "#ecfdf5"
                              : "#fef3c7",
                    }}
                  >
                    <Activity
                      size={16}
                      color={
                        activity.type === "booking"
                          ? "#0369a1"
                          : activity.type === "review"
                            ? "#7c3aed"
                            : activity.type === "registration"
                              ? "#059669"
                              : "#d97706"
                      }
                    />
                  </div>
                </div>
                <div style={styles.activityContent}>
                  <p style={styles.activityText}>
                    <strong>{activity.user}</strong> {activity.action}
                  </p>
                  {activity.hostel !== "-" && (
                    <span style={styles.activityHostel}>{activity.hostel}</span>
                  )}
                  <span style={styles.activityTime}>{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>
              <ArrowUpRight size={20} />
              Quick Actions
            </h2>
          </div>
          <div style={styles.quickActions}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                style={styles.quickActionBtn}
                onClick={() => handleQuickAction(action.action)}
              >
                <div
                  style={{
                    ...styles.quickActionIcon,
                    backgroundColor: `${action.color}15`,
                  }}
                >
                  <action.icon size={22} color={action.color} />
                </div>
                <span style={styles.quickActionLabel}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div style={styles.bottomGrid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Popular Hostels</h2>
          </div>
          <div style={styles.hostelList}>
            {[
              { name: "University View", rooms: 45, occupancy: 92 },
              { name: "Central Student Living", rooms: 38, occupancy: 87 },
              { name: "Campus Edge", rooms: 52, occupancy: 78 },
              { name: "Student Haven", rooms: 30, occupancy: 95 },
            ].map((hostel, index) => (
              <div key={index} style={styles.hostelItem}>
                <div>
                  <div style={styles.hostelName}>{hostel.name}</div>
                  <div style={styles.hostelRooms}>{hostel.rooms} rooms</div>
                </div>
                <div style={styles.occupancyWrapper}>
                  <div style={styles.occupancyBar}>
                    <div
                      style={{
                        ...styles.occupancyFill,
                        width: `${hostel.occupancy}%`,
                        backgroundColor:
                          hostel.occupancy > 90
                            ? "#059669"
                            : hostel.occupancy > 80
                              ? "#0369a1"
                              : "#d97706",
                      }}
                    />
                  </div>
                  <span style={styles.occupancyText}>{hostel.occupancy}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Booking Trends</h2>
          </div>
          <div style={styles.trendsContent}>
            <div style={styles.trendStat}>
              <span style={styles.trendLabel}>This Month</span>
              <span style={styles.trendValue}>156</span>
            </div>
            <div style={styles.trendStat}>
              <span style={styles.trendLabel}>Last Month</span>
              <span style={styles.trendValue}>134</span>
            </div>
            <div style={styles.trendGrowth}>
              <TrendingUp size={20} color="#059669" />
              <span>+16.4% increase</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  exportBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#0369a1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  statHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statChange: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#059669",
    backgroundColor: "#ecfdf5",
    padding: "4px 8px",
    borderRadius: "6px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748b",
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "24px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  cardTitle: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
  },
  viewAllBtn: {
    backgroundColor: "transparent",
    color: "#0369a1",
    border: "none",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  activityList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  activityItem: {
    display: "flex",
    gap: "12px",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  activityIconWrapper: {
    flexShrink: 0,
  },
  activityIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: "14px",
    color: "#334155",
    margin: "0 0 4px 0",
  },
  activityHostel: {
    display: "block",
    fontSize: "13px",
    color: "#0369a1",
    fontWeight: 500,
    marginBottom: "2px",
  },
  activityTime: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  quickActions: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
  },
  quickActionBtn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "20px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  quickActionIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  hostelList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  hostelItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  hostelName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1e293b",
  },
  hostelRooms: {
    fontSize: "12px",
    color: "#64748b",
  },
  occupancyWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  occupancyBar: {
    width: "100px",
    height: "6px",
    backgroundColor: "#e2e8f0",
    borderRadius: "3px",
    overflow: "hidden",
  },
  occupancyFill: {
    height: "100%",
    borderRadius: "3px",
    transition: "width 0.3s",
  },
  occupancyText: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
    minWidth: "36px",
  },
  trendsContent: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  trendStat: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  trendLabel: {
    fontSize: "14px",
    color: "#64748b",
  },
  trendValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1e293b",
  },
  trendGrowth: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px",
    backgroundColor: "#ecfdf5",
    borderRadius: "8px",
    color: "#059669",
    fontWeight: 600,
    fontSize: "14px",
  },
};

export default Overview;
