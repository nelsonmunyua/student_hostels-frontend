import React, { useState, useEffect } from "react";
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
import { toast } from "../../../../main";
import adminApi from "../../../../api/adminApi";

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
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: "",
    type: "Hostel",
    price: "",
    location: "",
    rooms: "",
    capacity: "",
    status: "active"
  });

  // New accommodation form state
  const [newAccommodation, setNewAccommodation] = useState({
    name: "",
    type: "Hostel",
    price: "",
    location: "",
    rooms: "",
    capacity: "",
    description: "",
    host_id: ""
  });

  // Check if we should show add modal from navigation state
  useEffect(() => {
    if (location.state?.showAddModal) {
      setShowAddModal(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  // Fetch accommodations from API
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getHostels();
        setAccommodations(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch accommodations:", err);
        setError("Failed to load accommodations. Using demo data.");
        // Keep mock data on error
      } finally {
        setLoading(false);
      }
    };

    fetchAccommodations();
  }, []);

  // Mock data for fallback - using Unsplash images
  const mockAccommodations = [
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
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
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
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
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
      image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800",
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
        "https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=800",
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
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
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
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      host: "Lisa Anderson",
    },
  ];

  // Use mock data if API data is empty or on error
  const displayAccommodations = accommodations.length > 0 ? accommodations : mockAccommodations;

  // Helper to get image URL from accommodation - using Unsplash images
  const getImageUrl = (acc) => {
    // If API data with images array
    if (acc.images && Array.isArray(acc.images) && acc.images.length > 0) {
      return acc.images[0];
    }
    // If API data with single image field
    if (acc.image) {
      return acc.image;
    }
    // Fallback to Unsplash images based on ID
    const imageMap = {
      1: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
      2: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      3: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800',
      4: 'https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=800',
      5: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800',
      6: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
    };
    return imageMap[acc.id] || 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800';
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

    // Handle undefined status - default to active
    const safeStatus = status || "active";
    const style = statusStyles[safeStatus] || statusStyles.active;

    return (
      <span
        style={{
          ...styles.statusBadge,
          backgroundColor: style.backgroundColor,
          color: style.color,
        }}
      >
        {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
      </span>
    );
  };

  const filteredAccommodations = displayAccommodations.filter((acc) => {
    const matchesSearch =
      acc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || getStatus(acc) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle add accommodation
  const handleAddAccommodation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!newAccommodation.name || !newAccommodation.location) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const hostelData = {
        name: newAccommodation.name,
        location: newAccommodation.location,
        description: newAccommodation.description,
        amenities: {
          type: newAccommodation.type,
          rooms: parseInt(newAccommodation.rooms) || 0,
          capacity: parseInt(newAccommodation.capacity) || 0,
          price: parseInt(newAccommodation.price) || 0
        },
        host_id: parseInt(newAccommodation.host_id) || 1
      };

      await adminApi.createHostel(hostelData);
      toast.success("Accommodation added successfully!");
      
      // Refresh list
      const data = await adminApi.getHostels();
      setAccommodations(data);
      
      setShowAddModal(false);
      setNewAccommodation({
        name: "",
        type: "Hostel",
        price: "",
        location: "",
        rooms: "",
        capacity: "",
        description: "",
        host_id: ""
      });
    } catch (error) {
      console.error("Failed to add accommodation:", error);
      toast.error(error.response?.data?.message || "Failed to add accommodation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit accommodation status
  const handleEditAccommodation = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await adminApi.toggleHostelStatus(editingId);
      toast.success("Accommodation updated successfully!");
      
      // Refresh list
      const data = await adminApi.getHostels();
      setAccommodations(data);
      
      setShowEditModal(false);
      setSelectedAccommodation(null);
      setEditingId(null);
    } catch (error) {
      console.error("Failed to update accommodation:", error);
      toast.error("Failed to update accommodation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete accommodation
  const handleDeleteAccommodation = async (id, name) => {
    if (
      window.confirm(`Are you sure you want to delete "${name}"?`)
    ) {
      try {
        await adminApi.deleteHostel(id);
        toast.success("Accommodation deleted successfully!");
        
        // Refresh list
        const data = await adminApi.getHostels();
        setAccommodations(data);
      } catch (error) {
        console.error("Failed to delete accommodation:", error);
        toast.error("Failed to delete accommodation. Please try again.");
      }
    }
  };

  // Open edit modal
  const openEditModal = (acc) => {
    setSelectedAccommodation(acc);
    setEditingId(acc.id);
    setEditForm({
      name: acc.name || "",
      type: acc.type || "Hostel",
      price: acc.price?.toString() || "",
      location: acc.location || "",
      rooms: acc.rooms?.toString() || "",
      capacity: acc.capacity?.toString() || "",
      status: acc.status || "active"
    });
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
              <img src={getImageUrl(acc)} alt={acc.name} style={styles.cardImg} onError={(e) => { e.target.src = mockAccommodations[0]?.image; }} />
              <span style={styles.typeBadge}>{getType(acc)}</span>
              {getStatusBadge(getStatus(acc))}
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
                  <span>{getCapacity(acc)} students</span>
                </div>
                <div style={styles.cardStat}>
                  <Star size={16} color="#f59e0b" />
                  <span>{getRating(acc)}</span>
                </div>
                <div style={styles.cardStat}>
                  <DollarSign size={16} color="#059669" />
                  <span>Ksh{getPrice(acc)}/mo</span>
                </div>
              </div>
              <div style={styles.cardHost}>
                <span style={styles.hostLabel}>Host:</span>
                <span style={styles.hostName}>{getHostName(acc)}</span>
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
                  value={newAccommodation.name}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, name: e.target.value })}
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type</label>
                  <select
                    style={styles.select}
                    value={newAccommodation.type}
                    onChange={(e) => setNewAccommodation({ ...newAccommodation, type: e.target.value })}
                  >
                    <option value="Hostel">Hostel</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price (Ksh/month)</label>
                  <input
                    type="number"
                    style={styles.input}
                    placeholder="Enter price"
                    value={newAccommodation.price}
                    onChange={(e) => setNewAccommodation({ ...newAccommodation, price: e.target.value })}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  style={styles.input}
                  placeholder="Enter address"
                  value={newAccommodation.location}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, location: e.target.value })}
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Number of Rooms</label>
                  <input
                    type="number"
                    style={styles.input}
                    placeholder="Enter rooms"
                    value={newAccommodation.rooms}
                    onChange={(e) => setNewAccommodation({ ...newAccommodation, rooms: e.target.value })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Capacity</label>
                  <input
                    type="number"
                    style={styles.input}
                    placeholder="Enter capacity"
                    value={newAccommodation.capacity}
                    onChange={(e) => setNewAccommodation({ ...newAccommodation, capacity: e.target.value })}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={{ ...styles.input, minHeight: "100px" }}
                  placeholder="Enter description"
                  value={newAccommodation.description}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, description: e.target.value })}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Host ID</label>
                <input
                  type="number"
                  style={styles.input}
                  placeholder="Enter host user ID"
                  value={newAccommodation.host_id}
                  onChange={(e) => setNewAccommodation({ ...newAccommodation, host_id: e.target.value })}
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
                src={getImageUrl(selectedAccommodation)}
                alt={selectedAccommodation.name}
                style={styles.detailImage}
                onError={(e) => { e.target.src = mockAccommodations[0]?.image; }}
              />
              <h3 style={styles.detailTitle}>{selectedAccommodation.name}</h3>
              <div style={styles.detailLocation}>
                <MapPin size={16} color="#94a3b8" />
                <span>{selectedAccommodation.location}</span>
              </div>
              {getStatusBadge(getStatus(selectedAccommodation))}
              <div style={styles.detailStats}>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatLabel}>Type</span>
                  <span style={styles.detailStatValue}>
                    {getType(selectedAccommodation)}
                  </span>
                </div>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatLabel}>Rooms</span>
                  <span style={styles.detailStatValue}>
                    {getRooms(selectedAccommodation)}
                  </span>
                </div>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatLabel}>Capacity</span>
                  <span style={styles.detailStatValue}>
                    {getCapacity(selectedAccommodation)}
                  </span>
                </div>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatLabel}>Price</span>
                  <span style={styles.detailStatValue}>
                    Ksh{getPrice(selectedAccommodation)}/mo
                  </span>
                </div>
                <div style={styles.detailStat}>
                  <span style={styles.detailStatLabel}>Rating</span>
                  <span style={styles.detailStatValue}>
                    ⭐ {getRating(selectedAccommodation)}
                  </span>
                </div>
              </div>
              <div style={styles.detailHost}>
                <span style={styles.hostLabel}>Hosted by:</span>
                <span style={styles.hostName}>
                  {getHostName(selectedAccommodation)}
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
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type</label>
                  <select
                    style={styles.select}
                    defaultValue={getType(selectedAccommodation)}
                    value={editForm.type}
                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                  >
                    <option value="Hostel">Hostel</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Studio">Studio</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price (Ksh/month)</label>
                  <input
                    type="number"
                    style={styles.input}
                    defaultValue={getPrice(selectedAccommodation)}
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  style={styles.input}
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Number of Rooms</label>
                  <input
                    type="number"
                    style={styles.input}
                    defaultValue={getRooms(selectedAccommodation)}
                    value={editForm.rooms}
                    onChange={(e) => setEditForm({ ...editForm, rooms: e.target.value })}
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Capacity</label>
                  <input
                    type="number"
                    style={styles.input}
                    defaultValue={getCapacity(selectedAccommodation)}
                    value={editForm.capacity}
                    onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                  />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Status</label>
                <select
                  style={styles.select}
                  defaultValue={getStatus(selectedAccommodation)}
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
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
