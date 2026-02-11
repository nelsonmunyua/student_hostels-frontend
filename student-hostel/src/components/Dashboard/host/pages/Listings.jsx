import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Eye, Edit, Trash2, MapPin, Users, Star } from "lucide-react";
import {
  deleteAccommodation,
  fetchMyListings,
} from "../../../../redux/slices/Thunks/accommodationThunks";

const HostListings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myListings, loading, error, successMessage } = useSelector(
    (state) => state.accommodation,
  );

  const [filter, setFilter] = useState("all");
  const [localError, setLocalError] = useState(null);
  const [localSuccess, setLocalSuccess] = useState(null);

  // Fetch listings on mount
  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  // Handle Redux error/success messages
  useEffect(() => {
    if (error) {
      setLocalError(error);
      setTimeout(() => setLocalError(null), 5000);
    }
    if (successMessage) {
      setLocalSuccess(successMessage);
      setTimeout(() => setLocalSuccess(null), 5000);
    }
  }, [error, successMessage]);

  // Use Redux data only - no mock fallback
  const listings = myListings || [];
  
  const filteredListings =
    filter === "all"
      ? listings
      : filter === "active"
        ? listings.filter((l) => l.is_active)
        : listings.filter((l) => !l.is_active);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      await dispatch(deleteAccommodation(id));
    }
    setShowMenu(null);
  };

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
                    ...(listing.is_active
                      ? styles.statusActive
                      : styles.statusInactive),
                  }}
                >
                  {listing.is_active ? "Active" : "Inactive"}
                </span>
                <div style={styles.listingActions}>
                  <button
                    style={styles.actionButton}
                    onClick={() => navigate(`/accommodations/${listing.id}`)}
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    style={styles.actionButton}
                    onClick={() =>
                      navigate(`/host/listings/${listing.id}/edit`)
                    }
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    style={{ ...styles.actionButton, ...styles.actionDelete }}
                    onClick={() => handleDelete(listing.id)}
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div style={styles.listingContent}>
                <div style={styles.listingHeader}>
                  <h3 style={styles.listingTitle}>{listing.name}</h3>
                  {listing.rating && (
                    <div style={styles.rating}>
                      <Star size={14} color="#f59e0b" fill="#f59e0b" />
                      <span>{listing.rating}</span>
                    </div>
                  )}
                </div>

                <div style={styles.listingLocation}>
                  <MapPin size={14} />
                  <span>{listing.location}</span>
                </div>

                <div style={styles.listingMeta}>
                  <span style={styles.propertyType}>
                    {formatPropertyType(listing.property_type)}
                  </span>
                  <span style={styles.price}>
                    KSh {listing.price_per_night?.toLocaleString()}/night
                  </span>
                </div>

                <div style={styles.listingStats}>
                  <div style={styles.stat}>
                    <Users size={14} />
                    <span>{listing.total_bookings || 0} bookings</span>
                  </div>
                  <button
                    style={styles.manageButton}
                    onClick={() => navigate(`/host/availability/${listing.id}`)}
                  >
                    Manage Availability
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "32px",
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
    opacity: 0,
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
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: "20px auto 0",
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default HostListings;
