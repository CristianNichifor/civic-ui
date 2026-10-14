/**
 * Every built-in string, grouped by component and keyed by the prop that sets it.
 * Spread a group onto its component: `<Pagination {...labels.Pagination} ... />`.
 */
export type CivicLabels = {
  Select: { placeholder: string };
  ValidationSummary: { title: string };
  Dialog: { closeLabel: string };
  AlertDialog: { confirmLabel: string; cancelLabel: string };
  LoadingIndicator: { label: string };
  FilterToolbar: { label: string };
  Pagination: { label: string; previousLabel: string; nextLabel: string };
  StatusMessage: { retryLabel: string };
  SiteShell: { skipLabel: string };
  FamilyBar: { languageLabel: string };
  SiteFooter: { label: string };
  StatTile: { increaseLabel: string; decreaseLabel: string; noChangeLabel: string; asOfLabel: string };
  ChartFrame: { showTableLabel: string; demoLabel: string; asOfLabel: string };
  SourceCitation: { sourceLabel: string; licenceLabel: string; dateLabel: string; methodLabel: string };
};

/** The English defaults the components use when a prop is omitted. */
export const enLabels: CivicLabels = {
  Select: { placeholder: "Select an option" },
  ValidationSummary: { title: "Please check the following fields" },
  Dialog: { closeLabel: "Close dialog" },
  AlertDialog: { confirmLabel: "Confirm", cancelLabel: "Cancel" },
  LoadingIndicator: { label: "Loading" },
  FilterToolbar: { label: "Filters" },
  Pagination: { label: "Pagination", previousLabel: "Previous page", nextLabel: "Next page" },
  StatusMessage: { retryLabel: "Retry" },
  SiteShell: { skipLabel: "Skip to content" },
  FamilyBar: { languageLabel: "Language" },
  SiteFooter: { label: "Site information" },
  StatTile: { increaseLabel: "Increase", decreaseLabel: "Decrease", noChangeLabel: "No change", asOfLabel: "As of" },
  ChartFrame: { showTableLabel: "Show as table", demoLabel: "Demo data", asOfLabel: "As of" },
  SourceCitation: { sourceLabel: "Source", licenceLabel: "Licence", dateLabel: "Retrieved", methodLabel: "Method" },
};
