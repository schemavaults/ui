"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertCircle,
  Check,
  Download,
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileVideo,
  RotateCw,
  X,
} from "lucide-react";
import {
  type AnchorHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

export const attachmentCardVariantIds = [
  "default",
  "muted",
  "outline",
  "ghost",
] as const satisfies readonly string[];
export type AttachmentCardVariantId =
  (typeof attachmentCardVariantIds)[number];

export const attachmentCardSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type AttachmentCardSizeId = (typeof attachmentCardSizeIds)[number];

export const attachmentCardStatusIds = [
  "idle",
  "uploading",
  "error",
  "complete",
] as const satisfies readonly string[];
export type AttachmentCardStatusId =
  (typeof attachmentCardStatusIds)[number];

export const attachmentCardFileKindIds = [
  "image",
  "video",
  "audio",
  "text",
  "code",
  "archive",
  "spreadsheet",
  "json",
  "pdf",
  "generic",
] as const satisfies readonly string[];
export type AttachmentCardFileKindId =
  (typeof attachmentCardFileKindIds)[number];

export const attachmentCardVariants = cva(
  "group/attachment relative flex w-full items-center gap-3 overflow-hidden rounded-lg text-left transition-colors",
  {
    variants: {
      variant: {
        default:
          "border border-border bg-card text-card-foreground hover:bg-accent/40",
        muted:
          "border border-transparent bg-muted/60 text-foreground hover:bg-muted",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-accent/30",
        ghost:
          "border border-transparent bg-transparent text-foreground hover:bg-accent/30",
      } satisfies Record<AttachmentCardVariantId, string>,
      size: {
        sm: "p-2 text-xs gap-2.5",
        md: "p-3 text-sm gap-3",
        lg: "p-4 text-base gap-4",
      } satisfies Record<AttachmentCardSizeId, string>,
      interactive: {
        true: "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        false: "",
      },
      status: {
        idle: "",
        uploading: "",
        error:
          "border-destructive/60 bg-destructive/5 hover:bg-destructive/10 dark:bg-destructive/10",
        complete: "",
      } satisfies Record<AttachmentCardStatusId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      interactive: false,
      status: "idle",
    },
  },
);

const iconBoxVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md",
  {
    variants: {
      size: {
        sm: "size-8 [&>svg]:size-4",
        md: "size-10 [&>svg]:size-5",
        lg: "size-12 [&>svg]:size-6",
      } satisfies Record<AttachmentCardSizeId, string>,
      kind: {
        image: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
        video: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
        audio: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
        text: "bg-muted text-muted-foreground",
        code: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        archive: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
        spreadsheet:
          "bg-lime-500/10 text-lime-700 dark:bg-lime-500/15 dark:text-lime-300",
        json: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
        pdf: "bg-red-500/10 text-red-600 dark:text-red-400",
        generic: "bg-muted text-muted-foreground",
      } satisfies Record<AttachmentCardFileKindId, string>,
    },
    defaultVariants: {
      size: "md",
      kind: "generic",
    },
  },
);

const KIND_ICONS: Record<AttachmentCardFileKindId, ElementType> = {
  image: FileImage,
  video: FileVideo,
  audio: FileAudio,
  text: FileText,
  code: FileCode,
  archive: FileArchive,
  spreadsheet: FileSpreadsheet,
  json: FileJson,
  pdf: FileText,
  generic: FileIcon,
};

const EXTENSION_TO_KIND: Record<string, AttachmentCardFileKindId> = {
  // images
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  avif: "image",
  heic: "image",
  bmp: "image",
  tiff: "image",
  ico: "image",
  // video
  mp4: "video",
  mov: "video",
  webm: "video",
  avi: "video",
  mkv: "video",
  m4v: "video",
  // audio
  mp3: "audio",
  wav: "audio",
  flac: "audio",
  ogg: "audio",
  m4a: "audio",
  aac: "audio",
  opus: "audio",
  // pdf
  pdf: "pdf",
  // text / docs
  txt: "text",
  md: "text",
  markdown: "text",
  rtf: "text",
  doc: "text",
  docx: "text",
  odt: "text",
  // code
  js: "code",
  mjs: "code",
  cjs: "code",
  ts: "code",
  tsx: "code",
  jsx: "code",
  py: "code",
  rb: "code",
  go: "code",
  rs: "code",
  java: "code",
  kt: "code",
  swift: "code",
  c: "code",
  cc: "code",
  cpp: "code",
  cxx: "code",
  h: "code",
  hpp: "code",
  cs: "code",
  php: "code",
  sh: "code",
  bash: "code",
  zsh: "code",
  fish: "code",
  sql: "code",
  html: "code",
  htm: "code",
  css: "code",
  scss: "code",
  less: "code",
  vue: "code",
  svelte: "code",
  xml: "code",
  yaml: "code",
  yml: "code",
  toml: "code",
  // archives
  zip: "archive",
  tar: "archive",
  gz: "archive",
  tgz: "archive",
  bz2: "archive",
  rar: "archive",
  "7z": "archive",
  xz: "archive",
  // spreadsheets
  csv: "spreadsheet",
  tsv: "spreadsheet",
  xls: "spreadsheet",
  xlsx: "spreadsheet",
  ods: "spreadsheet",
  numbers: "spreadsheet",
  // json
  json: "json",
  jsonc: "json",
  ndjson: "json",
  json5: "json",
};

