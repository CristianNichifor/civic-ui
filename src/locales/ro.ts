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
};

export type { CivicLabels };
