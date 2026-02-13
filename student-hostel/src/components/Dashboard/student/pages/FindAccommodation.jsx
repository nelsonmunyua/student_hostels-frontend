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
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import studentApi from "../../../../api/studentApi";

const FindAccommodation = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // State
  const [accommodations, setAccommodations] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    has_next: false,
    has_prev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [filters, setFilters] = useState({
    location: "",
    min_price: "",
    max_price: "",
    room_type: "",
    status: "all",
  });
  const [showFilters, setShowFilters] = useState(true);

  // Wishlist state management
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [togglingWishlist, setTogglingWishlist] = useState(null);

  // Debounce search
  const [searchTerm, setSearchTerm] = useState("");

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
      room_type: "single",
      amenities: ["wifi", "security", "study", "parking"],
      available_rooms: 5,
      is_verified: true,
      is_in_wishlist: false,
      review_count: 28,
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
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      host: "Sarah Johnson",
      room_type: "bed_sitter",
      amenities: ["wifi", "breakfast", "security"],
      available_rooms: 3,
      is_verified: true,
      is_in_wishlist: true,
      review_count: 15,
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
      room_type: "double",
      amenities: ["wifi", "parking", "security"],
      available_rooms: 8,
      is_verified: false,
      is_in_wishlist: false,
      review_count: 42,
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
      image: "https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=800",
      host: "Emily Davis",
      room_type: "studio",
      amenities: ["wifi", "security", "study"],
      available_rooms: 2,
      is_verified: true,
      is_in_wishlist: false,
      review_count: 12,
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
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      host: "David Wilson",
      room_type: "single",
      amenities: ["wifi", "security", "study", "parking", "gym"],
      available_rooms: 6,
      is_verified: true,
      is_in_wishlist: false,
      review_count: 20,
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
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      host: "Lisa Anderson",
      room_type: "double",
      amenities: ["wifi", "security"],
      available_rooms: 4,
      is_verified: true,
      is_in_wishlist: true,
      review_count: 18,
    },
  ];

  // Helper to get image URL from accommodation
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

  // Helper to get accommodation type
  const getType = (acc) => {
    if (acc.type) return acc.type;
    if (acc.room_type) return acc.room_type;
    if (acc.amenities?.type) return acc.amenities.type;
    return 'Hostel';
  };

  // Helper to get accommodation status
  const getStatus = (acc) => {
    if (acc.status) return acc.status;
    return 'active';
  };

  // Helper to get capacity
  const getCapacity = (acc) => {
    if (acc.capacity) return acc.capacity;
    if (acc.amenities?.capacity) return acc.amenities.capacity;
    if (acc.available_rooms) return acc.available_rooms;
    return 0;
  };

  // Helper to get price
  const getPrice = (acc) => {
    if (acc.price) return acc.price;
    if (acc.amenities?.price) return acc.amenities.price;
    return 0;
  };

  // Helper to get rating
  const getRating = (acc) => {
    if (acc.rating) return acc.rating;
    return 0;
  };

  // Helper to get review count
  const getReviewCount = (acc) => {
    if (acc.review_count) return acc.review_count;
    return 0;
  };

  // Helper to get host name
  const getHostName = (acc) => {
    if (acc.host) return acc.host;
    if (acc.host_name) return acc.host_name;
    if (acc.host_id) return `Host #${acc.host_id}`;
    return 'Unknown Host';
  };

  // Helper to get number of rooms
  const getRooms = (acc) => {
    if (acc.rooms) return acc.rooms;
    if (acc.amenities?.rooms) return acc.amenities.rooms;
    return 0;
  };

  // Helper to get available rooms
  const getAvailableRooms = (acc) => {
    if (acc.available_rooms !== undefined) return acc.available_rooms;
    if (acc.rooms) return acc.rooms;
    return 0;
  };

  // Helper to get amenities
  const getAmenities = (acc) => {
    if (acc.amenities && Array.isArray(acc.amenities)) return acc.amenities;
    return [];
  };

  // Helper to check if verified
  const getIsVerified = (acc) => {
    if (acc.is_verified !== undefined) return acc.is_verified;
    return false;
  };

  // Get status badge
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

  // Use mock data if API data is empty or on error
  const displayAccommodations = accommodations.length > 0 ? accommodations : mockAccommodations;

  // Filter accommodations based on status
  const filteredAccommodations = displayAccommodations.filter((acc) => {
    const matchesStatus = filters.status === "all" || getStatus(acc) === filters.status;
    const matchesSearch = !searchTerm || 
      acc.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Fetch accommodations
  const fetchAccommodations = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: 12,
      };

      // Add filters
      if (filters.location) params.location = filters.location;
      if (filters.min_price) params.min_price = parseInt(filters.min_price);
      if (filters.max_price) params.max_price = parseInt(filters.max_price);
      if (filters.room_type) params.room_type = filters.room_type;
      if (filters.status && filters.status !== "all") params.status = filters.status;

      const response = await studentApi.getAccommodations(params);

      setAccommodations(response.accommodations || []);
      setPagination({
        page: response.page || 1,
        pages: response.pages || 1,
        total: response.total || 0,
        has_next: response.has_next || false,
        has_prev: response.has_prev || false,
      });
      setError(null);

      // Update wishlist IDs from response
      const wishlistIds = response.accommodations
        ?.filter((acc) => acc.is_in_wishlist)
        .map((acc) => acc.id) || [];
      setWishlistIds(new Set(wishlistIds));
    } catch (err) {
      console.error("Error fetching accommodations:", err);
      setError("Failed to load accommodations. Using demo data.");
      // Keep mock data on error
      setAccommodations([]);
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

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      location: "",
      min_price: "",
      max_price: "",
      room_type: "",
      status: "all",
    });
    setSearchTerm("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
            {/* Status Filter Buttons */}
            <div style={styles.statusFilterButtons}>
              <button
                style={{
                  ...styles.statusFilterBtn,
                  backgroundColor: filters.status === "all" ? "#0369a1" : "#f1f5f9",
                  color: filters.status === "all" ? "#ffffff" : "#64748b",
                }}
                onClick={() => handleFilterChange("status", "all")}
              >
                All
              </button>
              <button
                style={{
                  ...styles.statusFilterBtn,
                  backgroundColor: filters.status === "active" ? "#0369a1" : "#f1f5f9",
                  color: filters.status === "active" ? "#ffffff" : "#64748b",
                }}
                onClick={() => handleFilterChange("status", "active")}
              >
                Active
              </button>
              <button
                style={{
                  ...styles.statusFilterBtn,
                  backgroundColor: filters.status === "pending" ? "#0369a1" : "#f1f5f9",
                  color: filters.status === "pending" ? "#ffffff" : "#64748b",
                }}
                onClick={() => handleFilterChange("status", "pending")}
              >
                Pending
              </button>
              <button
                style={{
                  ...styles.statusFilterBtn,
                  backgroundColor: filters.status === "inactive" ? "#0369a1" : "#f1f5f9",
                  color: filters.status === "inactive" ? "#ffffff" : "#64748b",
                }}
                onClick={() => handleFilterChange("status", "inactive")}
              >
                Inactive
              </button>
            </div>

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
          {filteredAccommodations.length} accommodation{filteredAccommodations.length !== 1 ? "s" : ""} found
        </span>
        {(filters.location || filters.room_type || filters.min_price || filters.max_price || filters.status !== "all") && (
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
      {!loading && !error && filteredAccommodations.length > 0 && (
        <>
          <div style={styles.grid}>
            {filteredAccommodations.map((accommodation) => (
              <div
                key={accommodation.id}
                style={styles.card}
                onClick={() => handleViewDetails(accommodation.id)}
              >
                {/* Image */}
                <div style={styles.cardImage}>
                  <img
                    src={getImageUrl(accommodation)}
                    alt={accommodation.name}
                    style={styles.cardImageImg}
                    onError={(e) => { e.target.src = mockAccommodations[0]?.image; }}
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
                  {getIsVerified(accommodation) && (
                    <span style={styles.verifiedBadge}>Verified</span>
                  )}

                  {/* Status Badge */}
                  {getStatusBadge(getStatus(accommodation))}

                  {/* Room Type Badge */}
                  <span style={styles.roomTypeBadge}>
                    {getType(accommodation)}
                  </span>
                </div>

                {/* Content */}
                <div style={styles.cardContent}>
                  {/* Title & Rating */}
                  <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>{accommodation.name}</h3>
                    {getRating(accommodation) > 0 && (
                      <div style={styles.rating}>
                        <Star size={16} color="#f59e0b" fill="#f59e0b" />
                        <span style={styles.ratingValue}>
                          {getRating(accommodation)}
                        </span>
                        <span style={styles.reviewCount}>
                          ({getReviewCount(accommodation)})
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Location */}
                  <div style={styles.cardLocation}>
                    <MapPin size={14} color="#64748b" />
                    <span>{accommodation.location}</span>
                  </div>

                  {/* Stats */}
                  <div style={styles.cardStats}>
                    <div style={styles.cardStat}>
                      <Users size={16} color="#64748b" />
                      <span>{getCapacity(accommodation)} students</span>
                    </div>
                    <div style={styles.cardStat}>
                      <Star size={16} color="#f59e0b" />
                      <span>{getRating(accommodation)}</span>
                    </div>
                    <div style={styles.cardStat}>
                      <span style={styles.priceStat}>Ksh{getPrice(accommodation)}/mo</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div style={styles.cardAmenities}>
                    {getAmenities(accommodation)
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
                    {getAmenities(accommodation).length > 4 && (
                      <span style={styles.moreAmenities}>
                        +{getAmenities(accommodation).length - 4}
                      </span>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={styles.cardFooter}>
                    <div style={styles.price}>
                      <span style={styles.priceValue}>
                        KSh {getPrice(accommodation).toLocaleString()}
                      </span>
                      <span style={styles.pricePeriod}>/month</span>
                    </div>
                    <button style={styles.viewButton}>
                      <ExternalLink size={14} />
                      View Details
                    </button>
                  </div>

                  {/* Availability */}
                  {getAvailableRooms(accommodation) > 0 && (
                    <div style={styles.availability}>
                      <span
                        style={{
                          ...styles.availabilityDot,
                          backgroundColor: "#10b981",
                        }}
                      />
                      {getAvailableRooms(accommodation)} room
                      {getAvailableRooms(accommodation) !== 1 ? "s" : ""} available
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
      {!loading && !error && filteredAccommodations.length === 0 && (
        <div style={styles.emptyState}>
          <Home size={64} color="#d1d5db" />
          <h3 style={styles.emptyStateTitle}>No accommodations found</h3>
          <p style={styles.emptyStateText}>
            {filters.location || filters.room_type || filters.min_price || filters.max_price || filters.status !== "all"
              ? "Try adjusting your filters to see more results"
              : "Check back later for new listings"}
          </p>
          {(filters.location ||
            filters.room_type ||
            filters.min_price ||
            filters.max_price ||
            filters.status !== "all") && (
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

// Styles object
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
  statusFilterButtons: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  },
  statusFilterBtn: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
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
  statusBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    padding: "4px 10px",
    borderRadius: "4px",
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
  priceStat: {
    fontWeight: 600,
    color: "#059669",
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
