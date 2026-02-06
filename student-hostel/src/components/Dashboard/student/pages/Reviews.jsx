import { Star } from "lucide-react";
import useAuth from "../../hooks/useAuth.jsx";

const StudentReviews = () => {
  const { user } = useAuth();
  // Placeholder - will be implemented with actual API
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Reviews</h1>
        <p style={styles.subtitle}>Reviews you've written for accommodations</p>
      </div>

      <div style={styles.emptyState}>
        <Star size={64} color="#d1d5db" />
        <p style={styles.emptyStateText}>No reviews yet</p>
        <p style={styles.emptyStateSubtext}>
          After completing a booking, you can leave a review to help other
          students
        </p>
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
  emptyStateSubtext: { fontSize: "14px", color: "#9ca3af", marginTop: "8px" },
};

export default StudentReviews;
