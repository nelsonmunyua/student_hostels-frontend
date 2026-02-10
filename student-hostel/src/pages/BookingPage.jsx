import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import BookingCalendar from '../components/booking/BookingCalendar';
import BookingSummary from '../components/booking/BookingSummary';
import StripeCheckout from '../components/payment/StripeCheckout';
import MpesaPayment from '../components/payment/MpesaPayment';
import CardPayment from '../components/payment/CardPayment';

const BookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { accommodation, bookingData: initialBooking } = location.state || {};
  
  const [step, setStep] = useState(1); // 1: Dates, 2: Details, 3: Payment, 4: Confirmation
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [bookingData, setBookingData] = useState(initialBooking || {
    accommodation_id: accommodation?.id,
    check_in_date: '',
    check_out_date: '',
    number_of_guests: 1,
    total_price: 0,
  });

  if (!accommodation) {
    return (
      <div style={styles.error}>
        <h2 style={{ marginBottom: '16px' }}>No accommodation selected</h2>
        <button onClick={() => navigate('/accommodations')} style={styles.button}>
          Browse Accommodations
        </button>
      </div>
    );
  }

  const steps = [
    { number: 1, label: 'Select Dates', icon: '📅' },
    { number: 2, label: 'Guest Details', icon: '👤' },
    { number: 3, label: 'Payment', icon: '💳' },
  ];

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePaymentSuccess = (payment) => {
    navigate('/payment/success', { state: { booking: bookingData, payment } });
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
          Back
        </button>
        <h1 style={styles.title}>Complete Your Booking</h1>
      </div>

      {/* Progress Steps */}
      <div style={styles.stepsContainer}>
        {steps.map((s, index) => (
          <div key={s.number} style={styles.stepWrapper}>
            <div style={{
              ...styles.step,
              ...(s.number === step && styles.stepActive),
              ...(s.number < step && styles.stepComplete),
            }}>
              {s.number < step ? <Check size={20} /> : <span style={styles.stepIcon}>{s.icon}</span>}
            </div>
            <span style={{
              ...styles.stepLabel,
              ...(s.number === step && styles.stepLabelActive),
            }}>{s.label}</span>
            {index < steps.length - 1 && <div style={styles.stepLine} />}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.main}>
          {step === 1 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>Select Your Dates</h2>
              <BookingCalendar
                accommodationId={accommodation.id}
                onDatesSelected={(dates) => setBookingData({ ...bookingData, ...dates })}
              />
              <div style={styles.actions}>
                <button
                  style={styles.nextButton}
                  onClick={handleNext}
                  disabled={!bookingData.check_in_date || !bookingData.check_out_date}
                >
                  Continue
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>Guest Information</h2>
              <div style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Number of Guests</label>
                  <select
                    style={styles.input}
                    value={bookingData.number_of_guests}
                    onChange={(e) => setBookingData({ ...bookingData, number_of_guests: e.target.value })}
                  >
                    {[...Array(accommodation.max_guests || 4)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Special Requests (Optional)</label>
                  <textarea
                    style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                    placeholder="Any special requirements or requests..."
                    onChange={(e) => setBookingData({ ...bookingData, special_requests: e.target.value })}
                  />
                </div>
              </div>
              <div style={styles.actions}>
                <button style={styles.backBtn} onClick={handleBack}>
                  <ChevronLeft size={20} />
                  Back
                </button>
                <button style={styles.nextButton} onClick={handleNext}>
                  Continue to Payment
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={styles.stepContent}>
              <h2 style={styles.stepTitle}>Payment Method</h2>
              
              {/* Payment Method Selection */}
              <div style={styles.paymentMethods}>
                <button
                  style={{ ...styles.paymentMethod, ...(paymentMethod === 'stripe' && styles.paymentMethodActive) }}
                  onClick={() => setPaymentMethod('stripe')}
                >
                  <span style={{ fontSize: '24px' }}>💳</span>
                  <span>Stripe</span>
                </button>
                <button
                  style={{ ...styles.paymentMethod, ...(paymentMethod === 'mpesa' && styles.paymentMethodActive) }}
                  onClick={() => setPaymentMethod('mpesa')}
                >
                  <span style={{ fontSize: '24px' }}>📱</span>
                  <span>M-Pesa</span>
                </button>
                <button
                  style={{ ...styles.paymentMethod, ...(paymentMethod === 'card' && styles.paymentMethodActive) }}
                  onClick={() => setPaymentMethod('card')}
                >
                  <span style={{ fontSize: '24px' }}>💳</span>
                  <span>Card</span>
                </button>
              </div>

              {/* Payment Component */}
              {paymentMethod === 'stripe' && (
                <StripeCheckout
                  bookingData={bookingData}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleBack}
                />
              )}
              {paymentMethod === 'mpesa' && (
                <MpesaPayment
                  bookingData={bookingData}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleBack}
                />
              )}
              {paymentMethod === 'card' && (
                <CardPayment
                  bookingData={bookingData}
                  onSuccess={handlePaymentSuccess}
                  onCancel={handleBack}
                />
              )}
            </div>
          )}
        </div>

        {/* Booking Summary Sidebar */}
        <aside style={styles.sidebar}>
          <BookingSummary accommodation={accommodation} bookingData={bookingData} />
        </aside>
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
    borderBottom: '1px solid #e5e7eb',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1e293b',
  },
  stepsContainer: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
  },
  step: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#f1f5f9',
    border: '2px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '12px',
    transition: 'all 0.3s',
    fontSize: '24px',
  },
  stepActive: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    borderColor: '#3b82f6',
  },
  stepComplete: {
    backgroundColor: '#059669',
    color: '#ffffff',
    borderColor: '#059669',
  },
  stepIcon: {},
  stepLabel: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: 500,
  },
  stepLabelActive: {
    color: '#3b82f6',
    fontWeight: 600,
  },
  stepLine: {
    position: 'absolute',
    top: '30px',
    left: '50%',
    width: '100%',
    height: '2px',
    backgroundColor: '#e5e7eb',
    zIndex: -1,
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '40px 20px',
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '40px',
  },
  main: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid #e5e7eb',
  },
  stepContent: {
    minHeight: '400px',
  },
  stepTitle: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    marginBottom: '32px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
  },
  actions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '24px',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
  nextButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
  },
  paymentMethods: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '32px',
  },
  paymentMethod: {
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '2px solid #e5e7eb',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: 500,
  },
  paymentMethodActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  sidebar: {
    position: 'sticky',
    top: '20px',
    height: 'fit-content',
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '20px',
    color: '#64748b',
    fontSize: '18px',
  },
  button: {
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 600,
  },
};

export default BookingPage;

