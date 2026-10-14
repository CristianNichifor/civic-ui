# Component Contracts (0.8.0)

All components require `styles.css` and a `.civic-scope` ancestor with neutral, USR host-token or custom tokens. Components make no network requests and have no persistence. App state, translations, permissions, data and validation rules remain caller-owned.

## Labels and Locales

Every built-in string is an optional prop with an English default. The main entry exports
`enLabels`, the defaults grouped by component and keyed by prop, and the `CivicLabels` type.
A Romanian preset ships as a separate entry so hosts that do not use it never load it:

```tsx
import { roLabels } from '@cristiannichifor/civic-ui/locales/ro';

<Pagination {...roLabels.Pagination} page={page} pageCount={pages} onPageChange={setPage} />
<Select {...roLabels.Select} label="Format" options={options} />
```

Without a preset nothing changes. Hosts still own every label they pass themselves, and can
build their own `CivicLabels` object for another language. Spread the preset before host
props so a host value wins.

## System Modes

- Forced colors (Windows High Contrast): checked switches, checked segmented options,
  the active tab and highlighted select and menu options use `Highlight`/`HighlightText`;
  the switch track keeps a `CanvasText` border; `RangeSlider` and `Progress` keep a
  system-colour outline. Focus rings stay solid outlines.
- Reduced motion: the `LoadingIndicator` and `OperationStatus` spinners stop and the
  `Switch` thumb no longer transitions.

## Tokens

`styles.css` defines these on every `.civic-scope`; themes may override any of them.
The neutral dark mode redefines the colours.

- Status: `--civic-success`, `--civic-warning`, `--civic-info` with `--civic-on-success`,
  `--civic-on-warning`, `--civic-on-info` and `--civic-on-danger` (4.5:1 or more on
  their fill). Status colour never carries meaning alone: pair it with text and an icon.
- Space: `--civic-space-1` to `--civic-space-8` (0.25rem to 4rem).
- Type: `--civic-text-xs` (0.8125rem) to `--civic-text-3xl` (1.875rem), and
  `--civic-weight-regular`, `--civic-weight-heading`, `--civic-weight-strong`. Existing
  controls keep their literal pixel sizes in 0.8 so hosts with a non-16px root size
  do not change.
- Data visualisation: categorical `--civic-viz-1` to `--civic-viz-8`, assigned in order
  and never cycled. The order keeps adjacent slots apart under protanopia and
  deuteranopia (worst adjacent OKLab ΔE 9.1 light, 8.4 dark). Slots 3, 4 and 5 in light
  mode and slot 6 in dark mode are below 3:1 against the surface, so charts that use them
  need visible labels or a table view. With more than three series in a scatter or
  map, fold the rest into "Other". Sequential `--civic-viz-seq-1` to `-7`: one hue,
  starting nearest the surface. Start ordinal marks at `-seq-3`. Diverging
  `--civic-viz-div-n3` to `-n1`, `--civic-viz-div-mid` (grey) and `-p1` to `-p3`.

## Formatters

`@cristiannichifor/civic-ui/locales/ro` also exports `formatRON`, `formatNumberRO` and
`formatDateRO`, which wrap `Intl` with `ro-RO` defaults: "1.234,50 RON", "98.765,4",
"14 octombrie 2026". Options override the defaults. A `YYYY-MM-DD` string is formatted
as that calendar day in local time.

## Forms

