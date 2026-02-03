import { User, Mail, Phone, Camera } from "lucide-react";

const StudentProfile = ({ user }) => {
  // Placeholder - will be implemented with actual API
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Profile Settings</h1>
        <p style={styles.subtitle}>Manage your personal information and preferences</p>
      </div>

      <div style={styles.card}>
        <div style={styles.avatarSection}>
          <div style={styles.avatar}>
            {user?.profile_picture ? (
              <img src={user.profile_picture} alt="Profile" style={styles.avatarImg} />
            ) : (
              <User size={48} color="#6b7280" />
            )}
          </div>
          <button style={styles.uploadButton}>
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
                defaultValue={user?.first_name}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                defaultValue={user?.last_name}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              defaultValue={user?.email}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              defaultValue={user?.phone}
              style={styles.input}
            />
          </div>

          <div style={styles.actions}>
            <button style={styles.saveButton}>Save Changes</button>
            <button style={styles.cancelButton}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: "800px" },
  header: { marginBottom: "32px" },
  title: { fontSize: "28px", fontWeight: 700, color: "#1a1a1a", marginBottom: "8px" },
  subtitle: { fontSize: "16px", color: "#6b7280" },
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