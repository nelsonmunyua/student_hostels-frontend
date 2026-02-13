import { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Loader2,
  Send,
  Mail,
  Phone,
  MapPin,
  Clock,
  ExternalLink,
  Filter,
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
} from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "../../../../main";
import adminApi from "../../../../api/adminApi";

const AdminSupport = () => {
  const { user } = useSelector((state) => state.auth);

  // State
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState("all"); // all | open | in_progress | resolved | closed

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  // Fetch tickets
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 10,
      };

      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await adminApi.getSupportTickets(params);

      // Handle different response formats (success or fallback)
      if (response && Array.isArray(response.tickets)) {
        setTickets(response.tickets);
        setTotalTickets(response.total || response.tickets.length);
        setTotalPages(response.pages || 1);
      } else if (Array.isArray(response)) {
        // Direct array response fallback
        setTickets(response);
        setTotalTickets(response.length);
        setTotalPages(1);
      } else {
        // No valid data - use mock data
        setTickets(getMockTickets());
        setTotalTickets(3);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError("Failed to load support tickets. Using demo data.");
      // Mock data for demo - always fallback gracefully
      setTickets(getMockTickets());
      setTotalTickets(3);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handle view ticket
  const handleViewTicket = async (ticket) => {
    setSelectedTicket(ticket);
  };

  // Handle update status
  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      await adminApi.updateSupportTicketStatus(ticketId, newStatus);
      toast.success(`Ticket status updated to ${newStatus}`);

      // Refresh tickets
      fetchTickets();

      // Update selected ticket if viewing
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (err) {
      console.error("Error updating ticket:", err);
      toast.error("Failed to update ticket status");
    }
  };

  // Handle delete ticket
  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    try {
      await adminApi.deleteSupportTicket(ticketId);
      toast.success("Ticket deleted successfully");
      setSelectedTicket(null);
      fetchTickets();
    } catch (err) {
      console.error("Error deleting ticket:", err);
      toast.error("Failed to delete ticket");
    }
  };

  // Filter tickets by search term
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Status tabs
  const statusTabs = [
    { id: "", label: "All", count: totalTickets },
    { id: "open", label: "Open", count: tickets.filter((t) => t.status === "open").length },
    { id: "in_progress", label: "In Progress", count: tickets.filter((t) => t.status === "in_progress").length },
    { id: "resolved", label: "Resolved", count: tickets.filter((t) => t.status === "resolved").length },
    { id: "closed", label: "Closed", count: tickets.filter((t) => t.status === "closed").length },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Support Tickets</h1>
          <p style={styles.subtitle}>
            Manage and respond to user support requests
          </p>
        </div>
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <span style={styles.statValue}>{totalTickets}</span>
            <span style={styles.statLabel}>Total Tickets</span>
          </div>
          <div style={styles.statCard}>
            <span style={{ ...styles.statValue, color: "#3b82f6" }}>
              {tickets.filter((t) => t.status === "open").length}
            </span>
            <span style={styles.statLabel}>Open</span>
          </div>
          <div style={styles.statCard}>
            <span style={{ ...styles.statValue, color: "#f59e0b" }}>
              {tickets.filter((t) => t.status === "in_progress").length}
            </span>
            <span style={styles.statLabel}>In Progress</span>
          </div>
          <div style={styles.statCard}>
            <span style={{ ...styles.statValue, color: "#10b981" }}>
              {tickets.filter((t) => t.status === "resolved").length}
            </span>
            <span style={styles.statLabel}>Resolved</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {statusTabs.map((tab) => (
          <button
            key={tab.id}
            style={{
              ...styles.tab,
              ...(activeTab === tab.id || (tab.id === "" && activeTab === "all")
                ? styles.tabActive
                : {}),
            }}
            onClick={() => {
              setActiveTab(tab.id || "all");
              setStatusFilter(tab.id);
              setCurrentPage(1);
            }}
          >
            {tab.label}
            {tab.count > 0 && (
              <span style={styles.tabBadge}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div style={styles.filtersRow}>
        <div style={styles.searchWrapper}>
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            style={styles.searchInput}
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.contentGrid}>
        {/* Tickets List */}
        <div style={styles.listContainer}>
          {/* Loading State */}
          {loading && (
            <div style={styles.loadingContainer}>
              <Loader2
                size={40}
                color="#3b82f6"
                style={{ animation: "spin 1s linear infinite" }}
              />
              <p>Loading support tickets...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div style={styles.errorContainer}>
              <AlertCircle size={40} color="#ef4444" />
              <p>{error}</p>
              <button style={styles.retryButton} onClick={fetchTickets}>
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredTickets.length === 0 && (
            <div style={styles.emptyState}>
              <MessageSquare size={64} color="#d1d5db" />
              <h3 style={styles.emptyStateTitle}>No support tickets</h3>
              <p style={styles.emptyStateText}>
                {searchTerm
                  ? "No tickets match your search criteria"
                  : "No support tickets have been submitted yet"}
              </p>
            </div>
          )}

          {/* Tickets List */}
          {!loading && !error && filteredTickets.length > 0 && (
            <>
              <div style={styles.ticketsList}>
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    style={{
                      ...styles.ticketCard,
                      ...(selectedTicket?.id === ticket.id
                        ? styles.ticketCardActive
                        : {}),
                    }}
                    onClick={() => handleViewTicket(ticket)}
                  >
                    <div style={styles.ticketHeader}>
                      <div style={styles.ticketInfo}>
                        <h4 style={styles.ticketSubject}>
                          {ticket.subject || "No Subject"}
                        </h4>
                        <p style={styles.ticketUser}>
                          {ticket.user_name || "Unknown User"}
                        </p>
                      </div>
                      <div style={styles.ticketStatus}>
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                    <p style={styles.ticketPreview}>
                      {ticket.message?.substring(0, 100)}
                      {ticket.message?.length > 100 ? "..." : ""}
                    </p>
                    <div style={styles.ticketFooter}>
                      <span style={styles.ticketDate}>
                        {formatDate(ticket.created_at)}
                      </span>
                      {ticket.booking_id && (
                        <span style={styles.ticketBookingId}>
                          Booking #{ticket.booking_id}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={styles.pagination}>
                  <button
                    style={{
                      ...styles.pageButton,
                      ...(currentPage === 1
                        ? styles.pageButtonDisabled
                        : {}),
                    }}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <span style={styles.pageInfo}>
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    style={{
                      ...styles.pageButton,
                      ...(currentPage === totalPages
                        ? styles.pageButtonDisabled
                        : {}),
                    }}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Ticket Detail */}
        <div style={styles.detailContainer}>
          {selectedTicket ? (
            <>
              <div style={styles.detailHeader}>
                <div>
                  <h2 style={styles.detailTitle}>
                    {selectedTicket.subject || "No Subject"}
                  </h2>
                  <p style={styles.detailSubtitle}>
                    Submitted by {selectedTicket.user_name} (
                    {selectedTicket.user_email})
                  </p>
                </div>
                <div style={styles.detailActions}>
                  <button
                    style={styles.actionButton}
                    onClick={() =>
                      handleUpdateStatus(selectedTicket.id, "in_progress")
                    }
                    title="Mark as In Progress"
                  >
                    <Clock size={18} />
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() =>
                      handleUpdateStatus(selectedTicket.id, "resolved")
                    }
                    title="Mark as Resolved"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.actionButtonDanger }}
                    onClick={() => handleDeleteTicket(selectedTicket.id)}
                    title="Delete Ticket"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div style={styles.detailStatus}>
                <span>Status:</span>
                {getStatusBadge(selectedTicket.status)}
              </div>

              <div style={styles.detailMessage}>
                <h4 style={styles.messageLabel}>Message</h4>
                <div style={styles.messageBox}>
                  <p>{selectedTicket.message}</p>
                </div>
              </div>

              <div style={styles.detailMeta}>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Ticket ID:</span>
                  <span style={styles.metaValue}>#{selectedTicket.id}</span>
                </div>
                <div style={styles.metaItem}>
                  <span style={styles.metaLabel}>Created:</span>
                  <span style={styles.metaValue}>
                    {formatDate(selectedTicket.created_at)}
                  </span>
                </div>
                {selectedTicket.booking_id && (
                  <div style={styles.metaItem}>
                    <span style={styles.metaLabel}>Related Booking:</span>
                    <span style={styles.metaValue}>
                      #{selectedTicket.booking_id}
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div style={styles.quickActions}>
                <h4 style={styles.quickActionsTitle}>Quick Actions</h4>
                <div style={styles.quickActionsButtons}>
                  <button
                    style={styles.quickActionBtn}
                    onClick={() =>
                      handleUpdateStatus(selectedTicket.id, "open")
                    }
                  >
                    <XCircle size={16} />
                    Reopen
                  </button>
                  <button
                    style={styles.quickActionBtn}
                    onClick={() =>
                      handleUpdateStatus(selectedTicket.id, "in_progress")
                    }
                  >
                    <Clock size={16} />
                    In Progress
                  </button>
                  <button
                    style={styles.quickActionBtn}
                    onClick={() =>
                      handleUpdateStatus(selectedTicket.id, "resolved")
                    }
                  >
                    <CheckCircle size={16} />
                    Resolve
                  </button>
                  <button
                    style={styles.quickActionBtn}
                    onClick={() =>
                      handleUpdateStatus(selectedTicket.id, "closed")
                    }
                  >
                    <CheckCircle size={16} />
                    Close
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={styles.noSelection}>
              <MessageSquare size={64} color="#d1d5db" />
              <h3 style={styles.noSelectionTitle}>Select a ticket</h3>
              <p style={styles.noSelectionText}>
                Choose a ticket from the list to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Mock data for demo
const getMockTickets = () => [
  {
    id: 1001,
    user_id: 1,
    user_name: "John Doe",
    user_email: "john.doe@student.edu",
    subject: "Booking Confirmation Issue",
    message:
      "I made a booking yesterday but haven't received a confirmation email yet. The booking ID is #12345. Please look into this as I'm supposed to move in next week.",
    status: "open",
    booking_id: 12345,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 1002,
    user_id: 2,
    user_name: "Jane Smith",
    user_email: "jane.smith@student.edu",
    subject: "Payment Inquiry",
    message:
      "I was charged twice for my booking at University View Hostel. Transaction IDs: TXN123456 and TXN789012. Please refund the duplicate charge.",
    status: "in_progress",
    booking_id: 67890,
    created_at: new Date(Date.now() - 604800000).toISOString(),
  },
  {
    id: 1003,
    user_id: 3,
    user_name: "Bob Johnson",
    user_email: "bob.johnson@student.edu",
    subject: "Room Change Request",
    message:
      "I would like to change my room from single to double at Green Valley Hostel due to budget constraints. Is this possible?",
    status: "resolved",
    booking_id: 11111,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100%",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
  },
  statsRow: {
    display: "flex",
    gap: "16px",
    marginTop: "16px",
  },
  statCard: {
    backgroundColor: "#fff",
    padding: "16px 24px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1e293b",
  },
  statLabel: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "4px",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: "12px",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderColor: "#3b82f6",
  },
  tabBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "12px",
  },
  filtersRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "16px",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    backgroundColor: "#fff",
    padding: "10px 16px",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    flex: 1,
    maxWidth: "400px",
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: "14px",
    flex: 1,
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    minHeight: "600px",
  },
  listContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
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
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "64px 24px",
    textAlign: "center",
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
  ticketsList: {
    display: "flex",
    flexDirection: "column",
  },
  ticketCard: {
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  ticketCardActive: {
    backgroundColor: "#f0f9ff",
    borderLeft: "3px solid #3b82f6",
  },
  ticketHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  ticketInfo: {
    flex: 1,
  },
  ticketSubject: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  ticketUser: {
    fontSize: "13px",
    color: "#64748b",
    margin: 0,
  },
  ticketPreview: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "8px 0",
    lineHeight: 1.4,
  },
  ticketFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "8px",
  },
  ticketDate: {
    fontSize: "12px",
    color: "#9ca3af",
  },
  ticketBookingId: {
    fontSize: "12px",
    color: "#3b82f6",
    backgroundColor: "#dbeafe",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    borderTop: "1px solid #f1f5f9",
  },
  pageButton: {
    padding: "8px 16px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },
  pageButtonDisabled: {
    backgroundColor: "#cbd5e1",
    cursor: "not-allowed",
  },
  pageInfo: {
    fontSize: "14px",
    color: "#64748b",
  },
  detailContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "24px",
  },
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  detailTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  detailSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  detailActions: {
    display: "flex",
    gap: "8px",
  },
  actionButton: {
    padding: "8px",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    border: "1px solid #0369a1",
    borderRadius: "6px",
    cursor: "pointer",
  },
  actionButtonDanger: {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    borderColor: "#dc2626",
  },
  detailStatus: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "20px",
    paddingBottom: "16px",
    borderBottom: "1px solid #f1f5f9",
  },
  detailMessage: {
    marginBottom: "20px",
  },
  messageLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "8px",
  },
  messageBox: {
    backgroundColor: "#f8fafc",
    padding: "16px",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#475569",
    lineHeight: 1.6,
  },
  detailMeta: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "20px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  metaItem: {
    display: "flex",
    gap: "8px",
  },
  metaLabel: {
    fontSize: "13px",
    color: "#64748b",
  },
  metaValue: {
    fontSize: "13px",
    color: "#1e293b",
    fontWeight: 500,
  },
  quickActions: {
    borderTop: "1px solid #f1f5f9",
    paddingTop: "16px",
  },
  quickActionsTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "12px",
  },
  quickActionsButtons: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  quickActionBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    border: "1px solid #bae6fd",
    borderRadius: "6px",
    fontSize: "13px",
    cursor: "pointer",
  },
  noSelection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    textAlign: "center",
  },
  noSelectionTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#374151",
    marginTop: "16px",
  },
  noSelectionText: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "8px",
  },
};

export default AdminSupport;

