import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchAccommodations } from "../redux/slices/Thunks/accommodationThunks";
import { setFilters, clearFilters } from "../redux/slices/accommodationSlice";
import {
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Home,
  DollarSign,
  Users,
  Star,
  Wifi,
  Coffee,
  Book,
  Car,
  Snowflake,
  Tv,
  WashingMachine,
  Shield,
  Zap,
  Droplets,
  Sparkles,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import PriceRangeSlider from "./PriceRangeSlider";
import "./FilterSidebar.css";

const FilterSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.accommodation);

  const [expandedSections, setExpandedSections] = useState({
    price: true,
    propertyType: true,
    location: false,
    guests: false,
    amenities: false,
    rating: false,
    distance: false,
  });

  const [activePresets, setActivePresets] = useState([]);

  // Property types
  const propertyTypes = [
    { value: "hostel", label: "Hostel", icon: "🏠" },
    { value: "bedsitter", label: "Bedsitter", icon: "🛏️" },
    { value: "apartment", label: "Apartment", icon: "🏢" },
    { value: "single", label: "Single Room", icon: "🚪" },
    { value: "shared", label: "Shared Room", icon: "👥" },
    { value: "studio", label: "Studio", icon: "🎨" },
  ];

  // Amenities list
  const amenitiesList = [
    { id: "wifi", label: "WiFi", icon: <Wifi size={16} /> },
    {
      id: "meals_included",
      label: "Meals Included",
      icon: <Coffee size={16} />,
    },
    { id: "study_room", label: "Study Room", icon: <Book size={16} /> },
    { id: "parking", label: "Parking", icon: <Car size={16} /> },
    {
      id: "air_conditioning",
      label: "Air Conditioning",
      icon: <Snowflake size={16} />,
    },
    { id: "tv", label: "TV", icon: <Tv size={16} /> },
    { id: "laundry", label: "Laundry", icon: <WashingMachine size={16} /> },
    { id: "security", label: "24/7 Security", icon: <Shield size={16} /> },
    { id: "power_backup", label: "Power Backup", icon: <Zap size={16} /> },
    {
      id: "water_supply",
      label: "Constant Water",
      icon: <Droplets size={16} />,
    },
    { id: "cleaning", label: "Cleaning Service", icon: <Sparkles size={16} /> },
    { id: "workspace", label: "Workspace", icon: <Briefcase size={16} /> },
  ];

  // Major locations
  const majorLocations = [
    "Nairobi",
    "Mombasa",
    "Kisumu",
    "Nakuru",
    "Eldoret",
    "Thika",
    "Malindi",
    "Kitale",
    "Garissa",
    "Nyeri",
    "Kericho",
    "Naivasha",
  ];

  // Universities for proximity search
  const universities = [
    "University of Nairobi",
    "Kenyatta University",
    "Jomo Kenyatta University",
    "Moi University",
    "Egerton University",
    "Maseno University",
    "Strathmore University",
    "Mount Kenya University",
  ];

  // Filter presets
  const filterPresets = [
    {
      id: "budget",
      label: "Budget Friendly",
      icon: "💰",
      description: "Under KES 10,000/month",
      action: () => {
        dispatch(setFilters({ min_price: 0, max_price: 10000 }));
        dispatch(
          searchAccommodations({ ...filters, min_price: 0, max_price: 10000 }),
        );
      },
    },
    {
      id: "rated",
      label: "Best Rated",
      icon: "⭐",
      description: "4+ stars",
      action: () => {
        dispatch(setFilters({ min_rating: 4 }));
        dispatch(searchAccommodations({ ...filters, min_rating: 4 }));
      },
    },
    {
      id: "near_campus",
      label: "Near Campus",
      icon: "🎓",
      description: "Within 2km",
      action: () => {
        dispatch(setFilters({ max_distance: 2 }));
        dispatch(searchAccommodations({ ...filters, max_distance: 2 }));
      },
    },
    {
      id: "all_inclusive",
      label: "All Inclusive",
      icon: "✨",
      description: "WiFi + Meals + Cleaning",
      action: () => {
        dispatch(setFilters({ amenities: "wifi,meals_included,cleaning" }));
        dispatch(
          searchAccommodations({
            ...filters,
            amenities: "wifi,meals_included,cleaning",
          }),
        );
      },
    },
  ];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const togglePreset = (presetId) => {
    setActivePresets((prev) =>
      prev.includes(presetId)
        ? prev.filter((id) => id !== presetId)
        : [...prev, presetId],
    );
  };

  const handlePropertyTypeChange = (type) => {
    const currentTypes = filters.property_type
      ? filters.property_type.split(",")
      : [];
    let newTypes;

    if (currentTypes.includes(type)) {
      newTypes = currentTypes.filter((t) => t !== type);
    } else {
      newTypes = [...currentTypes, type];
    }

    const newPropertyType = newTypes.join(",");
    dispatch(setFilters({ property_type: newPropertyType }));
    dispatch(
      searchAccommodations({ ...filters, property_type: newPropertyType }),
    );
  };

  const handleAmenityToggle = (amenityId) => {
    const currentAmenities = filters.amenities
      ? filters.amenities.split(",")
      : [];
    let newAmenities;

    if (currentAmenities.includes(amenityId)) {
      newAmenities = currentAmenities.filter((id) => id !== amenityId);
    } else {
      newAmenities = [...currentAmenities, amenityId];
    }

    const newAmenitiesString = newAmenities.join(",");
    dispatch(setFilters({ amenities: newAmenitiesString }));
    dispatch(
      searchAccommodations({ ...filters, amenities: newAmenitiesString }),
    );
  };

  const handleLocationChange = (location) => {
    dispatch(setFilters({ location }));
    dispatch(searchAccommodations({ ...filters, location }));
  };

  const handleGuestsChange = (num) => {
    dispatch(setFilters({ max_guests: num }));
    dispatch(searchAccommodations({ ...filters, max_guests: num }));
  };

  const handleRatingChange = (rating) => {
    dispatch(setFilters({ min_rating: rating }));
    dispatch(searchAccommodations({ ...filters, min_rating: rating }));
  };

  const handlePriceChange = (min, max) => {
    dispatch(setFilters({ min_price: min, max_price: max }));
    dispatch(
      searchAccommodations({ ...filters, min_price: min, max_price: max }),
    );
  };

  const handleDistanceChange = (distance) => {
    dispatch(setFilters({ max_distance: distance }));
    dispatch(searchAccommodations({ ...filters, max_distance: distance }));
  };

  const handleClearFilters = () => {
    setActivePresets([]);
    dispatch(clearFilters());
    dispatch(searchAccommodations({}));
  };

  const hasActiveFilters = () => {
    return (
      filters.location ||
      filters.property_type ||
      filters.min_price > 0 ||
      filters.max_price < 100000 ||
      filters.max_guests > 1 ||
      filters.amenities ||
      filters.min_rating > 0 ||
      filters.max_distance > 0
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.location) count++;
    if (filters.property_type) count++;
    if (filters.min_price > 0 || filters.max_price < 100000) count++;
    if (filters.max_guests > 1) count++;
    if (filters.amenities) count++;
    if (filters.min_rating > 0) count++;
    if (filters.max_distance > 0) count++;
    return count;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="filter-overlay" onClick={onClose} />}

      <aside className={`filter-sidebar ${isOpen ? "open" : ""}`}>
        <div className="filter-header">
          <div className="filter-title">
            <Filter size={20} />
            <h3>Filters</h3>
          </div>
          <button
            onClick={onClose}
            className="close-button"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters() && (
          <div className="active-filters">
            <div className="active-filters-header">
              <span>
                Active Filters
                {getActiveFilterCount() > 0 && (
                  <span className="filter-count-badge">
                    {getActiveFilterCount()}
                  </span>
                )}
              </span>
              <button onClick={handleClearFilters} className="clear-all">
                Clear All
              </button>
            </div>
            <div className="active-tags">
              {filters.location && (
                <span className="filter-tag">
                  <MapPin size={12} />
                  {filters.location}
                  <button onClick={() => handleLocationChange("")}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.property_type && (
                <span className="filter-tag">
                  <Home size={12} />
                  {filters.property_type}
                  <button
                    onClick={() => {
                      dispatch(setFilters({ property_type: "" }));
                      dispatch(
                        searchAccommodations({ ...filters, property_type: "" }),
                      );
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {(filters.min_price > 0 || filters.max_price < 100000) && (
                <span className="filter-tag">
                  <DollarSign size={12} />
                  KES {filters.min_price.toLocaleString()} -{" "}
                  {filters.max_price.toLocaleString()}
                  <button onClick={() => handlePriceChange(0, 100000)}>
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.amenities && (
                <span className="filter-tag">
                  <Sparkles size={12} />
                  {filters.amenities.split(",").length} amenities
                  <button
                    onClick={() => {
                      dispatch(setFilters({ amenities: "" }));
                      dispatch(
                        searchAccommodations({ ...filters, amenities: "" }),
                      );
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Filter Presets */}
        <div className="filter-presets">
          <p className="presets-title">Quick Presets</p>
          <div className="presets-grid">
            {filterPresets.map((preset) => (
              <button
                key={preset.id}
                className={`preset-card ${activePresets.includes(preset.id) ? "active" : ""}`}
                onClick={() => {
                  togglePreset(preset.id);
                  preset.action();
                }}
              >
                <span className="preset-icon">{preset.icon}</span>
                <span className="preset-label">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection("price")}
          >
            <div className="section-title">
              <DollarSign size={18} />
              <span>Price Range</span>
            </div>
            {expandedSections.price ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSections.price && (
            <div className="filter-section-content">
              <PriceRangeSlider
                min={0}
                max={100000}
                step={500}
                minPrice={filters.min_price || 0}
                maxPrice={filters.max_price || 100000}
                onChange={handlePriceChange}
              />
              <div className="price-labels">
                <span>KES {filters.min_price?.toLocaleString() || 0}</span>
                <span>KES {filters.max_price?.toLocaleString() || 100000}</span>
              </div>
              {/* Quick price buttons */}
              <div className="quick-price-buttons">
                <button
                  className="quick-price-btn"
                  onClick={() => handlePriceChange(0, 5000)}
                >
                  Under 5K
                </button>
                <button
                  className="quick-price-btn"
                  onClick={() => handlePriceChange(5000, 10000)}
                >
                  5K-10K
                </button>
                <button
                  className="quick-price-btn"
                  onClick={() => handlePriceChange(10000, 20000)}
                >
                  10K-20K
                </button>
                <button
                  className="quick-price-btn"
                  onClick={() => handlePriceChange(20000, 50000)}
                >
                  20K-50K
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Property Type Filter */}
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection("propertyType")}
          >
            <div className="section-title">
              <Home size={18} />
              <span>Property Type</span>
            </div>
            {expandedSections.propertyType ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSections.propertyType && (
            <div className="filter-section-content">
              <div className="property-types">
                {propertyTypes.map((type) => (
                  <label key={type.value} className="property-type-option">
                    <input
                      type="checkbox"
                      checked={
                        filters.property_type?.includes(type.value) || false
                      }
                      onChange={() => handlePropertyTypeChange(type.value)}
                    />
                    <span className="checkbox-custom"></span>
                    <span className="property-icon">{type.icon}</span>
                    <span className="property-label">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Amenities Filter */}
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection("amenities")}
          >
            <div className="section-title">
              <Sparkles size={18} />
              <span>Amenities</span>
            </div>
            {expandedSections.amenities ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSections.amenities && (
            <div className="filter-section-content">
              <div className="amenities-grid">
                {amenitiesList.map((amenity) => (
                  <button
                    key={amenity.id}
                    className={`amenity-btn ${filters.amenities?.includes(amenity.id) ? "active" : ""}`}
                    onClick={() => handleAmenityToggle(amenity.id)}
                  >
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span className="amenity-label">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rating Filter */}
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection("rating")}
          >
            <div className="section-title">
              <Star size={18} />
              <span>Rating</span>
            </div>
            {expandedSections.rating ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSections.rating && (
            <div className="filter-section-content">
              <div className="rating-options">
                {[5, 4, 3, 2].map((rating) => (
                  <button
                    key={rating}
                    className={`rating-option ${filters.min_rating === rating ? "active" : ""}`}
                    onClick={() => handleRatingChange(rating)}
                  >
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < rating ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="rating-text">{rating}+ Stars</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection("location")}
          >
            <div className="section-title">
              <MapPin size={18} />
              <span>Location / City</span>
            </div>
            {expandedSections.location ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSections.location && (
            <div className="filter-section-content">
              <div className="location-list">
                <button
                  className={`location-option ${!filters.location ? "active" : ""}`}
                  onClick={() => handleLocationChange("")}
                >
                  All Locations
                </button>
                {majorLocations.map((location) => (
                  <button
                    key={location}
                    className={`location-option ${filters.location === location ? "active" : ""}`}
                    onClick={() => handleLocationChange(location)}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Distance to University */}
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection("distance")}
          >
            <div className="section-title">
              <GraduationCap size={18} />
              <span>Distance to Campus</span>
            </div>
            {expandedSections.distance ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSections.distance && (
            <div className="filter-section-content">
              <div className="distance-options">
                <button
                  className={`distance-option ${!filters.max_distance ? "active" : ""}`}
                  onClick={() => handleDistanceChange(0)}
                >
                  Any Distance
                </button>
                {[1, 2, 3, 5, 10].map((km) => (
                  <button
                    key={km}
                    className={`distance-option ${filters.max_distance === km ? "active" : ""}`}
                    onClick={() => handleDistanceChange(km)}
                  >
                    Under {km} km
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Number of Guests Filter */}
        <div className="filter-section">
          <button
            className="filter-section-header"
            onClick={() => toggleSection("guests")}
          >
            <div className="section-title">
              <Users size={18} />
              <span>Guests / Roommates</span>
            </div>
            {expandedSections.guests ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </button>

          {expandedSections.guests && (
            <div className="filter-section-content">
              <div className="guests-selector">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    className={`guest-option ${filters.max_guests === num ? "active" : ""}`}
                    onClick={() => handleGuestsChange(num)}
                  >
                    {num}+
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Apply Filters Button (Mobile) */}
        <div className="filter-actions">
          <button onClick={handleClearFilters} className="clear-button">
            Clear All Filters
          </button>
        </div>
      </aside>
    </>
  );
};

export default FilterSidebar;
