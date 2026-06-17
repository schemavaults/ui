"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Check, Pencil, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  inlineEditSizeIds,
  inlineEditVariantIds,
  type InlineEditSize,
  type InlineEditVariant,
} from "./inline-edit-variants";

const inlineEditDisplayVariants = cva(
  "group/inline-edit inline-flex max-w-full items-center gap-1.5 rounded-md text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60 data-[empty=true]:text-muted-foreground",
  {
    variants: {
      variant: {
        default:
          "border border-transparent hover:border-input data-[interactive=true]:hover:bg-accent/40",
        ghost:
          "border border-transparent data-[interactive=true]:hover:bg-accent/60",
        underline:
          "rounded-none border-b border-dashed border-transparent data-[interactive=true]:hover:border-input data-[interactive=true]:hover:text-foreground",
      } satisfies Record<InlineEditVariant, string>,
      size: {
        sm: "min-h-7 px-1.5 py-0.5 text-xs",
        default: "min-h-9 px-2 py-1 text-sm",
        lg: "min-h-11 px-2.5 py-1.5 text-base",
      } satisfies Record<InlineEditSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const inlineEditInputVariants = cva(
  "w-full bg-transparent text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      } satisfies Record<InlineEditSize, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const inlineEditContainerVariants = cva(
  "inline-flex max-w-full items-stretch gap-1 rounded-md bg-background ring-2 ring-ring ring-offset-2 ring-offset-background",
  {
    variants: {
      size: {
        sm: "min-h-7 px-1.5 py-0.5",
        default: "min-h-9 px-2 py-1",
        lg: "min-h-11 px-2.5 py-1.5",
      } satisfies Record<InlineEditSize, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const inlineEditActionButtonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[role=confirm]:text-emerald-600 data-[role=confirm]:hover:bg-emerald-500/10 data-[role=confirm]:hover:text-emerald-600 data-[role=cancel]:hover:bg-destructive/10 data-[role=cancel]:hover:text-destructive",
  {
    variants: {
      size: {
        sm: "size-5 [&>svg]:size-3",
        default: "size-6 [&>svg]:size-3.5",
        lg: "size-7 [&>svg]:size-4",
      } satisfies Record<InlineEditSize, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export type InlineEditCommitTrigger = "enter" | "blur" | "button";

export interface InlineEditProps
  extends Omit<
      HTMLAttributes<HTMLDivElement>,
      "onChange" | "defaultValue" | "onBlur"
    >,
    VariantProps<typeof inlineEditDisplayVariants> {
  /** The current value to display. */
  value: string;
  /** Called when the user commits a new value (Enter, button, or blur). */
  onValueChange?: (next: string, trigger: InlineEditCommitTrigger) => void;
  /** Called when the user cancels editing (Escape or cancel button). */
  onCancel?: (previous: string) => void;
  /** Optional async save handler. When it rejects, the input stays in edit mode. */
  onSave?: (next: string) => Promise<void> | void;
  /** Placeholder shown when the value is empty. */
  placeholder?: string;
  /** Disables interaction; the value still renders. */
  disabled?: boolean;
  /** Use a multi-line textarea instead of a single-line input. */
  multiline?: boolean;
  /** Show explicit confirm/cancel buttons inside the editor. Defaults to true. */
  showActions?: boolean;
  /** Show a small pencil icon affordance next to the display value. Defaults to true. */
  showEditIcon?: boolean;
  /** Commit the value when the input loses focus. Defaults to true. */
  commitOnBlur?: boolean;
  /** Maximum length for the underlying input. */
  maxLength?: number;
  /** Accessible label for the underlying input. */
  inputAriaLabel?: string;
  /** Accessible label for the confirm button. */
  confirmLabel?: string;
  /** Accessible label for the cancel button. */
  cancelLabel?: string;
  /** Externally controlled error message. Skips committing and keeps edit mode open. */
  error?: string | null;
  /** Externally controlled loading state (e.g. when `onSave` is in flight). */
  loading?: boolean;
  /** Renders the editor open on first mount. */
  defaultEditing?: boolean;
  /** Optional ref forwarded to the outer wrapper. */
  ref?: Ref<HTMLDivElement>;
  /** Optional class names applied to the inner input/textarea element. */
  inputClassName?: string;
  /** Optional renderer for the display state. Receives the resolved label. */
  renderDisplay?: (label: ReactNode, value: string) => ReactNode;
}

function isTextarea(
  el: HTMLInputElement | HTMLTextAreaElement | null,
): el is HTMLTextAreaElement {
  return el?.tagName === "TEXTAREA";
}

export function InlineEdit({
  value,
  onValueChange,
  onCancel,
  onSave,
  placeholder = "Click to edit",
  disabled = false,
  multiline = false,
  showActions = true,
  showEditIcon = true,
  commitOnBlur = true,
  maxLength,
  inputAriaLabel,
  confirmLabel = "Save",
  cancelLabel = "Cancel",
  error: externalError = null,
  loading: externalLoading = false,
  defaultEditing = false,
  variant,
  size,
  className,
  inputClassName,
  renderDisplay,
  ref,
  onClick,
  ...rest
}: InlineEditProps): ReactElement {
  const [editing, setEditing] = useState<boolean>(defaultEditing);
  const [draft, setDraft] = useState<string>(value);
  const [internalLoading, setInternalLoading] = useState<boolean>(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const wasJustOpened = useRef<boolean>(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
  const reactId = useId();
  const errorId = `${reactId}-error`;

  const isLoading = externalLoading || internalLoading;
  const errorMessage = externalError ?? internalError;
  const hasError = errorMessage !== null && errorMessage !== "";

  useEffect((): void => {
    if (!editing) setDraft(value);
  }, [value, editing]);

  useLayoutEffect((): void => {
    if (!editing) return;
    const el = inputRef.current;
    if (el === null) return;
    if (wasJustOpened.current) {
      wasJustOpened.current = false;
      el.focus();
      try {
        const length = el.value.length;
        el.setSelectionRange(length, length);
      } catch {
        // setSelectionRange is unsupported on some input types; ignore.
      }
    }
    if (isTextarea(el)) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [editing, draft]);

  const openEditor = useCallback((): void => {
    if (disabled) return;
    wasJustOpened.current = true;
    setDraft(value);
    setInternalError(null);
    setEditing(true);
  }, [disabled, value]);

  const closeEditor = useCallback((): void => {
    setEditing(false);
    setInternalError(null);
  }, []);

  const commit = useCallback(
    async (trigger: InlineEditCommitTrigger): Promise<void> => {
      if (isLoading) return;
      const next = draft;
      if (next === value) {
        closeEditor();
        return;
      }
      if (onSave === undefined) {
        onValueChange?.(next, trigger);
        closeEditor();
        return;
      }
      setInternalLoading(true);
      try {
        await onSave(next);
        onValueChange?.(next, trigger);
        closeEditor();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to save value";
        setInternalError(message);
      } finally {
        setInternalLoading(false);
      }
    },
    [closeEditor, draft, isLoading, onSave, onValueChange, value],
  );

  const cancel = useCallback((): void => {
    if (isLoading) return;
    setDraft(value);
    onCancel?.(value);
    closeEditor();
  }, [closeEditor, isLoading, onCancel, value]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setDraft(event.target.value);
    if (internalError !== null) setInternalError(null);
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    if (event.key === "Escape") {
      event.preventDefault();
      cancel();
      return;
    }
    if (event.key === "Enter") {
      if (multiline && !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      void commit("enter");
    }
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    if (!commitOnBlur) return;
    const next = event.relatedTarget as Node | null;
    const root = event.currentTarget.closest("[data-slot=inline-edit-editor]");
    if (next !== null && root !== null && root.contains(next)) return;
    void commit("blur");
  };

  const handleDisplayKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
  ): void => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " " || event.key === "F2") {
      event.preventDefault();
      openEditor();
    }
  };

  const isEmpty = value.length === 0;
  const displayLabel: ReactNode = isEmpty ? placeholder : value;

  if (editing) {
    return (
      <div
        ref={ref}
        data-slot="inline-edit"
        data-state="editing"
        className={cn("inline-flex max-w-full flex-col gap-1", className)}
        {...rest}
      >
        <div
          data-slot="inline-edit-editor"
          className={cn(
            inlineEditContainerVariants({ size }),
            hasError && "ring-destructive",
            isLoading && "opacity-80",
          )}
        >
          {multiline ? (
            <textarea
              ref={(el): void => {
                inputRef.current = el;
              }}
              data-slot="inline-edit-input"
              value={draft}
              disabled={isLoading}
              maxLength={maxLength}
              aria-label={inputAriaLabel}
              aria-invalid={hasError || undefined}
              aria-describedby={hasError ? errorId : undefined}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              rows={1}
              className={cn(
                inlineEditInputVariants({ size }),
                "resize-none overflow-hidden",
                inputClassName,
              )}
            />
          ) : (
            <input
              ref={(el): void => {
                inputRef.current = el;
              }}
              type="text"
              data-slot="inline-edit-input"
              value={draft}
              disabled={isLoading}
              maxLength={maxLength}
              aria-label={inputAriaLabel}
              aria-invalid={hasError || undefined}
              aria-describedby={hasError ? errorId : undefined}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              className={cn(inlineEditInputVariants({ size }), inputClassName)}
            />
          )}
          {showActions && (
            <div
              data-slot="inline-edit-actions"
              className="inline-flex shrink-0 items-center gap-0.5"
            >
              <button
                type="button"
                data-role="cancel"
                data-slot="inline-edit-cancel"
                aria-label={cancelLabel}
                disabled={isLoading}
                onClick={cancel}
                className={cn(inlineEditActionButtonVariants({ size }))}
              >
                <X aria-hidden="true" />
              </button>
              <button
                type="button"
                data-role="confirm"
                data-slot="inline-edit-confirm"
                aria-label={confirmLabel}
                disabled={isLoading}
                onClick={(): void => {
                  void commit("button");
                }}
                className={cn(inlineEditActionButtonVariants({ size }))}
              >
                <Check aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
        {hasError && (
          <span
            id={errorId}
            data-slot="inline-edit-error"
            role="alert"
            className="text-xs text-destructive"
          >
            {errorMessage}
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLDivElement> & Ref<HTMLButtonElement>}
      type="button"
      data-slot="inline-edit"
      data-state="idle"
      data-empty={isEmpty || undefined}
      data-disabled={disabled || undefined}
      data-interactive={!disabled || undefined}
      aria-label={inputAriaLabel}
      disabled={disabled}
      onClick={(event): void => {
        onClick?.(
          event as unknown as ReactMouseEvent<HTMLDivElement, MouseEvent>,
        );
        if (event.defaultPrevented) return;
        openEditor();
      }}
      onKeyDown={handleDisplayKeyDown}
      className={cn(
        inlineEditDisplayVariants({ variant, size }),
        "cursor-text text-left",
        className,
      )}
      {...(rest as HTMLAttributes<HTMLButtonElement>)}
    >
      <span
        data-slot="inline-edit-label"
        className={cn(
          "min-w-0 flex-1 truncate",
          multiline && "whitespace-pre-wrap break-words",
        )}
      >
        {renderDisplay !== undefined
          ? renderDisplay(displayLabel, value)
          : displayLabel}
      </span>
      {showEditIcon && !disabled && (
        <Pencil
          aria-hidden="true"
          data-slot="inline-edit-icon"
          className={cn(
            "shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover/inline-edit:opacity-100 group-focus-visible/inline-edit:opacity-100",
            size === "sm" && "size-3",
            (size === "default" || size === undefined || size === null) &&
              "size-3.5",
            size === "lg" && "size-4",
          )}
        />
      )}
    </button>
  );
}
InlineEdit.displayName = "InlineEdit";

export {
  inlineEditDisplayVariants,
  inlineEditInputVariants,
  inlineEditSizeIds,
  inlineEditVariantIds,
};
export type { InlineEditSize, InlineEditVariant };

export default InlineEdit;
