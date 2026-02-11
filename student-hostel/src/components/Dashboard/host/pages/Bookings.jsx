import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, AlertCircle, CheckCircle, Clock, XCircle } from "lucide-react";
import hostApi from "../../../../api/hostApi";

const HostBookings = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await hostApi.getBookings();
        
        // Handle the new response format from backend
        const bookingsData = data.bookings || [];
        setBookings(bookingsData);
        
        // Update stats from response or calculate from bookings
        if (data.total_count !== undefined) {
          setStats({
            total: data.total_count || 0,
            pending: data.pending_count || 0,
            confirmed: data.confirmed_count || 0,
            completed: data.completed_count || 0,
            cancelled: data.cancelled_count || 0
          });
        } else {
          // Calculate stats from bookings array
          setStats({
            total: bookingsData.length,
            pending: bookingsData.filter(b => b.status === 'pending').length,
            confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
            completed: bookingsData.filter(b => b.status === 'completed').length,
            cancelled: bookingsData.filter(b => b.status === 'cancelled').length
          });
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setError(error.response?.data?.message || error.message || "Failed to load bookings");
        
        // Check for authentication errors
        const errorMessage = error.response?.data?.message || error.message || "";
        const isAuthError = 
          error.response?.status === 401 || 
          errorMessage.toLowerCase().includes("unauthorized") ||
          errorMessage.toLowerCase().includes("authentication") ||
          errorMessage.toLowerCase().includes("jwt") ||
          errorMessage.toLowerCase().includes("token");
        
        if (isAuthError) {
          // Clear auth data and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login?session_expired=true";
          return;
        }
        
        // Set empty bookings on error
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return { bg: "#dcfce7", color: "#16a34a" };
      case "pending":
        return { bg: "#fef3c7", color: "#d97706" };
      case "completed":
        return { bg: "#f3f4f6", color: "#6b7280" };
      case "cancelled":
        return { bg: "#fee2e2", color: "#dc2626" };
      default:
        return { bg: "#f3f4f6", color: "#6b7280" };
    }
  };

  // Filter bookings based on status
  const filteredBookings = statusFilter === "all"
    ? bookings
    : bookings.filter(b => b.status === statusFilter);

  // Modal handlers
  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleAccept = (booking) => {
    alert(`Booking ${booking.id} accepted! Status updated to confirmed.`);
  };

  const handleReject = (booking) => {
    if (confirm(`Are you sure you want to reject booking ${booking.id}?`)) {
      alert(`Booking ${booking.id} rejected. Guest will be notified.`);
    }
  };

  const handleCloseModal = () => {
    setSelectedBooking(null);
    setShowDetailsModal(false);
  };

  // Calculate total revenue from confirmed/completed bookings
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.amount || b.total_amount || 0), 0);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Bookings Management</h1>
          <p style={styles.subtitle}>Manage your property bookings</p>
        </div>
        <div style={styles.headerActions}>
          <select
            style={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div style={styles.errorState}>
          <AlertCircle size={24} style={{ color: '#dc2626' }} />
          <span>{error}</span>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p>Loading your bookings...</p>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <Clock size={20} style={{ color: '#0369a1' }} />
            </div>
            <div>
              <span style={styles.statValue}>{stats.total}</span>
              <span style={styles.statLabel}>Total Bookings</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <Clock size={20} style={{ color: '#d97706' }} />
            </div>
            <div>
              <span style={styles.statValue}>{stats.pending}</span>
              <span style={styles.statLabel}>Pending</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <CheckCircle size={20} style={{ color: '#16a34a' }} />
            </div>
            <div>
              <span style={styles.statValue}>{stats.confirmed}</span>
              <span style={styles.statLabel}>Confirmed</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>
              <XCircle size={20} style={{ color: '#16a34a' }} />
            </div>
            <div>
              <span style={styles.statValue}>KES {totalRevenue.toLocaleString()}</span>
              <span style={styles.statLabel}>Revenue</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && bookings.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <h3 style={styles.emptyTitle}>No Bookings Found</h3>
          <p style={styles.emptyText}>
            You don&apos;t have any bookings yet. When students book your properties, 
            they will appear here.
          </p>
          <button 
            style={styles.emptyButton}
            onClick={() => navigate('/host/listings')}
          >
            View My Listings
          </button>
        </div>
      )}

      {/* Bookings Table */}
      {!loading && !error && bookings.length > 0 && (
        <>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Booking ID</th>
                  <th style={styles.th}>Guest</th>
                  <th style={styles.th}>Property</th>
                  <th style={styles.th}>Check-in</th>
                  <th style={styles.th}>Check-out</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => {
                  const statusColor = getStatusColor(booking.status);
                  return (
                    <tr key={booking.id} style={styles.tableRow}>
                      <td style={styles.td}>
                        <span style={styles.bookingId}>#{booking.id}</span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.guestCell}>
                          <span style={styles.guestAvatar}>
                            {(booking.guest || "U").charAt(0).toUpperCase()}
                          </span>
                          <span style={styles.guestName}>{booking.guest || "Unknown Guest"}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{booking.property || "Unknown Property"}</td>
                      <td style={styles.td}>{booking.checkIn || "-"}</td>
                      <td style={styles.td}>{booking.checkOut || "-"}</td>
                      <td style={styles.td}>
                        <span style={styles.amount}>KES {(booking.amount || booking.total_amount || 0).toLocaleString()}</span>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.statusBadge,
                            backgroundColor: statusColor.bg,
                            color: statusColor.color,
                          }}
                        >
                          {(booking.status || "unknown").charAt(0).toUpperCase() +
                            (booking.status || "unknown").slice(1)}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.actions}>
                          <button
                            style={styles.viewBtn}
                            onClick={() => handleViewDetails(booking)}
                          >
                            View
                          </button>
                          {booking.status === "pending" && (
                            <>
                              <button
                                style={styles.acceptBtn}
                                onClick={() => handleAccept(booking)}
                              >
                                Accept
                              </button>
                              <button
                                style={styles.rejectBtn}
                                onClick={() => handleReject(booking)}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Upcoming Arrivals */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Upcoming Arrivals</h2>
            <div style={styles.arrivalsGrid}>
              {filteredBookings
                .filter((b) => b.status === "confirmed" || b.status === "pending")
                .map((booking) => (
                  <div key={booking.id} style={styles.arrivalCard}>
                    <div style={styles.arrivalHeader}>
                      <span style={styles.arrivalId}>#{booking.id}</span>
                      <span
                        style={{
                          ...styles.arrivalBadge,
                          ...(booking.status === "confirmed"
                            ? styles.confirmedBadge
                            : styles.pendingBadge),
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div style={styles.arrivalGuest}>
                      <span style={styles.arrivalAvatar}>
                        {(booking.guest || "U").charAt(0).toUpperCase()}
                      </span>
                      <span style={styles.arrivalName}>{booking.guest || "Unknown Guest"}</span>
                    </div>
                    <div style={styles.arrivalProperty}>📍 {booking.property || "Unknown Property"}</div>
                    <div style={styles.arrivalDates}>
                      📅 {booking.checkIn || "-"} → {booking.checkOut || "-"}
                    </div>
                    <div style={styles.arrivalFooter}>
                      <span style={styles.arrivalAmount}>KES {(booking.amount || booking.total_amount || 0).toLocaleString()}</span>
                      <button
                        style={styles.arrivalBtn}
                        onClick={() => handleViewDetails(booking)}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Booking Details</h2>
              <button style={styles.closeBtn} onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Booking ID:</span>
                <span style={styles.detailValue}>#{selectedBooking.id}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Guest:</span>
                <span style={styles.detailValue}>{selectedBooking.guest || "Unknown Guest"}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Property:</span>
                <span style={styles.detailValue}>{selectedBooking.property || "Unknown Property"}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Check-in:</span>
                <span style={styles.detailValue}>{selectedBooking.checkIn || "-"}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Check-out:</span>
                <span style={styles.detailValue}>{selectedBooking.checkOut || "-"}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Amount:</span>
                <span style={styles.detailValue}>KES {(selectedBooking.amount || selectedBooking.total_amount || 0).toLocaleString()}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Status:</span>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(selectedBooking.status).bg,
                    color: getStatusColor(selectedBooking.status).color,
                  }}
                >
                  {(selectedBooking.status || "unknown").charAt(0).toUpperCase() +
                    (selectedBooking.status || "unknown").slice(1)}
                </span>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={handleCloseModal}>
                Close
              </button>
              {selectedBooking.status === "pending" && (
                <>
                  <button
                    style={styles.acceptBtn}
                    onClick={() => {
                      handleAccept(selectedBooking);
                      handleCloseModal();
                    }}
                  >
                    Accept
                  </button>
                  <button
                    style={styles.rejectBtn}
                    onClick={() => {
                      handleReject(selectedBooking);
                      handleCloseModal();
                    }}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  filterSelect: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  errorState: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    marginBottom: "24px",
    color: "#dc2626",
  },
  retryButton: {
    marginLeft: "auto",
    padding: "8px 16px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  loadingState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 20px",
    gap: "16px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e5e7eb",
    borderTopColor: "#0369a1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    display: "block",
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "24px",
    maxWidth: "400px",
    margin: "0 auto 24px auto",
  },
  emptyButton: {
    padding: "12px 24px",
    backgroundColor: "#0369a1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
  },
  tableContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    marginBottom: "32px",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
  },
  th: {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e5e7eb",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#374151",
    verticalAlign: "middle",
  },
  bookingId: {
    fontWeight: "600",
    color: "#0369a1",
  },
  guestCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  guestAvatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "14px",
  },
  guestName: {
    fontWeight: "500",
  },
  amount: {
    fontWeight: "600",
    color: "#16a34a",
  },
  statusBadge: {
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  viewBtn: {
    padding: "6px 12px",
    backgroundColor: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
  },
  acceptBtn: {
    padding: "6px 12px",
    backgroundColor: "#dcfce7",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#16a34a",
    cursor: "pointer",
  },
  rejectBtn: {
    padding: "6px 12px",
    backgroundColor: "#fee2e2",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#dc2626",
    cursor: "pointer",
  },
  section: {
    marginTop: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "20px",
  },
  arrivalsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
  },
  arrivalCard: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  arrivalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  arrivalId: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
  },
  arrivalBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  confirmedBadge: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
  },
  pendingBadge: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
  },
  arrivalGuest: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  arrivalAvatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "14px",
  },
  arrivalName: {
    fontWeight: "600",
    color: "#1a1a1a",
  },
  arrivalProperty: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  arrivalDates: {
    fontSize: "13px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  arrivalFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
  },
  arrivalAmount: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#16a34a",
  },
  arrivalBtn: {
    padding: "6px 14px",
    backgroundColor: "#0369a1",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e2e8f0",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
  },
  closeBtn: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    color: "#64748b",
  },
  modalContent: {
    padding: "20px",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  detailLabel: {
    fontSize: "14px",
    color: "#64748b",
  },
  detailValue: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#1e293b",
  },
};

export default HostBookings;

