import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Home, Calendar, MapPin, Users } from 'lucide-react';
import paymentApi from '../../api/Paymentapi';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const { booking, payment } = location.state || {};

  useEffect(() => {
    if (!booking || !payment) {
      navigate('/student/my-bookings');
    }
  }, [booking, payment, navigate]);

  if (!booking || !payment) {
    return null;
  }

  const handleDownloadReceipt = async () => {
    try {
      if (payment.id) {
        await paymentApi.downloadReceipt(payment.id);
      }
      // Fallback alert if download fails
      alert('Receipt feature coming soon!');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download receipt');
    }
  };

  const handleGoToDashboard = () => {
    navigate('/student/dashboard');
  };

  const handleViewBooking = () => {
    navigate('/student/my-bookings');
  };

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  };

  const successCardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '48px',
    maxWidth: '700px',
    width: '100%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e5e7eb',
    textAlign: 'center',
  };

  const iconContainerStyle = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '32px',
  };

  const iconCircleStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#059669',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'scaleIn 0.5s ease-out',
  };

  const confettiStyle = {
    position: 'absolute',
    top: '-20px',
    right: '30%',
    fontSize: '32px',
    animation: 'bounce 1s infinite',
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '12px',
  };

  const subtitleStyle = {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '40px',
    lineHeight: '1.6',
  };

  const detailsSectionStyle = {
    textAlign: 'left',
    marginBottom: '32px',
    padding: '24px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e293b',
    marginBottom: '20px',
  };

  const detailsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  };

  const detailItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  };

  const detailLabelStyle = {
    fontSize: '13px',
    color: '#64748b',
    fontWeight: 500,
  };

  const detailValueStyle = {
    fontSize: '15px',
    color: '#1e293b',
    fontWeight: 600,
  };

  const detailValueHighlightStyle = {
    fontSize: '20px',
    color: '#059669',
    fontWeight: 700,
  };

  const bookingSectionStyle = {
    textAlign: 'left',
    marginBottom: '32px',
  };

  const bookingCardStyle = {
    display: 'flex',
    gap: '20px',
    padding: '20px',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
  };

  const accommodationImageStyle = {
    width: '140px',
    height: '140px',
    borderRadius: '8px',
    objectFit: 'cover',
  };

  const bookingDetailsStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const accommodationTitleStyle = {
    fontSize: '18px',
    fontWeight: 600,
    color: '#1e293b',
    margin: 0,
  };

  const bookingInfoStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: '#64748b',
  };

  const actionsStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  };

  const primaryButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 24px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const secondaryButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 24px',
    backgroundColor: '#ffffff',
    color: '#3b82f6',
    border: '1px solid #3b82f6',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const nextStepsStyle = {
    textAlign: 'left',
    padding: '20px',
    backgroundColor: '#eff6ff',
    borderRadius: '12px',
    border: '1px solid #bfdbfe',
  };

  const nextStepsTitleStyle = {
    fontSize: '16px',
    fontWeight: 600,
    color: '#1e40af',
    marginBottom: '12px',
  };

  const nextStepsListStyle = {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '14px',
    color: '#1e40af',
    lineHeight: '1.8',
  };

  const accommodationImage = booking.accommodation?.images?.[0] || 
                           booking.images?.[0] || 
                           'https://via.placeholder.com/140x140?text=Accommodation';

  return (
    <div style={containerStyle}>
      <div style={successCardStyle}>
        {/* Success Icon */}
        <div style={iconContainerStyle}>
          <div style={iconCircleStyle}>
            <CheckCircle size={64} color="#ffffff" strokeWidth={2.5} />
          </div>
          <div style={confettiStyle}>🎉</div>
        </div>

        {/* Success Message */}
        <h1 style={titleStyle}>Payment Successful!</h1>
        <p style={subtitleStyle}>
          Your booking has been confirmed. We've sent a confirmation email with all the details.
        </p>

        {/* Payment Details */}
        <div style={detailsSectionStyle}>
          <h3 style={sectionTitleStyle}>Payment Details</h3>
          <div style={detailsGridStyle}>
            <div style={detailItemStyle}>
              <span style={detailLabelStyle}>Transaction ID</span>
              <span style={detailValueStyle}>#{payment.id || 'N/A'}</span>
            </div>
            <div style={detailItemStyle}>
              <span style={detailLabelStyle}>Amount Paid</span>
              <span style={detailValueHighlightStyle}>
                KSh {(booking.total_price || booking.amount || 0).toLocaleString()}
              </span>
            </div>
            <div style={detailItemStyle}>
              <span style={detailLabelStyle}>Payment Method</span>
              <span style={detailValueStyle}>
                {payment.method === 'mpesa' ? 'M-Pesa' : 
                 payment.method === 'stripe' ? 'Stripe' : 
                 payment.method === 'card' ? 'Card Payment' : 
                 payment.payment_method || 'Card Payment'}
              </span>
            </div>
            <div style={detailItemStyle}>
              <span style={detailLabelStyle}>Date</span>
              <span style={detailValueStyle}>
                {new Date().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div style={bookingSectionStyle}>
          <h3 style={sectionTitleStyle}>Booking Summary</h3>
          <div style={bookingCardStyle}>
            <img
              src={accommodationImage}
              alt={booking.accommodation_title || booking.accommodation?.title || 'Accommodation'}
              style={accommodationImageStyle}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/140x140?text=Accommodation';
              }}
            />
            <div style={bookingDetailsStyle}>
              <h4 style={accommodationTitleStyle}>
                {booking.accommodation_title || booking.accommodation?.title || 'Accommodation'}
              </h4>
              
              <div style={bookingInfoStyle}>
                <div style={infoItemStyle}>
                  <MapPin size={16} color="#64748b" />
                  <span>{booking.location || booking.accommodation?.location || 'Location'}</span>
                </div>
                
                <div style={infoItemStyle}>
                  <Calendar size={16} color="#64748b" />
                  <span>
                    {booking.check_in || booking.check_in_date} - {booking.check_out || booking.check_out_date}
                  </span>
                </div>
                
                <div style={infoItemStyle}>
                  <Users size={16} color="#64748b" />
                  <span>{booking.number_of_guests || 1} Guest{(booking.number_of_guests || 1) > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={actionsStyle}>
          <button style={secondaryButtonStyle} onClick={handleDownloadReceipt}>
            <Download size={18} />
            Download Receipt
          </button>
          <button style={secondaryButtonStyle} onClick={handleViewBooking}>
            <Calendar size={18} />
            View Booking
          </button>
          <button style={primaryButtonStyle} onClick={handleGoToDashboard}>
            <Home size={18} />
            Go to Dashboard
          </button>
        </div>

        {/* Next Steps */}
        <div style={nextStepsStyle}>
          <h4 style={nextStepsTitleStyle}>What's Next?</h4>
          <ul style={nextStepsListStyle}>
            <li>Check your email for booking confirmation and receipt</li>
            <li>The host will be notified about your booking</li>
            <li>You can view and manage your booking in your dashboard</li>
            <li>Contact the host if you have any questions</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;

