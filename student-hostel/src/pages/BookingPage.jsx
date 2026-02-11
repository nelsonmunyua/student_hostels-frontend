import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Calendar,
  MapPin,
  Users,
  CreditCard,
  ChevronLeft,
  Shield,
  Clock,
} from "lucide-react";
import { fetchAccommodationById } from "../redux/slices/Thunks/accommodationThunks";
import { createBooking } from "../redux/slices/Thunks/bookingThunks";
import BookingCalendar from "../components/booking/BookingCalendar";
import BookingSummary from "../components/booking/BookingSummary";
import StripeCheckout from "../components/payment/StripeCheckout";
import MpesaPayment from "../components/payment/MpesaPayment";
import "./BookingPage.css";

const BookingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const accommodationId = searchParams.get("accommodation_id");
  const { currentAccommodation } = useSelector((state) => state.accommodation);
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [selectedDates, setSelectedDates] = useState({
    checkIn: null,
    checkOut: null,
  });
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [bookingData, setBookingData] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(false);

  useEffect(() => {
    if (accommodationId) {
      dispatch(fetchAccommodationById(accommodationId));
    }
  }, [dispatch, accommodationId]);

  const handleDateSelect = (dates) => {
    setSelectedDates(dates);
  };

  const calculateNights = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return 0;
    const diff =
      new Date(selectedDates.checkOut) - new Date(selectedDates.checkIn);
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    if (!currentAccommodation || calculateNights() === 0) return 0;
    const pricePerNight =
      currentAccommodation.price_per_night || currentAccommodation.price || 0;
    const subtotal = pricePerNight * calculateNights();
    const serviceFee = Math.round(subtotal * 0.1);
    return subtotal + serviceFee;
  };

  const handleContinueToPayment = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    const nights = calculateNights();
    const total = calculateTotal();

    setBookingData({
      accommodation_id: accommodationId,
      accommodation: currentAccommodation,
      check_in: selectedDates.checkIn,
      check_out: selectedDates.checkOut,
      guests,
      special_requests: specialRequests,
      nights,
      subtotal: currentAccommodation?.price_per_night * nights,
      service_fee: Math.round(
        (currentAccommodation?.price_per_night || 0) * nights * 0.1,
      ),
      total_price: total,
    });

    setStep(2);
  };

  const handlePaymentSuccess = (paymentResult) => {
    setPaymentComplete(true);
    setStep(3);
  };

  const handleCreateBooking = async () => {
    try {
      const result = await dispatch(
        createBooking({
          ...bookingData,
          payment_status: "paid",
          status: "confirmed",
        }),
      );

      if (!result.error) {
        navigate("/booking/success", {
          state: { booking: result.payload.booking },
        });
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  const mockAccommodation = {
    id: accommodationId || 1,
    name: "University View Hostel",
    location: "123 College Ave, Nairobi",
    price_per_night: 8500,
    max_guests: 4,
    amenities: ["WiFi", "Security", "Study Room", "Parking"],
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"],
    rating: 4.5,
    review_count: 28,
    is_verified: true,
  };

  const accommodation = currentAccommodation || mockAccommodation;

  return (
    <div className="booking-page">
      <div className="booking-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
          Back
        </button>
        <div className="booking-steps">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <span className="step-number">1</span>
            <span className="step-label">Dates & Guests</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <span className="step-number">3</span>
            <span className="step-label">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="booking-content">
        <div className="booking-main">
          {step === 1 && (
            <div className="booking-section">
              <h2 className="section-title">Select Dates</h2>
              <BookingCalendar
                accommodationId={accommodation.id}
                onDateSelect={handleDateSelect}
                selectedDates={selectedDates}
              />

              <h2 className="section-title">Number of Guests</h2>
              <div className="guests-selector">
                <Users size={20} />
                <div className="guest-controls">
                  <button
                    className="guest-btn"
                    onClick={() => setGuests(Math.max(1, guests - 1))}
                    disabled={guests <= 1}
                  >
                    -
                  </button>
                  <span className="guest-count">
                    {guests} Guest{guests > 1 ? "s" : ""}
                  </span>
                  <button
                    className="guest-btn"
                    onClick={() =>
                      setGuests(
                        Math.min(accommodation.max_guests || 4, guests + 1),
                      )
                    }
                    disabled={guests >= (accommodation.max_guests || 4)}
                  >
                    +
                  </button>
                </div>
                <span className="max-guests">
                  Max {accommodation.max_guests || 4} guests
                </span>
              </div>

              <h2 className="section-title">Special Requests (Optional)</h2>
              <textarea
                className="special-requests"
                placeholder="Any special requests or requirements..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
              />

              <button
                className="continue-btn"
                onClick={handleContinueToPayment}
              >
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && bookingData && (
            <div className="booking-section">
              <h2 className="section-title">Choose Payment Method</h2>

              <div className="payment-methods">
                <button
                  className={`payment-method ${paymentMethod === "stripe" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("stripe")}
                >
                  <CreditCard size={24} />
                  <div className="payment-method-info">
                    <span className="payment-method-name">
                      Credit/Debit Card
                    </span>
                    <span className="payment-method-desc">
                      Pay securely with Visa, Mastercard
                    </span>
                  </div>
                </button>

                <button
                  className={`payment-method ${paymentMethod === "mpesa" ? "active" : ""}`}
                  onClick={() => setPaymentMethod("mpesa")}
                >
                  <div className="mpesa-logo">M</div>
                  <div className="payment-method-info">
                    <span className="payment-method-name">M-Pesa</span>
                    <span className="payment-method-desc">
                      Pay with M-Pesa mobile money
                    </span>
                  </div>
                </button>
              </div>

              {paymentMethod === "stripe" ? (
                <StripeCheckout
                  bookingData={bookingData}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setStep(1)}
                />
              ) : (
                <MpesaPayment
                  bookingData={bookingData}
                  onSuccess={handlePaymentSuccess}
                  onCancel={() => setStep(1)}
                />
              )}
            </div>
          )}

          {step === 3 && paymentComplete && (
            <div className="booking-section confirmation-section">
              <div className="confirmation-icon">✓</div>
              <h2>Booking Confirmed!</h2>
              <p>Your reservation has been successfully processed.</p>

              <div className="confirmation-details">
                <h3>Booking Details</h3>
                <div className="detail-row">
                  <span>Booking ID:</span>
                  <span>
                    #BK{Math.random().toString(36).substr(2, 9).toUpperCase()}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Property:</span>
                  <span>{accommodation.name}</span>
                </div>
                <div className="detail-row">
                  <span>Check-in:</span>
                  <span>
                    {new Date(selectedDates.checkIn).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Check-out:</span>
                  <span>
                    {new Date(selectedDates.checkOut).toLocaleDateString()}
                  </span>
                </div>
                <div className="detail-row">
                  <span>Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="detail-row total">
                  <span>Total Paid:</span>
                  <span>KSh {calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              <div className="confirmation-actions">
                <button
                  className="primary-btn"
                  onClick={() => navigate("/student/my-bookings")}
                >
                  View My Bookings
                </button>
                <button className="secondary-btn" onClick={() => navigate("/")}>
                  Back to Home
                </button>
              </div>
            </div>
          )}
        </div>

        <aside className="booking-sidebar">
          <BookingSummary
            accommodation={accommodation}
            selectedDates={selectedDates}
            guests={guests}
            calculateNights={calculateNights}
            calculateTotal={calculateTotal}
          />

          <div className="trust-badges">
            <div className="trust-badge">
              <Shield size={16} />
              <span>Secure Payment</span>
            </div>
            <div className="trust-badge">
              <Clock size={16} />
              <span>Instant Confirmation</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BookingPage;
