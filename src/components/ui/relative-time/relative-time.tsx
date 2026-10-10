"use client";

import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva } from "class-variance-authority";
import { Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  formatAbsoluteTime,
  formatRelativeTime,
  toTimestamp,
  type FormatRelativeTimeOptions,
  type RelativeTimeInput,
} from "./format-relative-time";

export const relativeTimeVariantIds = [
  "text",
  "badge",
] as const satisfies string[];

export type RelativeTimeVariantId = (typeof relativeTimeVariantIds)[number];

export const relativeTimeColorIds = [
  "default",
  "muted",
  "brand",
  "warning",
  "destructive",
] as const satisfies string[];

export type RelativeTimeColorId = (typeof relativeTimeColorIds)[number];

export const relativeTimeSizeIds = ["sm", "default", "lg"] as const satisfies string[];

export type RelativeTimeSizeId = (typeof relativeTimeSizeIds)[number];

export const relativeTimeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        text: "rounded-sm",
        badge: "rounded-full border font-medium",
      } satisfies Record<RelativeTimeVariantId, string>,
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        brand: "text-schemavaults-brand-blue",
        warning: "text-warning",
        destructive: "text-destructive",
      } satisfies Record<RelativeTimeColorId, string>,
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      } satisfies Record<RelativeTimeSizeId, string>,
    },
    compoundVariants: [
      { variant: "badge", size: "sm", class: "px-2 py-0.5" },
      { variant: "badge", size: "default", class: "px-2.5 py-0.5" },
      { variant: "badge", size: "lg", class: "px-3 py-1" },
      { variant: "badge", color: "default", class: "border-border bg-muted" },
      { variant: "badge", color: "muted", class: "border-border bg-muted/50" },
      {
        variant: "badge",
        color: "brand",
        // The theme exposes brand colours as bare `var(...)`, which Tailwind's
        // `/NN` opacity modifier cannot tint, so mix the alpha in explicitly.
        class:
          "border-[color-mix(in_srgb,var(--schemavaults-brand-blue)_30%,transparent)] bg-[color-mix(in_srgb,var(--schemavaults-brand-blue)_10%,transparent)]",
      },
      {
        variant: "badge",
        color: "warning",
        class: "border-warning/30 bg-warning/10",
      },
      {
        variant: "badge",
        color: "destructive",
        class: "border-destructive/30 bg-destructive/10",
      },
    ],
    defaultVariants: {
      variant: "text",
      color: "muted",
      size: "default",
    },
  },
);

const ICON_SIZE_CLASS: Record<RelativeTimeSizeId, string> = {
  sm: "size-3",
  default: "size-3.5",
  lg: "size-4",
};

export interface RelativeTimeProps
  extends Omit<ComponentProps<"time">, "color" | "children" | "dateTime">,
    FormatRelativeTimeOptions {
  /** The moment to describe. Accepts a Date, ISO string, or epoch-ms number. */
  date: RelativeTimeInput;
  /**
   * Fixed reference time. When set, the text is computed against it and never
   * ticks — useful for tests, screenshots, and server-rendered snapshots.
   */
  now?: RelativeTimeInput;
  /** Re-render as time passes, at the next moment the text changes. Defaults to `true`. */
  live?: boolean;
  /** Show the absolute date/time in a tooltip on hover/focus. Defaults to `true`. */
  tooltip?: boolean;
  /** `Intl.DateTimeFormat` options for the tooltip. Defaults to full date + long time. */
  tooltipFormat?: Intl.DateTimeFormatOptions;
  /** Visual treatment. Defaults to `text`. */
  variant?: RelativeTimeVariantId;
  /** Colour intent themed via `@schemavaults/theme`. Defaults to `muted`. */
  color?: RelativeTimeColorId;
  /** Text size. Defaults to `default`. */
  size?: RelativeTimeSizeId;
  /** Show a leading clock icon. Defaults to `false`. */
  icon?: boolean;
  /** Rendered before the relative text, e.g. "Updated" or "Saved". */
  label?: ReactNode;
  /** Rendered when `date` cannot be parsed. Defaults to an em dash. */
  invalidContent?: ReactNode;
}

export function RelativeTime({
  date,
  now,
  live = true,
  tooltip = true,
  tooltipFormat,
  variant = "text",
  color = "muted",
  size = "default",
  icon = false,
  label,
  invalidContent = "—",
  locale,
  formatStyle,
  numeric,
  nowThresholdMs,
  absoluteAfterMs,
  absoluteFormat,
  className,
  ...props
}: RelativeTimeProps): ReactElement {
  const fixedNow: number | undefined =
    now === undefined ? undefined : toTimestamp(now);
  const ticking: boolean = live && fixedNow === undefined;

  const [currentTime, setCurrentTime] = useState<number>(() => Date.now());
  const reference: number = fixedNow ?? currentTime;

  const formatOptions: FormatRelativeTimeOptions = {
    locale,
    formatStyle,
    numeric,
    nowThresholdMs,
    absoluteAfterMs,
    absoluteFormat,
  };
  const result = formatRelativeTime(date, reference, formatOptions);
  const nextUpdateInMs: number | undefined = result?.nextUpdateInMs;

  useEffect(() => {
    if (!ticking || nextUpdateInMs === undefined) return;
    const timeoutId = setTimeout(() => {
      setCurrentTime(Date.now());
    }, nextUpdateInMs);
    return () => clearTimeout(timeoutId);
    // `currentTime` re-arms the timer after every tick, even when the
    // computed delay happens to be identical to the previous one.
  }, [ticking, nextUpdateInMs, currentTime]);

  const classes: string = cn(
    relativeTimeVariants({ variant, color, size }),
    className,
  );

  if (result === null) {
    return (
      <time data-slot="relative-time" data-invalid="true" className={classes} {...props}>
        {invalidContent}
      </time>
    );
  }

  const timestamp: number = toTimestamp(date);
  const absoluteText: string | null = formatAbsoluteTime(
    timestamp,
    locale,
    tooltipFormat,
  );

  const element: ReactElement = (
    <time
      dateTime={new Date(timestamp).toISOString()}
      data-slot="relative-time"
      data-unit={result.unit}
      // Focusable so keyboard users can reveal the absolute-time tooltip.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={tooltip ? 0 : undefined}
      title={tooltip ? undefined : (absoluteText ?? undefined)}
      suppressHydrationWarning
      className={classes}
      {...props}
    >
      {icon && (
        <Clock
          aria-hidden="true"
          className={cn("shrink-0", ICON_SIZE_CLASS[size])}
        />
      )}
      {label !== undefined && <span>{label} </span>}
      <span suppressHydrationWarning>{result.text}</span>
    </time>
  );

  if (!tooltip) return element;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{element}</TooltipTrigger>
        <TooltipContent className="tabular-nums">{absoluteText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

RelativeTime.displayName = "RelativeTime";
