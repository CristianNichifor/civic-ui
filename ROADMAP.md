# Civic UI Roadmap

This backlog is ordered by reuse evidence from the merged consumer applications.

## Next

1. **Status and progress patterns**: standardize loading, success, warning, error and retry states used by data-heavy simulators.
2. **Filter toolbar primitives**: provide a responsive composition for search, select filters, reset and result counts.
3. **Table density and responsive overflow**: document compact, comfortable and mobile-card presentation contracts without owning table data.

## Later

4. **Notice and validation composition**: align inline notices, validation summaries and asynchronous operation status semantics.
5. **Pagination and result navigation**: expand keyboard and screen-reader guidance around existing pagination primitives.
6. **Theme token diagnostics**: add a development-only check for missing host tokens and accidental palette overrides.

## Explicitly Out Of Scope

Authentication, permissions, routing, charts, maps, date pickers, domain-specific cards, data fetching and political or organizational content remain host-owned.

Every new component should have two real consumers, a keyboard contract, relevant light/dark coverage, a native fallback where applicable, and a release-note entry before publication.
