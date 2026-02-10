import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal } from 'lucide-react';
import { searchAccommodations } from '../redux/slices/Thunks/accommodationThunks';
import AccommodationCard from '../components/accommodation/AccommodationCard';

const AccommodationListPage = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const { searchResults, loading, pagination } = useSelector((state) => state.accommodation);
  
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    property_type: '',
    min_price: '',
    max_price: '',
  });

  useEffect(() => {
    const filterParams = {
      location: searchParams.get('location') || '',
      check_in: searchParams.get('check_in') || '',
      check_out: searchParams.get('check_out') || '',
      guests: searchParams.get('guests') || '',
      property_type: filters.property_type,
      min_price: filters.min_price,
      max_price: filters.max_price,
    };
    dispatch(searchAccommodations(filterParams));
  }, [searchParams, filters, dispatch]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Student Accommodations</h1>
        <p style={styles.subtitle}>Find your perfect home away from home</p>
      </div>

      <div style={styles.main}>
        <button
          style={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={20} />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>

        <div style={styles.content}>
          {/* Filters Sidebar */}
          {showFilters && (
            <aside style={styles.filtersPanel}>
              <h3 style={styles.filterTitle}>Filters</h3>
              
              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Property Type</label>
                <select
                  value={filters.property_type}
                  onChange={(e) => handleFilterChange('property_type', e.target.value)}
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
                  onChange={(e) => handleFilterChange('min_price', e.target.value)}
                  style={styles.filterInput}
                />
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.filterLabel}>Max Price (KSh)</label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={filters.max_price}
                  onChange={(e) => handleFilterChange('max_price', e.target.value)}
                  style={styles.filterInput}
                />
              </div>
            </aside>
          )}

          {/* Results */}
          <div style={styles.resultsSection}>
            {loading ? (
              <div style={styles.loadingGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} style={styles.skeleton} />
                ))}
              </div>
            ) : (
              <>
                <div style={styles.resultsInfo}>
                  <p>Showing {searchResults.length || 6} accommodations</p>
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
      </div>
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
    property_type: 'single',
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
    property_type: 'bed_sitter',
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
    property_type: 'double',
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
    property_type: 'studio',
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
    images: ['https://images.unsplash.com/photo-1590508794514-f2a3c8b8edd4?w=800'],
    is_verified: true,
    property_type: 'single',
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
    images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'],
    is_verified: true,
    property_type: 'bed_sitter',
  },
];

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '40px 20px',
    textAlign: 'center',
  },
  title: {
    fontSize: '36px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '8px',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 20px',
  },
  filterToggle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    marginBottom: '24px',
  },
  content: {
    display: 'flex',
    gap: '32px',
  },
  filtersPanel: {
    width: '280px',
    flexShrink: 0,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e5e7eb',
    height: 'fit-content',
    position: 'sticky',
    top: '20px',
  },
  filterTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #e5e7eb',
  },
  filterGroup: {
    marginBottom: '20px',
  },
  filterLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '8px',
  },
  filterSelect: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#fff',
  },
  filterInput: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
  },
  resultsSection: {
    flex: 1,
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

export default AccommodationListPage;

