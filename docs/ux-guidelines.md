# Fleet UX guidelines

The base every app guideline in the family extends. Each app keeps its own
`docs/ux-guidelines.md`, written from [the template](ux-guidelines.template.md),
that adds users, top tasks and a deviations backlog and never contradicts this
document. Product language is Romanian; the documents are English.

Everything here is expressed with Civic UI 0.8 tokens and components. Apps that
cannot adopt the components yet (plain HTML sites, non-React stacks) follow the
same rules with their own markup and the [native contract](../NATIVE.md).

Romanian strings in this document were written by an agent: **needs human review**.

## 1. One family, one job per first screen

The apps are one family of civic tools behind one hub. A visitor who lands on any
page must see, without scrolling, which family it belongs to, what this tool is,
where the data comes from and what to do first.

- The first screen has one job. Name it in the app guideline ("compare unit prices
  for one product", "see the deficit in context"). Everything else is a secondary
  view.
- Every page links back to the hub through the family bar. No app is a standalone
  product.
- Names come from the [naming registry](#9-naming-registry) below. The hub card, the
  `<title>`, the family bar tool name and the H1 use the registry entry, in the
  page language. Do not invent a new name on a page.

## 2. Page anatomy

Top to bottom, every page:

1. **Family bar**: back link to the hub, tool name, status badge, language switch.
2. **H1** plus one line that says what the page answers.
3. **Provenance line** ("Date: sursă, an"): source, licence, as-of or retrieval
   date, method link.
4. **Primary task**: the one control group or chart the first screen exists for.
5. **Secondary views**: tabs, further charts, tables, explanations.
6. **Footer**: method, privacy, source, contact.

`SiteShell` renders 1 and 6 with the right landmarks (`banner`, `main`,
`contentinfo`) and a skip link. Use it once per page, outside other landmarks.

```tsx
import { SiteShell, StatusBadge, SourceCitation } from '@cristiannichifor/civic-ui';
import { roLabels, formatDateRO } from '@cristiannichifor/civic-ui/locales/ro';

<SiteShell
  {...roLabels.SiteShell}
  familyBar={{
    ...roLabels.FamilyBar,
    homeHref: 'https://projects.cristian-nichifor.com/',
    homeLabel: 'Proiecte civice',
    toolName: 'Achiziții publice din România',
    status: <StatusBadge tone="success">Date reale</StatusBadge>,
    languages: [
      { code: 'ro', label: 'Română', href: '/open-procurement/', current: true },
      { code: 'en', label: 'English', href: '/open-procurement/en/' },
    ],
  }}
  footer={{
    ...roLabels.SiteFooter,
    method: <a href="/open-procurement/metodologie/">Metodologie</a>,
    privacy: <a href="/open-procurement/confidentialitate/">Confidențialitate</a>,
    source: <a href="https://data.gov.ro/">Sursa datelor</a>,
    contact: <a href="/open-procurement/contact/">Contact</a>,
  }}
>
  <h1>Achiziții publice din România</h1>
  <p>Prețuri unitare comparabile din achizițiile directe, interogate în browser.</p>
  <SourceCitation
    {...roLabels.SourceCitation}
    source="SEAP, achiziții directe"
    href="https://data.gov.ro/"
    licence="OGL-ROU-1.0"
    date="2026-09-30"
    methodHref="/open-procurement/metodologie/"
  />
  {/* primary task */}
</SiteShell>
```

Rules:

- `homeLabel` is the hub name from the registry ("Proiecte civice" / "Civic
  projects"); `homeHref` is the hub root, not the app's own landing page.
- Exactly one H1 per page, equal to the registry H1. The tool name in the family bar
  may be the shorter hub title when the H1 is a sentence.
- The provenance line sits directly under the H1 line, before any control or chart.
  `date` is an ISO `YYYY-MM-DD` string so it renders in `<time>`; show it to people
  with `formatDateRO` where prose needs it.
- The footer `method` link is mandatory for anything that computes or classifies.
  `privacy` says what the page stores (usually nothing) and that nothing leaves the
  browser when that is true.

## 3. Content rules

### Romanian

- Comma-below diacritics only: ș ț Ș Ț (U+0219, U+021B, U+0218, U+021A). Never the
  cedilla forms (U+015F, U+0163). Lint for them in source and content; this
  document deliberately does not contain one.
- Language on the root element: `<html lang="ro">`; `lang="en"` on English pages and
  on any English phrase inside Romanian text (proper nouns excepted).
- Second person plural, polite, no exclamation marks: "Selectați o opțiune",
  "Reîncercați". The `roLabels` preset sets the tone for built-in strings.
- One language per page. In Romanian mode no English UI string remains, including
  button labels, chart legends, axis titles, tooltips, empty states and `aria-label`s.
  Test it (section 8).

### Numbers, dates, money

Use `Intl` through the Civic UI formatters; never hand-format with string
replacement.

| What | Romanian | English | Civic UI |
| --- | --- | --- | --- |
| Number | 1.234.567,8 | 1,234,567.8 | `formatNumberRO(v)` / `Intl.NumberFormat('en')` |
| Money | 1.234,50 RON | RON 1,234.50 | `formatRON(v)` |
| Rounded money | 1,2 mld. lei / 340 mil. lei | 1.2 bn lei / 340 m lei | `formatNumberRO(v / 1e9, { maximumFractionDigits: 1 })` + unit |
| Date | 14 octombrie 2026 | 14 October 2026 | `formatDateRO('2026-10-14')` |
| Short date | 14.10.2026 | 2026-10-14 | `formatDateRO(d, { day: '2-digit', month: '2-digit', year: 'numeric' })` |
| Percent | 12,5 % | 12.5% | `formatNumberRO(v, { style: 'percent', maximumFractionDigits: 1 })` |

- Currency in prose is "lei" (singular "1 leu"); the ISO code "RON" appears only in
  tables, exports and the `formatRON` output. Pick one per surface and keep it.
- Thousands separators always, from 10.000 upward. Four-digit years never get one.
- Units follow the number with a non-breaking space: "12,5 %", "340 mil. lei",
  "41 județe". Abbreviations: `mil.` (million), `mld.` (billion), `mii` (thousand,
  spelled out); never "M", "B", "K" in Romanian.
- `StatTile` formats numbers with its `locale` and `format` props; pass
  `locale="ro"` in Romanian mode.

### Tone and banned terms

- Say what the page shows and what it does not: "Rezultatele nu stabilesc drepturi
  legale" is a sentence, not a disclaimer banner.
- No invented facts, sources, contact addresses or legal claims. Every number has a
  source; every "according to the law" has an article.
- Banned on any page: internal names (`rr`, `dpal`, `bui`, `cui`, session or PR
  numbers), repository names in place of product names, "prototype" as a product
  name, "TODO", "lorem", "WIP", "MVP", "v2", "beta" without a date, "AI-generated"
  as a value label, and English fillers in Romanian ("click", "default", "dashboard"
  as a page name, "feature").

## 4. Data visualisation

- Colours come from the viz tokens: categorical `--civic-viz-1`…`8`, assigned in
  order and never cycled; sequential `--civic-viz-seq-1`…`7`; diverging
  `--civic-viz-div-n3`…`mid`…`p3`. No other chart palette, no per-app hex values.
- Every chart sits in a `ChartFrame`: title, the question it answers, source,
  as-of date, and a table of the same data behind "Afișează ca tabel". The table is
  the accessible alternative and the print alternative; it is not optional.
- Bars carry value labels. Lines and areas carry a direct label at the end of the
  series. A legend alone, keyed by colour, is never the only way to tell series
  apart: use labels, patterns or the table.
- One y-axis per chart. No dual axes; split into two framed charts or use small
  multiples.
- Slots `--civic-viz-3`, `4`, `5` (light) and `6` (dark) fall below 3:1 against
  the surface, so charts using them must have visible labels. More than three
  series in a scatter or map: fold the rest into "Altele".
- Demo, partial or synthetic data gets `demo` on the frame (renders the "Date
  demonstrative" badge) and a sentence in `question` saying what is missing.
- Maps: the same tokens, a visible legend with number ranges, a table view, and
  no label overlap at 1440 or 390 (Bucharest and Ilfov are the usual collision).

```tsx
import { ChartFrame, EmptyState, SourceCitation, StatusMessage, Table } from '@cristiannichifor/civic-ui';
import { roLabels } from '@cristiannichifor/civic-ui/locales/ro';

<ChartFrame
  {...roLabels.ChartFrame}
  title="Deficitul bugetar, 2019–2025"
  question="Cât din cheltuieli nu este acoperit de venituri, pe an?"
  source={<SourceCitation {...roLabels.SourceCitation} source="MF, execuția bugetară" href="https://mfinante.gov.ro/" date="2026-09-30" />}
  asOf="2026-09-30"
  demo={false}
  table={<Table label="Deficitul bugetar, pe ani" density="compact">{/* same rows */}</Table>}
  state={rows.length === 0 ? 'empty' : error ? 'error' : 'ready'}
  empty={<EmptyState title="Nu există date pentru filtrul ales" />}
  error={<StatusMessage {...roLabels.StatusMessage} tone="error" title="Datele nu au putut fi încărcate" onRetry={reload} />}
>
  <DeficitChart rows={rows} colors={['var(--civic-viz-1)', 'var(--civic-viz-2)']} />
</ChartFrame>
```

Key figures go in `StatTile`s inside a `StatGrid`, never in hand-rolled cards:

```tsx
<StatGrid label="Indicatori-cheie">
  <StatTile {...roLabels.StatTile} locale="ro" label="Deficit" value={-7.2} unit="% din PIB"
    delta={{ value: -1.1, unit: ' pp', positive: 'bad' }} asOf="2026-09-30" />
  <StatTile {...roLabels.StatTile} locale="ro" label="Achiziții directe" value={26_600_000}
    format={{ notation: 'compact', maximumFractionDigits: 1 }} asOf="2026-09-30" />
</StatGrid>
```

The delta direction is text plus an arrow; `positive` says whether a rise is good
or bad so colour follows meaning, and colour is never the only signal.

## 5. States

Every data surface has four states, and each one is designed, not left to chance.

| State | Component | Rule |
| --- | --- | --- |
| Loading, under 2 s | `LoadingIndicator` or `Skeleton` | Keep layout stable; skeletons match the final size. |
| Loading, over 2 s | `OperationStatus state="loading"` with `progress` | Staged text ("Se descarcă datele", "Se pregătește interogarea") and a progress bar; never a bare spinner. |
| Empty | `EmptyState` | Say why it is empty and what changes it ("Nu există achiziții în 2026 pentru acest CPV. Alegeți alt an."). |
| Error | `StatusMessage tone="error"` with `onRetry` | What failed, in words a citizen understands, and one retry button. No stack traces. |
| Demo data | `StatusBadge tone="warning"` in the family bar, `demo` on each `ChartFrame` | Visible on every screen that shows synthetic or partial data. |

`StatusMessage` chooses `role="alert"` for errors and `role="status"` otherwise,
so do not wrap it in another live region. Reduced motion stops the spinners; do not
add your own animation.

## 6. Mobile, touch and accessibility

Every page is designed at 390 px first and checked at 1440 px. Required:

- No horizontal page scroll at 390 px. Tables use `mobileLayout="cards"` or stay
  in their focusable scroll region; `FilterToolbar` fields wrap to one per row.
- Touch targets at least 24 × 24 CSS px, 44 px preferred for the primary action.
  Civic UI controls meet this; custom chart hit areas and map markers must too.
- WCAG 2.1 AA. Text contrast 4.5:1, UI and graphics 3:1. Status colour always pairs
  with text and an icon. Axe reports 0 serious or critical issues on every route.
- Keyboard: everything reachable in document order, visible focus (the Civic UI
  solid outline), skip link first, focus returned after dialogs close. Charts expose
  their table; maps expose a list.
- `prefers-reduced-motion: reduce` stops all animation, including chart
  transitions and map fly-tos.
- `forced-colors: active` keeps state visible (checked, selected, active tab);
  do not paint over system colours with backgrounds.
- Zoom to 200 % loses nothing; 400 % reflows to one column.

Civic UI runs these checks in Chromium, Firefox and WebKit at 320, 390 and 1440 px;
apps run the equivalent for their own pages (section 8).

## 7. Status vocabulary

One badge per app, in the family bar, from this list and nothing else:

| Status | RO | EN | `StatusBadge` tone | Meaning |
| --- | --- | --- | --- | --- |
| Live data | Date reale | Live data | `success` | Real data with a stated as-of date; refreshed on a documented schedule. |
| Demo data | Date demonstrative | Demo data | `warning` | Synthetic, partial or sample data; nothing on the page is a measurement. |
| Prototype | Prototip | Prototype | `neutral` | The interaction is the point; data may be real or demo (say which). |
| Archived | Arhivat | Archived | `neutral` | No longer updated; as-of date is final. |

The hub catalogue stores the same vocabulary as `status: live-data | demo-data |
prototype | archived`; the badge in the family bar and the hub card must agree.

"Prototype" describes the app, never the data. An app with real data and an
unfinished UI is "Date reale" with an honest method page. The default across the
fleet should not be "Prototip"; earn "Date reale" by adding the as-of date and
source.

## 8. Conformance checklist

Each app guideline copies this table and fills in the test column with a real test
path. "Civic UI" means the library already proves it for its own components; the
app still has to prove it for its pages.

| ID | Check | Civic UI test | App test |
| --- | --- | --- | --- |
| UX-1 | Family bar with hub back link, tool name from the registry, status badge | `tests/site-shell.spec.ts` | |
| UX-2 | One H1 equal to the registry entry; `<title>` starts with it | — | |
| UX-3 | Provenance line under the H1 with source, date, method | `tests/chart-frame.spec.ts` | |
| UX-4 | No cedilla diacritics in source or content | — | |
| UX-5 | No English strings in Romanian mode (`lang` audit) | `tests/locale.spec.ts` | |
| UX-6 | Numbers, money and dates through `Intl` `ro-RO` | `tests/locale.spec.ts` | |
| UX-7 | Every chart in a `ChartFrame` with table, source, as-of | `tests/chart-frame.spec.ts` | |
| UX-8 | Chart colours only from `--civic-viz-*` | `tests/tokens.test.mjs` | |
| UX-9 | Loading over 2 s shows staged progress | — | |
| UX-10 | Empty and error states with retry | `tests/status.spec.ts` | |
| UX-11 | No horizontal overflow at 390 px | `tests/filter-toolbar.spec.ts`, `tests/table-density.spec.ts` | |
| UX-12 | Touch targets ≥ 24 px | — | |
| UX-13 | Axe 0 serious/critical on every route | — | |
| UX-14 | Keyboard: skip link, focus order, focus return | `tests/site-shell.spec.ts` | |
| UX-15 | Reduced motion and forced colours respected | `tests/forced-colors.spec.ts` | |
| UX-16 | Status badge from the section 7 vocabulary | `tests/site-shell.spec.ts` | |
| UX-17 | Footer with method, privacy, source, contact | `tests/site-shell.spec.ts` | |

Suggested app tests, in Playwright: a `names.spec.ts` that compares the H1, title
and family bar to the registry; a `lang.spec.ts` that walks visible text in RO mode
and fails on a list of English words; an `a11y.spec.ts` with `@axe-core/playwright`
per route at 390 and 1440; and a screenshot pair per route at both widths for review.

## 9. Naming registry

The single list of names. The hub card title, the app `<title>`, the family bar
`toolName` and the page H1 come from here. Hub titles are the hub's catalogue
entries on `dev`; H1s are what each app renders on `dev` today. Where a cell
differs from the hub title, the row is a deviation to fix in the app, not a second
name to keep. Change this table first, then the apps.

Hub: **Proiecte civice** / **Civic projects**, `https://projects.cristian-nichifor.com/`.
The `homeLabel` in every family bar is this name.

| Hub title RO | Hub title EN | App H1 today (RO) | Slug | Repo | Target H1 |
| --- | --- | --- | --- | --- | --- |
| Simulatoare și monitoare | Romania Reforms | Simulatoare și monitoare | `/romania-reforms/` | romania-reforms | Simulatoare și monitoare |
| ↳ Salarizarea publică | Public pay | Cum își plătește România angajații publici | `/romania-reforms/public-pay/` | romania-reforms | H1 stays a sentence; tool name "Salarizarea publică" |
| ↳ Reforma administrativă | Administrative reform | (i18n `title`) | `/romania-reforms/administrative-reform/` | romania-reforms | Reforma administrativă |
| ↳ Companiile statului | State companies | Companiile statului, pe activități | `/romania-reforms/companii-stat/` | romania-reforms | Companiile statului, pe activități |
| ↳ Serviciile deconcentrate | Deconcentrated services | Serviciile deconcentrate, pe opt regiuni | `/romania-reforms/deconcentrare/` | romania-reforms | Serviciile deconcentrate, pe opt regiuni |
| ↳ Impozitul pe teren | Land tax | Impozitul pe teren | `/romania-reforms/impozit-teren/` | romania-reforms | Impozitul pe teren |
| ↳ Harta instanțelor | Court map | Harta instanțelor | `/romania-reforms/justitie/` | romania-reforms | Harta instanțelor |
| ↳ Transport | Transport | Până la reședința de județ | `/romania-reforms/transport/` | romania-reforms | Până la reședința de județ; tool name "Transport" |
| Achiziții publice din România | Open Procurement | Achiziții publice din România | `/open-procurement/` | achizitii-deschise | Achiziții publice din România |
| Linter legislativ | Legislation Linter | Ce spune legea despre proiectul tău | `/legislation-linter/` | legislativ | Linter legislativ (sentence moves to the one-line purpose) |
| Birocrație ca program | Bureaucracy as Code | Bureaucracy as Code | `/bureaucracy-as-code/` | bureaucracy-as-code | Birocrație ca program (RO mode) |
| Atlasul României digitale | Digital Romania Atlas | Digital Romania Atlas | `/digital-romania-atlas/` | digital-romania-atlas | Atlasul României digitale (RO mode) |
| Fluxuri de date pentru reforma serviciilor de informații | Intelligence Reform Data Flows | Fluxuri informaționale de date | `/romania-intelligence-reform-dataflows/` | ro-intel-reform-dataflows | Fluxuri de date pentru reforma serviciilor de informații; tool name "Fluxuri de date" |
| Bugetul României | Citizen Budget Dashboard | Bugetul României | `https://budget.cristian-nichifor.com/` | ro-budget-dashboard | Bugetul României |
| Prototip de platformă USR | USR Platform Prototype | Site public USR ca infrastructură de încredere… | GitHub Pages `usr-digital-platform-wireframe` | usr-digital-platform-wireframe | Prototip de platformă USR; sentence moves to the one-line purpose |
| Civic UI | Civic UI | Civic UI | GitHub Pages `civic-ui` | civic-ui | Civic UI |

Sub-simulator names under "Simulatoare și monitoare" were written here from the
simulators' current titles; the romania-reforms guideline owns them and may rename
them in this table first. Slugs under the hub are the hub's routing registry
(`src/projects.ts` in digital-public-administration-lab) and do not change when a
title changes.

## 10. How an app extends this

1. Copy [`ux-guidelines.template.md`](ux-guidelines.template.md) to the app's
   `docs/ux-guidelines.md`.
2. Fill sections 1, 8 and 9 of the template; leave the base rules as links to the
   numbered sections here, and list only the app's additions or tightenings under
   each.
3. Add the registry row for the app to section 9 above through a civic-ui PR when
   a name changes.
4. Fix deviations as small PRs against the app, one theme per PR, each with the
   checklist ID in the commit body.
