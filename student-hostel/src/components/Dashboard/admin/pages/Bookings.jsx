import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Calendar,
  User,
  Home,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  X,
  Download,
  Plus,
} from "lucide-react";
import adminApi from "../../../../api/adminApi";

const Bookings = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings from API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        // Keep mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Mock data for fallback
  const mockBookings = [
    {
      id: 1,
      guest: {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+1 (555) 123-4567",
      },
      accommodation: {
        name: "University View Hostel",
        location: "123 Campus Drive",
        roomType: "Single Room",
      },
      checkIn: "2024-03-15",
      checkOut: "2024-06-15",
      nights: 92,
      totalAmount: 4600,
      status: "confirmed",
      paymentStatus: "paid",
      bookingDate: "2024-02-10",
      specialRequests: "Late check-in requested",
    },
    {
      id: 2,
      guest: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        phone: "+1 (555) 234-5678",
      },
      accommodation: {
        name: "Central Student Living",
        location: "456 Main Street",
        roomType: "Double Room",
      },
      checkIn: "2024-02-20",
      checkOut: "2024-05-20",
      nights: 90,
      totalAmount: 5400,
      status: "confirmed",
      paymentStatus: "paid",
      bookingDate: "2024-01-25",
      specialRequests: null,
    },
    {
      id: 3,
      guest: {
        name: "Mike Brown",
        email: "mike.brown@email.com",
        phone: "+1 (555) 345-6789",
      },
      accommodation: {
        name: "Campus Edge Apartments",
        location: "789 University Ave",
        roomType: "Studio",
      },
      checkIn: "2024-04-01",
      checkOut: "2024-07-01",
      nights: 91,
      totalAmount: 3640,
      status: "pending",
      paymentStatus: "pending",
      bookingDate: "2024-02-15",
      specialRequests: "Allergy to nuts",
    },
    {
      id: 4,
      guest: {
        name: "Emily Davis",
        email: "emily.d@email.com",
        phone: "+1 (555) 456-7890",
      },
      accommodation: {
        name: "Student Haven",
        location: "321 College Road",
        roomType: "Single Room",
      },
      checkIn: "2024-01-15",
      checkOut: "2024-04-15",
      nights: 91,
      totalAmount: 3276,
      status: "active",
      paymentStatus: "paid",
      bookingDate: "2024-01-10",
      specialRequests: null,
    },
    {
      id: 5,
      guest: {
        name: "David Wilson",
        email: "d.wilson@email.com",
        phone: "+1 (555) 567-8901",
      },
      accommodation: {
        name: "The Scholar's Residence",
        location: "555 Academic Way",
        roomType: "Double Room",
      },
      checkIn: "2024-02-01",
      checkOut: "2024-05-01",
      nights: 90,
      totalAmount: 7200,
      status: "cancelled",
      paymentStatus: "refunded",
      bookingDate: "2024-01-20",
      specialRequests: "Quiet room preferred",
    },
    {
      id: 6,
      guest: {
        name: "Lisa Anderson",
        email: "lisa.a@email.com",
        phone: "+1 (555) 678-9012",
      },
      accommodation: {
        name: "Dormitory Plus",
        location: "888 Student Lane",
        roomType: "Shared Room",
      },
      checkIn: "2024-03-01",
      checkOut: "2024-06-01",
      nights: 92,
      totalAmount: 2760,
      status: "confirmed",
      paymentStatus: "paid",
      bookingDate: "2024-02-05",
      specialRequests: "Early check-in if possible",
    },
  ];

  // Use mock data if API data is empty
  const displayBookings = bookings.length > 0 ? bookings : mockBookings;

  // Safe getter for guest name
  const getGuestName = (booking) => {
    if (booking.guest?.name) return booking.guest.name;
    if (booking.student_id) return `User #${booking.student_id}`;
    return "Guest";
  };

  // Safe getter for guest email
  const getGuestEmail = (booking) => {
    if (booking.guest?.email) return booking.guest.email;
    return "guest@example.com";
  };

  // Safe getter for accommodation name
  const getAccommodationName = (booking) => {
    if (booking.accommodation?.name) return booking.accommodation.name;
    if (booking.room_id) return `Room #${booking.room_id}`;
    return "Accommodation";
  };

  // Safe getter for room type
  const getRoomType = (booking) => {
    if (booking.accommodation?.roomType) return booking.accommodation.roomType;
    return "Standard Room";
  };

  // Filtered bookings based on search and filters
  const filteredBookings = displayBookings.filter((booking) => {
    const safeName = getGuestName(booking).toLowerCase();
    const safeEmail = getGuestEmail(booking).toLowerCase();
    const safeAccommodation = getAccommodationName(booking).toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    const matchesSearch =
      safeName.includes(searchLower) ||
      safeEmail.includes(searchLower) ||
      safeAccommodation.includes(searchLower);

    const safeStatus = booking.status || "pending";
    const matchesStatus =
      statusFilter === "all" || safeStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Stats calculations
  const totalBookings = displayBookings.length;
  const totalRevenue = displayBookings.reduce(
    (sum, booking) => sum + (booking.total_amount || booking.totalAmount || 0),
    0,
  );
  const occupancyRate = 85; // Mock value
  const pendingBookings = displayBookings.filter(
    (booking) => (booking.status || "pending") === "pending",
  ).length;

  const getStatusColor = (status) => {
    const safeStatus = status || "pending";
    switch (safeStatus) {
      case "confirmed":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "active":
        return "#3b82f6";
      case "cancelled":
        return "#ef4444";
      case "completed":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  const getPaymentStatusColor = (status) => {
    const safeStatus = status || "pending";
    switch (safeStatus) {
      case "paid":
        return "#10b981";
      case "pending":
        return "#f59e0b";
      case "refunded":
        return "#ef4444";
      case "failed":
        return "#dc2626";
      default:
        return "#6b7280";
    }
  };

  // Handle add booking
  const handleAddBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // In real app, this would call the API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Booking added successfully! (Demo)");
    setShowAddModal(false);
    setIsSubmitting(false);
  };

  // Handle view booking details
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowViewModal(true);
  };

  // Handle edit booking status
  const handleEditBooking = async (booking, newStatus) => {
    try {
      await adminApi.updateBookingStatus(booking.id, newStatus);
      alert(`Booking #${booking.id} status updated to ${newStatus}!`);
      
      // Refresh list
      const data = await adminApi.getBookings();
      setBookings(data);
    } catch (error) {
      console.error("Failed to update booking status:", error);
      alert("Failed to update booking status. Please try again.");
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async (booking) => {
    if (
      window.confirm(`Are you sure you want to cancel booking #${booking.id}?`)
    ) {
      try {
        await adminApi.updateBookingStatus(booking.id, "cancelled");
        alert("Booking cancelled successfully!");
        
        // Refresh list
        const data = await adminApi.getBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to cancel booking:", error);
        alert("Failed to cancel booking. Please try again.");
      }
    }
  };

  // Handle download receipt
  const handleDownloadReceipt = async (booking) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(`Downloading receipt for booking #${booking.id} (Demo)`);
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Bookings Management</h1>
          <p style={styles.subtitle}>
            Manage and track all accommodation bookings
          </p>
        </div>
        <button style={styles.addButton} onClick={() => setShowAddModal(true)}>
          <Plus size={16} />
          Add New Booking
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Calendar size={24} color="#0369a1" />
          </div>
          <div>
            <p style={styles.statValue}>{totalBookings}</p>
            <p style={styles.statLabel}>Total Bookings</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <DollarSign size={24} color="#059669" />
          </div>
          <div>
            <p style={styles.statValue}>${totalRevenue.toLocaleString()}</p>
            <p style={styles.statLabel}>Total Revenue</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Home size={24} color="#7c3aed" />
          </div>
          <div>
            <p style={styles.statValue}>{occupancyRate}%</p>
            <p style={styles.statLabel}>Occupancy Rate</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <Clock size={24} color="#d97706" />
          </div>
          <div>
            <p style={styles.statValue}>{pendingBookings}</p>
            <p style={styles.statLabel}>Pending Bookings</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.searchContainer}>
          <Search size={16} color="#6b7280" />
          <input
            type="text"
            placeholder="Search bookings..."
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
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          style={styles.filterSelect}
        >
          <option value="all">All Dates</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Guest</th>
              <th style={styles.tableHeader}>Accommodation</th>
              <th style={styles.tableHeader}>Check-in / Check-out</th>
              <th style={styles.tableHeader}>Nights</th>
              <th style={styles.tableHeader}>Amount</th>
              <th style={styles.tableHeader}>Status</th>
              <th style={styles.tableHeader}>Payment</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking) => (
              <tr key={booking.id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <div style={styles.guestInfo}>
                    <div style={styles.avatar}>
                      {getGuestName(booking).charAt(0)}
                    </div>
                    <div>
                      <p style={styles.guestName}>{getGuestName(booking)}</p>
                      <p style={styles.guestEmail}>{getGuestEmail(booking)}</p>
                    </div>
                  </div>
                </td>
                <td style={styles.tableCell}>
                  <div>
                    <p style={styles.accommodationName}>
                      {getAccommodationName(booking)}
                    </p>
                    <p style={styles.roomType}>
                      {getRoomType(booking)}
                    </p>
                  </div>
                </td>
                <td style={styles.tableCell}>
                  <div>
                    <p style={styles.dateText}>{booking.start_date || booking.checkIn}</p>
                    <p style={styles.dateText}>{booking.end_date || booking.checkOut}</p>
                  </div>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.nightsBadge}>{booking.nights || "-"}</span>
                </td>
                <td style={styles.tableCell}>
                  <span style={styles.amountText}>${booking.total_amount || booking.totalAmount || 0}</span>
                </td>
                <td style={styles.tableCell}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(booking.status),
                    }}
                  >
                    {(booking.status || "pending").charAt(0).toUpperCase() + (booking.status || "pending").slice(1)}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getPaymentStatusColor(
                        booking.payment_status || booking.paymentStatus,
                      ),
                    }}
                  >
                    {(booking.payment_status || booking.paymentStatus || "pending").charAt(0).toUpperCase() + (booking.payment_status || booking.paymentStatus || "pending").slice(1)}
                  </span>
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.actionButton}
                      onClick={() => handleViewBooking(booking)}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      style={styles.actionButton}
                      onClick={() => handleEditBooking(booking)}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      style={styles.actionButton}
                      onClick={() => handleCancelBooking(booking)}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals would go here - simplified for brevity */}
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1f2937",
    margin: 0,
  },
  subtitle: {
    color: "#6b7280",
    margin: "4px 0 0 0",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#0369a1",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
  guestInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#0369a1",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  guestName: {
    fontWeight: "500",
    color: "#1f2937",
    margin: 0,
  },
  guestEmail: {
    color: "#6b7280",
    margin: "2px 0 0 0",
    fontSize: "14px",
  },
  accommodationName: {
    fontWeight: "500",
    color: "#1f2937",
    margin: 0,
  },
  roomType: {
    color: "#6b7280",
    margin: "2px 0 0 0",
    fontSize: "14px",
  },
  dateText: {
    margin: "2px 0",
    fontSize: "14px",
    color: "#374151",
  },
  nightsBadge: {
    backgroundColor: "#e5e7eb",
    color: "#374151",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  amountText: {
    fontWeight: "600",
    color: "#059669",
  },
  statusBadge: {
    padding: "4px 8px",
    borderRadius: "12px",
    color: "white",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
  actionButton: {
    padding: "8px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Bookings;
