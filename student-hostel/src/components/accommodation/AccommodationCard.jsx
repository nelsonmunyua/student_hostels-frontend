import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart, Star, MapPin, Wifi, Car, Shield, Eye } from "lucide-react";
import { toggleWishlist } from "../../redux/slices/Thunks/wishlistThunks";
import "./AccommodationCard.css";
import "./ImageLoading.css";

// Default placeholder image
const DEFAULT_PLACEHOLDER =
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80";

// Fallback images for different accommodations
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80",
  "https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=800&q=80",
  "https://images.unsplash.com/photo-1590508794514-f2a3c8b8edd4?w=800&q=80",
  "https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=800&q=80",
  "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
  "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80",
];

// Helper to get image URL from accommodation
const getImageUrl = (accommodation, index = 0) => {
  if (!accommodation) return FALLBACK_IMAGES[0];

  // Check for images array
  if (Array.isArray(accommodation.images) && accommodation.images.length > 0) {
    const img = accommodation.images[index];
    if (typeof img === "string") {
      return img.includes("?") ? img : `${img}?w=800&q=80`;
    }
    if (img && img.url) {
      return img.url.includes("?") ? img.url : `${img.url}?w=800&q=80`;
    }
  }

  // Check for single image string
  if (accommodation.image && typeof accommodation.image === "string") {
    return accommodation.image.includes("?")
      ? accommodation.image
      : `${accommodation.image}?w=800&q=80`;
  }

  // Use default placeholder
  return FALLBACK_IMAGES[0];
};

// Helper to get all images from accommodation
const getAllImages = (accommodation) => {
  if (!accommodation) return [];

  // Return images array if it exists
  if (Array.isArray(accommodation.images) && accommodation.images.length > 0) {
    return accommodation.images.map((img) =>
      typeof img === "string" ? img : img.url || img,
    );
  }

  // Return single image as array
  if (accommodation.image) {
    return [accommodation.image];
  }

  return [];
};

const AccommodationCard = ({ accommodation, layout = "grid" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Use Unsplash images for better quality
  //const defaultImage = 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800';
  const image = accommodation.images?.[0] || accommodation.image || defaultImage;

  const getAmenityIcon = (amenity) => {
    const icons = {
      wifi: <Wifi size={14} />,
      parking: <Car size={14} />,
      security: <Shield size={14} />,
    };
    return icons[amenity?.toLowerCase()] || null;
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800";
  const images = getAllImages(accommodation);
  const currentImage = getImageUrl(accommodation, imageIndex);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_PLACEHOLDER;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div
      className={`accommodation-card ${layout}`}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      <div className="card-image">
        {/* Loading skeleton */}
        {!imageLoaded && (
          <div
            className="image-skeleton"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          />
        )}
        <img
          src={currentImage}
          alt={accommodation.name || "Accommodation"}
          onError={handleImageError}
          onLoad={handleImageLoad}
          className={imageLoaded ? "image-fade-in loaded" : "image-fade-in"}
        />

        {/* Image Navigation */}
        {images.length > 1 && (
          <div className="image-nav">
            {images.map((_, index) => (
              <button
                key={index}
                className={`nav-dot ${index === imageIndex ? "active" : ""}`}
                onMouseEnter={() => setImageIndex(index)}
              />
            ))}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className={`wishlist-btn ${isInWishlist ? "active" : ""}`}
          onClick={handleWishlistClick}
        >
          <Heart
            size={20}
            fill={isInWishlist ? "#ef4444" : "none"}
            color={isInWishlist ? "#ef4444" : "#fff"}
          />
        </button>

        {/* Badges */}
        <div className="card-badges">
          {accommodation.is_verified && (
            <span className="badge verified">Verified</span>
          )}
          {accommodation.featured && (
            <span className="badge featured">Featured</span>
          )}
          {accommodation.discount && (
            <span className="badge discount">
              {accommodation.discount}% OFF
            </span>
          )}
        </div>

        {/* Quick View on Hover */}
        {isHovered && (
          <div className="quick-view">
            <button onClick={handleCardClick}>
              <Eye size={16} />
              Quick View
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="card-content">
        {/* Header */}
        <div className="card-header">
          <div className="card-title-row">
            <h3 className="card-title">{accommodation.name}</h3>
            {accommodation.rating && (
              <div className="card-rating">
                <Star size={14} fill="#f59e0b" color="#f59e0b" />
                <span>{accommodation.rating}</span>
                {accommodation.review_count > 0 && (
                  <span className="review-count">
                    ({accommodation.review_count})
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="card-location">
            <MapPin size={14} />
            <span>{accommodation.location}</span>
          </div>
        </div>

        {/* Property Type */}
        <div className="property-type">
          {formatPropertyType(accommodation.property_type)}
        </div>

        {/* Amenities Preview */}
        {accommodation.amenities && accommodation.amenities.length > 0 && (
          <div className="card-amenities">
            {accommodation.amenities.slice(0, 3).map((amenity, index) => (
              <span key={index} className="amenity-tag">
                {getAmenityIcon(amenity)}
                {amenity.charAt(0).toUpperCase() +
                  amenity.slice(1).replace(/_/g, " ")}
              </span>
            ))}
            {accommodation.amenities.length > 3 && (
              <span className="amenity-more">
                +{accommodation.amenities.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="card-footer">
          <div className="card-price">
            <span className="price">
              KSh{" "}
              {(
                accommodation.price_per_night ||
                accommodation.price ||
                0
              ).toLocaleString()}
            </span>
            <span className="period">/night</span>
          </div>

          <button className="book-btn">View Details</button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationCard;
