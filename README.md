# React Ratings Star

A simple, lightweight, and zero-dependency React component to display ratings with decimal values (e.g., 4.5 stars), compatible with React 16.8+.

## Installation

```bash
npm install react-ratings-star
```

## Basic Usage

Simply import the component and pass it a `value`.
To adjust the appearance, pass your desired values to the `size`, `fullColor` and `emptyColor` props.

```jsx
import React from "react";
import Rating from "react-ratings-stars";

function App() {
  return (
    <div>
      <h2>Product Review: 4.5 / 5</h2>
      <Rating value={4.5} />

      <h2>Another Review: 3.7 / 5</h2>
      <Rating value={3.7} size={32} fullColor="tomato" emptyColor="lightgray" />
    </div>
  );
}
```

## Props

| Prop         | Type     | Default   | Description                               |
| ------------ | -------- | --------- | ----------------------------------------- |
| `value`      | `number` | `0`       | The rating value to display.              |
| `max`        | `number` | `5`       | The maximum number of stars.              |
| `size`       | `number` | `24`      | The size (height and width) of each star. |
| `fullColor`  | `string` | `#FFD700` | The color of the filled part of the star. |
| `emptyColor` | `string` | `#E0E0E0` | The color of the empty part of the star.  |

- `Npm Link` - https://www.npmjs.com/package/react-ratings-star
