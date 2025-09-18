# Changelog

All notable changes to this project will be documented in this file.

---

## [2.0.1] - 2025-09-18
### Fixed
- A critical bug where the component would crash if the `value` prop was `null`, `undefined`, or a `string` from a database. The component now safely handles these cases.

## [2.0.0] - 2025-09-18

This is a major rewrite of the component, transforming it from a simple display tool into a fully interactive, customizable, and accessible library.

### Added
- **Interactive Ratings:** Full support for `onClick` and `onRatingChange` to capture user input.
- **Half-Star Precision:** Users can now select and see ratings in 0.5 increments.
- **Mobile Touch Support:** Smooth and responsive experience on touch devices.
- **Advanced Keyboard Navigation:** Full accessibility support for arrow keys, Home, End, Page Up/Down.
- **Custom Icons:** Added `customIcon` prop to allow any React component as the icon.
- **Custom Tooltips:** Added `tooltips` prop for descriptive text on hover.
- **Rounding Prop:** New `rounding` prop (`ceil`, `floor`, `nearest`) for flexible logic.
- **Prop-Types Validation:** Added `prop-types` for improved developer experience and robustness.

### Changed
- **Major Refactor:** Component was completely refactored for a smooth, flicker-free hover experience using `useRef` and `onMouseMove`.
- **Published Package:** Now includes both ESM and CJS builds for universal compatibility.
- **Tooltip Format:** Default tooltip is now more descriptive (e.g., "3.5 - Good").

### Fixed
- Fixed numerous rendering bugs, including the "invisible stars" issue with SVG masks and event propagation conflicts.

---
