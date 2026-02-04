import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Star,
  Eye,
  Check,
  X,
  MoreVertical,
  MessageSquare,
  User,
  Home,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  Flag,
} from "lucide-react";

const Reviews = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [selectedReview, setSelectedReview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  // Mock data for reviews
  const reviews = [
    {
      id: 1,
      user: {
        name: "John Doe",
        avatar: null,
        email: "john.doe@email.com",
      },
      accommodation: {
        name: "University View Hostel",
        location: "123 Campus Drive",
      },
      rating: 5,
      comment:
        "Excellent hostel! Clean, well-maintained, and the staff is very friendly. Perfect location for students. Highly recommend!",
      date: "2024-02-15",
      status: "approved",
      helpful: 12,
      reported: false,
      response: null,
    },
    {
      id: 2,
      user: {
        name: "Sarah Johnson",
        avatar: null,
        email: "sarah.j@email.com",
      },
      accommodation: {
        name: "Central Student Living",
        location: "456 Main Street",
      },
      rating: 4,
      comment:
        "Good overall experience. The rooms are spacious and the facilities are decent. However, the WiFi could be better.",
      date: "2024-02-12",
      status: "approved",
      helpful: 8,
      reported: false,
      response:
        "Thank you for your feedback! We're working on improving our WiFi infrastructure.",
    },
    {
      id: 3,
      user: {
        name: "Mike Brown",
        avatar: null,
        email: "mike.brown@email.com",
      },
      accommodation: {
        name: "Campus Edge Apartments",
        location: "789 University Ave",
      },
      rating: 3,
      comment:
        "Average experience. The location is convenient but maintenance could be better. Some issues with plumbing.",
      date: "2024-02-10",
      status: "pending",
      helpful: 3,
      reported: false,
      response: null,
    },
    {
      id: 4,
      user: {
        name: "Emily Davis",
        avatar: null,
        email: "emily.d@email.com",
      },
      accommodation: {
        name: "Student Haven",
        location: "321 College Road",
      },
      rating: 5,
      comment:
        "Amazing place! The community atmosphere is wonderful and all amenities are top-notch. Will definitely stay again.",
      date: "2024-02-08",
      status: "approved",
      helpful: 15,
      reported: false,
      response:
        "We're thrilled you enjoyed your stay! Looking forward to having you back.",
    },
    {
      id: 5,
      user: {
        name: "David Wilson",
        avatar: null,
        email: "d.wilson@email.com",
      },
      accommodation: {
        name: "The Scholar's Residence",
        location: "555 Academic Way",
      },
      rating: 2,
      comment:
        "Disappointing experience. The photos don't match reality. Room was smaller than expected and quite noisy.",
      date: "2024-02-05",
      status: "pending",
      helpful: 5,
      reported: true,
      response: null,
    },
    {
      id: 6,
      user: {
        name: "Lisa Anderson",
        avatar: null,
        email: "lisa.a@email.com",
      },
      accommodation: {
        name: "Dormitory Plus",
        location: "888 Student Lane",
      },
      rating: 4,
      comment:
        "Solid choice for students. Good value for money with decent facilities. The study areas are particularly good.",
      date: "2024-02-03",
      status: "approved",
      helpful: 9,
      reported: false,
      response: null,
    },
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      approved: {
        backgroundColor: "#ecfdf5",
        color: "#059669",
      },
      pending: {
        backgroundColor: "#fffbeb",
        color: "#d97706",
      },
      rejected: {
        backgroundColor: "#fef2f2",
        color: "#dc2626",
      },
    };

    return (
      <span
        style={{
          ...styles.statusBadge,
          ...statusStyles[status],
        }}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderStars = (rating) => {
    return (
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={14}
            color={star <= rating ? "#f59e0b" : "#e5e7eb"}
            fill={star <= rating ? "#f59e0b" : "none"}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.accommodation.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || review.status === statusFilter;
    const matchesRating =
      ratingFilter === "all" || review.rating.toString() === ratingFilter;
    return matchesSearch && matchesStatus && matchesRating;
  });

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Handle view review details
  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowViewModal(true);
  };

  // Handle approve review
  const handleApproveReview = async (review) => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    alert(`Review #${review.id} approved successfully! (Demo)`);
    setIsProcessing(false);
  };

  // Handle reject review
  const handleRejectReview = async (review) => {
    if (
      window.confirm(`Are you sure you want to reject review #${review.id}?`)
    ) {
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert(`Review #${review.id} rejected! (Demo)`);
      setIsProcessing(false);
    }
  };

  // Handle approve from modal
  const handleApproveFromModal = async () => {
    if (selectedReview) {
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert(`Review #${selectedReview.id} approved successfully! (Demo)`);
      setShowViewModal(false);
      setSelectedReview(null);
      setIsProcessing(false);
    }
  };

  // Handle reject from modal
  const handleRejectFromModal = async () => {
    if (selectedReview) {
      if (window.confirm(`Are you sure you want to reject this review?`)) {
        setIsProcessing(true);
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert(`Review #${selectedReview.id} rejected! (Demo)`);
        setShowViewModal(false);
        setSelectedReview(null);
        setIsProcessing(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Reviews</h1>
          <p style={styles.subtitle}>
            Manage and moderate user reviews and ratings
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={styles.filterBar}>
        <div style={styles.searchWrapper}>
          <Search size={18} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search reviews..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.filterButtons}>
          <select
            style={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            style={styles.filterSelect}
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div style={styles.reviewsList}>
        {filteredReviews.map((review) => (
          <div key={review.id} style={styles.reviewCard}>
            <div style={styles.reviewHeader}>
              <div style={styles.userInfo}>
                <div style={styles.avatar}>
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      style={styles.avatarImg}
                    />
                  ) : (
                    <span style={styles.avatarText}>
                      {getInitials(review.user.name)}
                    </span>
                  )}
                </div>
                <div>
                  <span style={styles.userName}>{review.user.name}</span>
                  <div style={styles.reviewMeta}>
                    {renderStars(review.rating)}
                    <span style={styles.reviewDate}>
                      {new Date(review.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {getStatusBadge(review.status)}
            </div>

            <div style={styles.accommodationInfo}>
              <Home size={16} color="#64748b" />
              <span style={styles.accommodationName}>
                {review.accommodation.name}
              </span>
            </div>

            <div style={styles.reviewContent}>
              <p style={styles.reviewText}>{review.comment}</p>
            </div>

            <div style={styles.reviewFooter}>
              <div style={styles.reviewStats}>
                <span style={styles.helpfulCount}>
                  <ThumbsUp size={14} color="#64748b" />
                  {review.helpful} helpful
                </span>
                {review.reported && (
                  <span style={styles.reportedBadge}>
                    <Flag size={14} />
                    Reported
                  </span>
                )}
              </div>
              <div style={styles.reviewActions}>
                <button
                  style={styles.actionBtn}
                  onClick={() => handleViewReview(review)}
                >
                  <Eye size={16} color="#64748b" />
                </button>
                {review.status === "pending" && (
                  <>
                    <button
                      style={styles.approveBtn}
                      onClick={() => handleApproveReview(review)}
                      disabled={isProcessing}
                    >
                      <Check size={16} color="#ffffff" />
                    </button>
                    <button
                      style={styles.rejectBtn}
                      onClick={() => handleRejectReview(review)}
                      disabled={isProcessing}
                    >
                      <X size={16} color="#ffffff" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {review.response && (
              <div style={styles.responseSection}>
                <div style={styles.responseHeader}>
                  <span style={styles.responseLabel}>Host Response</span>
                </div>
                <p style={styles.responseText}>{review.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Review Details</h2>
              <button
                style={styles.closeBtn}
                onClick={() => setSelectedReview(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div style={styles.modalContent}>
              <div style={styles.reviewDetail}>
                <div style={styles.detailHeader}>
                  <div style={styles.detailUser}>
                    <div style={styles.detailAvatar}>
                      <span style={styles.detailAvatarText}>
                        {getInitials(selectedReview.user.name)}
                      </span>
                    </div>
                    <div>
                      <h3 style={styles.detailUserName}>
                        {selectedReview.user.name}
                      </h3>
                      <p style={styles.detailUserEmail}>
                        {selectedReview.user.email}
                      </p>
                    </div>
                  </div>
                  <div style={styles.detailRating}>
                    {renderStars(selectedReview.rating)}
                    <span style={styles.detailDate}>
                      {new Date(selectedReview.date).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>
                </div>

                <div style={styles.detailAccommodation}>
                  <Home size={18} color="#64748b" />
                  <div>
                    <h4 style={styles.detailAccommodationName}>
                      {selectedReview.accommodation.name}
                    </h4>
                    <p style={styles.detailAccommodationLocation}>
                      {selectedReview.accommodation.location}
                    </p>
                  </div>
                </div>

                <div style={styles.detailComment}>
                  <h4 style={styles.detailCommentTitle}>Review</h4>
                  <p style={styles.detailCommentText}>
                    {selectedReview.comment}
                  </p>
                </div>

                <div style={styles.detailStats}>
                  <div style={styles.detailStat}>
                    <span style={styles.detailStatLabel}>Status</span>
                    {getStatusBadge(selectedReview.status)}
                  </div>
                  <div style={styles.detailStat}>
                    <span style={styles.detailStatLabel}>Helpful Votes</span>
                    <span style={styles.detailStatValue}>
                      {selectedReview.helpful}
                    </span>
                  </div>
                  <div style={styles.detailStat}>
                    <span style={styles.detailStatLabel}>Reported</span>
                    <span style={styles.detailStatValue}>
                      {selectedReview.reported ? "Yes" : "No"}
                    </span>
                  </div>
                </div>

                {selectedReview.response && (
                  <div style={styles.detailResponse}>
                    <h4 style={styles.detailResponseTitle}>Host Response</h4>
                    <p style={styles.detailResponseText}>
                      {selectedReview.response}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button
                style={styles.cancelBtn}
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedReview(null);
                }}
              >
                Close
              </button>
              {selectedReview?.status === "pending" && (
                <>
                  <button
                    style={styles.rejectBtnModal}
                    onClick={handleRejectFromModal}
                    disabled={isProcessing}
                  >
                    Reject Review
                  </button>
                  <button
                    style={styles.approveBtnModal}
                    onClick={handleApproveFromModal}
                    disabled={isProcessing}
                  >
                    Approve Review
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f8fafc",
    minHeight: "100%",
  },
  header: {
    marginBottom: "24px",
  },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1e293b",
    margin: "0 0 8px 0",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
    margin: 0,
  },
  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    gap: "16px",
    flexWrap: "wrap",
  },
  searchWrapper: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    flex: 1,
    maxWidth: "400px",
  },
  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "14px",
    color: "#334155",
    backgroundColor: "transparent",
  },
  filterButtons: {
    display: "flex",
    gap: "12px",
  },
  filterSelect: {
    padding: "8px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    color: "#334155",
    backgroundColor: "#ffffff",
    cursor: "pointer",
    outline: "none",
  },
  reviewsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  reviewCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarText: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#0369a1",
  },
  userName: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
  },
  reviewMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "4px",
  },
  stars: {
    display: "flex",
    gap: "2px",
  },
  reviewDate: {
    fontSize: "13px",
    color: "#64748b",
  },
  statusBadge: {
    padding: "4px 10px",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 500,
  },
  accommodationInfo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
    fontSize: "14px",
    color: "#64748b",
  },
  accommodationName: {
    fontWeight: 500,
  },
  reviewContent: {
    marginBottom: "16px",
  },
  reviewText: {
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.5",
    margin: 0,
  },
  reviewFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewStats: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  helpfulCount: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#64748b",
  },
  reportedBadge: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "4px 8px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 500,
  },
  reviewActions: {
    display: "flex",
    gap: "8px",
  },
  actionBtn: {
    padding: "6px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  approveBtn: {
    padding: "6px",
    backgroundColor: "#059669",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  rejectBtn: {
    padding: "6px",
    backgroundColor: "#dc2626",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  responseSection: {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: "#f0f9ff",
    borderRadius: "8px",
    border: "1px solid #bae6fd",
  },
  responseHeader: {
    marginBottom: "8px",
  },
  responseLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#0369a1",
  },
  responseText: {
    fontSize: "14px",
    color: "#334155",
    margin: 0,
    lineHeight: "1.5",
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
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflow: "auto",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderBottom: "1px solid #e2e8f0",
  },
  modalTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
  },
  closeBtn: {
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    color: "#64748b",
  },
  modalContent: {
    padding: "20px",
  },
  reviewDetail: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  detailHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailUser: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  detailAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  detailAvatarText: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#0369a1",
  },
  detailUserName: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  detailUserEmail: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  detailRating: {
    textAlign: "right",
  },
  detailDate: {
    display: "block",
    fontSize: "13px",
    color: "#64748b",
    marginTop: "8px",
  },
  detailAccommodation: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  detailAccommodationName: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  detailAccommodationLocation: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  detailComment: {
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  detailCommentTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 12px 0",
  },
  detailCommentText: {
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.6",
    margin: 0,
  },
  detailStats: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
  },
  detailStat: {
    textAlign: "center",
  },
  detailStatLabel: {
    display: "block",
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "4px",
  },
  detailStatValue: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
  },
  detailResponse: {
    padding: "16px",
    backgroundColor: "#f0f9ff",
    borderRadius: "8px",
    border: "1px solid #bae6fd",
  },
  detailResponseTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#0369a1",
    margin: "0 0 12px 0",
  },
  detailResponseText: {
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.6",
    margin: 0,
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "20px",
    borderTop: "1px solid #e2e8f0",
  },
  cancelBtn: {
    padding: "10px 20px",
    backgroundColor: "#f1f5f9",
    color: "#64748b",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  rejectBtnModal: {
    padding: "10px 20px",
    backgroundColor: "#dc2626",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  approveBtnModal: {
    padding: "10px 20px",
    backgroundColor: "#059669",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
};

export default Reviews;
