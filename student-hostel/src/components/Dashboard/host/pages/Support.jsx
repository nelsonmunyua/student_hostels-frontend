import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Loader2,
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
} from "lucide-react";
import { useSelector } from "react-redux";
import hostApi from "../../../../api/hostApi";

const HostSupport = () => {
  const { user } = useSelector((state) => state.auth);

  // State
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("new"); // new | tickets

  // Form state
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: "general",
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await hostApi.getSupportTickets();
      setTickets(response.tickets || []);
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load support tickets. Please try again.");
      // Mock data for demo
      setTickets(getMockTickets());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "tickets") {
      fetchTickets();
    }
  }, [activeTab, fetchTickets]);

  // Handle form change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  // Submit support ticket
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim() || !formData.message.trim()) {
      setFormError("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      await hostApi.createSupportTicket(formData);

      setFormSuccess(true);
      setFormData({ subject: "", message: "", category: "general" });

      // Refresh tickets if on tickets tab
      if (activeTab === "tickets") {
        fetchTickets();
      }

      // Reset success message after 3 seconds
      setTimeout(() => {
        setFormSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error creating ticket:", err);
      setFormError("Failed to submit support ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      open: {
        color: "#3b82f6",
        bgColor: "#dbeafe",
        text: "Open",
      },
      in_progress: {
        color: "#f59e0b",
        bgColor: "#fef3c7",
        text: "In Progress",
      },
      resolved: {
        color: "#10b981",
        bgColor: "#d1fae5",
        text: "Resolved",
      },
      closed: {
        color: "#6b7280",
        bgColor: "#f3f4f6",
        text: "Closed",
      },
    };

    const { color, bgColor, text } = config[status] || config.open;

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 10px",
          backgroundColor: bgColor,
          color: color,
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        {text}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && tickets.length === 0 && activeTab === "tickets") {
    return (
      <div style={styles.loadingContainer}>
        <Loader2
          size={40}
          color="#3b82f6"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <p>Loading support tickets...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Support Center</h1>
          <p style={styles.subtitle}>
            Get help with any issues or questions about your hosting business
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "new" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("new")}
        >
          <MessageSquare size={18} />
          New Request
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "tickets" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("tickets")}
        >
          My Tickets ({tickets.length})
        </button>
      </div>

      {/* Contact Info Cards */}
      <div style={styles.contactGrid}>
        <div style={styles.contactCard}>
          <div style={styles.contactIcon}>
            <Mail size={24} color="#3b82f6" />
          </div>
          <h3 style={styles.contactTitle}>Email Us</h3>
          <p style={styles.contactText}>hostsupport@studenthostel.com</p>
          <p style={styles.contactSubtext}>We respond within 24 hours</p>
        </div>

        <div style={styles.contactCard}>
          <div style={styles.contactIcon}>
            <Phone size={24} color="#10b981" />
          </div>
          <h3 style={styles.contactTitle}>Call Us</h3>
          <p style={styles.contactText}>+254 700 000 001</p>
          <p style={styles.contactSubtext}>Mon-Fri, 9am-6pm</p>
        </div>

        <div style={styles.contactCard}>
          <div style={styles.contactIcon}>
            <MapPin size={24} color="#f59e0b" />
          </div>
          <h3 style={styles.contactTitle}>Visit Us</h3>
          <p style={styles.contactText}>123 University Ave</p>
          <p style={styles.contactSubtext}>Nairobi, Kenya</p>
        </div>

        <div style={styles.contactCard}>
          <div style={styles.contactIcon}>
            <Clock size={24} color="#8b5cf6" />
          </div>
          <h3 style={styles.contactTitle}>Support Hours</h3>
          <p style={styles.contactText}>24/7 Live Chat</p>
          <p style={styles.contactSubtext}>Email support always available</p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div style={styles.errorContainer}>
          <p>{error}</p>
          <button style={styles.retryButton} onClick={fetchTickets}>
            Retry
          </button>
        </div>
      )}

      {/* New Request Form */}
      {activeTab === "new" && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Submit a Support Request</h2>
          <p style={styles.formSubtitle}>
            Fill out the form below and we'll get back to you as soon as
            possible.
          </p>

          {formSuccess && (
            <div style={styles.successMessage}>
              <MessageSquare size={20} />
              <span>
                Your support request has been submitted successfully! We'll
                respond within 24 hours.
              </span>
            </div>
          )}

          {formError && (
            <div style={styles.errorMessage}>{formError}</div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Category */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="general">General Inquiry</option>
                <option value="listing">Listing Issue</option>
                <option value="booking">Booking Management</option>
                <option value="payment">Payment & Earnings</option>
                <option value="verification">Verification</option>
                <option value="technical">Technical Support</option>
                <option value="dispute">Dispute Resolution</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Subject */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Subject <span style={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="Brief description of your issue"
                style={styles.input}
              />
            </div>

            {/* Message */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Message <span style={styles.required}>*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Please provide as much detail as possible about your issue, including any booking IDs, property names, or error messages you've encountered..."
                rows={6}
                style={styles.textarea}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(submitting ? styles.submitButtonDisabled : {}),
              }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    color="#fff"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Request
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Tickets List */}
      {activeTab === "tickets" && (
        <>
          {tickets.length > 0 ? (
            <div style={styles.ticketsList}>
              {tickets.map((ticket) => (
                <div key={ticket.id} style={styles.ticketCard}>
                  <div style={styles.ticketHeader}>
                    <div style={styles.ticketInfo}>
                      <h3 style={styles.ticketSubject}>{ticket.subject}</h3>
                      <p style={styles.ticketMessage}>{ticket.message}</p>
                      {ticket.category && (
                        <span style={styles.ticketCategory}>
                          {ticket.category.replace("_", " ")}
                        </span>
                      )}
                    </div>
                    <div style={styles.ticketStatus}>
                      {getStatusBadge(ticket.status)}
                    </div>
                  </div>
                  <div style={styles.ticketFooter}>
                    <span style={styles.ticketId}>Ticket #{ticket.id}</span>
                    <span style={styles.ticketDate}>
                      {formatDate(ticket.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <MessageSquare size={64} color="#d1d5db" />
              <h3 style={styles.emptyStateTitle}>No support tickets</h3>
              <p style={styles.emptyStateText}>
                You haven't submitted any support requests yet
              </p>
            </div>
          )}
        </>
      )}

      {/* FAQ Section */}
      <div style={styles.faqSection}>
        <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqList}>
          <div style={styles.faqItem}>
            <details style={styles.faqDetails}>
              <summary style={styles.faqQuestion}>
                How do I list a new property?
              </summary>
              <p style={styles.faqAnswer}>
                Navigate to your Listings page and click "Add New Listing". Fill
                in the property details, upload photos, set your prices, and
                submit for review. Once approved, your listing will be visible to
                students searching for accommodation.
              </p>
            </details>
          </div>

          <div style={styles.faqItem}>
            <details style={styles.faqDetails}>
              <summary style={styles.faqQuestion}>
                When do I get paid for bookings?
              </summary>
              <p style={styles.faqAnswer}>
                Payments are processed within 48 hours after guest check-in.
                Funds are transferred to your registered bank account or M-Pesa
                account. You can track your earnings in the Earnings section of
                your dashboard.
              </p>
            </details>
          </div>

          <div style={styles.faqItem}>
            <details style={styles.faqDetails}>
              <summary style={styles.faqQuestion}>
                How do I manage booking requests?
              </summary>
              <p style={styles.faqAnswer}>
                Go to your Bookings page to see all booking requests. You can
                Accept or Reject each request based on availability. Accepted
                bookings will be marked as confirmed, and you'll receive a
                notification once the guest completes payment.
              </p>
            </details>
          </div>

          <div style={styles.faqItem}>
            <details style={styles.faqDetails}>
              <summary style={styles.faqQuestion}>
                What if a guest cancels their booking?
              </summary>
              <p style={styles.faqAnswer}>
                Cancellation policies can be set for each listing. If a guest
                cancels, you'll be notified immediately. Depending on your policy,
                you may receive a cancellation fee. Refunds to guests are
                processed automatically based on the cancellation terms.
              </p>
            </details>
          </div>

          <div style={styles.faqItem}>
            <details style={styles.faqDetails}>
              <summary style={styles.faqQuestion}>
                How do I respond to reviews?
              </summary>
              <p style={styles.faqAnswer}>
                You can respond to guest reviews from your Reviews page. Click on
                any review to add your response. Public responses are visible to
                other users and can help improve your reputation as a host.
              </p>
            </details>
          </div>

          <div style={styles.faqItem}>
            <details style={styles.faqDetails}>
              <summary style={styles.faqQuestion}>
                How can I update my property availability?
              </summary>
              <p style={styles.faqAnswer}>
                Visit the Availability page to manage your property calendar.
                You can block specific dates, set seasonal pricing, or mark
                rooms as unavailable. Changes take effect immediately on your
                listing.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mock data for demo
const getMockTickets = () => [
  {
    id: 2001,
    subject: "Payment Not Received",
    message:
      "I have a confirmed booking from last week but haven't received the payment yet.",
    status: "in_progress",
    category: "payment",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 2002,
    subject: "Listing Approval",
    message:
      "My new listing has been pending approval for over a week. Can you check on this?",
    status: "open",
    category: "listing",
    created_at: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 2003,
    subject: "Guest Damaged Property",
    message:
      "A guest caused damage to one of the rooms during their stay. I need guidance on how to proceed with a claim.",
    status: "resolved",
    category: "dispute",
    created_at: new Date(Date.now() - 1209600000).toISOString(),
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
  tabs: {
    display: "flex",
    gap: "12px",
    marginBottom: "32px",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderColor: "#3b82f6",
  },
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "32px",
  },
  contactCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "24px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  contactIcon: {
    width: "56px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: "12px",
    marginBottom: "16px",
  },
  contactTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  contactText: {
    fontSize: "14px",
    color: "#374151",
    marginBottom: "4px",
  },
  contactSubtext: {
    fontSize: "13px",
    color: "#9ca3af",
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
    marginBottom: "24px",
  },
  retryButton: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "32px",
    marginBottom: "32px",
  },
  formTitle: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "24px",
  },
  successMessage: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#d1fae5",
    color: "#065f46",
    borderRadius: "10px",
    marginBottom: "24px",
    fontSize: "14px",
  },
  errorMessage: {
    padding: "12px 16px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
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
    fontWeight: 600,
    color: "#374151",
  },
  required: {
    color: "#ef4444",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
  },
  select: {
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#fff",
  },
  textarea: {
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
  },
  submitButtonDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  },
  ticketsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "32px",
  },
  ticketCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "20px",
  },
  ticketHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  ticketInfo: {
    flex: 1,
  },
  ticketSubject: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  ticketMessage: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.5,
    marginBottom: "8px",
  },
  ticketCategory: {
    display: "inline-block",
    padding: "2px 8px",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    borderRadius: "4px",
    fontSize: "12px",
    textTransform: "capitalize",
  },
  ticketStatus: {},
  ticketFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
  },
  ticketId: {
    fontSize: "13px",
    color: "#9ca3af",
    fontFamily: "monospace",
  },
  ticketDate: {
    fontSize: "13px",
    color: "#6b7280",
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
    marginBottom: "32px",
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
  faqSection: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "32px",
  },
  faqTitle: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "24px",
  },
  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  faqItem: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },
  faqDetails: {
    width: "100%",
  },
  faqQuestion: {
    padding: "16px 20px",
    backgroundColor: "#f9fafb",
    fontSize: "15px",
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
    listStyle: "none",
    margin: 0,
  },
  faqAnswer: {
    padding: "16px 20px",
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.6,
    borderTop: "1px solid #e5e7eb",
  },
};

export default HostSupport;

