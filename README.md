# Civic UI

Small, MIT-licensed React controls with opt-in neutral and USR-compatible themes. The current release is [v0.7.0](https://github.com/CristianNichifor/civic-ui/releases/tag/v0.7.0). For non-React projects, use the [native HTML/CSS contract](NATIVE.md).

## Components

- Forms: `Button`, `IconButton`, `Field`, `Input`, `NativeSelect`, `Textarea`, `Checkbox`, `RadioGroup`, `RangeSlider`, `SegmentedControl`, `Switch`, `Select`.
- Feedback: `Notice`, `ValidationSummary`, `StatusBadge`, `EmptyState`, `LoadingIndicator`, `Progress`, `Skeleton`.
- Layout: `Card`, `VisuallyHidden`.
- Interaction: `Dialog`, `AlertDialog`, `Tabs`, `Tooltip`, `DropdownMenu`, `Popover`.
- Data: `Table`, `SortableHeader`, `Pagination`.

Components are controlled primitives: the host owns values, validation, permissions, translations, routing, persistence and business logic. Radix supplies focus and keyboard behavior for complex interactions; native HTML remains the default for simple forms.

## Install

Install the versioned GitHub Release archive; no npm account is required:

```bash
npm install --save-exact https://github.com/CristianNichifor/civic-ui/releases/download/v0.7.0/civic-ui-0.7.0.tgz
```

Load the base stylesheet, one theme, and a scoped host boundary explicitly:

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

Neutral mode supports `data-civic-mode="dark"`. `themes/usr.css` maps existing host `--usr-*` tokens; it does not load fonts, logos or a separate brand palette. JavaScript never loads styles automatically.

## Develop

```bash
npm ci --ignore-scripts
npx --no-install playwright install chromium firefox webkit
npm run verify
npm test
npm run preview
```

The [component showcase](https://cristiannichifor.github.io/civic-ui/) and [showcase guide](SHOWCASE.md) provide interactive examples. `verify` builds the package, checks its allowlist and licenses, and validates React 18 and React 19 consumers. `test` covers Chromium, Firefox and WebKit, keyboard behavior, responsive layouts, themes, offline interactions and control states.

## Scope

This package ships controls and themes only. It does not provide authentication, permissions, routing, data fetching, charts, maps, date pickers, domain cards or application content. See [component contracts](COMPONENTS.md), the [adoption guide](ADOPTION.md), and [release instructions](RELEASING.md).
