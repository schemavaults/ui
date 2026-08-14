"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { UploadCloud } from "lucide-react";
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  type DropzoneRejectionReason,
  type DropzoneSize,
  type DropzoneState,
  type DropzoneVariant,
  dropzoneRejectionReasonIds,
  dropzoneSizeIds,
  dropzoneStateIds,
  dropzoneVariantIds,
} from "./dropzone-variants";

const dropzoneVariants = cva(
  "group relative flex w-full cursor-pointer select-none flex-col items-center justify-center gap-2 rounded-lg border text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "border-dashed border-input bg-muted/30 text-muted-foreground hover:bg-muted/50 data-[state=active]:border-primary data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=error]:border-destructive data-[state=error]:bg-destructive/10 data-[state=error]:text-destructive",
        outline:
          "border-solid border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground data-[state=active]:border-primary data-[state=active]:bg-primary/5 data-[state=active]:text-primary data-[state=error]:border-destructive data-[state=error]:bg-destructive/5 data-[state=error]:text-destructive",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=error]:bg-destructive/10 data-[state=error]:text-destructive",
      } satisfies Record<DropzoneVariant, string>,
      size: {
        sm: "min-h-[6rem] p-3 text-xs [&_svg]:size-5",
        default: "min-h-[9rem] p-6 text-sm [&_svg]:size-8",
        lg: "min-h-[12rem] p-8 text-base [&_svg]:size-10",
      } satisfies Record<DropzoneSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface DropzoneRejection {
  file: File;
  reason: DropzoneRejectionReason;
  message: string;
}

export interface DropzoneRenderState {
  state: DropzoneState;
  isDragActive: boolean;
  disabled: boolean;
  openPicker: () => void;
}

export interface DropzoneProps
  extends Omit<
      HTMLAttributes<HTMLDivElement>,
      "onDrop" | "onDragEnter" | "onDragLeave" | "onDragOver" | "children"
    >,
    VariantProps<typeof dropzoneVariants> {
  /**
   * MIME types and/or file extensions the dropzone accepts, forwarded to the
   * hidden `<input type="file">` and used to validate dropped files.
   *
   * Accepts the same syntax as the native `accept` attribute — e.g.
   * `"image/*,.pdf"`, or an array like `["image/png", "image/jpeg", ".webp"]`.
   */
  accept?: string | readonly string[];
  /** Allow selecting more than one file at once. Defaults to `false`. */
  multiple?: boolean;
  /** Maximum number of files that may be accepted per drop. */
  maxFiles?: number;
  /** Maximum accepted file size, in bytes. */
  maxSize?: number;
  /** When true, the dropzone stops responding to drag / click / keyboard. */
  disabled?: boolean;
  /** Text label shown inside the dropzone by the default content renderer. */
  label?: ReactNode;
  /** Secondary hint text shown under the label. */
  hint?: ReactNode;
  /** Icon rendered above the label. Pass `null` to hide the icon entirely. */
  icon?: ReactNode | null;
  /**
   * Fires with the fully-validated result of a drop or picker selection.
   * Prefer this over `onFilesAccepted` / `onFilesRejected` when both sides of
   * the result matter (e.g. surfacing per-file error toasts).
   */
  onDrop?: (accepted: File[], rejected: DropzoneRejection[]) => void;
  /** Fires with just the files that passed validation. */
  onFilesAccepted?: (files: File[]) => void;
  /** Fires with just the files that failed validation. */
  onFilesRejected?: (rejections: DropzoneRejection[]) => void;
  /**
   * Optional render prop that fully replaces the default content
   * (icon + label + hint). Receives the resolved interaction state.
   */
  render?: (state: DropzoneRenderState) => ReactNode;
  /**
   * Optional label describing the field for assistive tech. Falls back to
   * `label` when the label is a string, otherwise a generic description.
   */
  ariaLabel?: string;
  /** Ref forwarded to the outer div. */
  ref?: Ref<HTMLDivElement>;
  /** Ref forwarded to the hidden `<input type="file">`. */
  inputRef?: Ref<HTMLInputElement>;
  /** Overrides the auto-generated id on the hidden `<input type="file">`. */
  inputId?: string;
  /** Additional class names for the hidden `<input type="file">`. */
  inputClassName?: string;
}

function normalizeAccept(
  accept: string | readonly string[] | undefined,
): { attr: string | undefined; entries: string[] } {
  if (accept === undefined) return { attr: undefined, entries: [] };
  const raw = Array.isArray(accept) ? accept : String(accept).split(",");
  const entries = raw
    .map((entry): string => entry.trim().toLowerCase())
    .filter((entry): entry is string => entry.length > 0);
  if (entries.length === 0) return { attr: undefined, entries: [] };
  return { attr: entries.join(","), entries };
}

