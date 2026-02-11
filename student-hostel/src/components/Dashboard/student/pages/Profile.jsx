import { useState, useEffect, useRef } from "react";
import { User, Mail, Phone, Camera } from "lucide-react";
import useAuth from "../../../../hooks/useAuth.jsx";
import authApi from "../../../../api/authApi.js";

const StudentProfile = () => {
  const { user, setUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const fileInputRef = useRef(null);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await authApi.getCurrentUser();
        const userData = response.user || response;
        
        setFormData({
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          email: userData.email || "",
          phone: userData.phone || "",
        });
        
        // Also update the auth context if needed
        if (setUser && userData) {
          setUser(userData);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("Failed to load profile data");
        // Fallback to auth context data
        if (user) {
          setFormData({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            email: user.email || "",
            phone: user.phone || "",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user, setUser]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    setError("");
    setSuccess("");
  };

  // Handle save changes - real API call
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      // Make actual API call to update profile
      const response = await authApi.updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
      });

      // Update local state with response
      const updatedUser = response.user || response;
      
      setFormData({
        first_name: updatedUser.first_name || "",
        last_name: updatedUser.last_name || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
      });

      // Update auth context
      if (setUser && updatedUser) {
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      console.error("Failed to save profile:", err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          "Failed to save profile. Please try again.";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel - reset to original values from API
  const handleCancel = async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");
      
      const response = await authApi.getCurrentUser();
      const userData = response.user || response;
      
      setFormData({
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    } catch (err) {
      console.error("Failed to reset profile:", err);
      setError("Failed to reset profile data");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle upload photo
  const handleUploadPhoto = () => {
    fileInputRef.current?.click();
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      
      alert(`Photo "${file.name}" selected. Upload functionality coming soon!`);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      
      <div style={styles.header}>
        <h1 style={styles.title}>Profile Settings</h1>
        <p style={styles.subtitle}>
          Manage your personal information and preferences
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div style={styles.errorMessage}>
          {error}
        </div>
      )}
      {success && (
        <div style={styles.successMessage}>
          {success}
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt="Profile"
                style={styles.avatarImg}
              />
            ) : (
              <User size={48} color="#6b7280" />
            )}
          </div>
          <button style={styles.uploadButton} onClick={handleUploadPhoto}>
            <Camera size={16} />
            Change Photo
          </button>
        </div>

        <div style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter your first name"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter your email"
              disabled
            />
            <span style={styles.hint}>Email cannot be changed</span>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="Enter your phone number"
            />
          </div>

          <div style={styles.actions}>
            <button
              style={{
                ...styles.saveButton,
                opacity: isSaving ? 0.7 : 1
              }}
              onClick={handleSaveChanges}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button 
              style={styles.cancelButton} 
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "800px" },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 0",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "16px",
  },
  header: { marginBottom: "32px" },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  subtitle: { fontSize: "16px", color: "#6b7280" },
  errorMessage: {
    padding: "12px 16px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "24px",
    border: "1px solid #fecaca",
  },
  successMessage: {
    padding: "12px 16px",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "24px",
    border: "1px solid #86efac",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "32px",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "32px",
    paddingBottom: "32px",
    borderBottom: "1px solid #e5e7eb",
  },
  avatar: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    backgroundColor: "#f3f4f6",
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
  uploadButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    backgroundColor: "#fff",
    color: "#3b82f6",
    border: "1px solid #3b82f6",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1a1a1a",
    outline: "none",
    transition: "border-color 0.2s",
  },
  hint: {
    fontSize: "12px",
    color: "#9ca3af",
    fontStyle: "italic",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "16px",
  },
  saveButton: {
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  cancelButton: {
    padding: "12px 24px",
    backgroundColor: "#fff",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default StudentProfile;

