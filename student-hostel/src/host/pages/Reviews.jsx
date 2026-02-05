import { useState } from "react";

const HostReviews = () => {
  const [reviews] = useState([
    {
      id: 1,
      guest: "John Smith",
      property: "University View Hostel",
      rating: 5,
      date: "2024-02-10",
      comment:
        "Excellent stay! The room was clean, location was perfect, and the staff was very helpful. Would definitely recommend to other students.",
      response:
        "Thank you so much for your kind words! We're happy you enjoyed your stay.",
    },
    {
      id: 2,
      guest: "Emily Johnson",
      property: "Central Student Living",
      rating: 4,
      date: "2024-02-08",
      comment:
        "Great location and facilities. The only minor issue was slow WiFi during peak hours, but overall a good experience.",
      response:
        "Thanks for the feedback! We've upgraded our WiFi infrastructure to improve speed.",
    },
    {
      id: 3,
      guest: "Michael Brown",
      property: "University View Hostel",
      rating: 5,
      date: "2024-02-05",
      comment:
        "Perfect for students! The study rooms and common areas are well-maintained. Made some great friends here.",
      response: null,
    },
    {
      id: 4,
      guest: "Sarah Davis",
      property: "Campus Edge Apartments",
      rating: 3,
      date: "2024-02-01",
      comment:
        "Decent place but could use some improvements in maintenance. The kitchen equipment could be updated.",
      response:
        "Thank you for your honest feedback. We're working on the maintenance schedule.",
    },
    {
      id: 5,
      guest: "David Wilson",
      property: "Central Student Living",
      rating: 5,
      date: "2024-01-28",
      comment:
        "Best hostel experience I've had! The monthly events are a great way to meet people. Very affordable too.",
      response:
        "We're thrilled you had a great experience! See you at our next event!",
    },
  ]);

  const [filter, setFilter] = useState("all");

  const filteredReviews =
    filter === "all"
      ? reviews
      : filter === "responded"
        ? reviews.filter((r) => r.response)
        : reviews.filter((r) => !r.response);

  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  const ratingBreakdown = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Reviews & Ratings</h1>
          <p style={styles.subtitle}>Manage guest reviews and responses</p>
        </div>
        <select
          style={styles.filterSelect}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Reviews</option>
          <option value="responded">Responded</option>
          <option value="pending">Pending Response</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Average Rating</span>
            <span style={styles.stars}>⭐</span>
          </div>
          <span style={styles.statValue}>{averageRating.toFixed(1)}</span>
          <span style={styles.statSubtext}>out of 5</span>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Total Reviews</span>
          </div>
          <span style={styles.statValue}>{reviews.length}</span>
          <span style={styles.statSubtext}>All properties</span>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>Response Rate</span>
          </div>
          <span style={styles.statValue}>
            {Math.round(
              (reviews.filter((r) => r.response).length / reviews.length) * 100,
            )}
            %
          </span>
          <span style={styles.statSubtext}>Responded to</span>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <span style={styles.statLabel}>5-Star Reviews</span>
          </div>
          <span style={styles.statValue}>{ratingBreakdown[5]}</span>
          <span style={styles.statSubtext}>Excellent</span>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div style={styles.ratingSection}>
        <h2 style={styles.sectionTitle}>Rating Breakdown</h2>
        <div style={styles.ratingBars}>
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} style={styles.ratingBar}>
              <span style={styles.ratingLabel}>{star} stars</span>
              <div style={styles.barContainer}>
                <div
                  style={{
                    ...styles.barFill,
                    width: `${(ratingBreakdown[star] / reviews.length) * 100}%`,
                  }}
                />
              </div>
              <span style={styles.ratingCount}>{ratingBreakdown[star]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div style={styles.reviewsSection}>
        <h2 style={styles.sectionTitle}>Recent Reviews</h2>
        <div style={styles.reviewsList}>
          {filteredReviews.map((review) => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div style={styles.reviewAuthor}>
                  <span style={styles.authorAvatar}>
                    {review.guest.charAt(0)}
                  </span>
                  <div style={styles.authorInfo}>
                    <span style={styles.authorName}>{review.guest}</span>
                    <span style={styles.reviewDate}>{review.date}</span>
                  </div>
                </div>
                <div style={styles.reviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      style={{
                        color: star <= review.rating ? "#fbbf24" : "#d1d5db",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div style={styles.reviewProperty}>📍 {review.property}</div>
              <p style={styles.reviewComment}>{review.comment}</p>
              {review.response ? (
                <div style={styles.responseBox}>
                  <span style={styles.responseLabel}>Your Response:</span>
                  <p style={styles.responseText}>{review.response}</p>
                </div>
              ) : (
                <div style={styles.responseBox}>
                  <button style={styles.respondBtn}>Respond to Review</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    animation: "fadeIn 0.4s ease-out",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    margin: 0,
  },
  filterSelect: {
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#374151",
    backgroundColor: "#ffffff",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    textAlign: "center",
  },
  statHeader: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#6b7280",
  },
  stars: {
    fontSize: "16px",
  },
  statValue: {
    display: "block",
    fontSize: "36px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  statSubtext: {
    fontSize: "13px",
    color: "#6b7280",
  },
  ratingSection: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    marginBottom: "32px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "20px",
  },
  ratingBars: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  ratingBar: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  ratingLabel: {
    width: "60px",
    fontSize: "14px",
    color: "#6b7280",
  },
  barContainer: {
    flex: 1,
    height: "8px",
    backgroundColor: "#f3f4f6",
    borderRadius: "4px",
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#fbbf24",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  ratingCount: {
    width: "30px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    textAlign: "right",
  },
  reviewsSection: {
    marginTop: "32px",
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  reviewCard: {
    backgroundColor: "#ffffff",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  reviewAuthor: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  authorAvatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "18px",
  },
  authorInfo: {
    display: "flex",
    flexDirection: "column",
  },
  authorName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1a1a1a",
  },
  reviewDate: {
    fontSize: "13px",
    color: "#6b7280",
  },
  reviewRating: {
    fontSize: "16px",
  },
  reviewProperty: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  reviewComment: {
    fontSize: "14px",
    color: "#374151",
    lineHeight: "1.6",
    marginBottom: "16px",
  },
  responseBox: {
    backgroundColor: "#f9fafb",
    padding: "16px",
    borderRadius: "8px",
    borderLeft: "3px solid #0369a1",
  },
  responseLabel: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#0369a1",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    display: "block",
    marginBottom: "8px",
  },
  responseText: {
    fontSize: "14px",
    color: "#374151",
    margin: 0,
    fontStyle: "italic",
  },
  respondBtn: {
    padding: "10px 20px",
    backgroundColor: "#0369a1",
    color: "#ffffff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s",
  },
};

export default HostReviews;
