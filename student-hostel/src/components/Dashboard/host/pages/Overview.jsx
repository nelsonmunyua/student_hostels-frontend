import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
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
import hostApi from "../../../../api/hostApi";

const HostOverview = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isExporting, setIsExporting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_hostels: 0,
    total_rooms: 0,
    active_bookings: 0,
    pending_bookings: 0,
    total_earnings: 0,
    avg_rating: 0,
    total_reviews: 0,
    verified: false,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await hostApi.getDashboard();
        setStats(data.stats);
        setRecentBookings(data.recent_bookings || []);
        setRecentReviews(data.recent_reviews || []);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Stats for display
  const statsData = [
    {
      label: "Total Hostels",
      value: loading ? "..." : (stats.total_hostels || 0).toString(),
      change: "+12%",
      icon: Home,
      color: "#059669",
      bgColor: "#f0fdf4",
    },
    {
      label: "Total Rooms",
      value: loading ? "..." : (stats.total_rooms || 0).toString(),
      change: "+5%",
      icon: Calendar,
      color: "#0369a1",
      bgColor: "#f0f9ff",
    },
    {
      label: "Active Bookings",
      value: loading ? "..." : ((stats.active_hostels || 0) > 0 ? (stats.total_rooms || 0) : "0").toString(),
      change: "+23%",
      icon: Users,
      color: "#7c3aed",
      bgColor: "#f5f3ff",
    },
    {
      label: "Total Earnings",
      value: loading ? "..." : `KES ${(stats.total_earnings || 0).toLocaleString()}`,
      change: "+18%",
      icon: DollarSign,
      color: "#059669",
      bgColor: "#ecfdf5",
    },
  ];

  // Mock data for recent activity (in real app, fetch from API)
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
      action: "Left a review",
      hostel: "Central Student Living",
      time: "5 hours ago",
      type: "review",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Sent message",
      hostel: "-",
      time: "1 day ago",
      type: "message",
    },
  ];

  // Mock data for quick actions
  const quickActions = [
    {
      label: "Add New Listing",
      icon: Home,
      color: "#059669",
      action: "add-listing",
    },
    {
      label: "View Bookings",
      icon: Calendar,
      color: "#0369a1",
      action: "view-bookings",
    },
    {
      label: "View Earnings",
      icon: DollarSign,
      color: "#059669",
      action: "view-earnings",
    },
    {
      label: "Edit Profile",
      icon: Users,
      color: "#7c3aed",
      action: "edit-profile",
    },
  ];

  // Handle export report
  const handleExportReport = async () => {
    try {
      setIsExporting(true);
      // In real app, this would call an API endpoint
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
      case "add-listing":
        navigate("/host/my-listings", { state: { showAddModal: true } });
        break;
      case "view-bookings":
        navigate("/host/bookings");
        break;
      case "view-earnings":
        navigate("/host/earnings");
        break;
      case "edit-profile":
        navigate("/host/profile");
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
          <h1 style={styles.title}>Host Dashboard Overview</h1>
          <p style={styles.subtitle}>
            Welcome back, {user?.first_name || "Host"}! Here's how your properties
            are performing.
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
        {statsData.map((stat, index) => (
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
              onClick={() => navigate("/host/bookings")}
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
              <span style={styles.trendValue}>
                {loading ? "..." : stats.active_bookings}
              </span>
            </div>
            <div style={styles.trendStat}>
              <span style={styles.trendLabel}>Pending</span>
              <span style={styles.trendValue}>
                {loading ? "..." : stats.pending_bookings}
              </span>
            </div>
            <div style={styles.trendGrowth}>
              <TrendingUp size={20} color="#059669" />
              <span>
                {loading
                  ? "Loading..."
                  : `${stats.avg_rating > 0 ? stats.avg_rating.toFixed(1) : 0} avg rating`
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    margin: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e5e7eb",
  },
  statIconWrapper: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statIcon: {
    fontSize: "24px",
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
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

export default HostOverview;

