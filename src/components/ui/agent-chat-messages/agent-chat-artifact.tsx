"use client";

import {
  type AnchorHTMLAttributes,
  type ElementType,
  type HTMLAttributes,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
  useId,
} from "react";
import { cva } from "class-variance-authority";
import {
  File as FileIcon,
  FileArchive,
  FileAudio,
  FileCode,
  FileImage,
  FileJson,
  FileSpreadsheet,
  FileText,
  FileVideo,
} from "lucide-react";

import {
  inferAttachmentFileKind,
  type AttachmentCardFileKindId,
} from "@/components/ui/attachment-card";
import { cn } from "@/lib/utils";

const agentChatArtifactIconVariants = cva(
  "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md [&>svg]:size-5",
  {
    variants: {
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
      kind: "generic",
    },
  },
);

const agentChatArtifactKindIcons: Record<AttachmentCardFileKindId, ElementType> =
  {
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

export interface AgentChatArtifactProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "onClick"> {
  /** The artifact's name — usually a file name. Labels the card's open action. */
  title: ReactNode;
  /** Secondary line, e.g. `"CSV · 8 rows"`. */
  description?: ReactNode;
  /**
   * The artifact's kind, which picks its icon and color. Inferred from
   * `fileType`, then from `title` when it's a string with an extension.
   */
  kind?: AttachmentCardFileKindId;
  /** File extension (`"csv"`) or MIME type (`"text/csv"`) used to infer `kind`. */
  fileType?: string;
  /** Replaces the kind icon. */
  icon?: ReactNode;
  /** Thumbnail image shown in place of the icon. */
  previewSrc?: string;
  /**
   * Makes the whole card a button — open a dialog, a side panel, a canvas.
   * Ignored when `href` is set (the link's own click handler instead).
   */
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  /** Makes the whole card a link. */
  href?: string;
  /** Passed to the link when `href` is set. */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  /** Passed to the link when `href` is set. Default with `target="_blank"`: "noopener noreferrer". */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  /**
   * Controls at the card's right edge — download, copy, a menu. They sit
   * above the card's own click target, so clicking them doesn't open it.
   */
  actions?: ReactNode;
  /** Accessible label of the card's open action. Default: the title's text. */
  openLabel?: string;
  /** Disables the card's open action. */
  disabled?: boolean;
  /** Class applied to the icon box. */
  iconClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * A file or artifact the agent produced — a CSV, a report, a code bundle —
 * as a compact card. Give it `onClick` or `href` and the whole card opens it;
 * `actions` add secondary controls alongside.
 */
function AgentChatArtifact({
  title,
  description,
  kind,
  fileType,
  icon,
  previewSrc,
  onClick,
  href,
  target,
  rel,
  actions,
  openLabel,
  disabled = false,
  className,
  iconClassName,
  ref,
  ...props
}: AgentChatArtifactProps): ReactElement {
  const descriptionId = useId();
  const resolvedKind: AttachmentCardFileKindId =
    kind ??
    inferAttachmentFileKind(typeof title === "string" ? title : "", fileType);
  const KindIcon = agentChatArtifactKindIcons[resolvedKind];
  const hasDescription =
    description !== undefined && description !== null && description !== "";
  const isInteractive = !disabled && (href !== undefined || onClick !== undefined);

  // The open action is stretched over the whole card by its `::after`, so
  // the card is one big click target while `actions` stay clickable above it.
  const triggerClassName =
    "min-w-0 rounded-sm text-left font-medium outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring";
  const titleContent = <span className="block truncate">{title}</span>;
  const triggerProps = {
    "data-slot": "agent-chat-artifact-trigger",
    "aria-label": openLabel,
    "aria-describedby": hasDescription ? descriptionId : undefined,
    className: triggerClassName,
  };

  let primary: ReactElement;
  if (href !== undefined && !disabled) {
    primary = (
      <a
        {...triggerProps}
        href={href}
        target={target}
        rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
        onClick={onClick}
      >
        {titleContent}
      </a>
    );
  } else if (onClick !== undefined) {
    primary = (
      <button
        {...triggerProps}
        type="button"
        disabled={disabled}
        onClick={onClick}
      >
        {titleContent}
      </button>
    );
  } else {
    primary = (
      <span className="min-w-0 font-medium">{titleContent}</span>
    );
  }

  return (
    <div
      ref={ref}
      data-slot="agent-chat-artifact"
      data-kind={resolvedKind}
      data-disabled={disabled || undefined}
      className={cn(
        "relative flex w-full max-w-sm items-center gap-3 rounded-lg border bg-card p-3 text-sm text-card-foreground shadow-sm transition-colors",
        isInteractive && "cursor-pointer hover:bg-accent/40",
        disabled && "opacity-60",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          agentChatArtifactIconVariants({ kind: resolvedKind }),
          iconClassName,
        )}
      >
        {previewSrc ? (
          <img
            src={previewSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          icon ?? <KindIcon />
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        {primary}
        {hasDescription ? (
          <span
            id={descriptionId}
            className="truncate text-xs text-muted-foreground"
          >
            {description}
          </span>
        ) : null}
      </span>
      {actions !== undefined ? (
        <div
          data-slot="agent-chat-artifact-actions"
          className="relative z-10 flex shrink-0 items-center gap-1"
        >
          {actions}
        </div>
      ) : null}
    </div>
  );
}
AgentChatArtifact.displayName = "AgentChatArtifact";

export { AgentChatArtifact };
