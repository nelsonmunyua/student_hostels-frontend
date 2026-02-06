import { useNavigate } from "react-router-dom";
import { Heart, MapPin, Trash2 } from "lucide-react";
import useAuth from "../../hooks/useAuth.jsx";

const StudentWishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Placeholder - will be implemented with actual API

  const handleBrowseClick = () => {
    alert("Redirecting to browse accommodations... (Demo)");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Wishlist</h1>
        <p style={styles.subtitle}>Accommodations you've saved for later</p>
      </div>

      <div style={styles.emptyState}>
        <Heart size={64} color="#d1d5db" />
        <p style={styles.emptyStateText}>Your wishlist is empty</p>
        <p style={styles.emptyStateSubtext}>
          Start adding accommodations to your wishlist to keep track of your
          favorites
        </p>
        <button style={styles.browseButton} onClick={handleBrowseClick}>
          Browse Accommodations
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "1200px" },
  header: { marginBottom: "32px" },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  subtitle: { fontSize: "16px", color: "#6b7280" },
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
  emptyStateText: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#6b7280",
    marginTop: "16px",
  },
  emptyStateSubtext: {
    fontSize: "14px",
    color: "#9ca3af",
    marginTop: "8px",
    marginBottom: "24px",
  },
  browseButton: {
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default StudentWishlist;
