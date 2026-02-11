import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Star } from "lucide-react";
import hostApi from "../../../../api/hostApi";

const HostListings = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    price: '',
    room_type: 'single',
    capacity: 1,
    available_units: 1
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    location: '',
    description: '',
    price: '',
    room_type: 'single',
    capacity: 1,
    available_units: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingSubmitting, setEditingSubmitting] = useState(false);
  const [filter, setFilter] = useState("all");
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(null);

  // Helper function to safely capitalize status
  const capitalizeStatus = (status) => {
    if (!status) return 'Unknown';
    if (typeof status === 'boolean') {
      return status ? 'Active' : 'Inactive';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Helper function to check if status is active
  const isStatusActive = (status) => {
    if (typeof status === 'boolean') {
      return status;
    }
    return status === 'active';
  };

  // Helper function to get price with fallback
  const getPrice = (listing) => {
    return listing.price || listing.total_rooms * 100 || 0;
  };

  // Helper function to get bookings count with fallback
  const getBookings = (listing) => {
    return listing.bookings || listing.total_reviews || 0;
  };

  // Helper function to get rating with fallback
  const getRating = (listing) => {
    return listing.rating !== undefined ? listing.rating : (listing.avg_rating || 0);
  };

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const data = await hostApi.getListings();
        setListings(data.hostels || []);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
        
        const errorMessage = error.response?.data?.message || error.message || "";
        const isAuthError = 
          error.response?.status === 401 || 
          errorMessage.toLowerCase().includes("unauthorized") ||
          errorMessage.toLowerCase().includes("authentication") ||
          errorMessage.toLowerCase().includes("jwt") ||
          errorMessage.toLowerCase().includes("token");
        
        if (isAuthError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          window.location.href = "/login?session_expired=true";
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const handleEdit = (listing) => {
    setSelectedListing(listing);
    setEditFormData({
      name: listing.name || '',
      location: listing.location || '',
      description: listing.description || '',
      price: listing.price ? listing.price.toString() : '',
      room_type: listing.rooms && listing.rooms.length > 0 ? listing.rooms[0].room_type : 'single',
      capacity: listing.rooms && listing.rooms.length > 0 ? listing.rooms[0].capacity : 1,
      available_units: listing.rooms && listing.rooms.length > 0 ? listing.rooms[0].available_units : 1
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (listing) => {
    setSelectedListing(listing);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (selectedListing && window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await hostApi.deleteListing(selectedListing.id);
        setListings(listings.filter(l => l.id !== selectedListing.id));
        setShowDeleteModal(false);
        setSelectedListing(null);
      } catch (error) {
        console.error("Failed to delete listing:", error);
        alert("Failed to delete listing. Please try again.");
      }
    }
  };

  const filteredListings =
    filter === "all"
      ? listings
      : filter === "active"
        ? listings.filter((l) => l.is_active)
        : listings.filter((l) => !l.is_active);

  const formatPropertyType = (type) => {
    const types = {
      single: "Single Room",
      double: "Double Room",
      bed_sitter: "Bed Sitter",
      studio: "Studio",
      apartment: "Apartment",
      hostel: "Hostel",
    };
    return types[type] || type;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const listingData = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        latitude: 0,
        longitude: 0,
        amenities: [],
        rules: '',
        images: [],
        is_verified: false,
        is_active: true
      };

      const roomData = {
        room_type: formData.room_type,
        price: parseFloat(formData.price),
        capacity: parseInt(formData.capacity),
        available_units: parseInt(formData.available_units),
        is_available: true
      };

      const listingResponse = await hostApi.createListing(listingData);
      const listingId = listingResponse.hostel.id;

      await hostApi.addRoom(listingId, roomData);

      const data = await hostApi.getListings();
      setListings(data.hostels || []);

      resetAddForm();
      setShowAddModal(false);
      alert('Listing created successfully!');
    } catch (error) {
      console.error('Failed to create listing:', error);
      alert('Failed to create listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle edit form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditingSubmitting(true);

    try {
      const listingData = {
        name: editFormData.name,
        location: editFormData.location,
        description: editFormData.description
      };

      await hostApi.updateListing(selectedListing.id, listingData);

      const data = await hostApi.getListings();
      setListings(data.hostels || []);

      setShowEditModal(false);
      setSelectedListing(null);
      alert('Listing updated successfully!');
    } catch (error) {
      console.error('Failed to update listing:', error);
      alert('Failed to update listing. Please try again.');
    } finally {
      setEditingSubmitting(false);
    }
  };

  // Reset add form
  const resetAddForm = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      price: '',
      room_type: 'single',
      capacity: 1,
      available_units: 1
    });
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Listings</h1>
          <p style={styles.subtitle}>Manage your property listings</p>
        </div>
        <button
          style={styles.addButton}
          onClick={() => navigate("/host/create-listing")}
        >
          <Plus size={20} />
          Add New Listing
        </button>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <span style={styles.statValue}>{listings.length}</span>
          <span style={styles.statLabel}>Total Listings</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>
            {listings.filter((l) => l.is_active).length}
          </span>
          <span style={styles.statLabel}>Active</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>
            {listings.reduce((acc, l) => acc + (l.total_bookings || 0), 0)}
          </span>
          <span style={styles.statLabel}>Total Bookings</span>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statValue}>
            KSh{" "}
            {listings
              .reduce(
                (acc, l) => acc + l.price_per_night * (l.total_bookings || 0),
                0,
              )
              .toLocaleString()}
          </span>
          <span style={styles.statLabel}>Total Revenue</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={styles.filterTabs}>
        <button
          style={{
            ...styles.filterTab,
            ...(filter === "all" && styles.filterTabActive),
          }}
          onClick={() => setFilter("all")}
        >
          All Listings ({listings.length})
        </button>
        <button
          style={{
            ...styles.filterTab,
            ...(filter === "active" && styles.filterTabActive),
          }}
          onClick={() => setFilter("active")}
        >
          Active ({listings.filter((l) => l.is_active).length})
        </button>
        <button
          style={{
            ...styles.filterTab,
            ...(filter === "inactive" && styles.filterTabActive),
          }}
          onClick={() => setFilter("inactive")}
        >
          Inactive ({listings.filter((l) => !l.is_active).length})
        </button>
      </div>

      {/* Listings Grid */}
      {loading ? (
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Loading listings...</p>
        </div>
      ) : filteredListings.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🏠</div>
          <h3>No listings found</h3>
          <p>Create your first listing to start accepting bookings</p>
          <button
            style={styles.emptyButton}
            onClick={() => navigate("/host/create-listing")}
          >
            <Plus size={18} />
            Create Listing
          </button>
        </div>
      ) : (
        <div style={styles.listingsGrid}>
          {filteredListings.map((listing) => (
            <div key={listing.id} style={styles.listingCard}>
              <div style={styles.listingImage}>
                <img
                  src={
                    listing.images?.[0] ||
                    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"
                  }
                  alt={listing.name}
                  style={styles.image}
                />
                <span
                  style={{
                    ...styles.statusBadge,
                    ...(isStatusActive(listing.is_active)
                      ? styles.statusActive
                      : styles.statusInactive),
                  }}
                >
                  {capitalizeStatus(listing.is_active)}
                </span>
                <div style={styles.listingActions}>
                  <button
                    style={{...styles.actionButton, ...styles.actionEdit}}
                    onClick={() => handleEdit(listing)}
                    title="Edit"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    style={{...styles.actionButton, ...styles.actionDelete}}
                    onClick={() => handleDeleteClick(listing)}
                    title="Delete"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div style={styles.listingContent}>
                <div style={styles.listingHeader}>
                  <h3 style={styles.listingTitle}>{listing.name}</h3>
                  {getRating(listing) > 0 && (
                    <div style={styles.rating}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      <span>{getRating(listing).toFixed(1)}</span>
                    </div>
                  )}
                </div>
                <p style={styles.listingLocation}>📍 {listing.location}</p>
                <div style={styles.listingMeta}>
                  <span style={styles.propertyType}>
                    {formatPropertyType(listing.room_type || listing.rooms?.[0]?.room_type || 'single')}
                  </span>
                  <span style={styles.price}>KES {getPrice(listing).toLocaleString()}/mo</span>
                </div>
                <div style={styles.listingStats}>
                  <span style={styles.stat}>
                    📅 {getBookings(listing)} bookings
                  </span>
                  <button
                    style={styles.manageButton}
                    onClick={() => navigate(`/host/listings/${listing.id}`)}
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Listing</h2>
              <button style={styles.closeBtn} onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={styles.modalContent}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Property Name</label>
                  <input
                    type="text"
                    name="name"
                    style={styles.input}
                    placeholder="Enter property name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    style={styles.textarea}
                    placeholder="Enter property description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Room Type</label>
                    <select
                      name="room_type"
                      style={styles.select}
                      value={formData.room_type}
                      onChange={handleInputChange}
                    >
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="bed_sitter">Bed Sitter</option>
                      <option value="studio">Studio</option>
                      <option value="apartment">Apartment</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Price (KES/month)</label>
                    <input
                      type="number"
                      name="price"
                      style={styles.input}
                      placeholder="Enter price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Location</label>
                  <input
                    type="text"
                    name="location"
                    style={styles.input}
                    placeholder="Enter address"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      style={styles.input}
                      placeholder="Room capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Available Units</label>
                    <input
                      type="number"
                      name="available_units"
                      style={styles.input}
                      placeholder="Available units"
                      value={formData.available_units}
                      onChange={handleInputChange}
                      required
                      min="1"
                    />
                  </div>
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.submitBtn}
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Add Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedListing && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Listing</h2>
              <button style={styles.closeBtn} onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div style={styles.modalContent}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Property Name</label>
                  <input
                    type="text"
                    name="name"
                    style={styles.input}
                    placeholder="Enter property name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Description</label>
                  <textarea
                    name="description"
                    style={styles.textarea}
                    placeholder="Enter property description"
                    value={editFormData.description}
                    onChange={handleEditInputChange}
                    rows={3}
                  />
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Room Type</label>
                    <select
                      name="room_type"
                      style={styles.select}
                      value={editFormData.room_type}
                      onChange={handleEditInputChange}
                    >
                      <option value="single">Single</option>
                      <option value="double">Double</option>
                      <option value="bed_sitter">Bed Sitter</option>
                      <option value="studio">Studio</option>
                      <option value="apartment">Apartment</option>
                    </select>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Price (KES/month)</label>
                    <input
                      type="number"
                      name="price"
                      style={styles.input}
                      placeholder="Enter price"
                      value={editFormData.price}
                      onChange={handleEditInputChange}
                      required
                      min="1"
                    />
                  </div>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Location</label>
                  <input
                    type="text"
                    name="location"
                    style={styles.input}
                    placeholder="Enter address"
                    value={editFormData.location}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Capacity</label>
                    <input
                      type="number"
                      name="capacity"
                      style={styles.input}
                      placeholder="Room capacity"
                      value={editFormData.capacity}
                      onChange={handleEditInputChange}
                      required
                      min="1"
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Available Units</label>
                    <input
                      type="number"
                      name="available_units"
                      style={styles.input}
                      placeholder="Available units"
                      value={editFormData.available_units}
                      onChange={handleEditInputChange}
                      required
                      min="1"
                    />
                  </div>
                </div>
              </div>
              <div style={styles.modalFooter}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => setShowEditModal(false)}
                  disabled={editingSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={styles.submitBtn}
                  disabled={editingSubmitting}
                >
                  {editingSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedListing && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Confirm Delete</h2>
              <button style={styles.closeBtn} onClick={() => setShowDeleteModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalContent}>
              <p style={styles.deleteMessage}>
                Are you sure you want to delete <strong>{selectedListing.name}</strong>? 
                This action cannot be undone.
              </p>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                style={styles.deleteBtn}
                onClick={handleDelete}
              >
                Delete Listing
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
    alignItems: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#64748b",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e5e7eb",
  },
  statValue: {
    display: "block",
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "4px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#64748b",
  },
  filterTabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "16px",
  },
  filterTab: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    cursor: "pointer",
  },
  filterTabActive: {
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
  },
  listingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "24px",
  },
  listingCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    transition: "all 0.2s",
  },
  listingImage: {
    position: "relative",
    height: "200px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  statusBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 600,
  },
  statusActive: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
  },
  statusInactive: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
  },
  listingActions: {
    position: "absolute",
    top: "12px",
    right: "12px",
    display: "flex",
    gap: "8px",
    opacity: 1,
    transition: "opacity 0.2s",
  },
  actionButton: {
    width: "36px",
    height: "36px",
    backgroundColor: "rgba(255,255,255,0.9)",
    border: "none",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  actionEdit: {
    color: "#3b82f6",
  },
  actionDelete: {
    color: "#dc2626",
  },
  listingContent: {
    padding: "20px",
  },
  listingHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  listingTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#64748b",
  },
  listingLocation: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "12px",
  },
  listingMeta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  propertyType: {
    padding: "4px 10px",
    backgroundColor: "#f1f5f9",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#64748b",
  },
  price: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#1e293b",
  },
  listingStats: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    borderTop: "1px solid #f1f5f9",
  },
  stat: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#64748b",
  },
  manageButton: {
    padding: "8px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#64748b",
    cursor: "pointer",
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px",
    color: "#64748b",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e2e8f0",
    borderTopColor: "#3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  emptyButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "16px",
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
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
  },
  closeBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
    padding: "4px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    padding: "24px",
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
    boxSizing: "border-box",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#334155",
    outline: "none",
    boxSizing: "border-box",
    resize: "vertical",
    fontFamily: "inherit",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "16px 24px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    borderRadius: "0 0 12px 12px",
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "#fff",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  submitBtn: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "10px 20px",
    backgroundColor: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  deleteMessage: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
    lineHeight: 1.6,
  },
};

export default HostListings;

