import { useState } from "react";
import { MoreHorizontal, Pencil, HelpCircle } from "lucide-react";
import {
  Textarea,
  Checkbox,
  RadioGroup,
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
  Table,
  SortableHeader,
  Pagination,
  Field,
  Button,
  IconButton,
} from "@cristiannichifor/civic-ui";

export function ExtendedShowcase() {
  const [overlayRoot, setOverlayRoot] = useState<HTMLDivElement | null>(null);
  const portalContainer = new URLSearchParams(location.search).has("portal")
    ? (overlayRoot ?? undefined)
    : undefined;
  const [audience, setAudience] = useState("public");
  const [confirmed, setConfirmed] = useState(false);
  const [action, setAction] = useState("No action selected");
  const [page, setPage] = useState(1);
  const [ascending, setAscending] = useState(true);
  const [notes, setNotes] = useState("");
  const records = ["Archive", "Budget", "Consultation", "Documents"].sort(
    (a, b) => (ascending ? a.localeCompare(b) : b.localeCompare(a)),
  );
  return (
    <>
      <section id="forms">
        <div className="section-title">
          <span>04</span>
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
          </div>
        </div>
        <ValidationSummary
          errors={
            notes
              ? []
              : [{ id: "notes", message: "Add notes before continuing" }]
          }
        />
      </section>
      <section id="feedback">
        <div className="section-title">
          <span>05</span>
          <h2>Feedback</h2>
        </div>
        <Notice title="Archive available" tone="success">
          Four synthetic documents
        </Notice>
        <div className="button-row">
          <StatusBadge>Draft</StatusBadge>
          <StatusBadge tone="success">Published</StatusBadge>
          <StatusBadge tone="warning">Pending review</StatusBadge>
          <StatusBadge tone="danger">Unavailable</StatusBadge>
          <LoadingIndicator label="Loading documents" />
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
          <span>06</span>
          <h2>Dialogs and menus</h2>
        </div>
        <div className="button-row">
          <Dialog
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
          <span>07</span>
          <h2>Tabs and tables</h2>
        </div>
        <FilterToolbar
          label="Archive filters"
          resultCount="4 documents"
          actions={<Button>Apply filters</Button>}
        >
          <Input aria-label="Search archive" placeholder="Search archive" />
          <NativeSelect aria-label="Visibility filter" defaultValue="all">
            <option value="all">All visibility</option>
            <option value="public">Public</option>
            <option value="draft">Draft</option>
          </NativeSelect>
        </FilterToolbar>
        <Tabs
          label="Archive views"
          items={[
            {
              value: "documents",
              label: "Documents",
              content: (
                <>
                  <Table label="Archive documents">
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
                          <td>{record}</td>
                          <td>
                            <StatusBadge>Public</StatusBadge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Pagination
                    page={page}
                    pageCount={2}
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
