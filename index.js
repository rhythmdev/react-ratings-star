import React from "react";

// A single, reusable Star component using an SVG linearGradient for the partial fills
const Star = ({ fillPercentage, size, fullColor, emptyColor }) => {
  // An unique ID for the gradient to avoid conflicts
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

// Thee main component you will export
const Rating = ({
  value = 0,
  max = 5,
  size = 24,
  fullColor = "#FFD700", // Gold
  emptyColor = "#E0E0E0", // Light Gray
}) => {
  const stars = [];

  for (let i = 1; i <= max; i++) {
    let fillPercentage;
    if (value >= i) {
      fillPercentage = 100; // This star is completely full
    } else if (value > i - 1) {
      fillPercentage = (value - (i - 1)) * 100; // This star is partially full
    } else {
      fillPercentage = 0; // This star is completely empty
    }

    stars.push(
      <Star
        key={i}
        fillPercentage={fillPercentage}
        size={size}
        fullColor={fullColor}
        emptyColor={emptyColor}
      />
    );
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>{stars}</div>
  );
};

export default Rating;
