# Standalone Verification

Pre-publication snapshot from 2026-09-09, local prerelease `0.0.0-pilot.5`. At the time of these checks, no commit, remote repository, package publication or app migration had been performed. This report records that local run; current hosted results are available from the repository's Actions tab after publication.

## Passed Locally

- Standalone `npm ci --ignore-scripts --offline` using this project's own lockfile and cached registry dependencies.
- `CIVIC_OFFLINE=1 npm run verify`: library build, exact fourteen-file package allowlist, MIT metadata, complete upstream license copies, isolated consumer installs from fixture lockfiles, strict React 18/19 type contracts and production builds.
- Six Chromium tests against the packed artifact: React 18.3.1 and 19.1.1, neutral light/dark, USR host-token styling, keyboard focus, validation associations, disabled controls, select padding, icon rendering, interactions, no external requests/storage, and offline in-memory behavior.
- Screenshots and no-overflow assertions at 320, 390 and 1440 pixels.
- Four extracted control/source CSS files match the merged demo byte-for-byte. Existing app sources, fixtures and local experiments were not edited.
- All three dependency lockfiles use registry URLs; no local source paths or sibling tooling dependencies remain. Targeted source scan found no internal site URL, credential references or developer home-directory paths.

Tarball: `artifacts/cristiannichifor-civic-ui-0.0.0-pilot.5.tgz`.

SHA-256: `cb33e1e89c5dbdaed665f5732a690e3a336a0b35857dc08dc997ead24e769975`.

The fixture's package is deliberately installed with `--no-save`, so npm labels it extraneous. This is expected: it tests newly packed bytes without committing a local-path dependency or changing the fixture lockfile. Runtime peers are deduplicated. Vite ignores Lucide's `use client` directives in these client-only bundles; SSR/RSC support is not claimed.

## Pending

The GitHub Actions workflow is prepared, not executed on GitHub. It has read-only repository permissions, installs locked tooling, builds both consumers and runs browser tests. It has no publish, release or merge step.

Before public release: review and commit this standalone source, create/push the public repository, verify hosted CI and the chosen package namespace, and approve a versioned distribution. The npm publication guard remains enabled. Browser coverage is Chromium-only, not a full accessibility/security audit. No logos, fonts or private data are shipped.

The package still needs explicit adoption in each consumer. No UI or calculation-data migration was performed here.
