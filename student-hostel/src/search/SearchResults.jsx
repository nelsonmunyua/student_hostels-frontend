import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { searchAccommodations } from "../redux/slices/Thunks/accommodationThunks";
import { toggleWishlist } from "../redux/slices/Thunks/wishlistThunks";
import { setFilters, setPagination } from "../redux/slices/accommodationSlice";
import {
  MapPin,
  Star,
  Heart,
  Users,
  Wifi,
  Coffee,
  Book,
  Grid,
  Map,
  SlidersHorizontal,
  ArrowUpDown,
  Eye,
  Check,
  X,
  ChevronDown,
  DollarSign,
  Clock,
} from "lucide-react";
import "./SearchResults.css";

// Default placeholder image
const DEFAULT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80";

// Fallback images for different accommodations
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
  "https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=800&q=80",
  "https://images.unsplash.com/photo-1590508794514-f2a3c8b8edd4?w=800&q=80",
  "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80",
  "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
  "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80",
];

// Helper to get image URL from accommodation
const getImageUrl = (accommodation, index = 0) => {
  if (!accommodation) return FALLBACK_IMAGES[0];

  // Check for images array
  if (Array.isArray(accommodation.images) && accommodation.images.length > 0) {
    const img = accommodation.images[index];
    if (typeof img === "string") {
      return img.includes("?") ? img : `${img}?w=800&q=80`;
    }
    if (img && img.url) {
      return img.url.includes("?") ? img.url : `${img.url}?w=800&q=80`;
    }
  }

  // Check for single image string
  if (accommodation.image && typeof accommodation.image === "string") {
    return accommodation.image.includes("?")
      ? accommodation.image
      : `${accommodation.image}?w=800&q=80`;
  }

  // Use default placeholder
  return FALLBACK_IMAGES[0];
};

// Helper to get fallback image based on accommodation ID
const getFallbackImage = (id) => {
  if (!id) return FALLBACK_IMAGES[0];
  const index = id % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
};

