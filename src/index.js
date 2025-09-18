import PropTypes from "prop-types";
import React, { useRef, useState, useId } from "react";

// The primary Rating component, packed with useful features.
const Rating = ({
  value = 0,
  max = 5,
  onRatingChange = () => {},
  readOnly = false,
  size = 24,
  fullColor = "#FFD700",
  emptyColor = "#E0E0E0",
  customIcon = null,
  tooltips = [],
  className = "",
  style = {},
  rounding = "ceil",
}) => {
  const [hoverValue, setHoverValue] = useState(null);
  const [isTouching, setIsTouching] = useState(false);
  const ratingContainerRef = useRef(null);
  const uniqueId = useId();

  // Calculate rating based on mouse/touch position

  const calculateRatingFromClientX = (clientX) => {
    if (!ratingContainerRef.current) return 0;
    const { width, left } = ratingContainerRef.current.getBoundingClientRect();
    let percent = (clientX - left) / width;
    percent = Math.max(0, Math.min(1, percent));
    const raw = percent * max;

    let rating;
    if (rounding === "nearest") {
      rating = Math.round(raw * 2) / 2;
    } else if (rounding === "floor") {
      rating = Math.floor(raw * 2) / 2;
    } else {
      rating = Math.ceil(raw * 2) / 2;
    }

    return Math.max(0, Math.min(max, +rating.toFixed(2)));
  };

  // --- Event handlers ---

  //* Mouse handlers for the smooth hover effect

  const handleMouseMove = (e) => {
    if (readOnly || isTouching) return;
    setHoverValue(calculateRatingFromClientX(e.clientX));
  };

  const handleMouseLeave = () => {
    if (readOnly || isTouching) return;
    setHoverValue(null);
  };

  const handleClick = (e) => {
    if (readOnly) return;
    e.stopPropagation();
    onRatingChange(calculateRatingFromClientX(e.clientX));
  };

  //* Handlers for a smooth mobile touch experience.

  const handleTouchStart = (e) => {
    if (readOnly) return;
    setIsTouching(true);
    if (e.touches?.[0]) {
      setHoverValue(calculateRatingFromClientX(e.touches[0].clientX));
    }
  };
  const handleTouchMove = (e) => {
    if (readOnly) return;
    if (e.touches?.[0]) {
      setHoverValue(calculateRatingFromClientX(e.touches[0].clientX));
    }
  };
  const handleTouchEnd = (e) => {
    if (readOnly) return;
    setIsTouching(false);
    if (hoverValue !== null) onRatingChange(hoverValue);
    setHoverValue(null);
  };

  //* Handlers for keyboard navigation for accessibility.

  const handleKeyDown = (e) => {
    if (readOnly) return;
    let newValue = value;
    const step = 0.5;
    switch (e.key) {
      case "ArrowRight":
      case "ArrowUp":
        newValue = Math.min(max, +(value + step).toFixed(2));
        break;
      case "ArrowLeft":
      case "ArrowDown":
        newValue = Math.max(0, +(value - step).toFixed(2));
        break;
      case "Home":
        newValue = 0;
        break;
      case "End":
        newValue = max;
        break;
      case "PageUp":
        newValue = Math.min(max, +(value + 1).toFixed(2));
        break;
      case "PageDown":
        newValue = Math.max(0, +(value - 1).toFixed(2));
        break;
      case "Enter":
      case " ":
        break;
      default:
        return;
    }
    e.preventDefault();
    if (newValue !== value) onRatingChange(newValue);
  };

  //* --- Value & Tooltip Calculation ---

  const displayValue = hoverValue ?? Number(value) ?? 0;

  const formattedValue =
    displayValue % 1 === 0 ? displayValue : displayValue.toFixed(1);
  const numericTooltip = `${formattedValue} out of ${max}`;
  const descriptiveIndex = Math.ceil(displayValue) - 1;
  const descriptiveText = tooltips[descriptiveIndex];
  const finalTooltip = descriptiveText
    ? `${formattedValue} - ${descriptiveText}`
    : numericTooltip;

  // For screen readers
  const ariaValueText = finalTooltip;

  // Default star path (used if no custom icon is provided)
  const DefaultStar = () => (
    <path d="M12 .587l3.668 7.429 8.207 1.192-5.938 5.787 1.401 8.17L12 18.897l-7.338 3.856 1.401-8.17L.125 9.208l8.207-1.192L12 .587z" />
  );

  const IconComponent = customIcon;

  return (
    <div
      ref={ratingContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-valuenow={Number(value) ?? 0}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={ariaValueText}
      aria-label="Rating"
      aria-readonly={readOnly}
      tabIndex={readOnly ? -1 : 0}
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: readOnly ? "default" : "pointer",
        userSelect: "none",
        ...style,
      }}
      className={className}
      title={finalTooltip}
    >
      {Array.from({ length: max }, (_, i) => {
        const iconValue = i + 1;
        const effectiveDisplayValue = Math.min(displayValue, max);
        let fillPercentage;
        if (effectiveDisplayValue >= iconValue) {
          fillPercentage = 100;
        } else if (effectiveDisplayValue > i) {
          fillPercentage = (effectiveDisplayValue - i) * 100;
        } else {
          fillPercentage = 0;
        }

        // FIX: Use the stable uniqueId to create flicker-free SVG IDs.
        const gradientId = `grad-${uniqueId}-${iconValue}`;
        const maskId = `mask-${uniqueId}-${iconValue}`;

        return (
          <div
            key={iconValue}
            style={{ width: size, height: size }}
            aria-hidden="true"
          >
            <svg height={size} width={size} viewBox="0 0 24 24">
              <defs>
                <linearGradient id={gradientId}>
                  <stop offset="0%" stopColor={fullColor} />
                  <stop offset={`${fillPercentage}%`} stopColor={fullColor} />
                  <stop offset={`${fillPercentage}%`} stopColor={emptyColor} />
                  <stop offset="100%" stopColor={emptyColor} />
                </linearGradient>
                <mask id={maskId}>
                  <g fill="white">
                    {IconComponent ? (
                      <IconComponent size={size} />
                    ) : (
                      <DefaultStar />
                    )}
                  </g>
                </mask>
              </defs>
              <rect
                x="0"
                y="0"
                width="100%"
                height="100%"
                fill={`url(#${gradientId})`}
                mask={`url(#${maskId})`}
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  onRatingChange: PropTypes.func,
  readOnly: PropTypes.bool,
  size: PropTypes.number,
  fullColor: PropTypes.string,
  emptyColor: PropTypes.string,
  customIcon: PropTypes.elementType,
  tooltips: PropTypes.arrayOf(PropTypes.string),
  className: PropTypes.string,
  style: PropTypes.object,
  rounding: PropTypes.oneOf(["ceil", "floor", "nearest"]),
};

export default Rating;
