import { useState, useEffect, useRef } from "react";
import "./PriceRangeSlider.css";

const PriceRangeSlider = ({
  min = 0,
  max = 100000,
  step = 500,
  minPrice,
  maxPrice,
  onChange,
}) => {
  const [minVal, setMinVal] = useState(minPrice);
  const [maxVal, setMaxVal] = useState(maxPrice);
  const minSliderRef = useRef(null);
  const maxSliderRef = useRef(null);
  const trackRef = useRef(null);

  // Update local state when props change
  useEffect(() => {
    setMinVal(minPrice);
    setMaxVal(maxPrice);
  }, [minPrice, maxPrice]);

  // Calculate percentages for positioning
  const getPercent = (value) => {
    return Math.round(((value - min) / (max - min)) * 100);
  };

  // Calculate left position for min slider
  const minLeft = getPercent(minVal);

  // Calculate right position for max slider (from right side)
  const maxRight = 100 - getPercent(maxVal);

  // Handle min slider change
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(value);
    onChange(value, maxVal);
  };

  // Handle max slider change
  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(value);
    onChange(minVal, value);
  };

  // Handle track click for min slider
  const handleTrackClick = (e) => {
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = (clickX / rect.width) * 100;
    const clickValue = min + (clickPercent / 100) * (max - min);

    // Round to nearest step
    const roundedValue = Math.round(clickValue / step) * step;
    const clampedValue = Math.min(Math.max(roundedValue, min), max);

    // Determine which slider is closer
    const distanceToMin = Math.abs(clampedValue - minVal);
    const distanceToMax = Math.abs(clampedValue - maxVal);

    if (distanceToMin < distanceToMax && clampedValue < maxVal - step) {
      setMinVal(clampedValue);
      onChange(clampedValue, maxVal);
    } else if (clampedValue > minVal + step) {
      setMaxVal(clampedValue);
      onChange(minVal, clampedValue);
    }
  };

  // Keyboard accessibility
  const handleKeyDown = (e, type) => {
    const value = type === "min" ? minVal : maxVal;
    const increment = e.shiftKey ? step * 5 : step;

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      const newValue = Math.min(
        value + increment,
        type === "min" ? maxVal - step : max,
      );
      if (type === "min") {
        setMinVal(newValue);
        onChange(newValue, maxVal);
      } else {
        setMaxVal(newValue);
        onChange(minVal, newValue);
      }
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      const newValue = Math.max(
        value - increment,
        type === "max" ? minVal + step : min,
      );
      if (type === "min") {
        setMinVal(newValue);
        onChange(newValue, maxVal);
      } else {
        setMaxVal(newValue);
        onChange(minVal, newValue);
      }
    }
  };

  return (
    <div className="price-range-slider">
      <div className="slider-track" ref={trackRef} onClick={handleTrackClick}>
        {/* Background track */}
        <div className="track-bg"></div>

        {/* Active range highlight */}
        <div
          className="track-active"
          style={{
            left: `${minLeft}%`,
            right: `${maxRight}%`,
          }}
        />

        {/* Min handle */}
        <div
          className="slider-handle min-handle"
          style={{ left: `${minLeft}%` }}
        >
          <div className="handle-inner" />
        </div>

        {/* Max handle */}
        <div
          className="slider-handle max-handle"
          style={{ left: `${getPercent(maxVal)}%` }}
        >
          <div className="handle-inner" />
        </div>
      </div>

      {/* Hidden range inputs for accessibility and interaction */}
      <input
        type="range"
        ref={minSliderRef}
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={handleMinChange}
        onKeyDown={(e) => handleKeyDown(e, "min")}
        className="slider-input min-input"
        aria-label="Minimum price"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={minVal}
      />

      <input
        type="range"
        ref={maxSliderRef}
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMaxChange}
        onKeyDown={(e) => handleKeyDown(e, "max")}
        className="slider-input max-input"
        aria-label="Maximum price"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={maxVal}
      />

      {/* Visual indicators */}
      <div className="slider-values">
        <div
          className="value-indicator min-value"
          style={{ left: `${minLeft}%` }}
        >
          <span className="value-dot"></span>
        </div>
        <div
          className="value-indicator max-value"
          style={{ left: `${getPercent(maxVal)}%` }}
        >
          <span className="value-dot"></span>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