- In 0.2.0, `Input` and `NativeSelect` require a `.civic-field` ancestor for their full base styles. Prefer the `Field` API shown below for that wrapper and accessible label associations. A `.civic-scope` ancestor alone is not sufficient: the select's native-arrow removal and reserved chevron padding are field-scoped. Replacing an existing select inside a plain label without adding `Field` can display both native and custom arrows.
- `Textarea` forwards its native ref and attributes, including `rows`, `required`, `disabled`, `readOnly` and validation attributes. Use `Field` for label, description and error association, as with `Input` and `NativeSelect`.
- `Checkbox` requires `label`, forwards the input ref and native checkbox attributes. Use `checked`/`onChange` or `defaultChecked`; `name` and `value` participate in native form submission. A label can include visible help; supply `aria-describedby` for external help. Indeterminate selection is not a separate API in this version.
- `RadioGroup` requires `label`, `options`, `value` and `onValueChange`. Options have unique `value`, `label` and optional `disabled`. Set `name` for native form submission. `required`, group `disabled` and `error` are supported. Without a name it uses a unique React ID. Arrow behavior remains browser-native, including platform differences at group boundaries.
- `RangeSlider` requires a visible `label`, numeric `value`, bounds and `onValueChange`. It renders a native range input and labelled output; domain units, formatting and persistence remain caller-owned.
- `SegmentedControl` requires a `label`, unique options, controlled `value` and `onValueChange`. It uses native radio inputs styled as a compact choice set; use `RadioGroup` when options should be stacked or need visible help/error text.
- `Switch` requires a visible `label` and exposes Radix checked state; persistence and side effects remain caller-owned.
- `Select` requires a visible `label` and option values; it provides Radix keyboard navigation while preserving caller-owned values and validation.
- `Popover` requires a focusable `trigger`, accessible `label` and caller-owned content. It is for transient supporting content, not navigation or destructive confirmation.

```tsx
<Field id="notes" label="Notes" error={error}>
  {attributes => <Textarea {...attributes} value={notes}
    onChange={event => setNotes(event.target.value)} required />}
</Field>
<Checkbox label="Include attachments" checked={includeAttachments}
  onChange={event => setIncludeAttachments(event.target.checked)} />
<RadioGroup label="Visibility" name="visibility" value={visibility}
  onValueChange={setVisibility}
  options={[{ value: 'public', label: 'Public' }, { value: 'draft', label: 'Draft' }]} />
```

## Feedback

- `Notice`: required `title`, optional children, `tone` (`info`, `success`, `warning`, `danger`), native div attributes. Static by default. Add `role="status"` or `role="alert"` only when an update warrants announcement.
- `ValidationSummary`: `errors: { id, message }[]` and optional `title`. Renders nothing for no errors. Error IDs must identify focusable controls; links focus them. Announced as an alert. Avoid creating an alert on each keystroke in production forms; show after validation/submission.
- `StatusBadge`: visible children and optional `tone` (`neutral`, `success`, `warning`, `danger`). Text must identify status without relying on color. Badge tones use host tokens, not independent brand colors.
- `EmptyState`: required `title`, optional description children and action node. It does not infer loading, permission or error states.
- `LoadingIndicator`: optional translated `label`, status semantics, decorative icon. Animation stops for reduced-motion preference. The parent owns `aria-busy` and when loading ends.
- `OperationStatus`: explicit `idle`, `running`, `success` or `error` state with
  caller-provided labels and optional retry action. It does not fetch, retry or
  infer state from a promise; keep operation state and error details in the host.
- `StatusMessage`: required `tone` (`success`, `warning`, `error`) and `title`, optional
  children, `onRetry` and translated `retryLabel`. Errors render with `role="alert"`,
  success and warnings with `role="status"`. With `onRetry` it renders a native button,
  so Enter and Space both retry; the host owns the retried operation and when to remove
  the message. Mount it with its content: changing the tone of a mounted message is
  announced inconsistently across screen readers. Use `OperationStatus` when a loading
  state with progress precedes the outcome.
- `Progress`: labelled native `<progress>` for determinate or indeterminate work. The
  caller owns the value and update cadence; values must be between zero and `max`.
- `Skeleton`: decorative loading placeholder. It is hidden from assistive technology;
  pair it with a caller-owned loading status or `aria-busy` region.

## Layout and Accessibility

- `Card`: a theme-aware semantic surface. It defaults to `<article>` and accepts
  `as="div"` or `as="section"`; headings, actions and domain content remain caller-owned.
- `VisuallyHidden`: visually clips text while keeping it available to assistive
  technology. Use it for supplemental labels, not as a replacement for visible instructions.

## Interaction

Radix supplies focus management, Escape behavior and keyboard navigation. Triggers must be a single focusable element that forwards props/ref, such as `Button` or `IconButton`. Disabled controls cannot trigger tooltips; important explanations must also be visible outside the tooltip.