function matchesAcceptEntry(file: File, entry: string): boolean {
  if (entry.startsWith(".")) {
    return file.name.toLowerCase().endsWith(entry);
  }
  const fileType = (file.type || "").toLowerCase();
  if (!fileType) return false;
  if (entry.endsWith("/*")) {
    const prefix = entry.slice(0, entry.length - 1);
    return fileType.startsWith(prefix);
  }
  return fileType === entry;
}

function isFileAccepted(file: File, acceptEntries: readonly string[]): boolean {
  if (acceptEntries.length === 0) return true;
  return acceptEntries.some((entry): boolean => matchesAcceptEntry(file, entry));
}

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return `${bytes} bytes`;
  const units = ["B", "KB", "MB", "GB", "TB"] as const;
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value = value / 1024;
    unitIndex += 1;
  }
  const rounded = value >= 10 || unitIndex === 0 ? Math.round(value) : Math.round(value * 10) / 10;
  return `${rounded} ${units[unitIndex]}`;
}

function defaultHint(
  multiple: boolean,
  acceptEntries: readonly string[],
  maxSize: number | undefined,
): string {
  const parts: string[] = [];
  parts.push(multiple ? "Drop files here or click to browse" : "Drop a file here or click to browse");
  if (acceptEntries.length > 0) {
    parts.push(`Accepts ${acceptEntries.join(", ")}`);
  }
  if (maxSize !== undefined) {
    parts.push(`Up to ${formatBytes(maxSize)}${multiple ? " each" : ""}`);
  }
  return parts.join(" · ");
}

