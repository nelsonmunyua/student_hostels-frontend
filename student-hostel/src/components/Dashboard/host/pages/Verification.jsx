import { useState, useEffect, useCallback } from "react";
import {
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Upload,
  FileText,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import hostApi from "../../../../api/hostApi";

const HostVerification = () => {
  const { user } = useSelector((state) => state.auth);

  // State
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formSuccess, setFormSuccess] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    documentType: "business_license",
    documentUrl: "",
  });

  // Fetch verification status
  const fetchVerificationStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await hostApi.getVerificationStatus();
      setVerification(response);
    } catch (err) {
      console.error("Error fetching verification status:", err);
      setError("Failed to load verification status. Please try again.");
      // Mock data for demo
      setVerification({
        status: "not_submitted",
        message: "Verification not started",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVerificationStatus();
  }, [fetchVerificationStatus]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  // Handle document upload (mock)
  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload to cloud storage
      // For demo, we'll use a mock URL
      const mockUrl = `https://example.com/documents/${Date.now()}_${file.name}`;
      setFormData((prev) => ({ ...prev, documentUrl: mockUrl }));
    }
  };

  // Submit verification
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.documentUrl.trim()) {
      setFormError("Please upload a verification document.");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      await hostApi.submitVerification({
        document_type: formData.documentType,
        document_url: formData.documentUrl,
      });

      setFormSuccess(true);
      setFormData({ documentType: "business_license", documentUrl: "" });

      // Refresh verification status
      await fetchVerificationStatus();

      // Reset success message after 3 seconds
      setTimeout(() => {
        setFormSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Error submitting verification:", err);
      setFormError("Failed to submit verification. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      verified: {
        icon: CheckCircle,
        color: "#10b981",
        bgColor: "#d1fae5",
        borderColor: "#10b981",
        title: "Verified Host",
        description:
          "Your host account has been verified. You can now list properties and accept bookings.",
        buttonText: null,
      },
      pending: {
        icon: Clock,
        color: "#f59e0b",
        bgColor: "#fef3c7",
        borderColor: "#f59e0b",
        title: "Verification Pending",
        description:
          "Your verification is under review. This typically takes 1-3 business days.",
        buttonText: null,
      },
      rejected: {
        icon: X,
        color: "#ef4444",
        bgColor: "#fee2e2",
        borderColor: "#ef4444",
        title: "Verification Rejected",
        description:
          "Your verification was not approved. Please review the requirements and resubmit.",
        buttonText: "Resubmit Application",
      },
      not_submitted: {
        icon: AlertCircle,
        color: "#6b7280",
        bgColor: "#f3f4f6",
        borderColor: "#e5e7eb",
        title: "Verification Required",
        description:
          "Complete the verification process to start listing your properties and accepting bookings.",
        buttonText: "Start Verification",
      },
    };

    return (
      configs[status] ||
      configs.not_submitted
    );
  };

  // Get document type label
  const getDocumentTypeLabel = (type) => {
    const labels = {
      business_license: "Business License",
      national_id: "National ID / Passport",
      tax_registration: "Tax Registration Certificate",
      property_deed: "Property Deed / Lease Agreement",
      other: "Other Document",
    };
    return labels[type] || "Verification Document";
  };

  if (loading && !verification) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2
          size={40}
          color="#3b82f6"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <p>Loading verification status...</p>
      </div>
    );
  }

  const statusConfig = getStatusConfig(verification?.status || "not_submitted");
  const StatusIcon = statusConfig.icon;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerIcon}>
          <Shield size={28} color="#3b82f6" />
        </div>
        <div>
          <h1 style={styles.title}>Host Verification</h1>
          <p style={styles.subtitle}>
            Complete the verification process to become a verified host on our
            platform
          </p>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div style={styles.errorContainer}>
          <p>{error}</p>
          <button style={styles.retryButton} onClick={fetchVerificationStatus}>
            Retry
          </button>
        </div>
      )}

      {/* Current Status Card */}
      <div style={styles.statusCard}>
        <div
          style={{
            ...styles.statusIconContainer,
            backgroundColor: statusConfig.bgColor,
          }}
        >
          <StatusIcon size={40} color={statusConfig.color} />
        </div>
        <div style={styles.statusInfo}>
          <h2 style={{ ...styles.statusTitle, color: statusConfig.color }}>
            {statusConfig.title}
          </h2>
          <p style={styles.statusDescription}>{statusConfig.description}</p>
        </div>
        {statusConfig.buttonText && verification?.status !== "pending" && (
          <button
            style={styles.resubmitButton}
            onClick={() =>
              setVerification((prev) => ({ ...prev, status: "not_submitted" }))
            }
          >
            {statusConfig.buttonText}
          </button>
        )}
      </div>

      {/* Verification Details */}
      {verification && verification.status !== "not_submitted" && (
        <div style={styles.detailsCard}>
          <h3 style={styles.detailsTitle}>Verification Details</h3>
          <div style={styles.detailsGrid}>
            {verification.document_type && (
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Document Type</span>
                <span style={styles.detailValue}>
                  {getDocumentTypeLabel(verification.document_type)}
                </span>
              </div>
            )}
            {verification.submitted_at && (
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Submitted On</span>
                <span style={styles.detailValue}>
                  {new Date(verification.submitted_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            )}
            {verification.reviewed_at && (
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Reviewed On</span>
                <span style={styles.detailValue}>
                  {new Date(verification.reviewed_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </span>
              </div>
            )}
            {verification.reviewer_notes && (
              <div style={styles.detailItem}>
                <span style={styles.detailLabel}>Reviewer Notes</span>
                <span style={styles.detailValue}>{verification.reviewer_notes}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verification Requirements */}
      {verification?.status === "not_submitted" && (
        <div style={styles.requirementsCard}>
          <h3 style={styles.requirementsTitle}>
            <FileText size={20} />
            Verification Requirements
          </h3>
          <ul style={styles.requirementsList}>
            <li>
              <Check size={16} color="#10b981" />
              Valid government-issued ID (National ID or Passport)
            </li>
            <li>
              <Check size={16} color="#10b981" />
              Business license or proof of property ownership/lease
            </li>
            <li>
              <Check size={16} color="#10b981" />
              Tax registration certificate (if applicable)
            </li>
            <li>
              <Check size={16} color="#10b981" />
              Clear, readable documents
            </li>
            <li>
              <Check size={16} color="#10b981" />
              Documents must not be expired
            </li>
          </ul>
        </div>
      )}

      {/* Submit Verification Form */}
      {verification?.status === "not_submitted" && (
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Submit Verification</h2>
          <p style={styles.formSubtitle}>
            Fill out the form below to start the verification process
          </p>

          {formSuccess && (
            <div style={styles.successMessage}>
              <Check size={20} />
              <span>
                Your verification application has been submitted successfully!
                We'll review it within 1-3 business days.
              </span>
            </div>
          )}

          {formError && (
            <div style={styles.errorMessage}>{formError}</div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Document Type */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Document Type</label>
              <select
                name="documentType"
                value={formData.documentType}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="business_license">Business License</option>
                <option value="national_id">National ID / Passport</option>
                <option value="tax_registration">Tax Registration Certificate</option>
                <option value="property_deed">Property Deed / Lease Agreement</option>
                <option value="other">Other Document</option>
              </select>
            </div>

            {/* Document Upload */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                Upload Document <span style={styles.required}>*</span>
              </label>
              <div style={styles.uploadContainer}>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleDocumentUpload}
                  style={styles.fileInput}
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  style={styles.uploadLabel}
                >
                  <Upload size={24} color="#6b7280" />
                  <span style={styles.uploadText}>
                    {formData.documentUrl
                      ? "Document uploaded successfully"
                      : "Click to upload or drag and drop"}
                  </span>
                  <span style={styles.uploadSubtext}>
                    PDF, JPG, PNG up to 10MB
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(submitting ? styles.submitButtonDisabled : {}),
              }}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2
                    size={18}
                    color="#fff"
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Submitting...
                </>
              ) : (
                <>
                  <Shield size={18} />
                  Submit for Verification
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* FAQ Section */}
      <div style={styles.faqSection}>
        <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqList}>
          <div style={styles.faqItem}>
            <details style={styles.faqDetails}>
              <summary style={styles.faqQuestion}>
                Why do I need to verify my account?
              </summary>
              <p style={styles.faqAnswer}>
                Verification helps ensure the safety and trust of our platform
                for both hosts and guests. It confirms your identity and
                establishes credibility for your hosting business.
              </p>
            </details>
          </div>

          <div style={styles.faqItem}>
            <details style={styles.faqDetails}>
              <summary style={styles.faqQuestion}>
                How long does verification take?
              </summary>
              <p style={styles.faqAnswer}>
                Most verification applications are reviewed within 1-3 business
                days. You will receive an email notification once your verification
                status has been updated.
              </p>
            </details>
          </div>

          <div style={styles.faqItem}>
            <details style={styles.faqDetails}>
              <summary style={styles.faqQuestion}>
                What happens if my verification is rejected?
              </summary>
              <p style={styles.faqAnswer}>
                If your verification is rejected, you'll receive an email with
                feedback explaining why. You can then address the issues and
                resubmit your application for review.
              </p>
            </details>
          </div>

          <div style={styles.faqItem}>
            <details style={styles.faqDetails}>
              <summary style={styles.faqQuestion}>
                Can I list properties before verification?
              </summary>
              <p style={styles.faqAnswer}>
                Yes, you can browse the platform and prepare your listings, but
                you won't be able to publish them or accept bookings until your
                host account is verified.
              </p>
            </details>
          </div>

          <div style={styles.faqItem}>
            <details style={styles.faqDetails}>
              <summary style={styles.faqQuestion}>
                Is my personal information secure?
              </summary>
              <p style={styles.faqAnswer}>
                Yes, we take data security seriously. Your documents and personal
                information are encrypted and stored securely. We never share your
                documents with third parties.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    padding: "0 24px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    marginBottom: "32px",
  },
  headerIcon: {
    width: "60px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eff6ff",
    borderRadius: "12px",
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
  statusCard: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    padding: "32px",
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    marginBottom: "24px",
  },
  statusIconContainer: {
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "16px",
    flexShrink: 0,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: "22px",
    fontWeight: 600,
    marginBottom: "8px",
  },
  statusDescription: {
    fontSize: "15px",
    color: "#6b7280",
    lineHeight: 1.6,
  },
  resubmitButton: {
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
  },
  detailsCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    marginBottom: "24px",
  },
  detailsTitle: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "20px",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  detailLabel: {
    fontSize: "13px",
    color: "#6b7280",
  },
  detailValue: {
    fontSize: "15px",
    fontWeight: 500,
    color: "#1a1a1a",
  },
  requirementsCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "24px",
    marginBottom: "24px",
  },
  requirementsTitle: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "18px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "20px",
  },
  requirementsList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "32px",
    marginBottom: "32px",
  },
  formTitle: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  formSubtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginBottom: "24px",
  },
  successMessage: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px",
    backgroundColor: "#d1fae5",
    color: "#065f46",
    borderRadius: "10px",
    marginBottom: "24px",
    fontSize: "14px",
  },
  errorMessage: {
    padding: "12px 16px",
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
  },
  required: {
    color: "#ef4444",
  },
  select: {
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#fff",
  },
  uploadContainer: {
    position: "relative",
  },
  fileInput: {
    display: "none",
  },
  uploadLabel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    border: "2px dashed #e5e7eb",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s",
    backgroundColor: "#f9fafb",
  },
  uploadText: {
    marginTop: "12px",
    fontSize: "14px",
    color: "#374151",
    fontWeight: 500,
  },
  uploadSubtext: {
    marginTop: "4px",
    fontSize: "13px",
    color: "#9ca3af",
  },
  submitButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    padding: "14px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    marginTop: "8px",
  },
  submitButtonDisabled: {
    backgroundColor: "#93c5fd",
    cursor: "not-allowed",
  },
  faqSection: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    padding: "32px",
  },
  faqTitle: {
    fontSize: "22px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "24px",
  },
  faqList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  faqItem: {
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    overflow: "hidden",
  },
  faqDetails: {
    width: "100%",
  },
  faqQuestion: {
    padding: "16px 20px",
    backgroundColor: "#f9fafb",
    fontSize: "15px",
    fontWeight: 600,
    color: "#374151",
    cursor: "pointer",
    listStyle: "none",
    margin: 0,
  },
  faqAnswer: {
    padding: "16px 20px",
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: 1.6,
    borderTop: "1px solid #e5e7eb",
  },
};

export default HostVerification;

