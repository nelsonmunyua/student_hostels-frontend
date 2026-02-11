import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import {
  MapPin,
  Navigation,
  ZoomIn,
  ZoomOut,
  Layers,
  X,
  Heart,
  Star,
  Crosshair,
  Locate,
} from "lucide-react";
import "./MapView.css";

const MapView = ({ accommodations = [], onMarkerClick, isVisible = true }) => {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [zoom, setZoom] = useState(12);
  const [mapType, setMapType] = useState("streets");
  const [mapStyle, setMapStyle] = useState("light");

  const { filters } = useSelector((state) => state.accommodation);

  useEffect(() => {
    if (!mapRef.current || !isVisible) return;
  }, [isVisible]);

  const getCenter = useCallback(() => {
    if (accommodations.length === 0) {
      return { lat: -1.2921, lng: 36.8219 };
    }
    const validAccommodations = accommodations.filter(
      (a) => a.latitude && a.longitude,
    );
    if (validAccommodations.length === 0) {
      return { lat: -1.2921, lng: 36.8219 };
    }
    const avgLat =
      validAccommodations.reduce((sum, a) => sum + parseFloat(a.latitude), 0) /
      validAccommodations.length;
    const avgLng =
      validAccommodations.reduce((sum, a) => sum + parseFloat(a.longitude), 0) /
      validAccommodations.length;
    return { lat: avgLat, lng: avgLng };
  }, [accommodations]);

  const center = getCenter();

  const handleMarkerClick = useCallback(
    (accommodation) => {
      setSelectedAccommodation(accommodation);
      onMarkerClick?.(accommodation);
    },
    [onMarkerClick],
  );

  const closePopup = useCallback(() => {
    setSelectedAccommodation(null);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 1, 18));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 1, 5));
  }, []);

  const handleResetView = useCallback(() => {
    setZoom(12);
  }, []);

  const toggleMapStyle = useCallback(() => {
    setMapStyle((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const accommodationsWithCoords = accommodations.filter(
    (acc) => acc.latitude && acc.longitude,
  );

  const getMarkerPosition = useCallback(
    (accommodation) => {
      const latOffset = (Math.random() - 0.5) * 0.008;
      const lngOffset = (Math.random() - 0.5) * 0.008;
      return {
        left: `${40 + (parseFloat(accommodation.longitude || center.lng) - center.lng) * 400 + lngOffset * 1000}%`,
        top: `${40 + (center.lat - parseFloat(accommodation.latitude || center.lat)) * 400 + latOffset * 1000}%`,
      };
    },
    [center],
  );

  const getMarkerColor = (price) => {
    if (price < 5000) return "#10b981";
    if (price < 10000) return "#3b82f6";
    if (price < 20000) return "#f59e0b";
    return "#ef4444";
  };

  if (!isVisible) return null;

  return (
    <div className="map-view" ref={containerRef}>
      <div className={`map-container ${mapStyle}`} ref={mapRef}>
        <div className="map-background light-theme">
          <svg
            className="map-svg"
            viewBox="0 0 1000 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient
                id="lightGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#e0f2fe" />
                <stop offset="50%" stopColor="#bae6fd" />
                <stop offset="100%" stopColor="#7dd3fc" />
              </linearGradient>
              <pattern
                id="gridPattern"
                width="50"
                height="50"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 50 0 L 0 0 0 50"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lightGradient)" />
            <rect width="100%" height="100%" fill="url(#gridPattern)" />

            <g className="roads">
              <path
                d="M 0 300 Q 250 280 500 300 T 1000 320"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="8"
              />
              <path
                d="M 200 0 Q 220 150 200 300 T 180 600"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="6"
              />
              <path
                d="M 400 0 Q 420 200 400 400 T 380 600"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="6"
              />
              <path
                d="M 600 0 Q 580 150 620 300 T 600 600"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="6"
              />
              <path
                d="M 800 0 Q 780 200 820 400 T 800 600"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="6"
              />
              <path
                d="M 100 150 Q 300 180 500 140 T 900 160"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="4"
              />
              <path
                d="M 50 450 Q 250 420 450 460 T 750 440 T 950 470"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="4"
              />
            </g>

            <ellipse
              cx="150"
              cy="200"
              rx="60"
              ry="40"
              fill="#86efac"
              opacity="0.5"
            />
            <ellipse
              cx="750"
              cy="150"
              rx="80"
              ry="50"
              fill="#86efac"
              opacity="0.5"
            />
            <ellipse
              cx="300"
              cy="450"
              rx="70"
              ry="45"
              fill="#86efac"
              opacity="0.5"
            />
            <ellipse
              cx="850"
              cy="400"
              rx="60"
              ry="35"
              fill="#86efac"
              opacity="0.5"
            />
            <ellipse
              cx="500"
              cy="500"
              rx="100"
              ry="30"
              fill="#7dd3fc"
              opacity="0.6"
            />
          </svg>
        </div>

        <div className="map-controls">
          <button
            className="control-btn"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn size={20} />
          </button>
          <button
            className="control-btn"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut size={20} />
          </button>
          <button
            className="control-btn"
            onClick={handleResetView}
            title="Reset View"
          >
            <Crosshair size={20} />
          </button>
          <div className="control-divider" />
          <button
            className="control-btn"
            onClick={toggleMapStyle}
            title="Toggle Map Style"
          >
            <Layers size={20} />
          </button>
          <button className="control-btn" title="My Location">
            <Locate size={20} />
          </button>
        </div>

        <div className="zoom-indicator">
          <span>{zoom}x</span>
        </div>

        <div className="map-results-count">
          <span className="count-number">
            {accommodationsWithCoords.length}
          </span>
          <span className="count-label">properties</span>
        </div>

        {accommodationsWithCoords.map((accommodation) => {
          const position = getMarkerPosition(accommodation);
          const isSelected = selectedAccommodation?.id === accommodation.id;
          const markerColor = getMarkerColor(accommodation.price_per_night);

          return (
            <button
              key={accommodation.id}
              className={`map-marker ${isSelected ? "selected" : ""}`}
              style={{
                left: position.left,
                top: position.top,
              }}
              onClick={() => handleMarkerClick(accommodation)}
            >
              <div className="marker-pin" style={{ color: markerColor }}>
                <MapPin size={32} />
              </div>
              <div
                className="marker-price"
                style={{ backgroundColor: markerColor }}
              >
                {formatPrice(accommodation.price_per_night)}
              </div>
            </button>
          );
        })}

        {accommodationsWithCoords.length === 0 && (
          <div className="map-no-results">
            <MapPin size={48} />
            <p>No accommodations with location data</p>
          </div>
        )}
      </div>

      {selectedAccommodation && (
        <div className="map-popup fade-in">
          <button className="popup-close" onClick={closePopup}>
            <X size={18} />
          </button>

          <div className="popup-image">
            <img
              src={selectedAccommodation.images?.[0] || "/placeholder.jpg"}
              alt={selectedAccommodation.title}
            />
            <button className="popup-wishlist">
              <Heart size={16} />
            </button>
            {selectedAccommodation.featured && (
              <span className="popup-featured">Featured</span>
            )}
          </div>

          <div className="popup-content">
            <div className="popup-header">
              <h4>{selectedAccommodation.title}</h4>
              {selectedAccommodation.rating && (
                <span className="popup-rating">
                  <Star size={12} fill="currentColor" />
                  {selectedAccommodation.rating.toFixed(1)}
                </span>
              )}
            </div>

            <p className="popup-location">
              <MapPin size={12} />
              {selectedAccommodation.location}
            </p>

            <div className="popup-amenities">
              {selectedAccommodation.wifi && (
                <span className="popup-amenity">WiFi</span>
              )}
              {selectedAccommodation.meals_included && (
                <span className="popup-amenity">Meals</span>
              )}
              {selectedAccommodation.study_room && (
                <span className="popup-amenity">Study Room</span>
              )}
            </div>

            <div className="popup-footer">
              <div className="popup-price-info">
                <span className="popup-price">
                  {formatPrice(selectedAccommodation.price_per_night)}
                </span>
                <span className="popup-price-label">/night</span>
              </div>
              <a
                href={`/accommodations/${selectedAccommodation.id}`}
                className="popup-button"
              >
                View Details
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="map-attribution">
        <span>StudentHostels Map</span>
        <span className="attribution-divider">•</span>
        <span>Powered by Leaflet</span>
      </div>
    </div>
  );
};

export default MapView;
