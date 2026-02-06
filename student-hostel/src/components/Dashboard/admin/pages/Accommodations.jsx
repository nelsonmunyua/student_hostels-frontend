import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Users,
  DollarSign,
  Star,
  X,
} from "lucide-react";
import axios from "../../../../api/axios";

const Accommodations = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Check if we should show add modal from navigation state
  React.useEffect(() => {
    if (location.state?.showAddModal) {
      setShowAddModal(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Mock data for accommodations
  const accommodations = [
    {
      id: 1,
      name: "University View Hostel",
      location: "123 Campus Drive",
      type: "Hostel",
      rooms: 45,
      capacity: 180,
      price: 450,
      rating: 4.8,
      status: "active",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400",
      host: "John Smith",
    },
    {
      id: 2,
      name: "Central Student Living",
      location: "456 Main Street",
      type: "Apartment",
      rooms: 38,
      capacity: 152,
      price: 520,
      rating: 4.6,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
      host: "Sarah Johnson",
    },
    {
      id: 3,
      name: "Campus Edge Apartments",
      location: "789 University Ave",
      type: "Apartment",
      rooms: 52,
      capacity: 208,
      price: 380,
      rating: 4.5,
      status: "active",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
      host: "Mike Brown",
    },
    {
      id: 4,
      name: "Student Haven",
      location: "321 College Road",
      type: "Hostel",
      rooms: 30,
      capacity: 120,
      price: 350,
      rating: 4.7,
      status: "pending",
      image:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400",
      host: "Emily Davis",
    },
    {
      id: 5,
      name: "The Scholar's Residence",
      location: "555 Academic Way",
      type: "Hostel",
      rooms: 25,
      capacity: 100,
      price: 600,
      rating: 4.9,
      status: "active",
      image:
        "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=400",
      host: "David Wilson",
    },
    {
      id: 6,
      name: "Dormitory Plus",
      location: "888 Student Lane",
      type: "Hostel",
      rooms: 60,
      capacity: 240,
      price: 320,
      rating: 4.3,
      status: "inactive",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400",
      host: "Lisa Anderson",
    },
  ];

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

  const filteredAccommodations = accommodations.filter((acc) => {
    const matchesSearch =
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || acc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle add accommodation
  const handleAddAccommodation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Accommodation added successfully! (Demo)");
    setShowAddModal(false);
    setIsSubmitting(false);
  };

  // Handle edit accommodation
  const handleEditAccommodation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert(`Accommodation updated successfully! (Demo)`);
    setShowEditModal(false);
    setSelectedAccommodation(null);
    setIsSubmitting(false);
  };

  // Handle delete accommodation
  const handleDeleteAccommodation = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert("Accommodation deleted successfully! (Demo)");
    }
  };

  // Open edit modal
  const openEditModal = (acc) => {
    setSelectedAccommodation(acc);
    setEditingId(acc.id);
    setShowEditModal(true);
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Accommodations</h1>
          <p style={styles.subtitle}>
            Manage all student accommodations and hostels
          </p>
        </div>
        <button style={styles.addBtn} onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          Add Accommodation
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search accommodations..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.filterButtons}>
          <button
            style={{
              ...styles.filterBtn,
              backgroundColor: statusFilter === "all" ? "#0369a1" : "#f1f5f9",
              color: statusFilter === "all" ? "#ffffff" : "#64748b",
            }}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>
          <button
            style={{
              ...styles.filterBtn,
              backgroundColor:
                statusFilter === "active" ? "#0369a1" : "#f1f5f9",
              color: statusFilter === "active" ? "#ffffff" : "#64748b",
            }}
            onClick={() => setStatusFilter("active")}
          >
            Active
          </button>
          <button
            style={{
              ...styles.filterBtn,
              backgroundColor:
                statusFilter === "pending" ? "#0369a1" : "#f1f5f9",
              color: statusFilter === "pending" ? "#ffffff" : "#64748b",
            }}
            onClick={() => setStatusFilter("pending")}
          >
            Pending
          </button>
          <button
            style={{
              ...styles.filterBtn,
              backgroundColor:
                statusFilter === "inactive" ? "#0369a1" : "#f1f5f9",
              color: statusFilter === "inactive" ? "#ffffff" : "#64748b",
            }}
            onClick={() => setStatusFilter("inactive")}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Accommodations Grid */}
      <div style={styles.grid}>
        {filteredAccommodations.map((acc) => (
          <div key={acc.id} style={styles.card}>
            <div style={styles.cardImage}>
              <img src={acc.image} alt={acc.name} style={styles.cardImg} />
              <span style={styles.typeBadge}>{acc.type}</span>
              {getStatusBadge(acc.status)}
            </div>
            <div style={styles.cardContent}>
              <h3 style={styles.cardTitle}>{acc.name}</h3>
              <div style={styles.cardLocation}>
                <MapPin size={14} color="#94a3b8" />
                <span>{acc.location}</span>
              </div>
              <div style={styles.cardStats}>
                <div style={styles.cardStat}>
                  <Users size={16} color="#64748b" />
                  <span>{acc.capacity} students</span>
                </div>
                <div style={styles.cardStat}>
                  <Star size={16} color="#f59e0b" />
                  <span>{acc.rating}</span>
                </div>
                <div style={styles.cardStat}>
                  <DollarSign size={16} color="#059669" />
                  <span>${acc.price}/mo</span>
                </div>
              </div>
              <div style={styles.cardHost}>
                <span style={styles.hostLabel}>Host:</span>
                <span style={styles.hostName}>{acc.host}</span>
              </div>
              <div style={styles.cardActions}>
                <button
                  style={styles.actionBtn}
                  onClick={() => setSelectedAccommodation(acc)}
                >
                  <Eye size={16} color="#64748b" />
                </button>
                <button
                  style={styles.actionBtn}
                  onClick={() => openEditModal(acc)}
                >
                  <Edit size={16} color="#0369a1" />
                </button>
                <button
                  style={styles.actionBtn}
                  onClick={() => handleDeleteAccommodation(acc.id, acc.name)}
                >
                  <Trash2 size={16} color="#dc2626" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Accommodation</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Accommodation Name</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Enter name"
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type</label>
                  <select style={styles.select}>
                    <option>Hostel</option>
                    <option>Apartment</option>
                    <option>Studio</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price ($/month)</label>
                  <input
                    type="number"
                    style={styles.input}
                    placeholder="Enter price"
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Enter address"
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Number of Rooms</label>
                  <input
                    type="number"
                    style={styles.input}
                    placeholder="Enter rooms"
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Capacity</label>
                  <input
                    type="number"
                    style={styles.input}
                    placeholder="Enter capacity"
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={{ ...styles.input, minHeight: "100px" }}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                style={styles.submitBtn}
                onClick={handleAddAccommodation}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Accommodation"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedAccommodation && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Accommodation Details</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setSelectedAccommodation(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalContent}>
              <img
                src={selectedAccommodation.image}
                alt={selectedAccommodation.name}
                style={styles.detailImage}
              />
              <h3 style={styles.detailTitle}>{selectedAccommodation.name}</h3>
              <div style={styles.detailLocation}>
                <MapPin size={16} color="#94a3b8" />
                <span>{selectedAccommodation.location}</span>
              </div>
              {getStatusBadge(selectedAccommodation.status)}
              <div style={styles.detailStats}>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatLabel}>Type</span>
                  <span style={styles.detailStatValue}>
                    {selectedAccommodation.type}
                  </span>
                </div>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatLabel}>Rooms</span>
                  <span style={styles.detailStatValue}>
                    {selectedAccommodation.rooms}
                  </span>
                </div>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatLabel}>Capacity</span>
                  <span style={styles.detailStatValue}>
                    {selectedAccommodation.capacity}
                  </span>
                </div>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatLabel}>Price</span>
                  <span style={styles.detailStatValue}>
                    ${selectedAccommodation.price}/mo
                  </span>
                </div>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatLabel}>Rating</span>
                  <span style={styles.detailStatValue}>
                    ⭐ {selectedAccommodation.rating}
                  </span>
                </div>
              </div>
              <div style={styles.detailHost}>
                <span style={styles.hostLabel}>Hosted by:</span>
                <span style={styles.hostName}>
                  {selectedAccommodation.host}
                </span>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setSelectedAccommodation(null)}
              >
                Close
              </button>
              <button
                style={styles.submitBtn}
                onClick={() => openEditModal(selectedAccommodation)}
              >
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* edit_file Modal */}
      {showEditModal && selectedAccommodation && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Accommodation</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setShowEditModal(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Accommodation Name</label>
                <input
                  type="text"
                  style={styles.input}
                  defaultValue={selectedAccommodation.name}
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type</label>
                  <select
                    style={styles.select}
                    defaultValue={selectedAccommodation.type}
                  >
                    <option value="Hostel">Hostel</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price ($/month)</label>
                  <input
                    type="number"
                    style={styles.input}
                    defaultValue={selectedAccommodation.price}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  style={styles.input}
                  defaultValue={selectedAccommodation.location}
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Number of Rooms</label>
                  <input
                    type="number"
                    style={styles.input}
                    defaultValue={selectedAccommodation.rooms}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Capacity</label>
                  <input
                    type="number"
                    style={styles.input}
                    defaultValue={selectedAccommodation.capacity}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  style={styles.select}
                  defaultValue={selectedAccommodation.status}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                style={styles.submitBtn}
                onClick={handleEditAccommodation}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardImage: {
    position: "relative",
    height: "180px",
  },
  cardImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  typeBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "4px 10px",
    backgroundColor: "#0369a1",
    color: "#ffffff",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
  },
  statusBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
  },
  cardContent: {
    padding: "16px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  cardLocation: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "12px",
  },
  cardStats: {
    display: "flex",
    gap: "16px",
    marginBottom: "12px",
  },
  cardStat: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#64748b",
  },
  cardHost: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
    fontSize: "13px",
  },
  hostLabel: {
    color: "#64748b",
  },
  hostName: {
    fontWeight: 600,
    color: "#1e293b",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    paddingTop: "12px",
    borderTop: "1px solid #f1f5f9",
  },
  actionBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "8px 12px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.2s",
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
    maxWidth: "500px",
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
  detailImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "16px",
  },
  detailTitle: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 12px 0",
  },
  detailLocation: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "16px",
  },
  detailStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginBottom: "16px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  detailStat: {
    textAlign: "center",
  },
  detailStatLabel: {
    display: "block",
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "4px",
  },
  detailStatValue: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
  },
  detailHost: {
    display: "flex",
    gap: "8px",
    fontSize: "14px",
  },
};

export default Accommodations;
