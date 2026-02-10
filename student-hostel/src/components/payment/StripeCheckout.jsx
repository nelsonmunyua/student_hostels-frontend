import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import paymentApi from '../../api/Paymentapi';

const StripeCheckout = ({ bookingData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails({ ...cardDetails, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value);
    setCardDetails({ ...cardDetails, expiryDate: formatted });
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  const validateCard = () => {
    if (cardDetails.cardNumber.replace(/\s/g, '').length < 13) {
      return 'Invalid card number';
    }
    if (!cardDetails.cardName.trim()) {
      return 'Cardholder name is required';
    }
    if (cardDetails.expiryDate.length !== 5) {
      return 'Invalid expiry date';
    }
    if (cardDetails.cvv.length < 3) {
      return 'Invalid CVV';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateCard();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      // Get Stripe client secret
      const { client_secret } = await paymentApi.getStripeClientSecret({
        booking_id: bookingData.booking_id || bookingData.id,
        amount: bookingData.total_price || bookingData.amount,
      });

      // Process Stripe payment
      const paymentResult = await paymentApi.processStripePayment({
        booking_id: bookingData.booking_id || bookingData.id,
        payment_intent_id: client_secret,
      });

      // Confirm payment
      await paymentApi.confirmStripePayment({
        payment_intent_id: client_secret,
        booking_id: bookingData.booking_id || bookingData.id,
      });

      setLoading(false);
      
      if (onSuccess) {
        onSuccess(paymentResult);
      } else {
        navigate('/student/payment/success', { 
          state: { 
            booking: bookingData,
            payment: paymentResult 
          } 
        });
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
      console.error('Payment error:', err);
    }
  };

  const containerStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #e5e7eb',
    maxWidth: '500px',
    margin: '0 auto',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f1f5f9',
  };

  const headerIconStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#eff6ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 700,
    color: '#1e293b',
    margin: 0,
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#64748b',
    margin: '4px 0 0 0',
  };

  const errorBannerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '20px',
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const formRowStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
  };

  const inputWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'monospace',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const securityNoteStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#059669',
  };

  const actionsStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  };

  const cancelButtonStyle = {
    flex: 1,
    padding: '14px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#64748b',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const submitButtonStyle = {
    flex: 2,
    padding: '14px',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const amount = bookingData.total_price || bookingData.amount || 0;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={headerIconStyle}>
          <CreditCard size={24} color="#3b82f6" />
        </div>
        <div>
          <h2 style={titleStyle}>Pay with Card</h2>
          <p style={subtitleStyle}>Secure payment powered by Stripe</p>
        </div>
      </div>

      {error && (
        <div style={errorBannerStyle}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Card Number</label>
          <div style={inputWrapperStyle}>
            <CreditCard size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardDetails.cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Cardholder Name</label>
          <input
            type="text"
            placeholder="JOHN DOE"
            value={cardDetails.cardName}
            onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value.toUpperCase() })}
            style={inputStyle}
            required
          />
        </div>

        <div style={formRowStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Expiry Date</label>
            <input
              type="text"
              placeholder="MM/YY"
              value={cardDetails.expiryDate}
              onChange={handleExpiryChange}
              maxLength={5}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>CVV</label>
            <input
              type="text"
              placeholder="123"
              value={cardDetails.cvv}
              onChange={handleCvvChange}
              maxLength={4}
              style={inputStyle}
              required
            />
          </div>
        </div>

        <div style={securityNoteStyle}>
          <Lock size={16} color="#059669" />
          <span>Your payment information is encrypted and secure</span>
        </div>

        <div style={actionsStyle}>
          <button
            type="button"
            onClick={onCancel}
            style={cancelButtonStyle}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={submitButtonStyle}
            disabled={loading}
          >
            {loading ? 'Processing...' : `Pay KSh ${amount.toLocaleString()}`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StripeCheckout;

