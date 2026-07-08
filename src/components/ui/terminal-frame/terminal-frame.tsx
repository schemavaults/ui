"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";

export const terminalFrameVariantIds = [
  "macos",
  "windows",
  "minimal",
] as const satisfies string[];

export type TerminalFrameVariantId = (typeof terminalFrameVariantIds)[number];

export const terminalFrameSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies string[];

export type TerminalFrameSizeId = (typeof terminalFrameSizeIds)[number];

export const terminalFrameThemeIds = [
  "default",
  "dark",
  "matrix",
  "amber",
] as const satisfies string[];

export type TerminalFrameThemeId = (typeof terminalFrameThemeIds)[number];

const terminalFrameVariants = cva(
  "flex w-full flex-col overflow-hidden border shadow-lg font-mono",
  {
    variants: {
      variant: {
        macos: "rounded-xl border-border",
        windows: "rounded-md border-border",
        minimal: "rounded-lg border-border",
      } satisfies Record<TerminalFrameVariantId, string>,
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      } satisfies Record<TerminalFrameSizeId, string>,
      theme: {
        default: "bg-card text-card-foreground",
        dark: "border-zinc-800 bg-zinc-950 text-zinc-100",
        matrix: "border-emerald-900 bg-black text-emerald-400",
        amber: "border-amber-900/60 bg-[#1a0f00] text-amber-300",
      } satisfies Record<TerminalFrameThemeId, string>,
    },
    defaultVariants: {
      variant: "macos",
      size: "md",
      theme: "default",
    },
  },
);

export interface TerminalFrameProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof terminalFrameVariants> {
  ref?: Ref<HTMLDivElement>;
}

function TerminalFrame({
  className,
  variant,
  size,
  theme,
  ref,
  ...props
}: TerminalFrameProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="terminal-frame"
      data-variant={variant ?? "macos"}
      data-size={size ?? "md"}
      data-theme={theme ?? "default"}
      className={cn(terminalFrameVariants({ variant, size, theme }), className)}
      {...props}
    />
  );
}
TerminalFrame.displayName = "TerminalFrame";

const terminalFrameHeaderVariants = cva(
  "flex items-center gap-3 border-b backdrop-blur-sm",
  {
    variants: {
      variant: {
        macos: "px-3 py-2.5",
        windows: "px-2 py-1.5",
        minimal: "px-3 py-2",
      } satisfies Record<TerminalFrameVariantId, string>,
      size: {
        sm: "min-h-8",
        md: "min-h-10",
        lg: "min-h-12",
      } satisfies Record<TerminalFrameSizeId, string>,
      theme: {
        default: "border-border bg-muted/60 text-muted-foreground",
        dark: "border-zinc-800 bg-zinc-900/70 text-zinc-400",
        matrix: "border-emerald-900 bg-emerald-950/50 text-emerald-500/80",
        amber: "border-amber-900/60 bg-[#241300] text-amber-400/80",
      } satisfies Record<TerminalFrameThemeId, string>,
    },
    defaultVariants: {
      variant: "macos",
      size: "md",
      theme: "default",
    },
  },
);

export interface TerminalFrameHeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof terminalFrameHeaderVariants> {
  ref?: Ref<HTMLDivElement>;
}

function TerminalFrameHeader({
  className,
  variant,
  size,
  theme,
  ref,
  ...props
}: TerminalFrameHeaderProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="terminal-frame-header"
      className={cn(
        terminalFrameHeaderVariants({ variant, size, theme }),
        className,
      )}
      {...props}
    />
  );
}
TerminalFrameHeader.displayName = "TerminalFrameHeader";

