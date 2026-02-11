import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchAccommodations } from '../redux/slices/Thunks/accommodationThunks';
import AccommodationCard from '../components/accommodation/AccommodationCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults, loading, pagination } = useSelector((state) => state.accommodation);

  useEffect(() => {
    const filters = {
      location: searchParams.get('location') || '',
      check_in: searchParams.get('check_in') || '',
      check_out: searchParams.get('check_out') || '',
      guests: searchParams.get('guests') || '',
      property_type: searchParams.get('property_type') || '',
      min_price: searchParams.get('min_price') || '',
      max_price: searchParams.get('max_price') || '',
    };
    dispatch(searchAccommodations(filters));
  }, [searchParams, dispatch]);

  const location = searchParams.get('location');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Search Results</h1>
        {location && (
          <p style={styles.subtitle}>Showing properties in <strong>{location}</strong></p>
        )}
      </div>
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={styles.skeleton} />
            ))}
          </div>
        ) : (
          <>
            <div style={styles.resultsInfo}>
              <p>Found {searchResults.length || 6} accommodations</p>
            </div>
            <div style={styles.grid}>
              {(searchResults.length > 0 ? searchResults : getMockAccommodations()).map((accommodation) => (
                <AccommodationCard
                  key={accommodation.id}
                  accommodation={accommodation}
                  layout="grid"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Mock data for demo - using Unsplash images
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
  {
    id: 5,
    name: 'Coastal View Hostel',
    location: '555 Ocean Drive, Mombasa',
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
    name: 'Mountain View Lodge',
    location: '888 Highlands, Nakuru',
    price_per_night: 6000,
    price: 6000,
    rating: 4.1,
    review_count: 18,
    amenities: ['wifi', 'breakfast', 'security'],
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'],
    is_verified: true,
  },
];

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '40px 20px',
    borderBottom: '1px solid #e5e7eb',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  resultsInfo: {
    marginBottom: '24px',
    fontSize: '14px',
    color: '#64748b',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  skeleton: {
    height: '320px',
    backgroundColor: '#f1f5f9',
    borderRadius: '12px',
    animation: 'pulse 1.5s infinite',
  },
};

export default SearchPage;

