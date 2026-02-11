import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Heart,
  Star,
  Wifi,
  Car,
  Coffee,
  BookOpen,
  Shield,
  ChefHat,
  Dumbbell,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Home,
  ExternalLink,
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
    has_next: false,
    has_prev: false,
  });

  // Filters state
  const [filters, setFilters] = useState({
    location: "",
    min_price: "",
    max_price: "",
    room_type: "",
  });
  const [showFilters, setShowFilters] = useState(true);

  // Wishlist state management
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [togglingWishlist, setTogglingWishlist] = useState(null);

  // Debounce search
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch accommodations
  const fetchAccommodations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: pagination.page,
        limit: 12,
      };

      // Add filters
      if (filters.location) params.location = filters.location;
      if (filters.min_price) params.min_price = parseInt(filters.min_price);
      if (filters.max_price) params.max_price = parseInt(filters.max_price);
      if (filters.room_type) params.room_type = filters.room_type;

      const response = await studentApi.getAccommodations(params);

      setAccommodations(response.accommodations || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        has_next: response.has_next || false,
        has_prev: response.has_prev || false,
      });

      // Update wishlist IDs from response
      const wishlistIds = response.accommodations
        ?.filter((acc) => acc.is_in_wishlist)
        .map((acc) => acc.id) || [];
      setWishlistIds(new Set(wishlistIds));
    } catch (err) {
      console.error("Error fetching accommodations:", err);
      setError("Failed to load accommodations. Please try again.");
      // Mock data for demo
      const mockData = getMockAccommodations();
      setAccommodations(mockData);
      setPagination({ page: 1, pages: 1, total: mockData.length, has_next: false, has_prev: false });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filters]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchAccommodations();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchAccommodations]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      location: "",
      min_price: "",
      max_price: "",
      room_type: "",
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (hostelId, e) => {
    e.stopPropagation();

    try {
      setTogglingWishlist(hostelId);
      const response = await studentApi.toggleWishlist(hostelId);

      setWishlistIds((prev) => {
        const newSet = new Set(prev);
        if (response.in_wishlist) {
          newSet.add(hostelId);
        } else {
          newSet.delete(hostelId);
        }
        return newSet;
      });
    } catch (err) {
      console.error("Error toggling wishlist:", err);
      // Toggle locally for UI responsiveness even if API fails
      setWishlistIds((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(hostelId)) {
          newSet.delete(hostelId);
        } else {
          newSet.add(hostelId);
        }
        return newSet;
      });
    } finally {
      setTogglingWishlist(null);
    }
  };

  // Navigate to accommodation details
  const handleViewDetails = (hostelId) => {
    navigate(`/accommodations/${hostelId}`);
  };

  // Check if wishlist is active
  const isInWishlist = useMemo(
    () => (id) => wishlistIds.has(id),
    [wishlistIds]
  );

  // Get amenity icon
  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: Wifi,
      parking: Car,
      breakfast: Coffee,
      study: BookOpen,
      security: Shield,
      meals: ChefHat,
      gym: Dumbbell,
    };
    const Icon = icons[amenity?.toLowerCase()] || Wifi;
    return <Icon size={14} />;
  };

  // Room type options
  const roomTypes = [
    { value: "", label: "All Room Types" },
    { value: "single", label: "Single Room" },
    { value: "double", label: "Double Room" },
    { value: "bed_sitter", label: "Bed Sitter" },
    { value: "studio", label: "Studio" },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Find Accommodation</h1>
            <p style={styles.subtitle}>
              Discover your perfect student home
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div style={styles.searchSection}>
        <div style={styles.searchContainer}>
          {/* Location Search */}
          <div style={styles.searchBox}>
            <MapPin size={20} color="#64748b" />
            <input
              type="text"
              placeholder="Search by location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                handleFilterChange("location", e.target.value);
              }}
              style={styles.searchInput}
            />
            {searchTerm && (
              <button
                style={styles.clearSearch}
                onClick={() => {
                  setSearchTerm("");
                  handleFilterChange("location", "");
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            style={{
              ...styles.filterToggle,
              ...(showFilters ? styles.filterToggleActive : {}),
            }}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div style={styles.filtersPanel}>
            <div style={styles.filterGrid}>
              {/* Room Type */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Room Type</label>
                <select
                  value={filters.room_type}
                  onChange={(e) => handleFilterChange("room_type", e.target.value)}
                  style={styles.filterSelect}
                >
                  {roomTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
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

              {/* Max Price */}
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

              {/* Clear Filters */}
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>&nbsp;</label>
                <button style={styles.clearButton} onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div style={styles.resultsInfo}>
        <span style={styles.resultsCount}>
          {pagination.total} accommodation{pagination.total !== 1 ? "s" : ""} found
        </span>
        {(filters.location || filters.room_type || filters.min_price || filters.max_price) && (
          <button style={styles.clearFilters} onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div style={styles.errorContainer}>
          <AlertCircle size={48} color="#ef4444" />
          <h3 style={styles.errorTitle}>Something went wrong</h3>
          <p style={styles.errorText}>{error}</p>
          <button style={styles.retryButton} onClick={fetchAccommodations}>
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && accommodations.length === 0 && (
        <div style={styles.loadingGrid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} style={styles.skeletonCard}>
              <div style={styles.skeletonImage} />
              <div style={styles.skeletonContent}>
                <div style={styles.skeletonTitle} />
                <div style={styles.skeletonText} />
                <div style={styles.skeletonText} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accommodations Grid */}
      {!loading && !error && accommodations.length > 0 && (
        <>
          <div style={styles.grid}>
            {accommodations.map((accommodation) => (
              <div
                key={accommodation.id}
                style={styles.card}
                onClick={() => handleViewDetails(accommodation.id)}
              >
                {/* Image */}
                <div style={styles.cardImage}>
                  <img
                    src={
                      accommodation.images?.[0] ||
                      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400"
                    }
                    alt={accommodation.name}
                    style={styles.cardImageImg}
                  />

                  {/* Wishlist Button */}
                  <button
                    style={{
                      ...styles.wishlistButton,
                      ...(isInWishlist(accommodation.id)
                        ? styles.wishlistButtonActive
                        : {}),
                    }}
                    onClick={(e) => handleWishlistToggle(accommodation.id, e)}
                    disabled={togglingWishlist === accommodation.id}
                    title={
                      isInWishlist(accommodation.id)
                        ? "Remove from wishlist"
                        : "Add to wishlist"
                    }
                  >
                    {togglingWishlist === accommodation.id ? (
                      <Loader2
                        size={20}
                        color="#fff"
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    ) : (
                      <Heart
                        size={20}
                        color="#fff"
                        fill={isInWishlist(accommodation.id) ? "#ef4444" : "none"}
                      />
                    )}
                  </button>

                  {/* Verified Badge */}
                  {accommodation.is_verified && (
                    <span style={styles.verifiedBadge}>Verified</span>
                  )}

                  {/* Room Type Badge */}
                  <span style={styles.roomTypeBadge}>
                    {accommodation.room_type?.replace("_", " ")}
                  </span>
                </div>

                {/* Content */}
                <div style={styles.cardContent}>
                  {/* Title & Rating */}
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{accommodation.name}</h3>
                    {accommodation.rating > 0 && (
                      <div style={styles.rating}>
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                        <span style={styles.ratingValue}>
                          {accommodation.rating}
                        </span>
                        <span style={styles.reviewCount}>
                          ({accommodation.review_count || 0})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div style={styles.cardLocation}>
                    <MapPin size={14} color="#64748b" />
                    <span>{accommodation.location}</span>
                  </div>

                  {/* Amenities */}
                  <div style={styles.cardAmenities}>
                    {(accommodation.amenities || [])
                      .slice(0, 4)
                      .map((amenity, idx) => (
                        <span key={idx} style={styles.amenity}>
                          {getAmenityIcon(amenity)}
                          <span style={styles.amenityText}>
                            {amenity?.charAt(0).toUpperCase() +
                              amenity?.slice(1).toLowerCase()}
                          </span>
                        </span>
                      ))}
                    {(accommodation.amenities?.length || 0) > 4 && (
                      <span style={styles.moreAmenities}>
                        +{accommodation.amenities.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={styles.cardFooter}>
                    <div style={styles.price}>
                      <span style={styles.priceValue}>
                        KSh {accommodation.price?.toLocaleString()}
                      </span>
                      <span style={styles.pricePeriod}>/month</span>
                    </div>
                    <button style={styles.viewButton}>
                      <ExternalLink size={14} />
                      View Details
                    </button>
                  </div>

                  {/* Availability */}
                  {accommodation.available_rooms > 0 && (
                    <div style={styles.availability}>
                      <span
                        style={{
                          ...styles.availabilityDot,
                          backgroundColor: "#10b981",
                        }}
                      />
                      {accommodation.available_rooms} room
                      {accommodation.available_rooms !== 1 ? "s" : ""} available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={styles.pagination}>
              <button
                style={{
                  ...styles.pageButton,
                  ...(!pagination.has_prev
                    ? styles.pageButtonDisabled
                    : {}),
                }}
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.has_prev}
              >
                <ChevronLeft size={20} />
                Previous
              </button>

              <div style={styles.pageNumbers}>
                {[...Array(pagination.pages)].map((_, idx) => {
                  const pageNum = idx + 1;
                  return (
                    <button
                      key={pageNum}
                      style={{
                        ...styles.pageNumber,
                        ...(pageNum === pagination.page
                          ? styles.pageNumberActive
                          : {}),
                      }}
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                style={{
                  ...styles.pageButton,
                  ...(!pagination.has_next
                    ? styles.pageButtonDisabled
                    : {}),
                }}
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.has_next}
              >
                Next
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !error && accommodations.length === 0 && (
        <div style={styles.emptyState}>
          <Home size={64} color="#d1d5db" />
          <h3 style={styles.emptyStateTitle}>No accommodations found</h3>
          <p style={styles.emptyStateText}>
            {filters.location || filters.room_type || filters.min_price || filters.max_price
              ? "Try adjusting your filters to see more results"
              : "Check back later for new listings"}
          </p>
          {(filters.location ||
            filters.room_type ||
            filters.min_price ||
            filters.max_price) && (
            <button style={styles.browseButton} onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
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
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400"],
    is_verified: true,
    is_in_wishlist: false,
    available_rooms: 5,
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
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"],
    is_verified: true,
    is_in_wishlist: true,
    available_rooms: 3,
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
    images: ["https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400"],
    is_verified: false,
    is_in_wishlist: false,
    available_rooms: 8,
  },
  {
    id: 4,
    name: "Lakeside Accommodation",
    location: "321 Lake View, Kisumu",
    price: 7500,
    room_type: "studio",
    rating: 4.8,
    review_count: 12,
    amenities: ["wifi", "security", "study", "parking"],
    images: ["https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=400"],
    is_verified: true,
    is_in_wishlist: false,
    available_rooms: 2,
  },
  {
    id: 5,
    name: "Coastal View Hostel",
    location: "555 Ocean Drive, Mombasa",
    price: 7000,
    room_type: "single",
    rating: 4.3,
    review_count: 20,
    amenities: ["wifi", "security", "parking"],
    images: ["https://images.unsplash.com/photo-1590508794514-f2a3c8b8edd4?w=400"],
    is_verified: true,
    is_in_wishlist: false,
    available_rooms: 6,
  },
  {
    id: 6,
    name: "Mountain View Lodge",
    location: "888 Highlands, Nakuru",
    price: 6000,
    room_type: "bed_sitter",
    rating: 4.1,
    review_count: 18,
    amenities: ["wifi", "breakfast", "security"],
    images: ["https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400"],
    is_verified: true,
    is_in_wishlist: true,
    available_rooms: 4,
  },
];

const styles = {
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "24px",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
  },
  searchSection: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "16px",
    marginBottom: "24px",
  },
  searchContainer: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  searchInput: {
    flex: 1,
    border: "none",
    backgroundColor: "transparent",
    fontSize: "14px",
    color: "#1e293b",
    outline: "none",
  },
  clearSearch: {
    padding: "4px",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#64748b",
  },
  filterToggle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  filterToggleActive: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
    color: "#3b82f6",
  },
  filtersPanel: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0",
  },
  filterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    alignItems: "end",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
  },
  filterLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
  },
  filterSelect: {
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#fff",
    color: "#1e293b",
    cursor: "pointer",
  },
  filterInput: {
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#fff",
    color: "#1e293b",
  },
  clearButton: {
    padding: "10px 16px",
    backgroundColor: "#f1f5f9",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    cursor: "pointer",
  },
  resultsInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  resultsCount: {
    fontSize: "14px",
    color: "#64748b",
    fontWeight: 500,
  },
  clearFilters: {
    padding: "6px 12px",
    backgroundColor: "transparent",
    border: "none",
    fontSize: "14px",
    color: "#3b82f6",
    cursor: "pointer",
    textDecoration: "underline",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "64px 24px",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  errorTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    marginTop: "16px",
    marginBottom: "8px",
  },
  errorText: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "16px",
  },
  retryButton: {
    padding: "10px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  loadingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
  },
  skeletonCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  skeletonImage: {
    height: "200px",
    backgroundColor: "#f1f5f9",
    animation: "pulse 1.5s infinite",
  },
  skeletonContent: {
    padding: "16px",
  },
  skeletonTitle: {
    height: "20px",
    width: "70%",
    backgroundColor: "#f1f5f9",
    borderRadius: "4px",
    marginBottom: "12px",
    animation: "pulse 1.5s infinite",
  },
  skeletonText: {
    height: "14px",
    width: "90%",
    backgroundColor: "#f1f5f9",
    borderRadius: "4px",
    marginBottom: "8px",
    animation: "pulse 1.5s infinite",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cardImage: {
    position: "relative",
    height: "200px",
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
    padding: "10px",
    backgroundColor: "rgba(0,0,0,0.3)",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
  },
  wishlistButtonActive: {
    backgroundColor: "rgba(239, 68, 68, 0.9)",
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
  roomTypeBadge: {
    position: "absolute",
    bottom: "12px",
    left: "12px",
    padding: "4px 10px",
    backgroundColor: "rgba(0,0,0,0.6)",
    color: "#fff",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 500,
    textTransform: "capitalize",
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
    color: "#1e293b",
    margin: 0,
    flex: 1,
    marginRight: "8px",
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    flexShrink: 0,
  },
  ratingValue: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1e293b",
  },
  reviewCount: {
    fontSize: "12px",
    color: "#64748b",
  },
  cardLocation: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "12px",
  },
  cardAmenities: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
    marginBottom: "16px",
  },
  amenity: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "4px 8px",
    backgroundColor: "#f1f5f9",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#64748b",
  },
  amenityText: {
    textTransform: "capitalize",
  },
  moreAmenities: {
    padding: "4px 8px",
    backgroundColor: "#f1f5f9",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#64748b",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: "16px",
    borderTop: "1px solid #f1f5f9",
  },
  price: {
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
  },
  priceValue: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#1e293b",
  },
  pricePeriod: {
    fontSize: "14px",
    color: "#64748b",
  },
  viewButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  availability: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginTop: "12px",
    fontSize: "12px",
    color: "#64748b",
  },
  availabilityDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    paddingTop: "16px",
    borderTop: "1px solid #e2e8f0",
  },
  pageButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  pageButtonDisabled: {
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
  },
  pageNumbers: {
    display: "flex",
    gap: "8px",
  },
  pageNumber: {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  pageNumberActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
    color: "#fff",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "64px 24px",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  emptyStateTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#374151",
    marginTop: "16px",
    marginBottom: "8px",
  },
  emptyStateText: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "16px",
  },
  browseButton: {
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
};

export default FindAccommodation;

