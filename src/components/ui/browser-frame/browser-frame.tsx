"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const browserFrameVariantIds = [
  "macos",
  "windows",
  "minimal",
] as const satisfies string[];

export type BrowserFrameVariantId = (typeof browserFrameVariantIds)[number];

export const browserFrameSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies string[];

export type BrowserFrameSizeId = (typeof browserFrameSizeIds)[number];

const browserFrameVariants = cva(
  "flex w-full flex-col overflow-hidden border bg-card text-card-foreground shadow-lg",
  {
    variants: {
      variant: {
        macos: "rounded-xl border-border",
        windows: "rounded-md border-border",
        minimal: "rounded-lg border-border",
      } satisfies Record<BrowserFrameVariantId, string>,
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      } satisfies Record<BrowserFrameSizeId, string>,
    },
    defaultVariants: {
      variant: "macos",
      size: "md",
    },
  },
);

export interface BrowserFrameProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof browserFrameVariants> {
  ref?: Ref<HTMLDivElement>;
}

function BrowserFrame({
  className,
  variant,
  size,
  ref,
  ...props
}: BrowserFrameProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="browser-frame"
      data-variant={variant ?? "macos"}
      data-size={size ?? "md"}
      className={cn(browserFrameVariants({ variant, size }), className)}
      {...props}
    />
  );
}
BrowserFrame.displayName = "BrowserFrame";

const browserFrameHeaderVariants = cva(
  "flex items-center gap-3 border-b bg-muted/60 backdrop-blur-sm",
  {
    variants: {
      variant: {
        macos: "border-border px-3 py-2.5",
        windows: "border-border px-2 py-1.5",
        minimal: "border-border px-3 py-2",
      } satisfies Record<BrowserFrameVariantId, string>,
      size: {
        sm: "min-h-8",
        md: "min-h-10",
        lg: "min-h-12",
      } satisfies Record<BrowserFrameSizeId, string>,
    },
    defaultVariants: {
      variant: "macos",
      size: "md",
    },
  },
);

export interface BrowserFrameHeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof browserFrameHeaderVariants> {
  ref?: Ref<HTMLDivElement>;
}

function BrowserFrameHeader({
  className,
  variant,
  size,
  ref,
  ...props
}: BrowserFrameHeaderProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="browser-frame-header"
      className={cn(browserFrameHeaderVariants({ variant, size }), className)}
      {...props}
    />
  );
}
BrowserFrameHeader.displayName = "BrowserFrameHeader";

export interface BrowserFrameControlsProps extends HTMLAttributes<HTMLDivElement> {
  variant?: BrowserFrameVariantId;
  /**
   * Disable the visual difference between hover/idle dots. When true,
   * the controls render as non-interactive decorations only.
   */
  decorative?: boolean;
  ref?: Ref<HTMLDivElement>;
}

const macosControlColors = [
  {
    label: "Close",
    className: "bg-[#ff5f57] border-[#e0443e]",
  },
  {
    label: "Minimize",
    className: "bg-[#febc2e] border-[#dea123]",
  },
  {
    label: "Maximize",
    className: "bg-[#28c840] border-[#1aab29]",
  },
] as const;

