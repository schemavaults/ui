"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
} from "react";

import { cn } from "@/lib/utils";

export const relativeTimeVariantIds = [
  "default",
  "muted",
  "accent",
  "warning",
  "destructive",
] as const satisfies string[];

export type RelativeTimeVariantId = (typeof relativeTimeVariantIds)[number];

export const relativeTimeSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies string[];

export type RelativeTimeSizeId = (typeof relativeTimeSizeIds)[number];

export const relativeTimeWeightIds = [
  "normal",
  "medium",
  "semibold",
] as const satisfies string[];

export type RelativeTimeWeightId = (typeof relativeTimeWeightIds)[number];

export const relativeTimeFormatIds = [
  "long",
  "short",
  "narrow",
] as const satisfies string[];

export type RelativeTimeFormatId = (typeof relativeTimeFormatIds)[number];

export const relativeTimeVariants = cva(
  "inline-block align-baseline transition-colors",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        accent: "text-schemavaults-brand-blue",
        warning: "text-warning",
        destructive: "text-destructive",
      } satisfies Record<RelativeTimeVariantId, string>,
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      } satisfies Record<RelativeTimeSizeId, string>,
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
      } satisfies Record<RelativeTimeWeightId, string>,
      tabular: {
        true: "tabular-nums",
        false: "",
      },
    },
    defaultVariants: {
      variant: "muted",
      size: "default",
      weight: "normal",
      tabular: false,
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

function normalizeTimestamp(input: Date | string | number): number {
  if (input instanceof Date) return input.getTime();
  if (typeof input === "number") return input;
  return new Date(input).getTime();
}

interface UnitStep {
  unit: Intl.RelativeTimeFormatUnit;
  ms: number;
}

// Ordered largest → smallest so we pick the biggest unit that still yields |value| ≥ 1.
const UNIT_STEPS: readonly UnitStep[] = [
  { unit: "year", ms: YEAR_MS },
  { unit: "month", ms: MONTH_MS },
  { unit: "week", ms: WEEK_MS },
  { unit: "day", ms: DAY_MS },
  { unit: "hour", ms: HOUR_MS },
  { unit: "minute", ms: MINUTE_MS },
  { unit: "second", ms: SECOND_MS },
] as const;

interface RelativePart {
  value: number;
  unit: Intl.RelativeTimeFormatUnit;
}

function pickUnit(diffMs: number): RelativePart {
  const absDiff: number = Math.abs(diffMs);
  for (const step of UNIT_STEPS) {
    if (absDiff >= step.ms) {
      return { value: Math.round(diffMs / step.ms), unit: step.unit };
    }
  }
  return { value: Math.round(diffMs / SECOND_MS), unit: "second" };
}

/**
 * Interval (in ms) at which the display might visibly change, given the
 * current age. Under a minute → 1s; under an hour → 30s; under a day → 5m;
 * otherwise → 1h. Static age (very old timestamps) is capped at 1h.
 */
function chooseAutoInterval(diffMs: number): number {
  const absDiff: number = Math.abs(diffMs);
  if (absDiff < MINUTE_MS) return SECOND_MS;
  if (absDiff < HOUR_MS) return 30 * SECOND_MS;
  if (absDiff < DAY_MS) return 5 * MINUTE_MS;
  return HOUR_MS;
}

function capitalizeFirst(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toLocaleUpperCase() + str.slice(1);
}

/**
 * Format a millisecond delta as a human-readable relative string using
 * `Intl.RelativeTimeFormat` under the hood. Negative deltas render as past
 * ("3 minutes ago"), positive as future ("in 3 minutes").
 */
export function formatRelativeTime(
  diffMs: number,
  options?: {
    format?: RelativeTimeFormatId;
    numeric?: Intl.RelativeTimeFormatNumeric;
    locale?: string | readonly string[];
    justNowThreshold?: number;
    justNowLabel?: string;
  },
): string {
  const format: RelativeTimeFormatId = options?.format ?? "long";
  const numeric: Intl.RelativeTimeFormatNumeric = options?.numeric ?? "auto";
  const locale: string | readonly string[] | undefined = options?.locale;
  const justNowThreshold: number = options?.justNowThreshold ?? 30 * SECOND_MS;
  const justNowLabel: string = options?.justNowLabel ?? "just now";

  if (Math.abs(diffMs) < justNowThreshold) return justNowLabel;

  const { value, unit } = pickUnit(diffMs);
  const formatter = new Intl.RelativeTimeFormat(
    locale as string | string[] | undefined,
    { numeric, style: format },
  );
  return formatter.format(value, unit);
}

/**
 * Format an absolute timestamp for the `title` tooltip. Defaults to a
 * locale-aware medium date and short time.
 */
function formatAbsolute(
  timestamp: number,
  locale?: string | readonly string[],
  options?: Intl.DateTimeFormatOptions,
): string {
  const resolved: Intl.DateTimeFormatOptions = options ?? {
    dateStyle: "medium",
    timeStyle: "short",
  };
  return new Intl.DateTimeFormat(
    locale as string | string[] | undefined,
    resolved,
  ).format(new Date(timestamp));
}

export interface RelativeTimeProps
  extends Omit<HTMLAttributes<HTMLTimeElement>, "children" | "title">,
    VariantProps<typeof relativeTimeVariants> {
  /** The timestamp to render relative to `now`. Accepts a Date, ISO string, or epoch-ms number. */
  date: Date | string | number;
  /**
   * Reference "now" timestamp. Rarely needed — defaults to the live clock
   * (auto-updating). Useful for deterministic snapshots or SSR consistency.
   */
  now?: Date | string | number;
  /** Intl.RelativeTimeFormat style. Defaults to `long` ("3 minutes ago"). */
  format?: RelativeTimeFormatId;
  /** `auto` → "yesterday"; `always` → "1 day ago". Defaults to `auto`. */
  numeric?: Intl.RelativeTimeFormatNumeric;
  /** BCP-47 locale(s). Omit to use the runtime default. */
  locale?: string | readonly string[];
  /** Show "just now" for absolute deltas under this many milliseconds. Defaults to 30_000 (30s). */
  justNowThreshold?: number;
  /** Text used when within `justNowThreshold`. Defaults to "just now". */
  justNowLabel?: string;
  /** Capitalise the first letter of the output. Defaults to `false`. */
  capitalize?: boolean;
  /**
   * How often to re-render, in milliseconds. `"auto"` (default) scales the
   * interval to the timestamp's age. `false` disables live updates entirely
   * — the value is frozen at mount / prop change.
   */
  updateInterval?: number | "auto" | false;
  /** Suppress the native `title` tooltip that shows the absolute time. */
  hideAbsoluteTooltip?: boolean;
  /** Override the format used for the tooltip's absolute date. */
  absoluteFormat?: Intl.DateTimeFormatOptions;
  /** Optional prefix inserted before the relative value (e.g. "Updated"). */
  prefix?: string;
  /** Optional suffix appended after the relative value. */
  suffix?: string;
}

export function RelativeTime({
  date,
  now,
  variant,
  size,
  weight,
  tabular,
  format = "long",
  numeric = "auto",
  locale,
  justNowThreshold = 30 * SECOND_MS,
  justNowLabel = "just now",
  capitalize = false,
  updateInterval = "auto",
  hideAbsoluteTooltip = false,
  absoluteFormat,
  prefix,
  suffix,
  className,
  ...props
}: RelativeTimeProps): ReactElement {
  const targetMs: number = useMemo<number>(
    () => normalizeTimestamp(date),
    [date],
  );

  const fixedNowMs: number | undefined = useMemo<number | undefined>(
    () => (now === undefined ? undefined : normalizeTimestamp(now)),
    [now],
  );

  // Deriving "renderedNow" state lets the component tick without prop changes.
  // Initial value: fixedNow if provided, else Date.now() at mount.
  const [renderedNowMs, setRenderedNowMs] = useState<number>(
    () => fixedNowMs ?? Date.now(),
  );

  // If a fixed `now` prop is passed, snap immediately when it changes.
  useEffect(() => {
    if (fixedNowMs !== undefined) {
      setRenderedNowMs(fixedNowMs);
    }
  }, [fixedNowMs]);

  // Effect Event lets the interval read the latest updateInterval choice
  // without restarting on every prop change.
  const computeNextDelay = useEffectEvent((): number => {
    if (typeof updateInterval === "number") return updateInterval;
    const diff: number = targetMs - Date.now();
    return chooseAutoInterval(diff);
  });

  useEffect(() => {
    // No live updates when a fixed reference or explicit opt-out is provided.
    if (fixedNowMs !== undefined) return;
    if (updateInterval === false) return;

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let cancelled: boolean = false;

    function schedule(): void {
      if (cancelled) return;
      const delay: number = Math.max(250, computeNextDelay());
      timeoutId = setTimeout(() => {
        if (cancelled) return;
        setRenderedNowMs(Date.now());
        schedule();
      }, delay);
    }

    schedule();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [fixedNowMs, updateInterval, targetMs]);

  const diffMs: number = targetMs - renderedNowMs;

  let display: string = Number.isFinite(targetMs)
    ? formatRelativeTime(diffMs, {
        format,
        numeric,
        locale,
        justNowThreshold,
        justNowLabel,
      })
    : "";

  if (capitalize) display = capitalizeFirst(display);

  const iso: string = Number.isFinite(targetMs)
    ? new Date(targetMs).toISOString()
    : "";

  const absolute: string = Number.isFinite(targetMs)
    ? formatAbsolute(targetMs, locale, absoluteFormat)
    : "";

  const parts: string[] = [];
  if (prefix) parts.push(prefix);
  if (display) parts.push(display);
  if (suffix) parts.push(suffix);
  const body: string = parts.join(" ");

  return (
    <time
      dateTime={iso}
      title={hideAbsoluteTooltip ? undefined : absolute}
      data-slot="relative-time"
      className={cn(
        relativeTimeVariants({ variant, size, weight, tabular }),
        className,
      )}
      suppressHydrationWarning
      {...props}
    >
      {body}
    </time>
  );
}

RelativeTime.displayName = "RelativeTime";
