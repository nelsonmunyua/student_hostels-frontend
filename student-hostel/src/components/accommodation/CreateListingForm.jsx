import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Upload,
  Plus,
  Trash2,
  MapPin,
  DollarSign,
  Users,
  Home,
  FileText,
} from "lucide-react";
import { createAccommodation } from "../../redux/slices/Thunks/accommodationThunks";

const CreateListingForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.accommodation);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    property_type: "",
    location: "",
    address: "",
    price_per_night: "",
    max_guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    images: [],
    house_rules: "",
    cancellation_policy: "flexible",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [imageUrls, setImageUrls] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");

  const propertyTypes = [
    { value: "single", label: "Single Room" },
    { value: "double", label: "Double Room" },
    { value: "bed_sitter", label: "Bed Sitter" },
    { value: "studio", label: "Studio" },
    { value: "apartment", label: "Apartment" },
    { value: "hostel", label: "Hostel" },
  ];

  const availableAmenities = [
    "WiFi",
    "Security",
    "Parking",
    "Laundry",
    "Study Room",
    "Kitchen",
    "Bathroom",
    "Balcony",
    "TV",
    "Air Conditioning",
    "Water Heater",
    "Wardrobe",
    "Meal Plan",
    "Cleaning Service",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAmenity = (amenity) => {
    if (amenity && !formData.amenities.includes(amenity)) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity],
      }));
    }
    setNewAmenity("");
  };

  const handleRemoveAmenity = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const handleAddImage = (url) => {
    if (url && formData.images.length < 5) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
      setImageUrls([...imageUrls, url]);
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: newImages }));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const listingData = {
      ...formData,
      price_per_night: parseFloat(formData.price_per_night),
      max_guests: parseInt(formData.max_guests),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
    };

    const result = await dispatch(createAccommodation(listingData));
    if (!result.error) {
      navigate("/host/my-listings");
    }
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Create New Listing</h1>
        <p style={styles.subtitle}>
          Add your property to start accepting bookings
        </p>
      </div>

      <div style={styles.progressContainer}>
        {[1, 2, 3, 4].map((step) => (
          <div key={step} style={styles.progressItem}>
            <div
              style={{
                ...styles.progressCircle,
                ...(currentStep >= step && styles.progressCircleActive),
                ...(currentStep === step && styles.progressCircleCurrent),
              }}
            >
              {step}
            </div>
            <span style={styles.progressLabel}>
              {step === 1 && "Basic Info"}
              {step === 2 && "Details"}
              {step === 3 && "Amenities"}
              {step === 4 && "Images"}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {currentStep === 1 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Basic Information</h2>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Home size={18} />
                Property Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., University View Hostel"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <FileText size={18} />
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your property..."
                style={{
                  ...styles.input,
                  minHeight: "120px",
                  resize: "vertical",
                }}
                required
              />
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Property Type *</label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleInputChange}
                  style={styles.select}
                  required
                >
                  <option value="">Select type</option>
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <Users size={18} />
                  Max Guests *
                </label>
                <input
                  type="number"
                  name="max_guests"
                  value={formData.max_guests}
                  onChange={handleInputChange}
                  min="1"
                  max="20"
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <MapPin size={18} />
                City/Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., Nairobi, Mombasa, Kisumu"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Full Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Full address of the property"
                style={styles.input}
                required
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Property Details</h2>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <DollarSign size={18} />
                Price per Night (KSh) *
              </label>
              <input
                type="number"
                name="price_per_night"
                value={formData.price_per_night}
                onChange={handleInputChange}
                placeholder="e.g., 5000"
                min="0"
                style={styles.input}
                required
              />
              <span style={styles.hint}>
                Set a competitive price for students
              </span>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>House Rules</label>
              <textarea
                name="house_rules"
                value={formData.house_rules}
                onChange={handleInputChange}
                placeholder="e.g., No smoking, Quiet hours 10PM-6AM, No pets allowed"
                style={{
                  ...styles.input,
                  minHeight: "100px",
                  resize: "vertical",
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Cancellation Policy</label>
              <select
                name="cancellation_policy"
                value={formData.cancellation_policy}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="flexible">
                  Flexible - Full refund 24h before
                </option>
                <option value="moderate">
                  Moderate - Full refund 5 days before
                </option>
                <option value="strict">Strict - No refund within 7 days</option>
              </select>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Amenities</h2>
            <p style={styles.stepSubtitle}>
              Select the amenities your property offers
            </p>

            <div style={styles.amenitiesGrid}>
              {availableAmenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() =>
                    formData.amenities.includes(amenity)
                      ? handleRemoveAmenity(amenity)
                      : handleAddAmenity(amenity)
                  }
                  style={{
                    ...styles.amenityButton,
                    ...(formData.amenities.includes(amenity) &&
                      styles.amenityButtonSelected),
                  }}
                >
                  {formData.amenities.includes(amenity) && (
                    <span style={styles.checkmark}>✓</span>
                  )}
                  {amenity}
                </button>
              ))}
            </div>

            <div style={styles.customAmenity}>
              <input
                type="text"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Add custom amenity"
                style={styles.input}
              />
              <button
                type="button"
                onClick={() => handleAddAmenity(newAmenity)}
                style={styles.addButton}
              >
                <Plus size={18} />
                Add
              </button>
            </div>

            {formData.amenities.length > 0 && (
              <div style={styles.selectedAmenities}>
                <h4 style={styles.selectedTitle}>Selected Amenities:</h4>
                <div style={styles.selectedList}>
                  {formData.amenities.map((amenity) => (
                    <div key={amenity} style={styles.selectedItem}>
                      {amenity}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(amenity)}
                        style={styles.removeButton}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 4 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Property Images</h2>
            <p style={styles.stepSubtitle}>
              Add up to 5 images of your property (first image will be the
              cover)
            </p>

            <div style={styles.imageUpload}>
              <input
                type="url"
                placeholder="Enter image URL"
                style={styles.input}
                id="imageUrl"
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("imageUrl");
                  handleAddImage(input.value);
                  input.value = "";
                }}
                style={styles.uploadButton}
              >
                <Upload size={18} />
                Add Image
              </button>
            </div>

            <div style={styles.imageGrid}>
              {formData.images.map((url, index) => (
                <div key={index} style={styles.imageCard}>
                  <img
                    src={url}
                    alt={`Property ${index + 1}`}
                    style={styles.imagePreview}
                  />
                  {index === 0 && <span style={styles.coverBadge}>Cover</span>}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={styles.removeImageButton}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.imageTips}>
              <h4 style={styles.tipsTitle}>Image Tips:</h4>
              <ul style={styles.tipsList}>
                <li>Use high-quality images (at least 800x600 pixels)</li>
                <li>Include photos of all rooms and common areas</li>
                <li>Show the exterior and surroundings</li>
                <li>Natural lighting works best</li>
              </ul>
            </div>
          </div>
        )}

        <div style={styles.navigation}>
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} style={styles.backButton}>
              Back
            </button>
          )}

          {currentStep < 4 ? (
            <button type="button" onClick={nextStep} style={styles.nextButton}>
              Next
            </button>
          ) : (
            <button type="submit" style={styles.submitButton}>
              Create Listing
            </button>
          )}
        </div>

        {error && <div style={styles.error}>{error}</div>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "40px 20px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
  },
  progressContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "40px",
    padding: "0 40px",
  },
  progressItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  progressCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
    transition: "all 0.3s",
  },
  progressCircleActive: {
    backgroundColor: "#3b82f6",
    color: "#fff",
  },
  progressCircleCurrent: {
    border: "3px solid #1e40af",
    boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.2)",
  },
  progressLabel: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: 500,
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  stepContent: {
    padding: "32px",
  },
  stepTitle: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: "8px",
  },
  stepSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "24px",
  },
  formGroup: {
    marginBottom: "24px",
  },
  formRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "24px",
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  select: {
    width: "100%",
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  hint: {
    display: "block",
    fontSize: "12px",
    color: "#64748b",
    marginTop: "4px",
  },
  amenitiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
    gap: "12px",
    marginBottom: "24px",
  },
  amenityButton: {
    position: "relative",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "center",
  },
  amenityButtonSelected: {
    backgroundColor: "#eff6ff",
    borderColor: "#3b82f6",
    color: "#3b82f6",
  },
  checkmark: {
    position: "absolute",
    top: "-8px",
    left: "-8px",
    width: "20px",
    height: "20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  customAmenity: {
    display: "flex",
    gap: "12px",
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 500,
  },
  selectedAmenities: {
    marginTop: "24px",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
  },
  selectedTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "12px",
  },
  selectedList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  selectedItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "20px",
    fontSize: "14px",
  },
  removeButton: {
    background: "none",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    padding: "2px",
    display: "flex",
    alignItems: "center",
  },
  imageUpload: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 20px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 500,
    whiteSpace: "nowrap",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "16px",
  },
  imageCard: {
    position: "relative",
    borderRadius: "8px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
  },
  imagePreview: {
    width: "100%",
    height: "120px",
    objectFit: "cover",
  },
  coverBadge: {
    position: "absolute",
    top: "8px",
    left: "8px",
    padding: "4px 8px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    borderRadius: "4px",
    fontSize: "10px",
    fontWeight: 600,
  },
  removeImageButton: {
    position: "absolute",
    top: "8px",
    right: "8px",
    padding: "6px",
    backgroundColor: "rgba(0,0,0,0.5)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  imageTips: {
    marginTop: "24px",
    padding: "16px",
    backgroundColor: "#f0f9ff",
    borderRadius: "8px",
    border: "1px solid #bae6fd",
  },
  tipsTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#0369a1",
    marginBottom: "8px",
  },
  tipsList: {
    fontSize: "13px",
    color: "#0c4a6e",
    paddingLeft: "20px",
    margin: 0,
  },
  navigation: {
    display: "flex",
    justifyContent: "space-between",
    padding: "24px 32px",
    borderTop: "1px solid #e5e7eb",
    backgroundColor: "#f8fafc",
  },
  backButton: {
    padding: "12px 24px",
    backgroundColor: "#fff",
    color: "#64748b",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  nextButton: {
    padding: "12px 32px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    marginLeft: "auto",
  },
  submitButton: {
    padding: "12px 32px",
    backgroundColor: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    marginLeft: "auto",
  },
  error: {
    padding: "16px",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    borderRadius: "8px",
    margin: "0 32px 16px",
    fontSize: "14px",
  },
};

export default CreateListingForm;
