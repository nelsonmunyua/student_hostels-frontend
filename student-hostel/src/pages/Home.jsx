import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, TrendingUp, Shield, Award } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import AccommodationCard from '../components/accommodation/AccommodationCard';
import { fetchFeaturedAccommodations } from '../redux/slices/Thunks/accommodationThunks';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { featuredAccommodations, loading } = useSelector((state) => state.accommodation);
  
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  useEffect(() => {
    dispatch(fetchFeaturedAccommodations());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.checkIn) params.append('check_in', searchData.checkIn);
    if (searchData.checkOut) params.append('check_out', searchData.checkOut);
    if (searchData.guests) params.append('guests', searchData.guests);
    
    navigate(`/search?${params.toString()}`);
  };

  const popularDestinations = [
    { name: 'Nairobi', image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=400', count: 45 },
    { name: 'Mombasa', image: 'https://images.unsplash.com/photo-1590508794514-f2a3c8b8edd4?w=400', count: 32 },
    { name: 'Kisumu', image: 'https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=400', count: 28 },
    { name: 'Nakuru', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=400', count: 21 },
  ];

  const features = [
    { icon: Shield, title: 'Verified Properties', description: 'All listings are verified for quality and safety' },
    { icon: Award, title: 'Best Prices', description: 'Competitive rates and no hidden fees' },
    { icon: TrendingUp, title: 'Instant Booking', description: 'Book and confirm instantly online' },
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
            <div style={styles.searchInputGroup}>
              <MapPin size={20} color="#64748b" />
              <input
                type="text"
                placeholder="Where are you going?"
                value={searchData.location}
                onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.searchRow}>
              <div style={styles.searchInputGroup}>
                <input
                  type="date"
                  value={searchData.checkIn}
                  onChange={(e) => setSearchData({ ...searchData, checkIn: e.target.value })}
                  style={styles.searchInput}
                  placeholder="Check-in"
                />
              </div>

              <div style={styles.searchInputGroup}>
                <input
                  type="date"
                  value={searchData.checkOut}
                  onChange={(e) => setSearchData({ ...searchData, checkOut: e.target.value })}
                  style={styles.searchInput}
                  placeholder="Check-out"
                />
              </div>

              <div style={styles.searchInputGroup}>
                <select
                  value={searchData.guests}
                  onChange={(e) => setSearchData({ ...searchData, guests: e.target.value })}
                  style={styles.searchInput}
                >
                  <option value={1}>1 Guest</option>
                  <option value={2}>2 Guests</option>
                  <option value={3}>3 Guests</option>
                  <option value={4}>4+ Guests</option>
                </select>
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
              <p style={styles.sectionSubtitle}>Handpicked places just for you</p>
            </div>
            <button
              style={styles.viewAllButton}
              onClick={() => navigate('/accommodations')}
            >
              View All
            </button>
          </div>

          {loading ? (
            <div style={styles.loadingGrid}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={styles.skeleton} />
              ))}
            </div>
          ) : (
            <div style={styles.accommodationGrid}>
              {(featuredAccommodations.length > 0 ? featuredAccommodations.slice(0, 4) : getMockAccommodations()).map((accommodation) => (
                <AccommodationCard
                  key={accommodation.id}
                  accommodation={accommodation}
                  layout="grid"
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section style={styles.section}>
        <div style={styles.sectionContainer}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Popular Destinations</h2>
              <p style={styles.sectionSubtitle}>Explore student-friendly cities</p>
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
              onClick={() => navigate('/signup')}
            >
              Get Started
            </button>
            <button
              style={styles.ctaSecondaryButton}
              onClick={() => navigate('/accommodations')}
            >
              Browse Listings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// Mock data for demo
const getMockAccommodations = () => [
  {
    id: 1,
    name: 'University View Hostel',
    location: '123 College Ave, Nairobi',
    price_per_night: 8500,
    price: 8500,
    rating: 4.5,
    review_count: 28,
    amenities: ['wifi', 'security', 'study', 'parking'],
    images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
    is_verified: true,
  },
  {
    id: 2,
    name: 'Central Student Living',
    location: '456 Main Street, Nairobi',
    price_per_night: 6500,
    price: 6500,
    rating: 4.2,
    review_count: 15,
    amenities: ['wifi', 'breakfast', 'security'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    is_verified: true,
  },
  {
    id: 3,
    name: 'Green Valley Hostel',
    location: '789 Park Road, Nairobi',
    price_per_night: 5500,
    price: 5500,
    rating: 4.0,
    review_count: 42,
    amenities: ['wifi', 'parking', 'security'],
    images: ['https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800'],
    is_verified: false,
  },
  {
    id: 4,
    name: 'Lakeside Accommodation',
    location: '321 Lake View, Kisumu',
    price_per_night: 7500,
    price: 7500,
    rating: 4.8,
    review_count: 12,
    amenities: ['wifi', 'security', 'study', 'parking'],
    images: ['https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=800'],
    is_verified: true,
  },
];

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
  },
  hero: {
    position: 'relative',
    height: '600px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  heroContent: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    color: '#ffffff',
    padding: '0 20px',
    maxWidth: '900px',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 700,
    marginBottom: '16px',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '20px',
    marginBottom: '40px',
    opacity: 0.9,
  },
  searchForm: {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  },
  searchInputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  searchRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    margin: '12px 0',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    fontSize: '14px',
    backgroundColor: 'transparent',
    color: '#334155',
  },
  searchButton: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s',
  },
  featuresSection: {
    padding: '60px 0',
    backgroundColor: '#f8fafc',
  },
  sectionContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '32px',
  },
  featureCard: {
    textAlign: 'center',
    padding: '32px 24px',
  },
  featureIcon: {
    width: '80px',
    height: '80px',
    margin: '0 auto 20px',
    backgroundColor: '#eff6ff',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: '20px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '8px',
  },
  featureDescription: {
    fontSize: '14px',
    color: '#64748b',
    lineHeight: '1.6',
  },
  section: {
    padding: '80px 0',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '8px',
  },
  sectionSubtitle: {
    fontSize: '16px',
    color: '#64748b',
  },
  viewAllButton: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  accommodationGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  skeleton: {
    height: '320px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    animation: 'pulse 1.5s infinite',
  },
  destinationsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
  },
  destinationCard: {
    position: 'relative',
    height: '240px',
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  destinationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '24px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
    color: '#ffffff',
  },
  destinationName: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  destinationCount: {
    fontSize: '14px',
    opacity: 0.9,
  },
  ctaSection: {
    padding: '80px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#ffffff',
  },
  ctaContent: {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center',
  },
  ctaTitle: {
    fontSize: '40px',
    fontWeight: 700,
    marginBottom: '16px',
  },
  ctaSubtitle: {
    fontSize: '18px',
    marginBottom: '32px',
    opacity: 0.9,
  },
  ctaButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  ctaPrimaryButton: {
    padding: '16px 32px',
    backgroundColor: '#ffffff',
    color: '#667eea',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  ctaSecondaryButton: {
    padding: '16px 32px',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '2px solid #ffffff',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default Home;

