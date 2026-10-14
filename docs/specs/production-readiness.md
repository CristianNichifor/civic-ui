# Production readiness

Scope of the 0.8.0 preparation on `dev`. Every item names the test that proves it.
State: `todo`, `done`, `blocked` or `needs-human`.

Translations written for this work are marked **needs human review**.

## Theme A: localisation and system modes

### CU-1 Romanian label preset — done

Components keep English defaults; hosts that want Romanian opt in through a
separate entry, `@cristiannichifor/civic-ui/locales/ro`, which exports `roLabels`.
`enLabels` (main entry) holds every default string and is the single source the
components read their defaults from. The `CivicLabels` type makes a preset
incomplete at compile time if a key is missing.

- Given a host that renders `Pagination`, `Select`, `Dialog`, `AlertDialog`,
  `LoadingIndicator`, `FilterToolbar` and `ValidationSummary` without a preset,
  when the page loads, then every accessible name and placeholder is the
  English default (unchanged from 0.7.0).
- Given the same components spread with `roLabels.<Component>`, when the page
  loads, then every default string is the Romanian one, with comma-below ș and ț.
- Given the packed tarball, when `npm run verify` runs, then the allowlist
  contains `dist/locales/ro.js` and `dist/locales/ro.d.ts`, and both React
  consumers typecheck an import of `roLabels` (with a `@ts-expect-error` for an
  unknown key).
- Given `enLabels` and `roLabels`, then they have identical key sets.

Tests: `tests/locale.spec.ts`, `fixtures/type-contract.tsx`, `verify.mjs`.
Romanian strings: **needs human review**.

### CU-2 Forced colors and reduced motion — done

- Given `forced-colors: active`, when a `Switch` is checked, then its track uses
  `Highlight` and its thumb stays visible; unchecked, the track has a
  `CanvasText` border.
- Given `forced-colors: active`, when a `SegmentedControl` option is checked,
  then it uses `Highlight`/`HighlightText`; highlighted `Select` and menu items
  and the active tab do the same.
- Given `forced-colors: active`, then `RangeSlider` and `Progress` keep a
  system-colour outline, and every focus ring stays a solid outline.
- Given `prefers-reduced-motion: reduce`, then the `LoadingIndicator` and
  `OperationStatus` spinners do not animate and the `Switch` thumb does not
  transition.

Tests: `tests/forced-colors.spec.ts` (`emulateMedia({ forcedColors: 'active' })`,
skipped in engines that cannot emulate it), reduced-motion case in the same file.
The highlighted-option check runs on the scoped `DropdownMenu` (`?portal=1`): `Select`
content portals to `document.body`, outside `.civic-scope`, so no scoped rule reaches
it. That predates this work; giving `Select` a `portalContainer` is **needs-human**
(API decision).

## Theme B: roadmap "Next"

### CU-6 StatusMessage — done

- Given `tone="success"` or `"warning"`, then the message has `role="status"`;
  given `tone="error"`, then `role="alert"`.
- Given `onRetry`, then a native retry button named by `retryLabel` (default
  `enLabels.StatusMessage.retryLabel`) is rendered, and Enter or Space on it calls
  `onRetry`.
- Without `onRetry`, no button is rendered.

Tests: `tests/status.spec.ts`; showcase "Feedback" section.

### CU-7 Filter toolbar composition — done

- Given the showcase toolbar at 390 px, then the page has no horizontal
  overflow, every field fits inside the toolbar and the fields wrap onto more
  than one row.
- Given a search term, when the result count changes, then the count element
  has `aria-live="polite"` and `aria-atomic="true"` and shows the new count;
  Reset restores the full count.

Tests: `tests/filter-toolbar.spec.ts`; showcase "Tabs and tables" section.

### CU-8 Table density contract — done

- Given `<Table density="compact">`, then the table has
  `data-density="compact"` and cell padding is smaller than the default.
- Given `<Table mobileLayout="cards">` at 390 px, then rows render as cards,
  each cell shows its `data-label`, header cells stay visible as one wrapping
  row (so sort buttons remain reachable) and the page has no horizontal overflow; at 1440 px the canonical table is shown.
- The showcase "View density" control drives the archive table density.

Tests: `tests/table-density.spec.ts`; `TABLES.md` updated.

