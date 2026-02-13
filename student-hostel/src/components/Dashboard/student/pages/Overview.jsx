import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Heart, Star, MapPin, Loader2, ArrowRight } from "lucide-react";
import { useSelector } from "react-redux";
import studentApi from "../../../../api/studentApi";

const StudentOverview = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    wishlistCount: 0,
    reviewsGiven: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchRef = useRef(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await studentApi.getDashboardStats();
      
      // Map backend field names to frontend field names
      setStats({
        totalBookings: data.stats?.total_bookings || 0,
        activeBookings: data.stats?.active_bookings || 0,
        wishlistCount: data.stats?.wishlist_count || 0,
        reviewsGiven: data.stats?.reviews_given || 0,
      });
      setRecentBookings(data.recent_bookings || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setError(error.response?.data?.message || "Failed to load dashboard data");
      // Use mock data when API fails
      setStats({
        totalBookings: 0,
        activeBookings: 0,
        wishlistCount: 0,
        reviewsGiven: 0,
      });
      setRecentBookings([]);
    } finally {
      setLoading(false);
      fetchRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!fetchRef.current && user) {
      fetchRef.current = true;
      fetchDashboardData();
    }
  }, [fetchDashboardData, user]);

  const handleGetStarted = useCallback((action) => {
    switch (action) {
      case "browse":
        navigate("/student/find-accommodation");
        break;
      case "wishlist":
        navigate("/student/wishlist");
        break;
      case "review":
        navigate("/student/my-reviews");
        break;
      default:
        break;
    }
  }, [navigate]);

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div style={styles.skeletonContainer}>
      {/* Stats skeleton */}
      <div style={styles.statsGrid}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} style={styles.skeletonStatCard}>
            <div style={styles.skeletonIcon} />
            <div style={styles.skeletonTextContainer}>
              <div style={styles.skeletonTextShort} />
              <div style={styles.skeletonTextLong} />
            </div>
          </div>
        ))}
      </div>
      {/* Section skeleton */}
      <div style={styles.skeletonSection}>
        <div style={styles.skeletonTitle} />
        <div style={styles.skeletonCard}>
          <div style={styles.skeletonImage} />
          <div style={styles.skeletonContent}>
            <div style={styles.skeletonTextMedium} />
            <div style={styles.skeletonTextShort} />
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={styles.container}>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <h2 style={styles.errorTitle}>Something went wrong</h2>
          <p style={styles.errorText}>{error}</p>
          <button
            style={styles.retryButton}
            onClick={() => {
              fetchRef.current = false;
              fetchDashboardData();
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Welcome Section */}
      <div style={styles.welcomeSection}>
        <div>
          <h1 style={styles.welcomeTitle}>
            Welcome back, {user?.first_name || "Student"}! 👋
          </h1>
          <p style={styles.welcomeSubtitle}>
            Here&apos;s what&apos;s happening with your bookings
          </p>
        </div>
        <button 
          style={styles.browseButton}
          onClick={() => navigate("/student/find-accommodation")}
        >
          Browse All
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <StatCard
          icon={Calendar}
          title="Total Bookings"
          value={stats.totalBookings}
          color="#3b82f6"
          bgColor="#eff6ff"
          onClick={() => navigate("/student/my-bookings")}
        />
        <StatCard
          icon={Calendar}
          title="Active Bookings"
          value={stats.activeBookings}
          color="#10b981"
          bgColor="#f0fdf4"
          onClick={() => navigate("/student/my-bookings")}
        />
        <StatCard
          icon={Heart}
          title="Wishlisted"
          value={stats.wishlistCount}
          color="#ef4444"
          bgColor="#fef2f2"
          onClick={() => navigate("/student/wishlist")}
        />
        <StatCard
          icon={Star}
          title="Reviews Given"
          value={stats.reviewsGiven}
          color="#f59e0b"
          bgColor="#fffbeb"
          onClick={() => navigate("/student/my-reviews")}
        />
      </div>

      {/* Recent Bookings */}
      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Recent Bookings</h2>
          <button 
            style={styles.viewAllLink}
            onClick={() => navigate("/student/my-bookings")}
          >
            View all →
          </button>
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
              <button
                style={styles.emptyStateButton}
                onClick={() => navigate("/student/find-accommodation")}
              >
                Find Accommodation
              </button>
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
            onAction={handleGetStarted}
          />
          <ActionCard
            title="View Wishlist"
            description="Check your saved accommodations"
            icon="❤️"
            action="wishlist"
            onAction={handleGetStarted}
          />
          <ActionCard
            title="Leave a Review"
            description="Share your experience with others"
            icon="⭐"
            action="review"
            onAction={handleGetStarted}
          />
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ icon: Icon, title, value, color, bgColor, onClick }) => (
  <div 
    style={{ ...styles.statCard, backgroundColor: bgColor }}
    onClick={onClick}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
    }}
  >
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
      confirmed: { bg: "#d1fae5", color: "#065f46" },
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
            {booking.check_in 
              ? new Date(booking.check_in).toLocaleDateString() 
              : "N/A"}{" "}
            -{" "}
            {booking.check_out 
              ? new Date(booking.check_out).toLocaleDateString() 
              : "Ongoing"}
          </span>
          <span style={styles.bookingLocation}>
            <MapPin size={14} />
            {booking.location || "Location not specified"}
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
        <span style={styles.bookingPrice}>
          KSh {(booking.total_price || 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

const ActionCard = ({ title, description, icon, action, onAction }) => (
  <div 
    style={styles.actionCard}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
    }}
  >
    <span style={styles.actionIcon}>{icon}</span>
    <h3 style={styles.actionTitle}>{title}</h3>
    <p style={styles.actionDescription}>{description}</p>
    <button
      style={styles.actionButton}
      onClick={() => onAction(action)}
    >
      Get Started →
    </button>
  </div>
);

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    animation: "fadeIn 0.3s ease",
  },
  skeletonContainer: {
    animation: "pulse 1.5s infinite",
  },
  skeletonStatCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  skeletonIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    backgroundColor: "#f1f5f9",
  },
  skeletonTextContainer: {
    flex: 1,
  },
  skeletonTextShort: {
    width: "40%",
    height: "14px",
    backgroundColor: "#f1f5f9",
    borderRadius: "4px",
    marginBottom: "8px",
  },
  skeletonTextLong: {
    width: "60%",
    height: "24px",
    backgroundColor: "#f1f5f9",
    borderRadius: "4px",
  },
  skeletonSection: {
    marginTop: "32px",
  },
  skeletonTitle: {
    width: "200px",
    height: "28px",
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  skeletonCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "24px",
    display: "flex",
    gap: "16px",
  },
  skeletonImage: {
    width: "120px",
    height: "80px",
    borderRadius: "8px",
    backgroundColor: "#f1f5f9",
  },
  skeletonContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  skeletonTextMedium: {
    width: "70%",
    height: "20px",
    backgroundColor: "#f1f5f9",
    borderRadius: "4px",
  },
  welcomeSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  welcomeTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "8px",
  },
  welcomeSubtitle: {
    fontSize: "16px",
    color: "#64748b",
  },
  browseButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  statIconContainer: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1e293b",
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
    color: "#1e293b",
  },
  viewAllLink: {
    fontSize: "14px",
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: 500,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
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
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    transition: "all 0.2s",
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "8px",
  },
  bookingDetails: {
    display: "flex",
    gap: "16px",
    fontSize: "14px",
    color: "#64748b",
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
    color: "#1e293b",
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
    color: "#64748b",
    marginTop: "16px",
  },
  emptyStateSubtext: {
    fontSize: "14px",
    color: "#9ca3af",
    marginTop: "4px",
  },
  emptyStateButton: {
    marginTop: "16px",
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  actionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
  },
  actionCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    textAlign: "center",
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  actionIcon: {
    fontSize: "48px",
    marginBottom: "16px",
    display: "block",
  },
  actionTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "8px",
  },
  actionDescription: {
    fontSize: "14px",
    color: "#64748b",
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
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    marginTop: "24px",
  },
  errorTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "8px",
  },
  errorText: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "16px",
  },
  retryButton: {
    padding: "10px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default StudentOverview;

