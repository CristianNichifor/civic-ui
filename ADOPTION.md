# Consumer Adoption

This guide describes the supported Civic UI 0.3.0 adoption paths. Consumers keep their own routing, data, permissions, layout and brand tokens.

## Published Artifacts

- React package: [v0.3.0 release](https://github.com/CristianNichifor/civic-ui/releases/tag/v0.3.0)
- CSS-only archive: `https://github.com/CristianNichifor/civic-ui/releases/download/v0.3.0/civic-ui-css-0.3.0.tgz`
- CSS archive SHA-256: `644b181b1a061516ddfe7cbcbba9d94101e7e0b4f97f4a52c085cccba1f27226`

Verify the archive before extracting it:

```bash
curl -L -o civic-ui-css-0.3.0.tgz https://github.com/CristianNichifor/civic-ui/releases/download/v0.3.0/civic-ui-css-0.3.0.tgz
printf '%s  %s\n' 644b181b1a061516ddfe7cbcbba9d94101e7e0b4f97f4a52c085cccba1f27226 civic-ui-css-0.3.0.tgz | sha256sum --check
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
