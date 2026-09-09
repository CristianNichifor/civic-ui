# Component Contracts (0.2.0 Preview)

All components require `styles.css` and a `.civic-scope` ancestor with neutral, USR host-token or custom tokens. Components make no network requests and have no persistence. App state, translations, permissions, data and validation rules remain caller-owned.

## Forms

- `Textarea` forwards its native ref and attributes, including `rows`, `required`, `disabled`, `readOnly` and validation attributes. Use `Field` for label, description and error association, as with `Input` and `NativeSelect`.
- `Checkbox` requires `label`, forwards the input ref and native checkbox attributes. Use `checked`/`onChange` or `defaultChecked`; `name` and `value` participate in native form submission. A label can include visible help; supply `aria-describedby` for external help. Indeterminate selection is not a separate API in this version.
- `RadioGroup` requires `label`, `options`, `value` and `onValueChange`. Options have unique `value`, `label` and optional `disabled`. Set `name` for native form submission. `required`, group `disabled` and `error` are supported. Without a name it uses a unique React ID. Arrow behavior remains browser-native, including platform differences at group boundaries.

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

## Interaction

Radix supplies focus management, Escape behavior and keyboard navigation. Triggers must be a single focusable element that forwards props/ref, such as `Button` or `IconButton`. Disabled controls cannot trigger tooltips; important explanations must also be visible outside the tooltip.

- `Dialog`: `trigger`, `title`, `description`, optional children, controlled `open`/`onOpenChange`, translated `closeLabel`. Closes on Escape, close button or outside interaction and restores trigger focus.
- `AlertDialog`: `trigger`, `title`, `description`, `onConfirm`, optional controlled `open`/`onOpenChange`, translated `confirmLabel`/`cancelLabel`. Initial focus is Cancel; outside clicks do not confirm or dismiss. Confirmation closes synchronously. Async progress/error workflows belong in a controlled `Dialog`, not an unawaited confirmation callback.
- `Tabs`: `label`, `items: { value, label, content, disabled? }[]`, optional `value`/`onValueChange` or `defaultValue`. Values must be unique. Arrow keys automatically activate enabled tabs. Inactive content unmounts; keep durable form/data state above Tabs. This is in-page switching, not router navigation.
- `Tooltip`: one child trigger, text `content`. Opens on focus/hover; Escape dismisses. No interactive tooltip content.
- `DropdownMenu`: `trigger`, accessible `label`, `items: { id, label, onSelect, disabled?, icon? }[]`. IDs must be unique. Supports keyboard navigation and typeahead. Items are commands, not navigation links, checkboxes or nested menus in this version. NativeSelect remains the default for selecting a value.

### Overlay Placement

Dialogs, tooltips and menus render within the caller's scope by default, inheriting its theme. If an ancestor clips content, establishes a stacking context or uses a transform, pass `portalContainer` to an element outside that ancestor. The destination must itself have, or be inside, `.civic-scope` with the intended theme, host variables and mode. Passing bare `document.body` without a themed scope loses scoped styles. Keep the container stable while open.

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

- `Table`: required region `label`, native table attributes/ref and children. Supply a meaningful `caption`, `thead`, `tbody`, and correctly scoped headers. Horizontal overflow is contained in a keyboard-focusable region. No sorting/filtering or virtualized rendering is performed.
- `SortableHeader`: header children, `onSort`, optional `direction` (`ascending`/`descending`), `scope` (`col` default, or `row`). Renders `th` with `aria-sort` and a button. Caller sorts records and ensures only the active column has a direction.
- `Pagination`: controlled integer `page`, `pageCount`, `onPageChange`. Requires `1 <= page <= pageCount`; invalid inputs throw RangeError. Do not render for zero-result states. Previous/next buttons disable at boundaries. Optional `label`, `previousLabel`, `nextLabel` support translation. Caller slices data and resets/clamps page when filters or totals change.

## Adoption Gates

1. Review and merge the library PR, then approve and manually publish the versioned GitHub release.
2. Migrate forms and feedback in USR demo and reforms in separate PRs. Preserve labels, values, validation, handlers and host tokens.
3. Replace overlays and tabs only where the documented interaction contract matches. Preserve route/hash behavior and focus return.
4. Adopt table primitives without changing record text, amounts, order or calculation engines. Compare old/new datasets and behavior.
5. Run each consumer's type/build, keyboard, responsive, offline and data-parity checks. Commit manifest and lockfile together with the migration.

No app dependency is changed by this library PR. Comboboxes and domain-specific components remain deferred until an actual consumer needs them. Browser automation is not screen-reader, SSR/RSC or physical-device certification.
