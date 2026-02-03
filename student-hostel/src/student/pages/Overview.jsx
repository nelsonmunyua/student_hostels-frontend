import { useEffect, useState } from "react";
import { Calendar, Heart, Star, MapPin } from "lucide-react";
import axios from "../../../api/axios";

const StudentOverview = ({ user }) => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    wishlistCount: 0,
    reviewsGiven: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch student dashboard stats
      const response = await axios.get("/student/dashboard-stats");
      setStats(response.data.stats);
      setRecentBookings(response.data.recentBookings || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <div style={styles.welcomeSection}>
        <h1 style={styles.welcomeTitle}>
          Welcome back, {user?.first_name}! 👋
        </h1>
        <p style={styles.welcomeSubtitle}>
          Here's what's happening with your bookings
        </p>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard
          icon={Calendar}
          title="Total Bookings"
          value={stats.totalBookings}
          color="#3b82f6"
          bgColor="#eff6ff"
        />
        <StatCard
          icon={Calendar}
          title="Active Bookings"
          value={stats.activeBookings}
          color="#10b981"
          bgColor="#f0fdf4"
        />
        <StatCard
          icon={Heart}
          title="Wishlisted"
          value={stats.wishlistCount}
          color="#ef4444"
          bgColor="#fef2f2"
        />
        <StatCard
          icon={Star}
          title="Reviews Given"
          value={stats.reviewsGiven}
          color="#f59e0b"
          bgColor="#fffbeb"
        />
      </div>

      {/* Recent Bookings */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Bookings</h2>
          <a href="#" style={styles.viewAllLink}>
            View all
          </a>
        </div>
        <div style={styles.card}>
          {recentBookings.length > 0 ? (
            <div style={styles.bookingsList}>
              {recentBookings.map((booking) => (
                <BookingItem key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <Calendar size={48} color="#d1d5db" />
              <p style={styles.emptyStateText}>No bookings yet</p>
              <p style={styles.emptyStateSubtext}>
                Start exploring accommodations to make your first booking
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.actionsGrid}>
          <ActionCard
            title="Find Accommodation"
            description="Browse available hostels near your campus"
            icon="🔍"
            action="browse"
          />
          <ActionCard
            title="View Wishlist"
            description="Check your saved accommodations"
            icon="❤️"
            action="wishlist"
          />
          <ActionCard
            title="Leave a Review"
            description="Share your experience with others"
            icon="⭐"
            action="review"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
  <div style={{ ...styles.statCard, backgroundColor: bgColor }}>
    <div style={styles.statIconContainer}>
      <Icon size={24} color={color} strokeWidth={2.5} />
    </div>
    <div style={styles.statContent}>
      <p style={styles.statTitle}>{title}</p>
      <p style={{ ...styles.statValue, color }}>{value}</p>
    </div>
  </div>
);

const BookingItem = ({ booking }) => {
  const getStatusStyle = (status) => {
    const styles = {
      paid: { bg: "#d1fae5", color: "#065f46" },
      pending: { bg: "#fef3c7", color: "#92400e" },
      cancelled: { bg: "#fee2e2", color: "#991b1b" },
      completed: { bg: "#e0e7ff", color: "#3730a3" },
    };
    return styles[status] || styles.pending;
  };

  const statusStyle = getStatusStyle(booking.status);

  return (
    <div style={styles.bookingItem}>
      <div style={styles.bookingInfo}>
        <h4 style={styles.bookingTitle}>{booking.accommodation_title}</h4>
        <div style={styles.bookingDetails}>
          <span style={styles.bookingDate}>
            <Calendar size={14} />
            {new Date(booking.check_in).toLocaleDateString()} -{" "}
            {new Date(booking.check_out).toLocaleDateString()}
          </span>
          <span style={styles.bookingLocation}>
            <MapPin size={14} />
            {booking.location}
          </span>
        </div>
      </div>
      <div style={styles.bookingMeta}>
        <span
          style={{
            ...styles.statusBadge,
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
          }}
        >
          {booking.status}
        </span>
        <span style={styles.bookingPrice}>KSh {booking.total_price}</span>
      </div>
    </div>
  );
};

const ActionCard = ({ title, description, icon, action }) => (
  <div style={styles.actionCard}>
    <span style={styles.actionIcon}>{icon}</span>
    <h3 style={styles.actionTitle}>{title}</h3>
    <p style={styles.actionDescription}>{description}</p>
    <button style={styles.actionButton}>Get Started</button>
  </div>
);

const styles = {
  container: {
    maxWidth: "1200px",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  welcomeSection: {
    marginBottom: "32px",
  },
  welcomeTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  welcomeSubtitle: {
    fontSize: "16px",
    color: "#6b7280",
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
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  statIconContainer: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
  },
  section: {
    marginBottom: "32px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  viewAllLink: {
    fontSize: "14px",
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: 500,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "24px",
  },
  bookingsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  bookingItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  bookingDetails: {
    display: "flex",
    gap: "16px",
    fontSize: "14px",
    color: "#6b7280",
  },
  bookingDate: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  bookingLocation: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  bookingMeta: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "8px",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "capitalize",
  },
  bookingPrice: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1a1a1a",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "48px 24px",
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#6b7280",
    marginTop: "16px",
  },
  emptyStateSubtext: {
    fontSize: "14px",
    color: "#9ca3af",
    marginTop: "4px",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  actionCard: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    textAlign: "center",
  },
  actionIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    display: "block",
  },
  actionTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  actionDescription: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "16px",
  },
  actionButton: {
    width: "100%",
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

export default StudentOverview;