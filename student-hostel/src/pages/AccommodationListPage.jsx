import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Grid, List, SlidersHorizontal, X } from "lucide-react";
import { fetchAccommodations } from "../redux/slices/Thunks/accommodationThunks";
import { setFilters, clearFilters } from "../redux/slices/accommodationSlice";
import AccommodationCard from "../components/accommodation/AccommodationCard";
import FilterSidebar from "../search/FilterSidebar";
import MapView from "../search/MapView";
import "./AccommodationListPage.css";

const AccommodationListPage = () => {
  const dispatch = useDispatch();
  const { accommodations, loading, pagination, filters } = useSelector(
    (state) => state.accommodation,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("popular");

  useEffect(() => {
    const params = {
      page: searchParams.get("page") || 1,
      limit: 12,
      ...Object.fromEntries(
        Object.entries(filters).filter(
          ([_, v]) => v !== "" && v !== null && v !== undefined,
        ),
      ),
    };
    dispatch(fetchAccommodations(params));
  }, [dispatch, searchParams, filters]);

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
    dispatch(setFilters({ [key]: value }));
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    handleFilterChange("sort", sort);
  };

  const handlePageChange = (newPage) => {
    handleFilterChange("page", newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const mockAccommodations = [
    {
      id: 1,
      name: "University View Hostel",
      location: "123 College Ave, Nairobi",
      price_per_night: 8500,
      rating: 4.5,
      review_count: 28,
      amenities: ["wifi", "security", "study", "parking"],
      images: [
        "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
      ],
      is_verified: true,
      property_type: "hostel",
    },
    {
      id: 2,
      name: "Central Student Living",
      location: "456 Main Street, Nairobi",
      price_per_night: 6500,
      rating: 4.2,
      review_count: 15,
      amenities: ["wifi", "breakfast", "security"],
      images: [
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
      ],
      is_verified: true,
      property_type: "bedsitter",
    },
    {
      id: 3,
      name: "Green Valley Hostel",
      location: "789 Park Road, Nairobi",
      price_per_night: 5500,
      rating: 4.0,
      review_count: 42,
      amenities: ["wifi", "parking", "security"],
      images: [
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
      ],
      is_verified: false,
      property_type: "hostel",
    },
    {
      id: 4,
      name: "Lakeside Accommodation",
      location: "321 Lake View, Kisumu",
      price_per_night: 7500,
      rating: 4.8,
      review_count: 12,
      amenities: ["wifi", "security", "study", "parking"],
      images: [
        "https://www.taupo.info/sites/www.taupo.info/files/styles/slideshow__smartport/public/pics/listings/images/lakeside_accommodation_taupo_2.jpg?itok=C53_oEUS",
      ],
      is_verified: true,
      property_type: "apartment",
    },
    {
      id: 5,
      name: "Coastal View Hostel",
      location: "555 Ocean Drive, Mombasa",
      price_per_night: 7000,
      rating: 4.3,
      review_count: 20,
      amenities: ["wifi", "security", "parking"],
      images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa79bDQMAv5djTm8rmPSrj2Po6l50qibA1-w&s",
      ],
      is_verified: true,
      property_type: "hostel",
    },
    {
      id: 6,
      name: "Mountain View Lodge",
      location: "888 Highlands, Nakuru",
      price_per_night: 6000,
      rating: 4.1,
      review_count: 18,
      amenities: ["wifi", "breakfast", "security"],
      images: [
        "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80",
      ],
      is_verified: true,
      property_type: "bedsitter",
    },
    {
      id: 7,
      name: "Budget Student Pad",
      location: "999 Budget Street, Nairobi",
      price_per_night: 4000,
      rating: 3.8,
      review_count: 8,
      amenities: ["wifi", "security"],
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
      ],
      is_verified: false,
      property_type: "bedsitter",
    },
    {
      id: 8,
      name: "Urban Studio Apartments",
      location: "555 Innovation Ave, Nairobi",
      price_per_night: 9500,
      rating: 4.6,
      review_count: 35,
      amenities: ["wifi", "security", "study", "parking", "kitchen"],
      images: [
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
      ],
      is_verified: true,
      property_type: "studio",
    },
    {
      id: 9,
      name: "Campus Edge Shared Living",
      location: "222 University Road, Nairobi",
      price_per_night: 4500,
      rating: 4.2,
      review_count: 52,
      amenities: ["wifi", "security", "study", "laundry"],
      images: [
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1Tqi2Q6kGhHBRtSEMWwq-xKTZHfKzAE3V7g&s",
      ],
      is_verified: true,
      property_type: "shared",
    },
    {
      id: 10,
      name: "Executive Single Rooms",
      location: "777 Prestige Lane, Nairobi",
      price_per_night: 12000,
      rating: 4.9,
      review_count: 18,
      amenities: [
        "wifi",
        "security",
        "study",
        "parking",
        "kitchen",
        "en-suite",
      ],
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
      ],
      is_verified: true,
      property_type: "single",
    },
  ];

  const displayAccommodations =
    accommodations.length > 0 ? accommodations : mockAccommodations;

  const sortOptions = [
    { value: "popular", label: "Most Popular" },
    { value: "price_asc", label: "Price: Low to High" },
    { value: "price_desc", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "newest", label: "Newest First" },
  ];

  return (
    <div className="accommodation-list-page">
      <FilterSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Page Header */}
      <div className="list-page-header">
        <div className="header-content">
          <h1 className="page-title">Find Student Accommodation</h1>
          <p className="page-subtitle">
            Discover verified hostels, apartments, and bedsitters near your
            campus
          </p>
        </div>

        {/* Quick Filters */}
        <div className="quick-filters">
          <button
            className={`filter-chip ${!filters.property_type ? "active" : ""}`}
            onClick={() => handleFilterChange("property_type", "")}
          >
            All Types
          </button>
          <button
            className={`filter-chip ${filters.property_type === "hostel" ? "active" : ""}`}
            onClick={() => handleFilterChange("property_type", "hostel")}
          >
            Hostels
          </button>
          <button
            className={`filter-chip ${filters.property_type === "bedsitter" ? "active" : ""}`}
            onClick={() => handleFilterChange("property_type", "bedsitter")}
          >
            Bedsitters
          </button>
          <button
            className={`filter-chip ${filters.property_type === "apartment" ? "active" : ""}`}
            onClick={() => handleFilterChange("property_type", "apartment")}
          >
            Apartments
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="list-toolbar">
        <div className="toolbar-left">
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(true)}
          >
            <SlidersHorizontal size={18} />
            Filters
            {(filters.location ||
              filters.property_type ||
              filters.min_price) && <span className="filter-badge">•</span>}
          </button>

          <div className="results-count">
            {displayAccommodations.length} properties found
          </div>
        </div>

        <div className="toolbar-right">
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              <Grid size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === "map" ? "active" : ""}`}
              onClick={() => setViewMode("map")}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
                <line x1="8" y1="2" x2="8" y2="18" />
                <line x1="16" y1="6" x2="16" y2="22" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters */}
      {(filters.location || filters.property_type || filters.min_price) && (
        <div className="active-filters-bar">
          <div className="active-filters-label">Active Filters:</div>
          <div className="active-filter-tags">
            {filters.location && (
              <span className="filter-tag">
                <X size={12} />
                {filters.location}
              </span>
            )}
            {filters.property_type && (
              <span className="filter-tag">
                <X size={12} />
                {filters.property_type}
              </span>
            )}
            {filters.min_price && (
              <span className="filter-tag">
                <X size={12} />
                From KSh {Number(filters.min_price).toLocaleString()}
              </span>
            )}
          </div>
          <button
            className="clear-all-btn"
            onClick={() => {
              dispatch(clearFilters());
              setSearchParams({});
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results */}
      <div className="list-content">
        {viewMode === "map" ? (
          <div className="map-view-container">
            <MapView accommodations={displayAccommodations} />
          </div>
        ) : (
          <div className={`results-grid ${viewMode}`}>
            {displayAccommodations.length > 0 ? (
              displayAccommodations.map((accommodation) => (
                <AccommodationCard
                  key={accommodation.id}
                  accommodation={accommodation}
                  layout={viewMode}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🏠</div>
                <h3>No accommodations found</h3>
                <p>Try adjusting your filters or search criteria</p>
                <button
                  className="reset-btn"
                  onClick={() => {
                    dispatch(clearFilters());
                    setSearchParams({});
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={pagination.page === 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </button>
          <div className="page-numbers">
            {Array.from(
              { length: Math.min(pagination.totalPages, 5) },
              (_, i) => i + 1,
            ).map((pageNum) => (
              <button
                key={pageNum}
                className={`page-num ${pagination.page === pageNum ? "active" : ""}`}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </button>
            ))}
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
    </div>
  );
};

export default AccommodationListPage;
