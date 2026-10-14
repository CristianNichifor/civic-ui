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
