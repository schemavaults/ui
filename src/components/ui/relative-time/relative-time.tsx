"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../tooltip/tooltip";

export const relativeTimeColorIds = [
  "default",
  "muted",
  "primary",
  "destructive",
  "warning",
] as const satisfies string[];

export type RelativeTimeColorId = (typeof relativeTimeColorIds)[number];

export const relativeTimeSizeIds = [
  "xs",
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

export const relativeTimeVariants = cva(
  "inline-flex items-baseline tabular-nums leading-tight transition-colors",
  {
    variants: {
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        destructive: "text-destructive",
        warning: "text-warning",
      } satisfies Record<RelativeTimeColorId, string>,
      size: {
        xs: "text-xs",
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
      } satisfies Record<RelativeTimeSizeId, string>,
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
      } satisfies Record<RelativeTimeWeightId, string>,
      underline: {
        true: "underline decoration-dotted underline-offset-2 decoration-muted-foreground/40",
        false: "",
      },
    },
    defaultVariants: {
      color: "muted",
      size: "sm",
      weight: "normal",
      underline: false,
    },
  },
);

/** Logical units used when formatting a relative timestamp. */
export const relativeTimeUnits = [
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
  "year",
] as const satisfies Intl.RelativeTimeFormatUnit[];

export type RelativeTimeUnit = (typeof relativeTimeUnits)[number];

interface UnitConfig {
  /** Lower bound in seconds at which this unit should be used (inclusive). */
  threshold: number;
  /** Divisor to convert seconds into this unit. */
  divisor: number;
  /** Refresh interval in ms while this unit is active. */
  refreshMs: number;
  unit: RelativeTimeUnit;
}

const UNIT_TABLE: ReadonlyArray<UnitConfig> = [
  { threshold: 0, divisor: 1, refreshMs: 1_000, unit: "second" },
  { threshold: 60, divisor: 60, refreshMs: 15_000, unit: "minute" },
  { threshold: 60 * 60, divisor: 60 * 60, refreshMs: 60_000, unit: "hour" },
  {
    threshold: 60 * 60 * 24,
    divisor: 60 * 60 * 24,
    refreshMs: 60 * 60 * 1_000,
    unit: "day",
  },
  {
    threshold: 60 * 60 * 24 * 7,
    divisor: 60 * 60 * 24 * 7,
    refreshMs: 60 * 60 * 1_000,
    unit: "week",
  },
  {
    threshold: 60 * 60 * 24 * 30,
    divisor: 60 * 60 * 24 * 30,
    refreshMs: 60 * 60 * 6 * 1_000,
    unit: "month",
  },
  {
    threshold: 60 * 60 * 24 * 365,
    divisor: 60 * 60 * 24 * 365,
    refreshMs: 60 * 60 * 24 * 1_000,
    unit: "year",
  },
];

function pickUnit(
  deltaSeconds: number,
  maxUnit: RelativeTimeUnit,
): UnitConfig {
  const absSeconds = Math.abs(deltaSeconds);
  const maxIndex = relativeTimeUnits.indexOf(maxUnit);
  let chosen = UNIT_TABLE[0];
  for (let i = 0; i < UNIT_TABLE.length; i++) {
    const candidate = UNIT_TABLE[i];
    if (absSeconds >= candidate.threshold && i <= maxIndex) {
      chosen = candidate;
    }
  }
  return chosen;
}

function toDate(value: Date | string | number): Date {
  if (value instanceof Date) return value;
  return new Date(value);
}

export interface FormatRelativeOptions {
  /** Locale tag(s) for `Intl.RelativeTimeFormat`. */
  locale?: string | string[];
  /** Numeric output mode. `"auto"` produces "yesterday", "tomorrow", etc. */
  numeric?: Intl.RelativeTimeFormatNumeric;
  /** Word style for the unit (e.g. "long" → "minutes", "short" → "min"). */
  style?: Intl.RelativeTimeFormatStyle;
  /** Largest unit to use. Defaults to "year". */
  maxUnit?: RelativeTimeUnit;
  /** Reference "now" timestamp for deterministic output. */
  now?: Date;
}

/**
 * Format a date as a human-readable relative time string
 * (e.g. "5 minutes ago", "in 2 hours").
 */
export function formatRelativeTime(
  value: Date | string | number,
  options: FormatRelativeOptions = {},
): string {
  const {
    locale,
    numeric = "auto",
    style = "long",
    maxUnit = "year",
    now = new Date(),
  } = options;

  const target = toDate(value);
  const deltaSeconds = (target.getTime() - now.getTime()) / 1_000;
  const config = pickUnit(deltaSeconds, maxUnit);
  const rounded = Math.round(deltaSeconds / config.divisor);
  const formatter = new Intl.RelativeTimeFormat(locale, {
    numeric,
    style,
  });
  return formatter.format(rounded, config.unit);
}

