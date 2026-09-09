import {
  forwardRef,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { primary?: boolean }
>(({ primary, className = "", type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={`civic-button ${primary ? "civic-button--primary" : ""} ${className}`}
    {...props}
  />
));
Button.displayName = "Button";
export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { label: string }
>(({ label, className = "", ...props }, ref) => (
  <Button
    ref={ref}
    aria-label={label}
    title={label}
    className={`civic-button--icon ${className}`}
    {...props}
  />
));
IconButton.displayName = "IconButton";
export function Field({
  id,
  label,
  description,
  error,
  children,
}: {
  id: string;
  label: string;
  description?: string;
  error?: string;
  children: (attributes: {
    id: string;
    "aria-describedby"?: string;
    "aria-invalid"?: true;
  }) => ReactNode;
}) {
  const described =
    [description && `${id}-hint`, error && `${id}-error`]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className="civic-field">
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        "aria-describedby": described,
        "aria-invalid": error ? true : undefined,
      })}
      {description && <small id={`${id}-hint`}>{description}</small>}
      {error && (
        <small className="civic-error" id={`${id}-error`}>
          {error}
        </small>
      )}
    </div>
  );
}
export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input ref={ref} className={`civic-input ${className}`} {...props} />
));
Input.displayName = "Input";
export const NativeSelect = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className = "", ...props }, ref) => (
  <div className="civic-select-wrap">
    <select ref={ref} className={`civic-select ${className}`} {...props} />
    <ChevronDown className="civic-chevron" aria-hidden="true" />
  </div>
));
NativeSelect.displayName = "NativeSelect";
