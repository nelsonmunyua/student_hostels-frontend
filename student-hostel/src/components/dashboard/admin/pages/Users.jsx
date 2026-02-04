import React, { useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  UserPlus,
  Mail,
  Shield,
  User,
  X,
} from "lucide-react";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Mock data for users
  const users = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      role: "student",
      status: "active",
      joinedDate: "2024-01-15",
      bookings: 2,
      avatar: null,
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@email.com",
      phone: "+1 (555) 234-5678",
      role: "host",
      status: "active",
      joinedDate: "2023-11-20",
      listings: 3,
      avatar: null,
    },
    {
      id: 3,
      firstName: "Mike",
      lastName: "Brown",
      email: "mike.brown@email.com",
      phone: "+1 (555) 345-6789",
      role: "student",
      status: "active",
      joinedDate: "2024-02-10",
      bookings: 1,
      avatar: null,
    },
    {
      id: 4,
      firstName: "Emily",
      lastName: "Davis",
      email: "emily.d@email.com",
      phone: "+1 (555) 456-7890",
      role: "host",
      status: "pending",
      joinedDate: "2024-02-28",
      listings: 1,
      avatar: null,
    },
    {
      id: 5,
      firstName: "David",
      lastName: "Wilson",
      email: "d.wilson@email.com",
      phone: "+1 (555) 567-8901",
      role: "student",
      status: "inactive",
      joinedDate: "2023-08-05",
      bookings: 4,
      avatar: null,
    },
    {
      id: 6,
      firstName: "Lisa",
      lastName: "Anderson",
      email: "lisa.a@email.com",
      phone: "+1 (555) 678-9012",
      role: "host",
      status: "active",
      joinedDate: "2023-06-15",
      listings: 5,
      avatar: null,
    },
    {
      id: 7,
      firstName: "James",
      lastName: "Taylor",
      email: "james.t@email.com",
      phone: "+1 (555) 789-0123",
      role: "student",
      status: "active",
      joinedDate: "2024-01-08",
      bookings: 1,
      avatar: null,
    },
    {
      id: 8,
      firstName: "Amanda",
      lastName: "Martinez",
      email: "amanda.m@email.com",
      phone: "+1 (555) 890-1234",
      role: "admin",
      status: "active",
      joinedDate: "2023-01-01",
      bookings: 0,
      avatar: null,
    },
  ];

  const getRoleBadge = (role) => {
    const roleStyles = {
      student: {
        backgroundColor: "#f0f9ff",
        color: "#0369a1",
        icon: User,
      },
      host: {
        backgroundColor: "#f0fdf4",
        color: "#16a34a",
        icon: Shield,
      },
      admin: {
        backgroundColor: "#fef3c7",
        color: "#d97706",
        icon: Shield,
      },
    };

    const style = roleStyles[role] || roleStyles.student;

    return (
      <span
        style={{
          ...styles.roleBadge,
          backgroundColor: style.backgroundColor,
          color: style.color,
        }}
      >
        <style.icon size={12} />
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      active: {
        backgroundColor: "#ecfdf5",
        color: "#059669",
      },
      pending: {
        backgroundColor: "#fffbeb",
        color: "#d97706",
      },
      inactive: {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
      },
    };

    return (
      <span
        style={{
          ...styles.statusBadge,
          ...statusStyles[status],
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getInitials = (firstName, lastName) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Users</h1>
          <p style={styles.subtitle}>
            Manage all users including students, hosts, and administrators
          </p>
        </div>
        <button style={styles.addBtn} onClick={() => setShowAddModal(true)}>
          <UserPlus size={18} />
          Add User
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search users..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.filterButtons}>
          <button
            style={{
              ...styles.filterBtn,
              backgroundColor: roleFilter === "all" ? "#0369a1" : "#f1f5f9",
              color: roleFilter === "all" ? "#ffffff" : "#64748b",
            }}
            onClick={() => setRoleFilter("all")}
          >
            All
          </button>
          <button
            style={{
              ...styles.filterBtn,
              backgroundColor: roleFilter === "student" ? "#0369a1" : "#f1f5f9",
              color: roleFilter === "student" ? "#ffffff" : "#64748b",
            }}
            onClick={() => setRoleFilter("student")}
          >
            Students
          </button>
          <button
            style={{
              ...styles.filterBtn,
              backgroundColor: roleFilter === "host" ? "#0369a1" : "#f1f5f9",
              color: roleFilter === "host" ? "#ffffff" : "#64748b",
            }}
            onClick={() => setRoleFilter("host")}
          >
            Hosts
          </button>
          <button
            style={{
              ...styles.filterBtn,
              backgroundColor: roleFilter === "admin" ? "#0369a1" : "#f1f5f9",
              color: roleFilter === "admin" ? "#ffffff" : "#64748b",
            }}
            onClick={() => setRoleFilter("admin")}
          >
            Admins
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Contact</th>
              <th style={styles.th}>
                {roleFilter === "host" || roleFilter === "all"
                  ? "Listings"
                  : "Bookings"}
              </th>
              <th style={styles.th}>Joined</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} style={styles.tr}>
                <td style={styles.td}>
                  <div style={styles.userCell}>
                    <div style={styles.avatar}>
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.firstName} ${user.lastName}`}
                          style={styles.avatarImg}
                        />
                      ) : (
                        <span style={styles.avatarText}>
                          {getInitials(user.firstName, user.lastName)}
                        </span>
                      )}
                    </div>
                    <div style={styles.userInfo}>
                      <span style={styles.userName}>
                        {user.firstName} {user.lastName}
                      </span>
                      <span style={styles.userEmail}>{user.email}</span>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>{getRoleBadge(user.role)}</td>
                <td style={styles.td}>{getStatusBadge(user.status)}</td>
                <td style={styles.td}>
                  <div style={styles.contactInfo}>
                    <span style={styles.phone}>{user.phone}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.statValue}>
                    {user.role === "host"
                      ? user.listings || 0
                      : user.bookings || 0}
                  </span>
                </td>
                <td style={styles.td}>
                  <span style={styles.date}>
                    {new Date(user.joinedDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionButtons}>
                    <button
                      style={styles.actionBtn}
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye size={16} color="#64748b" />
                    </button>
                    <button style={styles.actionBtn}>
                      <Edit size={16} color="#0369a1" />
                    </button>
                    <button style={styles.actionBtn}>
                      <Trash2 size={16} color="#dc2626" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stats Summary */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>#0369a1</div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>245</span>
            <span style={styles.statLabel}>Total Students</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>#16a34a</div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>89</span>
            <span style={styles.statLabel}>Total Hosts</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>#d97706</div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>12</span>
            <span style={styles.statLabel}>Admins</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>#059669</div>
          <div style={styles.statInfo}>
            <span style={styles.statValue}>312</span>
            <span style={styles.statLabel}>Active Users</span>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New User</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>First Name</label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="Enter first name"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Last Name</label>
                  <input
                    type="text"
                    style={styles.input}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <div style={styles.inputWrapper}>
                  <Mail size={18} color="#94a3b8" />
                  <input
                    type="email"
                    style={styles.inputWithIcon}
                    placeholder="Enter email"
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  style={styles.input}
                  placeholder="Enter phone number"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Role</label>
                <select style={styles.select}>
                  <option value="student">Student</option>
                  <option value="host">Host</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button style={styles.submitBtn}>Add User</button>
            </div>
          </div>
        </div>
      )}

      {/* View User Modal */}
      {selectedUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>User Details</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setSelectedUser(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.userProfile}>
                <div style={styles.profileAvatar}>
                  <span style={styles.profileAvatarText}>
                    {getInitials(selectedUser.firstName, selectedUser.lastName)}
                  </span>
                </div>
                <div style={styles.profileInfo}>
                  <h3 style={styles.profileName}>
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  {getRoleBadge(selectedUser.role)}
                </div>
              </div>

              <div style={styles.detailGrid}>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Email</span>
                  <span style={styles.detailValue}>{selectedUser.email}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Phone</span>
                  <span style={styles.detailValue}>{selectedUser.phone}</span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Status</span>
                  {getStatusBadge(selectedUser.status)}
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>Joined</span>
                  <span style={styles.detailValue}>
                    {new Date(selectedUser.joinedDate).toLocaleDateString(
                      "en-US",
                      {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      },
                    )}
                  </span>
                </div>
                <div style={styles.detailItem}>
                  <span style={styles.detailLabel}>
                    {selectedUser.role === "host" ? "Listings" : "Bookings"}
                  </span>
                  <span style={styles.detailValue}>
                    {selectedUser.role === "host"
                      ? selectedUser.listings || 0
                      : selectedUser.bookings || 0}
                  </span>
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
              <button style={styles.editBtn}>Edit User</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100%",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#0369a1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    gap: "16px",
    flexWrap: "wrap",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    flex: 1,
    maxWidth: "400px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#334155",
    backgroundColor: "transparent",
  },
  filterButtons: {
    display: "flex",
    gap: "8px",
  },
  filterBtn: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tableCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    marginBottom: "24px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  th: {
    padding: "14px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tr: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background-color 0.2s",
  },
  td: {
    padding: "16px",
  },
  userCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarText: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#0369a1",
  },
  userInfo: {
    display: "flex",
    flexDirection: "column",
  },
  userName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1e293b",
  },
  userEmail: {
    fontSize: "13px",
    color: "#64748b",
  },
  roleBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 500,
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 500,
  },
  contactInfo: {
    display: "flex",
    flexDirection: "column",
  },
  phone: {
    fontSize: "13px",
    color: "#64748b",
  },
  statValue: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1e293b",
  },
  date: {
    fontSize: "13px",
    color: "#64748b",
  },
  actionButtons: {
    display: "flex",
    gap: "8px",
  },
  actionBtn: {
    padding: "6px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  statIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 700,
    backgroundColor: "#f0f9ff",
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontSize: "13px",
    color: "#64748b",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e2e8f0",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
  },
  closeBtn: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    color: "#64748b",
  },
  modalContent: {
    padding: "20px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#334155",
    outline: "none",
    boxSizing: "border-box",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
  },
  inputWithIcon: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#334155",
    backgroundColor: "transparent",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#334155",
    outline: "none",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  submitBtn: {
    padding: "10px 20px",
    backgroundColor: "#0369a1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  editBtn: {
    padding: "10px 20px",
    backgroundColor: "#0369a1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  profileAvatar: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    backgroundColor: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarText: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#0369a1",
  },
  profileInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  profileName: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    fontSize: "12px",
    color: "#64748b",
  },
  detailValue: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#1e293b",
  },
};

export default Users;
