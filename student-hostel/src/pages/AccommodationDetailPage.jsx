import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MapPin, Users, Star, Heart, Share2, ChevronLeft } from "lucide-react";
import { fetchAccommodationById } from "../redux/slices/Thunks/accommodationThunks";
import { fetchReviewsByAccommodation } from "../redux/slices/Thunks/reviewThunks";
import { toggleWishlist } from "../redux/slices/Thunks/wishlistThunks";
import ReviewList from "../components/review/ReviewList";
import ReviewForm from "../components/review/ReviewForm";
import BookingForm from "../components/booking/BookingForm";

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

const AccommodationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentAccommodation } = useSelector((state) => state.accommodation);
  const { reviews } = useSelector((state) => state.review);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const isInWishlist = wishlistItems.some(
    (item) => item.accommodation_id === parseInt(id),
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchAccommodationById(id));
      dispatch(fetchReviewsByAccommodation(id));
    }
  }, [id, dispatch]);

  if (!currentAccommodation) {
    // Content loads directly without loading spinner
    return null;
  }

  const accommodation = currentAccommodation;
  const mainImage = getImageUrl(accommodation, 0);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = DEFAULT_PLACEHOLDER;
  };

  const amenitiesList = accommodation.amenities || [
    "WiFi",
    "Kitchen",
    "Parking",
    "Laundry",
    "Security",
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
          Back
        </button>
        <div style={styles.headerActions}>
          <button style={styles.iconButton}>
            <Share2 size={20} />
            Share
          </button>
          <button
            style={styles.iconButton}
            onClick={() => {
              if (!user) {
                navigate("/signup");
                return;
              }
              dispatch(toggleWishlist(id));
            }}
          >
            <Heart
              size={20}
              fill={isInWishlist ? "#ef4444" : "none"}
              color={isInWishlist ? "#ef4444" : "#64748b"}
            />
            Save
          </button>
        </div>
      </div>

      <div style={styles.gallery}>
        <img
          src={mainImage}
          alt={accommodation.title || accommodation.name}
          style={styles.mainImage}
          onError={handleImageError}
        />
      </div>

      <div style={styles.content}>
        <div style={styles.mainContent}>
          <div style={styles.titleSection}>
            <h1 style={styles.title}>
              {accommodation.title || accommodation.name}
            </h1>
            <div style={styles.meta}>
              <div style={styles.location}>
                <MapPin size={18} color="#64748b" />
                <span>{accommodation.location}</span>
              </div>
              <div style={styles.guests}>
                <Users size={18} color="#64748b" />
                <span>Up to {accommodation.max_guests || 2} guests</span>
              </div>
              {accommodation.rating && (
                <div style={styles.rating}>
                  <Star size={18} color="#f59e0b" fill="#f59e0b" />
                  <span>{accommodation.rating}</span>
                </div>
              )}
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>About this place</h2>
            <p style={styles.description}>
              {accommodation.description || "No description available."}
            </p>
          </div>

          <div style={styles.divider} />

          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Amenities</h2>
            <div style={styles.amenities}>
              {amenitiesList.map((amenity, index) => (
                <div key={index} style={styles.amenity}>
                  <span style={styles.amenityIcon}>✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.divider} />

          <div style={styles.section}>
            <div style={styles.reviewsHeader}>
              <h2 style={styles.sectionTitle}>Reviews</h2>
              {user && user.role === "student" && (
                <button
                  style={styles.writeReviewButton}
                  onClick={() => setShowReviewForm(true)}
                >
                  Write a Review
                </button>
              )}
            </div>

            {showReviewForm && (
              <div style={styles.reviewFormContainer}>
                <ReviewForm
                  accommodationId={parseInt(id)}
                  onSuccess={() => {
                    setShowReviewForm(false);
                    dispatch(fetchReviewsByAccommodation(id));
                  }}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            )}

            <ReviewList
              reviews={reviews}
              averageRating={accommodation.rating || 0}
              totalReviews={reviews.length || 0}
            />
          </div>
        </div>

        <aside style={styles.sidebar}>
          <div style={styles.bookingCard}>
            <div style={styles.priceSection}>
              <span style={styles.price}>
                KSh{" "}
                {accommodation.price_per_night?.toLocaleString() ||
                  accommodation.price?.toLocaleString()}
              </span>
              <span style={styles.priceLabel}>/night</span>
            </div>
            <BookingForm accommodation={accommodation} />
          </div>
        </aside>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },
  // Note: loadingContainer and spinner styles removed - content loads directly
  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
  },
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
  },
  gallery: {
    width: "100%",
    height: "500px",
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  content: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px 20px",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "40px",
  },
  mainContent: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "32px",
    border: "1px solid #e5e7eb",
  },
  titleSection: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "16px",
  },
  meta: {
    display: "flex",
    gap: "24px",
    flexWrap: "wrap",
  },
  location: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    color: "#64748b",
  },
  guests: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "16px",
    color: "#64748b",
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "16px",
    fontWeight: 600,
  },
  divider: {
    height: "1px",
    backgroundColor: "#e5e7eb",
    margin: "24px 0",
  },
  section: {
    marginBottom: "32px",
  },
  reviewsHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  writeReviewButton: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  reviewFormContainer: {
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: "16px",
  },
  description: {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#475569",
  },
  amenities: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  amenity: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "15px",
    color: "#475569",
  },
  amenityIcon: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    backgroundColor: "#ecfdf5",
    color: "#059669",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
  },
  sidebar: {
    position: "sticky",
    top: "20px",
    height: "fit-content",
  },
  bookingCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  },
  priceSection: {
    marginBottom: "24px",
    paddingBottom: "20px",
    borderBottom: "1px solid #e5e7eb",
  },
  price: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
  },
  priceLabel: {
    fontSize: "16px",
    color: "#64748b",
  },
};

export default AccommodationDetailPage;
