# Changelog

## Unreleased

- Keep keyboard focus in `Pagination` when previous or next reaches a boundary page and
  disables itself; focus moves to the opposite button.

## 0.8.0 — 2026-10-14

- Add `StatusMessage` for success, warning and error outcomes with a keyboard-operable
  retry button; errors use `role="alert"`, the others `role="status"`.
- Add `Table` `density` (`comfortable`, `compact`) and `mobileLayout` (`scroll`, `cards`)
  props; the card layout stacks rows below 560 px using host-supplied `data-label`s.
- Announce the whole `FilterToolbar` result count (`aria-atomic`) and document its
  responsive composition with labelled fields.
- Add `enLabels` and the `CivicLabels` type, and an opt-in Romanian preset at
  `@cristiannichifor/civic-ui/locales/ro`. English defaults are unchanged.
- Keep checked, selected and highlighted states visible in forced colors, and stop the
  `OperationStatus` spinner and `Switch` transition for reduced motion.
- Add status (`--civic-success`, `--civic-warning`, `--civic-info` and on-colours),
  space, type-scale and weight tokens, and colour-blind-safe categorical, sequential
  and diverging data-visualisation palettes for light and dark modes.
- Add `formatRON`, `formatNumberRO` and `formatDateRO` to the `locales/ro` entry.
- Showcase: report the installed version, number and link every section, add an EN/RO
  toggle and props tables.
- Add `SiteShell`, `FamilyBar` and `SiteFooter` for the shared family bar (back link,
  tool name, status, language links) and footer slots (method, privacy, source, contact).
- Add `StatTile` and `StatGrid` with locale-aware numbers, deltas stated in text, and
  as-of dates.
- Add `ChartFrame` (title, question, demo badge, show-as-table toggle, empty and error
  slots) and `SourceCitation`; the host still renders the chart.
- Add `scripts/changelog-section.mjs` so a release body holds only its own version.
- Add `Select` `portalContainer` so its options can render inside a themed `.civic-scope`
  container, like `Dialog`; the default `document.body` portal is unchanged.
- Add [docs/UPGRADING.md](docs/UPGRADING.md) for 0.3 to 0.6 consumers.

## 0.7.0

Published on GitHub Releases.

- Add themed `Switch`, `Select` and `Popover` wrappers around Radix primitives.
- Keep state, persistence, validation, translations and side effects caller-owned.
- Add showcase examples and keyboard interaction coverage.

## 0.6.0

Published on GitHub Releases.

- Add native `RangeSlider` and `SegmentedControl` primitives for bounded numeric
  input and compact mutually-exclusive choices.
- Keep formatting, persistence, validation and domain semantics caller-owned.
- Add showcase examples and browser coverage for keyboard and native form behavior.

## 0.5.0

Published on GitHub Releases.

- Add reusable `Card`, `Progress`, `Skeleton` and `VisuallyHidden` primitives based on
  repeated consumer patterns across the civic demos and simulators.
- Keep data loading, progress state, card content and domain layouts caller-owned.
- Expand the showcase and browser contract coverage for these primitives.

## 0.4.0

Published on GitHub Releases.

- Add `OperationStatus` for explicit idle, running, success and failure states
  with caller-owned labels and retry actions.
- Add `FilterToolbar` for compact, accessible filter controls with explicit
  reset behavior and responsive layout guidance.
- Document table composition, filtering and status patterns for consumer apps;
  no data fetching, persistence or domain logic is included.
- Expand React 18/19 browser coverage for status transitions, filter reset,
  keyboard interaction and narrow layouts.

## 0.3.0

Published on GitHub Releases.

- Add an opt-in native CSS entry and documented plain HTML contract for fields,
  browser-arrow selects, checkboxes, buttons and accessible table scroll regions.
- Prepare a separate, deterministic CSS-only GitHub release asset with MIT license
  and checksum; no React runtime or npm account required.
- Test the extracted CSS in plain HTML at three widths and both neutral color modes,
  in Chromium, Firefox and WebKit with JavaScript disabled and HTTP(S) blocked;
  enable offline emulation after file navigation for WebKit compatibility.

This release added native CSS assets only; no React API or dependency changes.

## 0.2.0

Published on GitHub Releases.

- Add Textarea, Checkbox and native RadioGroup form controls.
- Add Notice, ValidationSummary, StatusBadge, EmptyState and LoadingIndicator.
- Add Radix-backed Dialog, AlertDialog, Tabs, Tooltip and DropdownMenu.
- Add semantic Table, SortableHeader and controlled Pagination without data logic.
- Add optional host-scoped overlay portals, neutral/USR styles and synthetic examples.
- Add React DOM peer and pinned MIT-licensed Radix dependencies; retain GitHub-only distribution.
- Expand React 18/19 browser coverage for keyboard behavior, focus return, validation, themes, mobile bounds, sorting, pagination and offline interaction.

This release did not change consuming application code, data, routes or published 0.1.0 assets.

## 0.1.0

First GitHub-distributed version, published on GitHub Releases.

- Native Button, IconButton, Field, Input and NativeSelect components.
- ESM JavaScript and TypeScript declarations; React 18.3.1 and 19.1.1 verified independently.
- Explicit base CSS and separate neutral light/dark and USR host-token adapters.
- MIT license with React and Lucide notices retained.
- Versioned GitHub tarball and SHA-256 checksum; no npm registry publication or account required.

Browser verification at the initial release covered Chromium only. Native CSS nesting is required. No SSR/RSC certification, fonts, logos, persistence or domain logic is included. Existing apps are not migrated by this release.
