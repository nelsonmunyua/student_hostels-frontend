import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Calendar } from 'lucide-react';
import { calculateBookingPrice, checkAvailability } from '../../redux/slices/Thunks/ bookingThunks';
import BookingCalendar from './BookingCalendar';

const BookingForm = ({ accommodation, onSubmit }) => {
  const dispatch = useDispatch();
  const { priceCalculation, priceLoading, availability } = useSelector(state => state.booking);
  
  const [formData, setFormData] = useState({
    checkIn: null,
    checkOut: null,
    guests: 1,
  });

  useEffect(() => {
    if (formData.checkIn && formData.checkOut) {
      dispatch(calculateBookingPrice({
        accommodation_id: accommodation.id,
        check_in: formData.checkIn,
        check_out: formData.checkOut,
      }));
    }
  }, [formData.checkIn, formData.checkOut, accommodation.id, dispatch]);

  const handleDateSelect = (dates) => {
    setFormData({ ...formData, checkIn: dates.checkIn, checkOut: dates.checkOut });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      accommodation_id: accommodation.id,
      check_in: formData.checkIn,
      check_out: formData.checkOut,
      total_price: priceCalculation?.total_price || 0,
    });
  };

  const isFormValid = formData.checkIn && formData.checkOut && formData.guests > 0;

  return (
    <div style={styles.container}>
      <BookingCalendar 
        accommodationId={accommodation.id}
        onDateSelect={handleDateSelect}
        selectedDates={{ checkIn: formData.checkIn, checkOut: formData.checkOut }}
      />

      <div style={styles.guestsSection}>
        <label style={styles.label}>
          <Users size={16} />
          Number of Guests
        </label>
        <input
          type="number"
          min="1"
          max={accommodation.max_guests}
          value={formData.guests}
          onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
          style={styles.input}
        />
        <span style={styles.hint}>Max {accommodation.max_guests} guests</span>
      </div>

      {priceCalculation && (
        <div style={styles.priceBreakdown}>
          <h4>Price Breakdown</h4>
          <div style={styles.priceRow}>
            <span>KSh {accommodation.price_per_night} x {priceCalculation.nights} nights</span>
            <span>KSh {priceCalculation.subtotal}</span>
          </div>
          <div style={styles.priceRow}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalValue}>KSh {priceCalculation.total_price}</span>
          </div>
        </div>
      )}

      <button 
        onClick={handleSubmit}
        disabled={!isFormValid || priceLoading}
        style={{ ...styles.submitButton, ...((!isFormValid || priceLoading) && styles.submitButtonDisabled) }}
      >
        {priceLoading ? 'Calculating...' : 'Continue to Payment'}
      </button>
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px' },
  guestsSection: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#374151' },
  input: { padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' },
  hint: { fontSize: '12px', color: '#6b7280' },
  priceBreakdown: {
    padding: '20px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  priceRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' },
  totalLabel: { fontWeight: 700, fontSize: '16px' },
  totalValue: { fontWeight: 700, fontSize: '18px', color: '#3b82f6' },
  submitButton: {
    padding: '16px',
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  submitButtonDisabled: { backgroundColor: '#d1d5db', cursor: 'not-allowed' },
};

export default BookingForm;