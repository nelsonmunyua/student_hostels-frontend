import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, AlertCircle, CheckCircle, Clock, XCircle, Check, MessageSquare } from "lucide-react";
import hostApi from "../../../../api/hostApi";
import { acceptBooking, rejectBooking } from "../../../../redux/slices/bookingSlice";

const HostBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Redux state
  const { hostBookings, loading, error, successMessage } = useSelector(
    (state) => state.booking,
  );

  // Local state
  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [localBookings, setLocalBookings] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(null);
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
        setLocalLoading(true);
        setLocalError(null);
        const data = await hostApi.getBookings();
        
        // Handle the new response format from backend
        const bookingsData = data.bookings || [];
        setLocalBookings(bookingsData);
        
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
        const errorMsg = error.response?.data?.message || error.message || "Failed to load bookings";
        setLocalError(errorMsg);
        
        // Check for authentication errors
        const isAuthError = 
          error.response?.status === 401 || 
          errorMsg.toLowerCase().includes("unauthorized") ||
          errorMsg.toLowerCase().includes("authentication") ||
          errorMsg.toLowerCase().includes("jwt") ||
          errorMsg.toLowerCase().includes("token");
        
        if (isAuthError) {
          // Clear auth data and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login?session_expired=true";
          return;
        }
        
        // Set empty bookings on error
        setLocalBookings([]);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Handle Redux error/success messages
  useEffect(() => {
    if (error) {
      setLocalError(error);
      setTimeout(() => setLocalError(null), 5000);
    }
    if (successMessage) {
      setLocalSuccess(successMessage);
      setTimeout(() => setLocalSuccess(null), 5000);
    }
  }, [error, successMessage]);

  // Use local state data - prioritize API data over Redux
  const bookings = localBookings.length > 0 ? localBookings : (hostBookings || []);
  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: { bg: "#dcfce7", text: "#16a34a" },
      pending: { bg: "#fef9c3", text: "#ca8a04" },
      completed: { bg: "#e0f2fe", text: "#0284c7" },
      cancelled: { bg: "#fee2e2", text: "#dc2626" },
    };
    return colors[status] || colors.pending;
  };

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleAccept = async (booking) => {
    try {
      await dispatch(acceptBooking(booking.id));
      setLocalSuccess(`Booking #${booking.id} confirmed successfully!`);
      setSelectedBooking(null);
      setShowDetailsModal(false);
    } catch (err) {
      setLocalError("Failed to confirm booking");
    }
  };

  const handleReject = async (booking) => {
    if (window.confirm("Are you sure you want to reject this booking?")) {
      try {
        await dispatch(rejectBooking({ id: booking.id, reason: "Rejected by host" }));
        setLocalSuccess(`Booking #${booking.id} rejected`);
        setSelectedBooking(null);
        setShowDetailsModal(false);
      } catch (err) {
        setLocalError("Failed to reject booking");
      }
    }
  };

  // Calculate total revenue from confirmed/completed bookings
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.amount || b.total_amount || 0), 0);

  // Show loading state
  const isLoading = localLoading || loading;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Bookings</h1>
          <p style={styles.subtitle}>Manage your property bookings</p>
        </div>
      </div>

      {/* Error State */}
      {(localError || error) && (
        <div style={styles.errorState}>
          <AlertCircle size={24} style={{ color: '#dc2626' }} />
          <span>{localError || error}</span>
          <button 
            style={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      )}

      {/* Success Message */}
      {localSuccess && (
        <div style={styles.successState}>
          <CheckCircle size={24} style={{ color: '#16a34a' }} />
          <span>{localSuccess}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div style={styles.loadingState}>
          <div style={styles.spinner}></div>
          <p>Loading your bookings...</p>
        </div>
      )}

      {/* Stats Cards */}
      {!isLoading && !localError && (
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: "#f0f9ff" }}>
              <Clock size={20} style={{ color: '#0369a1' }} />
            </div>
            <div>
              <span style={styles.statValue}>{stats.total}</span>
              <span style={styles.statLabel}>Total Bookings</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: "#fef9c3" }}>
              <Clock size={20} style={{ color: '#d97706' }} />
            </div>
            <div>
              <span style={styles.statValue}>{stats.pending}</span>
              <span style={styles.statLabel}>Pending</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: "#dcfce7" }}>
              <CheckCircle size={20} style={{ color: '#16a34a' }} />
            </div>
            <div>
              <span style={styles.statValue}>{stats.confirmed}</span>
              <span style={styles.statLabel}>Confirmed</span>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, backgroundColor: "#ecfdf5" }}>
              <XCircle size={20} style={{ color: '#059669' }} />
            </div>
            <div>
              <span style={styles.statValue}>KES {totalRevenue.toLocaleString()}</span>
              <span style={styles.statLabel}>Revenue</span>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !localError && bookings.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📋</div>
          <h3 style={styles.emptyTitle}>No Bookings Found</h3>
          <p style={styles.emptyText}>
            You don't have any bookings yet. When students book your properties, 
            they will appear here.
          </p>
          <button 
            style={styles.emptyButton}
            onClick={() => navigate('/host/my-listings')}
          >
            View My Listings
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      {!isLoading && !localError && bookings.length > 0 && (
        <div style={styles.filterTabs}>
          <button
            style={{
              ...styles.filterTab,
              ...(filter === "all" && styles.filterTabActive),
            }}
            onClick={() => setFilter("all")}
          >
            All ({bookings.length})
          </button>
          <button
            style={{
              ...styles.filterTab,
              ...(filter === "pending" && styles.filterTabActive),
            }}
            onClick={() => setFilter("pending")}
          >
            Pending ({bookings.filter((b) => b.status === "pending").length})
          </button>
          <button
            style={{
              ...styles.filterTab,
              ...(filter === "confirmed" && styles.filterTabActive),
            }}
            onClick={() => setFilter("confirmed")}
          >
            Confirmed ({bookings.filter((b) => b.status === "confirmed").length})
          </button>
          <button
            style={{
              ...styles.filterTab,
              ...(filter === "completed" && styles.filterTabActive),
            }}
            onClick={() => setFilter("completed")}
          >
            Completed ({bookings.filter((b) => b.status === "completed").length})
          </button>
          <button
            style={{
              ...styles.filterTab,
              ...(filter === "cancelled" && styles.filterTabActive),
            }}
            onClick={() => setFilter("cancelled")}
          >
            Cancelled ({bookings.filter((b) => b.status === "cancelled").length})
          </button>
        </div>
      )}

      {/* Bookings Table */}
      {!isLoading && !localError && bookings.length > 0 && (
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
                            {(booking.student_name || booking.guest || "U").charAt(0).toUpperCase()}
                          </span>
                          <span style={styles.guestName}>{booking.student_name || booking.guest || "Unknown Guest"}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{booking.hostel_name || booking.property || "Unknown Property"}</td>
                      <td style={styles.td}>{formatDate(booking.check_in || booking.checkIn)}</td>
                      <td style={styles.td}>{formatDate(booking.check_out || booking.checkOut)}</td>
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
                          backgroundColor: booking.status === "confirmed" ? "#dcfce7" : "#fef9c3",
                          color: booking.status === "confirmed" ? "#16a34a" : "#ca8a04",
                        }}
                      >
                        {booking.status}
                      </span>
                    </div>
                    <div style={styles.arrivalGuest}>
                      <span style={styles.arrivalAvatar}>
                        {(booking.student_name || booking.guest || "U").charAt(0).toUpperCase()}
                      </span>
                      <span style={styles.arrivalName}>{booking.student_name || booking.guest || "Unknown Guest"}</span>
                    </div>
                    <div style={styles.arrivalProperty}>📍 {booking.hostel_name || booking.property || "Unknown Property"}</div>
                    <div style={styles.arrivalDates}>
                      📅 {formatDate(booking.check_in || booking.checkIn)} → {formatDate(booking.check_out || booking.checkOut)}
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

      {/* Booking Detail Modal */}
      {selectedBooking && showDetailsModal && (
        <div style={styles.modal} onClick={() => setShowDetailsModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Booking Details</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowDetailsModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Booking ID:</span>
                <span style={styles.detailValue}>#{selectedBooking.id}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Guest:</span>
                <span style={styles.detailValue}>{selectedBooking.student_name || selectedBooking.guest || "Unknown Guest"}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Email:</span>
                <span style={styles.detailValue}>{selectedBooking.student_email || "N/A"}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Property:</span>
                <span style={styles.detailValue}>{selectedBooking.hostel_name || selectedBooking.property || "Unknown Property"}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Room Type:</span>
                <span style={styles.detailValue}>{selectedBooking.room_type || "N/A"}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Check-in:</span>
                <span style={styles.detailValue}>{formatDate(selectedBooking.check_in || selectedBooking.checkIn)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Check-out:</span>
                <span style={styles.detailValue}>{formatDate(selectedBooking.check_out || selectedBooking.checkOut)}</span>
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

              {selectedBooking.message && (
                <div style={styles.detailSection}>
                  <h3 style={styles.detailTitle}>Message from Guest</h3>
                  <p style={styles.message}>{selectedBooking.message}</p>
                </div>
              )}

              <div style={styles.modalActions}>
                {selectedBooking.status === "pending" && (
                  <>
                    <button
                      style={styles.confirmButton}
                      onClick={() => handleAccept(selectedBooking)}
                    >
                      <Check size={18} />
                      Confirm Booking
                    </button>
                    <button
                      style={styles.rejectButton}
                      onClick={() => handleReject(selectedBooking)}
                    >
                      <X size={18} />
                      Reject Booking
                    </button>
                  </>
                )}
                <button style={styles.messageButton}>
                  <MessageSquare size={18} />
                  Message Guest
                </button>
              </div>
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
    padding: "32px",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
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
  successState: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#dcfce7",
    borderRadius: "8px",
    marginBottom: "24px",
    color: "#16a34a",
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
    display: "flex",
    alignItems: "center",
    gap: "16px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e5e7eb",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
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
    fontSize: "13px",
    color: "#64748b",
  },
  filterTabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e5e7eb",
    overflowX: "auto",
  },
  filterTab: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  filterTabActive: {
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    marginBottom: "32px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
  },
  th: {
    padding: "16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tableRow: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "16px",
    verticalAlign: "middle",
  },
  bookingId: {
    fontWeight: 600,
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
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "14px",
  },
  guestName: {
    fontWeight: 500,
    color: "#374151",
  },
  amount: {
    fontWeight: 600,
    color: "#059669",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
  },
  actions: {
    display: "flex",
    gap: "8px",
  },
  viewBtn: {
    padding: "6px 12px",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    border: "1px solid #bae6fd",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  acceptBtn: {
    padding: "6px 12px",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    border: "1px solid #bbf7d0",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  rejectBtn: {
    padding: "6px 12px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  section: {
    marginTop: "32px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "16px",
  },
  arrivalsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  arrivalCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "20px",
  },
  arrivalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  arrivalId: {
    fontWeight: 600,
    color: "#0369a1",
  },
  arrivalBadge: {
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
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
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    fontSize: "13px",
  },
  arrivalName: {
    fontWeight: 500,
    color: "#374151",
  },
  arrivalProperty: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "4px",
  },
  arrivalDates: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "12px",
  },
  arrivalFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid #f1f5f9",
  },
  arrivalAmount: {
    fontWeight: 600,
    color: "#059669",
  },
  arrivalBtn: {
    padding: "6px 12px",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    border: "1px solid #bae6fd",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "24px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1e293b",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
    padding: "4px",
  },
  modalBody: {
    padding: "24px",
  },
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
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
  detailSection: {
    marginTop: "16px",
    marginBottom: "16px",
  },
  detailTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "8px",
  },
  message: {
    padding: "12px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#475569",
    fontStyle: "italic",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    marginTop: "24px",
  },
  confirmButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    backgroundColor: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  rejectButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  messageButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    backgroundColor: "#f8fafc",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    marginLeft: "auto",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "8px",
  },
  emptyText: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "24px",
  },
  emptyButton: {
    padding: "12px 24px",
    backgroundColor: "#0369a1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default HostBookings;

