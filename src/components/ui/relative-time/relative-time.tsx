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
  type RelativeTimeFormat,
  type RelativeTimeSize,
  type RelativeTimeVariant,
  relativeTimeFormatIds,
  relativeTimeSizeIds,
  relativeTimeVariantIds,
} from "./relative-time-variants";

export const relativeTimeVariants = cva(
  "inline-flex items-baseline whitespace-nowrap tabular-nums",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        brand: "text-schemavaults-brand-blue",
        destructive: "text-destructive",
        warning: "text-warning",
      } satisfies Record<RelativeTimeVariant, string>,
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      } satisfies Record<RelativeTimeSize, string>,
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
      },
    },
    defaultVariants: {
      variant: "muted",
      size: "md",
      weight: "normal",
    },
  },
);

interface RelativeUnit {
  /** Unit accepted by Intl.RelativeTimeFormat. */
  readonly unit: Intl.RelativeTimeFormatUnit;
  /** Number of seconds in this unit. */
  readonly seconds: number;
  /** How often (ms) the rendered value should refresh while this unit is active. */
  readonly refreshMs: number;
}

const RELATIVE_UNITS: readonly RelativeUnit[] = [
  { unit: "year", seconds: 60 * 60 * 24 * 365, refreshMs: 60 * 60 * 1000 },
  { unit: "month", seconds: 60 * 60 * 24 * 30, refreshMs: 60 * 60 * 1000 },
  { unit: "week", seconds: 60 * 60 * 24 * 7, refreshMs: 60 * 60 * 1000 },
  { unit: "day", seconds: 60 * 60 * 24, refreshMs: 15 * 60 * 1000 },
  { unit: "hour", seconds: 60 * 60, refreshMs: 60 * 1000 },
  { unit: "minute", seconds: 60, refreshMs: 15 * 1000 },
  { unit: "second", seconds: 1, refreshMs: 5 * 1000 },
];

function normalizeTimestamp(value: Date | string | number): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  return new Date(value).getTime();
}

interface FormattedRelative {
  /** The fully formatted, human-readable string (e.g. "5 minutes ago"). */
  text: string;
  /** Recommended ms until the next refresh while this unit is the best fit. */
  nextRefreshMs: number;
}

function formatRelative(
  targetMs: number,
  nowMs: number,
  format: RelativeTimeFormat,
  locale: string | string[] | undefined,
  justNowText: string,
  justNowThresholdSeconds: number,
): FormattedRelative {
  if (!Number.isFinite(targetMs)) {
    return { text: "", nextRefreshMs: 60 * 1000 };
  }

  const deltaSeconds = (targetMs - nowMs) / 1000;
  const absSeconds = Math.abs(deltaSeconds);

  if (absSeconds < justNowThresholdSeconds) {
    return { text: justNowText, nextRefreshMs: 5 * 1000 };
  }

  const rtf = new Intl.RelativeTimeFormat(locale, {
    numeric: "auto",
    style: format,
  });

  for (const { unit, seconds, refreshMs } of RELATIVE_UNITS) {
    if (absSeconds >= seconds || unit === "second") {
      const value = Math.round(deltaSeconds / seconds);
      return { text: rtf.format(value, unit), nextRefreshMs: refreshMs };
    }
  }

  return { text: rtf.format(0, "second"), nextRefreshMs: 5 * 1000 };
}

function formatAbsolute(
  targetMs: number,
  locale: string | string[] | undefined,
  options: Intl.DateTimeFormatOptions,
): string {
  if (!Number.isFinite(targetMs)) return "";
  return new Intl.DateTimeFormat(locale, options).format(new Date(targetMs));
}

const DEFAULT_TOOLTIP_OPTIONS: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
};

