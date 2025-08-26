import React, { useState } from "react";

// A customizable icon component that defaults to a star, with the option to substitute any other icon.
const RatingIcon = ({
  fillPercentage,
  size,
  fullColor,
  emptyColor,
  customIcon,
}) => {
  const IconComponent = customIcon;

  // If you pass in a custom icon, it’ll use that — otherwise it falls back to the default star ⭐
  if (IconComponent) {
    return (
      <IconComponent
        size={size}
        fillPercentage={fillPercentage}
        fullColor={fullColor}
        emptyColor={emptyColor}
      />
    );
  }

  // Unique gradient ID to prevent conflicts with multiple ratings.
  const gradientId = `grad-${Math.random()}`;

  return (
    <svg height={size} width={size} viewBox="0 0 24 24">
      <defs>
        <linearGradient id={gradientId}>
          <stop offset={`${fillPercentage}%`} stopColor={fullColor} />
          <stop offset={`${fillPercentage}%`} stopColor={emptyColor} />
        </linearGradient>
      </defs>
      <path
        d="M12 .587l3.668 7.429 8.207 1.192-5.938 5.787 1.401 8.17L12 18.897l-7.338 3.856 1.401-8.17L.125 9.208l8.207-1.192L12 .587z"
        fill={`url(#${gradientId})`}
        stroke={fullColor}
        strokeWidth="1"
      />
    </svg>
  );
};

// Helper function to calculate the precise rating based on mouse position.
const calculateRating = (event, iconValue) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  // If the mouse is in the left half of the icon, return a half-star rating.
  return mouseX < rect.width / 2 ? iconValue - 0.5 : iconValue;
};

// This is the primary Rating component, packed with useful features.
const Rating = ({
  value = 0,
  max = 5,
  onRatingChange = () => {}, // Callback function when the rating changes.
  readOnly = false,
  size = 24,
  fullColor = "#FFD700", // Gold
  emptyColor = "#E0E0E0", // Light Gray
  customIcon = null, // Prop for a custom icon component.
  tooltips = [], // Array of strings for hover tooltips.
  className = "",
  style = {},
}) => {
  // State to manage the hover effect.
  const [hoverValue, setHoverValue] = useState(null);

  // Shows either the hover value or the prop value.
  const displayValue = hoverValue ?? value;

  //  Event handlers use the calculateRating helper.
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
      newValue = Math.min(max, value + 1);
    } else if (e.key === "ArrowLeft") {
      newValue = Math.max(0, value - 1);
    }

    if (newValue !== value) {
      onRatingChange(newValue);
    }
  };

  return (
    <div
      // Accessibility attributes to make the component behave like a slider.
      role="slider"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label="Rating"
      aria-readonly={readOnly}
      tabIndex={readOnly ? -1 : 0} // Makes the component focusable.
      onKeyDown={handleKeyDown}
      // Resets the hover state when the mouse leaves the entire component.
      onMouseLeave={() => !readOnly && setHoverValue(null)}
      style={{ display: "inline-flex", alignItems: "center", ...style }}
      className={className}
    >
      {/* Create an array of icons from 1 to max */}
      {Array.from({ length: max }, (_, i) => {
        const iconValue = i + 1;
        let fillPercentage;
        if (displayValue >= iconValue) {
          fillPercentage = 100; // Full icon
        } else if (displayValue > i) {
          fillPercentage = (displayValue - i) * 100; // Partial icon
        } else {
          fillPercentage = 0; // Empty icon
        }

        // Uses the title attribute to display a tooltip on hover.
        const tooltipText =
          tooltips[i] || `${iconValue} star${iconValue > 1 ? "s" : ""}`;

        return (
          <div
            key={iconValue}
            // Event handlers for mouse interactions.
            onMouseEnter={() => !readOnly && setHoverValue(iconValue)}
            onClick={(e) => {
              if (readOnly) {
                return;
              }
              e.stopPropagation();
              onRatingChange(iconValue);
            }}
            style={{ cursor: readOnly ? "default" : "pointer" }}
            title={tooltipText}
          >
            <RatingIcon
              fillPercentage={fillPercentage}
              size={size}
              fullColor={fullColor}
              emptyColor={emptyColor}
              customIcon={customIcon}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Rating;
