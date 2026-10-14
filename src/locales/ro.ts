import type { CivicLabels } from "../labels";

/** Romanian labels. Opt in per component: `<Pagination {...roLabels.Pagination} ... />`. */
export const roLabels: CivicLabels = {
  Select: { placeholder: "Selectați o opțiune" },
  ValidationSummary: { title: "Verificați următoarele câmpuri" },
  Dialog: { closeLabel: "Închideți dialogul" },
  AlertDialog: { confirmLabel: "Confirmați", cancelLabel: "Anulați" },
  LoadingIndicator: { label: "Se încarcă" },
  FilterToolbar: { label: "Filtre" },
  Pagination: { label: "Paginare", previousLabel: "Pagina anterioară", nextLabel: "Pagina următoare" },
  StatusMessage: { retryLabel: "Reîncercați" },
};

export type { CivicLabels };

/** Formats an amount in lei: `formatRON(1234.5)` → "1.234,50 RON". Options override the defaults. */
export function formatRON(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", ...options }).format(value);
}

/** Formats a number with Romanian separators: `formatNumberRO(98765.4)` → "98.765,4". */
export function formatNumberRO(value: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("ro-RO", options).format(value);
}

/**
 * Formats a date as "14 octombrie 2026". A `YYYY-MM-DD` string is read as that calendar
 * day in local time, so it never shifts by a day across time zones.
 */
export function formatDateRO(date: Date | string, options: Intl.DateTimeFormatOptions = {}) {
  const day = typeof date === "string" ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(date) : null;
  const value = day ? new Date(Number(day[1]), Number(day[2]) - 1, Number(day[3])) : new Date(date);
  if (Number.isNaN(value.getTime())) throw new RangeError(`Invalid date: ${String(date)}`);
  return new Intl.DateTimeFormat("ro-RO", { day: "numeric", month: "long", year: "numeric", ...options }).format(value);
}
