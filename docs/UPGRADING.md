# Upgrading to 0.8

Every release from 0.3.0 to 0.8.0 is additive. No class, token, CSS entry, export or
default label was removed or renamed, so an upgrade does not need markup changes. What
changes is the bytes you vendor or install, and the checks you rerun.

0.8.0 is not published yet. Until its GitHub release exists, use these steps to prepare
the change, not to point at an archive URL or checksum.

## What changed since each version

| From | Added by later releases | Behaviour changes to recheck |
|---|---|---|
| 0.3 | 0.4: `OperationStatus`, `FilterToolbar` and their classes. 0.5: `Card`, `Progress`, `Skeleton`, `VisuallyHidden`. 0.6: `RangeSlider`, `SegmentedControl`. 0.7: `Switch`, `Select`, `Popover` (new Radix dependencies). 0.8: see below. | `Notice` props type (0.5), plus everything listed for 0.8 |
| 0.4 | 0.5, 0.6, 0.7 and 0.8 additions above | `Notice` props type (0.5), plus 0.8 |
| 0.5 | 0.6, 0.7 and 0.8 additions above | 0.8 |
| 0.6 | 0.7 and 0.8 additions above | 0.8 |

0.8.0 adds:

- `StatusMessage` (`.civic-status-message`) for success, warning and error with retry.
- `Table` `density` and `mobileLayout` props (`data-density`, `data-mobile-layout`).
- `enLabels`, the `CivicLabels` type and the opt-in `@cristiannichifor/civic-ui/locales/ro`
  entry exporting `roLabels`.
- A `forced-colors: active` block in `controls.css`, and reduced-motion rules that now
  also stop the `OperationStatus` spinner and the `Switch` thumb transition.
- `aria-atomic="true"` on the `FilterToolbar` result count.

Behaviour to recheck after upgrading to 0.8:

- In Windows High Contrast, checked switches, segmented options, the active tab and
  highlighted select and menu items now use system `Highlight` colours. Hosts that
  override these selectors under `forced-colors` should compare the result.
- With reduced motion requested, `.civic-operation-status__spinner` no longer spins.
- A host that styled `.civic-table` cells for density can switch to `density="compact"`
  or keep its own rules; the defaults are unchanged without the new attributes.

`Notice` (0.5): its props type became `CivicHTMLAttributes`, which omits `onChange`,
`onChangeCapture`, `onSubmit` and `onSubmitCapture` so the same declarations typecheck
with React 18 and 19 type packages. A `Notice` that passed one of those now fails to
typecheck; move the handler to the element that owns it.

## Vendored CSS consumers (0.3 and 0.4)

Consumers such as legislation-linter (0.3) and open-procurement and the romania-reforms
simulators (0.4) vendor the CSS-only archive.

1. Download `civic-ui-css-0.8.0.tgz` and `SHA256SUMS` from the v0.8.0 release and run
   `sha256sum -c SHA256SUMS` on the archive.
2. Replace the whole vendored directory with the extracted files: `native.css`,
   `styles.css`, `foundations.css`, `controls.css`, `themes/neutral.css`,
   `themes/usr.css`, `NATIVE.md` and `LICENSE`. Keep the relative imports intact; do not
   merge files by hand.
3. Update the checked-in provenance record with the new version, release URL and SHA-256.
4. Keep the host's own theme adapter and its load order after the Civic UI theme.
5. Rerun the host's light, dark, mobile, keyboard and offline baselines. Add one manual
   pass in Windows High Contrast or Chromium's forced-colors emulation if the host uses
   switches, segmented controls or tabs.

Nothing in the CSS archive needs JavaScript; the new React components only add classes a
CSS-only host can ignore. To use the table card layout without React, set
`data-mobile-layout="cards"` on the `table` and `data-label` on each `td`, as
[TABLES.md](../TABLES.md) describes.

## npm tarball consumers (0.5 and 0.6)

Consumers such as usr-digital-platform-wireframe (0.5) and salarizare (0.6) install the
React tarball.

```bash
npm install --save-exact https://github.com/CristianNichifor/civic-ui/releases/download/v0.8.0/civic-ui-0.8.0.tgz
```

1. Commit `package.json` and the lockfile together; the lockfile records the integrity.
2. From 0.5 or 0.6, the 0.7 Radix additions (`@radix-ui/react-popover`, `react-select`,
   `react-switch`) arrive as dependencies of the tarball. React, React DOM and Lucide stay
   host-managed peers with the same ranges as 0.3.
3. Typecheck. The only change that can fail is a `Notice` handler, and only when
   upgrading from before 0.5.
4. Optionally adopt the Romanian preset where the host renders Romanian:

   ```tsx
   import { roLabels } from '@cristiannichifor/civic-ui/locales/ro';
   <Pagination {...roLabels.Pagination} page={page} pageCount={pages} onPageChange={setPage} />
   ```

   Hosts that already pass their own labels need no change.
5. Rerun the host's behaviour, responsive, keyboard and offline checks.

## After upgrading

Each consumer upgrade is its own reviewed change in the consumer's repository. A Civic UI
release never updates consumers automatically.
