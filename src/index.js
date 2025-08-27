import React, { useState } from "react";

// Helper function to calculate the precise rating based on mouse position.
const calculateRating = (event, iconValue) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  return mouseX < rect.width / 2 ? iconValue - 0.5 : iconValue;
};

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
  const displayValue = hoverValue ?? value;

  // Event handlers use the calculateRating helper.
  const handleMouseEnter = (event, iconValue) => {
    if (readOnly) return;
    setHoverValue(calculateRating(event, iconValue));
  };
  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverValue(null);
  };
  const handleClick = (event, iconValue) => {
    if (readOnly) return;
    event.stopPropagation();
    const newRating = calculateRating(event, iconValue);
    onRatingChange(newRating);
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

  // Default star path (used if no custom icon is provided)
  const DefaultStar = () => (
    <path d="M12 .587l3.668 7.429 8.207 1.192-5.938 5.787 1.401 8.17L12 18.897l-7.338 3.856 1.401-8.17L.125 9.208l8.207-1.192L12 .587z" />
  );

  return (
    <div
      role="slider"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label="Rating"
      aria-readonly={readOnly}
      tabIndex={readOnly ? -1 : 0}
      onKeyDown={handleKeyDown}
      onMouseLeave={handleMouseLeave}
      style={{ display: "inline-flex", alignItems: "center", ...style }}
      className={className}
    >
      {Array.from({ length: max }, (_, i) => {
        const iconValue = i + 1;
        let fillPercentage;
        if (displayValue >= iconValue) {
          fillPercentage = 100;
        } else if (displayValue > i) {
          fillPercentage = (displayValue - i) * 100;
        } else {
          fillPercentage = 0;
        }

        const gradientId = `grad-${iconValue}-${Math.random()}`;
        const maskId = `mask-${iconValue}-${Math.random()}`;
        const IconComponent = customIcon;
        const tooltipText =
          tooltips[i] || `${iconValue} star${iconValue > 1 ? "s" : ""}`;

        return (
          <div
            key={iconValue}
            onMouseEnter={(e) => handleMouseEnter(e, iconValue)}
            onClick={(e) => handleClick(e, iconValue)}
            style={{
              cursor: readOnly ? "default" : "pointer",
              width: size,
              height: size,
            }}
            title={tooltipText}
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
                  {/* Warping the icon in a <g> tag to force a white fill, making the mask work. */}
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

export default Rating;
