# UX guidelines: <app name from the registry>

Extends the [fleet UX guidelines](https://github.com/CristianNichifor/civic-ui/blob/dev/docs/ux-guidelines.md)
(civic-ui `docs/ux-guidelines.md`). Only additions and tightenings are listed under
each numbered section; everything not mentioned follows the base. Product language is
Romanian; this document is English.

Registry row: **<Hub title RO>** / **<Hub title EN>**, slug `<slug>`, H1 "<H1>".
Status: <Date reale | Date demonstrative | Prototip | Arhivat>, as of <YYYY-MM-DD>.

## 1. Users and top tasks

- Users: <two or three concrete people: "a journalist checking one tender", "a
  council clerk comparing own-county figures">.
- Top tasks, in order: <1>, <2>, <3>.
- The one job of the first screen: <one sentence>.

## 2. Page anatomy

Base: family bar → H1 + one line → provenance line → primary task → secondary views
→ footer. App additions:

- Family bar: `homeLabel` "Proiecte civice", `toolName` "<registry title>",
  status "<badge>", languages <ro | ro, en>.
- Primary task on the first screen: <control group or chart>.
- Secondary views: <list>.
- Footer links: method `<path>`, privacy `<path>`, source `<URL>`, contact `<path>`.

## 3. Content rules

Base rules apply (comma-below diacritics, `Intl` `ro-RO`, lei/RON per surface,
mil./mld., banned terms). App additions:

- Domain terms and their fixed Romanian form: <term → form>.
- Units: <e.g. "lei/km", "% din PIB">.
- Money unit on this surface: <lei | RON>.
- Extra banned terms: <internal or legacy names>.

## 4. Data visualisation

Base: viz tokens only, `ChartFrame` with table and provenance, labels on bars, no
dual axes, demo badges. App additions:

- Chart types in use and their labelling rule: <type → rule>.
- Series order and token assignment: <series → `--civic-viz-n`>.
- Maps: <legend ranges, collision handling, list alternative>.

## 5. States

Base: loading (staged over 2 s), empty, error with retry, demo. App additions:

- Loading stages and their text: <stage → text>.
- Empty-state reasons and the action that resolves each: <reason → action>.
- Errors a user can hit and their message: <error → message>.

## 6. Mobile and accessibility

Base: 390 px first, no horizontal scroll, targets ≥ 24 px (44 preferred), WCAG 2.1
AA, axe 0 serious, keyboard, reduced motion, forced colours. App additions:

- Routes checked at 390 and 1440: <list>.
- Known narrow-width layouts: <table → cards | scroll>.
- Custom interactive elements and their keyboard model: <element → keys>.

## 7. Status

<Badge> because <reason: data source and refresh schedule, or what is synthetic>.
Next status change: <condition>.

## 8. Conformance checklist

Copy the base table and fill the app test column. Each row names a test file that
exists in this repository or a backlog item that adds it.

| ID | Check | App test |
| --- | --- | --- |
| UX-1 | Family bar with hub back link, tool name from the registry, status badge | |
| UX-2 | One H1 equal to the registry entry; `<title>` starts with it | |
| UX-3 | Provenance line under the H1 with source, date, method | |
| UX-4 | No cedilla diacritics in source or content | |
| UX-5 | No English strings in Romanian mode | |
| UX-6 | Numbers, money and dates through `Intl` `ro-RO` | |
| UX-7 | Every chart in a `ChartFrame` with table, source, as-of | |
| UX-8 | Chart colours only from `--civic-viz-*` | |
| UX-9 | Loading over 2 s shows staged progress | |
| UX-10 | Empty and error states with retry | |
| UX-11 | No horizontal overflow at 390 px | |
| UX-12 | Touch targets ≥ 24 px | |
| UX-13 | Axe 0 serious/critical on every route | |
| UX-14 | Keyboard: skip link, focus order, focus return | |
| UX-15 | Reduced motion and forced colours respected | |
| UX-16 | Status badge from the base vocabulary | |
| UX-17 | Footer with method, privacy, source, contact | |

## 9. Known deviations backlog

From the live UX review and the app's own audit (Playwright screenshots at 1440 and
390). One row per deviation; close rows by PR.

| # | Route | Checklist ID | Deviation | Owner / PR | State |
| --- | --- | --- | --- | --- | --- |
| 1 | `/` | UX-1 | <e.g. no family bar> | | open |
