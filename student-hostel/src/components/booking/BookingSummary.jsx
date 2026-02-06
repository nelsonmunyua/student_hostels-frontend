import { Calendar, MapPin, Users, Home } from 'lucide-react';

const BookingSummary = ({ accommodation, bookingData }) => {
  const calculateNights = () => {
    const checkIn = new Date(bookingData.check_in);
    const checkOut = new Date(bookingData.check_out);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = calculateNights();

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Booking Summary</h3>

      <div style={styles.accommodationCard}>
        {accommodation.images?.[0] && (
          <img src={accommodation.images[0]} alt={accommodation.title} style={styles.image} />
        )}
        <div style={styles.accommodationInfo}>
          <h4 style={styles.accommodationTitle}>{accommodation.title}</h4>
          <div style={styles.detail}>
            <MapPin size={16} />
            <span>{accommodation.location}</span>
          </div>
          <div style={styles.detail}>
            <Home size={16} />
            <span>{accommodation.property_type}</span>
          </div>
        </div>
      </div>

      <div style={styles.bookingDetails}>
        <div style={styles.detailRow}>
          <div style={styles.detailLabel}>
            <Calendar size={16} />
            <span>Check-in</span>
          </div>
          <span style={styles.detailValue}>
            {new Date(bookingData.check_in).toLocaleDateString()}
          </span>
        </div>

        <div style={styles.detailRow}>
          <div style={styles.detailLabel}>
            <Calendar size={16} />
            <span>Check-out</span>
          </div>
          <span style={styles.detailValue}>
            {new Date(bookingData.check_out).toLocaleDateString()}
          </span>
        </div>

        <div style={styles.detailRow}>
          <div style={styles.detailLabel}>
            <Users size={16} />
            <span>Guests</span>
          </div>
          <span style={styles.detailValue}>{bookingData.guests || 1}</span>
        </div>
      </div>

      <div style={styles.priceSection}>
        <div style={styles.priceRow}>
          <span>KSh {accommodation.price_per_night} x {nights} nights</span>
          <span>KSh {accommodation.price_per_night * nights}</span>
        </div>
        <div style={styles.totalRow}>
          <span>Total</span>
          <span>KSh {bookingData.total_price}</span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '24px' },
  title: { fontSize: '20px', fontWeight: 700, marginBottom: '20px' },
  accommodationCard: { display: 'flex', gap: '16px', marginBottom: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '12px' },
  image: { width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' },
  accommodationInfo: { flex: 1 },
  accommodationTitle: { fontSize: '16px', fontWeight: 600, marginBottom: '8px' },
  detail: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b7280', marginBottom: '4px' },
  bookingDetails: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e5e7eb' },
  detailRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  detailLabel: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6b7280' },
  detailValue: { fontSize: '14px', fontWeight: 600, color: '#1a1a1a' },
  priceSection: { display: 'flex', flexDirection: 'column', gap: '12px' },
  priceRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#6b7280' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700, color: '#1a1a1a', paddingTop: '12px', borderTop: '1px solid #e5e7eb' },
};

export default BookingSummary;