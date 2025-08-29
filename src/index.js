import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

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
}) => {
  const [hoverValue, setHoverValue] = useState(null);
  const [isTouching, setIsTouching] = useState(false);
  const ratingContainerRef = useRef(null);

  // const calculateRating = (e) => {
  //   if (!ratingContainerRef.current) return 0;
  //   const { width, left } = ratingContainerRef.current.getBoundingClientRect();
  //   const mouseX = e.clientX - left;
  //   const percent = Math.max(0, Math.min(1, mouseX / width));
  //   const rating = Math.ceil(percent * max * 2) / 2;
  //   return rating;
  // };

  const calculateRatingFromClientX = (clientX) => {
    if (!containerRef.current) return 0;
    const { width, left } = containerRef.current.getBoundingClientRect();
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

  // Event handlers
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

  // Touch handlers for mobile
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

  // Handler for keyboard navigation for accessibility.
  // const handleKeyDown = (e) => {
  //   if (readOnly) return;
  //   let newValue = value;
  //   if (e.key === "ArrowRight") {
  //     newValue = Math.min(max, value + 0.5);
  //   } else if (e.key === "ArrowLeft") {
  //     newValue = Math.max(0, value - 0.5);
  //   }
  //   if (newValue !== value) {
  //     onRatingChange(newValue);
  //   }
  // };

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
        // keep current value;
        break;
      default:
        return;
    }
    e.preventDefault();
    if (newValue !== value) onRatingChange(newValue);
  };

  // Tooltip logic
  const displayValue = hoverValue ?? value;
  const formattedValue =
    displayValue % 1 === 0 ? displayValue : displayValue.toFixed(1);

  const defaultTooltip = `${formattedValue} out of ${max}`;

  // Checking for custom tooltips
  if (tooltips) {
    const halfStepIndex = displayValue * 2 - 1;
    const tooltipIndex = Math.round(halfStepIndex); // Round to the nearest index

    // If the calculated index is valid and a tooltip exists
    if (tooltipIndex >= 0 && tooltips[tooltipIndex]) {
      finalTooltip = tooltips[tooltipIndex];
    } else {
      // If no custom tooltip is found, fall back to the default
      finalTooltip = defaultTooltip;
    }
  } else {
    // If no custom tooltips are provided, just use the default
    finalTooltip = defaultTooltip;
  }

  // For screen readers
  const ariaValueText = finalTooltip;

  // Default star path (used if no custom icon is provided)
  const DefaultStar = () => (
    <path d="M12 .587l3.668 7.429 8.207 1.192-5.938 5.787 1.401 8.17L12 18.897l-7.338 3.856 1.401-8.17L.125 9.208l8.207-1.192L12 .587z" />
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-valuenow={Number(value)}
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
      {Array.from({ length: max }, (_, index) => {
        const starNumber = index + 1;
        const isFullyFilled = displayValue >= starNumber;
        const isPartiallyFilled =
          displayValue > index && displayValue < starNumber;

        // Calculate how much to fill this star (0-100%)
        let fillAmount = 0;
        if (isFullyFilled) {
          fillAmount = 100;
        } else if (isPartiallyFilled) {
          fillAmount = (displayValue - index) * 100;
        }

        // Use stable IDs that won't change on every render
        const gradientId = `star-gradient-${uniqueId}-${starNumber}`;
        const maskId = `star-mask-${uniqueId}-${starNumber}`;

        return (
          <div
            key={starNumber}
            style={{
              width: size,
              height: size,
              display: "inline-block",
            }}
            aria-hidden="true" // Screen readers don't need each star
          >
            <svg height={size} width={size} viewBox="0 0 24 24">
              <defs>
                {/* Create a color gradient for filled/unfilled parts */}
                <linearGradient id={gradientId}>
                  <stop offset="0%" stopColor={fullColor} />
                  <stop offset={`${fillAmount}%`} stopColor={fullColor} />
                  <stop offset={`${fillAmount}%`} stopColor={emptyColor} />
                  <stop offset="100%" stopColor={emptyColor} />
                </linearGradient>

                {/* Create a mask in the shape of a star */}
                <mask id={maskId}>
                  <g fill="white">
                    {customIcon ? customIcon : <DefaultStar />}
                  </g>
                </mask>
              </defs>

              {/* Fill the rectangle with gradient but only show the star shape */}
              <rect
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
};

export default Rating;
