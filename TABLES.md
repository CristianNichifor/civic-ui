# Table Presentation Contract

Civic UI provides the table surface and overflow region; consumers own rows, sorting, filtering, pagination and mobile information architecture.

## Density

`<Table density="compact">` sets `data-density="compact"` and tightens cell padding and
sortable header buttons. The default is `comfortable`.

- Use the default spacing for mixed-content tables and repeated scanning.
- Use `compact` for operational tables only when row labels remain readable at 200% zoom.
- Keep column headings visible and use `scope` or `aria-sort` for sortable headers.

## Overflow

`Table` renders a keyboard-focusable `.civic-table-scroll` region. Give it a concise `label`, keep the table width intrinsic, and let the region scroll horizontally rather than shrinking numeric columns below legibility.

## Mobile

`<Table mobileLayout="cards">` sets `data-mobile-layout="cards"`. Below 560 px each row
becomes a bordered card and each cell shows its column name from a `data-label` attribute
the host supplies:

```tsx
<Table label="Documents" mobileLayout="cards">
  <thead><tr><SortableHeader onSort={sort}>Document</SortableHeader><th scope="col">Status</th></tr></thead>
  <tbody>{rows.map(row => <tr key={row.id}>
    <td data-label="Document">{row.title}</td>
    <td data-label="Status">{row.status}</td>
  </tr>)}</tbody>
</Table>
```

Header cells stay visible as one wrapping row above the cards, so sort buttons remain
reachable. Civic UI does not infer labels from arbitrary data: a cell without
`data-label` shows only its value. Some browsers drop table semantics from elements whose
`display` changes; when screen reader users must navigate the cards by row and column,
add `role="row"` and `role="cell"` to the host markup. For layouts that need a different
information architecture, keep a host-owned card or list rendering instead, with the same
labels, values, order and pagination.

## Acceptance

- Keyboard users can focus and scroll the region.
- Headings and sort direction are announced.
- No text or controls overlap at narrow widths.
- The host's loading, empty, error and retry states remain visible outside the table region.
