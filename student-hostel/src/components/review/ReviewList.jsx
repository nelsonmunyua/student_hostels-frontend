import { useState, useMemo } from "react";
import { Star, Filter, ChevronDown } from "lucide-react";
import ReviewCard from "./ReviewCard";

const ReviewList = ({
  reviews = [],
  averageRating = 0,
  totalReviews = 0,
  onLike,
  onReport,
  onDelete,
  canDelete = false,
  showFilters = true,
}) => {
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState(0);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      const rating = review.rating || 0;
      if (rating >= 1 && rating <= 5) {
        distribution[Math.floor(rating)]++;
      }
    });
    return distribution;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    if (filterRating > 0) {
      filtered = filtered.filter(
        (review) => Math.floor(review.rating) === filterRating,
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return (
          new Date(b.created_at || b.createdAt) -
          new Date(a.created_at || a.createdAt)
        );
      } else if (sortBy === "highest") {
        return b.rating - a.rating;
      } else if (sortBy === "lowest") {
        return a.rating - b.rating;
      }
      return 0;
    });

    return filtered;
  }, [reviews, sortBy, filterRating]);

  if (reviews.length === 0) {
    return (
      <div style={emptyStateStyle}>
        <div style={emptyIconStyle}>⭐</div>
        <h3 style={emptyTitleStyle}>No reviews yet</h3>
        <p style={emptyTextStyle}>
          Be the first to share your experience with this accommodation!
        </p>
      </div>
    );
  }

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  };

  const summaryStyle = {
    display: "grid",
    gridTemplateColumns: "200px 1fr",
    gap: "32px",
    padding: "24px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
  };

  const averageRatingStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  };

  const ratingNumberStyle = {
    fontSize: "48px",
    fontWeight: 700,
    color: "#1e293b",
    lineHeight: 1,
  };

  const starsStyle = {
    display: "flex",
    gap: "4px",
  };

  const totalReviewsStyle = {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  };

  const distributionStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  };

  const distributionRowStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const distributionLabelStyle = {
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    width: "40px",
  };

  const distributionBarStyle = {
    flex: 1,
    height: "8px",
    backgroundColor: "#f1f5f9",
    borderRadius: "4px",
    overflow: "hidden",
  };

  const distributionFillStyle = {
    height: "100%",
    backgroundColor: "#f59e0b",
    borderRadius: "4px",
    transition: "width 0.3s",
  };

  const distributionCountStyle = {
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    width: "30px",
    textAlign: "right",
  };

  const controlsStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  };

  const filterButtonStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#334155",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const sortSelectStyle = {
    padding: "10px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#334155",
    cursor: "pointer",
    outline: "none",
  };

  const filterPanelStyle = {
    padding: "16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
  };

  const filterLabelStyle = {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "12px",
  };

  const ratingFiltersStyle = {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  };

  const ratingFilterButtonStyle = {
    padding: "8px 16px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  const ratingFilterButtonActiveStyle = {
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    borderColor: "#3b82f6",
  };

  const reviewsListStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  const noResultsStyle = {
    padding: "40px",
    textAlign: "center",
    color: "#64748b",
  };

  const loadMoreStyle = {
    display: "flex",
    justifyContent: "center",
    paddingTop: "16px",
  };

  const loadMoreButtonStyle = {
    padding: "12px 24px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#3b82f6",
    cursor: "pointer",
    transition: "all 0.2s",
  };

  return (
    <div style={containerStyle}>
      <div style={summaryStyle}>
        <div style={averageRatingStyle}>
          <div style={ratingNumberStyle}>{averageRating.toFixed(1)}</div>
          <div style={starsStyle}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                color={
                  star <= Math.round(averageRating) ? "#f59e0b" : "#e5e7eb"
                }
                fill={star <= Math.round(averageRating) ? "#f59e0b" : "none"}
              />
            ))}
          </div>
          <p style={totalReviewsStyle}>
            {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </p>
        </div>

        <div style={distributionStyle}>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating] || 0;
            const percentage =
              totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <div key={rating} style={distributionRowStyle}>
                <span style={distributionLabelStyle}>{rating} ★</span>
                <div style={distributionBarStyle}>
                  <div
                    style={{
                      ...distributionFillStyle,
                      width: `${percentage}%`,
                    }}
                  />
                </div>
                <span style={distributionCountStyle}>{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {showFilters && (
        <div style={controlsStyle}>
          <button
            style={filterButtonStyle}
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          >
            <Filter size={16} />
            Filters
            <ChevronDown
              size={16}
              style={{
                transform: showFiltersPanel ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s",
              }}
            />
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={sortSelectStyle}
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      )}

      {showFilters && showFiltersPanel && (
        <div style={filterPanelStyle}>
          <p style={filterLabelStyle}>Filter by rating:</p>
          <div style={ratingFiltersStyle}>
            <button
              style={{
                ...ratingFilterButtonStyle,
                ...(filterRating === 0 && ratingFilterButtonActiveStyle),
              }}
              onClick={() => setFilterRating(0)}
            >
              All
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                style={{
                  ...ratingFilterButtonStyle,
                  ...(filterRating === rating && ratingFilterButtonActiveStyle),
                }}
                onClick={() => setFilterRating(rating)}
              >
                {rating} ★
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={reviewsListStyle}>
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onLike={onLike}
              onReport={onReport}
              onDelete={onDelete}
              canDelete={canDelete}
            />
          ))
        ) : (
          <div style={noResultsStyle}>
            <p>No reviews match your filters</p>
          </div>
        )}
      </div>

      {filteredReviews.length < reviews.length && (
        <div style={loadMoreStyle}>
          <button style={loadMoreButtonStyle}>Load More Reviews</button>
        </div>
      )}
    </div>
  );
};

const emptyStateStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "60px 20px",
  textAlign: "center",
};

const emptyIconStyle = {
  fontSize: "64px",
  marginBottom: "16px",
  opacity: 0.5,
};

const emptyTitleStyle = {
  fontSize: "20px",
  fontWeight: 600,
  color: "#1e293b",
  marginBottom: "8px",
};

const emptyTextStyle = {
  fontSize: "14px",
  color: "#64748b",
  maxWidth: "400px",
};

export default ReviewList;
