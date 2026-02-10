import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X } from "lucide-react";

const HostListings = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  
  const [listings] = useState([
    {
      id: 1,
      name: "University View Hostel",
      location: "123 College Ave",
      status: "active",
      price: 450,
      bookings: 12,
      rating: 4.8,
      image: "/api/placeholder/100/100",
    },
    {
      id: 2,
      name: "Central Student Living",
      location: "456 Main St",
      status: "active",
      price: 380,
      bookings: 8,
      rating: 4.5,
      image: "/api/placeholder/100/100",
    },
    {
      id: 3,
      name: "Campus Edge Apartments",
      location: "789 Campus Rd",
      status: "pending",
      price: 520,
      bookings: 0,
      rating: 0,
      image: "/api/placeholder/100/100",
    },
  ]);

  // Modal handlers
  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleEdit = (listing) => {
    setSelectedListing(listing);
    setShowEditModal(true);
  };

  const handleView = (listing) => {
    alert(`Viewing details for: ${listing.name}\n\nThis would open a detailed view modal.`);
  };

  const handleDelete = (listing) => {
    setSelectedListing(listing);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedListing) {
      alert(`Deleting: ${selectedListing.name}\n\nThis would delete the listing and refresh the list.`);
      setShowDeleteModal(false);
      setSelectedListing(null);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Listings</h1>
          <p style={styles.subtitle}>Manage your property listings</p>
        </div>
        <button style={styles.addButton} onClick={handleAddNew}>
          <span style={styles.addIcon}>+</span>
          Add New Listing
        </button>
      </div>

      {/* Listings Grid */}
      <div style={styles.listingsGrid}>
        {listings.map((listing) => (
          <div key={listing.id} style={styles.listingCard}>
            <div style={styles.listingImage}>
              <span style={styles.imagePlaceholder}>🏠</span>
            </div>
            <div style={styles.listingContent}>
              <div style={styles.listingHeader}>
                <h3 style={styles.listingName}>{listing.name}</h3>
                <span
                  style={{
                    ...styles.statusBadge,
                    ...(listing.status === "active"
                      ? styles.statusActive
                      : styles.statusPending),
                  }}
                >
                  {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                </span>
              </div>
              <p style={styles.listingLocation}>📍 {listing.location}</p>
              <div style={styles.listingStats}>
                <span style={styles.listingPrice}>${listing.price}/mo</span>
                <span style={styles.listingBookings}>
                  📅 {listing.bookings} bookings
                </span>
              </div>
              {listing.rating > 0 && (
                <div style={styles.listingRating}>
                  ⭐ {listing.rating.toFixed(1)} rating
                </div>
              )}
              <div style={styles.listingActions}>
                <button style={styles.actionBtn} onClick={() => handleEdit(listing)}>Edit</button>
                <button style={styles.actionBtn} onClick={() => handleView(listing)}>View</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Listings Table View */}
      <div style={styles.tableSection}>
        <h2 style={styles.sectionTitle}>All Listings Overview</h2>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Property</th>
                <th style={styles.th}>Location</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Bookings</th>
                <th style={styles.th}>Rating</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} style={styles.tableRow}>
                  <td style={styles.td}>
                    <div style={styles.propertyCell}>
                      <span style={styles.propertyIcon}>🏠</span>
                      <span style={styles.propertyName}>{listing.name}</span>
                    </div>
                  </td>
                  <td style={styles.td}>{listing.location}</td>
                  <td style={styles.td}>${listing.price}/mo</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        ...styles.tableBadge,
                        ...(listing.status === "active"
                          ? styles.badgeActive
                          : styles.badgePending),
                      }}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td style={styles.td}>{listing.bookings}</td>
                  <td style={styles.td}>
                    {listing.rating > 0 ? `⭐ ${listing.rating.toFixed(1)}` : "-"}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.tableActions}>
                      <button style={styles.tableBtn} onClick={() => handleEdit(listing)}>Edit</button>
                      <button style={styles.tableBtn} onClick={() => handleDelete(listing)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

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
            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Property Name</label>
                <input type="text" style={styles.input} placeholder="Enter property name" />
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
                  <input type="number" style={styles.input} placeholder="Enter price" />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input type="text" style={styles.input} placeholder="Enter address" />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Rooms</label>
                  <input type="number" style={styles.input} placeholder="Number of rooms" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Capacity</label>
                  <input type="number" style={styles.input} placeholder="Total capacity" />
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setShowAddModal(false)}>Cancel</button>
              <button style={styles.submitBtn} onClick={() => {
                alert("New listing would be created and list refreshed");
                setShowAddModal(false);
              }}>Add Listing</button>
            </div>
          </div>
        </div>
      )}

      {/* edit_file Modal */}
      {showEditModal && selectedListing && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Listing</h2>
              <button style={styles.closeBtn} onClick={() => setShowEditModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Property Name</label>
                <input type="text" style={styles.input} defaultValue={selectedListing.name} />
              </div>
              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Type</label>
                  <select style={styles.select} defaultValue={selectedListing.type || "Hostel"}>
                    <option>Hostel</option>
                    <option>Apartment</option>
                    <option>Studio</option>
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Price ($/month)</label>
                  <input type="number" style={styles.input} defaultValue={selectedListing.price} />
                </div>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input type="text" style={styles.input} defaultValue={selectedListing.location} />
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setShowEditModal(false)}>Cancel</button>
              <button style={styles.submitBtn} onClick={() => {
                alert(`Listing "${selectedListing.name}" would be updated`);
                setShowEditModal(false);
              }}>Save Changes</button>
            </div>
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
              <p style={styles.deleteText}>
                Are you sure you want to delete <strong>{selectedListing.name}</strong>?
              </p>
              <p style={styles.deleteWarning}>
                This action cannot be undone.
              </p>
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button style={styles.deleteBtn} onClick={confirmDelete}>Delete Listing</button>
            </div>
          </div>
        </div>
      )}
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
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "#0369a1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  addIcon: {
    fontSize: "18px",
    fontWeight: "700",
  },
  listingsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  listingCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e5e7eb",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  listingImage: {
    height: "160px",
    backgroundColor: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholder: {
    fontSize: "48px",
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
  listingName: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    margin: 0,
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  statusActive: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
  },
  statusPending: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
  },
  listingLocation: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  listingStats: {
    display: "flex",
    gap: "16px",
    marginBottom: "8px",
  },
  listingPrice: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0369a1",
  },
  listingBookings: {
    fontSize: "14px",
    color: "#6b7280",
  },
  listingRating: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "16px",
  },
  listingActions: {
    display: "flex",
    gap: "8px",
  },
  actionBtn: {
    flex: 1,
    padding: "8px 12px",
    backgroundColor: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tableSection: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    padding: "20px 24px",
    margin: 0,
    borderBottom: "1px solid #e5e7eb",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
  },
  th: {
    padding: "14px 20px",
    textAlign: "left",
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
  },
  td: {
    padding: "16px 20px",
    fontSize: "14px",
    color: "#374151",
  },
  propertyCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  propertyIcon: {
    fontSize: "20px",
  },
  propertyName: {
    fontWeight: "500",
    color: "#1a1a1a",
  },
  tableBadge: {
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
    textTransform: "capitalize",
  },
  badgeActive: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
  },
  badgePending: {
    backgroundColor: "#fef3c7",
    color: "#d97706",
  },
  tableActions: {
    display: "flex",
    gap: "8px",
  },
  tableBtn: {
    padding: "6px 12px",
    backgroundColor: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  // Modal styles
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
  deleteBtn: {
    padding: "10px 20px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  deleteText: {
    fontSize: "16px",
    color: "#1e293b",
    marginBottom: "12px",
  },
  deleteWarning: {
    fontSize: "14px",
    color: "#64748b",
  },
};

export default HostListings;

