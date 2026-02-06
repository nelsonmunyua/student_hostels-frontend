import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Download, Eye } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { fetchStudentBookings } from "../../../../redux/slices/Thunks/bookingThunks";

const StudentBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { studentBookings, loading, error } = useSelector((state) => state.booking);
  const [filter, setFilter] = useState("all"); // all, active, completed, cancelled

  useEffect(() => {
    dispatch(fetchStudentBookings({ status: filter !== "all" ? filter : undefined }));
  }, [dispatch, filter]);

  // Use bookings from Redux store, fallback to empty array
  const bookings = studentBookings || [];

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

  // Handle view details
  const handleViewDetails = (booking) => {
    alert(`Viewing details for booking #${booking.id} (Demo)`);
  };

  // Handle download receipt
  const handleDownloadReceipt = async (booking) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(`Downloading receipt for booking #${booking.id} (Demo)`);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  // Filter bookings based on status
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => {
          if (filter === "active")
            return b.status === "confirmed" || b.status === "pending";
          return b.status === filter;
        });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Bookings</h1>
        <p style={styles.subtitle}>
          Manage and track your accommodation bookings
        </p>
      </div>

      {/* Filters */}
      <div style={styles.filterSection}>
        {["all", "active", "completed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              ...styles.filterButton,
              ...(filter === f ? styles.filterButtonActive : {}),
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div style={styles.bookingsList}>
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking.id} style={styles.bookingCard}>
              <div style={styles.bookingHeader}>
                <div>
                  <h3 style={styles.bookingTitle}>
                    {booking.accommodation_title}
                  </h3>
                  <div style={styles.bookingLocation}>
                    <MapPin size={16} />
                    <span>{booking.location}</span>
                  </div>
                </div>
                <span
                  style={{
                    ...styles.statusBadge,
                    ...getStatusStyle(booking.status),
                  }}
                >
                  {booking.status}
                </span>
              </div>

              <div style={styles.bookingDetails}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Check-in</span>
                  <span style={styles.detailValue}>
                    {new Date(booking.check_in).toLocaleDateString()}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Check-out</span>
                  <span style={styles.detailValue}>
                    {new Date(booking.check_out).toLocaleDateString()}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Total Price</span>
                  <span style={styles.detailValue}>
                    KSh {booking.total_price}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Booking ID</span>
                  <span style={styles.detailValue}>#{booking.id}</span>
                </div>
              </div>

              <div style={styles.bookingActions}>
                <button
                  style={styles.actionButton}
                  onClick={() => handleViewDetails(booking)}
                >
                  <Eye size={16} />
                  View Details
                </button>
                {booking.status === "completed" && (
                  <button
                    style={{
                      ...styles.actionButton,
                      ...styles.actionButtonSecondary,
                    }}
                    onClick={() => handleDownloadReceipt(booking)}
                  >
                    <Download size={16} />
                    Download Receipt
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <Calendar size={48} color="#d1d5db" />
            <p style={styles.emptyStateText}>No bookings found</p>
            <p style={styles.emptyStateSubtext}>
              {filter === "all"
                ? "You haven't made any bookings yet"
                : `No ${filter} bookings`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1200px",
  },
  loadingContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
  },
  filterSection: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  filterButton: {
    padding: "8px 16px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  filterButtonActive: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderColor: "#3b82f6",
  },
  bookingsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  bookingCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "24px",
  },
  bookingHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  bookingTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  bookingLocation: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#6b7280",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "capitalize",
  },
  bookingDetails: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 500,
  },
  detailValue: {
    fontSize: "14px",
    color: "#1a1a1a",
    fontWeight: 600,
  },
  bookingActions: {
    display: "flex",
    gap: "12px",
  },
  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  actionButtonSecondary: {
    backgroundColor: "#fff",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "64px 24px",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  emptyStateText: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#6b7280",
    marginTop: "16px",
  },
  emptyStateSubtext: {
    fontSize: "14px",
    color: "#9ca3af",
    marginTop: "8px",
  },
};

export default StudentBookings;
