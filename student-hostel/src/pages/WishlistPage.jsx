import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  MapPin,
  Star,
  Trash2,
  Calendar,
  ArrowRight,
} from "lucide-react";
import {
  removeFromWishlist,
  moveToBooking,
} from "../../redux/slices/Thunks/wishlistThunks";
import AccommodationCard from "../accommodation/AccommodationCard";
import "./WishlistPage.css";

const WishlistPage = () => {
  const dispatch = useDispatch();
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const { items: wishlistAccommodations } = useSelector(
    (state) => state.wishlist,
  );

  const [viewMode, setViewMode] = useState("grid");

  const handleRemoveFromWishlist = (accommodationId) => {
    if (window.confirm("Remove this property from your wishlist?")) {
      dispatch(removeFromWishlist(accommodationId));
    }
  };

  const handleMoveToBooking = (accommodationId) => {
    dispatch(moveToBooking(accommodationId));
  };

  const mockWishlist = [
    {
      id: 1,
      accommodation: {
        id: 1,
        name: "University View Hostel",
        location: "123 College Ave, Nairobi",
        price_per_night: 8500,
        rating: 4.5,
        review_count: 28,
        amenities: ["wifi", "security", "study", "parking"],
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRi7zeivyDu8SKwXvvO20ACT2k56u3YB5I9ww&s",
        ],
        is_verified: true,
      },
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      accommodation: {
        id: 2,
        name: "Central Student Living",
        location: "456 Main Street, Nairobi",
        price_per_night: 6500,
        rating: 4.2,
        review_count: 15,
        amenities: ["wifi", "breakfast", "security"],
        images: [
          "data:image/jpeg;base64,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",
        ],
        is_verified: true,
      },
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      accommodation: {
        id: 3,
        name: "Green Valley Hostel",
        location: "789 Park Road, Nairobi",
        price_per_night: 5500,
        rating: 4.0,
        review_count: 42,
        amenities: ["wifi", "parking", "security"],
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIbzHOoDb4poPTEvNwD6GTxmURkXxdb1A0ZA&s",
        ],
        is_verified: false,
      },
      created_at: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 4,
      accommodation: {
        id: 4,
        name: "Lakeside Accommodation",
        location: "321 Lake View, Kisumu",
        price_per_night: 7500,
        rating: 4.8,
        review_count: 12,
        amenities: ["wifi", "security", "study", "parking"],
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlufHQRYPtTHdWcertDRfMUjlW3VXk8W3coA&s",
        ],
        is_verified: true,
      },
      created_at: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: 5,
      accommodation: {
        id: 5,
        name: "Urban Studio Apartments",
        location: "555 Innovation Ave, Nairobi",
        price_per_night: 9500,
        rating: 4.6,
        review_count: 35,
        amenities: ["wifi", "security", "study", "parking", "kitchen"],
        images: [
          "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
        ],
        is_verified: true,
      },
      created_at: new Date(Date.now() - 345600000).toISOString(),
    },
  ];

  const displayWishlist =
    wishlistItems.length > 0 ? wishlistItems : mockWishlist;

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div className="header-content">
          <h1 className="page-title">
            <Heart size={28} />
            My Wishlist
          </h1>
          <p className="page-subtitle">
            {displayWishlist.length} saved properties
          </p>
        </div>

        {displayWishlist.length > 0 && (
          <div className="header-actions">
            <button
              className="clear-btn"
              onClick={() => {
                if (window.confirm("Clear all items from your wishlist?")) {
                  dispatch({ type: "wishlist/clearAll" });
                }
              }}
            >
              <Trash2 size={16} />
              Clear All
            </button>
          </div>
        )}
      </div>

      {displayWishlist.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Heart size={64} />
          </div>
          <h2>Your wishlist is empty</h2>
          <p>
            Start exploring and save your favorite properties to book them later
          </p>
          <button
            className="browse-btn"
            onClick={() => (window.location.href = "/search")}
          >
            Browse Properties
          </button>
        </div>
      ) : (
        <div className={`wishlist-content ${viewMode}`}>
          {displayWishlist.map((item) => (
            <div key={item.id} className="wishlist-card">
              <div className="wishlist-card-image">
                <img
                  src={
                    item.accommodation?.images?.[0] ||
                    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"
                  }
                  alt={item.accommodation?.name || "Property"}
                />
                <button
                  className="remove-btn"
                  onClick={() =>
                    handleRemoveFromWishlist(item.accommodation?.id)
                  }
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>
                {item.accommodation?.is_verified && (
                  <span className="verified-badge">Verified</span>
                )}
              </div>

              <div className="wishlist-card-content">
                <div className="card-header">
                  <h3 className="property-name">{item.accommodation?.name}</h3>
                  <div className="rating">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>{item.accommodation?.rating}</span>
                    <span className="review-count">
                      ({item.accommodation?.review_count})
                    </span>
                  </div>
                </div>

                <div className="location">
                  <MapPin size={14} />
                  <span>{item.accommodation?.location}</span>
                </div>

                <div className="amenities-preview">
                  {item.accommodation?.amenities
                    ?.slice(0, 3)
                    .map((amenity, index) => (
                      <span key={index} className="amenity-tag">
                        {amenity}
                      </span>
                    ))}
                  {item.accommodation?.amenities?.length > 3 && (
                    <span className="amenity-more">
                      +{item.accommodation.amenities.length - 3} more
                    </span>
                  )}
                </div>

                <div className="card-footer">
                  <div className="price">
                    <span className="price-value">
                      KSh{" "}
                      {item.accommodation?.price_per_night?.toLocaleString()}
                    </span>
                    <span className="price-label">/night</span>
                  </div>

                  <div className="card-actions">
                    <button
                      className="book-btn"
                      onClick={() =>
                        (window.location.href = `/booking?accommodation_id=${item.accommodation?.id}`)
                      }
                    >
                      <Calendar size={16} />
                      Book Now
                    </button>
                    <button
                      className="details-btn"
                      onClick={() =>
                        (window.location.href = `/accommodations/${item.accommodation?.id}`)
                      }
                    >
                      <ArrowRight size={16} />
                      View Details
                    </button>
                  </div>
                </div>

                <div className="saved-date">
                  Saved on {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
