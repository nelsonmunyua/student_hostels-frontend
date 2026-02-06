import { useState } from "react";

const HostBookings = () => {
  const [bookings] = useState([
    {
      id: "BK001",
      guest: "John Smith",
      property: "University View Hostel",
      checkIn: "2024-02-15",
      checkOut: "2024-02-28",
      status: "confirmed",
      amount: 1170,
    },
    {
      id: "BK002",
      guest: "Emily Johnson",
      property: "Central Student Living",
      checkIn: "2024-02-20",
      checkOut: "2024-03-05",
      status: "pending",
      amount: 570,
    },
    {
      id: "BK003",
      guest: "Michael Brown",
      property: "University View Hostel",
      checkIn: "2024-02-10",
      checkOut: "2024-02-12",
      status: "completed",
      amount: 450,
    },
    {
      id: "BK004",
      guest: "Sarah Davis",
      property: "Campus Edge Apartments",
      checkIn: "2024-03-01",
      checkOut: "2024-03-15",
      status: "pending",
      amount: 780,
    },
  ]);

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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Bookings Management</h1>
          <p style={styles.subtitle}>Manage your property bookings</p>
        </div>
        <div style={styles.headerActions}>
          <select style={styles.filterSelect}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{bookings.length}</span>
          <span style={styles.statLabel}>Total Bookings</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>3</span>
          <span style={styles.statLabel}>Pending</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>2</span>
          <span style={styles.statLabel}>This Week</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>$2,970</span>
          <span style={styles.statLabel}>Revenue</span>
        </div>
      </div>

      {/* Bookings Table */}
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
            {bookings.map((booking) => {
              const statusColor = getStatusColor(booking.status);
              return (
                <tr key={booking.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <span style={styles.bookingId}>{booking.id}</span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.guestCell}>
                      <span style={styles.guestAvatar}>
                        {booking.guest.charAt(0)}
                      </span>
                      <span style={styles.guestName}>{booking.guest}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{booking.property}</td>
                  <td style={styles.td}>{booking.checkIn}</td>
                  <td style={styles.td}>{booking.checkOut}</td>
                  <td style={styles.td}>
                    <span style={styles.amount}>${booking.amount}</span>
                  </td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.statusBadge,
                        backgroundColor: statusColor.bg,
                        color: statusColor.color,
                      }}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.actions}>
                      <button style={styles.viewBtn}>View</button>
                      {booking.status === "pending" && (
                        <>
                          <button style={styles.acceptBtn}>Accept</button>
                          <button style={styles.rejectBtn}>Reject</button>
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
          {bookings
            .filter((b) => b.status === "confirmed" || b.status === "pending")
            .map((booking) => (
              <div key={booking.id} style={styles.arrivalCard}>
                <div style={styles.arrivalHeader}>
                  <span style={styles.arrivalId}>{booking.id}</span>
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
                    {booking.guest.charAt(0)}
                  </span>
                  <span style={styles.arrivalName}>{booking.guest}</span>
                </div>
                <div style={styles.arrivalProperty}>📍 {booking.property}</div>
                <div style={styles.arrivalDates}>
                  📅 {booking.checkIn} → {booking.checkOut}
                </div>
                <div style={styles.arrivalFooter}>
                  <span style={styles.arrivalAmount}>${booking.amount}</span>
                  <button style={styles.arrivalBtn}>Details</button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
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
    textAlign: "center",
  },
  statValue: {
    display: "block",
    fontSize: "28px",
    fontWeight: "700",
    color: "#0369a1",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
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
};

export default HostBookings;
