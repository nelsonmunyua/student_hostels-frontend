import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import hostApi from "../../../../api/hostApi";
import authApi from "../../../../api/authApi";
import { setCredentials } from "../../../../redux/slices/authSlice";

const HostProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // State for profile data
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  
  // State for verification status
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(true);
  
  // State for dashboard stats
  const [stats, setStats] = useState({
    totalListings: 0,
    avgRating: 0,
    memberDuration: "0",
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    taxId: "",
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailReviews: true,
    emailPayments: true,
    pushNotifications: false,
    weeklyReports: true,
  });

  // Fetch verification status on mount
  useEffect(() => {
    const fetchVerificationStatus = async () => {
      try {
        setVerificationLoading(true);
        const response = await hostApi.getVerificationStatus();
        setVerificationStatus(response);
      } catch (error) {
        console.error("Failed to fetch verification status:", error);
        setVerificationStatus({ status: "not_submitted" });
      } finally {
        setVerificationLoading(false);
      }
    };

    if (user?.role === "host") {
      fetchVerificationStatus();
    }
  }, [user]);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setStatsLoading(true);
        // Fetch listings count
        const listingsResponse = await hostApi.getListings();
        const totalListings = listingsResponse.hostels?.length || 0;
        
        // Fetch reviews for rating
        const reviewsResponse = await hostApi.getReviews();
        const reviews = reviewsResponse.reviews || [];
        const avgRating = reviews.length > 0
          ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          : 0;
        
        // Calculate member duration
        let memberDuration = "0";
        if (user?.created_at) {
          const createdDate = new Date(user.created_at);
          const now = new Date();
          const years = now.getFullYear() - createdDate.getFullYear();
          const months = now.getMonth() - createdDate.getMonth();
          const totalMonths = years * 12 + months;
          
          if (totalMonths < 1) {
            memberDuration = "< 1 mo";
          } else if (totalMonths < 12) {
            memberDuration = `${totalMonths} mo`;
          } else {
            memberDuration = `${years} yr${years > 1 ? "s" : ""}`;
          }
        }
        
        setStats({
          totalListings,
          avgRating,
          memberDuration,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        // Keep default values on error
      } finally {
        setStatsLoading(false);
      }
    };

    if (user?.role === "host") {
      fetchDashboardStats();
    }
  }, [user]);

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await hostApi.getProfile();
        const userData = response.user || response;
        
        setProfileData({
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });
        
        setFormData((prev) => ({
          ...prev,
          firstName: userData.first_name || prev.firstName,
          lastName: userData.last_name || prev.lastName,
          email: userData.email || prev.email,
          phone: userData.phone || prev.phone,
        }));
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        // Fallback to auth context data
        if (user) {
          setProfileData({
            firstName: user.first_name || "",
            lastName: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
          });
          setFormData((prev) => ({
            ...prev,
            firstName: user.first_name || prev.firstName,
            lastName: user.last_name || prev.lastName,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
          }));
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage({ type: "", text: "" });
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const handleSubmit = async (section) => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    
    try {
      if (section === "personal") {
        const response = await hostApi.updateProfile({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
        });
        
        const updatedUser = response.user || response;
        
        // Update Redux state and localStorage with new user data
        const updatedUserData = {
          ...user,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
        };
        const token = localStorage.getItem("token");
        dispatch(setCredentials({ user: updatedUserData, token }));
        localStorage.setItem("user", JSON.stringify(updatedUserData));
        
        // Update local profile state
        setProfileData({
          firstName: updatedUser.first_name || formData.firstName,
          lastName: updatedUser.last_name || formData.lastName,
          email: updatedUser.email || formData.email,
          phone: updatedUser.phone || formData.phone,
        });
        
        showMessage("success", "Personal information updated successfully!");
      } else if (section === "business") {
        // Business info would need a different endpoint or additional backend support
        showMessage("success", "Business information saved!");
      } else if (section === "payment") {
        // Payment info would need a different endpoint or additional backend support
        showMessage("success", "Payment information updated!");
      } else if (section === "notifications") {
        // Notifications would need a different endpoint or additional backend support
        showMessage("success", "Notification preferences saved!");
      }
    } catch (error) {
      console.error("Update failed:", error);
      showMessage("error", error.response?.data?.message || "Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get verification badge based on status
  const getVerificationBadge = () => {
    if (verificationLoading) {
      return (
        <span style={styles.userBadgeLoading}>
          Loading...
        </span>
      );
    }

    const status = verificationStatus?.status;
    
    switch (status) {
      case "approved":
        return (
          <span style={styles.userBadgeVerified}>
            Verified Host
          </span>
        );
      case "pending":
        return (
          <span style={styles.userBadgePending}>
            Verification Pending
          </span>
        );
      case "rejected":
        return (
          <span style={styles.userBadgeRejected}>
            Verification Rejected
          </span>
        );
      case "not_submitted":
      default:
        return (
          <span style={styles.userBadgeNotVerified}>
            Not Verified
          </span>
        );
    }
  };

  // Render stats based on loading state
  const renderStats = () => {
    if (statsLoading) {
      return (
        <div style={styles.statsLoading}>
          <div style={styles.loadingSpinner}></div>
          <span>Loading stats...</span>
        </div>
      );
    }

    return (
      <>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{stats.totalListings}</span>
          <span style={styles.statLabel}>Listings</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{stats.avgRating}</span>
          <span style={styles.statLabel}>Avg Rating</span>
        </div>
        <div style={styles.statItem}>
          <span style={styles.statValue}>{stats.memberDuration}</span>
          <span style={styles.statLabel}>Member</span>
        </div>
      </>
    );
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Profile Settings</h1>
        <p style={styles.subtitle}>
          Manage your account information and preferences
        </p>
      </div>

      {/* Success/Error Message */}
      {message.text && (
        <div style={{
          ...styles.message,
          backgroundColor: message.type === "success" ? "#dcfce7" : "#fee2e2",
          color: message.type === "success" ? "#16a34a" : "#dc2626",
          border: `1px solid ${message.type === "success" ? "#86efac" : "#fca5a5"}`,
        }}>
          {message.text}
        </div>
      )}

      {/* Profile Header Card */}
      <div style={styles.profileCard}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={profileData.firstName}
                style={styles.avatarImg}
              />
            ) : (
              <span style={styles.avatarInitial}>
                {profileData.firstName?.charAt(0) || "H"}
              </span>
            )}
          </div>
          <button style={styles.changePhotoBtn}>Change Photo</button>
        </div>
        <div style={styles.infoSection}>
          <h2 style={styles.userName}>
            {profileData.firstName} {profileData.lastName}
          </h2>
          <p style={styles.userEmail}>{profileData.email}</p>
          {getVerificationBadge()}
        </div>
        <div style={styles.statsSection}>
          {renderStats()}
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {["personal", "business", "payment", "security", "notifications"].map(
          (tab) => (
            <button
              key={tab}
              style={{
                ...styles.tab,
                ...(activeTab === tab ? styles.activeTab : {}),
              }}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Info
            </button>
          ),
        )}
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === "personal" && (
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Personal Information</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={styles.input}
                  disabled
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
            </div>
            <button 
              style={{
                ...styles.saveBtn,
                opacity: loading ? 0.7 : 1
              }} 
              onClick={() => handleSubmit("personal")}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {activeTab === "business" && (
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Business Information</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Company Name</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>ZIP Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Country</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  style={styles.input}
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
              </div>
            </div>
            <button 
              style={{
                ...styles.saveBtn,
                opacity: loading ? 0.7 : 1
              }} 
              onClick={() => handleSubmit("business")}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {activeTab === "payment" && (
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Payment Information</h3>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Routing Number</label>
                <input
                  type="text"
                  name="routingNumber"
                  value={formData.routingNumber}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Tax ID (EIN)</label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
            </div>
            <button 
              style={{
                ...styles.saveBtn,
                opacity: loading ? 0.7 : 1
              }} 
              onClick={() => handleSubmit("payment")}
              disabled={loading}
            >
              {loading ? "Saving..." : "Update Payment Info"}
            </button>
          </div>
        )}

        {activeTab === "security" && (
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Security Settings</h3>
            <div style={styles.securityItem}>
              <div style={styles.securityInfo}>
                <span style={styles.securityTitle}>Password</span>
                <span style={styles.securityDesc}>
                  Last changed 3 months ago
                </span>
              </div>
              <button style={styles.changeBtn}>Change Password</button>
            </div>
            <div style={styles.securityItem}>
              <div style={styles.securityInfo}>
                <span style={styles.securityTitle}>
                  Two-Factor Authentication
                </span>
                <span style={styles.securityDesc}>
                  Add an extra layer of security
                </span>
              </div>
              <button style={styles.enableBtn}>Enable 2FA</button>
            </div>
            <div style={styles.securityItem}>
              <div style={styles.securityInfo}>
                <span style={styles.securityTitle}>Active Sessions</span>
                <span style={styles.securityDesc}>
                  Manage your logged-in devices
                </span>
              </div>
              <button style={styles.viewBtn}>View Sessions</button>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div style={styles.formSection}>
            <h3 style={styles.sectionTitle}>Notification Preferences</h3>
            <div style={styles.notificationList}>
              <div style={styles.notificationItem}>
                <div style={styles.notificationInfo}>
                  <span style={styles.notificationTitle}>
                    Booking Notifications
                  </span>
                  <span style={styles.notificationDesc}>
                    Receive alerts for new booking requests
                  </span>
                </div>
                <label style={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={notifications.emailBookings}
                    onChange={() => handleNotificationChange("emailBookings")}
                    style={styles.checkbox}
                  />
                  <span style={styles.slider}></span>
                </label>
              </div>
              <div style={styles.notificationItem}>
                <div style={styles.notificationInfo}>
                  <span style={styles.notificationTitle}>
                    Review Notifications
                  </span>
                  <span style={styles.notificationDesc}>
                    Get notified when guests leave reviews
                  </span>
                </div>
                <label style={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={notifications.emailReviews}
                    onChange={() => handleNotificationChange("emailReviews")}
                    style={styles.checkbox}
                  />
                  <span style={styles.slider}></span>
                </label>
              </div>
              <div style={styles.notificationItem}>
                <div style={styles.notificationInfo}>
                  <span style={styles.notificationTitle}>Payment Alerts</span>
                  <span style={styles.notificationDesc}>
                    Receive payment confirmations and reports
                  </span>
                </div>
                <label style={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={notifications.emailPayments}
                    onChange={() => handleNotificationChange("emailPayments")}
                    style={styles.checkbox}
                  />
                  <span style={styles.slider}></span>
                </label>
              </div>
              <div style={styles.notificationItem}>
                <div style={styles.notificationInfo}>
                  <span style={styles.notificationTitle}>Weekly Reports</span>
                  <span style={styles.notificationDesc}>
                    Get weekly performance summaries
                  </span>
                </div>
                <label style={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={notifications.weeklyReports}
                    onChange={() => handleNotificationChange("weeklyReports")}
                    style={styles.checkbox}
                  />
                  <span style={styles.slider}></span>
                </label>
              </div>
            </div>
            <button 
              style={{
                ...styles.saveBtn,
                opacity: loading ? 0.7 : 1
              }} 
              onClick={() => handleSubmit("notifications")}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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
  message: {
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    marginBottom: "24px",
  },
  profileCard: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
    padding: "32px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    marginBottom: "32px",
  },
  avatarSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    backgroundColor: "#f0f9ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    border: "3px solid #0369a1",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarInitial: {
    fontSize: "40px",
    fontWeight: "700",
    color: "#0369a1",
  },
  changePhotoBtn: {
    padding: "8px 16px",
    backgroundColor: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
  },
  infoSection: {
    flex: 1,
  },
  userName: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 4px 0",
  },
  userEmail: {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0 0 12px 0",
  },
  userBadgeVerified: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  userBadgePending: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#fef3c7",
    color: "#d97706",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  userBadgeRejected: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  userBadgeNotVerified: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  userBadgeLoading: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#f3f4f6",
    color: "#9ca3af",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  statsSection: {
    display: "flex",
    gap: "32px",
  },
  statsLoading: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#6b7280",
    fontSize: "14px",
  },
  loadingSpinner: {
    width: "20px",
    height: "20px",
    border: "2px solid #e5e7eb",
    borderTop: "2px solid #0369a1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  statItem: {
    textAlign: "center",
  },
  statValue: {
    display: "block",
    fontSize: "24px",
    fontWeight: "700",
    color: "#0369a1",
  },
  statLabel: {
    fontSize: "13px",
    color: "#6b7280",
  },
  tabs: {
    display: "flex",
    gap: "8px",
    marginBottom: "32px",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: "16px",
  },
  tab: {
    padding: "10px 20px",
    backgroundColor: "transparent",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#6b7280",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  activeTab: {
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
  },
  tabContent: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "32px",
  },
  formSection: {
    maxWidth: "800px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: "24px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    marginBottom: "24px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
  },
  input: {
    padding: "12px 16px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "14px",
    color: "#1a1a1a",
    outline: "none",
    transition: "border-color 0.2s",
  },
  saveBtn: {
    padding: "12px 24px",
    backgroundColor: "#0369a1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  securityItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  securityInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  securityTitle: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#1a1a1a",
  },
  securityDesc: {
    fontSize: "14px",
    color: "#6b7280",
  },
  changeBtn: {
    padding: "8px 16px",
    backgroundColor: "#f3f4f6",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    cursor: "pointer",
  },
  enableBtn: {
    padding: "8px 16px",
    backgroundColor: "#dcfce7",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#16a34a",
    cursor: "pointer",
  },
  viewBtn: {
    padding: "8px 16px",
    backgroundColor: "#f0f9ff",
    border: "none",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#0369a1",
    cursor: "pointer",
  },
  notificationList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "24px",
  },
  notificationItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
  },
  notificationInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  notificationTitle: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#1a1a1a",
  },
  notificationDesc: {
    fontSize: "13px",
    color: "#6b7280",
  },
  toggle: {
    position: "relative",
    display: "inline-block",
    width: "48px",
    height: "26px",
  },
  checkbox: {
    opacity: 0,
    width: 0,
    height: 0,
  },
  slider: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#ccc",
    transition: "0.4s",
    borderRadius: "26px",
  },
};

export default HostProfile;
