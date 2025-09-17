# React Ratings Star ⭐

A fully customizable, interactive, and accessible rating component for React.

![](/src/gifs/Smooth-star.gif)

`react-ratings-star` is a feature-rich solution for capturing user ratings. It supports half-star precision, custom icons, touch devices, and is built with accessibility in mind.

---

### ✨ Features

- **Smooth Hover Effect:** A continuous, flicker-free hover animation provides a great user experience.
- **Half-Star Precision:** Allows for more nuanced feedback with 0.5 increments.
- 📱 **Mobile & Touch Ready:** Works perfectly on mobile devices with full touch support.
- 🎨 **Completely Customizable:** Easily change the size, colors, and even the icons themselves!
- ♿ **Accessible for Everyone:** Full keyboard navigation and ARIA attributes for screen reader support.
- 🧠 **Flexible Logic:** You can control the rounding behavior (`ceil`, `floor`, or `nearest`).

---

### 🚀 Installation

```bash
npm install react-ratings-star
```

---

### 🛠️ How to Use It

#### Just for Display

Need to show a static, non-interactive rating? Just pass a `value` and the `readOnly` prop. It's that easy.

```jsx
import Rating from "react-ratings-star";

<Rating value={4.2} readOnly={true} />;
```

#### Making it Clickable

To capture user input, manage the rating in your component's state and pass your update function to the `onRatingChange` prop.

```jsx
import React, { useState } from "react";
import Rating from "react-ratings-star";

function MyReview() {
  const [rating, setRating] = useState(0);

  return (
    <div>
      <h3>Rate this product:</h3>
      <Rating
        value={rating}
        onRatingChange={setRating}
        size={32}
        fullColor="teal"
      />
      <p>Your rating is: {rating}</p>
    </div>
  );
}
```

#### Adding Tooltips

Guide your users by providing descriptive tooltips. Just pass an array of strings. The component will automatically show the right text for each rating tier.

```jsx
import React, { useState } from "react";
import Rating from "react-ratings-star";

function TooltipRating() {
  const [rating, setRating] = useState(2.5);

  // A description for each star tier
  const tooltips = ["Terrible", "Poor", "Average", "Good", "Excellent"];

  return (
    <Rating value={rating} onRatingChange={setRating} tooltips={tooltips} />
  );
}
```

![](/src/gifs/Star-with-tooltips.gif)

#### Going Beyond Stars (Custom Icons)

Want to rate with hearts, circles, or something else entirely? No problem. Pass any React component to the `customIcon` prop. It works seamlessly with popular libraries like `react-icons`.

```jsx
import React, { useState } from "react";
import Rating from "react-ratings-star";
import { FaHeart } from "react-icons/fa";

function HeartRating() {
  const [rating, setRating] = useState(3.5);

  return (
    <Rating
      value={rating}
      onRatingChange={setRating}
      customIcon={FaHeart}
      fullColor="#E02424"
      emptyColor="#D1D5DB"
    />
  );
}
```

![](/src/gifs/Custom-icon.gif)

---

### ⚙️ All the Options (Props API)

| Prop                 | Type              | Default    | Description                                                                                                          |
| :------------------- | :---------------- | :--------- | :------------------------------------------------------------------------------------------------------------------- |
| **`value`**          | `number`          | `0`        | Your current rating value. This is a controlled prop.                                                                |
| **`onRatingChange`** | `function`        | `() => {}` | A function that gets called with the new rating when the user makes a selection. This is how you get the value back! |
| **`max`**            | `number`          | `5`        | The maximum number of icons in the rating.                                                                           |
| **`readOnly`**       | `boolean`         | `false`    | Set to `true` to disable all user interactions.                                                                      |
| **`size`**           | `number`          | `24`       | The size (height and width) of each icon in pixels.                                                                  |
| **`fullColor`**      | `string`          | `#FFD700`  | The color of the filled part of the icon.                                                                            |
| **`emptyColor`**     | `string`          | `#E0E0E0`  | The background color of the default star icon.                                                                       |
| **`customIcon`**     | `React.Component` | `null`     | Your own React component to use as the icon. It will be styled and made interactive automatically.                   |
| **`tooltips`**       | `string[]`        | `[]`       | An array of descriptive strings for each whole-star tier, e.g., `['Poor', 'Fair', 'Okay', 'Good', 'Excellent']`.     |
| **`rounding`**       | `string`          | `'ceil'`   | How to snap the rating value on hover/click. Can be `'ceil'`, `'floor'`, or `'nearest'`.                             |
| **`className`**      | `string`          | `''`       | A CSS class to apply to the main container.                                                                          |
| **`style`**          | `object`          | `{}`       | Inline styles to apply to the main container.                                                                        |

---

### ♿ Built for Everyone (Accessibility)

Accessibility is a core feature, not an afterthought. The component follows the WAI-ARIA `slider` pattern for an intuitive experience for all users.

#### Keyboard Navigation

When the component is focused, users can rate with their keyboard:

| Key                   | Function               |
| :-------------------- | :--------------------- |
| **Right / Up Arrow**  | Increase rating by 0.5 |
| **Left / Down Arrow** | Decrease rating by 0.5 |
| **Page Up**           | Increase rating by 1   |
| **Page Down**         | Decrease rating by 1   |
| **Home**              | Set rating to 0        |
| **End**               | Set rating to `max`    |

---

### License

MIT
