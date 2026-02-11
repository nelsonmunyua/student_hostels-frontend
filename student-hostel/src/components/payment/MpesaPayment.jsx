import { useState } from "react";
import { Phone, Send, Lock, AlertCircle, CheckCircle } from "lucide-react";
import paymentApi from "../../api/Paymentapi";

const MpesaPayment = ({ bookingData, onSuccess, onCancel }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      return "254" + cleaned.slice(1);
    }
    if (cleaned.startsWith("254")) {
      return cleaned;
    }
    if (cleaned.startsWith("7")) {
      return "254" + cleaned;
    }
    return cleaned;
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
  };

  const validatePhone = () => {
    const formatted = formatPhoneNumber(phoneNumber);
    return formatted.length === 12 && formatted.startsWith("254");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone()) {
      setError("Please enter a valid Kenyan phone number");
      return;
    }

    setStatus("processing");
    setError(null);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);

      const response = await paymentApi.initiateMpesaPayment({
        booking_id: bookingData.booking_id || bookingData.id,
        phone_number: formattedPhone,
        amount: bookingData.total_price || bookingData.amount,
      });

      setStatus("success");
      setMessage("STK push sent! Please check your phone and enter your PIN.");

      setTimeout(() => {
        onSuccess({
          payment_method: "mpesa",
          transaction_id: response.transaction_id || "MPESA" + Date.now(),
          phone: formattedPhone,
        });
      }, 3000);
    } catch (err) {
      setStatus("error");
      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment failed. Please try again.",
      );
    }
  };

  const amount = bookingData.total_price || bookingData.amount || 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <div style={styles.mpesaLogo}>M</div>
        </div>
        <div>
          <h2 style={styles.title}>Pay with M-Pesa</h2>
          <p style={styles.subtitle}>Secure payment via M-Pesa mobile money</p>
        </div>
      </div>

      {status === "idle" && (
        <>
          {error && (
            <div style={styles.errorBanner}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <div style={styles.infoBox}>
            <div style={styles.infoRow}>
              <span>Amount to pay:</span>
              <span style={styles.amount}>KSh {amount.toLocaleString()}</span>
            </div>
            <div style={styles.infoRow}>
              <span>Booking ID:</span>
              <span>#{bookingData.booking_id || bookingData.id || "N/A"}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Phone Number</label>
              <div style={styles.phoneInputWrapper}>
                <Phone size={18} style={styles.inputIcon} />
                <input
                  type="tel"
                  placeholder="07XX XXX XXX"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  maxLength={10}
                  style={styles.phoneInput}
                />
              </div>
              <span style={styles.hint}>
                Enter your M-Pesa registered number (e.g., 0712345678)
              </span>
            </div>

            <button type="submit" style={styles.submitButton}>
              <Send size={18} />
              Pay KSh {amount.toLocaleString()}
            </button>
          </form>

          <div style={styles.securityNote}>
            <Lock size={14} />
            <span>Your transaction is secure and encrypted</span>
          </div>
        </>
      )}

      {status === "processing" && (
        <div style={styles.processingState}>
          <h3 style={styles.processingTitle}>Processing Payment</h3>
          <p style={styles.processingText}>
            We've sent an STK push to your phone. Please enter your M-Pesa PIN
            to complete the payment.
          </p>
          <div style={styles.waitNote}>Waiting for payment confirmation...</div>
        </div>
      )}

      {status === "success" && (
        <div style={styles.successState}>
          <div style={styles.successIcon}>
            <CheckCircle size={48} color="#16a34a" />
          </div>
          <h3 style={styles.successTitle}>Payment Initiated!</h3>
          <p style={styles.successText}>{message}</p>
          <div style={styles.successNote}>
            Check your phone and enter your M-Pesa PIN to complete the
            transaction.
          </div>
        </div>
      )}

      {status === "error" && (
        <div style={styles.errorState}>
          <div style={styles.errorIcon}>
            <AlertCircle size={48} color="#dc2626" />
          </div>
          <h3 style={styles.errorTitle}>Payment Failed</h3>
          <p style={styles.errorText}>{error}</p>
          <button
            style={styles.retryButton}
            onClick={() => {
              setStatus("idle");
              setError(null);
            }}
          >
            Try Again
          </button>
        </div>
      )}

      <div style={styles.cancelWrapper}>
        <button style={styles.cancelButton} onClick={onCancel}>
          Cancel Payment
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    maxWidth: "500px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f1f5f9",
  },
  headerIcon: {
    width: "64px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  mpesaLogo: {
    width: "48px",
    height: "48px",
    backgroundColor: "#00b53c",
    color: "#ffffff",
    fontSize: "28px",
    fontWeight: "700",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  errorBanner: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#dc2626",
    fontSize: "14px",
    marginBottom: "20px",
  },
  infoBox: {
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    marginBottom: "20px",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    fontSize: "14px",
  },
  amount: {
    fontWeight: "700",
    color: "#1e293b",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },
  phoneInputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
  },
  inputIcon: {
    color: "#94a3b8",
  },
  phoneInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "16px",
    fontFamily: "monospace",
  },
  hint: {
    fontSize: "12px",
    color: "#64748b",
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "16px",
    backgroundColor: "#00b53c",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  securityNote: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    marginTop: "16px",
    padding: "12px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#059669",
  },
  processingState: {
    textAlign: "center",
    padding: "32px 16px",
  },
  spinnerLarge: {
    width: "48px",
    height: "48px",
    border: "4px solid #e5e7eb",
    borderTopColor: "#00b53c",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 24px",
  },
  processingTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: "12px",
  },
  processingText: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "16px",
  },
  waitNote: {
    padding: "12px 16px",
    backgroundColor: "#fef3c7",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#92400e",
  },
  successState: {
    textAlign: "center",
    padding: "32px 16px",
  },
  successIcon: {
    marginBottom: "16px",
  },
  successTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#16a34a",
    marginBottom: "8px",
  },
  successText: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "16px",
  },
  successNote: {
    padding: "12px 16px",
    backgroundColor: "#dcfce7",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#166534",
  },
  errorState: {
    textAlign: "center",
    padding: "32px 16px",
  },
  errorIcon: {
    marginBottom: "16px",
  },
  errorTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#dc2626",
    marginBottom: "8px",
  },
  errorText: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "24px",
  },
  retryButton: {
    padding: "12px 24px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  cancelWrapper: {
    marginTop: "16px",
    textAlign: "center",
  },
  cancelButton: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: "14px",
    cursor: "pointer",
    textDecoration: "underline",
  },
};

export default MpesaPayment;
