import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  MapPin,
  Filter,
  Grid,
  List,
  X,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { searchAccommodations } from "../redux/slices/Thunks/accommodationThunks";
import { setFilters, clearFilters } from "../redux/slices/accommodationSlice";
import AccommodationCard from "../components/accommodation/AccommodationCard";
import FilterSidebar from "../search/FilterSidebar";
import MapView from "../search/MapView";
import "./SearchPage.css";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults, pagination, filters, searchLoading } = useSelector(
    (state) => state.accommodation,
  );

  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [localSearch, setLocalSearch] = useState(
    searchParams.get("location") || filters.location || "",
  );

  // Date and guest states
  const [checkIn, setCheckIn] = useState(
    searchParams.get("check_in") || filters.check_in || "",
  );
  const [checkOut, setCheckOut] = useState(
    searchParams.get("check_out") || filters.check_out || "",
  );
  const [guests, setGuests] = useState(
    parseInt(searchParams.get("guests")) || filters.guests || 1,
  );
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const guestDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target)
      ) {
        setShowGuestDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const initialFilters = {
      query: searchParams.get("query") || localSearch || filters.query || "",
      location: searchParams.get("location") || filters.location || "",
      check_in: searchParams.get("check_in") || filters.check_in || "",
      check_out: searchParams.get("check_out") || filters.check_out || "",
      guests: parseInt(searchParams.get("guests")) || filters.guests || 1,
      property_type:
        searchParams.get("property_type") || filters.property_type || "",
      min_price: searchParams.get("min_price") || filters.min_price || 0,
      max_price: searchParams.get("max_price") || filters.max_price || 100000,
      amenities: searchParams.get("amenities") || filters.amenities || "",
      min_rating:
        parseInt(searchParams.get("min_rating")) || filters.min_rating || 0,
      max_distance:
        parseInt(searchParams.get("max_distance")) || filters.max_distance || 0,
    };

    // Set filters in Redux
    dispatch(setFilters(initialFilters));

    // Perform search
    dispatch(searchAccommodations(initialFilters));
  }, [searchParams, dispatch, localSearch, filters.query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);

    if (localSearch) {
      params.set("location", localSearch);
    } else {
      params.delete("location");
    }

    if (checkIn) {
      params.set("check_in", checkIn);
    } else {
      params.delete("check_in");
    }

    if (checkOut) {
      params.set("check_out", checkOut);
    } else {
      params.delete("check_out");
    }

    if (guests > 1) {
      params.set("guests", guests.toString());
    } else {
      params.delete("guests");
    }

    setSearchParams(params);
  };

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

  const handleClearFilters = () => {
    dispatch(clearFilters());
    const params = new URLSearchParams();
    setLocalSearch("");
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setSearchParams(params);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.property_type) count++;
    if (filters.min_price > 0 || filters.max_price < 100000) count++;
    if (filters.guests > 1) count++;
    if (filters.amenities) count++;
    if (filters.min_rating > 0) count++;
    if (filters.max_distance > 0) count++;
    if (filters.check_in || filters.check_out) count++;
    return count;
  };

  const handleGuestChange = (num) => {
    setGuests(num);
    const params = new URLSearchParams(searchParams);
    if (num > 1) {
      params.set("guests", num.toString());
    } else {
      params.delete("guests");
    }
    setSearchParams(params);
    dispatch(setFilters({ guests: num }));
  };

  const clearCheckIn = () => {
    setCheckIn("");
    const params = new URLSearchParams(searchParams);
    params.delete("check_in");
    setSearchParams(params);
    dispatch(setFilters({ check_in: "" }));
  };

  const clearCheckOut = () => {
    setCheckOut("");
    const params = new URLSearchParams(searchParams);
    params.delete("check_out");
    setSearchParams(params);
    dispatch(setFilters({ check_out: "" }));
  };

  const clearLocationSearch = () => {
    setLocalSearch("");
    const params = new URLSearchParams(searchParams);
    params.delete("location");
    setSearchParams(params);
    dispatch(setFilters({ location: "" }));
  };

  const getMinCheckoutDate = () => {
    if (!checkIn) return "";
    const nextDay = new Date(checkIn);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split("T")[0];
  };

  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const guestOptions = [
    { value: 1, label: "1 Guest" },
    { value: 2, label: "2 Guests" },
    { value: 3, label: "3 Guests" },
    { value: 4, label: "4 Guests" },
    { value: 5, label: "5 Guests" },
    { value: 6, label: "6+ Guests" },
  ];

  const location = searchParams.get("location");
  const activeFiltersCount = getActiveFilterCount();

  return (
    <div className="search-page">
      <FilterSidebar
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
      />

      {/* Search Header */}
      <div className="search-header">
        <div className="search-header-content">
          <h1 className="search-title">Find Your Perfect Student Home</h1>
          <p className="search-subtitle">
            Browse verified accommodations near your campus
          </p>

          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearch} className="search-bar-form">
            <div className="search-inputs-row">
              {/* Location Input */}
              <div className="search-input-group-large">
                <MapPin size={20} color="#64748b" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  className="search-input"
                />
                {localSearch && (
                  <button
                    type="button"
                    onClick={clearLocationSearch}
                    className="clear-btn"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Check-in Date */}
              <div className="search-input-group">
                <Calendar size={18} color="#64748b" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  min={getTodayDate()}
                  className="search-input"
                  placeholder="Check-in"
                />
                {checkIn && (
                  <button
                    type="button"
                    onClick={clearCheckIn}
                    className="clear-btn-small"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Check-out Date */}
              <div className="search-input-group">
                <Calendar size={18} color="#64748b" />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={getMinCheckoutDate()}
                  className="search-input"
                  placeholder="Check-out"
                  disabled={!checkIn}
                />
                {checkOut && (
                  <button
                    type="button"
                    onClick={clearCheckOut}
                    className="clear-btn-small"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Guest Selector */}
              <div className="search-input-group" ref={guestDropdownRef}>
                <Users size={18} color="#64748b" />
                <button
                  type="button"
                  className="guest-button"
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                >
                  {guests} Guest{guests > 1 ? "s" : ""}
                </button>
                <span className="dropdown-arrow">▼</span>

                {showGuestDropdown && (
                  <div className="guest-dropdown">
                    {guestOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`guest-option ${guests === option.value ? "active" : ""}`}
                        onClick={() => handleGuestChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button type="submit" className="search-submit-btn">
                <Search size={20} />
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* View Controls */}
      <div className="view-controls">
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <Grid size={18} />
            Grid
          </button>
          <button
            className={`view-btn ${viewMode === "list" ? "active" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <List size={18} />
            List
          </button>
          <button
            className={`view-btn ${viewMode === "map" ? "active" : ""}`}
            onClick={() => setViewMode("map")}
          >
            <MapPin size={18} />
            Map
          </button>
        </div>

        <div className="filter-toggle">
          <button
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="filter-count">{activeFiltersCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="search-content">
        <div className={`search-layout ${showFilters ? "open" : ""}`}>
          {/* Filter Sidebar Container */}
          <div
            className={`filter-sidebar-container ${showFilters ? "open" : ""}`}
          >
            <FilterSidebar
              isOpen={showFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>

          {/* Results Container */}
          <div className="results-container">
            {showFilters && (
              <div
                className="filter-overlay"
                onClick={() => setShowFilters(false)}
              />
            )}

            {viewMode === "map" ? (
              <div className="map-view-container">
                <MapView
                  accommodations={
                    searchResults.length > 0
                      ? searchResults
                      : getMockAccommodations()
                  }
                />
              </div>
            ) : (
              <div className={`results-grid ${viewMode}`}>
                {(searchResults.length > 0
                  ? searchResults
                  : getMockAccommodations()
                ).map((accommodation) => (
                  <AccommodationCard
                    key={accommodation.id}
                    accommodation={accommodation}
                    layout={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Loading State */}
            {searchLoading && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Searching for accommodations...</p>
              </div>
            )}

            {/* Empty State */}
            {searchResults.length === 0 && !searchLoading && (
              <div className="empty-state">
                <div className="empty-icon">🏠</div>
                <h3>No accommodations found</h3>
                <p>Try adjusting your search criteria or filters</p>
                {activeFiltersCount > 0 && (
                  <button
                    className="clear-filters-btn large"
                    onClick={handleClearFilters}
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={pagination.page === 1}
            onClick={() => handleFilterChange("page", pagination.page - 1)}
          >
            Previous
          </button>
          <span className="page-info">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            className="page-btn"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => handleFilterChange("page", pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Mock data for demo - using Unsplash images
const getMockAccommodations = () => [
  {
    id: 1,
    name: "University View Hostel",
    location: "123 College Ave, Nairobi",
    price_per_night: 8500,
    price: 8500,
    rating: 4.5,
    review_count: 28,
    amenities: ["wifi", "security", "study", "parking"],
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
    ],
    is_verified: true,
  },
  {
    id: 2,
    name: "Central Student Living",
    location: "456 Main Street, Nairobi",
    price_per_night: 6500,
    price: 6500,
    rating: 4.2,
    review_count: 15,
    amenities: ["wifi", "breakfast", "security"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    ],
    is_verified: true,
  },
  {
    id: 3,
    name: "Green Valley Hostel",
    location: "789 Park Road, Nairobi",
    price_per_night: 5500,
    price: 5500,
    rating: 4.0,
    review_count: 42,
    amenities: ["wifi", "parking", "security"],
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
    ],
    is_verified: false,
  },
  {
    id: 4,
    name: "Lakeside Accommodation",
    location: "321 Lake View, Kisumu",
    price_per_night: 7500,
    price: 7500,
    rating: 4.8,
    review_count: 12,
    amenities: ["wifi", "security", "study", "parking"],
    images: [
      "https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=800&q=80",
    ],
    is_verified: true,
  },
  {
    id: 5,
    name: "Coastal View Hostel",
    location: "555 Ocean Drive, Mombasa",
    price_per_night: 7000,
    price: 7000,
    rating: 4.3,
    review_count: 20,
    amenities: ['wifi', 'security', 'parking'],
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
    is_verified: true,
  },
  {
    id: 6,
    name: "Mountain View Lodge",
    location: "888 Highlands, Nakuru",
    price_per_night: 6000,
    price: 6000,
    rating: 4.1,
    review_count: 18,
    amenities: ['wifi', 'breakfast', 'security'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    is_verified: true,
  },
  {
    id: 7,
    name: "Urban Studio Apartments",
    location: "555 Innovation Ave, Nairobi",
    price_per_night: 9500,
    price: 9500,
    rating: 4.6,
    review_count: 35,
    amenities: ["wifi", "security", "study", "parking", "kitchen"],
    images: [
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
    ],
    is_verified: true,
  },
  {
    id: 8,
    name: "Campus Edge Shared Living",
    location: "222 University Road, Nairobi",
    price_per_night: 4500,
    price: 4500,
    rating: 4.2,
    review_count: 52,
    amenities: ["wifi", "security", "study", "laundry"],
    images: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    ],
    is_verified: true,
  },
];

export default SearchPage;