export interface RelativeTimeProps
  extends Omit<HTMLAttributes<HTMLTimeElement>, "color" | "title">,
    VariantProps<typeof relativeTimeVariants> {
  /** The reference timestamp to render. */
  date: Date | string | number;
  /** Locale tag(s). Defaults to the runtime default. */
  locale?: string | string[];
  /** Numeric output mode. */
  numeric?: Intl.RelativeTimeFormatNumeric;
  /** Word style. */
  formatStyle?: Intl.RelativeTimeFormatStyle;
  /** Largest unit to use. Defaults to `"year"`. */
  maxUnit?: RelativeTimeUnit;
  /**
   * Refresh interval in ms. If omitted, a sensible interval is chosen
   * based on the magnitude (1s for seconds, 15s for minutes, etc.).
   */
  refreshIntervalMs?: number;
  /**
   * If `true`, the absolute timestamp is shown inside a tooltip on hover/focus.
   * Defaults to `true`.
   */
  showTooltip?: boolean;
  /**
   * Options forwarded to `Intl.DateTimeFormat` for the tooltip / `title`.
   * Defaults to a "PPpp"-like long format.
   */
  absoluteFormatOptions?: Intl.DateTimeFormatOptions;
  /**
   * Custom render for the absolute label. Receives the resolved Date.
   * Overrides `absoluteFormatOptions`.
   */
  renderAbsolute?: (date: Date) => string;
  /** Suppress live updates (renders once on mount and on prop changes). */
  freeze?: boolean;
  /** Forward the underlying `<time>` ref. */
  ref?: Ref<HTMLTimeElement>;
}

const DEFAULT_ABSOLUTE_FORMAT: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

function useNow(intervalMs: number, frozen: boolean): Date {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    if (frozen) return;
    if (!Number.isFinite(intervalMs) || intervalMs <= 0) return;
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, frozen]);
  return now;
}

function RelativeTime({
  className,
  date,
  color,
  size,
  weight,
  underline,
  locale,
  numeric = "auto",
  formatStyle = "long",
  maxUnit = "year",
  refreshIntervalMs,
  showTooltip = true,
  absoluteFormatOptions,
  renderAbsolute,
  freeze = false,
  ref,
  ...props
}: RelativeTimeProps): ReactElement {
  const target = useMemo<Date>(() => toDate(date), [date]);

  const initialIntervalMs = useMemo<number>(() => {
    if (refreshIntervalMs !== undefined) return refreshIntervalMs;
    const deltaSeconds = (target.getTime() - Date.now()) / 1_000;
    return pickUnit(deltaSeconds, maxUnit).refreshMs;
  }, [refreshIntervalMs, target, maxUnit]);

  const [activeInterval, setActiveInterval] =
    useState<number>(initialIntervalMs);
  const now = useNow(activeInterval, freeze);

  const { relative, absolute, isoString } = useMemo(() => {
    const deltaSeconds = (target.getTime() - now.getTime()) / 1_000;
    const config = pickUnit(deltaSeconds, maxUnit);
    const rounded = Math.round(deltaSeconds / config.divisor);
    const formatter = new Intl.RelativeTimeFormat(locale, {
      numeric,
      style: formatStyle,
    });
    const relativeStr = formatter.format(rounded, config.unit);

    const absoluteStr = renderAbsolute
      ? renderAbsolute(target)
      : new Intl.DateTimeFormat(
          locale,
          absoluteFormatOptions ?? DEFAULT_ABSOLUTE_FORMAT,
        ).format(target);

    return {
      relative: relativeStr,
      absolute: absoluteStr,
      isoString: target.toISOString(),
    };
  }, [
    target,
    now,
    locale,
    numeric,
    formatStyle,
    maxUnit,
    absoluteFormatOptions,
    renderAbsolute,
  ]);

  useEffect(() => {
    if (refreshIntervalMs !== undefined) {
      setActiveInterval(refreshIntervalMs);
      return;
    }
    const deltaSeconds = (target.getTime() - now.getTime()) / 1_000;
    const next = pickUnit(deltaSeconds, maxUnit).refreshMs;
    setActiveInterval((prev) => (prev === next ? prev : next));
  }, [refreshIntervalMs, target, now, maxUnit]);

  const timeElement: ReactElement = (
    <time
      ref={ref}
      data-slot="relative-time"
      dateTime={isoString}
      title={showTooltip ? undefined : absolute}
      className={cn(
        relativeTimeVariants({ color, size, weight, underline }),
        className,
      )}
      {...props}
    >
      {relative}
    </time>
  );

  if (!showTooltip) return timeElement;

  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>{timeElement}</TooltipTrigger>
        <TooltipContent>{absolute}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
RelativeTime.displayName = "RelativeTime";

export { RelativeTime };