- `Dialog`: `trigger`, `title`, `description`, optional children, controlled `open`/`onOpenChange`, translated `closeLabel`. Closes on Escape, close button or outside interaction and restores trigger focus.
- `AlertDialog`: `trigger`, `title`, `description`, `onConfirm`, optional controlled `open`/`onOpenChange`, translated `confirmLabel`/`cancelLabel`. Initial focus is Cancel; outside clicks do not confirm or dismiss. Confirmation closes synchronously. Async progress/error workflows belong in a controlled `Dialog`, not an unawaited confirmation callback.
- `Tabs`: `label`, `items: { value, label, content, disabled? }[]`, optional `value`/`onValueChange` or `defaultValue`. Values must be unique. Arrow keys automatically activate enabled tabs. Inactive content unmounts; keep durable form/data state above Tabs. This is in-page switching, not router navigation.
- `Tooltip`: one child trigger, text `content`. Opens on focus/hover; Escape dismisses. No interactive tooltip content.
- `DropdownMenu`: `trigger`, accessible `label`, `items: { id, label, onSelect, disabled?, icon? }[]`. IDs must be unique. Supports keyboard navigation and typeahead. Items are commands, not navigation links, checkboxes or nested menus in this version. NativeSelect remains the default for selecting a value.

### Overlay Placement

Dialogs, tooltips and menus render within the caller's scope by default, inheriting its theme. If an ancestor clips content, establishes a stacking context or uses a transform, pass `portalContainer` to an element outside that ancestor. The destination must itself have, or be inside, `.civic-scope` with the intended theme, host variables and mode. Passing bare `document.body` without a themed scope loses scoped styles. Keep the container stable while open. `Select` also takes `portalContainer`; without it, its options still portal to `document.body`, outside any `.civic-scope`.

```tsx
// Set the destination from a mounted element/ref, not during server rendering.
<Dialog trigger={<Button>Edit</Button>} title="Edit document"
  description="Document settings" portalContainer={overlayRoot}>
  <Field id="document-name" label="Name">
    {attributes => <Input {...attributes} />}
  </Field>
</Dialog>
// Elsewhere, outside transformed/clipped application containers:
<div className="civic-scope civic-neutral" ref={setOverlayRoot} />
```

## Data Presentation

- `FilterToolbar`: labelled region for caller-owned filter controls and optional
  reset action. It does not own filter values, query data or submit forms; pass
  controlled inputs and reset them in the host callback. `resultCount` renders in a
  polite, atomic live region, so the whole count is read when it changes; keep it short
  ("12 documents"). Wrap each control in `Field` for a visible label. Below 560 px each
  field takes a full row, so the toolbar fits a 390 px viewport without scrolling.

- `Table`: required region `label`, native table attributes/ref and children. Supply a meaningful `caption`, `thead`, `tbody`, and correctly scoped headers. Horizontal overflow is contained in a keyboard-focusable region. No sorting/filtering or virtualized rendering is performed. Optional `density` (`comfortable` default, `compact`) and `mobileLayout` (`scroll` default, `cards`) set `data-density` and `data-mobile-layout`; see [TABLES.md](TABLES.md).
- `SortableHeader`: header children, `onSort`, optional `direction` (`ascending`/`descending`), `scope` (`col` default, or `row`). Renders `th` with `aria-sort` and a button. Caller sorts records and ensures only the active column has a direction.
- `Pagination`: controlled integer `page`, `pageCount`, `onPageChange`. Requires `1 <= page <= pageCount`; invalid inputs throw RangeError. Do not render for zero-result states. Previous/next buttons disable at boundaries; when the focused one does, focus moves to the other button. Optional `label`, `previousLabel`, `nextLabel` support translation. Caller slices data and resets/clamps page when filters or totals change.

## Site and Data

These render host content only. The host draws charts, owns links and URLs, and passes
dates as text (an ISO `YYYY-MM-DD` string renders in a `<time>` element).

- `SiteShell`: `familyBar`, optional `footer`, children, translated `skipLabel`. Renders a
  skip link, `FamilyBar` (banner), `main` (focus target of the skip link) and `SiteFooter`
  (contentinfo). Use it once per page, outside other landmarks.
- `FamilyBar`: `homeHref` and `homeLabel` for the back link to the family hub (for
  example "CN Lab"), `toolName`, optional `status` (such as a `StatusBadge`) and
  `languages: { code, label, href, current? }[]` rendered as a `nav` named by
  `languageLabel`. The current language gets `aria-current="true"`. Each link carries
  `hreflang` and `lang`. Switching language is a navigation the host owns.
- `SiteFooter`: `method`, `privacy`, `source` and `contact` slots (usually links) in a
  `nav` named by `label`, plus free children.
