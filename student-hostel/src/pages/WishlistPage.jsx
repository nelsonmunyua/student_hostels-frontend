import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Heart } from 'lucide-react';
import { fetchWishlist } from '../redux/slices/Thunks/wishlistThunks';
import AccommodationCard from '../components/accommodation/AccommodationCard';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (!loading && items.length === 0) {
    return (
      <div style={styles.empty}>
        <Heart size={64} color="#e5e7eb" />
        <h2 style={styles.emptyTitle}>Your wishlist is empty</h2>
        <p style={styles.emptyText}>Start adding accommodations to your wishlist</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Wishlist</h1>
        <p style={styles.subtitle}>{items.length} saved accommodation{items.length !== 1 ? 's' : ''}</p>
      </div>
      <div style={styles.content}>
        {loading ? (
          <div style={styles.loadingGrid}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={styles.skeleton} />
            ))}
          </div>
        ) : (
          <div style={styles.grid}>
            {items.map((item) => (
              <AccommodationCard
                key={item.id}
                accommodation={{
                  ...item,
                  id: item.accommodation_id || item.hostel_id,
                }}
                layout="grid"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

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
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
  },
  emptyTitle: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#1e293b',
  },
  emptyText: {
    fontSize: '16px',
    color: '#64748b',
  },
};

export default WishlistPage;

