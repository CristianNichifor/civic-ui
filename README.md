# Civic UI

Small, MIT-licensed React controls with separate, opt-in themes. [Version 0.1.0](https://github.com/CristianNichifor/civic-ui/releases/tag/v0.1.0) is available through GitHub Releases. Not an official identity kit.

## Components

`Button`, `IconButton`, `Field`, `Input`, and `NativeSelect` wrap native HTML controls. Callers own values, validation, IDs, permissions and business logic. `Field` associates labels and descriptions; `IconButton` requires an accessible label. React and Lucide remain external peer dependencies.

The package exports ESM JavaScript, TypeScript declarations, base CSS and two independent theme adapters:

```tsx
import { Field, NativeSelect } from '@cristiannichifor/civic-ui';
import '@cristiannichifor/civic-ui/styles.css';
import '@cristiannichifor/civic-ui/themes/neutral.css';

<section className="civic-scope civic-neutral">
  <Field id="category" label="Category">
    {props => <NativeSelect {...props}><option>Local</option></NativeSelect>}
  </Field>
</section>
```

Install the versioned tarball from GitHub Releases; see [release and installation instructions](RELEASING.md). No npm account is required. The scoped name is an import identifier, not an npm registry distribution. `private: true` prevents accidental registry publication; it does not restrict the MIT source license.

Neutral supports `data-civic-mode="dark"`. The optional `themes/usr.css` adapter uses `civic-usr` and maps existing host `--usr-*` tokens without loading fonts, logos or an independent brand palette. Hosts can supply `--civic-*` tokens directly instead. JavaScript never imports a theme or stylesheet automatically.

## Develop and Verify

The interactive [component showcase](https://cristiannichifor.github.io/civic-ui/)
is deployed from checked `main` after the showcase PR is merged. See
[showcase documentation](https://github.com/CristianNichifor/civic-ui/blob/main/SHOWCASE.md) for local preview, examples and limitations.

Use Node from `.nvmrc` and the checked-in npm lockfiles:

```bash
npm ci --ignore-scripts
npx --no-install playwright install chromium firefox webkit
npm run verify
npm test
npm run preview
```

Fixture preview: http://127.0.0.1:5221/. Showcase: http://127.0.0.1:5221/showcase.html. Fixture query options: `?theme=usr`, `?theme=neutral&mode=dark`, or `?edge=1` for control-state fixtures.

`verify` builds and packs the package, checks its exact file allowlist and license notices, then creates independent React 18.3.1 and React 19.1.1 consumers. Each consumer installs its checked-in dependency lockfile before installing the newly packed artifact without saving a local-path dependency. Both undergo strict type checks and production builds. No parent repository, aliases or sibling dependencies are required.

`test` runs 60 tests across Chromium, Firefox and WebKit against both production consumers: 42 control checks and 18 showcase checks. Theme checks cover field associations, invalid state, select padding, icons, keyboard focus, disabled controls, interactions, no external requests/storage, and 320/390/1440 layouts in neutral light/dark and the USR host-token adapter. Additional neutral-theme tests cover disabled Tab skipping, native select validation, long labels/actions and keyboard activation. Showcase checks cover theme switching, editable state, offline interaction, clipboard success/failure handling and downloaded source. Clipboard outcomes are stubbed; actual permission prompts remain browser-dependent. Screenshots and machine-readable package results stay in ignored `artifacts/`. Build fixtures first with `verify`.

CI runs browser tests in the official `mcr.microsoft.com/playwright:v1.63.0-noble` image with bundled browsers and system dependencies. Keep that image version in both workflows aligned with `@playwright/test`. Package builds and release commands run on the host using `.nvmrc`. Local browser execution requires supported system libraries; installing browser binaries alone may not suffice on unsupported Linux distributions.

For cached offline verification, use `CIVIC_OFFLINE=1 npm run verify`. Initial installation needs network access or populated caches. `DEMO_CHROMIUM=/path/to/chromium npm test` overrides only Chromium. To run only its projects, append `-- --project=react18-chromium --project=react19-chromium`. Bundled consumers work offline while their local server remains reachable; there is no service worker or server-stopped reload guarantee.

## Scope and Release Gates

Only controls and themes are included. No app fixtures, personal records, credentials, fonts, logos, Radix components or domain engines are shipped. [MIT license](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md) apply; trademarks and third-party assets are not licensed by this project.

Before release: review source/archive contents, run hosted CI, and approve a versioned GitHub release. Browser checks are not a complete accessibility audit. WebKit coverage is not Safari or iOS device certification. Native CSS nesting remains in output. SSR/RSC and screen-reader behavior are not certified. Normal CI never publishes; the separate manual release workflow creates drafts only and never merges PRs.

Existing consuming apps are not migrated by this repository. Adopt the first approved release in a separate reviewed change with behavior and data-parity checks.
