import { Calendar, MapPin } from 'lucide-react';

const BookingList = ({ bookings, onBookingClick }) => {
  const getStatusStyle = (status) => {
    const styles = {
      paid: { bg: '#d1fae5', color: '#065f46' },
      pending: { bg: '#fef3c7', color: '#92400e' },
      cancelled: { bg: '#fee2e2', color: '#991b1b' },
      completed: { bg: '#e0e7ff', color: '#3730a3' },
    };
    return styles[status] || styles.pending;
  };

  return (
    <div style={styles.container}>
      {bookings.map((booking) => {
        const statusStyle = getStatusStyle(booking.status);
        return (
          <div 
            key={booking.id} 
            style={styles.bookingCard}
            onClick={() => onBookingClick?.(booking)}
          >
            <div style={styles.cardContent}>
              <h4 style={styles.title}>{booking.accommodation_title}</h4>
              <div style={styles.details}>
                <div style={styles.detail}>
                  <Calendar size={14} />
                  {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                </div>
                <div style={styles.detail}>
                  <MapPin size={14} />
                  {booking.location}
                </div>
              </div>
            </div>
            <div style={styles.rightSection}>
              <span style={{ ...styles.statusBadge, backgroundColor: statusStyle.bg, color: statusStyle.color }}>
                {booking.status}
              </span>
              <span style={styles.price}>KSh {booking.total_price}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '16px' },
  bookingCard: { display: 'flex', justifyContent: 'space-between', padding: '16px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'all 0.2s' },
  cardContent: { flex: 1 },
  title: { fontSize: '16px', fontWeight: 600, marginBottom: '8px' },
  details: { display: 'flex', flexDirection: 'column', gap: '4px' },
  detail: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#6b7280' },
  rightSection: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  statusBadge: { padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 600, textTransform: 'capitalize' },
  price: { fontSize: '18px', fontWeight: 700, color: '#1a1a1a' },
};

export default BookingList;