"use client";

import {
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const relativeTimeVariantIds = [
  "plain",
  "muted",
  "chip",
] as const satisfies readonly string[];

export type RelativeTimeVariantId = (typeof relativeTimeVariantIds)[number];

export const relativeTimeSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];

export type RelativeTimeSizeId = (typeof relativeTimeSizeIds)[number];

export const relativeTimeColorIds = [
  "default",
  "brand",
  "success",
  "warning",
  "destructive",
] as const satisfies readonly string[];

export type RelativeTimeColorId = (typeof relativeTimeColorIds)[number];

export const relativeTimeModeIds = [
  "relative",
  "absolute",
  "auto",
] as const satisfies readonly string[];

export type RelativeTimeModeId = (typeof relativeTimeModeIds)[number];

export const relativeTimeVariants = cva(
  "inline-flex items-center align-baseline whitespace-nowrap tabular-nums",
  {
    variants: {
      variant: {
        plain: "text-foreground",
        muted: "text-muted-foreground",
        chip:
          "rounded-md border border-border bg-muted/60 px-2 py-0.5 font-medium text-muted-foreground",
      } satisfies Record<RelativeTimeVariantId, string>,
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      } satisfies Record<RelativeTimeSizeId, string>,
      color: {
        default: "",
        brand: "text-schemavaults-brand-blue",
        success: "text-emerald-600 dark:text-emerald-400",
        warning: "text-warning",
        destructive: "text-destructive",
      } satisfies Record<RelativeTimeColorId, string>,
    },
    compoundVariants: [
      // On chip variant, color tints only the text (kept subtle over the chip bg).
      { variant: "chip", color: "brand", class: "text-schemavaults-brand-blue" },
    ],
    defaultVariants: {
      variant: "muted",
      size: "default",
      color: "default",
    },
  },
);

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

function normalizeTimestamp(value: Date | string | number): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  return new Date(value).getTime();
}

interface RelativeUnit {
  unit: Intl.RelativeTimeFormatUnit;
  ms: number;
  /** How often the rendered string can change while inside this unit. */
  tickInterval: number;
}

const UNITS: readonly RelativeUnit[] = [
  { unit: "year", ms: YEAR_MS, tickInterval: DAY_MS },
  { unit: "month", ms: MONTH_MS, tickInterval: HOUR_MS },
  { unit: "week", ms: WEEK_MS, tickInterval: HOUR_MS },
  { unit: "day", ms: DAY_MS, tickInterval: HOUR_MS },
  { unit: "hour", ms: HOUR_MS, tickInterval: MINUTE_MS },
  { unit: "minute", ms: MINUTE_MS, tickInterval: 15 * SECOND_MS },
  { unit: "second", ms: SECOND_MS, tickInterval: SECOND_MS },
];

function pickUnit(diffMs: number): RelativeUnit {
  const abs = Math.abs(diffMs);
  for (const u of UNITS) {
    if (abs >= u.ms) return u;
  }
  return UNITS[UNITS.length - 1]!;
}

function safeRelativeFormat(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: string | string[] | undefined,
  numeric: "always" | "auto",
): string {
  try {
    const rtf = new Intl.RelativeTimeFormat(locale, {
      numeric,
      style: "long",
    });
    return rtf.format(value, unit);
  } catch {
    // Very small fallback if Intl.RelativeTimeFormat is unavailable.
    const abs = Math.abs(value);
    const plural = abs === 1 ? unit : `${unit}s`;
    if (value === 0) return "now";
    return value < 0 ? `${abs} ${plural} ago` : `in ${abs} ${plural}`;
  }
}

function safeAbsoluteFormat(
  ts: number,
  locale: string | string[] | undefined,
  options: Intl.DateTimeFormatOptions,
): string {
  try {
    return new Intl.DateTimeFormat(locale, options).format(new Date(ts));
  } catch {
    return new Date(ts).toISOString();
  }
}

function formatRelative(
  targetMs: number,
  nowMs: number,
  locale: string | string[] | undefined,
  numeric: "always" | "auto",
  justNowThresholdMs: number,
): { text: string; nextTickMs: number } {
  const diffMs = targetMs - nowMs;
  const abs = Math.abs(diffMs);

  if (abs < justNowThresholdMs) {
    return {
      text: "just now",
      // Recompute right after the "just now" window ends.
      nextTickMs: Math.max(SECOND_MS, justNowThresholdMs - abs),
    };
  }

  const unit = pickUnit(diffMs);
  const rounded = Math.round(diffMs / unit.ms);
  const text = safeRelativeFormat(rounded, unit.unit, locale, numeric);
  return { text, nextTickMs: unit.tickInterval };
}

