# civic-ui

MIT-licensed native React controls with opt-in themes and React 18/19 compatibility.

## Commands and gates

Use Node from `.nvmrc` (22.22.2), npm and GNU tar. From the repository root:

| Task | Command | What it establishes |
| --- | --- | --- |
| Install | `npm ci --ignore-scripts` | Locked public tooling; no credentials |
| Build | `npm run build` | JS, declarations, styles and license copies in `dist/` |
| Package/consumer verification | `npm run verify` | Exact archive allowlist, licenses, React 18/19 typecheck and production builds |
| Install browser engines | `npx --no-install playwright install chromium firefox webkit` | Local browser binaries; compatible system libraries also needed |
| Browser tests (after verify) | `npm test` | React 18/19 in all three engines and JS-disabled native HTML |
| Release regression tests | `npm run test:release` | Tamper/stale/failed-consumer rejection, CSS archive allowlist and reproducibility |
| Stage release assets (after verify) | `npm run release:assets` | Local archives/checksums only; does not publish |
| Showcase preview (after verify) | `npm run preview` | React 19 showcase on port 5221 |

`npm run verify` alone is **not** the full CI gate. Run it, browser tests,
release tests and asset staging in that order; see [CONTRIBUTING.md](CONTRIBUTING.md)
for the container alternative. Browser servers need free ports 5218 and 5219 and
never reuse existing servers. `DEMO_CHROMIUM` optionally selects only Chromium's
executable. `CIVIC_OFFLINE=1 npm run verify` needs already populated npm caches.

`.github/workflows/checks.yml` exposes aggregate status `verify`, which runs with
`always()` and requires `package-checks` to succeed. Failed, cancelled or skipped
correctness work must fail the aggregate. Do not duplicate the browser suite in
another job. GitHub branch-rule configuration is separate from this workflow.
`dev` is the contribution branch. `main` pushes stage/deploy Pages separately;
manual release preparation is defined in `release.yml` and is not a PR check.

## Component and packaging invariants

- Controls remain primitives: host-owned values, validation, permissions,
  translations, routing, persistence and business logic. No network or storage.
- CSS and themes are explicit imports, never JavaScript side effects. Preserve
  `.civic-scope`, host tokens and opt-in neutral/USR themes; no global resets,
  font loading, logos or new brand palette.
- Compose Input, NativeSelect and Textarea with Field and associated unique labels,
  help/errors and native attributes. Preserve native form semantics, disabled
  states, keyboard focus and reduced-motion behavior. Complex controls retain
  Radix focus/escape contracts and caller-owned accessible labels.
- Overlays must retain the chosen theme and focus restoration, including explicit
  portal containers. Tables retain native header/caption semantics; sorting and
  pagination remain caller-owned. Follow [COMPONENTS.md](COMPONENTS.md),
  [TABLES.md](TABLES.md) and the separate [native contract](NATIVE.md).
- `src/` and `themes/neutral.css` are sources; `themes/usr.css` is not the build
  source (the adapter comes from `src/usr.css`). `fixtures/` contains synthetic
  consumers and committed registry-only React 18/19 locks. Edit these sources,
  never generated `dist/`, `artifacts/` or installed packages.
- Preserve React 18 and 19 peers, `private: true`, the exact package allowlist,
  public versioned release URLs and license copies. Package/lockfile/changelog
  versions must agree for a release. Never overwrite published assets.
- Inspect existing `tests/*.spec.ts`, `tests/release.test.mjs` and fixture type
  contracts before adding tests. Add observable missing behavior, not snapshots
  of implementation details. Consumer migrations require their own review.

## Contribution and delivery rules

- Work from fetched `origin/dev`; open a PR back to `dev`. Approved branch prefixes:
  `feat/`, `fix/`, `chore/`, `docs/`, `sec/`, `adr/`.
- In the maintainer workspace use `wt new <prefix/name> origin/dev`, which creates
  `<repo>/.worktrees/<prefix/name>`. Never edit the original checkout for a task or
  move worktrees manually; remove finished ones with `wt rm` / `wt gc`.
  Contributors without `wt` can use a separate clone and `git switch -c <prefix/name> origin/dev`.
- Use Conventional Commits: imperative, lower-case subject, no trailing full stop,
  at most 72 characters; one coherent change per commit. Explain why in the body
  only when needed; use `Refs: #N` / `Closes: #N` trailers for issue links.
- Agents must never merge PRs (including into `dev`), publish releases or deploy.
  This is an agent rule, not a claim that administrator credentials cannot do so.
- PR checks need no secrets, private handbook, 1Password or internal service.
  Publishing credentials are maintainer-only; never commit credentials.
- Never modify vendored third-party sources; fix tooling or upstream dependencies.
  Keep the MIT license and upstream notices. Verify before claiming completion.
- See [CONTRIBUTING.md](CONTRIBUTING.md) for acceptance criteria and review evidence.
