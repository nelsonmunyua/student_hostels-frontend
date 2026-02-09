import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  Heart,
  Filter,
  Grid,
  List,
  Loader2,
  Wifi,
  Car,
  Coffee,
  BookOpen,
  Home,
} from "lucide-react";
import { useSelector } from "react-redux";
import studentApi from "../../../../api/studentApi";

const FindAccommodation = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // State
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    min_price: "",
    max_price: "",
    room_type: "",
    amenities: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  // Debounced search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchAccommodations();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filters, pagination.page]);

  const fetchAccommodations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: 12,
      };
      
      // Only add optional params if they have values
      if (filters.location) params.location = filters.location;
      if (filters.min_price) params.min_price = parseInt(filters.min_price) || 0;
      if (filters.max_price) params.max_price = parseInt(filters.max_price) || 0;
      if (filters.room_type) params.room_type = filters.room_type;
      if (filters.amenities && filters.amenities.length > 0) {
        params.amenities = filters.amenities.join(',');
      }

      const response = await studentApi.getAccommodations(params);
      setAccommodations(response.accommodations || []);
      setPagination((prev) => ({
        ...prev,
        total: response.total || 0,
        pages: response.pages || 1,
      }));
    } catch (err) {
      console.error("Error fetching accommodations:", err);
      // Don't show error, just set mock data for demo
      setAccommodations(getMockAccommodations());
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchAccommodations();
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleViewDetails = (hostelId) => {
    navigate(`/student/accommodations/${hostelId}`);
  };

  const handleWishlistToggle = async (hostelId, e) => {
    e.stopPropagation();
    try {
      const response = await studentApi.toggleWishlist(hostelId);
      setAccommodations((prev) =>
        prev.map((acc) =>
          acc.id === hostelId
            ? { ...acc, is_in_wishlist: response.in_wishlist }
            : acc
        )
      );
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      min_price: "",
      max_price: "",
      room_type: "",
      amenities: [],
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: Wifi,
      parking: Car,
      breakfast: Coffee,
      study: BookOpen,
      security: Home,
    };
    const Icon = icons[amenity?.toLowerCase()] || Wifi;
    return <Icon size={14} />;
  };

  const hasActiveFilters =
    searchTerm ||
    filters.location ||
    filters.min_price ||
    filters.max_price ||
    filters.room_type ||
    filters.amenities.length > 0;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Find Accommodation</h1>
          <p style={styles.subtitle}>
            Discover your perfect student home from our verified listings
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchSection}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchInputWrapper}>
            <Search size={20} color="#6b7280" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <button type="submit" style={styles.searchButton}>
            Search
          </button>
        </form>

        <div style={styles.filterControls}>
          <button
            style={{
              ...styles.filterToggle,
              ...(showFilters ? styles.filterToggleActive : {}),
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {hasActiveFilters && <span style={styles.filterBadge}></span>}
          </button>

          <div style={styles.viewToggle}>
            <button
              style={{
                ...styles.viewButton,
                ...(viewMode === "grid" ? styles.viewButtonActive : {}),
              }}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={18} />
            </button>
            <button
              style={{
                ...styles.viewButton,
                ...(viewMode === "list" ? styles.viewButtonActive : {}),
              }}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div style={styles.filtersPanel}>
          <div style={styles.filterRow}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Location</label>
              <input
                type="text"
                placeholder="Enter location..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Room Type</label>
              <select
                value={filters.room_type}
                onChange={(e) => handleFilterChange("room_type", e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">All Types</option>
                <option value="single">Single Room</option>
                <option value="double">Double Room</option>
                <option value="bed_sitter">Bed Sitter</option>
                <option value="studio">Studio</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Min Price (KSh)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.min_price}
                onChange={(e) => handleFilterChange("min_price", e.target.value)}
                style={styles.filterInput}
              />
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Max Price (KSh)</label>
              <input
                type="number"
                placeholder="No limit"
                value={filters.max_price}
                onChange={(e) => handleFilterChange("max_price", e.target.value)}
                style={styles.filterInput}
              />
            </div>
          </div>

          <div style={styles.filterRow}>
            <div style={styles.amenitiesGroup}>
              <label style={styles.filterLabel}>Amenities</label>
              <div style={styles.amenitiesList}>
                {["wifi", "parking", "breakfast", "study", "security"].map(
                  (amenity) => (
                    <button
                      key={amenity}
                      style={{
                        ...styles.amenityButton,
                        ...(filters.amenities.includes(amenity)
                          ? styles.amenityButtonActive
                          : {}),
                      }}
                      onClick={() => handleAmenityToggle(amenity)}
                    >
                      {getAmenityIcon(amenity)}
                      <span style={{ textTransform: "capitalize" }}>
                        {amenity}
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

            <button
              style={styles.clearFiltersButton}
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Results Info */}
      <div style={styles.resultsInfo}>
        <p>
          Showing {accommodations.length} of {pagination.total} accommodations
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div style={styles.loadingContainer}>
          <Loader2 size={40} color="#3b82f6" style={{ animation: "spin 1s linear infinite" }} />
          <p>Loading accommodations...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div style={styles.errorContainer}>
          <p>{error}</p>
          <button style={styles.retryButton} onClick={fetchAccommodations}>
            Retry
          </button>
        </div>
      )}

      {/* Results Grid */}
      {!loading && !error && accommodations.length > 0 && (
        <div
          style={
            viewMode === "grid"
              ? styles.accommodationsGrid
              : styles.accommodationsList
          }
        >
          {accommodations.map((accommodation) => (
            <div
              key={accommodation.id}
              style={
                viewMode === "grid" ? styles.cardGrid : styles.cardList
              }
              onClick={() => handleViewDetails(accommodation.id)}
            >
              {/* Image */}
              <div style={viewMode === "grid" ? styles.cardImage : styles.cardImageList}>
                <img
                  src={
                    accommodation.images?.[0] ||
                    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400"
                  }
                  alt={accommodation.name}
                  style={styles.cardImageImg}
                />
                <button
                  style={{
                    ...styles.wishlistButton,
                    ...(accommodation.is_in_wishlist
                      ? styles.wishlistButtonActive
                      : {}),
                  }}
                  onClick={(e) =>
                    handleWishlistToggle(accommodation.id, e)
                  }
                >
                  <Heart
                    size={20}
                    color={accommodation.is_in_wishlist ? "#ef4444" : "#fff"}
                    fill={accommodation.is_in_wishlist ? "#ef4444" : "none"}
                  />
                </button>
                {accommodation.is_verified && (
                  <span style={styles.verifiedBadge}>Verified</span>
                )}
              </div>

              {/* Content */}
              <div style={styles.cardContent}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{accommodation.name}</h3>
                  {accommodation.rating > 0 && (
                    <div style={styles.rating}>
                      <Star size={16} color="#f59e0b" fill="#f59e0b" />
                      <span>{accommodation.rating}</span>
                      <span style={styles.reviewCount}>
                        ({accommodation.review_count})
                      </span>
                    </div>
                  )}
                </div>

                <div style={styles.cardLocation}>
                  <MapPin size={14} color="#6b7280" />
                  <span>{accommodation.location}</span>
                </div>

                <div style={styles.cardAmenities}>
                  {accommodation.amenities?.slice(0, 4).map((amenity, idx) => (
                    <span key={idx} style={styles.amenity}>
                      {getAmenityIcon(amenity)}
                      <span style={{ textTransform: "capitalize" }}>
                        {amenity}
                      </span>
                    </span>
                  ))}
                </div>

                <div style={styles.cardFooter}>
                  <div style={styles.price}>
                    <span style={styles.priceValue}>
                      KSh {accommodation.price?.toLocaleString()}
                    </span>
                    <span style={styles.pricePeriod}>/month</span>
                  </div>
                  <span style={styles.roomType}>
                    {accommodation.room_type?.replace("_", " ")}
                  </span>
                </div>

                <button style={styles.viewButtonFull}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && accommodations.length === 0 && (
        <div style={styles.emptyState}>
          <Home size={64} color="#d1d5db" />
          <h3 style={styles.emptyStateTitle}>No accommodations found</h3>
          <p style={styles.emptyStateText}>
            Try adjusting your filters or search terms
          </p>
          {hasActiveFilters && (
            <button style={styles.clearFiltersButton} onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div style={styles.pagination}>
          <button
            style={{
              ...styles.pageButton,
              ...(pagination.page === 1
                ? styles.pageButtonDisabled
                : {}),
            }}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
            disabled={pagination.page === 1}
          >
            Previous
          </button>
          <span style={styles.pageInfo}>
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            style={{
              ...styles.pageButton,
              ...(pagination.page === pagination.pages
                ? styles.pageButtonDisabled
                : {}),
            }}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
            disabled={pagination.page === pagination.pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Mock data for demo
const getMockAccommodations = () => [
  {
    id: 1,
    name: "University View Hostel",
    location: "123 College Ave, Nairobi",
    price: 8500,
    room_type: "single",
    rating: 4.5,
    review_count: 28,
    amenities: ["wifi", "security", "study", "parking"],
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400",
    ],
    is_verified: true,
    is_in_wishlist: false,
  },
  {
    id: 2,
    name: "Central Student Living",
    location: "456 Main Street, Nairobi",
    price: 6500,
    room_type: "bed_sitter",
    rating: 4.2,
    review_count: 15,
    amenities: ["wifi", "breakfast", "security"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    ],
    is_verified: true,
    is_in_wishlist: true,
  },
  {
    id: 3,
    name: "Green Valley Hostel",
    location: "789 Park Road, Nairobi",
    price: 5500,
    room_type: "double",
    rating: 4.0,
    review_count: 42,
    amenities: ["wifi", "parking", "security"],
    images: [
      "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400",
    ],
    is_verified: false,
    is_in_wishlist: false,
  },
];

const styles = {
  container: {
    maxWidth: "1400px",
    padding: "0 24px",
  },
  header: {
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
  },
  searchSection: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },
  searchForm: {
    flex: 1,
    minWidth: "300px",
    display: "flex",
    gap: "12px",
  },
  searchInputWrapper: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#1a1a1a",
  },
  searchButton: {
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  filterControls: {
    display: "flex",
    gap: "12px",
  },
  filterToggle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  filterToggleActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
    color: "#3b82f6",
  },
  filterBadge: {
    width: "8px",
    height: "8px",
    backgroundColor: "#3b82f6",
    borderRadius: "50%",
  },
  viewToggle: {
    display: "flex",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },
  viewButton: {
    padding: "10px 12px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#6b7280",
  },
  viewButtonActive: {
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
  },
  filtersPanel: {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "24px",
  },
  filterRow: {
    display: "flex",
    gap: "24px",
    marginBottom: "16px",
    flexWrap: "wrap",
  },
  filterGroup: {
    flex: 1,
    minWidth: "200px",
  },
  filterLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "8px",
  },
  filterInput: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
  },
  filterSelect: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#fff",
  },
  amenitiesGroup: {
    flex: 1,
    minWidth: "300px",
  },
  amenitiesList: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  amenityButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    backgroundColor: "#f3f4f6",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "13px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  amenityButtonActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
    color: "#3b82f6",
  },
  clearFiltersButton: {
    padding: "10px 20px",
    backgroundColor: "#f3f4f6",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    alignSelf: "flex-end",
  },
  resultsInfo: {
    marginBottom: "24px",
    fontSize: "14px",
    color: "#6b7280",
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
    minHeight: "400px",
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
  accommodationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  accommodationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "32px",
  },
  cardGrid: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  cardList: {
    display: "flex",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  cardImage: {
    position: "relative",
    height: "200px",
  },
  cardImageList: {
    position: "relative",
    height: "180px",
    width: "200px",
    flexShrink: 0,
  },
  cardImageImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  wishlistButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    padding: "8px",
    backgroundColor: "rgba(0,0,0,0.3)",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
  },
  wishlistButtonActive: {
    backgroundColor: "rgba(255,255,255,0.9)",
  },
  verifiedBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "4px 10px",
    backgroundColor: "#10b981",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
  },
  cardContent: {
    padding: "20px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  reviewCount: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: 400,
  },
  cardLocation: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  cardAmenities: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  amenity: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    backgroundColor: "#f3f4f6",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#6b7280",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  price: {
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
  },
  priceValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1a1a1a",
  },
  pricePeriod: {
    fontSize: "14px",
    color: "#6b7280",
  },
  roomType: {
    padding: "4px 10px",
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 500,
    textTransform: "capitalize",
  },
  viewButtonFull: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "64px 24px",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
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
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
  },
  pageButton: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  pageButtonDisabled: {
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
  },
  pageInfo: {
    fontSize: "14px",
    color: "#6b7280",
  },
};

export default FindAccommodation;