export interface RelativeTimeProps
  extends Omit<HTMLAttributes<HTMLTimeElement>, "color" | "title"> {
  /** The moment to display, relative to `now`. Accepts a Date, ISO string, or epoch-ms number. */
  date: Date | string | number;
  /** Visual layout. Defaults to `muted`. */
  variant?: RelativeTimeVariantId;
  /** Text size. Defaults to `default`. */
  size?: RelativeTimeSizeId;
  /** Semantic colour intent. Defaults to `default`. */
  color?: RelativeTimeColorId;
  /**
   * Which format to render.
   * - `relative`: always relative ("5 minutes ago")
   * - `absolute`: always absolute date/time
   * - `auto`: relative until the absolute delta exceeds `autoAbsoluteThresholdMs`,
   *   then falls back to absolute (default)
   */
  mode?: RelativeTimeModeId;
  /** Threshold beyond which `auto` mode switches to absolute rendering. Default: 7 days. */
  autoAbsoluteThresholdMs?: number;
  /** Values within this absolute delta from `now` render as "just now". Default: 30s. */
  justNowThresholdMs?: number;
  /**
   * `"auto"` (default) uses phrases like "yesterday"/"tomorrow" where the locale supports it;
   * `"always"` forces numeric phrasing ("1 day ago").
   */
  numeric?: "auto" | "always";
  /**
   * BCP-47 locale tag(s) for formatting. Defaults to the browser locale
   * (or English if unavailable / when rendered on the server).
   */
  locale?: string | string[];
  /** Override "now". Useful for tests, Storybook, and SSR snapshots. */
  now?: Date | string | number;
  /**
   * Manually override the auto-refresh cadence in ms. `0` disables auto-updating.
   * By default the cadence adapts to the current unit (1s → 1h).
   */
  updateInterval?: number;
  /** Options for the absolute date rendered in `absolute`/`auto` mode and the tooltip. */
  absoluteFormatOptions?: Intl.DateTimeFormatOptions;
  /** Show the absolute timestamp in the browser tooltip. Default: `true`. */
  showTitle?: boolean;
  /** Optional prefix, e.g. "Updated". Rendered ahead of the value with a space. */
  prefix?: string;
  /** Optional suffix rendered after the value with a space. */
  suffix?: string;
  ref?: Ref<HTMLTimeElement>;
}

const DEFAULT_AUTO_ABSOLUTE_THRESHOLD_MS = 7 * DAY_MS;
const DEFAULT_JUST_NOW_THRESHOLD_MS = 30 * SECOND_MS;

const DEFAULT_ABSOLUTE_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

const FULL_ABSOLUTE_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: "full",
  timeStyle: "long",
};

export function RelativeTime({
  date,
  variant = "muted",
  size = "default",
  color = "default",
  mode = "auto",
  autoAbsoluteThresholdMs = DEFAULT_AUTO_ABSOLUTE_THRESHOLD_MS,
  justNowThresholdMs = DEFAULT_JUST_NOW_THRESHOLD_MS,
  numeric = "auto",
  locale,
  now,
  updateInterval,
  absoluteFormatOptions = DEFAULT_ABSOLUTE_OPTIONS,
  showTitle = true,
  prefix,
  suffix,
  className,
  ref,
  children,
  ...rest
}: RelativeTimeProps): ReactElement {
  const targetMs: number = normalizeTimestamp(date);
  const frozenNow: number | undefined =
    now !== undefined ? normalizeTimestamp(now) : undefined;

  // Anchor "now" to the initial mount so server and client agree on the first
  // render. It advances via the interval below.
  const [nowMs, setNowMs] = useState<number>(() => frozenNow ?? targetMs);
  const isFrozen: boolean = frozenNow !== undefined;

  useEffect(() => {
    if (frozenNow !== undefined) {
      setNowMs(frozenNow);
      return;
    }
    // Snap to live wall-clock time as soon as we're on the client.
    setNowMs(Date.now());
  }, [frozenNow, targetMs]);

  const relative = useMemo(
    () =>
      formatRelative(
        targetMs,
        nowMs,
        locale,
        numeric,
        Math.max(0, justNowThresholdMs),
      ),
    [targetMs, nowMs, locale, numeric, justNowThresholdMs],
  );

  const absoluteText = useMemo(
    () => safeAbsoluteFormat(targetMs, locale, absoluteFormatOptions),
    [targetMs, locale, absoluteFormatOptions],
  );

  const tooltipText = useMemo(
    () => safeAbsoluteFormat(targetMs, locale, FULL_ABSOLUTE_OPTIONS),
    [targetMs, locale],
  );

  const useAbsolute: boolean =
    mode === "absolute" ||
    (mode === "auto" &&
      Math.abs(targetMs - nowMs) > Math.max(0, autoAbsoluteThresholdMs));

  const displayText: string = useAbsolute ? absoluteText : relative.text;

  useEffect(() => {
    if (isFrozen) return;
    if (updateInterval === 0) return;

    const interval: number =
      updateInterval !== undefined && updateInterval > 0
        ? updateInterval
        : Math.max(SECOND_MS, relative.nextTickMs);

    const id = setInterval(() => {
      setNowMs(Date.now());
    }, interval);

    return () => {
      clearInterval(id);
    };
  }, [isFrozen, updateInterval, relative.nextTickMs, targetMs]);

  const iso: string = useMemo(() => {
    const d = new Date(targetMs);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString();
  }, [targetMs]);

  const content: string =
    (prefix ? `${prefix} ` : "") +
    displayText +
    (suffix ? ` ${suffix}` : "");

  return (
    <time
      ref={ref}
      dateTime={iso}
      title={showTitle ? tooltipText : undefined}
      data-slot="relative-time"
      data-mode={useAbsolute ? "absolute" : "relative"}
      className={cn(relativeTimeVariants({ variant, size, color }), className)}
      suppressHydrationWarning
      {...rest}
    >
      {children ?? content}
    </time>
  );
}

RelativeTime.displayName = "RelativeTime";

export type RelativeTimeVariantProps = VariantProps<typeof relativeTimeVariants>;
