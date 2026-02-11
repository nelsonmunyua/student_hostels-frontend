import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, Lock, AlertCircle } from "lucide-react";
import paymentApi from "../../api/Paymentapi";

const CardPayment = ({ bookingData, onSuccess, onCancel }) => {
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const getCardType = (number) => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "Visa";
    if (/^5[1-5]/.test(cleaned)) return "Mastercard";
    if (/^3[47]/.test(cleaned)) return "Amex";
    if (/^6(?:011|5)/.test(cleaned)) return "Discover";
    return "Card";
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardDetails({ ...cardDetails, cardNumber: formatted });
  };

  const handleMonthChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
    if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
      setCardDetails({ ...cardDetails, expiryMonth: value });
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
    setCardDetails({ ...cardDetails, expiryYear: value });
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  const validateCard = () => {
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, "");

    if (cardNumber.length < 13 || cardNumber.length > 19) {
      return "Invalid card number";
    }
    if (!cardDetails.cardName.trim()) {
      return "Cardholder name is required";
    }
    if (
      !cardDetails.expiryMonth ||
      parseInt(cardDetails.expiryMonth) < 1 ||
      parseInt(cardDetails.expiryMonth) > 12
    ) {
      return "Invalid expiry month";
    }
    if (!cardDetails.expiryYear || cardDetails.expiryYear.length !== 2) {
      return "Invalid expiry year";
    }

    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    const expYear = parseInt(cardDetails.expiryYear);
    const expMonth = parseInt(cardDetails.expiryMonth);

    if (
      expYear < currentYear ||
      (expYear === currentYear && expMonth < currentMonth)
    ) {
      return "Card has expired";
    }

    if (cardDetails.cvv.length < 3) {
      return "Invalid CVV";
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

    try {
      const paymentResult = await paymentApi.processCardPayment({
        booking_id: bookingData.booking_id || bookingData.id,
        card_number: cardDetails.cardNumber.replace(/\s/g, ""),
        card_name: cardDetails.cardName,
        expiry_month: cardDetails.expiryMonth,
        expiry_year: cardDetails.expiryYear,
        cvv: cardDetails.cvv,
        amount: bookingData.total_price || bookingData.amount,
      });

      if (onSuccess) {
        onSuccess(paymentResult);
      } else {
        navigate("/student/payment/success", {
          state: {
            booking: bookingData,
            payment: paymentResult,
          },
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Payment failed. Please try again.",
      );
      console.error("Payment error:", err);
    }
  };

  const cardType = getCardType(cardDetails.cardNumber);

  const containerStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    maxWidth: "500px",
    margin: "0 auto",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f1f5f9",
  };

  const headerIconStyle = {
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const titleStyle = {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1e293b",
    margin: 0,
  };

  const subtitleStyle = {
    fontSize: "14px",
    color: "#64748b",
    margin: "4px 0 0 0",
  };

  const errorBannerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    color: "#dc2626",
    fontSize: "14px",
    marginBottom: "20px",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  };

  const cardPreviewStyle = {
    position: "relative",
    padding: "24px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "16px",
    color: "#ffffff",
    minHeight: "180px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  };

  const cardChipStyle = {
    fontSize: "32px",
    marginBottom: "20px",
  };

  const cardNumberStyle = {
    fontSize: "20px",
    fontFamily: "monospace",
    letterSpacing: "2px",
    marginBottom: "20px",
  };

  const cardFooterStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
  };

  const cardNameStyle = {
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
  };

  const cardExpiryStyle = {
    fontSize: "14px",
    fontFamily: "monospace",
  };

  const cardTypeStyle = {
    position: "absolute",
    top: "20px",
    right: "20px",
    fontSize: "14px",
    fontWeight: 700,
    textTransform: "uppercase",
  };

  const formGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const formRowStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
  };

  const labelStyle = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  };

  const inputStyle = {
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "monospace",
    outline: "none",
    transition: "border-color 0.2s",
  };

  const securityNoteStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#059669",
  };

  const totalAmountStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  };

  const totalLabelStyle = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#64748b",
  };

  const totalValueStyle = {
    fontSize: "24px",
    fontWeight: 700,
    color: "#3b82f6",
  };

  const actionsStyle = {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  };

  const cancelButtonStyle = {
    flex: 1,
    padding: "14px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const submitButtonStyle = {
    flex: 2,
    padding: "14px",
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#ffffff",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const amount = bookingData.total_price || bookingData.amount || 0;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={headerIconStyle}>
          <CreditCard size={24} color="#3b82f6" />
        </div>
        <div>
          <h2 style={titleStyle}>Card Payment</h2>
          <p style={subtitleStyle}>Secure payment processing</p>
        </div>
      </div>

      {error && (
        <div style={errorBannerStyle}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={formStyle}>
        <div style={cardPreviewStyle}>
          <div style={cardChipStyle}>💳</div>
          <div style={cardNumberStyle}>
            {cardDetails.cardNumber || "•••• •••• •••• ••••"}
          </div>
          <div style={cardFooterStyle}>
            <div style={cardNameStyle}>
              {cardDetails.cardName || "CARDHOLDER NAME"}
            </div>
            <div style={cardExpiryStyle}>
              {cardDetails.expiryMonth && cardDetails.expiryYear
                ? `${cardDetails.expiryMonth}/${cardDetails.expiryYear}`
                : "MM/YY"}
            </div>
          </div>
          {cardType !== "Card" && <div style={cardTypeStyle}>{cardType}</div>}
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Card Number</label>
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

        <div style={formGroupStyle}>
          <label style={labelStyle}>Cardholder Name</label>
          <input
            type="text"
            placeholder="JOHN DOE"
            value={cardDetails.cardName}
            onChange={(e) =>
              setCardDetails({
                ...cardDetails,
                cardName: e.target.value.toUpperCase(),
              })
            }
            style={inputStyle}
            required
          />
        </div>

        <div style={formRowStyle}>
          <div style={formGroupStyle}>
            <label style={labelStyle}>Expiry Month</label>
            <input
              type="text"
              placeholder="MM"
              value={cardDetails.expiryMonth}
              onChange={handleMonthChange}
              maxLength={2}
              style={inputStyle}
              required
            />
          </div>

          <div style={formGroupStyle}>
            <label style={labelStyle}>Expiry Year</label>
            <input
              type="text"
              placeholder="YY"
              value={cardDetails.expiryYear}
              onChange={handleYearChange}
              maxLength={2}
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

        <div style={totalAmountStyle}>
          <span style={totalLabelStyle}>Total Amount</span>
          <span style={totalValueStyle}>KSh {amount.toLocaleString()}</span>
        </div>

        <div style={actionsStyle}>
          <button type="button" onClick={onCancel} style={cancelButtonStyle}>
            Cancel
          </button>
          <button type="submit" style={submitButtonStyle}>
            Pay Now
          </button>
        </div>
      </form>
    </div>
  );
};

export default CardPayment;
