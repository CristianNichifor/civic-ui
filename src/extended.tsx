import {
  forwardRef,
  useId,
  type ReactNode,
  type ReactElement,
  type TextareaHTMLAttributes,
  type InputHTMLAttributes,
  type HTMLAttributes,
  type TableHTMLAttributes,
} from "react";
import * as D from "@radix-ui/react-dialog";
import * as A from "@radix-ui/react-alert-dialog";
import * as T from "@radix-ui/react-tabs";
import * as Tip from "@radix-ui/react-tooltip";
import * as Menu from "@radix-ui/react-dropdown-menu";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Info,
  LoaderCircle,
  X,
} from "lucide-react";
import { Button, IconButton } from "./components";
import { createPortal } from "react-dom";

function OverlayHost({
  children,
  container,
}: {
  children: ReactNode;
  container?: HTMLElement;
}) {
  return container ? createPortal(children, container) : children;
}

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = "", ...props }, ref) => (
  <textarea ref={ref} className={`civic-textarea ${className}`} {...props} />
));
Textarea.displayName = "Textarea";

export const Checkbox = forwardRef<
  HTMLInputElement,
  Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: ReactNode }
>(({ label, className = "", ...props }, ref) => (
  <label className={`civic-choice ${className}`}>
    <input {...props} ref={ref} type="checkbox" />
    <span>{label}</span>
  </label>
));
Checkbox.displayName = "Checkbox";

export function RadioGroup({
  label,
  options,
  value,
  onValueChange,
  name,
  disabled,
  required,
  error,
}: {
  label: string;
  options: { value: string; label: ReactNode; disabled?: boolean }[];
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}) {
  const id = useId();
  return (
    <fieldset
      className="civic-radio-group"
      disabled={disabled}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend>{label}</legend>
      {options.map((option) => (
        <label className="civic-choice" key={option.value}>
          <input
            type="radio"
            name={name || id}
            value={option.value}
            checked={value === option.value}
            required={required}
            disabled={option.disabled}
            onChange={() => onValueChange(option.value)}
          />
          <span>{option.label}</span>
        </label>
      ))}
      {error && (
        <small className="civic-error" id={`${id}-error`}>
          {error}
        </small>
      )}
    </fieldset>
  );
}

export function Notice({
  title,
  children,
  tone = "info",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title: string;
  tone?: "info" | "success" | "warning" | "danger";
}) {
  return (
    <div
      {...props}
      className={`civic-notice ${props.className || ""}`}
      data-tone={tone}
    >
      <Info size={20} aria-hidden="true" />
      <div>
        <strong>{title}</strong>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}

export function ValidationSummary({
  errors,
  title = "Please check the following fields",
}: {
  errors: { id: string; message: string }[];
  title?: string;
}) {
  if (!errors.length) return null;
  return (
    <Notice title={title} tone="danger" role="alert">
      <ul>
        {errors.map(({ id, message }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(event) => {
                const control = document.getElementById(id);
                if (!control) return;
                // Preserve hash-router routes when moving to an invalid field.
                event.preventDefault();
                control.focus();
                control.scrollIntoView({ block: "center" });
              }}
            >
              {message}
            </a>
          </li>
        ))}
      </ul>
    </Notice>
  );
}

type DialogProps = {
  trigger: ReactElement;
  title: string;
  description: string;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  portalContainer?: HTMLElement;
  closeLabel?: string;
};
export function Dialog({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
  portalContainer,
  closeLabel = "Close dialog",
}: DialogProps) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Trigger asChild>{trigger}</D.Trigger>
      <OverlayHost container={portalContainer}>
        <D.Overlay className="civic-overlay" />
        <D.Content className="civic-dialog">
          <D.Title>{title}</D.Title>
          <D.Description>{description}</D.Description>
          {children}
          <D.Close asChild>
            <IconButton className="civic-dialog-close" label={closeLabel}>
              <X aria-hidden="true" />
            </IconButton>
          </D.Close>
        </D.Content>
      </OverlayHost>
    </D.Root>
  );
}

export function AlertDialog({
  trigger,
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  portalContainer,
}: Omit<DialogProps, "children" | "closeLabel"> & {
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}) {
  return (
    <A.Root open={open} onOpenChange={onOpenChange}>
      <A.Trigger asChild>{trigger}</A.Trigger>
      <OverlayHost container={portalContainer}>
        <A.Overlay className="civic-overlay" />
        <A.Content className="civic-dialog">
          <A.Title>{title}</A.Title>
          <A.Description>{description}</A.Description>
          <div className="civic-actions">
            <A.Cancel asChild>
              <Button>{cancelLabel}</Button>
            </A.Cancel>
            <A.Action asChild>
              <Button primary onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </A.Action>
          </div>
        </A.Content>
      </OverlayHost>
    </A.Root>
  );
}