function extensionFromName(name: string): string | null {
  const lastDot = name.lastIndexOf(".");
  if (lastDot < 0 || lastDot === name.length - 1) return null;
  return name.slice(lastDot + 1).toLowerCase();
}

function kindFromMimeType(mime: string): AttachmentCardFileKindId {
  const lower = mime.toLowerCase();
  if (lower.startsWith("image/")) return "image";
  if (lower.startsWith("video/")) return "video";
  if (lower.startsWith("audio/")) return "audio";
  if (lower === "application/pdf") return "pdf";
  if (lower === "application/json" || lower.endsWith("+json")) return "json";
  if (
    lower === "application/zip" ||
    lower === "application/x-tar" ||
    lower === "application/gzip" ||
    lower === "application/x-7z-compressed" ||
    lower === "application/x-rar-compressed" ||
    lower === "application/x-bzip2"
  ) {
    return "archive";
  }
  if (
    lower === "text/csv" ||
    lower === "text/tab-separated-values" ||
    lower === "application/vnd.ms-excel" ||
    lower.startsWith("application/vnd.openxmlformats-officedocument.spreadsheet")
  ) {
    return "spreadsheet";
  }
  if (
    lower.startsWith("text/") &&
    (lower === "text/html" ||
      lower === "text/css" ||
      lower === "text/javascript" ||
      lower === "text/x-python" ||
      lower === "text/x-c" ||
      lower === "text/x-c++" ||
      lower === "text/x-java-source")
  ) {
    return "code";
  }
  if (lower.startsWith("text/")) return "text";
  return "generic";
}

/**
 * Infer the file kind (used for icon + colour) from an explicit `fileType`
 * (extension or MIME type) or, as a fallback, from the extension of `name`.
 */
export function inferAttachmentFileKind(
  name: string,
  fileType?: string,
): AttachmentCardFileKindId {
  if (fileType) {
    const trimmed = fileType.trim().toLowerCase();
    if (trimmed.includes("/")) return kindFromMimeType(trimmed);
    const stripped = trimmed.startsWith(".") ? trimmed.slice(1) : trimmed;
    if (EXTENSION_TO_KIND[stripped]) return EXTENSION_TO_KIND[stripped]!;
  }
  const ext = extensionFromName(name);
  if (ext && EXTENSION_TO_KIND[ext]) return EXTENSION_TO_KIND[ext]!;
  return "generic";
}

const BYTE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB"] as const;

/**
 * Format a byte count as a human-readable string using 1024-based units.
 * `0` renders as `"0 B"`; negative values are clamped to `0`.
 */
export function formatBytes(bytes: number, fractionDigits: number = 1): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const exp = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1,
  );
  const value = bytes / Math.pow(1024, exp);
  const unit = BYTE_UNITS[exp]!;
  const rounded =
    exp === 0
      ? value.toFixed(0)
      : value >= 100
      ? value.toFixed(0)
      : value.toFixed(fractionDigits);
  return `${rounded} ${unit}`;
}

