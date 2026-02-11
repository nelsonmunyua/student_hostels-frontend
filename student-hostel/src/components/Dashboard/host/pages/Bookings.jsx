import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Eye,
  Check,
  X,
  MessageSquare,
  Calendar,
  MapPin,
  Users,
  DollarSign,
} from "lucide-react";
import {
  fetchHostBookings,
  acceptBooking,
  rejectBooking,
} from "../../../../redux/slices/Thunks/bookingThunks";

const HostBookings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { hostBookings, loading, error, successMessage } = useSelector(
    (state) => state.booking,
  );

  const [filter, setFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(null);

  // Fetch host bookings on mount
  useEffect(() => {
    dispatch(fetchHostBookings());
  }, [dispatch]);

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

  // Use Redux data only - no mock fallback
  const bookings = hostBookings || [];
  const filteredBookings =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const formatDate = (dateStr) => {
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

  const handleConfirm = async (id) => {
    try {
      await dispatch(acceptBooking(id));
      setLocalSuccess(`Booking #${id} confirmed successfully!`);
      setSelectedBooking(null);
    } catch (err) {
      setLocalError("Failed to confirm booking");
    }
  };

  const handleReject = async (id) => {
    if (window.confirm("Are you sure you want to reject this booking?")) {
      try {
        await dispatch(rejectBooking({ id, reason: "Rejected by host" }));
        setLocalSuccess(`Booking #${id} rejected`);
        setSelectedBooking(null);
      } catch (err) {
        setLocalError("Failed to reject booking");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Bookings</h1>
          <p style={styles.subtitle}>Manage your property bookings</p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Calendar size={24} />
          </div>
          <div>
            <span style={styles.statValue}>{bookings.length}</span>
            <span style={styles.statLabel}>Total Bookings</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, ...styles.statPending }}>
            <ClockIcon />
          </div>
          <div>
            <span style={styles.statValue}>
              {bookings.filter((b) => b.status === "pending").length}
            </span>
            <span style={styles.statLabel}>Pending</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, ...styles.statConfirmed }}>
            <Check size={24} />
          </div>
          <div>
            <span style={styles.statValue}>
              {bookings.filter((b) => b.status === "confirmed").length}
            </span>
            <span style={styles.statLabel}>Confirmed</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statIcon, ...styles.statRevenue }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={styles.statValue}>
              KSh{" "}
              {bookings
                .filter((b) => b.status !== "cancelled")
                .reduce((acc, b) => acc + b.total_price, 0)
                .toLocaleString()}
            </span>
            <span style={styles.statLabel}>Revenue</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
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

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div style={styles.emptyState}>
          <Calendar size={48} color="#94a3b8" />
          <p style={{ marginTop: "16px", color: "#64748b" }}>
            No bookings found
          </p>
        </div>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Guest</th>
                <th style={styles.th}>Property</th>
                <th style={styles.th}>Dates</th>
                <th style={styles.th}>Guests</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => {
                const statusStyle = getStatusColor(booking.status);
                return (
                  <tr key={booking.id} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.guestInfo}>
                        <span style={styles.guestName}>
                          {booking.guest_name}
                        </span>
                        <span style={styles.guestEmail}>
                          {booking.guest_email}
                        </span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.propertyName}>
                        {booking.property}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.dateInfo}>
                        <span>
                          Check-in:{" "}
                          <strong>{formatDate(booking.check_in)}</strong>
                        </span>
                        <span>
                          Check-out:{" "}
                          <strong>{formatDate(booking.check_out)}</strong>
                        </span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.guests}>
                        <Users size={14} />
                        <span>{booking.guests}</span>
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.price}>
                        KSh {booking.total_price.toLocaleString()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                        }}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actions}>
                        <button
                          style={styles.actionBtn}
                          onClick={() => setSelectedBooking(booking)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        {booking.status === "pending" && (
                          <>
                            <button
                              style={{
                                ...styles.actionBtn,
                                ...styles.confirmBtn,
                              }}
                              onClick={() => handleConfirm(booking.id)}
                              title="Confirm"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              style={{
                                ...styles.actionBtn,
                                ...styles.rejectBtn,
                              }}
                              onClick={() => handleReject(booking.id)}
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button style={styles.actionBtn} title="Message">
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div style={styles.modal} onClick={() => setSelectedBooking(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Booking Details</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setSelectedBooking(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.detailSection}>
                <h3 style={styles.detailTitle}>Guest Information</h3>
                <p>
                  <strong>Name:</strong> {selectedBooking.guest_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedBooking.guest_email}
                </p>
                <p>
                  <strong>Number of Guests:</strong> {selectedBooking.guests}
                </p>
              </div>

              <div style={styles.detailSection}>
                <h3 style={styles.detailTitle}>Booking Information</h3>
                <p>
                  <strong>Property:</strong> {selectedBooking.property}
                </p>
                <p>
                  <strong>Check-in:</strong>{" "}
                  {formatDate(selectedBooking.check_in)}
                </p>
                <p>
                  <strong>Check-out:</strong>{" "}
                  {formatDate(selectedBooking.check_out)}
                </p>
                <p>
                  <strong>Total Price:</strong> KSh{" "}
                  {selectedBooking.total_price.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong> {selectedBooking.status}
                </p>
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
                      onClick={() => {
                        handleConfirm(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
                    >
                      <Check size={18} />
                      Confirm Booking
                    </button>
                    <button
                      style={styles.rejectButton}
                      onClick={() => {
                        handleReject(selectedBooking.id);
                        setSelectedBooking(null);
                      }}
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
    </div>
  );
};

// Clock icon component
const ClockIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ca8a04"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const styles = {
  container: {
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
  statsGrid: {
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
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statPending: {
    backgroundColor: "#fef9c3",
    color: "#ca8a04",
  },
  statConfirmed: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
  },
  statRevenue: {
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
  },
  statValue: {
    display: "block",
    fontSize: "20px",
    fontWeight: 700,
    color: "#1e293b",
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
  tr: {
    borderBottom: "1px solid #f1f5f9",
  },
  td: {
    padding: "16px",
    verticalAlign: "middle",
  },
  guestInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  guestName: {
    fontWeight: 600,
    color: "#1e293b",
  },
  guestEmail: {
    fontSize: "13px",
    color: "#64748b",
  },
  propertyName: {
    fontWeight: 500,
    color: "#374151",
  },
  dateInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    fontSize: "13px",
    color: "#64748b",
  },
  guests: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    color: "#64748b",
  },
  price: {
    fontWeight: 600,
    color: "#1e293b",
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
  actionBtn: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#64748b",
    transition: "all 0.2s",
  },
  confirmBtn: {
    backgroundColor: "#dcfce7",
    borderColor: "#bbf7d0",
    color: "#16a34a",
  },
  rejectBtn: {
    backgroundColor: "#fee2e2",
    borderColor: "#fecaca",
    color: "#dc2626",
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
  },
  modalBody: {
    padding: "24px",
  },
  detailSection: {
    marginBottom: "24px",
  },
  detailTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "12px",
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
};

export default HostBookings;
