import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const HostOverview = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalListings: 0,
    activeBookings: 0,
    totalReviews: 0,
    earnings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stats with mock data
    setStats({
      totalListings: 5,
      activeBookings: 12,
      totalReviews: 48,
      earnings: 15420,
    });
    setLoading(false);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Host Dashboard Overview</h1>
        <p style={styles.subtitle}>
          Welcome back, {user?.first_name || "Host"}! Here's how your properties
          are performing.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIconWrapper}>
            <span style={styles.statIcon}>🏠</span>
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{stats.totalListings}</span>
            <span style={styles.statLabel}>Total Listings</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconWrapper}>
            <span style={styles.statIcon}>📅</span>
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{stats.activeBookings}</span>
            <span style={styles.statLabel}>Active Bookings</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconWrapper}>
            <span style={styles.statIcon}>⭐</span>
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>{stats.totalReviews}</span>
            <span style={styles.statLabel}>Total Reviews</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconWrapper}>
            <span style={styles.statIcon}>💰</span>
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>
              ${stats.earnings.toLocaleString()}
            </span>
            <span style={styles.statLabel}>Total Earnings</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        <div style={styles.activityList}>
          <div style={styles.activityItem}>
            <div style={styles.activityIcon}>
              <span>📅</span>
            </div>
            <div style={styles.activityContent}>
              <span style={styles.activityTitle}>New Booking Request</span>
              <span style={styles.activityTime}>2 hours ago</span>
            </div>
            <span style={styles.activityBadge}>Pending</span>
          </div>

          <div style={styles.activityItem}>
            <div style={styles.activityIcon}>
              <span>⭐</span>
            </div>
            <div style={styles.activityContent}>
              <span style={styles.activityTitle}>New 5-Star Review</span>
              <span style={styles.activityTime}>5 hours ago</span>
            </div>
            <span style={styles.activityBadge}>Positive</span>
          </div>

          <div style={styles.activityItem}>
            <div style={styles.activityIcon}>
              <span>💬</span>
            </div>
            <div style={styles.activityContent}>
              <span style={styles.activityTitle}>Guest Message</span>
              <span style={styles.activityTime}>1 day ago</span>
            </div>
            <span style={styles.activityBadge}>Unread</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <button style={styles.actionButton}>
            <span style={styles.actionIcon}>➕</span>
            <span>Add New Listing</span>
          </button>
          <button style={styles.actionButton}>
            <span style={styles.actionIcon}>📊</span>
            <span>View Analytics</span>
          </button>
          <button style={styles.actionButton}>
            <span style={styles.actionIcon}>✏️</span>
            <span>Edit Profile</span>
          </button>
          <button style={styles.actionButton}>
            <span style={styles.actionIcon}>📅</span>
            <span>Manage Bookings</span>
          </button>
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
    animation: "fadeIn 0.4s ease-out",
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
  section: {
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "16px",
  },
  activityList: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  activityItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 20px",
    borderBottom: "1px solid #e5e7eb",
  },
  activityIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },
  activityContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  activityTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1a1a1a",
  },
  activityTime: {
    fontSize: "12px",
    color: "#6b7280",
  },
  activityBadge: {
    padding: "4px 12px",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "12px",
  },
  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  actionIcon: {
    fontSize: "16px",
  },
};

export default HostOverview;
