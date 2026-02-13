import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Camera, Save, X, Loader2 } from "lucide-react";
import useAuth from "../../../../hooks/useAuth.jsx";
import authApi from "../../../../api/authApi.js";
import studentApi from "../../../../api/studentApi.js";

const StudentProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });
  const [originalData, setOriginalData] = useState(null);
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  
  const fileInputRef = useRef(null);

  // Initialize form data from user
  useEffect(() => {
    if (user) {
      const userData = {
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone: user.phone || "",
      };
      setFormData(userData);
      setOriginalData(userData);
      if (user.profile_picture) {
        setPhotoPreview(user.profile_picture);
      }
    }
    // Simulate initial load time
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [user]);

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

  // Check if form has changes
  const hasChanges = originalData && Object.keys(formData).some(
    key => formData[key] !== originalData[key]
  );

  // Handle save changes - real API call
  const handleSaveChanges = async () => {
    if (!hasChanges) {
      alert("No changes to save");
      return;
    }

    try {
      setIsSaving(true);
      setError("");
      
      // Only send changed fields
      const changedFields = {};
      Object.keys(formData).forEach(key => {
        if (formData[key] !== originalData[key]) {
          changedFields[key] = formData[key];
        }
      });
      
      // Call API to update profile
      const response = await authApi.updateProfile(changedFields);
      
      // Update user in context/localStorage
      if (updateProfile) {
        await updateProfile(response.user || response);
      }
      
      setOriginalData({...formData});
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      const errorMsg = error.response?.data?.message || "Failed to save profile";
      setError(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel - reset to original values
  const handleCancel = () => {
    if (originalData) {
      setFormData({...originalData});
    }
  };

  // Handle upload photo preview
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // TODO: Implement actual upload
      alert(`Photo "${file.name}" selected. Upload feature coming soon!`);
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <Loader2 size={40} color="#3b82f6" style={{ animation: "spin 1s linear infinite" }} />
          <p style={styles.loadingText}>Loading profile...</p>
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
        <div>
          <h1 style={styles.title}>Profile Settings</h1>
          <p style={styles.subtitle}>
            Manage your personal information and preferences
          </p>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div style={styles.messageBannerError}>
          <span>{error}</span>
          <button style={styles.messageClose} onClick={() => setError("")}>×</button>
        </div>
      )}
      {success && (
        <div style={styles.messageBannerSuccess}>
          <span>{success}</span>
          <button style={styles.messageClose} onClick={() => setSuccess("")}>×</button>
        </div>
      )}

      <div style={styles.card}>
        <div style={styles.avatarSection}>
          <div style={styles.avatarWrapper}>
            <div style={styles.avatar}>
              {photoPreview ? (
                <img
                  src={photoPreview}
                  alt="Profile"
                  style={styles.avatarImg}
                />
              ) : (
                <User size={48} color="#6b7280" />
              )}
            </div>
            <button 
              style={styles.cameraButton} 
              onClick={() => fileInputRef.current?.click()}
              title="Change profile picture"
            >
              <Camera size={18} color="#fff" />
            </button>
          </div>
          <div style={styles.avatarInfo}>
            <h3 style={styles.avatarName}>
              {formData.first_name || "Student"} {formData.last_name || ""}
            </h3>
            <p style={styles.avatarRole}>Student Account</p>
            <button style={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>
              <Camera size={16} />
              Change Photo
            </button>
          </div>
        </div>

        <div style={styles.form}>
          <div style={styles.formRow}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>
                <User size={16} style={styles.inputIcon} />
                First Name
              </label>
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
              <label style={styles.label}>
                <User size={16} style={styles.inputIcon} />
                Last Name
              </label>
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
            <label style={styles.label}>
              <Mail size={16} style={styles.inputIcon} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              style={{...styles.input, ...styles.inputDisabled}}
              placeholder="Enter your email"
              disabled
            />
            <span style={styles.hint}>
              <span style={styles.lockIcon}>🔒</span> 
              Email cannot be changed for security reasons
            </span>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <Phone size={16} style={styles.inputIcon} />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="e.g., +254 700 000 000"
            />
            <span style={styles.hint}>
              This phone number will be used for booking-related communications
            </span>
          </div>

          <div style={styles.actions}>
            <button
              style={{
                ...styles.saveButton,
                ...(isSaving ? styles.saveButtonDisabled : {}),
                ...(!hasChanges ? styles.saveButtonDisabled : {})
              }}
              onClick={handleSaveChanges}
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
            <button 
              style={{
                ...styles.cancelButton,
                ...(!hasChanges ? styles.cancelButtonDisabled : {})
              }}
              onClick={handleCancel}
              disabled={!hasChanges || isSaving}
            >
              <X size={18} />
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div style={styles.infoCard}>
        <h3 style={styles.infoTitle}>Account Information</h3>
        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Account Status</span>
            <span style={styles.infoValueActive}>● Active</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Member Since</span>
            <span style={styles.infoValue}>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Last Updated</span>
            <span style={styles.infoValue}>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

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

const styles = {
  container: { 
    maxWidth: "800px",
    animation: "fadeIn 0.3s ease",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "80px 0",
  },
  loadingText: {
    marginTop: "16px",
    color: "#6b7280",
    fontSize: "14px",
  },
  header: { marginBottom: "32px" },
  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  subtitle: { fontSize: "16px", color: "#6b7280" },
  messageBannerError: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "24px",
    border: "1px solid #fecaca",
  },
  messageBannerSuccess: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "24px",
    border: "1px solid #86efac",
  },
  messageClose: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "inherit",
    opacity: 0.7,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "32px",
    marginBottom: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    marginBottom: "32px",
    paddingBottom: "32px",
    borderBottom: "1px solid #e5e7eb",
  },
  avatarWrapper: {
    position: "relative",
    flexShrink: 0,
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
    border: "3px solid #e5e7eb",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    border: "3px solid #fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  avatarInfo: {
    flex: 1,
  },
  avatarName: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "4px",
  },
  avatarRole: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "12px",
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 14px",
    backgroundColor: "#f3f4f6",
    color: "#374151",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
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
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  },
  inputIcon: {
    color: "#9ca3af",
  },
  input: {
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    color: "#1a1a1a",
    outline: "none",
    transition: "all 0.2s",
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f9fafb",
    color: "#9ca3af",
    cursor: "not-allowed",
  },
  hint: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    color: "#9ca3af",
    fontStyle: "italic",
  },
  lockIcon: {
    fontSize: "10px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    marginTop: "8px",
  },
  saveButton: {
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
    transition: "all 0.2s",
  },
  saveButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  cancelButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 24px",
    backgroundColor: "#fff",
    color: "#6b7280",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  cancelButtonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  infoTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "20px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
  },
  infoItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  infoLabel: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: 500,
  },
  infoValue: {
    fontSize: "15px",
    color: "#1a1a1a",
    fontWeight: 600,
  },
  infoValueActive: {
    fontSize: "15px",
    color: "#16a34a",
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
};

export default StudentProfile;

