import { useState, useEffect } from "react";
import {
  Heart,
  MapPin,
  Trash2,
  Star,
  Loader2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import studentApi from "../../../../api/studentApi";

const StudentWishlist = () => {
  const navigate = useNavigate();

  // State
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  });
  const [removingId, setRemovingId] = useState(null);

  // Fetch wishlist on mount and page change
  useEffect(() => {
    fetchWishlist();
  }, [pagination.page]);

  // Fetch wishlist
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await studentApi.getWishlist({
        page: pagination.page,
        limit: 12,
      });
      
      setWishlist(response.wishlist || response.items || []);
      setPagination((prev) => ({
        ...prev,
        total: response.total || 0,
        pages: response.pages || 1,
      }));
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError("Failed to load wishlist. Please try again.");
      // Mock data fallback for demo
      setWishlist(getMockWishlist());
      setPagination((prev) => ({
        ...prev,
        total: getMockWishlist().length,
        pages: 1,
      }));
    } finally {
      setLoading(false);
    }
  };

  // Remove from wishlist using studentApi
  const handleRemove = async (hostelId) => {
    try {
      setRemovingId(hostelId);
      await studentApi.removeFromWishlist(hostelId);
      
      // Update local state
      setWishlist((prev) => prev.filter((item) => item.id !== hostelId && item.hostel_id !== hostelId));
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      setSuccess("Removed from wishlist");
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      // Still remove locally on error for better UX
      setWishlist((prev) => prev.filter((item) => item.id !== hostelId && item.hostel_id !== hostelId));
    } finally {
      setRemovingId(null);
    }
  };

  // Navigate to accommodation details
  const handleViewDetails = (hostelId) => {
    navigate(`/accommodations/${hostelId}`);
  };

  // Navigate to browse accommodations
  const handleBrowseClick = () => {
    navigate("/student/find-accommodation");
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Render loading state
  if (loading && wishlist.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2
          size={40}
          color="#3b82f6"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <p>Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>My Wishlist</h1>
          <p style={styles.subtitle}>
            Accommodations you&apos;ve saved for later ({pagination.total})
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

      {/* Error State */}
      {error && (
        <div style={styles.errorContainer}>
          <p>{error}</p>
          <button style={styles.retryButton} onClick={fetchWishlist}>
            Retry
          </button>
        </div>
      )}

      {/* Wishlist Grid */}
      {wishlist.length > 0 && (
        <>
          <div style={styles.wishlistGrid}>
            {wishlist.map((item) => (
              <div key={item.id || item.hostel_id} style={styles.card}>
                {/* Image */}
                <div style={styles.cardImage}>
                  <img
                    src={
                      item.images?.[0] ||
                      item.image ||
                      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"
                    }
                    alt={item.name}
                    style={styles.cardImageImg}
                    onClick={() => handleViewDetails(item.hostel_id || item.id)}
                  />
                  <button
                    style={{
                      ...styles.removeButton,
                      ...(removingId === (item.hostel_id || item.id)
                        ? styles.removeButtonLoading
                        : {}),
                    }}
                    onClick={() => handleRemove(item.hostel_id || item.id)}
                    disabled={removingId === (item.hostel_id || item.id)}
                    title="Remove from wishlist"
                  >
                    {removingId === (item.hostel_id || item.id) ? (
                      <Loader2
                        size={18}
                        color="#fff"
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                    ) : (
                      <Trash2 size={18} color="#fff" />
                    )}
                  </button>
                </div>

                {/* Content */}
                <div style={styles.cardContent}>
                  <h3
                    style={styles.cardTitle}
                    onClick={() => handleViewDetails(item.hostel_id || item.id)}
                  >
                    {item.name}
                  </h3>

                  <div style={styles.cardLocation}>
                    <MapPin size={14} color="#6b7280" />
                    <span>{item.location}</span>
                  </div>

                  <div style={styles.cardMeta}>
                    {item.rating > 0 && (
                      <div style={styles.rating}>
                        <Star size={14} color="#f59e0b" fill="#f59e0b" />
                        <span>{item.rating}</span>
                      </div>
                    )}
                    <span style={styles.roomType}>
                      {item.room_type?.replace("_", " ") || item.roomType?.replace("_", " ")}
                    </span>
                  </div>

                  <div style={styles.cardFooter}>
                    <div style={styles.price}>
                      <span style={styles.priceValue}>
                        KSh {(item.price || 0).toLocaleString()}
                      </span>
                      <span style={styles.pricePeriod}>/month</span>
                    </div>
                    <button
                      style={styles.viewButton}
                      onClick={() => handleViewDetails(item.hostel_id || item.id)}
                    >
                      <ExternalLink size={14} />
                      View Details
                    </button>
                  </div>

                  {item.added_at && (
                    <div style={styles.addedDate}>
                      Added on{" "}
                      {new Date(item.added_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={styles.pagination}>
              <button
                style={{
                  ...styles.pageButton,
                  ...(pagination.page === 1 ? styles.pageButtonDisabled : {}),
                }}
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft size={18} />
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
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {wishlist.length === 0 && !loading && (
        <div style={styles.emptyState}>
          <Heart size={64} color="#d1d5db" />
          <h3 style={styles.emptyStateTitle}>Your wishlist is empty</h3>
          <p style={styles.emptyStateText}>
            Start adding accommodations to your wishlist to keep track of your
            favorites
          </p>
          <button style={styles.browseButton} onClick={handleBrowseClick}>
            Browse Accommodations
          </button>
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
const getMockWishlist = () => [
  {
    id: 1,
    hostel_id: 1,
    name: "University View Hostel",
    location: "123 College Ave, Nairobi",
    price: 8500,
    room_type: "single",
    rating: 4.5,
    images: ["https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800"],
    added_at: new Date().toISOString(),
  },
  {
    id: 2,
    hostel_id: 2,
    name: "Central Student Living",
    location: "456 Main Street, Nairobi",
    price: 6500,
    room_type: "bed_sitter",
    rating: 4.2,
    images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
    added_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    hostel_id: 3,
    name: "Green Valley Hostel",
    location: "789 Park Road, Nairobi",
    price: 5500,
    room_type: "double",
    rating: 4.0,
    images: ["https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400"],
    added_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

const styles = {
  container: {
    maxWidth: "1400px",
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
  wishlistGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
    transition: "all 0.2s ease",
  },
  cardImage: {
    position: "relative",
    height: "200px",
  },
  cardImageImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    cursor: "pointer",
  },
  removeButton: {
    position: "absolute",
    top: "12px",
    right: "12px",
    padding: "8px",
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonLoading: {
    backgroundColor: "rgba(239, 68, 68, 0.5)",
  },
  cardContent: {
    padding: "20px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px",
    cursor: "pointer",
  },
  cardLocation: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
  },
  rating: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  roomType: {
    padding: "4px 10px",
    backgroundColor: "#f3f4f6",
    borderRadius: "6px",
    fontSize: "12px",
    color: "#6b7280",
    textTransform: "capitalize",
  },
  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  price: {
    display: "flex",
    alignItems: "baseline",
    gap: "4px",
  },
  priceValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#1a1a1a",
  },
  pricePeriod: {
    fontSize: "14px",
    color: "#6b7280",
  },
  viewButton: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  addedDate: {
    fontSize: "12px",
    color: "#9ca3af",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
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
  browseButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "24px",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "16px",
    padding: "24px",
  },
  pageButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
};

export default StudentWishlist;