function BrowserFrameControls({
  className,
  variant = "macos",
  decorative = true,
  ref,
  ...props
}: BrowserFrameControlsProps): ReactElement {
  if (variant === "minimal") {
    return (
      <div
        ref={ref}
        data-slot="browser-frame-controls"
        className={cn("flex items-center", className)}
        aria-hidden={decorative ? "true" : undefined}
        {...props}
      />
    );
  }

  if (variant === "windows") {
    return (
      <div
        ref={ref}
        data-slot="browser-frame-controls"
        data-variant="windows"
        className={cn(
          "ml-auto flex items-center gap-0 text-muted-foreground",
          className,
        )}
        aria-hidden={decorative ? "true" : undefined}
        {...props}
      >
        <span className="flex h-6 w-9 items-center justify-center hover:bg-muted">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <path d="M0 5h10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </span>
        <span className="flex h-6 w-9 items-center justify-center hover:bg-muted">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="0.5"
              y="0.5"
              width="9"
              height="9"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </span>
        <span className="flex h-6 w-9 items-center justify-center hover:bg-destructive hover:text-white">
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <path d="M0 0L10 10M10 0L0 10" stroke="currentColor" strokeWidth="1" />
          </svg>
        </span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-slot="browser-frame-controls"
      data-variant="macos"
      className={cn("flex items-center gap-1.5", className)}
      aria-hidden={decorative ? "true" : undefined}
      {...props}
    >
      {macosControlColors.map((control) => (
        <span
          key={control.label}
          aria-label={decorative ? undefined : control.label}
          className={cn(
            "block size-3 rounded-full border",
            control.className,
          )}
        />
      ))}
    </div>
  );
}
BrowserFrameControls.displayName = "BrowserFrameControls";

export interface BrowserFrameNavButtonsProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function BrowserFrameNavButtons({
  className,
  ref,
  ...props
}: BrowserFrameNavButtonsProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="browser-frame-nav-buttons"
      className={cn(
        "flex items-center gap-1 text-muted-foreground",
        className,
      )}
      aria-hidden="true"
      {...props}
    >
      <button
        type="button"
        tabIndex={-1}
        disabled
        className="flex size-6 items-center justify-center rounded-md hover:bg-muted disabled:opacity-50"
        aria-label="Back"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        tabIndex={-1}
        disabled
        className="flex size-6 items-center justify-center rounded-md hover:bg-muted disabled:opacity-50"
        aria-label="Forward"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
          <path
            d="M6 4L10 8L6 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        type="button"
        tabIndex={-1}
        className="flex size-6 items-center justify-center rounded-md hover:bg-muted"
        aria-label="Reload"
      >
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
          <path
            d="M13 8a5 5 0 1 1-1.46-3.54M13 3v3h-3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
BrowserFrameNavButtons.displayName = "BrowserFrameNavButtons";

export interface BrowserFrameAddressBarProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  /**
   * Optional icon (e.g. a lock/globe) rendered at the start of the bar.
   * Defaults to a lock icon for HTTPS-looking URLs, globe otherwise.
   */
  leadingIcon?: ReactNode;
  /**
   * Optional element rendered at the end (e.g. star, share).
   */
  trailingIcon?: ReactNode;
  /**
   * When true, the bar is rendered as a static label rather than an input.
   * This is the default — most usages are decorative.
   */
  readOnly?: boolean;
  ref?: Ref<HTMLInputElement>;
}

function defaultLeadingIcon(value: string | number | readonly string[] | undefined): ReactElement {
  const url = typeof value === "string" ? value : "";
  const isSecure = url.startsWith("https://") || url === "";
  if (isSecure) {
    return (
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
        <rect
          x="3"
          y="7"
          width="10"
          height="7"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path
          d="M5 7V5a3 3 0 1 1 6 0v2"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M2.5 8h11M8 2.5c1.5 1.5 2.5 3.5 2.5 5.5s-1 4-2.5 5.5M8 2.5C6.5 4 5.5 6 5.5 8s1 4 2.5 5.5"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function BrowserFrameAddressBar({
  className,
  value,
  defaultValue,
  leadingIcon,
  trailingIcon,
  readOnly = true,
  ref,
  ...props
}: BrowserFrameAddressBarProps): ReactElement {
  const resolvedLeadingIcon =
    leadingIcon ?? defaultLeadingIcon(value ?? defaultValue);
  return (
    <div
      data-slot="browser-frame-address-bar"
      className={cn(
        "flex min-w-0 flex-1 items-center gap-2 rounded-md border border-border/60 bg-background px-3 py-1 text-muted-foreground",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
        className,
      )}
    >
      {resolvedLeadingIcon ? (
        <span className="flex shrink-0 items-center">{resolvedLeadingIcon}</span>
      ) : null}
      <input
        ref={ref}
        type="text"
        value={value}
        defaultValue={defaultValue}
        readOnly={readOnly}
        className={cn(
          "min-w-0 flex-1 truncate bg-transparent text-foreground/80 outline-none placeholder:text-muted-foreground",
          "selection:bg-primary/20",
          readOnly && "cursor-default",
        )}
        {...props}
      />
      {trailingIcon ? (
        <span className="flex shrink-0 items-center">{trailingIcon}</span>
      ) : null}
    </div>
  );
}
BrowserFrameAddressBar.displayName = "BrowserFrameAddressBar";

export interface BrowserFrameTabsProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function BrowserFrameTabs({
  className,
  ref,
  ...props
}: BrowserFrameTabsProps): ReactElement {
  return (
    <div
      ref={ref}
      role="tablist"
      data-slot="browser-frame-tabs"
      className={cn(
        "flex items-end gap-0.5 border-b border-border bg-muted/40 px-2 pt-1.5",
        className,
      )}
      {...props}
    />
  );
}
BrowserFrameTabs.displayName = "BrowserFrameTabs";

export interface BrowserFrameTabProps
  extends HTMLAttributes<HTMLDivElement> {
  active?: boolean;
  /** Optional favicon node (image, emoji, or svg). */
  favicon?: ReactNode;
  /** When true, shows a close affordance on hover. */
  closable?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function BrowserFrameTab({
  className,
  active = false,
  favicon,
  closable = false,
  children,
  ref,
  ...props
}: BrowserFrameTabProps): ReactElement {
  return (
    <div
      ref={ref}
      role="tab"
      aria-selected={active}
      data-active={active}
      data-slot="browser-frame-tab"
      className={cn(
        "group flex max-w-[14rem] items-center gap-2 rounded-t-md border border-b-0 px-3 py-1.5 text-xs",
        active
          ? "border-border bg-background text-foreground"
          : "border-transparent bg-transparent text-muted-foreground hover:bg-background/40",
        className,
      )}
      {...props}
    >
      {favicon ? (
        <span className="flex size-3.5 shrink-0 items-center justify-center">
          {favicon}
        </span>
      ) : null}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {closable ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close tab"
          className={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-muted",
            active ? "opacity-70" : "opacity-0 group-hover:opacity-70",
          )}
        >
          <svg viewBox="0 0 10 10" className="size-2.5" fill="none" aria-hidden="true">
            <path
              d="M1 1L9 9M9 1L1 9"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
BrowserFrameTab.displayName = "BrowserFrameTab";

export interface BrowserFrameContentProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * When provided, the content area is rendered with a fixed aspect ratio,
   * useful for screenshot embeds. Expressed as `width / height`.
   */
  aspectRatio?: string;
  ref?: Ref<HTMLDivElement>;
}

function BrowserFrameContent({
  className,
  style,
  aspectRatio,
  ref,
  ...props
}: BrowserFrameContentProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="browser-frame-content"
      style={aspectRatio ? { aspectRatio, ...style } : style}
      className={cn(
        "relative flex-1 overflow-hidden bg-background text-foreground",
        className,
      )}
      {...props}
    />
  );
}
BrowserFrameContent.displayName = "BrowserFrameContent";

export {
  BrowserFrame,
  BrowserFrameHeader,
  BrowserFrameControls,
  BrowserFrameNavButtons,
  BrowserFrameAddressBar,
  BrowserFrameTabs,
  BrowserFrameTab,
  BrowserFrameContent,
  browserFrameVariants,
  browserFrameHeaderVariants,
};
