"use client";

import {
  useEffect,
  useState,
  type HTMLAttributes,
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
  DEFAULT_JUST_NOW_THRESHOLD_MS,
  formatRelativeTime,
  getRelativeTimeUpdateDelay,
  toTimestamp,
  type RelativeTimeInput,
  type RelativeTimeUnitId,
} from "./format-relative-time";

export const relativeTimeVariantIds = [
  "plain",
  "muted",
  "pill",
] as const satisfies string[];

export type RelativeTimeVariantId = (typeof relativeTimeVariantIds)[number];

export const relativeTimeSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies string[];

export type RelativeTimeSizeId = (typeof relativeTimeSizeIds)[number];

export const relativeTimeFreshnessIds = [
  "fresh",
  "stale",
  "expired",
] as const satisfies string[];

/**
 * How old the timestamp is against `staleAfter` / `expiredAfter`:
 * `fresh` keeps the variant's own colour, `stale` uses the theme's `warning`
 * tokens and `expired` its `destructive` token. The dark theme's
 * `--destructive` is a deep background red that is unreadable as text, so
 * dark mode lifts expired text to a lighter red.
 */
export type RelativeTimeFreshnessId = (typeof relativeTimeFreshnessIds)[number];

export const relativeTimeVariants = cva(
  "inline-flex items-center gap-1 rounded-sm whitespace-nowrap tabular-nums transition-colors [&>svg]:shrink-0 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        plain: "",
        muted: "",
        pill: "rounded-full border px-2 py-0.5 font-medium",
      } satisfies Record<RelativeTimeVariantId, string>,
      size: {
        sm: "text-xs [&>svg]:size-3",
        default: "text-sm [&>svg]:size-3.5",
        lg: "text-base [&>svg]:size-4",
      } satisfies Record<RelativeTimeSizeId, string>,
      freshness: {
        fresh: "",
        stale: "",
        expired: "",
      } satisfies Record<RelativeTimeFreshnessId, string>,
    },
    compoundVariants: [
      { variant: "plain", freshness: "fresh", class: "text-foreground" },
      { variant: "muted", freshness: "fresh", class: "text-muted-foreground" },
      {
        variant: "pill",
        freshness: "fresh",
        class: "border-border bg-muted text-muted-foreground",
      },
      {
        variant: ["plain", "muted"],
        freshness: "stale",
        class: "text-warning-foreground dark:text-warning",
      },
      {
        variant: ["plain", "muted"],
        freshness: "expired",
        class: "text-destructive dark:text-red-400",
      },
      {
        variant: "pill",
        freshness: "stale",
        class: "border-warning/50 bg-warning/15 text-warning-foreground dark:text-warning",
      },
      {
        variant: "pill",
        freshness: "expired",
        class: "border-destructive/40 bg-destructive/10 text-destructive dark:border-destructive dark:bg-destructive/30 dark:text-red-300",
      },
    ],
    defaultVariants: {
      variant: "plain",
      size: "default",
      freshness: "fresh",
    },
  },
);

const DEFAULT_ABSOLUTE_FORMAT: Intl.DateTimeFormatOptions = {
  dateStyle: "full",
  timeStyle: "long",
};

export function getRelativeTimeFreshness(
  ageMs: number,
  staleAfter?: number,
  expiredAfter?: number,
): RelativeTimeFreshnessId {
  if (expiredAfter !== undefined && ageMs >= expiredAfter) return "expired";
  if (staleAfter !== undefined && ageMs >= staleAfter) return "stale";
  return "fresh";
}

export interface RelativeTimeProps
  extends Omit<HTMLAttributes<HTMLElement>, "children" | "color" | "prefix"> {
  /** The moment to describe. Accepts a Date, ISO string, or epoch-ms number. */
  date: RelativeTimeInput;
  /**
   * Fixed reference time. When set, the label is computed against it and the
   * component stops updating itself (handy for snapshots and SSR).
   */
  now?: RelativeTimeInput;
  /** Re-render whenever the label would change. Defaults to `true`. */
  live?: boolean;
  /** Visual treatment. Defaults to `plain`. */
  variant?: RelativeTimeVariantId;
  /** Text size scale. Defaults to `default`. */
  size?: RelativeTimeSizeId;
  /** BCP 47 locale(s) for both the relative label and the tooltip. */
  locale?: string | string[];
  /** `long` → "3 minutes ago", `short` → "3 min. ago", `narrow` → "3m ago". */
  formatStyle?: Intl.RelativeTimeFormatStyle;
  /** `auto` allows "yesterday" / "next week"; `always` keeps numbers. Defaults to `always`. */
  numeric?: Intl.RelativeTimeFormatNumeric;
  /** Label shown inside the just-now window. Defaults to `"just now"`. */
  nowLabel?: string;
  /** Size (ms, either side of now) of the just-now window. Defaults to 45 s; `0` disables it. */
  justNowThresholdMs?: number;
  /** Smallest unit shown, e.g. `"minute"` to never count seconds. */
  minUnit?: RelativeTimeUnitId;
  /** Largest unit shown, e.g. `"day"` for "45 days ago" instead of "1 month ago". */
  maxUnit?: RelativeTimeUnitId;
  /** Age (ms) at which the timestamp is styled as `stale` (warning). Only past timestamps age. */
  staleAfter?: number;
  /** Age (ms) at which the timestamp is styled as `expired` (destructive). */
  expiredAfter?: number;
  /** Show the absolute date/time in a tooltip on hover/focus. Defaults to `true`. */
  showTooltip?: boolean;
  /** `Intl.DateTimeFormat` options for the tooltip. Defaults to full date + long time. */
  absoluteFormat?: Intl.DateTimeFormatOptions;
  /** Custom tooltip content; replaces the formatted absolute date. */
  tooltipContent?: ReactNode;
  /** Render a leading clock icon, or pass your own icon node. */
  icon?: boolean | ReactNode;
  /** Text before the relative label, e.g. "Updated". */
  prefix?: ReactNode;
}

