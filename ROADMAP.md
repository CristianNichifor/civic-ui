# Civic UI Roadmap

This backlog is ordered by reuse evidence from the merged consumer applications.

## Next

Items 1 to 3 shipped in 0.8.0: `StatusMessage` for success, warning, error and retry; the
`FilterToolbar` composition with a live result count; and the `Table` density and mobile
card contract.

Unreleased work on the former "Later" items:

4. **Notice and validation composition**: `COMPONENTS.md` states the role, announcement
   and focus behaviour of every feedback component in one table. Runtime alignment, if
   consumers need it, is still open.
5. **Pagination and result navigation**: `Pagination` keeps keyboard focus when a
   boundary disables previous or next.
6. **Theme token diagnostics**: `missingCivicTokens` and `civicPaletteOverrides` report
   missing host tokens and palette overrides in development.

## Later

No further items yet. New ones need the reuse evidence below.

## Explicitly Out Of Scope

Authentication, permissions, routing, charts, maps, date pickers, domain-specific cards, data fetching and political or organizational content remain host-owned.

Every new component should have two real consumers, a keyboard contract, relevant light/dark coverage, a native fallback where applicable, and a release-note entry before publication.
