import { useState, useEffect, useCallback } from "react";
import {
  Bell,
  Loader2,
  Check,
  CheckCheck,
  Trash2,
  Calendar,
  MessageSquare,
  CreditCard,
  Home,
  Star,
} from "lucide-react";
import { useSelector } from "react-redux";
import studentApi from "../../../../api/studentApi";

const StudentNotifications = () => {
  const { user } = useSelector((state) => state.auth);

  // State
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all | unread
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    unreadCount: 0,
  });

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await studentApi.getNotifications({
        page: pagination.page,
        limit: 20,
        ...(filter === "unread" && { unread_only: true }),
      });

      setNotifications(response.notifications || []);
      setPagination((prev) => ({
        ...prev,
        total: response.total,
        pages: response.pages,
        unreadCount: response.unread_count,
      }));
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications. Please try again.");
      // Mock data for demo
      setNotifications(getMockNotifications());
      setPagination({
        page: 1,
        pages: 1,
        total: 5,
        unreadCount: 2,
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, filter]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Mark single notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await studentApi.markNotificationRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setPagination((prev) => ({
        ...prev,
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await studentApi.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setPagination((prev) => ({
        ...prev,
        unreadCount: 0,
      }));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // Get notification icon based on title/content
  const getNotificationIcon = (title) => {
    const iconMap = {
      booking: { icon: Calendar, color: "#3b82f6", bgColor: "#dbeafe" },
      payment: { icon: CreditCard, color: "#10b981", bgColor: "#d1fae5" },
      review: { icon: Star, color: "#f59e0b", bgColor: "#fef3c7" },
      message: { icon: MessageSquare, color: "#8b5cf6", bgColor: "#e0e7ff" },
      accommodation: { icon: Home, color: "#6366f1", bgColor: "#e0e7ff" },
      default: { icon: Bell, color: "#6b7280", bgColor: "#f3f4f6" },
    };

    const lowerTitle = title?.toLowerCase() || "";
    if (lowerTitle.includes("book") || lowerTitle.includes("booking")) {
      return iconMap.booking;
    }
    if (lowerTitle.includes("payment") || lowerTitle.includes("paid")) {
      return iconMap.payment;
    }
    if (lowerTitle.includes("review") || lowerTitle.includes("rating")) {
      return iconMap.review;
    }
    if (lowerTitle.includes("message") || lowerTitle.includes("comment")) {
      return iconMap.message;
    }
    if (lowerTitle.includes("room") || lowerTitle.includes("hostel")) {
      return iconMap.accommodation;
    }
    return iconMap.default;
  };

  // Format notification time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (loading && notifications.length === 0) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2 size={40} color="#3b82f6" style={{ animation: "spin 1s linear infinite" }} />
        <p>Loading notifications...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Notifications</h1>
          <p style={styles.subtitle}>
            Stay updated with your latest notifications and alerts
          </p>
        </div>
        {pagination.unreadCount > 0 && (
          <button style={styles.markAllButton} onClick={handleMarkAllAsRead}>
            <CheckCheck size={18} />
            Mark all as read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(filter === "all" ? styles.tabActive : {}),
          }}
          onClick={() => {
            setFilter("all");
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        >
          All ({pagination.total})
        </button>
        <button
          style={{
            ...styles.tab,
            ...(filter === "unread" ? styles.tabActive : {}),
          }}
          onClick={() => {
            setFilter("unread");
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
        >
          Unread
          {pagination.unreadCount > 0 && (
            <span style={styles.unreadBadge}>{pagination.unreadCount}</span>
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div style={styles.errorContainer}>
          <p>{error}</p>
          <button style={styles.retryButton} onClick={fetchNotifications}>
            Retry
          </button>
        </div>
      )}

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div style={styles.notificationsList}>
          {notifications.map((notification) => {
            const { icon: Icon, color, bgColor } = getNotificationIcon(
              notification.title
            );

            return (
              <div
                key={notification.id}
                style={{
                  ...styles.notificationCard,
                  ...(notification.is_read ? styles.notificationRead : {}),
                }}
              >
                {/* Icon */}
                <div
                  style={{
                    ...styles.notificationIcon,
                    backgroundColor: bgColor,
                  }}
                >
                  <Icon size={20} color={color} />
                </div>

                {/* Content */}
                <div style={styles.notificationContent}>
                  <div style={styles.notificationHeader}>
                    <h3 style={styles.notificationTitle}>{notification.title}</h3>
                    <span style={styles.notificationTime}>
                      {formatTime(notification.created_at)}
                    </span>
                  </div>
                  <p style={styles.notificationMessage}>
                    {notification.message}
                  </p>
                </div>

                {/* Actions */}
                <div style={styles.notificationActions}>
                  {!notification.is_read && (
                    <button
                      style={styles.markReadButton}
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Check size={16} color="#10b981" />
                    </button>
                  )}
                </div>

                {/* Unread indicator */}
                {!notification.is_read && (
                  <div style={styles.unreadIndicator}></div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <Bell size={64} color="#d1d5db" />
          <h3 style={styles.emptyStateTitle}>No notifications</h3>
          <p style={styles.emptyStateText}>
            {filter === "unread"
              ? "You're all caught up! No unread notifications."
              : "You don't have any notifications yet."}
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
    </div>
  );
};

// Mock data for demo
const getMockNotifications = () => [
  {
    id: 1,
    title: "Booking Confirmed",
    message:
      "Your booking at University View Hostel has been confirmed. Check-in date: March 1, 2024.",
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: 2,
    title: "Payment Received",
    message:
      "Payment of KSh 8,500 has been received for your booking at Central Student Living.",
    is_read: false,
    created_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
  {
    id: 3,
    title: "Review Approved",
    message:
      "Your review for Green Valley Hostel has been approved and is now visible to other students.",
    is_read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    id: 4,
    title: "New Message",
    message:
      "You have a new message from the host at University View Hostel regarding your upcoming stay.",
    is_read: true,
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: 5,
    title: "Booking Reminder",
    message:
      "Reminder: Your booking at Central Student Living ends on February 28, 2024.",
    is_read: true,
    created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
  },
];

const styles = {
  container: {
    maxWidth: "800px",
    padding: "0 24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "32px",
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
  markAllButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#eff6ff",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "24px",
  },
  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#fff",
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
  unreadBadge: {
    padding: "2px 8px",
    backgroundColor: "#ef4444",
    color: "#fff",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: 600,
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
  notificationsList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginBottom: "32px",
  },
  notificationCard: {
    position: "relative",
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    transition: "all 0.2s",
  },
  notificationRead: {
    backgroundColor: "#f9fafb",
    opacity: 0.8,
  },
  notificationIcon: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    flexShrink: 0,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  notificationTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1a1a1a",
  },
  notificationTime: {
    fontSize: "13px",
    color: "#9ca3af",
    flexShrink: 0,
  },
  notificationMessage: {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.5,
  },
  notificationActions: {
    display: "flex",
    gap: "8px",
  },
  markReadButton: {
    padding: "6px",
    backgroundColor: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  unreadIndicator: {
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "8px",
    height: "8px",
    backgroundColor: "#3b82f6",
    borderRadius: "50%",
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
};

export default StudentNotifications;