function Dropzone({
  ref,
  inputRef,
  inputId,
  inputClassName,
  className,
  variant,
  size,
  accept,
  multiple = false,
  maxFiles,
  maxSize,
  disabled = false,
  label,
  hint,
  icon,
  onDrop,
  onFilesAccepted,
  onFilesRejected,
  render,
  ariaLabel,
  onClick,
  onKeyDown,
  ...props
}: DropzoneProps): ReactElement {
  const generatedId = useId();
  const resolvedInputId = inputId ?? `${generatedId}-dropzone-input`;
  const internalInputRef = useRef<HTMLInputElement>(null);

  const [isDragActive, setIsDragActive] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  // Some browsers fire dragenter/dragleave on descendants as the pointer moves
  // across the dropzone; a counter is the standard fix so we don't flicker.
  const dragDepthRef = useRef<number>(0);

  const { attr: acceptAttr, entries: acceptEntries } = useMemo(
    (): { attr: string | undefined; entries: string[] } => normalizeAccept(accept),
    [accept],
  );

  const setInputRef = useCallback(
    (node: HTMLInputElement | null): void => {
      internalInputRef.current = node;
      if (typeof inputRef === "function") {
        inputRef(node);
      } else if (inputRef && typeof inputRef === "object") {
        (inputRef as { current: HTMLInputElement | null }).current = node;
      }
    },
    [inputRef],
  );

  const openPicker = useCallback((): void => {
    if (disabled) return;
    const input = internalInputRef.current;
    if (!input) return;
    // Reset the value first so re-selecting the same file still fires change.
    input.value = "";
    input.click();
  }, [disabled]);

  const processFiles = useCallback(
    (fileList: FileList | File[] | null): void => {
      if (disabled) return;
      const source = fileList ? Array.from(fileList) : [];
      if (source.length === 0) return;

      const accepted: File[] = [];
      const rejected: DropzoneRejection[] = [];

      const overCapacity: File[] = [];
      let capacityRemaining = multiple
        ? (maxFiles ?? Number.POSITIVE_INFINITY)
        : 1;

      for (const file of source) {
        if (capacityRemaining <= 0) {
          overCapacity.push(file);
          continue;
        }
        if (maxSize !== undefined && file.size > maxSize) {
          rejected.push({
            file,
            reason: "file-too-large",
            message: `File is larger than ${formatBytes(maxSize)}`,
          });
          continue;
        }
        if (!isFileAccepted(file, acceptEntries)) {
          rejected.push({
            file,
            reason: "file-invalid-type",
            message:
              acceptEntries.length > 0
                ? `File type not accepted (expected ${acceptEntries.join(", ")})`
                : "File type not accepted",
          });
          continue;
        }
        accepted.push(file);
        capacityRemaining -= 1;
      }

      for (const file of overCapacity) {
        rejected.push({
          file,
          reason: "too-many-files",
          message: multiple
            ? maxFiles !== undefined
              ? `Only ${maxFiles} file${maxFiles === 1 ? "" : "s"} can be uploaded at once`
              : "Too many files"
            : "Only one file can be uploaded",
        });
      }

      setHasError(accepted.length === 0 && rejected.length > 0);

      onDrop?.(accepted, rejected);
      if (accepted.length > 0) onFilesAccepted?.(accepted);
      if (rejected.length > 0) onFilesRejected?.(rejected);
    },
    [acceptEntries, disabled, maxFiles, maxSize, multiple, onDrop, onFilesAccepted, onFilesRejected],
  );

  const handleDragEnter = useCallback(
    (event: DragEvent<HTMLDivElement>): void => {
      if (disabled) return;
      event.preventDefault();
      event.stopPropagation();
      dragDepthRef.current += 1;
      if (event.dataTransfer?.types?.includes("Files")) {
        setIsDragActive(true);
        setHasError(false);
      }
    },
    [disabled],
  );

  const handleDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>): void => {
      if (disabled) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "copy";
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback(
    (event: DragEvent<HTMLDivElement>): void => {
      if (disabled) return;
      event.preventDefault();
      event.stopPropagation();
      dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
      if (dragDepthRef.current === 0) setIsDragActive(false);
    },
    [disabled],
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>): void => {
      if (disabled) return;
      event.preventDefault();
      event.stopPropagation();
      dragDepthRef.current = 0;
      setIsDragActive(false);
      const files = event.dataTransfer?.files ?? null;
      processFiles(files);
    },
    [disabled, processFiles],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      processFiles(event.target.files);
    },
    [processFiles],
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLDivElement>): void => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      if (disabled) return;
      openPicker();
    },
    [disabled, onClick, openPicker],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (disabled) return;
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        openPicker();
      }
    },
    [disabled, onKeyDown, openPicker],
  );

  const state: DropzoneState = disabled
    ? "disabled"
    : isDragActive
      ? "active"
      : hasError
        ? "error"
        : "idle";

  const resolvedLabel = label ?? (multiple ? "Drop files to upload" : "Drop a file to upload");
  const resolvedHint = hint ?? defaultHint(multiple, acceptEntries, maxSize);
  const resolvedIcon = icon === undefined ? <UploadCloud aria-hidden="true" /> : icon;
  const resolvedAriaLabel =
    ariaLabel ?? (typeof resolvedLabel === "string" ? resolvedLabel : "File dropzone");

  const renderState: DropzoneRenderState = {
    state,
    isDragActive,
    disabled,
    openPicker,
  };

  return (
    <div
      ref={ref}
      data-slot="dropzone"
      data-state={state}
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      aria-label={resolvedAriaLabel}
      aria-describedby={typeof resolvedHint === "string" ? `${resolvedInputId}-hint` : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(dropzoneVariants({ variant, size }), className)}
      {...props}
    >
      {render ? (
        render(renderState)
      ) : (
        <>
          {resolvedIcon !== null ? (
            <span
              data-slot="dropzone-icon"
              className="flex items-center justify-center text-current transition-transform group-data-[state=active]:scale-110"
            >
              {resolvedIcon}
            </span>
          ) : null}
          <span
            data-slot="dropzone-label"
            className="font-medium text-foreground group-data-[state=active]:text-primary group-data-[state=error]:text-destructive group-data-[state=disabled]:text-muted-foreground"
          >
            {resolvedLabel}
          </span>
          {resolvedHint ? (
            <span
              id={typeof resolvedHint === "string" ? `${resolvedInputId}-hint` : undefined}
              data-slot="dropzone-hint"
              className="text-xs text-muted-foreground"
            >
              {resolvedHint}
            </span>
          ) : null}
        </>
      )}
      <input
        ref={setInputRef}
        id={resolvedInputId}
        type="file"
        accept={acceptAttr}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        tabIndex={-1}
        aria-hidden="true"
        className={cn("sr-only", inputClassName)}
      />
    </div>
  );
}
Dropzone.displayName = "Dropzone";

export {
  Dropzone,
  dropzoneVariants,
  dropzoneVariantIds,
  dropzoneSizeIds,
  dropzoneStateIds,
  dropzoneRejectionReasonIds,
};
export type {
  DropzoneVariant,
  DropzoneSize,
  DropzoneState,
  DropzoneRejectionReason,
};

export default Dropzone;
