import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, CreditCard, Smartphone, Lock, Loader, AlertCircle } from 'lucide-react';
import { StripeCheckout, MpesaPayment, CardPayment } from '../../../payment';
import { fetchBookingById } from '../../../../redux/slices/Thunks/bookingThunks';

const PaymentCheckout = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('card'); // card, mpesa, stripe
  
  // Get booking data from navigation state (from AccommodationDetailPage redirect)
  const locationState = location.state?.booking;
  const locationAccommodation = location.state?.accommodation;
  
  // Get booking data from Redux store as fallback
  const { studentBookings } = useSelector((state) => state.booking);
  const reduxBooking = studentBookings?.find(b => b.id === parseInt(bookingId));
  
  // Build booking object with fallback to location state, then Redux, then defaults
  const booking = locationState || reduxBooking || {
    id: parseInt(bookingId),
    total_price: locationState?.total_amount || 5000, // Default for demo
    accommodation_title: locationAccommodation?.title || locationAccommodation?.name || 'Demo Accommodation',
    location: locationAccommodation?.location || 'Nairobi, Kenya',
    check_in: locationState?.start_date,
    check_out: locationState?.end_date,
    hostel_name: locationState?.hostel_name,
  };

  // Fetch booking details if we don't have enough data from state
  useEffect(() => {
    const fetchBookingDetails = async () => {
      // If we only have basic data from navigation, fetch full details
      const needsFetch = !booking.total_amount || booking.total_amount === 5000;
      
      if (needsFetch && bookingId) {
        try {
          setLoading(true);
          await dispatch(fetchBookingById(bookingId)).unwrap();
          setLoading(false);
        } catch (err) {
          console.error('Failed to fetch booking:', err);
          setLoading(false);
          // Continue with existing booking data
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId, dispatch, booking.total_amount]);

  const handlePaymentSuccess = (paymentResult) => {
    navigate('/student/payment/success', {
      state: {
        booking,
        payment: paymentResult,
      },
    });
  };

  const handleCancel = () => {
    // Check if we came from an accommodation page
    if (locationAccommodation) {
      navigate(-2);
    } else {
      navigate('/student/my-bookings');
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    padding: '40px 20px',
  };

  const maxWidthContainerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '32px',
  };

  const backButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    color: '#64748b',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#64748b',
    marginTop: '4px',
  };

  const contentStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '32px',
    alignItems: 'start',
  };

  const mainContentStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e5e7eb',
  };

  const paymentMethodsTitleStyle = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '20px',
  };

  const paymentMethodsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  };

  const paymentMethodButtonStyle = (isSelected) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '16px',
    borderRadius: '12px',
    border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
    backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  });

  const paymentMethodLabelStyle = (isSelected) => ({
    fontSize: '14px',
    fontWeight: isSelected ? 600 : 500,
    color: isSelected ? '#3b82f6' : '#374151',
  });

  const sidebarStyle = {
    position: 'sticky',
    top: '24px',
  };

  const orderSummaryStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e5e7eb',
  };

  const summaryTitleStyle = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #f1f5f9',
  };

  const summaryItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '16px',
  };

  const summaryLabelStyle = {
    fontSize: '13px',
    color: '#64748b',
  };

  const summaryValueStyle = {
    fontSize: '15px',
    fontWeight: 600,
    color: '#1e293b',
  };

  const dividerStyle = {
    height: '1px',
    backgroundColor: '#f1f5f9',
    margin: '16px 0',
  };

  const totalRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const totalLabelStyle = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e293b',
  };

  const totalValueStyle = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#3b82f6',
  };

  const securityNoteStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px',
    padding: '12px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#059669',
  };

  const loadingContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
  };

  const loadingTextStyle = {
    fontSize: '16px',
    color: '#64748b',
  };

  const errorContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    gap: '16px',
    padding: '20px',
    backgroundColor: '#fef2f2',
    borderRadius: '12px',
    border: '1px solid #fecaca',
  };

  const errorTextStyle = {
    fontSize: '16px',
    color: '#dc2626',
    textAlign: 'center',
  };

  // Render the appropriate payment component
  const renderPaymentComponent = () => {
    const bookingData = {
      id: booking.id,
      booking_id: booking.id,
      total_price: booking.total_amount || booking.total_price,
      amount: booking.total_amount || booking.total_price,
      accommodation_title: booking.accommodation_title || booking.hostel_name,
      location: booking.location,
      check_in: booking.start_date || booking.check_in,
      check_out: booking.end_date || booking.check_out,
    };

    switch (selectedProvider) {
      case 'stripe':
        return <StripeCheckout bookingData={bookingData} onSuccess={handlePaymentSuccess} onCancel={handleCancel} />;
      case 'mpesa':
        return <MpesaPayment bookingData={bookingData} onSuccess={handlePaymentSuccess} onCancel={handleCancel} />;
      case 'card':
      default:
        return <CardPayment bookingData={bookingData} onSuccess={handlePaymentSuccess} onCancel={handleCancel} />;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={maxWidthContainerStyle}>
          <div style={loadingContainerStyle}>
            <Loader size={48} className="spin" color="#3b82f6" />
            <p style={loadingTextStyle}>Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={maxWidthContainerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <button style={backButtonStyle} onClick={handleCancel}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 style={titleStyle}>Complete Payment</h1>
            <p style={subtitleStyle}>Secure payment for your booking</p>
          </div>
        </div>

        <div style={contentStyle}>
          {/* Payment Method Selection & Form */}
          <div style={mainContentStyle}>
            <h2 style={paymentMethodsTitleStyle}>Select Payment Method</h2>
            
            {/* Payment Method Options */}
            <div style={paymentMethodsGridStyle}>
              <button
                style={paymentMethodButtonStyle(selectedProvider === 'card')}
                onClick={() => setSelectedProvider('card')}
              >
                <CreditCard size={24} color={selectedProvider === 'card' ? '#3b82f6' : '#64748b'} />
                <span style={paymentMethodLabelStyle(selectedProvider === 'card')}>Card</span>
              </button>
              
              <button
                style={paymentMethodButtonStyle(selectedProvider === 'mpesa')}
                onClick={() => setSelectedProvider('mpesa')}
              >
                <Smartphone size={24} color={selectedProvider === 'mpesa' ? '#059669' : '#64748b'} />
                <span style={paymentMethodLabelStyle(selectedProvider === 'mpesa')}>M-Pesa</span>
              </button>
              
              <button
                style={paymentMethodButtonStyle(selectedProvider === 'stripe')}
                onClick={() => setSelectedProvider('stripe')}
              >
                <CreditCard size={24} color={selectedProvider === 'stripe' ? '#635bff' : '#64748b'} />
                <span style={paymentMethodLabelStyle(selectedProvider === 'stripe')}>Stripe</span>
              </button>
            </div>

            {/* Payment Form */}
            {renderPaymentComponent()}
          </div>

          {/* Order Summary Sidebar */}
          <div style={sidebarStyle}>
            <div style={orderSummaryStyle}>
              <h3 style={summaryTitleStyle}>Booking Summary</h3>
              
              <div style={summaryItemStyle}>
                <span style={summaryLabelStyle}>Accommodation</span>
                <span style={summaryValueStyle}>{booking.accommodation_title || booking.hostel_name}</span>
              </div>
              
              <div style={summaryItemStyle}>
                <span style={summaryLabelStyle}>Location</span>
                <span style={summaryValueStyle}>{booking.location}</span>
              </div>
              
              {(booking.check_in || booking.start_date) && (
                <div style={summaryItemStyle}>
                  <span style={summaryLabelStyle}>Check-in</span>
                  <span style={summaryValueStyle}>
                    {new Date(booking.check_in || booking.start_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {(booking.check_out || booking.end_date) && (
                <div style={summaryItemStyle}>
                  <span style={summaryLabelStyle}>Check-out</span>
                  <span style={summaryValueStyle}>
                    {new Date(booking.check_out || booking.end_date).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              <div style={summaryItemStyle}>
                <span style={summaryLabelStyle}>Booking ID</span>
                <span style={summaryValueStyle}>#{booking.id}</span>
              </div>
              
              <div style={dividerStyle} />
              
              <div style={totalRowStyle}>
                <span style={totalLabelStyle}>Total Amount</span>
                <span style={totalValueStyle}>
                  KSh {((booking.total_amount || booking.total_price) || 0).toLocaleString()}
                </span>
              </div>
              
              <div style={securityNoteStyle}>
                <Lock size={16} />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCheckout;