export interface RelativeTimeProps
  extends Omit<HTMLAttributes<HTMLTimeElement>, "title">,
    VariantProps<typeof relativeTimeVariants> {
  /** The target date/time to display relative to `now`. Accepts a Date, ISO string, or epoch-ms number. */
  date: Date | string | number;
  /** Reference point used to compute the delta. Defaults to the current time, updated on the auto-update interval. */
  now?: Date | string | number;
  /** Style passed to `Intl.RelativeTimeFormat` (`"long"`, `"short"`, `"narrow"`). Defaults to `"long"`. */
  format?: RelativeTimeFormat;
  /** BCP 47 locale tag(s). Defaults to the runtime's default locale. */
  locale?: string | string[];
  /** Whether to auto-refresh the rendered value at a sensible cadence. Defaults to `true`. */
  autoUpdate?: boolean;
  /** Whether to render the absolute timestamp in a `title` attribute (and as the default tooltip). Defaults to `true`. */
  showTitle?: boolean;
  /** Options used to format the absolute timestamp shown in the `title` attribute. */
  titleFormatOptions?: Intl.DateTimeFormatOptions;
  /** Override the `title` attribute entirely. When provided, `showTitle` and `titleFormatOptions` are ignored. */
  title?: string;
  /** Below this many absolute seconds the component renders `justNowText` instead of "0 seconds ago". Defaults to `5`. */
  justNowThresholdSeconds?: number;
  /** Text rendered when the delta is below `justNowThresholdSeconds`. Defaults to `"just now"`. */
  justNowText?: string;
  /** Text rendered for invalid dates. Defaults to an empty string (renders nothing visible). */
  invalidText?: string;
  /** Optional ref to the underlying `<time>` element. */
  ref?: Ref<HTMLTimeElement>;
}

function RelativeTime({
  date,
  now,
  format = "long",
  locale,
  autoUpdate = true,
  showTitle = true,
  titleFormatOptions,
  title,
  justNowThresholdSeconds = 5,
  justNowText = "just now",
  invalidText = "",
  variant,
  size,
  weight,
  className,
  ref,
  ...props
}: RelativeTimeProps): ReactElement {
  const targetMs = useMemo<number>(() => normalizeTimestamp(date), [date]);
  const explicitNowMs = useMemo<number | undefined>(
    () => (now === undefined ? undefined : normalizeTimestamp(now)),
    [now],
  );

  // Track an internal "tick" so we can re-render when the suggested refresh
  // interval elapses, without depending on the actual wall clock time as state
  // (which would break SSR / hydration).
  const [tick, setTick] = useState<number>(0);

  const referenceMs: number = explicitNowMs ?? Date.now();

  const isValid: boolean =
    Number.isFinite(targetMs) &&
    (explicitNowMs === undefined || Number.isFinite(explicitNowMs));

  const { text, nextRefreshMs } = useMemo<FormattedRelative>(
    () =>
      isValid
        ? formatRelative(
            targetMs,
            referenceMs,
            format,
            locale,
            justNowText,
            justNowThresholdSeconds,
          )
        : { text: invalidText, nextRefreshMs: 60 * 1000 },
    // `tick` is intentionally listed so the memo recomputes when the timer fires.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isValid,
      targetMs,
      referenceMs,
      format,
      locale,
      justNowText,
      justNowThresholdSeconds,
      invalidText,
      tick,
    ],
  );

  const absoluteTitle: string | undefined = useMemo<string | undefined>(() => {
    if (title !== undefined) return title;
    if (!showTitle || !isValid) return undefined;
    return formatAbsolute(
      targetMs,
      locale,
      titleFormatOptions ?? DEFAULT_TOOLTIP_OPTIONS,
    );
  }, [title, showTitle, isValid, targetMs, locale, titleFormatOptions]);

  const isoDateTime: string | undefined = useMemo<string | undefined>(() => {
    if (!isValid) return undefined;
    return new Date(targetMs).toISOString();
  }, [isValid, targetMs]);

  useEffect(() => {
    if (!autoUpdate || !isValid || explicitNowMs !== undefined) return;
    const id = setTimeout(() => {
      setTick((t) => t + 1);
    }, nextRefreshMs);
    return () => clearTimeout(id);
  }, [autoUpdate, isValid, explicitNowMs, nextRefreshMs, tick]);

  return (
    <time
      ref={ref}
      data-slot="relative-time"
      dateTime={isoDateTime}
      title={absoluteTitle}
      suppressHydrationWarning
      className={cn(
        relativeTimeVariants({ variant, size, weight }),
        className,
      )}
      {...props}
    >
      {text}
    </time>
  );
}
RelativeTime.displayName = "RelativeTime";

export {
  RelativeTime,
  relativeTimeVariantIds,
  relativeTimeSizeIds,
  relativeTimeFormatIds,
};
export type {
  RelativeTimeVariant,
  RelativeTimeSize,
  RelativeTimeFormat,
} from "./relative-time-variants";

export default RelativeTime;