/** Re-renders whenever the formatted label is due to change. */
function useLiveNow(
  enabled: boolean,
  date: number,
  options: {
    justNowThresholdMs: number;
    minUnit?: RelativeTimeUnitId;
    maxUnit?: RelativeTimeUnitId;
  },
): number {
  const [now, setNow] = useState<number>(() => Date.now());
  const { justNowThresholdMs, minUnit, maxUnit } = options;

  useEffect(() => {
    if (!enabled || !Number.isFinite(date)) return;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function schedule(): void {
      const current: number = Date.now();
      setNow(current);
      const delay: number = getRelativeTimeUpdateDelay(date, {
        now: current,
        justNowThresholdMs,
        minUnit,
        maxUnit,
      });
      timeoutId = setTimeout(schedule, delay);
    }

    // Background tabs throttle timers; catch up as soon as the tab is back.
    function onVisibilityChange(): void {
      if (document.visibilityState !== "visible") return;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      schedule();
    }

    schedule();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, date, justNowThresholdMs, minUnit, maxUnit]);

  return now;
}

/**
 * A `<time>` element that reads "3 minutes ago" / "in 2 days", keeps itself
 * current (waking only when the label changes), shows the exact date in a
 * tooltip, and can colour itself as the timestamp goes stale.
 */
export function RelativeTime({
  date,
  now: fixedNow,
  live = true,
  variant = "plain",
  size = "default",
  locale,
  formatStyle = "long",
  numeric = "always",
  nowLabel,
  justNowThresholdMs = DEFAULT_JUST_NOW_THRESHOLD_MS,
  minUnit,
  maxUnit,
  staleAfter,
  expiredAfter,
  showTooltip = true,
  absoluteFormat = DEFAULT_ABSOLUTE_FORMAT,
  tooltipContent,
  icon = false,
  prefix,
  className,
  ...props
}: RelativeTimeProps): ReactElement {
  const target: number = toTimestamp(date);
  const valid: boolean = Number.isFinite(target);
  const liveNow: number = useLiveNow(live && fixedNow === undefined, target, {
    justNowThresholdMs,
    minUnit,
    maxUnit,
  });
  const nowMs: number = fixedNow === undefined ? liveNow : toTimestamp(fixedNow);

  const label: string = valid
    ? formatRelativeTime(target, {
        now: nowMs,
        locale,
        style: formatStyle,
        numeric,
        nowLabel,
        justNowThresholdMs,
        minUnit,
        maxUnit,
      })
    : "Invalid date";

  const absolute: string = valid
    ? new Intl.DateTimeFormat(locale, absoluteFormat).format(target)
    : "Invalid date";

  const freshness: RelativeTimeFreshnessId = valid
    ? getRelativeTimeFreshness(nowMs - target, staleAfter, expiredAfter)
    : "fresh";

  const iconNode: ReactNode =
    icon === true ? <Clock aria-hidden="true" /> : icon === false ? null : icon;

  const prefixText: string = typeof prefix === "string" ? `${prefix} ` : "";

  const element: ReactElement = (
    <time
      dateTime={valid ? new Date(target).toISOString() : undefined}
      data-slot="relative-time"
      data-freshness={freshness}
      // The tooltip holds the exact date, so keyboard users must be able to
      // focus the trigger just like mouse users can hover it.
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={showTooltip && valid ? 0 : undefined}
      // Screen readers get the exact moment alongside the relative label.
      aria-label={valid ? `${prefixText}${label} (${absolute})` : undefined}
      suppressHydrationWarning
      className={cn(
        relativeTimeVariants({ variant, size, freshness }),
        showTooltip &&
          valid &&
          "cursor-default outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        className,
      )}
      {...props}
    >
      {iconNode}
      {prefix !== undefined && prefix !== null && <span>{prefix}</span>}
      <span suppressHydrationWarning>{label}</span>
    </time>
  );

  if (!showTooltip || !valid) return element;

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{element}</TooltipTrigger>
        <TooltipContent className="tabular-nums">
          {tooltipContent ?? absolute}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

RelativeTime.displayName = "RelativeTime";
