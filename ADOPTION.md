# Consumer Adoption

This guide describes the supported Civic UI adoption paths. Consumers keep their own routing, data, permissions, layout and brand tokens.

Version 0.4.0 is the current published artifact and adds the `OperationStatus`
and `FilterToolbar` primitives.

## Published Artifacts

- React package: [v0.4.0 release](https://github.com/CristianNichifor/civic-ui/releases/tag/v0.4.0)
- React archive: `https://github.com/CristianNichifor/civic-ui/releases/download/v0.4.0/civic-ui-0.4.0.tgz`
- CSS-only archive: `https://github.com/CristianNichifor/civic-ui/releases/download/v0.4.0/civic-ui-css-0.4.0.tgz`
- React archive SHA-256: `fda682aa7540192d03047f1904465c6e720f25ec434d8c39126407114e5db6c6`
- CSS archive SHA-256: `269dc6d01f4da09707521229111ac55011f78f55518a7c8d73d660503ed84de7`

Verify the archive before extracting it:

```bash
curl -L -o civic-ui-css-0.4.0.tgz https://github.com/CristianNichifor/civic-ui/releases/download/v0.4.0/civic-ui-css-0.4.0.tgz
printf '%s  %s\n' 269dc6d01f4da09707521229111ac55011f78f55518a7c8d73d660503ed84de7 civic-ui-css-0.4.0.tgz | sha256sum --check
```

## CSS-Only Adoption

1. Vendor the archive and record its release URL and SHA-256 in a checked-in provenance file.
2. Load `styles.css`, the selected theme, and any host adapter from the consumer's own origin.
3. Apply `civic-scope` to the smallest stable host boundary.
4. Add Civic UI classes only to controls whose semantics already exist.
5. Keep data fetching, validation, navigation, tables, charts, responsive layout and domain states in the host application.
6. Run historical browser baselines in light and dark modes before merging.

## React Adoption

Install the GitHub release tarball as a local file or CI-downloaded artifact. Import components and CSS explicitly; Civic UI does not auto-load themes or fonts. Keep React, React DOM and Lucide as host-managed peers.

## Acceptance Checklist

- [ ] Archive checksum matches recorded provenance.
- [ ] No credentials, private data, internal URLs or host datasets are vendored.
- [ ] Existing URL, data and persistence behavior is unchanged.
- [ ] Keyboard focus, disabled, validation and native-select states are covered.
- [ ] Desktop and mobile historical assertions pass.
- [ ] The host owns the final palette and layout where it has an established design system.
- [ ] The consumer pins a Civic UI version.

## Boundaries

Civic UI does not provide authentication, permissions, routing, domain cards, charts, date pickers, data loaders or political/organizational content.
