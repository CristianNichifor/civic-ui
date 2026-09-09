# Civic UI

Small, MIT-licensed React controls with separate, opt-in themes. Local prerelease preparation, not a published package or an official identity kit.

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

This illustrates the intended package API, not an available registry install. The npm scope is provisional until ownership is verified. `private: true` prevents accidental publication; it does not restrict the MIT source license.

Neutral supports `data-civic-mode="dark"`. The optional `themes/usr.css` adapter uses `civic-usr` and maps existing host `--usr-*` tokens without loading fonts, logos or an independent brand palette. Hosts can supply `--civic-*` tokens directly instead. JavaScript never imports a theme or stylesheet automatically.

## Develop and Verify

Use Node from `.nvmrc` and the checked-in npm lockfiles:

```bash
npm ci --ignore-scripts
npx --no-install playwright install chromium
npm run verify
npm test
npm run preview
```

Preview: http://127.0.0.1:5221/. Query options: `?theme=usr` or `?theme=neutral&mode=dark`.

`verify` builds and packs the package, checks its exact file allowlist and license notices, then creates independent React 18.3.1 and React 19.1.1 consumers. Each consumer installs its checked-in dependency lockfile before installing the newly packed artifact without saving a local-path dependency. Both undergo strict type checks and production builds. No parent repository, aliases or sibling dependencies are required.

`test` runs Chromium against both production consumers. It covers field associations, invalid state, select padding, icons, keyboard focus, disabled controls, interactions, no external requests/storage, and 320/390/1440 layouts in neutral light/dark and the USR host-token adapter. Screenshots and machine-readable results stay in ignored `artifacts/`. Build fixtures first with `verify`.

For cached offline verification, use `CIVIC_OFFLINE=1 npm run verify`. Initial installation needs network access or populated caches. `DEMO_CHROMIUM=/path/to/chromium npm test` can reuse an installed browser. Bundled consumers work offline while their local server remains reachable; there is no service worker or server-stopped reload guarantee.

## Scope and Release Gates

Only controls and themes are included. No app fixtures, personal records, credentials, fonts, logos, Radix components or domain engines are shipped. [MIT license](LICENSE) and [third-party notices](THIRD_PARTY_NOTICES.md) apply; trademarks and third-party assets are not licensed by this project.

Before release: confirm the distribution name, review source/archive contents, run hosted CI, decide browser support, and approve a versioned release. Current checks are Chromium-only, not a complete accessibility audit. Native CSS nesting remains in output. SSR/RSC, other browsers and screen-reader behavior are not certified. CI has no publication or merge step.

Existing consuming apps are not migrated by this repository. Adopt the first approved release in a separate reviewed change with behavior and data-parity checks.
