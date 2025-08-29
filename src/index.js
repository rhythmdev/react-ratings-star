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
      setHoverValue(calculateRating(e.touches[0].e));
    }
  };

  // Handler for keyboard navigation for accessibility.
  const handleKeyDown = (e) => {
    if (readOnly) return;
    let newValue = value;
    if (e.key === "ArrowRight") {
      newValue = Math.min(max, value + 0.5);
    } else if (e.key === "ArrowLeft") {
      newValue = Math.max(0, value - 0.5);
    }
    if (newValue !== value) {
      onRatingChange(newValue);
    }
  };
  const displayValue = hoverValue ?? value;

  // Tooltip logic
  const defaultTooltip = `${displayValue} out of ${max}`;
  const finalTooltip = tooltips[Math.ceil(displayValue) - 1] || defaultTooltip;

  // Default star path (used if no custom icon is provided)
  const DefaultStar = () => (
    <path d="M12 .587l3.668 7.429 8.207 1.192-5.938 5.787 1.401 8.17L12 18.897l-7.338 3.856 1.401-8.17L.125 9.208l8.207-1.192L12 .587z" />
  );

  return (
    <div
      ref={ratingContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="slider"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label="Rating"
      aria-readonly={readOnly}
      tabIndex={readOnly ? -1 : 0}
      style={{
        display: "inline-flex",
        alignItems: "center",
        cursor: readOnly ? "default" : "pointer",
        ...style,
      }}
      className={className}
      title={finalTooltip}
    >
      {Array.from({ length: max }, (_, i) => {
        const iconValue = i + 1;
        const finalDisplayValue = Math.min(displayValue, max);
        let fillPercentage;
        if (finalDisplayValue >= iconValue) {
          fillPercentage = 100;
        } else if (finalDisplayValue > i) {
          fillPercentage = (finalDisplayValue - i) * 100;
        } else {
          fillPercentage = 0;
        }

        const gradientId = `grad-${iconValue}-${Math.random()}`;
        const maskId = `mask-${iconValue}-${Math.random()}`;
        const IconComponent = customIcon;

        return (
          <div key={iconValue} style={{ width: size, height: size }}>
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
};

export default Rating;
