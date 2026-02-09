import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  DollarSign,
  Calendar,
  MapPin,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useSelector } from "react-redux";
import studentApi from "../../../../api/studentApi";

const StudentPayments = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // State
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    total_paid: 0,
    pending_amount: 0,
    total_bookings: 0,
    completed_payments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  // Fetch payments and stats
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [paymentsRes, statsRes] = await Promise.all([
        studentApi.getPayments({
          page: pagination.page,
          limit: 10,
          ...(filter !== "all" && { status: filter }),
        }),
        studentApi.getPaymentStats(),
      ]);

      setPayments(paymentsRes.payments || []);
      setStats(statsRes);
      setPagination((prev) => ({
        ...prev,
        total: paymentsRes.total,
        pages: paymentsRes.pages,
      }));
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Failed to load payments. Please try again.");
      // Mock data for demo
      setPayments(getMockPayments());
      setStats({
        total_paid: 45000,
        pending_amount: 8500,
        total_bookings: 3,
        completed_payments: 2,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      paid: {
        icon: CheckCircle,
        color: "#10b981",
        bgColor: "#d1fae5",
        text: "Paid",
      },
      pending: {
        icon: Clock,
        color: "#f59e0b",
        bgColor: "#fef3c7",
        text: "Pending",
      },
      failed: {
        icon: XCircle,
        color: "#ef4444",
        bgColor: "#fee2e2",
        text: "Failed",
      },
      refunded: {
        icon: DollarSign,
        color: "#6366f1",
        bgColor: "#e0e7ff",
        text: "Refunded",
      },
    };

    const { icon: Icon, color, bgColor, text } = config[status] || config.pending;

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 10px",
          backgroundColor: bgColor,
          color: color,
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        <Icon size={12} />
        {text}
      </span>
    );
  };

  // Handle download receipt
  const handleDownloadReceipt = (payment) => {
    alert(
      `Downloading receipt for payment #${payment.payment_reference || payment.booking_id}`
    );
    // In a real app, this would trigger an API call to download the receipt
  };

  // Handle view booking details
  const handleViewBooking = (bookingId) => {
    navigate(`/student/my-bookings?booking=${bookingId}`);
  };

  if (loading && payments.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2 size={40} color="#3b82f6" style={{ animation: "spin 1s linear infinite" }} />
        <p>Loading payments...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Payments</h1>
          <p style={styles.subtitle}>
            View and manage your payment history and transactions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div
            style={{ ...styles.statIcon, backgroundColor: "#d1fae5", color: "#10b981" }}
          >
            <Wallet size={24} />
          </div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Total Paid</p>
            <p style={styles.statValue}>
              KSh {stats.total_paid?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div
            style={{ ...styles.statIcon, backgroundColor: "#fef3c7", color: "#f59e0b" }}
          >
            <Clock size={24} />
          </div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Pending Amount</p>
            <p style={styles.statValue}>
              KSh {stats.pending_amount?.toLocaleString() || 0}
            </p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div
            style={{ ...styles.statIcon, backgroundColor: "#dbeafe", color: "#3b82f6" }}
          >
            <TrendingUp size={24} />
          </div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Completed Payments</p>
            <p style={styles.statValue}>{stats.completed_payments || 0}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div
            style={{ ...styles.statIcon, backgroundColor: "#f3e8ff", color: "#8b5cf6" }}
          >
            <CreditCard size={24} />
          </div>
          <div style={styles.statContent}>
            <p style={styles.statLabel}>Total Bookings</p>
            <p style={styles.statValue}>{stats.total_bookings || 0}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterSection}>
        <div style={styles.filterTabs}>
          {["all", "paid", "pending"].map((f) => (
            <button
              key={f}
              style={{
                ...styles.filterTab,
                ...(filter === f ? styles.filterTabActive : {}),
              }}
              onClick={() => {
                setFilter(f);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "all" && stats.total_bookings > 0 && (
                <span style={styles.filterCount}>{stats.total_bookings}</span>
              )}
              {f === "paid" && stats.completed_payments > 0 && (
                <span style={styles.filterCount}>{stats.completed_payments}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div style={styles.errorContainer}>
          <p>{error}</p>
          <button style={styles.retryButton} onClick={fetchData}>
            Retry
          </button>
        </div>
      )}

      {/* Payments List */}
      {payments.length > 0 ? (
        <div style={styles.paymentsList}>
          {payments.map((payment) => (
            <div key={payment.booking_id} style={styles.paymentCard}>
              <div style={styles.paymentHeader}>
                <div style={styles.paymentInfo}>
                  <h3 style={styles.paymentHostel}>
                    {payment.hostel_name}
                  </h3>
                  <div style={styles.paymentLocation}>
                    <MapPin size={14} color="#6b7280" />
                    <span>{payment.location}</span>
                  </div>
                </div>
                {getStatusBadge(payment.payment_status)}
              </div>

              <div style={styles.paymentDates}>
                <div style={styles.dateItem}>
                  <span style={styles.dateLabel}>Check-in</span>
                  <span style={styles.dateValue}>
                    {new Date(payment.check_in).toLocaleDateString()}
                  </span>
                </div>
                <div style={styles.dateItem}>
                  <span style={styles.dateLabel}>Check-out</span>
                  <span style={styles.dateValue}>
                    {payment.check_out
                      ? new Date(payment.check_out).toLocaleDateString()
                      : "Ongoing"}
                  </span>
                </div>
                <div style={styles.dateItem}>
                  <span style={styles.dateLabel}>Booking ID</span>
                  <span style={styles.dateValue}>#{payment.booking_id}</span>
                </div>
              </div>

              <div style={styles.paymentFooter}>
                <div style={styles.amountSection}>
                  <span style={styles.amountLabel}>Amount Paid</span>
                  <span style={styles.amountValue}>
                    KSh {payment.payment_amount?.toLocaleString() || 0}
                  </span>
                </div>

                <div style={styles.paymentActions}>
                  {payment.payment_status === "paid" && (
                    <button
                      style={styles.receiptButton}
                      onClick={() => handleDownloadReceipt(payment)}
                    >
                      <Download size={16} />
                      Receipt
                    </button>
                  )}
                  <button
                    style={styles.viewButton}
                    onClick={() => handleViewBooking(payment.booking_id)}
                  >
                    <FileText size={16} />
                    View Booking
                  </button>
                </div>
              </div>

              {payment.paid_at && (
                <div style={styles.paymentMeta}>
                  <Calendar size={14} color="#6b7280" />
                  <span>
                    Paid on{" "}
                    {new Date(payment.paid_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {payment.payment_reference && (
                    <span style={styles.paymentRef}>
                      Ref: {payment.payment_reference}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <CreditCard size={64} color="#d1d5db" />
          <h3 style={styles.emptyStateTitle}>No payments found</h3>
          <p style={styles.emptyStateText}>
            {filter === "all"
              ? "You haven't made any payments yet"
              : `No ${filter} payments`}
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={styles.pagination}>
          <button
            style={{
              ...styles.pageButton,
              ...(pagination.page === 1 ? styles.pageButtonDisabled : {}),
            }}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span style={styles.pageInfo}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            style={{
              ...styles.pageButton,
              ...(pagination.page === pagination.pages
                ? styles.pageButtonDisabled
                : {}),
            }}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Mock data for demo
const getMockPayments = () => [
  {
    id: 1,
    payment_reference: "PAY-2024-001",
    payment_method: "mpesa",
    payment_status: "paid",
    payment_amount: 8500,
    paid_at: "2024-02-15T10:30:00Z",
    booking_id: 1,
    hostel_name: "University View Hostel",
    location: "123 College Ave, Nairobi",
    check_in: "2024-03-01",
    check_out: "2024-03-31",
    booking_status: "confirmed",
    created_at: "2024-02-15T10:25:00Z",
  },
  {
    id: 2,
    payment_reference: "PAY-2024-002",
    payment_method: "card",
    payment_status: "paid",
    payment_amount: 6500,
    paid_at: "2024-01-10T14:20:00Z",
    booking_id: 2,
    hostel_name: "Central Student Living",
    location: "456 Main Street, Nairobi",
    check_in: "2024-02-01",
    check_out: "2024-02-28",
    booking_status: "completed",
    created_at: "2024-01-10T14:15:00Z",
  },
  {
    id: 3,
    payment_reference: null,
    payment_method: null,
    payment_status: "pending",
    payment_amount: 8500,
    paid_at: null,
    booking_id: 3,
    hostel_name: "Green Valley Hostel",
    location: "789 Park Road, Nairobi",
    check_in: "2024-04-01",
    check_out: "2024-04-30",
    booking_status: "pending",
    created_at: "2024-03-20T09:00:00Z",
  },
];

const styles = {
  container: {
    maxWidth: "1000px",
    padding: "0 24px",
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
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "16px",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    gap: "16px",
    color: "#ef4444",
  },
  retryButton: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1a1a1a",
  },
  filterSection: {
    marginBottom: "24px",
  },
  filterTabs: {
    display: "flex",
    gap: "8px",
  },
  filterTab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  filterTabActive: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderColor: "#3b82f6",
  },
  filterCount: {
    padding: "2px 8px",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: "12px",
    fontSize: "12px",
  },
  paymentsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "32px",
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "24px",
  },
  paymentHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentHostel: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  paymentLocation: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#6b7280",
  },
  paymentDates: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  dateItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  dateLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 500,
  },
  dateValue: {
    fontSize: "14px",
    color: "#1a1a1a",
    fontWeight: 600,
  },
  paymentFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
  amountSection: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  amountLabel: {
    fontSize: "12px",
    color: "#6b7280",
  },
  amountValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1a1a1a",
  },
  paymentActions: {
    display: "flex",
    gap: "12px",
  },
  receiptButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  viewButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    backgroundColor: "#fff",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  paymentMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
    fontSize: "13px",
    color: "#6b7280",
  },
  paymentRef: {
    marginLeft: "auto",
    fontFamily: "monospace",
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
  emptyStateTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#374151",
    marginTop: "16px",
  },
  emptyStateText: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "8px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
  },
  pageButton: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  pageButtonDisabled: {
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
  },
  pageInfo: {
    fontSize: "14px",
    color: "#6b7280",
  },
};

export default StudentPayments;

