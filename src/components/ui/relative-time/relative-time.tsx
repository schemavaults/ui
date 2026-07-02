"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  useEffect,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
  type TimeHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export const relativeTimeVariantIds = [
  "default",
  "muted",
  "subtle",
  "emphasis",
] as const satisfies string[];

export type RelativeTimeVariantId = (typeof relativeTimeVariantIds)[number];

export const relativeTimeSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies string[];

export type RelativeTimeSizeId = (typeof relativeTimeSizeIds)[number];

export const relativeTimeVariants = cva(
  "whitespace-nowrap align-middle tabular-nums",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        subtle: "text-muted-foreground/70",
        emphasis: "font-medium text-foreground",
      } satisfies Record<RelativeTimeVariantId, string>,
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      } satisfies Record<RelativeTimeSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type UnitBucket = "second" | "minute" | "hour" | "day" | "month" | "year";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

function normalizeToMs(input: Date | string | number): number {
  if (input instanceof Date) return input.getTime();
  if (typeof input === "number") return input;
  return new Date(input).getTime();
}

function pickRelative(deltaMs: number): {
  value: number;
  unit: UnitBucket;
} {
  const abs: number = Math.abs(deltaMs);
  if (abs < MINUTE_MS) {
    return { value: Math.round(deltaMs / SECOND_MS), unit: "second" };
  }
  if (abs < HOUR_MS) {
    return { value: Math.round(deltaMs / MINUTE_MS), unit: "minute" };
  }
  if (abs < DAY_MS) {
    return { value: Math.round(deltaMs / HOUR_MS), unit: "hour" };
  }
  if (abs < MONTH_MS) {
    return { value: Math.round(deltaMs / DAY_MS), unit: "day" };
  }
  if (abs < YEAR_MS) {
    return { value: Math.round(deltaMs / MONTH_MS), unit: "month" };
  }
  return { value: Math.round(deltaMs / YEAR_MS), unit: "year" };
}

// Auto-picks how long until the displayed value might reasonably change.
// Returns 0 when the delta is so large that self-updating is wasteful.
function pickAutoInterval(deltaMs: number): number {
  const abs: number = Math.abs(deltaMs);
  if (abs < MINUTE_MS) return 5 * SECOND_MS;
  if (abs < HOUR_MS) return 30 * SECOND_MS;
  if (abs < DAY_MS) return 5 * MINUTE_MS;
  if (abs < MONTH_MS) return 30 * MINUTE_MS;
  return 0;
}

const DEFAULT_ABSOLUTE_FORMAT: Intl.DateTimeFormatOptions = {
  dateStyle: "long",
  timeStyle: "short",
};

function capitalizeFirst(input: string, locale?: string | string[]): string {
  if (input.length === 0) return input;
  const first: string = input.charAt(0);
  const localeArg: string | string[] | undefined = Array.isArray(locale)
    ? locale
    : locale;
  return first.toLocaleUpperCase(localeArg) + input.slice(1);
}

export interface RelativeTimeProps
  extends Omit<
      TimeHTMLAttributes<HTMLTimeElement>,
      "children" | "dateTime"
    >,
    VariantProps<typeof relativeTimeVariants> {
  /** The absolute date/time to display relative to "now". Accepts a Date, ISO string, or epoch-ms number. */
  date: Date | string | number;
  /**
   * Override "now" for computing the delta. Useful for tests, Storybook
   * stories, and SSR determinism. When provided, the self-updating interval
   * is also disabled.
   */
  now?: Date | number;
  /**
   * How often the component recomputes and re-renders:
   * - `"auto"` (default) picks a sensible cadence based on how far off `date` is
   *   (every 5s if within a minute, 30s within an hour, 5m within a day, 30m within a month).
   * - A number is an interval in milliseconds.
   * - `false` disables self-updating.
   */
  updateInterval?: "auto" | number | false;
  /** BCP-47 locale(s) for `Intl.RelativeTimeFormat`. Defaults to the runtime locale. */
  locale?: string | string[];
  /**
   * `Intl.RelativeTimeFormat` `numeric` option. Defaults to `"auto"` — locale-aware
   * phrases like "yesterday" or "tomorrow" instead of "1 day ago" / "in 1 day".
   */
  numeric?: "always" | "auto";
  /** `Intl.RelativeTimeFormat` `style` option. Defaults to `"long"` ("3 minutes ago"). */
  formatStyle?: "long" | "short" | "narrow";
  /**
   * Deltas smaller than this (in ms) render as `justNowText` instead of a
   * numeric string. Defaults to 15000 (15s). Set to `0` to disable.
   */
  justNowThreshold?: number;
  /** Text used when the delta is within `justNowThreshold`. Defaults to `"just now"`. */
  justNowText?: string;
  /** Capitalize the first letter of the formatted string. Defaults to `false`. */
  capitalize?: boolean;
  /** Render the absolute date in the `<time>`'s `title` on hover. Defaults to `true`. */
  showTitle?: boolean;
  /** `Intl.DateTimeFormat` options for the absolute-time title. Defaults to long-date + short-time. */
  absoluteFormatOptions?: Intl.DateTimeFormatOptions;
  /**
   * Optional render override. Receives the formatted relative string and the
   * resolved `Date`, useful for wrapping with an icon or tooltip.
   */
  children?: (formatted: string, date: Date) => ReactNode;
  ref?: Ref<HTMLTimeElement>;
}

