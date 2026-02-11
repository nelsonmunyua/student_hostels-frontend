import { MapPin, Calendar, Users, Star } from "lucide-react";

const BookingSummary = ({
  accommodation,
  selectedDates,
  guests,
  calculateNights,
  calculateTotal,
}) => {
  const nights = calculateNights();
  const subtotal = (accommodation?.price_per_night || 0) * nights;
  const serviceFee = Math.round(subtotal * 0.1);
  const total = subtotal + serviceFee;

  return (
    <div className="booking-summary">
      <div className="summary-header">
        <img
          src={
            accommodation?.images?.[0] ||
            "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"
          }
          alt={accommodation?.name || "Accommodation"}
          className="summary-image"
        />
        <div className="summary-info">
          <span className="accommodation-type">
            {accommodation?.property_type || "Student Hostel"}
          </span>
          <h3 className="accommodation-name">
            {accommodation?.name || "University View Hostel"}
          </h3>
          <div className="accommodation-location">
            <MapPin size={14} />
            <span>{accommodation?.location || "123 College Ave, Nairobi"}</span>
          </div>
          {accommodation?.rating && (
            <div className="accommodation-rating">
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span>{accommodation.rating}</span>
              <span className="review-count">
                ({accommodation.review_count || 0} reviews)
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="summary-divider"></div>

      <h4 className="summary-section-title">Your Trip</h4>

      <div className="trip-details">
        <div className="trip-row">
          <div className="trip-label">
            <Calendar size={16} />
            <span>Dates</span>
          </div>
          <div className="trip-value">
            {selectedDates?.checkIn && selectedDates?.checkOut ? (
              <>
                <span>
                  {new Date(selectedDates.checkIn).toLocaleDateString()}
                </span>
                <span> → </span>
                <span>
                  {new Date(selectedDates.checkOut).toLocaleDateString()}
                </span>
              </>
            ) : (
              <span className="not-selected">Select dates</span>
            )}
          </div>
        </div>

        <div className="trip-row">
          <div className="trip-label">
            <Users size={16} />
            <span>Guests</span>
          </div>
          <div className="trip-value">
            {guests} Guest{guests > 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="summary-divider"></div>

      <h4 className="summary-section-title">Price Details</h4>

      <div className="price-details">
        <div className="price-row">
          <span>
            KSh {(accommodation?.price_per_night || 0).toLocaleString()} x{" "}
            {nights} night{nights !== 1 ? "s" : ""}
          </span>
          <span>KSh {subtotal.toLocaleString()}</span>
        </div>

        <div className="price-row">
          <span>Service fee</span>
          <span>KSh {serviceFee.toLocaleString()}</span>
        </div>
      </div>

      <div className="summary-divider"></div>

      <div className="price-total">
        <span>Total</span>
        <span>KSh {total.toLocaleString()}</span>
      </div>

      {nights === 0 && (
        <p className="price-note">
          Select check-in and check-out dates to see total price
        </p>
      )}
    </div>
  );
};

export default BookingSummary;
