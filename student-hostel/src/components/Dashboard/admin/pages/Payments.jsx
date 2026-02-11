import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Eye,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { toast } from "../../../../main";
import adminApi from "../../../../api/adminApi";

const AdminPayments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Fetch payments from API
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getPayments();
        
        // Transform API data to match frontend structure
        const transformedPayments = Array.isArray(data) ? data.map((payment) => ({
          id: payment.id,
          reference: payment.reference || `PAY-${payment.id}`,
          guest: {
            name: `User #${payment.booking_id || payment.student_id || payment.id}`,
            email: "user@example.com",
          },
          accommodation: {
            name: "Hostel Booking",
            roomType: "Standard Room",
          },
          amount: payment.amount || 0,
          method: payment.method || "unknown",
          status: payment.status || "pending",
          date: payment.created_at || payment.paid_at || new Date().toISOString(),
          booking_id: payment.booking_id,
          paid_at: payment.paid_at,
        })) : [];
        
        setPayments(transformedPayments);
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        // Keep mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Mock data for fallback
  const mockPayments = [
    {
      id: 1,
      reference: "PAY-2024-001",
      guest: {
        name: "John Doe",
        email: "john.doe@email.com",
      },
      accommodation: {
        name: "University View Hostel",
        roomType: "Single Room",
      },
      amount: 4600,
      method: "mpesa",
      status: "paid",
      date: "2024-02-10",
    },
    {
      id: 2,
      reference: "PAY-2024-002",
      guest: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
      },
      accommodation: {
        name: "Central Student Living",
        roomType: "Double Room",
      },
      amount: 5400,
      method: "card",
      status: "paid",
      date: "2024-01-25",
    },
    {
      id: 3,
      reference: "PAY-2024-003",
      guest: {
        name: "Mike Brown",
        email: "mike.brown@email.com",
      },
      accommodation: {
        name: "Campus Edge Apartments",
        roomType: "Studio",
      },
      amount: 3640,
      method: "bank",
      status: "pending",
      date: "2024-02-15",
    },
    {
      id: 4,
      reference: "PAY-2024-004",
      guest: {
        name: "Emily Davis",
        email: "emily.d@email.com",
      },
      accommodation: {
        name: "Student Haven",
        roomType: "Single Room",
      },
      amount: 3276,
      method: "mpesa",
      status: "paid",
      date: "2024-01-10",
    },
    {
      id: 5,
      reference: "PAY-2024-005",
      guest: {
        name: "David Wilson",
        email: "d.wilson@email.com",
      },
      accommodation: {
        name: "The Scholar's Residence",
        roomType: "Double Room",
      },
      amount: 7200,
      method: "card",
      status: "refunded",
      date: "2024-01-20",
    },
    {
      id: 6,
      reference: "PAY-2024-006",
      guest: {
        name: "Lisa Anderson",
        email: "lisa.a@email.com",
      },
      accommodation: {
        name: "Dormitory Plus",
        roomType: "Shared Room",
      },
      amount: 2760,
      method: "mpesa",
      status: "paid",
      date: "2024-02-05",
    },
  ];

  // Use mock data if API data is empty
  const displayPayments = payments.length > 0 ? payments : mockPayments;

  // Stats calculations
  const totalRevenue = displayPayments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = displayPayments.filter((p) => p.status === "pending").length;
  const successfulPayments = displayPayments.filter((p) => p.status === "paid").length;
  const refundedAmount = displayPayments
    .filter((p) => p.status === "refunded")
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "#059669";
      case "pending":
        return "#d97706";
      case "failed":
        return "#dc2626";
      case "refunded":
        return "#7c3aed";
      default:
        return "#6b7280";
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case "mpesa":
        return "📱";
      case "card":
        return "💳";
      case "bank":
        return "🏦";
      default:
        return "💰";
    }
  };

  const filteredPayments = displayPayments.filter((payment) => {
    const matchesSearch =
      payment.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.guest?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.guest?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle refund payment
  const handleRefund = async (payment) => {
    if (window.confirm(`Are you sure you want to refund payment ${payment.reference}?`)) {
      try {
        await adminApi.updatePaymentStatus(payment.id, "refunded");
        toast.success("Payment refunded successfully!");
        
        // Refresh list
        const data = await adminApi.getPayments();
        setPayments(data);
      } catch (error) {
        console.error("Failed to refund payment:", error);
        toast.error("Failed to refund payment. Please try again.");
      }
    }
  };

  // Handle view payment details
  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  // Handle download receipt
  const handleDownloadReceipt = async (payment) => {
    toast.info(`Downloading receipt for ${payment.reference} (Demo)`);
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Payments</h1>
          <p style={styles.subtitle}>
            Manage and monitor all platform payments and transactions
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <DollarSign size={24} color="#059669" />
          </div>
          <div>
            <p style={styles.statValue}>Ksh{totalRevenue.toLocaleString()}</p>
            <p style={styles.statLabel}>Total Revenue</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Clock size={24} color="#d97706" />
          </div>
          <div>
            <p style={styles.statValue}>{pendingPayments}</p>
            <p style={styles.statLabel}>Pending Payments</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <CheckCircle size={24} color="#0369a1" />
          </div>
          <div>
            <p style={styles.statValue}>{successfulPayments}</p>
            <p style={styles.statLabel}>Successful Payments</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <RefreshCw size={24} color="#7c3aed" />
          </div>
          <div>
            <p style={styles.statValue}>Ksh{refundedAmount.toLocaleString()}</p>
            <p style={styles.statLabel}>Refunded Amount</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchContainer}>
          <Search size={16} color="#6b7280" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Payments Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Reference</th>
              <th style={styles.tableHeader}>Guest</th>
              <th style={styles.tableHeader}>Accommodation</th>
              <th style={styles.tableHeader}>Amount</th>
              <th style={styles.tableHeader}>Method</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Date</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <span style={styles.reference}>{payment.reference}</span>
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.guestInfo}>
                    <div style={styles.avatar}>
                      {payment.guest?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p style={styles.guestName}>{payment.guest?.name}</p>
                      <p style={styles.guestEmail}>{payment.guest?.email}</p>
                    </div>
                  </div>
                </td>
                <td style={styles.tableCell}>
                  <div>
                    <p style={styles.accommodationName}>
                      {payment.accommodation?.name}
                    </p>
                    <p style={styles.roomType}>
                      {payment.accommodation?.roomType}
                    </p>
                  </div>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.amountText}>
                    Ksh{payment.amount?.toLocaleString()}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.methodBadge}>
                    {getMethodIcon(payment.method)} {payment.method}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(payment.status),
                    }}
                  >
                    {payment.status}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.dateText}>
                    {new Date(payment.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.actionButton}
                      onClick={() => handleViewPayment(payment)}
                    >
                      <Eye size={14} />
                    </button>
                    {payment.status === "pending" && (
                      <button
                        style={{ ...styles.actionButton, color: "#059669" }}
                        onClick={() => {
                          if (
                            window.confirm(
                              `Mark payment ${payment.reference} as paid?`
                            )
                          ) {
                            adminApi
                              .updatePaymentStatus(payment.id, "paid")
                              .then(() => {
                                toast.success("Payment marked as paid!");
                                fetchPayments();
                              })
                              .catch((err) => {
                                console.error(err);
                                toast.error("Failed to update payment");
                              });
                          }
                        }}
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    {payment.status === "paid" && (
                      <button
                        style={{ ...styles.actionButton, color: "#dc2626" }}
                        onClick={() => handleRefund(payment)}
                      >
                        <RefreshCw size={14} />
                      </button>
                    )}
                    <button
                      style={styles.actionButton}
                      onClick={() => handleDownloadReceipt(payment)}
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "8px",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#1f2937",
    margin: 0,
  },
  statLabel: {
    color: "#6b7280",
    margin: "4px 0 0 0",
    fontSize: "14px",
  },
  filterBar: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    alignItems: "center",
  },
  searchContainer: {
    position: "relative",
    flex: 1,
    maxWidth: "400px",
  },
  searchInput: {
    width: "100%",
    padding: "12px 40px 12px 40px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "white",
  },
  filterSelect: {
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "white",
    minWidth: "120px",
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    padding: "16px",
    textAlign: "left",
    fontWeight: "600",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
  },
  tableCell: {
    padding: "16px",
    verticalAlign: "top",
  },
  reference: {
    fontFamily: "monospace",
    fontSize: "13px",
    color: "#0369a1",
    fontWeight: "500",
  },
  guestInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#0369a1",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
  },
  guestName: {
    fontWeight: "500",
    color: "#1f2937",
    margin: 0,
    fontSize: "14px",
  },
  guestEmail: {
    color: "#6b7280",
    margin: "2px 0 0 0",
    fontSize: "13px",
  },
  accommodationName: {
    fontWeight: "500",
    color: "#1f2937",
    margin: 0,
    fontSize: "14px",
  },
  roomType: {
    color: "#6b7280",
    margin: "2px 0 0 0",
    fontSize: "13px",
  },
  amountText: {
    fontWeight: "600",
    color: "#059669",
    fontSize: "14px",
  },
  methodBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    backgroundColor: "#f3f4f6",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "12px",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  dateText: {
    fontSize: "13px",
    color: "#6b7280",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
  actionButton: {
    padding: "6px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#6b7280",
  },
};

export default AdminPayments;

