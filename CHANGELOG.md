# Changelog

## 0.1.7 — 27 September 2026

- Keep embedded card and detail surfaces square.
- In dedicated full-screen views, let detail corners follow the active Home Assistant card radius, including square-corner themes.

## 0.1.6 — 27 September 2026

- Restore the edge-to-edge, square outer layout in dedicated panel views while retaining theme-shaped detail tiles and controls.
- Keep rounded outer corners on cards placed among other dashboard cards.

## 0.1.5 — 27 September 2026

- Keep the full-view card inset so its corners remain visible, and use the Home Assistant theme's radius scale when panel views request square cards.
- Shape detail tiles, icons, and action buttons with the corresponding Home Assistant theme variables.

## 0.1.4 — 27 September 2026

- Keep the default person summary focused on battery and tracker freshness; GPS accuracy and presence-change time remain optional.
- Format minute-based duration sensors as hours and minutes for sleep and similar readings.
- Give sleep icons a theme-aware blue accent.

## 0.1.3 — 27 September 2026

- Use Home Assistant theme surfaces and borders for the details panel.
- Give built-in details and common activity, health, and location icons distinct theme colors, with per-tile color overrides.
- Keep icon color fallbacks visible across custom themes.

## 0.1.2 — 26 September 2026

- Show a clear empty state when the person has no usable location.
