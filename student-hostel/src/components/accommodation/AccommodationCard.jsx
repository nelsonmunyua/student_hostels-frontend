import { useNavigate } from 'react-router-dom';
import { Heart, MapPin, Star, Wifi, Car, Coffee, BookOpen, Shield } from 'lucide-react';

const AccommodationCard = ({ accommodation, layout = 'grid' }) => {
  const navigate = useNavigate();
  
  const defaultImage = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800';
  const image = accommodation.images?.[0] || accommodation.image || defaultImage;

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: Wifi,
      parking: Car,
      breakfast: Coffee,
      study: BookOpen,
      security: Shield,
    };
    const Icon = icons[amenity?.toLowerCase()] || Wifi;
    return <Icon size={14} />;
  };

  const handleClick = () => {
    navigate(`/accommodations/${accommodation.id}`);
  };

  if (layout === 'list') {
    return (
      <div style={styles.listCard} onClick={handleClick}>
        <div style={styles.listImageContainer}>
          <img src={image} alt={accommodation.name} style={styles.listImage} />
          {accommodation.is_verified && <span style={styles.verifiedBadge}>Verified</span>}
        </div>
        <div style={styles.listContent}>
          <div style={styles.listHeader}>
            <h3 style={styles.listTitle}>{accommodation.name}</h3>
            {accommodation.rating > 0 && (
              <div style={styles.rating}>
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <span>{accommodation.rating}</span>
                <span style={styles.reviewCount}>({accommodation.review_count || 0})</span>
              </div>
            )}
          </div>
          <div style={styles.listLocation}>
            <MapPin size={14} color="#64748b" />
            <span>{accommodation.location}</span>
          </div>
          <div style={styles.listAmenities}>
            {accommodation.amenities?.slice(0, 4).map((amenity, idx) => (
              <span key={idx} style={styles.amenity}>
                {getAmenityIcon(amenity)}
                <span style={{ textTransform: 'capitalize' }}>{amenity}</span>
              </span>
            ))}
          </div>
          <div style={styles.listFooter}>
            <div style={styles.price}>
              <span style={styles.priceValue}>KSh {accommodation.price_per_night?.toLocaleString() || accommodation.price?.toLocaleString()}</span>
              <span style={styles.pricePeriod}>/night</span>
            </div>
            <button style={styles.viewButton}>View Details</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.gridCard} onClick={handleClick}>
      <div style={styles.gridImageContainer}>
        <img src={image} alt={accommodation.name} style={styles.gridImage} />
        <button 
          style={styles.wishlistButton}
          onClick={(e) => { e.stopPropagation(); }}
        >
          <Heart size={20} color="#fff" fill="none" />
        </button>
        {accommodation.is_verified && <span style={styles.verifiedBadge}>Verified</span>}
      </div>
      <div style={styles.gridContent}>
        <div style={styles.gridHeader}>
          <h3 style={styles.gridTitle}>{accommodation.name}</h3>
          {accommodation.rating > 0 && (
            <div style={styles.rating}>
              <Star size={14} color="#f59e0b" fill="#f59e0b" />
              <span>{accommodation.rating}</span>
            </div>
          )}
        </div>
        <div style={styles.gridLocation}>
          <MapPin size={14} color="#64748b" />
          <span>{accommodation.location}</span>
        </div>
        <div style={styles.gridAmenities}>
          {accommodation.amenities?.slice(0, 3).map((amenity, idx) => (
            <span key={idx} style={styles.amenity}>
              {getAmenityIcon(amenity)}
            </span>
          ))}
          {(accommodation.amenities?.length || 0) > 3 && (
            <span style={styles.moreAmenities}>+{accommodation.amenities.length - 3}</span>
          )}
        </div>
        <div style={styles.gridFooter}>
          <div style={styles.price}>
            <span style={styles.priceValue}>KSh {accommodation.price_per_night?.toLocaleString() || accommodation.price?.toLocaleString()}</span>
            <span style={styles.pricePeriod}>/night</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  // Grid layout styles
  gridCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  gridImageContainer: {
    position: 'relative',
    height: '200px',
  },
  gridImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  wishlistButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    padding: '8px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    border: 'none',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    padding: '4px 10px',
    backgroundColor: '#10b981',
    color: '#fff',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
  },
  gridContent: {
    padding: '16px',
  },
  gridHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  gridTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0,
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
  },
  reviewCount: {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: 400,
  },
  gridLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    color: '#64748b',
    marginBottom: '12px',
  },
  gridAmenities: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  amenity: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#64748b',
  },
  moreAmenities: {
    padding: '4px 8px',
    backgroundColor: '#f1f5f9',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#64748b',
  },
  gridFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '12px',
    borderTop: '1px solid #f1f5f9',
  },
  price: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  priceValue: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#1e293b',
  },
  pricePeriod: {
    fontSize: '14px',
    color: '#64748b',
  },
  
  // List layout styles
  listCard: {
    display: 'flex',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  listImageContainer: {
    position: 'relative',
    width: '280px',
    height: '200px',
    flexShrink: 0,
  },
  listImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  listContent: {
    flex: 1,
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
  },
  listHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  listTitle: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0,
  },
  listLocation: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '12px',
  },
  listAmenities: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  listFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: '1px solid #f1f5f9',
  },
  viewButton: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default AccommodationCard;

