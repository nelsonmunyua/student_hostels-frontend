import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Smartphone, Check, Loader, AlertCircle } from 'lucide-react';
import paymentApi from '../../api/Paymentapi';

const MpesaPayment = ({ bookingData, onSuccess, onCancel }) => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [step, setStep] = useState('input'); // input, waiting, success

  useEffect(() => {
    let interval;
    
    if (checkoutRequestId && step === 'waiting') {
      // Poll payment status every 3 seconds
      interval = setInterval(async () => {
        await checkPaymentStatus();
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checkoutRequestId, step]);

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    let cleaned = value.replace(/\D/g, '');
    
    // Add 254 prefix if starts with 0
    if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.slice(1);
    }
    
    // Limit to 12 digits (254 + 9 digits)
    return cleaned.slice(0, 12);
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const validatePhone = () => {
    if (phoneNumber.length !== 12) {
      return 'Please enter a valid M-Pesa number (e.g., 254712345678)';
    }
    if (!phoneNumber.startsWith('254')) {
      return 'Phone number must start with 254';
    }
    return null;
  };

  const checkPaymentStatus = async () => {
    if (!checkoutRequestId) return;

    try {
      setChecking(true);
      const result = await paymentApi.checkMpesaStatus(checkoutRequestId);
      
      if (result.status === 'completed' || result.status === 'paid') {
        setStep('success');
        setChecking(false);
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess(result);
          } else {
            navigate('/student/payment/success', { 
              state: { 
                booking: bookingData,
                payment: result 
              } 
            });
          }
        }, 2000);
      } else if (result.status === 'failed') {
        setError('Payment failed. Please try again.');
        setStep('input');
        setCheckoutRequestId(null);
        setChecking(false);
      }
    } catch (err) {
      console.error('Status check error:', err);
      setChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validatePhone();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const result = await paymentApi.processMpesaPayment({
        booking_id: bookingData.booking_id || bookingData.id,
        phone_number: phoneNumber,
        amount: bookingData.total_price || bookingData.amount,
      });

      setCheckoutRequestId(result.checkout_request_id || result.CheckoutRequestID);
      setStep('waiting');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Failed to initiate M-Pesa payment. Please try again.');
      console.error('M-Pesa error:', err);
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
    backgroundColor: '#f0fdf4',
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

  const amountDisplayStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f0fdf4',
    borderRadius: '12px',
    border: '1px solid #bbf7d0',
  };

  const amountLabelStyle = {
    fontSize: '14px',
    color: '#059669',
    marginBottom: '8px',
  };

  const amountValueStyle = {
    fontSize: '32px',
    fontWeight: 700,
    color: '#059669',
  };

  const formGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#374151',
  };

  const inputWrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const prefixStyle = {
    padding: '12px 0 12px 16px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#64748b',
  };

  const inputStyle = {
    flex: 1,
    padding: '12px 16px',
    border: 'none',
    fontSize: '14px',
    fontFamily: 'monospace',
    outline: 'none',
  };

  const hintStyle = {
    fontSize: '12px',
    color: '#64748b',
    margin: 0,
  };

  const infoBoxStyle = {
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  };

  const infoTitleStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: '#1e293b',
    margin: '0 0 12px 0',
  };

  const infoListStyle = {
    margin: 0,
    paddingLeft: '20px',
    fontSize: '13px',
    color: '#64748b',
    lineHeight: '1.8',
  };

  const actionsStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
  };

  const cancelActionButtonStyle = {
    flex: 1,
    padding: '14px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#64748b',
    cursor: 'pointer',
  };

  const submitButtonStyle = {
    flex: 2,
    padding: '14px',
    backgroundColor: '#059669',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  };

  const waitingContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    textAlign: 'center',
  };

  const pulseIconStyle = {
    animation: 'pulse 2s infinite',
    marginBottom: '24px',
  };

  const waitingTitleStyle = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '12px',
  };

  const waitingTextStyle = {
    fontSize: '16px',
    color: '#64748b',
    marginBottom: '8px',
  };

  const waitingSubtextStyle = {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '24px',
  };

  const checkingIndicatorStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    backgroundColor: '#f0fdf4',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#059669',
    marginBottom: '20px',
  };

  const cancelButtonStyle = {
    padding: '12px 24px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#64748b',
    cursor: 'pointer',
  };

  const successContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    textAlign: 'center',
  };

  const successIconStyle = {
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    backgroundColor: '#059669',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
  };

  const successTitleStyle = {
    fontSize: '24px',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '12px',
  };

  const successTextStyle = {
    fontSize: '16px',
    color: '#64748b',
  };

  const amount = bookingData.total_price || bookingData.amount || 0;

  if (step === 'waiting') {
    return (
      <div style={containerStyle}>
        <div style={waitingContainerStyle}>
          <div style={pulseIconStyle}>
            <Smartphone size={48} color="#059669" />
          </div>
          <h3 style={waitingTitleStyle}>Check Your Phone</h3>
          <p style={waitingTextStyle}>
            An M-Pesa prompt has been sent to <strong>{phoneNumber}</strong>
          </p>
          <p style={waitingSubtextStyle}>
            Enter your M-Pesa PIN to confirm the payment
          </p>
          
          {checking && (
            <div style={checkingIndicatorStyle}>
              <Loader size={16} className="spin" />
              <span>Checking payment status...</span>
            </div>
          )}

          <button
            onClick={() => {
              setStep('input');
              setCheckoutRequestId(null);
            }}
            style={cancelButtonStyle}
          >
            Cancel Payment
          </button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div style={containerStyle}>
        <div style={successContainerStyle}>
          <div style={successIconStyle}>
            <Check size={48} color="#ffffff" />
          </div>
          <h3 style={successTitleStyle}>Payment Successful!</h3>
          <p style={successTextStyle}>
            Your M-Pesa payment has been received
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={headerIconStyle}>
          <Smartphone size={24} color="#059669" />
        </div>
        <div>
          <h2 style={titleStyle}>Pay with M-Pesa</h2>
          <p style={subtitleStyle}>Lipa Na M-Pesa</p>
        </div>
      </div>

      {error && (
        <div style={errorBannerStyle}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={amountDisplayStyle}>
          <span style={amountLabelStyle}>Amount to Pay</span>
          <span style={amountValueStyle}>
            KSh {amount.toLocaleString()}
          </span>
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>M-Pesa Phone Number</label>
          <div style={inputWrapperStyle}>
            <span style={prefixStyle}>+</span>
            <input
              type="tel"
              placeholder="254712345678"
              value={phoneNumber}
              onChange={handlePhoneChange}
              maxLength={12}
              style={inputStyle}
              required
            />
          </div>
          <p style={hintStyle}>
            Enter your Safaricom M-Pesa number (e.g., 254712345678)
          </p>
        </div>

        <div style={infoBoxStyle}>
          <h4 style={infoTitleStyle}>How it works:</h4>
          <ol style={infoListStyle}>
            <li>Click "Send Payment Request"</li>
            <li>You'll receive an M-Pesa prompt on your phone</li>
            <li>Enter your M-Pesa PIN to confirm</li>
            <li>Payment will be confirmed automatically</li>
          </ol>
        </div>

        <div style={actionsStyle}>
          <button
            type="button"
            onClick={onCancel}
            style={cancelActionButtonStyle}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={submitButtonStyle}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader size={18} className="spin" />
                Sending Request...
              </>
            ) : (
              'Send Payment Request'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MpesaPayment;