## Theme C: release notes and upgrades

### CU-3 Per-version release notes — done (workflow change needs-human)

- Given `CHANGELOG.md` and a version, when `scripts/changelog-section.mjs`
  runs, then it prints only that version's section body.
- Given a version with no section, then it exits non-zero with a message.
- The release workflow change (`--notes-file` from the script) is delivered as
  a diff for the maintainer.

Tests: `tests/release.test.mjs`.

### CU-3b Upgrade guide — done

`docs/UPGRADING.md` covers 0.3, 0.4, 0.5 and 0.6 to 0.8 for vendored-CSS and
npm-tarball consumers. Reviewed by reading; no automated test.

### CU-4 Dependabot — needs-human

`.github/dependabot.yml` is delivered as a diff for the maintainer.

### CHANGELOG — done

`## Unreleased` lists the 0.8.0 changes; the release PR renames it to `## 0.8.0`.

## Theme D: tokens, formatters and showcase (fleet UX review)

Added after the first three themes, from a fleet UX review: consumer apps diverge
because Civic UI lacks shared tokens and data-presentation pieces. Everything is
opt-in; no existing class, default or computed style changes.

### CU-9 Token layer v1 — done

- Given any `.civic-scope`, then `--civic-success`, `--civic-warning`,
  `--civic-info` and their `--civic-on-*` pairs (plus `--civic-on-danger`) are
  defined, and the neutral dark mode redefines them. Each on-colour reaches 4.5:1
  against its fill in both modes.
- Given any `.civic-scope`, then a space scale `--civic-space-1`…`8`, a type
  scale `--civic-text-xs`…`3xl` and weights `--civic-weight-regular`,
  `--civic-weight-heading`, `--civic-weight-strong` are defined.
  `--civic-space-2` keeps its 0.5rem value. Existing controls keep their literal
  13/14/20px sizes, because moving them to rem tokens would change hosts that set
  a non-16px root size (**needs-human**: migrate in a breaking release).
- Given the neutral theme in light and dark, then `--civic-viz-1`…`8`
  (categorical), `--civic-viz-seq-1`…`7` (sequential, monotonic lightness, the
  lowest step nearest the surface) and `--civic-viz-div-n3`…`p3` (diverging, grey
  midpoint) are defined. The categorical order passes the dataviz validator's
  lightness band, chroma floor, adjacent CVD separation (≥ 8) and
  normal-vision floor (≥ 15) against the neutral surfaces; slots below 3:1
  need visible labels or the table view (`ChartFrame` provides it).

Tests: `tests/tokens.test.mjs` (contrast, monotonic ramps, grey midpoint, token
presence); `tests/tokens.spec.ts` (tokens resolve in the browser for each theme;
existing control sizes unchanged).

### CU-10 Romanian formatters — done

- `formatRON(value, options?)` formats with `Intl.NumberFormat('ro-RO',
  { style: 'currency', currency: 'RON' })`; options override.
- `formatDateRO(date, options?)` formats with `Intl.DateTimeFormat('ro-RO',
  { day: 'numeric', month: 'long', year: 'numeric' })`; options override.
- `formatNumberRO(value, options?)` formats with `Intl.NumberFormat('ro-RO')`.
- They ship in the `locales/ro` entry beside `roLabels`; invalid dates throw
  `RangeError`.

Tests: `tests/locale.spec.ts` (output matches the engine's `ro-RO` Intl, with
`.` thousands and `,` decimals).

### CU-11 Showcase fixes — done

- The header shows the installed package version, not "v0.5.0 preview".
- Sections are numbered in document order, and the top navigation links every
  section.
- An EN/RO toggle applies `roLabels` to every label-bearing component.
- New components have a props table.

Tests: `tests/showcase.spec.ts`.

## Theme E: site and data presentation (fleet UX review)

### CU-12 SiteShell — done

`SiteShell` renders a `FamilyBar` (back link to the family hub, tool name,
optional status badge, optional language switch) and a `SiteFooter` with
method, privacy, source and contact slots. Landmarks: `banner`, `main` and
`contentinfo`; the language switch is a labelled group of links marking the
current language with `aria-current="true"`. It is a `nav` named by `languageLabel`. A skip link moves focus to `main`.

Tests: `tests/site-shell.spec.ts`.

