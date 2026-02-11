import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Download,
  Mail,
  Home,
} from "lucide-react";
import { useSelector } from "react-redux";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const booking = location.state?.booking || {
    id: Math.floor(Math.random() * 10000) + 1000,
    accommodation_title: "University View Hostel",
    location: "123 College Ave, Nairobi",
    check_in: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    check_out: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    total_price: 29700,
  };

  const payment = location.state?.payment || {
    method: "M-Pesa",
    transaction_id:
      "MP" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  };

  const handleDownloadReceipt = () => {
    alert("Downloading receipt...");
  };

  const handleViewBookings = () => {
    navigate("/student/my-bookings");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconWrapper}>
          <CheckCircle size={48} color="#16a34a" />
        </div>

        <h1 style={styles.title}>Payment Successful!</h1>
        <p style={styles.subtitle}>
          Your booking has been confirmed. A confirmation email has been sent to
          your registered email address.
        </p>

        <div style={styles.bookingReference}>
          <span style={styles.referenceLabel}>Booking Reference</span>
          <span style={styles.referenceNumber}>#BK{booking.id}</span>
        </div>

        <div style={styles.divider}></div>

        <div style={styles.bookingDetails}>
          <h2 style={styles.sectionTitle}>Booking Details</h2>

          <div style={styles.detailRow}>
            <div style={styles.detailIcon}>
              <Home size={18} color="#64748b" />
            </div>
            <div style={styles.detailContent}>
              <span style={styles.detailLabel}>Property</span>
              <span style={styles.detailValue}>
                {booking.accommodation_title || "University View Hostel"}
              </span>
            </div>
          </div>

          <div style={styles.detailRow}>
            <div style={styles.detailIcon}>
              <MapPin size={18} color="#64748b" />
            </div>
            <div style={styles.detailContent}>
              <span style={styles.detailLabel}>Location</span>
              <span style={styles.detailValue}>
                {booking.location || "123 College Ave, Nairobi"}
              </span>
            </div>
          </div>

          <div style={styles.detailRow}>
            <div style={styles.detailIcon}>
              <Calendar size={18} color="#64748b" />
            </div>
            <div style={styles.detailContent}>
              <span style={styles.detailLabel}>Check-in</span>
              <span style={styles.detailValue}>
                {new Date(booking.check_in).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div style={styles.detailRow}>
            <div style={styles.detailIcon}>
              <Calendar size={18} color="#64748b" />
            </div>
            <div style={styles.detailContent}>
              <span style={styles.detailLabel}>Check-out</span>
              <span style={styles.detailValue}>
                {new Date(booking.check_out).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div style={styles.detailRow}>
            <div style={styles.detailIcon}>
              <Mail size={18} color="#64748b" />
            </div>
            <div style={styles.detailContent}>
              <span style={styles.detailLabel}>Confirmation Sent To</span>
              <span style={styles.detailValue}>
                {user?.email || "your@email.com"}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.paymentInfo}>
          <div style={styles.paymentRow}>
            <span style={styles.paymentLabel}>Payment Method</span>
            <span style={styles.paymentValue}>{payment.method}</span>
          </div>
          <div style={styles.paymentRow}>
            <span style={styles.paymentLabel}>Transaction ID</span>
            <span style={styles.paymentValue}>{payment.transaction_id}</span>
          </div>
          <div style={styles.paymentRow}>
            <span style={styles.paymentLabel}>Amount Paid</span>
            <span style={styles.paymentValue}>
              KSh {booking.total_price?.toLocaleString() || "29,700"}
            </span>
          </div>
        </div>

        <div style={styles.actions}>
          <button style={styles.primaryButton} onClick={handleDownloadReceipt}>
            <Download size={18} />
            Download Receipt
          </button>
          <button style={styles.secondaryButton} onClick={handleViewBookings}>
            View My Bookings
          </button>
          <button style={styles.tertiaryButton} onClick={handleGoHome}>
            Back to Home
          </button>
        </div>

        <div style={styles.helpSection}>
          <p style={styles.helpText}>
            Need help? Contact our support team at{" "}
            <strong>support@student-hostel.com</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "48px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  iconWrapper: {
    width: "96px",
    height: "96px",
    backgroundColor: "#dcfce7",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
    marginBottom: "24px",
  },
  bookingReference: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "16px",
    backgroundColor: "#f0f9ff",
    borderRadius: "8px",
    marginBottom: "32px",
  },
  referenceLabel: {
    fontSize: "12px",
    color: "#0369a1",
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  referenceNumber: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#0369a1",
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "32px 0",
  },
  bookingDetails: {
    textAlign: "left",
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "20px",
  },
  detailRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "12px 0",
  },
  detailIcon: {
    width: "40px",
    height: "40px",
    backgroundColor: "#f1f5f9",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  detailContent: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: "15px",
    color: "#1e293b",
    fontWeight: "500",
  },
  paymentInfo: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "32px",
  },
  paymentRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
  },
  paymentLabel: {
    fontSize: "14px",
    color: "#64748b",
  },
  paymentValue: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#1e293b",
  },
  actions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  primaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "16px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  secondaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "16px",
    backgroundColor: "#ffffff",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tertiaryButton: {
    padding: "12px",
    backgroundColor: "transparent",
    color: "#64748b",
    border: "none",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
  },
  helpSection: {
    marginTop: "32px",
    paddingTop: "24px",
    borderTop: "1px solid #e5e7eb",
  },
  helpText: {
    fontSize: "14px",
    color: "#64748b",
  },
};

export default PaymentSuccess;