export interface TerminalFrameControlsProps
  extends HTMLAttributes<HTMLDivElement> {
  variant?: TerminalFrameVariantId;
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

function TerminalFrameControls({
  className,
  variant = "macos",
  decorative = true,
  ref,
  ...props
}: TerminalFrameControlsProps): ReactElement {
  if (variant === "minimal") {
    return (
      <div
        ref={ref}
        data-slot="terminal-frame-controls"
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
        data-slot="terminal-frame-controls"
        data-variant="windows"
        className={cn("ml-auto flex items-center gap-0", className)}
        aria-hidden={decorative ? "true" : undefined}
        {...props}
      >
        <span className="flex h-6 w-9 items-center justify-center hover:bg-white/10">
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
        <span className="flex h-6 w-9 items-center justify-center hover:bg-white/10">
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
            <path
              d="M0 0L10 10M10 0L0 10"
              stroke="currentColor"
              strokeWidth="1"
            />
          </svg>
        </span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      data-slot="terminal-frame-controls"
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
TerminalFrameControls.displayName = "TerminalFrameControls";

export interface TerminalFrameTitleProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Optional icon rendered before the title text (e.g. a shell glyph).
   */
  leadingIcon?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function TerminalFrameTitle({
  className,
  leadingIcon,
  children,
  ref,
  ...props
}: TerminalFrameTitleProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="terminal-frame-title"
      className={cn(
        "flex min-w-0 flex-1 items-center justify-center gap-2 truncate text-center",
        className,
      )}
      {...props}
    >
      {leadingIcon ? (
        <span className="flex shrink-0 items-center">{leadingIcon}</span>
      ) : null}
      <span className="truncate">{children}</span>
    </div>
  );
}
TerminalFrameTitle.displayName = "TerminalFrameTitle";

const terminalFrameBodyVariants = cva(
  "relative flex-1 overflow-auto whitespace-pre-wrap break-words leading-relaxed",
  {
    variants: {
      size: {
        sm: "gap-1 px-3 py-2",
        md: "gap-1.5 px-4 py-3",
        lg: "gap-2 px-5 py-4",
      } satisfies Record<TerminalFrameSizeId, string>,
      theme: {
        default: "bg-background text-foreground",
        dark: "bg-zinc-950 text-zinc-100",
        matrix: "bg-black text-emerald-400",
        amber: "bg-[#1a0f00] text-amber-300",
      } satisfies Record<TerminalFrameThemeId, string>,
    },
    defaultVariants: {
      size: "md",
      theme: "default",
    },
  },
);

export interface TerminalFrameBodyProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof terminalFrameBodyVariants> {
  ref?: Ref<HTMLDivElement>;
}

function TerminalFrameBody({
  className,
  size,
  theme,
  ref,
  ...props
}: TerminalFrameBodyProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="terminal-frame-body"
      className={cn(
        "flex flex-col",
        terminalFrameBodyVariants({ size, theme }),
        className,
      )}
      {...props}
    />
  );
}
TerminalFrameBody.displayName = "TerminalFrameBody";

export interface TerminalFramePromptProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * The prompt symbol or full prompt string rendered before the command.
   * Defaults to `$`. Common alternatives: `#`, `>`, `➜`, `user@host:~$`.
   */
  prompt?: ReactNode;
  /**
   * Color/style variant for the prompt symbol.
   */
  promptTone?: "muted" | "primary" | "success" | "warning" | "danger" | "info";
  /**
   * When true, appends a blinking cursor after the command text.
   */
  cursor?: boolean;
  ref?: Ref<HTMLDivElement>;
}

const promptToneClasses: Record<
  NonNullable<TerminalFramePromptProps["promptTone"]>,
  string
> = {
  muted: "text-muted-foreground opacity-70",
  primary: "text-primary",
  success: "text-emerald-500 dark:text-emerald-400",
  warning: "text-amber-500 dark:text-amber-400",
  danger: "text-red-500 dark:text-red-400",
  info: "text-sky-500 dark:text-sky-400",
};

function TerminalFramePrompt({
  className,
  prompt = "$",
  promptTone = "success",
  cursor = false,
  children,
  ref,
  ...props
}: TerminalFramePromptProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="terminal-frame-prompt"
      className={cn("flex items-baseline gap-2", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn("shrink-0 select-none", promptToneClasses[promptTone])}
      >
        {prompt}
      </span>
      <span className="min-w-0 flex-1 whitespace-pre-wrap break-words">
        {children}
        {cursor ? <TerminalFrameCursor className="ml-1 align-middle" /> : null}
      </span>
    </div>
  );
}
TerminalFramePrompt.displayName = "TerminalFramePrompt";

export interface TerminalFrameOutputProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Color/style variant for the output line. `default` inherits body color.
   */
  tone?: "default" | "muted" | "success" | "warning" | "danger" | "info";
  ref?: Ref<HTMLDivElement>;
}

const outputToneClasses: Record<
  NonNullable<TerminalFrameOutputProps["tone"]>,
  string
> = {
  default: "",
  muted: "opacity-60",
  success: "text-emerald-500 dark:text-emerald-400",
  warning: "text-amber-500 dark:text-amber-400",
  danger: "text-red-500 dark:text-red-400",
  info: "text-sky-500 dark:text-sky-400",
};

function TerminalFrameOutput({
  className,
  tone = "default",
  ref,
  ...props
}: TerminalFrameOutputProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="terminal-frame-output"
      className={cn(
        "whitespace-pre-wrap break-words",
        outputToneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
TerminalFrameOutput.displayName = "TerminalFrameOutput";

export interface TerminalFrameCursorProps
  extends HTMLAttributes<HTMLSpanElement> {
  /**
   * When false, the cursor is rendered but does not blink.
   */
  blink?: boolean;
  ref?: Ref<HTMLSpanElement>;
}

function TerminalFrameCursor({
  className,
  blink = true,
  ref,
  ...props
}: TerminalFrameCursorProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="terminal-frame-cursor"
      aria-hidden="true"
      className={cn(
        "inline-block h-[1em] w-[0.5em] translate-y-[0.15em] bg-current align-baseline",
        blink && "animate-pulse",
        className,
      )}
      {...props}
    />
  );
}
TerminalFrameCursor.displayName = "TerminalFrameCursor";

export {
  TerminalFrame,
  TerminalFrameHeader,
  TerminalFrameControls,
  TerminalFrameTitle,
  TerminalFrameBody,
  TerminalFramePrompt,
  TerminalFrameOutput,
  TerminalFrameCursor,
  terminalFrameVariants,
  terminalFrameHeaderVariants,
  terminalFrameBodyVariants,
};
