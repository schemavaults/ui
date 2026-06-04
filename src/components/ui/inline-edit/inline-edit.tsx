"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type Ref,
} from "react";
import { Check, Pencil, X } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Spinner } from "../spinner";

export const inlineEditSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type InlineEditSizeId = (typeof inlineEditSizeIds)[number];

export const inlineEditVariantIds = [
  "default",
  "ghost",
  "outline",
] as const satisfies readonly string[];
export type InlineEditVariantId = (typeof inlineEditVariantIds)[number];

const inlineEditDisplayVariants = cva(
  "group/inline-edit inline-flex w-full items-center gap-2 rounded-md border text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-transparent hover:border-input hover:bg-muted/40",
        ghost:
          "border-transparent bg-transparent hover:bg-muted/60",
        outline:
          "border-input bg-background hover:bg-muted/30",
      } satisfies Record<InlineEditVariantId, string>,
      size: {
        sm: "min-h-8 px-2 py-1 text-xs",
        default: "min-h-10 px-3 py-2 text-sm",
        lg: "min-h-11 px-4 py-2.5 text-base",
      } satisfies Record<InlineEditSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const inlineEditInputVariants = cva(
  "w-full flex-1 rounded-md border border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      size: {
        sm: "h-8 px-2 text-xs",
        default: "h-10 px-3 text-sm",
        lg: "h-11 px-4 text-base",
      } satisfies Record<InlineEditSizeId, string>,
      multiline: {
        true: "h-auto min-h-[5rem] py-2 leading-relaxed resize-y",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      multiline: false,
    },
  },
);

const inlineEditActionSizes = {
  sm: "h-7 w-7",
  default: "h-8 w-8",
  lg: "h-9 w-9",
} satisfies Record<InlineEditSizeId, string>;

const inlineEditIconSizes = {
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-4 w-4",
} satisfies Record<InlineEditSizeId, string>;

export interface InlineEditProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "onSubmit">,
    VariantProps<typeof inlineEditDisplayVariants> {
  /** Controlled value. When provided, the component is controlled. */
  value?: string;
  /** Initial value for uncontrolled usage. */
  defaultValue?: string;
  /** Placeholder shown when the value is empty. */
  placeholder?: string;
  /** Render as a textarea instead of a single-line input. */
  multiline?: boolean;
  /** Number of rows when `multiline` is true. */
  rows?: number;
  /** Optional accessible label for the field. */
  label?: string;
  /** Optional input name (forwarded to the underlying input/textarea). */
  name?: string;
  /** Disable interaction entirely. */
  disabled?: boolean;
  /** Show value as read-only — no edit affordance. */
  readOnly?: boolean;
  /** Maximum length forwarded to the input. */
  maxLength?: number;
  /**
   * Synchronous or asynchronous save handler. While the returned promise is
   * pending, the editor stays open and shows a spinner. If the handler throws
   * (or returns a rejected promise) the error message is shown inline and the
   * editor stays in edit mode so the user can correct the value.
   */
  onSave?: (nextValue: string) => void | Promise<void>;
  /** Called when the editor is cancelled (Escape pressed or cancel clicked). */
  onCancel?: () => void;
  /** Optional validator. Return a string to show an error, or null/undefined to pass. */
  validate?: (value: string) => string | null | undefined;
  /** Optional ref to the container element. */
  ref?: Ref<HTMLDivElement>;
}

