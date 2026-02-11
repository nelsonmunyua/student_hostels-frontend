import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Star,
  TrendingUp,
  Shield,
  Award,
  Users,
  Calendar,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import AccommodationCard from "../components/accommodation/AccommodationCard";
import { fetchFeaturedAccommodations } from "../redux/slices/Thunks/accommodationThunks";
import { setFilters } from "../redux/slices/accommodationSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { featuredAccommodations, filters } = useSelector(
    (state) => state.accommodation,
  );
  const guestDropdownRef = useRef(null);

  const [searchData, setSearchData] = useState({
    location: filters.location || "",
    checkIn: filters.check_in || "",
    checkOut: filters.check_out || "",
    guests: filters.guests || 1,
  });

  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchFeaturedAccommodations());

    // Close dropdown when clicking outside
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
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Update Redux filters
    dispatch(
      setFilters({
        location: searchData.location,
        check_in: searchData.checkIn,
        check_out: searchData.checkOut,
        guests: searchData.guests,
      }),
    );

    const params = new URLSearchParams();
    if (searchData.location) params.append("location", searchData.location);
    if (searchData.checkIn) params.append("check_in", searchData.checkIn);
    if (searchData.checkOut) params.append("check_out", searchData.checkOut);
    if (searchData.guests && searchData.guests > 1)
      params.append("guests", searchData.guests);

    navigate(`/search?${params.toString()}`);
  };

  const handleGuestChange = (num) => {
    setSearchData({ ...searchData, guests: num });
    setShowGuestDropdown(false);
  };

  const clearCheckIn = () => {
    setSearchData({ ...searchData, checkIn: "" });
  };

  const clearCheckOut = () => {
    setSearchData({ ...searchData, checkOut: "" });
  };

  const clearLocation = () => {
    setSearchData({ ...searchData, location: "" });
  };

  const getMinCheckoutDate = () => {
    if (!searchData.checkIn) return "";
    const nextDay = new Date(searchData.checkIn);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split("T")[0];
  };

  const popularDestinations = [
    {
      name: "Nairobi",
      image:
        "https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400",
      count: 45,
    },
    {
      name: "Mombasa",
      image:
        "https://images.unsplash.com/photo-1590508794514-f2a3c8b8edd4?w=400",
      count: 32,
    },
    {
      name: "Kisumu",
      image: "https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=400",
      count: 28,
    },
    {
      name: "Nakuru",
      image:
        "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400",
      count: 21,
    },
  ];

  const handleDestinationError = (e, index) => {
    e.target.onerror = null;
    e.target.src = getFallbackImage(index + 100);
  };

  const features = [
    {
      icon: Shield,
      title: "Verified Properties",
      description: "All listings are verified for quality and safety",
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Competitive rates and no hidden fees",
    },
    {
      icon: TrendingUp,
      title: "Instant Booking",
      description: "Book and confirm instantly online",
    },
  ];

  const guestOptions = [
    { value: 1, label: "1 Guest" },
    { value: 2, label: "2 Guests" },
    { value: 3, label: "3 Guests" },
    { value: 4, label: "4 Guests" },
    { value: 5, label: "5+ Guests" },
  ];

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Find Your Perfect Student Home</h1>
          <p style={styles.heroSubtitle}>
            Discover comfortable and affordable accommodations near your campus
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} style={styles.searchForm}>
            {/* Location Input */}
            <div style={styles.searchRow}>
              <div style={styles.searchInputGroupLarge}>
                <MapPin size={20} color="#64748b" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  value={searchData.location}
                  onChange={(e) =>
                    setSearchData({ ...searchData, location: e.target.value })
                  }
                  style={styles.searchInput}
                />
                {searchData.location && (
                  <button
                    type="button"
                    onClick={clearLocation}
                    style={styles.clearBtn}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Date and Guest Inputs */}
            <div style={styles.searchRow}>
              <div style={styles.searchInputGroup}>
                <Calendar size={18} color="#64748b" />
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) =>
                    setSearchData({ ...searchData, checkIn: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  style={styles.searchInput}
                  placeholder="Check-in"
                />
                {searchData.checkIn && (
                  <button
                    type="button"
                    onClick={clearCheckIn}
                    style={styles.clearBtnSmall}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div style={styles.searchInputGroup}>
                <Calendar size={18} color="#64748b" />
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) =>
                    setSearchData({ ...searchData, checkOut: e.target.value })
                  }
                  min={getMinCheckoutDate()}
                  style={styles.searchInput}
                  placeholder="Check-out"
                  disabled={!searchData.checkIn}
                />
                {searchData.checkOut && (
                  <button
                    type="button"
                    onClick={clearCheckOut}
                    style={styles.clearBtnSmall}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Guest Selector Dropdown */}
              <div style={styles.searchInputGroup} ref={guestDropdownRef}>
                <Users size={18} color="#64748b" />
                <button
                  type="button"
                  style={styles.guestButton}
                  onClick={() => setShowGuestDropdown(!showGuestDropdown)}
                >
                  {searchData.guests} Guest{searchData.guests > 1 ? "s" : ""}
                </button>
                <span style={styles.dropdownArrow}>▼</span>

                {showGuestDropdown && (
                  <div style={styles.guestDropdown}>
                    {guestOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        style={{
                          ...styles.guestOption,
                          ...(searchData.guests === option.value
                            ? styles.guestOptionActive
                            : {}),
                        }}
                        onClick={() => handleGuestChange(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" style={styles.searchButton}>
              <Search size={20} />
              Search
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.sectionContainer}>
          <div style={styles.features}>
            {features.map((feature, index) => (
              <div key={index} style={styles.featureCard}>
                <div style={styles.featureIcon}>
                  <feature.icon size={32} color="#3b82f6" />
                </div>
                <h3 style={styles.featureTitle}>{feature.title}</h3>
                <p style={styles.featureDescription}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Accommodations */}
      <section style={styles.section}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Featured Accommodations</h2>
              <p style={styles.sectionSubtitle}>
                Handpicked places just for you
              </p>
            </div>
            <button
              style={styles.viewAllButton}
              onClick={() => navigate("/accommodations")}
            >
              View All
            </button>
          </div>

          <div style={styles.accommodationGrid}>
            {(featuredAccommodations.length > 0
              ? featuredAccommodations.slice(0, 4)
              : getMockAccommodations()
            ).map((accommodation) => (
              <AccommodationCard
                key={accommodation.id}
                accommodation={accommodation}
                layout="grid"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section style={styles.section}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Popular Destinations</h2>
              <p style={styles.sectionSubtitle}>
                Explore student-friendly cities
              </p>
            </div>
          </div>

          <div style={styles.destinationsGrid}>
            {popularDestinations.map((destination, index) => (
              <div
                key={index}
                style={styles.destinationCard}
                onClick={() => navigate(`/search?location=${destination.name}`)}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  style={styles.destinationImage}
                  onError={(e) => handleDestinationError(e, index)}
                />
                <div style={styles.destinationOverlay}>
                  <h3 style={styles.destinationName}>{destination.name}</h3>
                  <p style={styles.destinationCount}>
                    {destination.count} properties
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to Find Your Home?</h2>
          <p style={styles.ctaSubtitle}>
            Join thousands of students who found their perfect accommodation
          </p>
          <div style={styles.ctaButtons}>
            <button
              style={styles.ctaPrimaryButton}
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
            <button
              style={styles.ctaSecondaryButton}
              onClick={() => navigate("/accommodations")}
            >
              Browse Listings
            </button>
          </div>
        </div>
      </section>
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
    amenities: ["wifi", "security", "parking"],
    images: [
      "https://images.unsplash.com/photo-1590508794514-f2a3c8b8edd4?w=800&q=80",
    ],
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
    amenities: ["wifi", "breakfast", "security"],
    images: [
      "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80",
    ],
    is_verified: true,
  },
];

const getFallbackImage = (index) => {
  const images = [
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400",
    "https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=400",
    "https://images.unsplash.com/photo-1590508794514-f2a3c8b8edd4?w=400",
    "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=400",
  ];
  return images[index % images.length];
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#ffffff",
  },
  hero: {
    position: "relative",
    height: "600px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  heroContent: {
    position: "relative",
    zIndex: 1,
    textAlign: "center",
    color: "#ffffff",
    padding: "0 20px",
    maxWidth: "900px",
  },
  heroTitle: {
    fontSize: "48px",
    fontWeight: 700,
    marginBottom: "16px",
    lineHeight: "1.2",
  },
  heroSubtitle: {
    fontSize: "20px",
    marginBottom: "40px",
    opacity: 0.9,
  },
  searchForm: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 10px 40px rgba(0, 0, 0, 0.1)",
  },
  searchRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    margin: "12px 0",
  },
  searchInputGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    position: "relative",
  },
  searchInputGroupLarge: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    position: "relative",
    width: "100%",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "transparent",
    color: "#334155",
  },
  clearBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    padding: "4px",
  },
  clearBtnSmall: {
    position: "absolute",
    right: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#94a3b8",
    display: "flex",
    alignItems: "center",
    padding: "2px",
  },
  guestButton: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "transparent",
    color: "#334155",
    cursor: "pointer",
    textAlign: "left",
    padding: "0",
  },
  dropdownArrow: {
    fontSize: "10px",
    color: "#94a3b8",
    marginLeft: "4px",
  },
  guestDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    marginTop: "4px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    zIndex: 100,
    overflow: "hidden",
  },
  guestOption: {
    width: "100%",
    padding: "12px 16px",
    border: "none",
    backgroundColor: "transparent",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    color: "#334155",
    transition: "background-color 0.2s",
  },
  guestOptionActive: {
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
  },
  searchButton: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "all 0.2s",
    marginTop: "8px",
  },
  featuresSection: {
    padding: "60px 0",
    backgroundColor: "#f8fafc",
  },
  sectionContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "32px",
  },
  featureCard: {
    textAlign: "center",
    padding: "32px 24px",
  },
  featureIcon: {
    width: "80px",
    height: "80px",
    margin: "0 auto 20px",
    backgroundColor: "#eff6ff",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "8px",
  },
  featureDescription: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
  },
  section: {
    padding: "80px 0",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "8px",
  },
  sectionSubtitle: {
    fontSize: "16px",
    color: "#64748b",
  },
  viewAllButton: {
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  accommodationGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  loadingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "24px",
  },
  skeleton: {
    height: "320px",
    backgroundColor: "#f1f5f9",
    borderRadius: "12px",
    animation: "pulse 1.5s infinite",
  },
  destinationsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },
  destinationCard: {
    position: "relative",
    height: "240px",
    borderRadius: "12px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "transform 0.3s",
  },
  destinationImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  destinationOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "24px",
    background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
    color: "#ffffff",
  },
  destinationName: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "4px",
  },
  destinationCount: {
    fontSize: "14px",
    opacity: 0.9,
  },
  ctaSection: {
    padding: "80px 20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
  },
  ctaContent: {
    maxWidth: "800px",
    margin: "0 auto",
    textAlign: "center",
  },
  ctaTitle: {
    fontSize: "40px",
    fontWeight: 700,
    marginBottom: "16px",
  },
  ctaSubtitle: {
    fontSize: "18px",
    marginBottom: "32px",
    opacity: 0.9,
  },
  ctaButtons: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  ctaPrimaryButton: {
    padding: "16px 32px",
    backgroundColor: "#ffffff",
    color: "#667eea",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },
  ctaSecondaryButton: {
    padding: "16px 32px",
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "2px solid #ffffff",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default Home;
