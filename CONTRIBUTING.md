# Contributing

Read [AGENTS.md](AGENTS.md) for the source boundaries and invariants. Development
and PR checks use only public dependencies; no private handbook, account,
1Password setup or publishing credentials are required. The code is MIT-licensed
under [LICENSE](LICENSE); preserve existing third-party notices and asset terms.

## Start a change

Fetch `origin/dev` and create a branch with `feat/`, `fix/`, `chore/`, `docs/`,
`sec/` or `adr/`. In the maintainer workspace:

```bash
git fetch origin dev
wt new chore/my-change origin/dev
cd .worktrees/chore/my-change
```

Worktrees always live at `<repo>/.worktrees/<name>`; never move them by hand.
Use `wt rm` / `wt gc` when finished. Without `wt`, clone separately:

```bash
git clone https://github.com/CristianNichifor/civic-ui.git
cd civic-ui
git fetch origin dev
git switch -c chore/my-change origin/dev
```

For an external contribution, push the branch to your fork and open a PR against
this repository's `dev`. Preserve unrelated work. Use one coherent change per
Conventional Commit, with an imperative lower-case subject of at most 72
characters and no trailing full stop. Link issues with `Refs: #N` or `Closes: #N`
trailers. Agents must never merge PRs, publish releases or deploy; a maintainer
reviews and performs those actions separately.

## Setup and complete verification

Use Node 22.22.2 from `.nvmrc`, npm and GNU tar (release archives use GNU metadata
normalization). On a compatible system with browser libraries installed:

```bash
npm ci --ignore-scripts
npx --no-install playwright install chromium firefox webkit
npm run verify
npm test
npm run test:release
npm run release:assets
```

`npm run verify` builds/packs the library, checks the exact archive allowlist and
licenses, installs that archive in isolated React 18/19 consumers, then typechecks
and builds both. It prepares the native CSS fixture too. It must run before browser
tests; it does not run them itself. `CIVIC_OFFLINE=1 npm run verify` works only with
populated dependency caches. It does not replace browser installation.

On systems without compatible browser libraries, replace only `npm test` above
with the same container command used in CI (Docker required):

```bash
docker run --rm --ipc=host -e CI=1 -v "$PWD:/work" -w /work \
  mcr.microsoft.com/playwright:v1.63.0-noble npm test
```

The image version must match locked `@playwright/test`. Keep build/tooling on the
Node version above. Browser tests start fresh previews on ports 5218 and 5219;
stop conflicting servers first. Focus a change with, for example,
`npm test -- tests/control-states.spec.ts --project=react19-chromium`, then run the
full suite for final evidence. Native projects exercise extracted CSS with JS
disabled in Chromium, Firefox and WebKit; React projects exercise both supported
React versions in all three engines. `DEMO_CHROMIUM` optionally points to a local
Chromium executable without changing other projects.

`npm run test:release` checks archive integrity, stale versions, failed consumer
verification, missing native assets and deterministic CSS packaging.
`npm run release:assets` only stages local archives plus `SHA256SUMS`; it does not
publish. Do not edit `dist/` or `artifacts/` as source. Review
`artifacts/package-results.json`, browser output, traces/screenshots under
`artifacts/` and `artifacts/release/`. Use `npm run preview` to inspect the showcase
at `http://127.0.0.1:5221/showcase.html` after verification.

## Choose evidence that matches the change

Before implementation, state the observable acceptance criteria in the issue or
PR: component, controlled/native behavior, affected theme, keyboard/focus behavior
and supported React/browser matrix. For packaging changes, state the archive or
release invariant. Inspect existing tests first; extend the closest behavioral
test or type contract only when a meaningful behavior is missing. Preserve the
contracts in [COMPONENTS.md](COMPONENTS.md), [NATIVE.md](NATIVE.md) and
[TABLES.md](TABLES.md), including host-owned state and explicit scoped styling.

The PR should describe the change and reason, link any issue, record commands and
results, and attach relevant before/after screenshots for UI changes (320, 390 and
1440 pixels where applicable). Report limitations/failures honestly. Do not claim
a full accessibility audit from browser assertions. Keep version/changelog changes
specific to an intended release; do not upgrade consumers as part of library work.

## CI and release boundary

[Package checks](.github/workflows/checks.yml) runs package verification, the full
browser suite, release tests and asset staging once. Its aggregate job is named
`verify`; it runs even after failure and passes only when `package-checks`
succeeded. Branch protection is configured separately by maintainers. Fork PRs
need no secrets. Pages staging/deployment is conditional on pushes to `main` and
is outside the PR gate. [Release preparation](RELEASING.md) is a separate manual,
maintainer-controlled workflow; passing checks authorizes neither merge nor release.