export function Tabs({
  label,
  items,
  value,
  onValueChange,
  defaultValue,
}: {
  label: string;
  items: {
    value: string;
    label: string;
    content: ReactNode;
    disabled?: boolean;
  }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  return (
    <T.Root
      value={value}
      defaultValue={defaultValue ?? items[0]?.value}
      onValueChange={onValueChange}
    >
      <T.List className="civic-tabs" aria-label={label}>
        {items.map((item) => (
          <T.Trigger
            className="civic-button"
            key={item.value}
            value={item.value}
            disabled={item.disabled}
          >
            {item.label}
          </T.Trigger>
        ))}
      </T.List>
      {items.map((item) => (
        <T.Content
          className="civic-tab-panel"
          key={item.value}
          value={item.value}
        >
          {item.content}
        </T.Content>
      ))}
    </T.Root>
  );
}

export function Tooltip({
  children,
  content,
  portalContainer,
}: {
  children: ReactElement;
  content: string;
  portalContainer?: HTMLElement;
}) {
  return (
    <Tip.Provider delayDuration={300}>
      <Tip.Root>
        <Tip.Trigger asChild>{children}</Tip.Trigger>
        <OverlayHost container={portalContainer}>
          <Tip.Content
            className="civic-tooltip"
            sideOffset={6}
            collisionPadding={12}
          >
            {content}
            <Tip.Arrow className="civic-tooltip-arrow" />
          </Tip.Content>
        </OverlayHost>
      </Tip.Root>
    </Tip.Provider>
  );
}

export function DropdownMenu({
  trigger,
  label,
  items,
  portalContainer,
}: {
  trigger: ReactElement;
  label: string;
  portalContainer?: HTMLElement;
  items: {
    id: string;
    label: string;
    onSelect: () => void;
    disabled?: boolean;
    icon?: ReactNode;
  }[];
}) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>{trigger}</Menu.Trigger>
      <OverlayHost container={portalContainer}>
        <Menu.Content
          className="civic-menu"
          aria-label={label}
          sideOffset={6}
          collisionPadding={12}
        >
          {items.map((item) => (
            <Menu.Item
              className="civic-menu-item"
              key={item.id}
              disabled={item.disabled}
              onSelect={item.onSelect}
            >
              {item.icon}
              {item.label}
            </Menu.Item>
          ))}
        </Menu.Content>
      </OverlayHost>
    </Menu.Root>
  );
}

export function StatusBadge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger";
}) {
  return (
    <span className="civic-badge" data-tone={tone}>
      {children}
    </span>
  );
}
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="civic-empty">
      <strong>{title}</strong>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
export function LoadingIndicator({ label = "Loading" }: { label?: string }) {
  return (
    <span className="civic-loading" role="status">
      <LoaderCircle aria-hidden="true" />
      {label}
    </span>
  );
}

export function FilterToolbar({
  children,
  actions,
  resultCount,
  label = "Filters",
}: {
  children: ReactNode;
  actions?: ReactNode;
  resultCount?: ReactNode;
  label?: string;
}) {
  return (
    <div className="civic-filter-toolbar" role="group" aria-label={label}>
      <div className="civic-filter-toolbar__fields">{children}</div>
      {(actions || resultCount !== undefined) && (
        <div className="civic-filter-toolbar__meta">
          {resultCount !== undefined && (
            <span className="civic-filter-toolbar__count" aria-live="polite">
              {resultCount}
            </span>
          )}
          {actions && <div className="civic-filter-toolbar__actions">{actions}</div>}
        </div>
      )}
    </div>
  );
}
export const Table = forwardRef<
  HTMLTableElement,
  TableHTMLAttributes<HTMLTableElement> & { label: string }
>(({ label, className = "", ...props }, ref) => (
  <div
    className="civic-table-scroll"
    role="region"
    aria-label={label}
    tabIndex={0}
  >
    <table {...props} ref={ref} className={`civic-table ${className}`} />
  </div>
));
Table.displayName = "Table";
export function SortableHeader({
  children,
  direction,
  onSort,
  scope = "col",
}: {
  children: ReactNode;
  direction?: "ascending" | "descending";
  onSort: () => void;
  scope?: "col" | "row";
}) {
  const Icon =
    direction === "ascending"
      ? ArrowUp
      : direction === "descending"
        ? ArrowDown
        : ArrowUpDown;
  return (
    <th scope={scope} aria-sort={direction || "none"}>
      <Button onClick={onSort}>
        {children}
        <Icon aria-hidden="true" />
      </Button>
    </th>
  );
}
export function Pagination({
  page,
  pageCount,
  onPageChange,
  label = "Pagination",
  previousLabel = "Previous page",
  nextLabel = "Next page",
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  label?: string;
  previousLabel?: string;
  nextLabel?: string;
}) {
  if (
    !Number.isInteger(pageCount) ||
    pageCount < 1 ||
    !Number.isInteger(page) ||
    page < 1 ||
    page > pageCount
  )
    throw new RangeError(
      "Pagination requires 1 <= page <= pageCount, with integer values",
    );
  return (
    <nav className="civic-pagination" aria-label={label}>
      <IconButton
        label={previousLabel}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft aria-hidden="true" />
      </IconButton>
      <span aria-live="polite">
        {page} / {pageCount}
      </span>
      <IconButton
        label={nextLabel}
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight aria-hidden="true" />
      </IconButton>
    </nav>
  );
}
