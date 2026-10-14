import { useState } from "react";
import { MoreHorizontal, Pencil, HelpCircle } from "lucide-react";
import {
  Textarea,
  Checkbox,
  RadioGroup,
  RangeSlider,
  SegmentedControl,
  Switch,
  Select,
  Popover,
  Notice,
  ValidationSummary,
  Dialog,
  AlertDialog,
  Tabs,
  Tooltip,
  DropdownMenu,
  StatusBadge,
  EmptyState,
  LoadingIndicator,
  FilterToolbar,
  Input,
  NativeSelect,
  OperationStatus,
  StatusMessage,
  Table,
  SortableHeader,
  Pagination,
  Field,
  Button,
  IconButton,
  type CivicLabels,
} from "@cristiannichifor/civic-ui";

type PropRow = [name: string, type: string, fallback: string, description: string];

// A collapsed reference table; plain markup so it never competes with the demo tables.
function PropsTable({ component, rows }: { component: string; rows: PropRow[] }) {
  return (
    <details className="props">
      <summary>{component} props</summary>
      <div className="props-scroll">
        <table className="props-table" aria-label={`${component} props`}>
          <thead>
            <tr>
              <th scope="col">Prop</th>
              <th scope="col">Type</th>
              <th scope="col">Default</th>
              <th scope="col">Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, type, fallback, description]) => (
              <tr key={name}>
                <th scope="row"><code>{name}</code></th>
                <td><code>{type}</code></td>
                <td>{fallback}</td>
                <td>{description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export function ExtendedShowcase({ labels }: { labels: CivicLabels }) {
  const [overlayRoot, setOverlayRoot] = useState<HTMLDivElement | null>(null);
  const portalContainer = new URLSearchParams(location.search).has("portal")
    ? (overlayRoot ?? undefined)
    : undefined;
  const [audience, setAudience] = useState("public");
  const [density, setDensity] = useState("comfortable");
  const [zoom, setZoom] = useState(50);
  const [notifications, setNotifications] = useState(true);
  const [format, setFormat] = useState("public");
  const [confirmed, setConfirmed] = useState(false);
  const [action, setAction] = useState("No action selected");
  const [page, setPage] = useState(1);
  const [ascending, setAscending] = useState(true);
  const [notes, setNotes] = useState("");
  const [query, setQuery] = useState("");
  const [visibility, setVisibility] = useState("all");
  const [retries, setRetries] = useState(0);
  const records = ["Archive", "Budget", "Consultation", "Documents"]
    .filter(
      (record) =>
        (visibility === "all" || visibility === "public") &&
        record.toLowerCase().includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => (ascending ? a.localeCompare(b) : b.localeCompare(a)));
  const pageCount = Math.max(1, Math.ceil(records.length / 2));
  return (
    <>
      <section id="forms">
        <div className="section-title">
          <span>05</span>
          <h2>Form choices</h2>
        </div>
        <div className="field-grid">
          <Field
            id="notes"
            label="Notes"
            error={!notes ? "Notes are required" : undefined}
          >
            {(props) => (
              <Textarea
                {...props}
                required
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
              />
            )}
          </Field>
          <div>
            <Checkbox label="Include attachments" name="attachments" />
            <Checkbox label="Restricted attachment" disabled />
            <RadioGroup
              label="Visibility"
              name="visibility"
              value={audience}
              onValueChange={setAudience}
              options={[
                { value: "public", label: "Public" },
                { value: "draft", label: "Draft" },
                { value: "restricted", label: "Restricted", disabled: true },
              ]}
            />
            <SegmentedControl
              label="View density"
              value={density}
              onValueChange={setDensity}
              options={[
                { value: "comfortable", label: "Comfortable" },
                { value: "compact", label: "Compact" },
              ]}
            />
            <RangeSlider
              label="Preview zoom"
              value={zoom}
              min={25}
              max={100}
              step={5}
              onValueChange={setZoom}
            />
            <Switch
              label="Notify reviewers"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <Select
              {...labels.Select}
              label="Review format"
              value={format}
              onValueChange={setFormat}
              options={[
                { value: "public", label: "Public" },
                { value: "private", label: "Private" },
              ]}
            />
            <Popover
              label="Review guidance"
              trigger={<Button>Review guidance</Button>}
            >
              <p>Keep review notes concise and evidence-based.</p>
            </Popover>
          </div>
        </div>
        <ValidationSummary
          {...labels.ValidationSummary}
          errors={
            notes
              ? []
              : [{ id: "notes", message: "Add notes before continuing" }]
          }
        />
      </section>
      <section id="feedback">
        <div className="section-title">
          <span>06</span>
          <h2>Feedback</h2>
        </div>
        <Notice title="Archive available" tone="success">
          Four synthetic documents
        </Notice>
        <OperationStatus
          state="loading"
          label="Updating archive"
          detail="Downloading the verified release."
          progress={62}
        />
        <div className="status-stack">
          <StatusMessage tone="success" title="Archive saved">
            Four synthetic documents were stored.
          </StatusMessage>
          <StatusMessage tone="warning" title="Two documents need review" />
          <StatusMessage
            {...labels.StatusMessage}
            tone="error"
            title="Archive could not be refreshed"
            onRetry={() => setRetries((n) => n + 1)}
          >
            The synthetic source did not respond. Retries: {retries}
          </StatusMessage>
        </div>
        <PropsTable
          component="StatusMessage"
          rows={[
            ["tone", '"success" | "warning" | "error"', "required", "Error renders role=alert; the others role=status."],
            ["title", "string", "required", "Short outcome statement."],
            ["children", "ReactNode", "none", "Supporting detail."],
            ["onRetry", "() => void", "none", "Renders a native retry button when given."],
            ["retryLabel", "string", '"Retry"', "Translated button text; see roLabels.StatusMessage."],
          ]}
        />
        <div className="button-row">
          <StatusBadge>Draft</StatusBadge>
          <StatusBadge tone="success">Published</StatusBadge>
          <StatusBadge tone="warning">Pending review</StatusBadge>
          <StatusBadge tone="danger">Unavailable</StatusBadge>
          <LoadingIndicator {...labels.LoadingIndicator} label="Loading documents" />
        </div>
        <EmptyState
          title="No saved documents"
          action={
            <Button onClick={() => setAction("Archive opened")}>
              Browse archive
            </Button>
          }
        >
          Your saved documents will appear here.
        </EmptyState>
      </section>
      <section id="overlays">
        <div className="section-title">
          <span>07</span>
          <h2>Dialogs and menus</h2>
        </div>
        <div className="button-row">
          <Dialog
            {...labels.Dialog}
            portalContainer={portalContainer}
            trigger={
              <Button>
                <Pencil aria-hidden="true" />
                Edit document
              </Button>
            }
            title="Edit document"
            description="Synthetic document settings"
          >
            <Field id="dialog-title" label="Document name">
              {(props) => <Textarea {...props} defaultValue="Public archive" />}
            </Field>
          </Dialog>
          <AlertDialog
            {...labels.AlertDialog}
            portalContainer={portalContainer}
            trigger={<Button>Archive document</Button>}
            title="Archive document?"
            description="The synthetic document will be marked as archived."
            confirmLabel="Archive"
            onConfirm={() => setConfirmed(true)}
          />
          <Tooltip portalContainer={portalContainer} content="Document help">
            <IconButton label="Help">
              <HelpCircle aria-hidden="true" />
            </IconButton>
          </Tooltip>
          <DropdownMenu
            portalContainer={portalContainer}
            label="Document actions"
            trigger={
              <IconButton label="Document actions">
                <MoreHorizontal aria-hidden="true" />
              </IconButton>
            }
            items={[
              {
                id: "edit",
                label: "Edit metadata",
                icon: <Pencil aria-hidden="true" />,
                onSelect: () => setAction("Metadata selected"),
              },
              {
                id: "delete",
                label: "Delete document",
                disabled: true,
                onSelect: () => setAction("Deleted"),
              },
              {
                id: "copy",
                label: "Duplicate document",
                onSelect: () => setAction("Duplicate selected"),
              },
            ]}
          />
          <output role="status">
            {confirmed ? "Document archived" : action}
          </output>
        </div>
      </section>
      <section id="data">
        <div className="section-title">
          <span>08</span>
          <h2>Tabs and tables</h2>
        </div>
        <FilterToolbar
          {...labels.FilterToolbar}
          label="Archive filters"
          resultCount={`${records.length} ${records.length === 1 ? "document" : "documents"}`}
          actions={
            <Button
              onClick={() => {
                setQuery("");
                setVisibility("all");
                setPage(1);
              }}
            >
              Reset filters
            </Button>
          }
        >
          <Field id="archive-search" label="Search archive">
            {(props) => (
              <Input
                {...props}
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            )}
          </Field>
          <Field id="archive-visibility" label="Visibility filter">
            {(props) => (
              <NativeSelect
                {...props}
                value={visibility}
                onChange={(event) => {
                  setVisibility(event.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All visibility</option>
                <option value="public">Public</option>
                <option value="draft">Draft</option>
              </NativeSelect>
            )}
          </Field>
        </FilterToolbar>
        <PropsTable
          component="FilterToolbar"
          rows={[
            ["children", "ReactNode", "required", "Caller-owned, labelled filter controls."],
            ["actions", "ReactNode", "none", "Reset or apply buttons."],
            ["resultCount", "ReactNode", "none", "Rendered in a polite, atomic live region."],
            ["label", "string", '"Filters"', "Group name; see roLabels.FilterToolbar."],
          ]}
        />
        <PropsTable
          component="Table"
          rows={[
            ["label", "string", "required", "Name of the scrollable region."],
            ["density", '"comfortable" | "compact"', '"comfortable"', "Sets data-density."],
            ["mobileLayout", '"scroll" | "cards"', '"scroll"', "Cards below 560 px; cells need data-label."],
          ]}
        />
        <Tabs
          label="Archive views"
          items={[
            {
              value: "documents",
              label: "Documents",
              content: (
                <>
                  <Table
                    label="Archive documents"
                    density={density === "compact" ? "compact" : "comfortable"}
                    mobileLayout="cards"
                  >
                    <caption>Public archive</caption>
                    <thead>
                      <tr>
                        <SortableHeader
                          direction={ascending ? "ascending" : "descending"}
                          onSort={() => {
                            setAscending(!ascending);
                            setPage(1);
                          }}
                        >
                          Document
                        </SortableHeader>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.slice((page - 1) * 2, page * 2).map((record) => (
                        <tr key={record}>
                          <td data-label="Document">{record}</td>
                          <td data-label="Status">
                            <StatusBadge>Public</StatusBadge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Pagination
                    {...labels.Pagination}
                    page={page}
                    pageCount={pageCount}
                    onPageChange={setPage}
                  />
                </>
              ),
            },
            {
              value: "saved",
              label: "Saved",
              content: <EmptyState title="No saved items" />,
            },
            {
              value: "restricted",
              label: "Restricted",
              disabled: true,
              content: null,
            },
          ]}
        />
      </section>
      <div id="overlay-host" ref={setOverlayRoot} />
    </>
  );
}