### CU-13 StatTile and StatGrid — done

`StatTile` shows value, label, optional unit, delta and as-of date. Numbers are
formatted with `Intl.NumberFormat(locale, format)`. The delta's direction is
given in text and an icon, never by colour alone. `StatGrid` is a `ul` grid
that wraps to one column at 390 px.

Tests: `tests/stat-tile.spec.ts`.

### CU-14 ChartFrame — done

`ChartFrame` is a `figure` with title, question, source and licence, an as-of
date, an optional demo-data badge, and a "show as table" toggle (a button with
`aria-pressed`) that swaps the host's chart for the host's table. It also has
empty and error slots. The host renders the chart.

Tests: `tests/chart-frame.spec.ts`.

### CU-15 SourceCitation — done

`SourceCitation` renders one provenance line: source name (linked when a URL is
given), licence, retrieval or as-of date, and an optional method link.

Tests: `tests/chart-frame.spec.ts` (inside the frame) and the showcase.

## Theme F: overlays and release 0.8.0 (fleet round 2)

### CU-16 Select portal container — done

`Select` takes an optional `portalContainer` (an `HTMLElement`), like `Dialog`,
`AlertDialog`, `Tooltip` and `DropdownMenu`. When given, the options list is
portalled into it, so a container inside `.civic-scope` keeps the scoped
styles; without it, behaviour is unchanged (portal to `document.body`).

Tests: `tests/extended.spec.ts` ("select options render inside an explicit
portal container").

### CU-17 source-map-js advisory — done

Resolve the high-severity Dependabot alert for `source-map-js` with a lockfile
update only; the full gate stays green.

Tests: `npm audit` reports no high-severity finding; the full gate.

### CU-18 Release prep 0.8.0 — done

`CHANGELOG.md` "Unreleased" becomes "0.8.0 — <date>", `package.json` and the
lockfile move to 0.8.0, and the showcase reports it. No tag and no release:
the account owner releases from `main`.

Tests: `npm run test:release` (changelog section and version agree) and
`tests/showcase.spec.ts`.

## Theme G: fleet UX guideline (fleet round 2)

### CU-19 Fleet UX guidelines — done

`docs/ux-guidelines.md` is the base every app guideline extends: page anatomy,
content, data-viz, states, mobile and accessibility, status vocabulary and a
conformance checklist, each expressed with Civic UI tokens and components and a
code snippet; a naming registry (hub title RO/EN, app H1, slug, repo, target H1)
for every app; and `docs/ux-guidelines.template.md` for per-repo guidelines.
The README and the showcase link to it.

- Given the guideline, then every section 2–8 of the fleet brief has a numbered
  section, and every component it names (`SiteShell`, `StatTile`, `ChartFrame`,
  `SourceCitation`, `StatusMessage`, `formatRON`, `formatDateRO`, `roLabels`)
  is exported by 0.8.
- Given the naming registry, then every hub catalogue entry on
  digital-public-administration-lab `dev` has a row.
- Given the documents, then no cedilla diacritic (U+015F, U+0163) appears.

Tests: reviewed by reading; no automated test. Romanian strings in the guideline:
**needs human review**.

### CU-20 Pagination keeps keyboard focus — done

ROADMAP "Later" #5. When previous or next moves to a boundary page, that button
becomes disabled and the browser drops focus to `body`. Instead, focus moves to
the opposite button when the activated button had focus, so a keyboard user
stays inside the pagination. Caller-driven page changes do not move focus. `COMPONENTS.md` states the
contract.

Tests: `tests/extended.spec.ts` ("pagination keeps focus at page boundaries").

### CU-21 Theme token diagnostics — done (first slice)

ROADMAP "Later" #6, first slice: missing host tokens. The package exports
`civicHostTokens`, the custom properties a theme or host must supply (fonts,
surfaces, text, border, action, focus, accent, danger), and
`missingCivicTokens(element)`, which returns the host tokens that resolve to an
empty value on `element`. It is pure and side-effect free, so a host calls it
in development only and production bundles tree-shake it. Detecting accidental
palette overrides is left for a later slice.

Tests: `tests/tokens.spec.ts` ("host token diagnostics"): the showcase's report
lists no missing token in Neutral light, Neutral dark and USR, and lists every
host token for an unthemed `.civic-scope` probe.