function InlineEdit({
  value: controlledValue,
  defaultValue,
  placeholder = "Click to add a value",
  multiline = false,
  rows = 3,
  label,
  name,
  disabled = false,
  readOnly = false,
  maxLength,
  variant,
  size,
  onSave,
  onCancel,
  validate,
  className,
  ref,
  ...props
}: InlineEditProps): ReactElement {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? "",
  );
  const value = isControlled ? (controlledValue ?? "") : internalValue;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(value);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const generatedId = useId();
  const inputId = `inline-edit-${generatedId}`;
  const errorId = `${inputId}-error`;
  const resolvedSize: InlineEditSizeId = size ?? "default";

  useEffect((): void => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement) {
        inputRef.current.select();
      } else {
        const length = inputRef.current.value.length;
        inputRef.current.setSelectionRange(length, length);
      }
    }
  }, [isEditing]);

  const enterEditMode = useCallback((): void => {
    if (disabled || readOnly) return;
    setDraft(value);
    setError(null);
    setIsEditing(true);
  }, [disabled, readOnly, value]);

  const exitEditMode = useCallback((): void => {
    setIsEditing(false);
    setError(null);
    setIsSaving(false);
  }, []);

  const handleCancel = useCallback((): void => {
    onCancel?.();
    exitEditMode();
  }, [onCancel, exitEditMode]);

  const handleSave = useCallback(async (): Promise<void> => {
    const trimmedDraft = draft;
    const validationError = validate ? validate(trimmedDraft) : null;
    if (validationError) {
      setError(validationError);
      return;
    }

    if (trimmedDraft === value) {
      exitEditMode();
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const maybePromise = onSave?.(trimmedDraft);
      if (maybePromise instanceof Promise) {
        await maybePromise;
      }
      if (!isControlled) {
        setInternalValue(trimmedDraft);
      }
      exitEditMode();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to save changes.";
      setError(message);
      setIsSaving(false);
    }
  }, [draft, validate, value, onSave, isControlled, exitEditMode]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleCancel();
        return;
      }
      if (event.key === "Enter" && !multiline) {
        event.preventDefault();
        void handleSave();
        return;
      }
      if (event.key === "Enter" && multiline && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        void handleSave();
      }
    },
    [handleCancel, handleSave, multiline],
  );

  const displayValue = value.length > 0 ? value : placeholder;
  const isEmpty = value.length === 0;

  if (isEditing) {
    return (
      <div
        ref={ref}
        data-slot="inline-edit"
        data-state="editing"
        className={cn("flex w-full flex-col gap-1", className)}
        {...props}
      >
        {label ? (
          <label htmlFor={inputId} className="text-xs font-medium text-muted-foreground">
            {label}
          </label>
        ) : null}
        <div className="flex w-full items-start gap-1.5">
          {multiline ? (
            <textarea
              id={inputId}
              ref={(node): void => {
                inputRef.current = node;
              }}
              name={name}
              value={draft}
              rows={rows}
              maxLength={maxLength}
              disabled={isSaving}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              onChange={(event): void => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                inlineEditInputVariants({ size: resolvedSize, multiline: true }),
              )}
            />
          ) : (
            <input
              id={inputId}
              ref={(node): void => {
                inputRef.current = node;
              }}
              type="text"
              name={name}
              value={draft}
              maxLength={maxLength}
              disabled={isSaving}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              onChange={(event): void => setDraft(event.target.value)}
              onKeyDown={handleKeyDown}
              className={cn(
                inlineEditInputVariants({ size: resolvedSize, multiline: false }),
              )}
            />
          )}
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              aria-label="Save changes"
              disabled={isSaving}
              onClick={(): void => {
                void handleSave();
              }}
              className={cn(
                "inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
                inlineEditActionSizes[resolvedSize],
              )}
            >
              {isSaving ? (
                <Spinner className={inlineEditIconSizes[resolvedSize]} />
              ) : (
                <Check className={inlineEditIconSizes[resolvedSize]} />
              )}
            </button>
            <button
              type="button"
              aria-label="Cancel editing"
              disabled={isSaving}
              onClick={handleCancel}
              className={cn(
                "inline-flex items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60",
                inlineEditActionSizes[resolvedSize],
              )}
            >
              <X className={inlineEditIconSizes[resolvedSize]} />
            </button>
          </div>
        </div>
        {error ? (
          <p id={errorId} role="alert" className="text-xs text-destructive">
            {error}
          </p>
        ) : (
          <p className="text-[0.7rem] text-muted-foreground">
            {multiline
              ? "Press ⌘/Ctrl + Enter to save, Esc to cancel"
              : "Press Enter to save, Esc to cancel"}
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-slot="inline-edit"
      data-state="display"
      className={cn("flex w-full flex-col gap-1", className)}
      {...props}
    >
      {label ? (
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      ) : null}
      <button
        type="button"
        data-slot="inline-edit-display"
        data-empty={isEmpty ? "true" : undefined}
        aria-label={
          readOnly
            ? label ?? "Value"
            : `Edit ${label ?? "value"}: ${isEmpty ? "no value set" : value}`
        }
        disabled={disabled}
        aria-disabled={readOnly || undefined}
        onClick={readOnly ? undefined : enterEditMode}
        className={cn(
          inlineEditDisplayVariants({ variant, size }),
          readOnly && "hover:border-transparent hover:bg-transparent cursor-default",
          className,
        )}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate",
            multiline && "whitespace-pre-wrap break-words",
            isEmpty && "italic text-muted-foreground",
          )}
        >
          {displayValue}
        </span>
        {!readOnly && !disabled ? (
          <Pencil
            aria-hidden="true"
            className={cn(
              inlineEditIconSizes[resolvedSize],
              "shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/inline-edit:opacity-100 group-focus-visible/inline-edit:opacity-100",
            )}
          />
        ) : null}
      </button>
    </div>
  );
}
InlineEdit.displayName = "InlineEdit";

export {
  InlineEdit,
  inlineEditDisplayVariants,
  inlineEditInputVariants,
};