- `StatTile`: `label`, `value` (numbers are formatted with
  `Intl.NumberFormat(locale, format)`, `locale` defaults to `en`), optional `unit`,
  `delta: { value, unit?, positive? }` and `asOf`. The delta's direction is given as
  visually hidden text ("Increase", "Decrease", "No change") and an arrow icon.
  `positive: "good" | "bad"` sets `data-sentiment`, which colours the icon with the
  status tokens. Colour never carries the meaning alone.
- `StatGrid`: a labelled list that wraps tiles into as many columns as fit, down to one
  at narrow widths.
- `ChartFrame`: a `figure` named by its `title`, with an optional `question`, a `demo`
  badge, `source` and `asOf` in the figcaption, and the host chart as children. Given
  `table`, a "Show as table" button (`aria-pressed`) swaps the chart for the table, which
  covers charts whose colours fall below 3:1. `state="empty" | "error"` renders the
  `empty` or `error` slot instead and hides the toggle. Pair the error slot with a
  `StatusMessage`.
- `SourceCitation`: one provenance line: `source` (linked with `href`), `licence`
  (linked with `rel="license"` via `licenceHref`), `date` and a `methodHref` link.

## Adoption Gates

1. Use a reviewed, published GitHub release. Version 0.2.0 is available; a new release is needed only for package changes, not for adopting existing components.
2. Migrate forms and feedback in USR demo and reforms in separate PRs. Preserve labels, values, validation, handlers and host tokens.
3. Replace overlays and tabs only where the documented interaction contract matches. Preserve route/hash behavior and focus return.
4. Adopt table primitives without changing record text, amounts, order or calculation engines. Compare old/new datasets and behavior.
5. Run each consumer's type/build, keyboard, responsive, offline and data-parity checks. When updating the dependency, commit manifest and lockfile together with the migration.

## Consumer Acceptance Checklist

Batch compatible changes into a reviewed PR per consumer; component-by-component PRs are not required. This checklist defines acceptance evidence, not a claim that any particular application's migration is complete.

| Surface | Existing components | Preserve and verify in the consumer |
| --- | --- | --- |
| Contact and numeric forms | `Field`, `Input`, `NativeSelect`, `Textarea`, `Button` | Labels, help/error associations, native attributes, option values/order, parsing, submit behavior and reset state. |
| Participation and privacy choices | `Checkbox`, `RadioGroup` | Explicit consent defaults, disabled/restricted choices, event handlers, keyboard selection and caller-owned review state. Never infer consent or membership from styling. |
| Feedback | `Notice`, `ValidationSummary`, `EmptyState`, `LoadingIndicator` | Existing text, announcement timing, retry actions and validation focus without changing hash routes. |
| Tables | `Table`, `SortableHeader`, `Pagination` | Record text/order, totals, captions, header scope, sorting, page boundaries and horizontal scrolling. The library does not calculate, sort or slice data. |
| Dialogs, menus and tabs | `Dialog`, `AlertDialog`, `DropdownMenu`, `Tabs`, `Tooltip` | Accessible names, focus return, Escape behavior, theme inheritance and durable state. Router navigation is not a `Tabs` replacement. |

- Capture the current behavior and representative numeric/data outputs before migration. Compare after migration; changed component counts alone are not evidence of parity.
- Run type checks, production builds and focused interaction tests in Chromium, Firefox and WebKit. Check narrow/mobile and desktop layouts, keyboard focus, disabled states, hover/text colors and contained overflow.
- Exercise built-app interactions offline after assets load. Verify that the migration introduces no network calls or persistence. This does not certify a cold offline start, a service worker, or reload with a stopped local server.
- Keep domain engines, permissions, URLs, synthetic demo data and storage behavior caller-owned. Tests and screenshots must not introduce personal records or credentials.
- Remove obsolete wrappers/styles only after checking all their consumers. Record intentional local exceptions instead of forcing a semantic mismatch into a shared component.

Native range/date/file inputs, router links, editable or virtualized grids, specialized salary layouts and domain cards can remain local when these APIs do not fit. Add a shared abstraction only after a concrete consumer requirement is established. A migration using only 0.2.0 exports does not require a package version bump or a new release.

Browser automation is not screen-reader, SSR/RSC or physical-device certification.
