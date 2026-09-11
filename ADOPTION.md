# Consumer Adoption

This guide describes the supported Civic UI adoption paths. Consumers keep their own routing, data, permissions, layout and brand tokens.

Version 0.7.0 is the current published artifact and adds `Switch`, `Select` and
`Popover` wrappers around Radix primitives.

## Published Artifacts

- React package: [v0.7.0 release](https://github.com/CristianNichifor/civic-ui/releases/tag/v0.7.0)
- React archive: `https://github.com/CristianNichifor/civic-ui/releases/download/v0.7.0/civic-ui-0.7.0.tgz`
- CSS-only archive: `https://github.com/CristianNichifor/civic-ui/releases/download/v0.7.0/civic-ui-css-0.7.0.tgz`
- React archive SHA-256: `0c89a5684c5c8bbfff1b8a84188a3a60b2967bf9ab11b0f33daeb3c5e0a0aecc`
- CSS archive SHA-256: `eb4045484622e98f840e1468c5ccb4308d8c65fcdddc46fb0e02efb0f6c73510`

Verify the archive before extracting it:

```bash
curl -L -o civic-ui-css-0.7.0.tgz https://github.com/CristianNichifor/civic-ui/releases/download/v0.7.0/civic-ui-css-0.7.0.tgz
printf '%s  %s\n' eb4045484622e98f840e1468c5ccb4308d8c65fcdddc46fb0e02efb0f6c73510 civic-ui-css-0.7.0.tgz | sha256sum --check
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