export interface AttachmentCardProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    Omit<VariantProps<typeof attachmentCardVariants>, "interactive"> {
  /** File name (shown as the primary label). Required. */
  name: string;
  /** File size in bytes. Rendered with {@link formatBytes}. */
  bytes?: number;
  /** File extension (e.g. `"pdf"`) or MIME type (e.g. `"image/png"`). Used to pick the icon and colour. */
  fileType?: string;
  /** Explicit override of the inferred file kind. */
  kind?: AttachmentCardFileKindId;
  /** Secondary line rendered under the file name (e.g. uploader, timestamp). */
  description?: ReactNode;
  /** URL for an image preview shown in place of the file icon. Ignored on error. */
  previewSrc?: string;
  /** Optional href — makes the file name a link. */
  href?: string;
  /** Passed through to the underlying `<a>` when `href` is set. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  /** Passed through to the underlying `<a>` when `href` is set. */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  /** Passed through to the underlying `<a>` when `href` is set. */
  download?: AnchorHTMLAttributes<HTMLAnchorElement>["download"];
  /** Upload/processing progress from 0-100. Only rendered when `status === "uploading"`. */
  progress?: number;
  /** Lifecycle state. `"error"` applies a destructive treatment; `"uploading"` shows the progress bar. */
  status?: AttachmentCardStatusId;
  /** Error message shown under the file name when `status === "error"`. */
  errorMessage?: ReactNode;
  /** Override the icon inside the icon box. */
  icon?: ReactNode;
  /** Right-side slot for custom actions (buttons, menus, etc.). */
  actions?: ReactNode;
  /** Convenience remove button rendered at the far right. Overridden by `actions`. */
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Label for the remove button (defaults to `"Remove {name}"`). */
  removeLabel?: string;
  /** Convenience retry button rendered when `status === "error"`. */
  onRetry?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Label for the retry button (defaults to `"Retry {name}"`). */
  retryLabel?: string;
  /** Convenience download button rendered when `href` is set. */
  showDownloadButton?: boolean;
  /** Label for the download button (defaults to `"Download {name}"`). */
  downloadLabel?: string;
  /** Extra classes for the icon box wrapper. */
  iconClassName?: string;
  /** Extra classes for the file name element. */
  nameClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

const meterHeightBySize: Record<AttachmentCardSizeId, string> = {
  sm: "h-1",
  md: "h-1.5",
  lg: "h-2",
};

const secondaryTextBySize: Record<AttachmentCardSizeId, string> = {
  sm: "text-[0.7rem]",
  md: "text-xs",
  lg: "text-sm",
};

const actionButtonSizeBySize: Record<AttachmentCardSizeId, string> = {
  sm: "size-6 [&>svg]:size-3",
  md: "size-7 [&>svg]:size-3.5",
  lg: "size-8 [&>svg]:size-4",
};

function AttachmentCard({
  name,
  bytes,
  fileType,
  kind,
  description,
  previewSrc,
  href,
  target,
  rel,
  download,
  progress,
  status = "idle",
  errorMessage,
  icon,
  actions,
  onRemove,
  removeLabel,
  onRetry,
  retryLabel,
  showDownloadButton = false,
  downloadLabel,
  variant,
  size,
  className,
  iconClassName,
  nameClassName,
  ref,
  ...props
}: AttachmentCardProps): ReactElement {
  const resolvedSize: AttachmentCardSizeId = size ?? "md";
  const resolvedKind: AttachmentCardFileKindId =
    kind ?? inferAttachmentFileKind(name, fileType);
  const KindIcon: ElementType = KIND_ICONS[resolvedKind];
  const isUploading: boolean = status === "uploading";
  const isError: boolean = status === "error";
  const isComplete: boolean = status === "complete";
  const showPreview: boolean = Boolean(previewSrc) && !isError;

  const clampedProgress: number | undefined =
    typeof progress === "number" && Number.isFinite(progress)
      ? Math.max(0, Math.min(100, progress))
      : undefined;
  const progressText: string | null =
    isUploading && clampedProgress !== undefined
      ? `${Math.round(clampedProgress)}%`
      : null;

  const sizeText: string | null =
    typeof bytes === "number" && Number.isFinite(bytes) && bytes >= 0
      ? formatBytes(bytes)
      : null;

  const secondaryChips: ReactNode[] = [];
  if (sizeText) {
    secondaryChips.push(
      <span
        key="size"
        data-slot="attachment-card-size"
        className="tabular-nums"
      >
        {sizeText}
      </span>,
    );
  }
  if (progressText) {
    secondaryChips.push(
      <span
        key="progress"
        data-slot="attachment-card-progress-text"
        className="tabular-nums text-primary"
      >
        {progressText}
      </span>,
    );
  }
  if (description !== undefined && description !== null && description !== "") {
    secondaryChips.push(
      <span
        key="description"
        data-slot="attachment-card-description"
        className="truncate"
      >
        {description}
      </span>,
    );
  }

  const NameTag: ElementType = href ? "a" : "span";
  const nameProps = href
    ? {
        href,
        target,
        rel: rel ?? (target === "_blank" ? "noopener noreferrer" : undefined),
        download,
        className: cn(
          "truncate font-medium text-foreground outline-none hover:underline focus-visible:underline focus-visible:ring-2 focus-visible:ring-ring rounded-sm",
          nameClassName,
        ),
      }
    : {
        className: cn("truncate font-medium text-foreground", nameClassName),
      };

  const showDefaultRemove: boolean = onRemove !== undefined && actions === undefined;
  const showDefaultRetry: boolean = isError && onRetry !== undefined;
  const showDefaultDownload: boolean =
    showDownloadButton && href !== undefined && !isError && !isUploading;

  return (
    <div
      ref={ref}
      data-slot="attachment-card"
      data-status={status}
      data-kind={resolvedKind}
      role="group"
      aria-label={name}
      className={cn(
        attachmentCardVariants({
          variant,
          size: resolvedSize,
          status,
          interactive: false,
        }),
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        data-slot="attachment-card-icon"
        className={cn(
          iconBoxVariants({ size: resolvedSize, kind: resolvedKind }),
          iconClassName,
        )}
      >
        {showPreview ? (
          <img
            src={previewSrc}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        ) : icon ? (
          icon
        ) : (
          <KindIcon aria-hidden="true" />
        )}
        {isComplete && (
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-card [&>svg]:size-2.5"
          >
            <Check aria-hidden="true" />
          </span>
        )}
        {isError && (
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -right-0.5 flex size-3.5 items-center justify-center rounded-full bg-destructive text-destructive-foreground ring-2 ring-card [&>svg]:size-2.5"
          >
            <AlertCircle aria-hidden="true" />
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2">
          <NameTag data-slot="attachment-card-name" {...nameProps}>
            {name}
          </NameTag>
        </div>
        {isError && errorMessage ? (
          <p
            data-slot="attachment-card-error"
            className={cn(
              "truncate text-destructive",
              secondaryTextBySize[resolvedSize],
            )}
          >
            {errorMessage}
          </p>
        ) : secondaryChips.length > 0 ? (
          <p
            data-slot="attachment-card-meta"
            className={cn(
              "flex min-w-0 items-center gap-1.5 text-muted-foreground",
              secondaryTextBySize[resolvedSize],
            )}
          >
            {secondaryChips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex min-w-0 items-center gap-1.5"
              >
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="inline-block size-0.5 shrink-0 rounded-full bg-current opacity-50"
                  />
                )}
                {chip}
              </span>
            ))}
          </p>
        ) : null}
        {isUploading && (
          <div
            role="progressbar"
            aria-label={`Uploading ${name}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={
              clampedProgress !== undefined ? Math.round(clampedProgress) : undefined
            }
            aria-valuetext={progressText ?? undefined}
            data-slot="attachment-card-progress"
            className={cn(
              "mt-1 w-full overflow-hidden rounded-full bg-muted",
              meterHeightBySize[resolvedSize],
            )}
          >
            <div
              className={cn(
                "h-full rounded-full bg-primary transition-[width]",
                clampedProgress === undefined && "w-1/3 animate-pulse",
              )}
              style={
                clampedProgress !== undefined
                  ? { width: `${clampedProgress}%` }
                  : undefined
              }
            />
          </div>
        )}
      </div>

      {(actions ||
        showDefaultRetry ||
        showDefaultDownload ||
        showDefaultRemove) && (
        <div
          data-slot="attachment-card-actions"
          className="ml-auto flex shrink-0 items-center gap-1"
        >
          {actions}
          {showDefaultRetry && (
            <button
              type="button"
              onClick={onRetry}
              aria-label={retryLabel ?? `Retry ${name}`}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                actionButtonSizeBySize[resolvedSize],
              )}
            >
              <RotateCw aria-hidden="true" />
            </button>
          )}
          {showDefaultDownload && (
            <a
              href={href}
              target={target}
              rel={
                rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)
              }
              download={download}
              aria-label={downloadLabel ?? `Download ${name}`}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                actionButtonSizeBySize[resolvedSize],
              )}
            >
              <Download aria-hidden="true" />
            </a>
          )}
          {showDefaultRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label={removeLabel ?? `Remove ${name}`}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                actionButtonSizeBySize[resolvedSize],
              )}
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
AttachmentCard.displayName = "AttachmentCard";

export interface AttachmentCardListProps
  extends HTMLAttributes<HTMLUListElement> {
  ref?: Ref<HTMLUListElement>;
}

/**
 * Convenience list wrapper for stacking multiple `AttachmentCard`s. Uses
 * an unordered list under the hood so the collection is announced as a
 * list to assistive tech; each direct child is wrapped in an `<li>`.
 */
function AttachmentCardList({
  className,
  children,
  ref,
  ...props
}: AttachmentCardListProps): ReactElement {
  const childArray = Array.isArray(children) ? children : [children];
  return (
    <ul
      ref={ref}
      data-slot="attachment-card-list"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {childArray.map((child, index) => (
        <li key={index} className="w-full">
          {child}
        </li>
      ))}
    </ul>
  );
}
AttachmentCardList.displayName = "AttachmentCardList";

export { AttachmentCard, AttachmentCardList };
