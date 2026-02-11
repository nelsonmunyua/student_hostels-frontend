import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Lock,
  Bell,
  Shield,
  Edit,
} from "lucide-react";
import { updateProfile } from "../../redux/slices/Thunks/authThunks";
import "./ProfilePage.css";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    university: user?.university || "",
    city: user?.city || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    alert("Password update functionality would be implemented here");
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200"
              }
              alt="Profile"
            />
            <button className="avatar-edit-btn">
              <Camera size={16} />
            </button>
          </div>

          <div className="profile-info">
            <h3>
              {user?.first_name} {user?.last_name || "Student User"}
            </h3>
            <p>{user?.email || "user@email.com"}</p>
          </div>

          <nav className="profile-nav">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="profile-main">
          {activeTab === "profile" && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                <button
                  className="edit-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit size={16} />
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name</label>
                    <div className="input-wrapper">
                      <User size={18} />
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Last Name</label>
                    <div className="input-wrapper">
                      <User size={18} />
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <Mail size={18} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number</label>
                  <div className="input-wrapper">
                    <Phone size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+254 700 000 000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>University/Institution</label>
                  <div className="input-wrapper">
                    <MapPin size={18} />
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., University of Nairobi"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>City</label>
                  <div className="input-wrapper">
                    <MapPin size={18} />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="e.g., Nairobi"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button type="submit" className="save-btn">
                      <Save size={18} />
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Security Settings</h2>
              </div>

              <div className="security-card">
                <div className="security-item">
                  <div className="security-icon">
                    <Lock size={24} />
                  </div>
                  <div className="security-content">
                    <h3>Change Password</h3>
                    <p>Update your password regularly for better security</p>
                  </div>
                </div>

                <form onSubmit={handlePasswordSubmit} className="password-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter new password"
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <button type="submit" className="update-password-btn">
                    Update Password
                  </button>
                </form>
              </div>

              <div className="security-card">
                <div className="security-item">
                  <div className="security-icon">
                    <Shield size={24} />
                  </div>
                  <div className="security-content">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                </div>
                <button className="enable-2fa-btn">Enable 2FA</button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Notification Preferences</h2>
              </div>

              <div className="notification-settings">
                <div className="notification-group">
                  <h3>Email Notifications</h3>

                  <label className="toggle-item">
                    <span>Booking confirmations</span>
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>

                  <label className="toggle-item">
                    <span>Booking reminders</span>
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>

                  <label className="toggle-item">
                    <span>New reviews</span>
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>

                  <label className="toggle-item">
                    <span>Price drop alerts</span>
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>

                  <label className="toggle-item">
                    <span>Newsletter</span>
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-group">
                  <h3>Push Notifications</h3>

                  <label className="toggle-item">
                    <span>New messages</span>
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>

                  <label className="toggle-item">
                    <span>Booking updates</span>
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>

                  <label className="toggle-item">
                    <span>Wishlist alerts</span>
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