/**
 * Displays an absolute date as a human-readable relative string
 * ("3 minutes ago", "in 2 hours", "yesterday"), self-updating on a smart
 * interval and exposing the absolute time in a `title` for hover-review.
 */
export function RelativeTime({
  date,
  now,
  updateInterval = "auto",
  locale,
  numeric = "auto",
  formatStyle = "long",
  justNowThreshold = 15 * SECOND_MS,
  justNowText = "just now",
  capitalize = false,
  showTitle = true,
  absoluteFormatOptions,
  variant,
  size,
  className,
  children,
  title: titleProp,
  ref,
  ...props
}: RelativeTimeProps): ReactElement {
  const targetMs: number = useMemo(() => normalizeToMs(date), [date]);
  const fixedNowMs: number | null = useMemo(() => {
    if (now === undefined) return null;
    if (now instanceof Date) return now.getTime();
    return now;
  }, [now]);

  const [tick, setTick] = useState<number>(() => fixedNowMs ?? Date.now());

  useEffect(() => {
    if (fixedNowMs !== null) return;
    if (updateInterval === false) return;

    let stopped: boolean = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    function schedule(): void {
      if (stopped) return;
      const delay: number =
        typeof updateInterval === "number"
          ? updateInterval
          : pickAutoInterval(targetMs - Date.now());
      if (delay <= 0) return;
      timeoutId = setTimeout(() => {
        if (stopped) return;
        setTick(Date.now());
        schedule();
      }, delay);
    }

    setTick(Date.now());
    schedule();

    return (): void => {
      stopped = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [fixedNowMs, targetMs, updateInterval]);

  const referenceMs: number = fixedNowMs ?? tick;
  const deltaMs: number = targetMs - referenceMs;

  const formatted: string = useMemo(() => {
    if (!Number.isFinite(targetMs)) return "";
    if (justNowThreshold > 0 && Math.abs(deltaMs) < justNowThreshold) {
      return justNowText;
    }
    const { value, unit } = pickRelative(deltaMs);
    const rtf = new Intl.RelativeTimeFormat(locale, {
      numeric,
      style: formatStyle,
    });
    return rtf.format(value, unit);
  }, [
    deltaMs,
    formatStyle,
    justNowText,
    justNowThreshold,
    locale,
    numeric,
    targetMs,
  ]);

  const displayText: string = capitalize
    ? capitalizeFirst(formatted, locale)
    : formatted;

  const isoString: string = useMemo(() => {
    if (!Number.isFinite(targetMs)) return "";
    return new Date(targetMs).toISOString();
  }, [targetMs]);

  const absoluteTitle: string | undefined = useMemo(() => {
    if (!Number.isFinite(targetMs)) return undefined;
    if (!showTitle) return undefined;
    const dtf = new Intl.DateTimeFormat(
      locale,
      absoluteFormatOptions ?? DEFAULT_ABSOLUTE_FORMAT,
    );
    return dtf.format(new Date(targetMs));
  }, [absoluteFormatOptions, locale, showTitle, targetMs]);

  const resolvedTitle: string | undefined = titleProp ?? absoluteTitle;
  const resolvedDate: Date = useMemo(() => new Date(targetMs), [targetMs]);
  const renderedContent: ReactNode = children
    ? children(displayText, resolvedDate)
    : displayText;

  return (
    <time
      ref={ref}
      data-slot="relative-time"
      dateTime={isoString}
      title={resolvedTitle}
      className={cn(relativeTimeVariants({ variant, size }), className)}
      suppressHydrationWarning
      {...props}
    >
      {renderedContent}
    </time>
  );
}

RelativeTime.displayName = "RelativeTime";
