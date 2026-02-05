import { useState } from "react";
import { useSelector } from "react-redux";

const HostProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "Host",
    lastName: user?.last_name || "User",
    email: user?.email || "host@example.com",
    phone: "+1 234 567 8900",
    company: "StudentHostel Management",
    address: "123 Business Ave, Suite 100",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    bankName: "Chase Bank",
    accountNumber: "****4567",
    routingNumber: "****8901",
    taxId: "**-***7890",
  });

  const [notifications, setNotifications] = useState({
    emailBookings: true,
    emailReviews: true,
    emailPayments: true,
    pushNotifications: false,
    weeklyReports: true,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Profile Settings</h1>
        <p style={styles.subtitle}>Manage your account information and preferences</p>
      </div>

      {/* Profile Header Card */}
      <div style={styles.profileCard}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={user.first_name}
                style={styles.avatarImg}
              />
            ) : (
              <span style={styles.avatarInitial}>
                {user?.first_name?.charAt(0) || "H"}
              </span>
            )}
          </div>
          <button style={styles.changePhotoBtn}>Change Photo</button>
        </div>
        <div style={styles.infoSection}>
          <h2 style={styles.userName}>
            {user?.first_name} {user?.last_name}
          </h2>
          <p style={styles.userEmail}>{user?.email}</p>
          <span style={styles.userBadge}>Verified Host</span>
        </div>
        <div style={styles.statsSection}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>5</span>
            <span style={styles.statLabel}>Listings</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>4.8</span>
            <span style={styles.statLabel}>Avg Rating</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>2 yrs</span>
            <span style={styles.statLabel}>Member</span>
          </div>
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
          )
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
            <button style={styles.saveBtn}>Save Changes</button>
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
            <button style={styles.saveBtn}>Save Changes</button>
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
            <button style={styles.saveBtn}>Update Payment Info</button>
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
                <span style={styles.securityTitle}>Two-Factor Authentication</span>
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
                  <span style={styles.notificationTitle}>Review Notifications</span>
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
            <button style={styles.saveBtn}>Save Preferences</button>
          </div>
        )}
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
  userBadge: {
    display: "inline-block",
    padding: "4px 12px",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
  },
  statsSection: {
    display: "flex",
    gap: "32px",
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

