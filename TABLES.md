# Table Presentation Contract

Civic UI provides the table surface and overflow region; consumers own rows, sorting, filtering, pagination and mobile information architecture.

## Density

- Use the default spacing for mixed-content tables and repeated scanning.
- Add a host class for denser operational tables only when row labels remain readable at 200% zoom.
- Keep column headings visible and use `scope` or `aria-sort` for sortable headers.

## Overflow

`Table` renders a keyboard-focusable `.civic-table-scroll` region. Give it a concise `label`, keep the table width intrinsic, and let the region scroll horizontally rather than shrinking numeric columns below legibility.

## Mobile

For tables that cannot be scanned horizontally, keep the canonical table for desktop and provide a host-owned mobile card/list rendering. Preserve the same row labels, values, sorting order and pagination semantics. Civic UI does not infer a card layout from arbitrary data.

## Acceptance

- Keyboard users can focus and scroll the region.
- Headings and sort direction are announced.
- No text or controls overlap at narrow widths.
- The host's loading, empty, error and retry states remain visible outside the table region.
