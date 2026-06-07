"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  useEffect,
  useState,
  type ComponentProps,
  type ReactElement,
} from "react";

import { cn } from "@/lib/utils";
import {
  relativeTimeFormatIds,
  relativeTimeSizeIds,
  relativeTimeVariantIds,
  type RelativeTimeFormat,
  type RelativeTimeSize,
  type RelativeTimeVariant,
} from "./relative-time-variants";

export {
  relativeTimeVariantIds,
  relativeTimeSizeIds,
  relativeTimeFormatIds,
};
export type { RelativeTimeVariant, RelativeTimeSize, RelativeTimeFormat };

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

export const relativeTimeVariants = cva(
  "inline-flex items-baseline tabular-nums whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        brand: "text-schemavaults-brand-blue",
        success: "text-emerald-600 dark:text-emerald-400",
        warning: "text-warning",
        destructive: "text-destructive",
      } satisfies Record<RelativeTimeVariant, string>,
      size: {
        xs: "text-[11px]",
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      } satisfies Record<RelativeTimeSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

interface PickedUnit {
  /** Numeric value to feed `Intl.RelativeTimeFormat.format` (sign carries direction). */
  value: number;
  /** Time unit selected (always positive granularity). */
  unit: Intl.RelativeTimeFormatUnit;
  /** Milliseconds until the next meaningful tick (e.g. seconds → 1000ms). */
  nextTickMs: number;
}

/**
 * Pick the most natural unit for a given `diffMs` (positive = future, negative = past)
 * and report how long until the displayed value changes — so the component can refresh
 * only when needed instead of every second forever.
 */
function pickUnit(diffMs: number): PickedUnit {
  const absMs: number = Math.abs(diffMs);
  const sign: 1 | -1 = diffMs >= 0 ? 1 : -1;

  if (absMs < MINUTE_MS) {
    const seconds: number = Math.round(absMs / SECOND_MS);
    return {
      value: sign * seconds,
      unit: "second",
      nextTickMs: SECOND_MS,
    };
  }
  if (absMs < HOUR_MS) {
    const minutes: number = Math.round(absMs / MINUTE_MS);
    return {
      value: sign * minutes,
      unit: "minute",
      nextTickMs: MINUTE_MS - (absMs % MINUTE_MS),
    };
  }
  if (absMs < DAY_MS) {
    const hours: number = Math.round(absMs / HOUR_MS);
    return {
      value: sign * hours,
      unit: "hour",
      nextTickMs: HOUR_MS - (absMs % HOUR_MS),
    };
  }
  if (absMs < WEEK_MS) {
    const days: number = Math.round(absMs / DAY_MS);
    return {
      value: sign * days,
      unit: "day",
      nextTickMs: HOUR_MS,
    };
  }
  if (absMs < MONTH_MS) {
    const weeks: number = Math.round(absMs / WEEK_MS);
    return {
      value: sign * weeks,
      unit: "week",
      nextTickMs: DAY_MS,
    };
  }
  if (absMs < YEAR_MS) {
    const months: number = Math.round(absMs / MONTH_MS);
    return {
      value: sign * months,
      unit: "month",
      nextTickMs: DAY_MS,
    };
  }
  const years: number = Math.round(absMs / YEAR_MS);
  return {
    value: sign * years,
    unit: "year",
    nextTickMs: WEEK_MS,
  };
}

function normalizeTimestamp(value: Date | string | number): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  return new Date(value).getTime();
}

export interface RelativeTimeProps
  extends Omit<ComponentProps<"time">, "dateTime" | "title">,
    VariantProps<typeof relativeTimeVariants> {
  /** The reference timestamp. Accepts a `Date`, ISO string, or epoch-ms number. */
  date: Date | string | number;
  /** Display style: `long` ("5 minutes ago"), `short` ("5 min. ago"), or `narrow` ("5m ago"). Defaults to `long`. */
  format?: RelativeTimeFormat;
  /** BCP-47 locale string forwarded to `Intl.RelativeTimeFormat`. Defaults to the runtime locale. */
  locale?: string;
  /**
   * `auto` produces wording like "yesterday" / "tomorrow" where the locale allows it.
   * `always` produces strictly numeric output ("1 day ago"). Defaults to `auto`.
   */
  numeric?: "auto" | "always";
  /**
   * When the value is older than this many milliseconds, fall back to an absolute date string
   * (e.g. switch from "3 months ago" to "Jan 12, 2024"). Set to `Infinity` (default) to always
   * use the relative form.
   */
  thresholdMs?: number;
  /** Options forwarded to `toLocaleDateString` for the absolute fallback (used past `thresholdMs`). */
  absoluteFormat?: Intl.DateTimeFormatOptions;
  /** Optional prefix rendered before the relative phrase (e.g. "Last updated "). */
  prefix?: string;
  /** Optional suffix rendered after the relative phrase. */
  suffix?: string;
  /** When true, sets the native `title` attribute to the absolute localized timestamp. Defaults to `true`. */
  showTitle?: boolean;
  /**
   * Override the "live now" point. Useful for testing and SSR-deterministic snapshots.
   * Defaults to `Date.now()` on mount and refreshes on its own thereafter.
   */
  now?: Date | string | number;
}

export function RelativeTime({
  date,
  variant,
  size,
  format = "long",
  locale,
  numeric = "auto",
  thresholdMs = Infinity,
  absoluteFormat,
  prefix,
  suffix,
  showTitle = true,
  now,
  className,
  ref,
  ...timeProps
}: RelativeTimeProps): ReactElement {
  const target: number = normalizeTimestamp(date);
  const initialNow: number = now !== undefined ? normalizeTimestamp(now) : target;
  const [currentMs, setCurrentMs] = useState<number>(initialNow);

  useEffect(() => {
    if (now !== undefined) {
      setCurrentMs(normalizeTimestamp(now));
      return;
    }

    setCurrentMs(Date.now());

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    function schedule(): void {
      const diffMs: number = target - Date.now();
      const { nextTickMs } = pickUnit(diffMs);
      const delay: number = Math.max(250, Math.min(nextTickMs, HOUR_MS));
      timeoutId = setTimeout(() => {
        setCurrentMs(Date.now());
        schedule();
      }, delay);
    }
    schedule();

    return () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [target, now]);

  const isoString: string = Number.isFinite(target)
    ? new Date(target).toISOString()
    : "";

  const diffMs: number = target - currentMs;
  const absDiffMs: number = Math.abs(diffMs);

  const rtfFormatter: Intl.RelativeTimeFormat = new Intl.RelativeTimeFormat(
    locale,
    { numeric, style: format },
  );
  const { value, unit } = pickUnit(diffMs);
  const relativePhrase: string = rtfFormatter.format(value, unit);

  const absoluteFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(
    locale,
    absoluteFormat ?? {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    },
  );
  const absolutePhrase: string = Number.isFinite(target)
    ? absoluteFormatter.format(target)
    : "";

  const useAbsolute: boolean =
    Number.isFinite(thresholdMs) && absDiffMs > thresholdMs;

  const displayText: string = useAbsolute ? absolutePhrase : relativePhrase;

  return (
    <time
      ref={ref}
      data-slot="relative-time"
      dateTime={isoString || undefined}
      title={showTitle && absolutePhrase ? absolutePhrase : undefined}
      className={cn(relativeTimeVariants({ variant, size }), className)}
      suppressHydrationWarning
      {...timeProps}
    >
      {prefix ? <span>{prefix}</span> : null}
      <span>{displayText}</span>
      {suffix ? <span>{suffix}</span> : null}
    </time>
  );
}

RelativeTime.displayName = "RelativeTime";

export default RelativeTime;