const SearchResults = ({ viewMode = "grid", onViewModeChange }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults, error, pagination, filters } = useSelector(
    (state) => state.accommodation,
  );
  const { user } = useSelector((state) => state.auth);

  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [showQuickView, setShowQuickView] = useState(null);
  const [sortBy, setSortBy] = useState("recommended");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [localResults, setLocalResults] = useState([]);

  // Sync local results with Redux results
  useEffect(() => {
    setLocalResults(searchResults);
  }, [searchResults]);

  // Fetch search results when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(searchAccommodations({ ...filters, page: pagination.page }));
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, pagination.page, dispatch]);

  // Sort results based on sortBy
  useEffect(() => {
    if (localResults.length === 0) return;

    const sorted = [...localResults].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price_per_night || 0) - (b.price_per_night || 0);
        case "price-high":
          return (b.price_per_night || 0) - (a.price_per_night || 0);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "distance":
          return (a.distance || Infinity) - (b.distance || Infinity);
        default:
          return 0;
      }
    });

    setLocalResults(sorted);
  }, [sortBy]);

  // Format price display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Get property type icon
  const getPropertyIcon = (type) => {
    switch (type) {
      case "hostel":
        return "🏠";
      case "bedsitter":
        return "🛏️";
      case "apartment":
        return "🏢";
      case "single":
        return "🚪";
      case "shared":
        return "👥";
      case "studio":
        return "🎨";
      default:
        return "🏠";
    }
  };

  // Get amenities list
  const getAmenities = (accommodation) => {
    const amenities = [];
    if (accommodation.wifi)
      amenities.push({ icon: <Wifi size={14} />, label: "WiFi" });
    if (accommodation.meals_included)
      amenities.push({ icon: <Coffee size={14} />, label: "Meals" });
    if (accommodation.study_room)
      amenities.push({ icon: <Book size={14} />, label: "Study Room" });
    return amenities;
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    dispatch(setPagination({ page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle sort change
  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
    setShowSortDropdown(false);
  };

  // Toggle compare selection
  const toggleCompare = (accommodationId) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(accommodationId)) {
        return prev.filter((id) => id !== accommodationationId);
      } else if (prev.length < 3) {
        return [...prev, accommodationId];
      }
      return prev;
    });
  };

  // Check if accommodation is selected for compare
  const isSelectedForCompare = (accommodationId) => {
    return selectedForCompare.includes(accommodationId);
  };

  // Open quick view modal
  const openQuickView = (accommodation) => {
    setShowQuickView(accommodation);
  };

  // Close quick view modal
  const closeQuickView = () => {
    setShowQuickView(null);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (accommodationId) => {
    if (!user) {
      navigate("/signup");
      return;
    }
    dispatch(toggleWishlist(accommodationId));
  };

  // Sort options
  const sortOptions = [
    { value: "recommended", label: "Recommended", icon: "⭐" },
    { value: "price-low", label: "Price: Low to High", icon: "⬆️" },
    { value: "price-high", label: "Price: High to Low", icon: "⬇️" },
    { value: "rating", label: "Highest Rated", icon: "🏆" },
    { value: "distance", label: "Nearest to Campus", icon: "📍" },
  ];

  // Empty state
  if (searchResults.length === 0) {
    return (
      <div className="search-results-container">
        <div className="results-empty">
          <div className="empty-icon">🔍</div>
          <h3>No accommodations found</h3>
          <p>We couldn't find any properties matching your criteria.</p>
          <div className="empty-suggestions">
            <p>Try adjusting your:</p>
            <ul>
              <li>Location or search terms</li>
              <li>Price range</li>
              <li>Property type</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      {/* Compare Bar */}
      {selectedForCompare.length > 0 && (
        <div className="compare-bar">
          <div className="compare-info">
            <span className="compare-count">{selectedForCompare.length}</span>
            <span className="compare-text">
              properties selected for comparison
            </span>
          </div>
          <div className="compare-actions">
            <button
              className="clear-compare-btn"
              onClick={() => setSelectedForCompare([])}
            >
              Clear All
            </button>
            <button
              className="view-compare-btn"
              disabled={selectedForCompare.length < 2}
            >
              Compare Now
            </button>
            <button
              className="close-compare-btn"
              onClick={() => setSelectedForCompare([])}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="results-header">
        <div className="results-info">
          <h2>
            {pagination.total}{" "}
            {pagination.total === 1 ? "Property" : "Properties"} Found
          </h2>
          {filters.location && (
            <p className="results-location">
              <MapPin size={14} />
              In {filters.location}
            </p>
          )}
        </div>

        <div className="results-controls">
          {/* Sort Dropdown */}
          <div className="sort-dropdown">
            <button
              className="sort-button"
              onClick={() => setShowSortDropdown(!showSortDropdown)}
            >
              <ArrowUpDown size={16} />
              <span>
                {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                  "Sort by"}
              </span>
              <ChevronDown size={16} />
            </button>
            {showSortDropdown && (
              <div className="sort-menu">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`sort-option ${sortBy === option.value ? "active" : ""}`}
                    onClick={() => handleSortChange(option.value)}
                  >
                    <span className="sort-icon">{option.icon}</span>
                    <span>{option.label}</span>
                    {sortBy === option.value && <Check size={16} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => onViewModeChange?.("grid")}
              title="Grid View"
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === "map" ? "active" : ""}`}
              onClick={() => onViewModeChange?.("map")}
              title="Map View"
            >
              <Map size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Results Grid/List */}
      <div className={`results-${viewMode}`}>
        {localResults.map((accommodation) => (
          <article
            key={accommodation.id}
            className={`result-card fade-in ${isSelectedForCompare(accommodation.id) ? "selected-compare" : ""}`}
          >
            {/* Image Section */}
            <div className="result-image">
              <img
                src={getImageUrl(accommodation)}
                alt={accommodation.title || "Accommodation"}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackImage(accommodation.id);
                }}
              />
              <div className="image-overlay">
                <div className="overlay-top">
                  <button
                    className={`wishlist-btn ${isSelectedForCompare(accommodation.id) ? "active" : ""}`}
                    onClick={() => toggleCompare(accommodation.id)}
                    title={
                      isSelectedForCompare(accommodation.id)
                        ? "Remove from compare"
                        : "Add to compare"
                    }
                  >
                    {isSelectedForCompare(accommodation.id) ? (
                      <Check size={18} />
                    ) : (
                      <Check size={18} />
                    )}
                  </button>
                  <button
                    className="quick-view-btn"
                    onClick={() => openQuickView(accommodation)}
                    title="Quick View"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                {isSelectedForCompare(accommodation.id) && (
                  <div className="compare-badge">
                    <Check size={12} />
                    Selected
                  </div>
                )}

                {accommodation.featured && (
                  <span className="featured-badge">Featured</span>
                )}
                <span className="property-type-badge">
                  {getPropertyIcon(accommodation.property_type)}{" "}
                  {accommodation.property_type}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="result-content">
              <div className="result-header">
                <h3>{accommodation.title}</h3>
                {accommodation.rating && (
                  <div className="rating">
                    <Star size={14} fill="currentColor" />
                    <span>{accommodation.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <p className="result-location">
                <MapPin size={14} />
                {accommodation.location}
              </p>

              {/* Availability Status */}
              <div className="availability-status">
                {accommodation.available_rooms > 0 ? (
                  <span className="available">
                    <Check size={12} />
                    {accommodation.available_rooms} rooms available
                  </span>
                ) : (
                  <span className="full">Fully Booked</span>
                )}
              </div>

              {/* Amenities */}
              <div className="result-amenities">
                {getAmenities(accommodation)
                  .slice(0, 3)
                  .map((amenity, index) => (
                    <span key={index} className="amenity-tag">
                      {amenity.icon}
                      {amenity.label}
                    </span>
                  ))}
              </div>

              {/* Price & CTA */}
              <div className="result-footer">
                <div className="price-info">
                  <span className="price">
                    {formatPrice(accommodation.price_per_night)}
                  </span>
                  <span className="price-label">/ night</span>
                </div>
                <div className="action-buttons">
                  <button
                    className="wishlist-icon-btn"
                    onClick={() => handleWishlistToggle(accommodation.id)}
                  >
                    <Heart size={18} />
                  </button>
                  <Link
                    to={`/accommodations/${accommodation.id}`}
                    className="view-details-btn"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="results-pagination">
          <button
            className="page-btn"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </button>

          <div className="page-numbers">
            {[...Array(pagination.totalPages)].map((_, index) => {
              const page = index + 1;
              // Show ellipsis for many pages
              if (
                page === 1 ||
                page === pagination.totalPages ||
                (page >= pagination.page - 1 && page <= pagination.page + 1)
              ) {
                return (
                  <button
                    key={page}
                    className={`page-num ${page === pagination.page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === pagination.page - 2 ||
                page === pagination.page + 2
              ) {
                return (
                  <span key={page} className="page-ellipsis">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            className="page-btn"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      {showQuickView && (
        <div className="quick-view-modal-overlay" onClick={closeQuickView}>
          <div
            className="quick-view-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close" onClick={closeQuickView}>
              <X size={20} />
            </button>

            <div className="modal-image">
              <img
                src={getImageUrl(showQuickView)}
                alt={showQuickView.title || "Accommodation"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getFallbackImage(showQuickView.id);
                }}
              />
            </div>

            <div className="modal-content">
              <div className="modal-header">
                <h2>{showQuickView.title}</h2>
                {showQuickView.rating && (
                  <div className="modal-rating">
                    <Star size={16} fill="currentColor" />
                    <span>{showQuickView.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              <p className="modal-location">
                <MapPin size={16} />
                {showQuickView.location}
              </p>

              <div className="modal-details">
                <div className="detail-item">
                  <DollarSign size={16} />
                  <span>
                    {formatPrice(showQuickView.price_per_night)} / night
                  </span>
                </div>
                <div className="detail-item">
                  <Users size={16} />
                  <span>Up to {showQuickView.max_guests} guests</span>
                </div>
                <div className="detail-item">
                  <Clock size={16} />
                  <span>Instant Booking</span>
                </div>
              </div>

              <div className="modal-amenities">
                <h4>Amenities</h4>
                <div className="amenities-list">
                  {getAmenities(showQuickView).map((amenity, idx) => (
                    <span key={idx} className="amenity-item">
                      {amenity.icon}
                      {amenity.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="compare-modal-btn"
                  onClick={() => toggleCompare(showQuickView.id)}
                  disabled={
                    selectedForCompare.length >= 3 &&
                    !isSelectedForCompare(showQuickView.id)
                  }
                >
                  {isSelectedForCompare(showQuickView.id)
                    ? "Remove from Compare"
                    : "Add to Compare"}
                </button>
                <Link
                  to={`/accommodations/${showQuickView.id}`}
                  className="view-details-modal-btn"
                  onClick={closeQuickView}
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
