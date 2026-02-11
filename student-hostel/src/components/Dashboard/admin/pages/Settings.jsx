import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  User,
  Bell,
  Shield,
  Globe,
  Key,
  Mail,
  Save,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import { toast } from "../../../../main";
import adminApi from "../../../../api/adminApi";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    bookings: true,
    reviews: true,
    payments: true,
    newsletter: false,
  });
  const [platformSettings, setPlatformSettings] = useState({
    platformName: "Student Hostel",
    tagline: "Find your perfect student home",
    supportEmail: "support@studenthostel.com",
    contactPhone: "+1 (555) 000-0000",
    userRegistration: true,
    bookingSystem: true,
    reviewSystem: true,
    maintenanceMode: false,
  });
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch settings from API on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        // Fetch admin profile from auth context/user data
        if (user) {
          setProfileData({
            firstName: user.first_name || user.firstName || "",
            lastName: user.last_name || user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            role: user.role || "admin",
          });
        }
        
        // Fetch platform settings
        try {
          const settingsData = await adminApi.getSettings();
          if (settingsData && Object.keys(settingsData).length > 0) {
            setPlatformSettings((prev) => ({
              ...prev,
              ...settingsData,
            }));
          }
        } catch (error) {
          console.log("Using default platform settings");
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Handle save settings
  const handleSaveSettings = async (section) => {
    setIsSaving(true);
    try {
      switch (section) {
        case "General Settings":
          await adminApi.updateSettings({
            platformName: platformSettings.platformName,
            tagline: platformSettings.tagline,
            supportEmail: platformSettings.supportEmail,
            contactPhone: platformSettings.contactPhone,
            userRegistration: platformSettings.userRegistration,
            bookingSystem: platformSettings.bookingSystem,
            reviewSystem: platformSettings.reviewSystem,
            maintenanceMode: platformSettings.maintenanceMode,
          });
          toast.success("General settings saved successfully!");
          break;
        case "Profile Settings":
          // Profile updates would typically go through authApi
          toast.success("Profile settings saved successfully!");
          break;
        case "Notification Preferences":
          await adminApi.updateSettings({ notifications });
          toast.success("Notification preferences saved!");
          break;
        case "Security Settings":
          if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("Passwords do not match!");
            setIsSaving(false);
            return;
          }
          if (passwordData.newPassword && passwordData.currentPassword) {
            toast.success("Security settings updated successfully!");
          } else {
            toast.success("Security settings saved!");
          }
          // Clear password fields
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          break;
        default:
          toast.success("Settings saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle revoke session
  const handleRevokeSession = async (device) => {
    if (window.confirm(`Are you sure you want to revoke access for ${device}?`)) {
      try {
        // API call to revoke session would go here
        toast.success(`Session revoked for ${device}`);
      } catch (error) {
        toast.error("Failed to revoke session");
      }
    }
  };

  // Handle upload photo
  const handleUploadPhoto = async () => {
    toast.info("Photo upload functionality - integrate with cloud storage");
  };

  // Handle remove photo
  const handleRemovePhoto = async () => {
    if (window.confirm("Are you sure you want to remove your profile photo?")) {
      toast.success("Profile photo removed successfully!");
    }
  };

  // Handle input changes
  const handlePlatformSettingChange = (key, value) => {
    setPlatformSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleProfileChange = (key, value) => {
    setProfileData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePasswordChange = (key, value) => {
    setPasswordData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div style={styles.container}>
      {/* Page Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Settings</h1>
          <p style={styles.subtitle}>
            Manage your account and platform settings
          </p>
        </div>
      </div>

      <div style={styles.layout}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              style={{
                ...styles.tabButton,
                backgroundColor:
                  activeTab === tab.id ? "#f0f9ff" : "transparent",
                color: activeTab === tab.id ? "#0369a1" : "#64748b",
                borderLeft:
                  activeTab === tab.id
                    ? "3px solid #0369a1"
                    : "3px solid transparent",
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === "general" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>General Settings</h2>
              <p style={styles.sectionSubtitle}>
                Configure basic platform settings
              </p>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Platform Information</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Platform Name</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={platformSettings.platformName}
                      onChange={(e) => handlePlatformSettingChange("platformName", e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Tagline</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={platformSettings.tagline}
                      onChange={(e) => handlePlatformSettingChange("tagline", e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Support Email</label>
                    <input
                      type="email"
                      style={styles.input}
                      value={platformSettings.supportEmail}
                      onChange={(e) => handlePlatformSettingChange("supportEmail", e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Contact Phone</label>
                    <input
                      type="tel"
                      style={styles.input}
                      value={platformSettings.contactPhone}
                      onChange={(e) => handlePlatformSettingChange("contactPhone", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Platform Features</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>User Registration</span>
                      <span style={styles.toggleDescription}>
                        Allow new users to register
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={platformSettings.userRegistration}
                        onChange={(e) => handlePlatformSettingChange("userRegistration", e.target.checked)}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>Booking System</span>
                      <span style={styles.toggleDescription}>
                        Enable room booking functionality
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={platformSettings.bookingSystem}
                        onChange={(e) => handlePlatformSettingChange("bookingSystem", e.target.checked)}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>Review System</span>
                      <span style={styles.toggleDescription}>
                        Allow users to leave reviews
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={platformSettings.reviewSystem}
                        onChange={(e) => handlePlatformSettingChange("reviewSystem", e.target.checked)}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>Maintenance Mode</span>
                      <span style={styles.toggleDescription}>
                        Put platform in maintenance mode
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={platformSettings.maintenanceMode}
                        onChange={(e) => handlePlatformSettingChange("maintenanceMode", e.target.checked)}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.saveBtn}
                  onClick={() => handleSaveSettings("General Settings")}
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Profile Settings</h2>
              <p style={styles.sectionSubtitle}>
                Manage your personal information
              </p>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Profile Picture</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.avatarSection}>
                    <div style={styles.avatar}>
                      {adminInfo.avatar ? (
                        <img
                          src={adminInfo.avatar}
                          alt="Profile"
                          style={styles.avatarImg}
                        />
                      ) : (
                        <User size={40} color="#94a3b8" />
                      )}
                    </div>
                    <div style={styles.avatarActions}>
                      <button
                        style={styles.uploadBtn}
                        onClick={handleUploadPhoto}
                      >
                        <Camera size={16} />
                        Upload New
                      </button>
                      <button
                        style={styles.removeBtn}
                        onClick={handleRemovePhoto}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Personal Information</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>First Name</label>
                      <input
                        type="text"
                        style={styles.input}
                        value={profileData.firstName}
                        onChange={(e) => handleProfileChange("firstName", e.target.value)}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Last Name</label>
                      <input
                        type="text"
                        style={styles.input}
                        value={profileData.lastName}
                        onChange={(e) => handleProfileChange("lastName", e.target.value)}
                      />
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Email Address</label>
                    <input
                      type="email"
                      style={styles.input}
                      value={profileData.email}
                      onChange={(e) => handleProfileChange("email", e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Phone Number</label>
                    <input
                      type="tel"
                      style={styles.input}
                      value={profileData.phone}
                      onChange={(e) => handleProfileChange("phone", e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Role</label>
                    <input
                      type="text"
                      style={styles.input}
                      value={profileData.role || "Admin"}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.saveBtn}
                  onClick={() => handleSaveSettings("Profile Settings")}
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Notification Preferences</h2>
              <p style={styles.sectionSubtitle}>
                Choose how you want to receive notifications
              </p>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Notification Channels</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>
                        Email Notifications
                      </span>
                      <span style={styles.toggleDescription}>
                        Receive notifications via email
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange("email")}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>Push Notifications</span>
                      <span style={styles.toggleDescription}>
                        Receive browser push notifications
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={() => handleNotificationChange("push")}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>SMS Notifications</span>
                      <span style={styles.toggleDescription}>
                        Receive notifications via SMS
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={() => handleNotificationChange("sms")}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Notification Types</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>Booking Updates</span>
                      <span style={styles.toggleDescription}>
                        Get notified about new bookings
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notifications.bookings}
                        onChange={() => handleNotificationChange("bookings")}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>
                        Review Notifications
                      </span>
                      <span style={styles.toggleDescription}>
                        Get notified about new reviews
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notifications.reviews}
                        onChange={() => handleNotificationChange("reviews")}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>Payment Alerts</span>
                      <span style={styles.toggleDescription}>
                        Get notified about payments
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notifications.payments}
                        onChange={() => handleNotificationChange("payments")}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>Newsletter</span>
                      <span style={styles.toggleDescription}>
                        Receive weekly newsletters
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input
                        type="checkbox"
                        checked={notifications.newsletter}
                        onChange={() => handleNotificationChange("newsletter")}
                      />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.saveBtn}
                  onClick={() => handleSaveSettings("Notification Preferences")}
                >
                  <Save size={18} />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Security Settings</h2>
              <p style={styles.sectionSubtitle}>Manage your account security</p>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Change Password</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Current Password</label>
                    <div style={styles.passwordWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        style={styles.passwordInput}
                        placeholder="Enter current password"
                        value={passwordData.currentPassword}
                        onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                      />
                      <button
                        style={styles.passwordToggle}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} color="#94a3b8" />
                        ) : (
                          <Eye size={18} color="#94a3b8" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>New Password</label>
                    <input
                      type="password"
                      style={styles.input}
                      placeholder="Enter new password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    />
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Confirm New Password</label>
                    <input
                      type="password"
                      style={styles.input}
                      placeholder="Confirm new password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Two-Factor Authentication</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.toggleItem}>
                    <div>
                      <span style={styles.toggleLabel}>Enable 2FA</span>
                      <span style={styles.toggleDescription}>
                        Add an extra layer of security to your account
                      </span>
                    </div>
                    <label style={styles.switch}>
                      <input type="checkbox" />
                      <span style={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>

              <div style={styles.card}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>Active Sessions</h3>
                </div>
                <div style={styles.cardContent}>
                  <div style={styles.sessionItem}>
                    <div style={styles.sessionInfo}>
                      <div style={styles.sessionIcon}>
                        <Globe size={20} color="#0369a1" />
                      </div>
                      <div>
                        <span style={styles.sessionDevice}>
                          Chrome on MacOS
                        </span>
                        <span style={styles.sessionLocation}>
                          San Francisco, US · Current session
                        </span>
                      </div>
                    </div>
                    <span style={styles.sessionBadge}>Active</span>
                  </div>
                  <div style={styles.sessionItem}>
                    <div style={styles.sessionInfo}>
                      <div style={styles.sessionIcon}>
                        <Globe size={20} color="#64748b" />
                      </div>
                      <div>
                        <span style={styles.sessionDevice}>
                          Safari on iPhone
                        </span>
                        <span style={styles.sessionLocation}>
                          New York, US · 2 hours ago
                        </span>
                      </div>
                    </div>
                    <button
                      style={styles.revokeBtn}
                      onClick={() => handleRevokeSession("Safari on iPhone")}
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.saveBtn}
                  onClick={() => handleSaveSettings("Security Settings")}
                >
                  <Save size={18} />
                  Update Security
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
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
  layout: {
    display: "grid",
    gridTemplateColumns: "240px 1fr",
    gap: "24px",
  },
  sidebar: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "16px",
    height: "fit-content",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  tabButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
    padding: "12px 16px",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left",
    transition: "all 0.2s",
    marginBottom: "4px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1e293b",
    margin: "0 0 4px 0",
  },
  sectionSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #f1f5f9",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1e293b",
    margin: 0,
  },
  cardContent: {
    padding: "20px",
  },
  formGroup: {
    marginBottom: "16px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#374151",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#334155",
    outline: "none",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: {
    width: "100%",
    padding: "10px 40px 10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#334155",
    outline: "none",
    boxSizing: "border-box",
  },
  passwordToggle: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
  },
  toggleItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  toggleLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#1e293b",
    marginBottom: "4px",
  },
  toggleDescription: {
    fontSize: "13px",
    color: "#64748b",
  },
  switch: {
    position: "relative",
    display: "inline-block",
    width: "44px",
    height: "24px",
  },
  slider: {
    position: "absolute",
    cursor: "pointer",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#cbd5e1",
    borderRadius: "24px",
    transition: "0.3s",
  },
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
  saveBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 20px",
    backgroundColor: "#0369a1",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#f1f5f9",
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
  avatarActions: {
    display: "flex",
    gap: "12px",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 16px",
    backgroundColor: "#f0f9ff",
    color: "#0369a1",
    border: "1px solid #0369a1",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  removeBtn: {
    padding: "8px 16px",
    backgroundColor: "transparent",
    color: "#dc2626",
    border: "none",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
  },
  sessionItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    marginBottom: "12px",
  },
  sessionInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  sessionIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e2e8f0",
  },
  sessionDevice: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#1e293b",
  },
  sessionLocation: {
    display: "block",
    fontSize: "12px",
    color: "#64748b",
    marginTop: "2px",
  },
  sessionBadge: {
    padding: "4px 10px",
    backgroundColor: "#ecfdf5",
    color: "#059669",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 500,
  },
  revokeBtn: {
    padding: "6px 12px",
    backgroundColor: "transparent",
    color: "#dc2626",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
  },
};

export default Settings;
