import { useState, useEffect } from "react";
import {
  Star,
  MessageSquare,
  Calendar,
  MapPin,
  Loader2,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Plus,
} from "lucide-react";
import studentApi from "../../../../api/studentApi";

const StudentReviews = () => {
  // State
  const [myReviews, setMyReviews] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("reviews");
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch reviews on mount
  useEffect(() => {
    fetchReviews();
    fetchPendingReviews();
  }, []);

  // Fetch my reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentApi.getMyReviews({
        page: pagination.page,
        limit: 10,
      });
      setMyReviews(response.reviews || []);
      setPagination((prev) => ({
        ...prev,
        total: response.total || 0,
        pages: response.pages || 1,
      }));
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews");
      // Mock data fallback
      setMyReviews(getMockReviews());
    } finally {
      setLoading(false);
    }
  };

  // Fetch pending reviews (bookings that can be reviewed)
  const fetchPendingReviews = async () => {
    try {
      const response = await studentApi.getPendingReviews();
      setPendingReviews(response.pending_reviews || []);
    } catch (err) {
      console.error("Error fetching pending reviews:", err);
      setPendingReviews([]);
    }
  };

  // Open review modal
  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setReviewForm({ rating: 5, comment: "" });
    setShowModal(true);
  };

  // Close review modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
    setReviewForm({ rating: 5, comment: "" });
  };

  // Submit review
  const handleSubmitReview = async () => {
    if (!selectedBooking) return;

    try {
      setSubmitting(true);
      await studentApi.createReview({
        booking_id: selectedBooking.booking_id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      // Refresh data
      await fetchReviews();
      await fetchPendingReviews();
      handleCloseModal();
      setSuccess("Review submitted successfully!");
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(err.response?.data?.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await studentApi.deleteReview(reviewId);
      setMyReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setSuccess("Review deleted successfully.");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review. Please try again.");
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      pending: {
        icon: Clock,
        color: "#f59e0b",
        bgColor: "#fef3c7",
        text: "Pending",
      },
      approved: {
        icon: CheckCircle,
        color: "#10b981",
        bgColor: "#d1fae5",
        text: "Approved",
      },
      rejected: {
        icon: XCircle,
        color: "#ef4444",
        bgColor: "#fee2e2",
        text: "Rejected",
      },
    };

    const { icon: Icon, color, bgColor, text } = config[status] || config.pending;

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 10px",
          backgroundColor: bgColor,
          color: color,
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 600,
        }}
      >
        <Icon size={12} />
        {text}
      </span>
    );
  };

  // Render stars
  const renderStars = (rating, size = 16) => {
    return (
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            color={star <= rating ? "#f59e0b" : "#d1d5db"}
            fill={star <= rating ? "#f59e0b" : "none"}
          />
        ))}
      </div>
    );
  };

  if (loading && myReviews.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2
          size={40}
          color="#3b82f6"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <p>Loading reviews...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Reviews</h1>
          <p style={styles.subtitle}>
            Reviews you&apos;ve written for accommodations
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div style={styles.successBanner}>
          <CheckCircle size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "reviews" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("reviews")}
        >
          My Reviews ({myReviews.length})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(activeTab === "pending" ? styles.tabActive : {}),
          }}
          onClick={() => setActiveTab("pending")}
        >
          Pending Reviews ({pendingReviews.length})
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div style={styles.errorContainer}>
          <p>{error}</p>
          <button style={styles.retryButton} onClick={fetchReviews}>
            Retry
          </button>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <>
          {myReviews.length > 0 ? (
            <div style={styles.reviewsList}>
              {myReviews.map((review) => (
                <div key={review.id} style={styles.reviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewHostel}>
                      <h3 style={styles.reviewHostelName}>
                        {review.hostel_name}
                      </h3>
                      <div style={styles.reviewLocation}>
                        <MapPin size={14} color="#6b7280" />
                        <span>{review.hostel_location}</span>
                      </div>
                    </div>
                    <div style={styles.reviewStatus}>
                      {getStatusBadge(review.status)}
                    </div>
                  </div>

                  <div style={styles.reviewRating}>
                    {renderStars(review.rating)}
                    <span style={styles.ratingValue}>{review.rating}/5</span>
                  </div>

                  {review.comment && (
                    <p style={styles.reviewComment}>{review.comment}</p>
                  )}

                  <div style={styles.reviewFooter}>
                    <div style={styles.reviewMeta}>
                      <Calendar size={14} color="#6b7280" />
                      <span>
                        Stay:{" "}
                        {review.booking_check_in
                          ? new Date(review.booking_check_in).toLocaleDateString()
                          : "N/A"}
                        {review.booking_check_out &&
                          ` - ${new Date(
                            review.booking_check_out,
                          ).toLocaleDateString()}`}
                      </span>
                    </div>
                    <div style={styles.reviewActions}>
                      {review.status === "pending" && (
                        <>
                          <button
                            style={styles.actionButton}
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={styles.reviewDate}>
                    Reviewed on{" "}
                    {review.created_at
                      ? new Date(review.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "N/A"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <MessageSquare size={64} color="#d1d5db" />
              <h3 style={styles.emptyStateTitle}>No reviews yet</h3>
              <p style={styles.emptyStateText}>
                After completing a booking, you can leave a review to help other
                students
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={styles.pagination}>
              <button
                style={{
                  ...styles.pageButton,
                  ...(pagination.page === 1 ? styles.pageButtonDisabled : {}),
                }}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              <span style={styles.pageInfo}>
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                style={{
                  ...styles.pageButton,
                  ...(pagination.page === pagination.pages
                    ? styles.pageButtonDisabled
                    : {}),
                }}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Pending Reviews Tab */}
      {activeTab === "pending" && (
        <>
          {pendingReviews.length > 0 ? (
            <div style={styles.pendingList}>
              {pendingReviews.map((booking) => (
                <div key={booking.booking_id} style={styles.pendingCard}>
                  <div style={styles.pendingInfo}>
                    <h3 style={styles.pendingHostelName}>
                      {booking.hostel_name}
                    </h3>
                    <div style={styles.pendingMeta}>
                      <div style={styles.pendingDate}>
                        <Calendar size={14} color="#6b7280" />
                        <span>
                          {booking.check_in
                            ? new Date(booking.check_in).toLocaleDateString()
                            : "N/A"}{" "}
                          -{" "}
                          {booking.check_out
                            ? new Date(booking.check_out).toLocaleDateString()
                            : "Present"}
                        </span>
                      </div>
                      {booking.hostel_location && (
                        <div style={styles.pendingLocation}>
                          <MapPin size={14} color="#6b7280" />
                          <span>{booking.hostel_location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    style={styles.reviewButton}
                    onClick={() => handleOpenReview(booking)}
                  >
                    <Plus size={16} />
                    Write Review
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <CheckCircle size={64} color="#10b981" />
              <h3 style={styles.emptyStateTitle}>All caught up!</h3>
              <p style={styles.emptyStateText}>
                You&apos;ve reviewed all your completed bookings
              </p>
            </div>
          )}
        </>
      )}

      {/* Review Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={handleCloseModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Write a Review</h2>
              <button style={styles.modalClose} onClick={handleCloseModal}>
                ×
              </button>
            </div>

            <div style={styles.modalContent}>
              {selectedBooking && (
                <div style={styles.modalHostelInfo}>
                  <h3>{selectedBooking.hostel_name}</h3>
                  <p>
                    {selectedBooking.check_in
                      ? new Date(selectedBooking.check_in).toLocaleDateString()
                      : "N/A"}{" "}
                    -{" "}
                    {selectedBooking.check_out
                      ? new Date(selectedBooking.check_out).toLocaleDateString()
                      : "Present"}
                  </p>
                </div>
              )}

              {/* Rating */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Your Rating</label>
                <div style={styles.starRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      style={styles.starButton}
                      onClick={() =>
                        setReviewForm((prev) => ({ ...prev, rating: star }))
                      }
                    >
                      <Star
                        size={32}
                        color={
                          star <= reviewForm.rating ? "#f59e0b" : "#d1d5db"
                        }
                        fill={star <= reviewForm.rating ? "#f59e0b" : "none"}
                      />
                    </button>
                  ))}
                </div>
                <span style={styles.ratingLabel}>
                  {reviewForm.rating === 5
                    ? "Excellent"
                    : reviewForm.rating === 4
                      ? "Very Good"
                      : reviewForm.rating === 3
                        ? "Average"
                        : reviewForm.rating === 2
                          ? "Poor"
                          : "Terrible"}
                </span>
              </div>

              {/* Comment */}
              <div style={styles.formGroup}>
                <label style={styles.label}>Your Review (Optional)</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Share your experience at this accommodation..."
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div style={styles.modalActions}>
                <button style={styles.cancelButton} onClick={handleCloseModal}>
                  Cancel
                </button>
                <button
                  style={{
                    ...styles.submitButton,
                    ...(submitting ? styles.submitButtonDisabled : {}),
                  }}
                  onClick={handleSubmitReview}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2
                        size={18}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// Mock data for demo
const getMockReviews = () => [
  {
    id: 1,
    hostel_name: "University View Hostel",
    hostel_location: "123 College Ave, Nairobi",
    rating: 5,
    comment: "Great accommodation! Clean rooms and friendly staff.",
    status: "approved",
    booking_check_in: "2024-01-15",
    booking_check_out: "2024-02-15",
    created_at: "2024-02-16T10:00:00Z",
  },
  {
    id: 2,
    hostel_name: "Central Student Living",
    hostel_location: "456 Main Street, Nairobi",
    rating: 4,
    comment: "Good value for money. Slightly noisy during the day but overall nice.",
    status: "pending",
    booking_check_in: "2024-02-01",
    booking_check_out: "2024-02-28",
    created_at: "2024-03-01T14:30:00Z",
  },
];

const styles = {
  container: {
    maxWidth: "1000px",
    padding: "0 24px",
    animation: "fadeIn 0.3s ease",
  },
  header: {
    marginBottom: "32px",
  },
  successBanner: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "24px",
    border: "1px solid #86efac",
    animation: "fadeIn 0.3s ease",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
  },
  tabs: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "16px",
  },
  tab: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  tabActive: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderColor: "#3b82f6",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "400px",
    gap: "16px",
  },
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "200px",
    gap: "16px",
    color: "#ef4444",
  },
  retryButton: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "32px",
  },
  reviewCard: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    transition: "all 0.2s ease",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  reviewHostel: {
    flex: 1,
  },
  reviewHostelName: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  reviewLocation: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#6b7280",
  },
  reviewRating: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  ratingValue: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  reviewComment: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: 1.6,
    marginBottom: "16px",
  },
  reviewFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  reviewMeta: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    color: "#6b7280",
  },
  reviewActions: {
    display: "flex",
    gap: "8px",
  },
  actionButton: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    padding: "6px 12px",
    backgroundColor: "#fee2e2",
    color: "#ef4444",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  reviewDate: {
    fontSize: "12px",
    color: "#9ca3af",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
  },
  pendingList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "32px",
  },
  pendingCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    transition: "all 0.2s ease",
  },
  pendingInfo: {
    flex: 1,
  },
  pendingHostelName: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  pendingMeta: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  pendingDate: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#6b7280",
  },
  pendingLocation: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#6b7280",
  },
  reviewButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "10px 16px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "64px 24px",
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
  },
  emptyStateTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#374151",
    marginTop: "16px",
  },
  emptyStateText: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "8px",
    maxWidth: "400px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
  },
  pageButton: {
    padding: "10px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  pageButtonDisabled: {
    backgroundColor: "#e5e7eb",
    color: "#9ca3af",
    cursor: "not-allowed",
  },
  pageInfo: {
    fontSize: "14px",
    color: "#6b7280",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: "20px",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    borderBottom: "1px solid #e5e7eb",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  modalClose: {
    backgroundColor: "transparent",
    border: "none",
    fontSize: "28px",
    color: "#6b7280",
    cursor: "pointer",
    lineHeight: 1,
  },
  modalContent: {
    padding: "24px",
  },
  modalHostelInfo: {
    backgroundColor: "#f9fafb",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  formGroup: {
    marginBottom: "24px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "12px",
  },
  starRating: {
    display: "flex",
    gap: "8px",
    justifyContent: "center",
    marginBottom: "8px",
  },
  starButton: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "0",
  },
  ratingLabel: {
    display: "block",
    textAlign: "center",
    fontSize: "14px",
    color: "#6b7280",
  },
  textarea: {
    width: "100%",
    padding: "12px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    resize: "vertical",
    fontFamily: "inherit",
  },
  modalActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
  cancelButton: {
    padding: "12px 24px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  submitButton: {
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  submitButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
};

export default StudentReviews;

