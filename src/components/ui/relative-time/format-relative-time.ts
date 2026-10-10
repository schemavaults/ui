const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

/** Longest delay between live updates, so a sleeping tab corrects itself. */
const MAX_UPDATE_DELAY_MS = HOUR_MS;

export type RelativeTimeUnit = Extract<
  Intl.RelativeTimeFormatUnit,
  "year" | "month" | "week" | "day" | "hour" | "minute" | "second"
>;

/** Units from largest to smallest, with their (approximate) length in ms. */
const UNITS: readonly { unit: RelativeTimeUnit; ms: number }[] = [
  { unit: "year", ms: YEAR_MS },
  { unit: "month", ms: MONTH_MS },
  { unit: "week", ms: WEEK_MS },
  { unit: "day", ms: DAY_MS },
  { unit: "hour", ms: HOUR_MS },
  { unit: "minute", ms: MINUTE_MS },
  { unit: "second", ms: SECOND_MS },
];

export type RelativeTimeInput = Date | string | number;

export interface FormatRelativeTimeOptions {
  /** BCP 47 locale(s) passed to `Intl`. Defaults to the runtime locale. */
  locale?: Intl.LocalesArgument;
  /** `Intl.RelativeTimeFormat` style. Defaults to `long` ("3 minutes ago"). */
  formatStyle?: Intl.RelativeTimeFormatStyle;
  /**
   * `auto` allows phrases like "yesterday" and "now"; `always` forces numbers
   * ("1 day ago"). Defaults to `auto`.
   */
  numeric?: Intl.RelativeTimeFormatNumeric;
  /** Differences smaller than this render as "now". Defaults to 10 seconds. */
  nowThresholdMs?: number;
  /**
   * Once the difference reaches this many ms, render an absolute date instead
   * (e.g. "Mar 4, 2026"). Disabled by default.
   */
  absoluteAfterMs?: number;
  /** Options for the absolute date used past `absoluteAfterMs`. */
  absoluteFormat?: Intl.DateTimeFormatOptions;
}

export interface RelativeTimeResult {
  /** Text to display. */
  text: string;
  /** Unit the text was expressed in, or `absolute` when past `absoluteAfterMs`. */
  unit: RelativeTimeUnit | "absolute";
  /** ms until `text` would next change, for scheduling live updates. */
  nextUpdateInMs: number;
}

export function toTimestamp(value: RelativeTimeInput): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  return new Date(value).getTime();
}

function clampDelay(ms: number): number {
  return Math.min(MAX_UPDATE_DELAY_MS, Math.max(SECOND_MS, Math.ceil(ms)));
}

/**
 * Formats `date` relative to `now` using `Intl.RelativeTimeFormat`, picking
 * the largest whole unit (values are truncated, so 59.9 minutes is still
 * "59 minutes ago"). Returns `null` for an invalid date.
 */
export function formatRelativeTime(
  date: RelativeTimeInput,
  now: RelativeTimeInput = Date.now(),
  {
    locale,
    formatStyle = "long",
    numeric = "auto",
    nowThresholdMs = 10 * SECOND_MS,
    absoluteAfterMs,
    absoluteFormat = { dateStyle: "medium" },
  }: FormatRelativeTimeOptions = {},
): RelativeTimeResult | null {
  const target: number = toTimestamp(date);
  const reference: number = toTimestamp(now);
  if (!Number.isFinite(target) || !Number.isFinite(reference)) return null;

  const diff: number = target - reference;
  const abs: number = Math.abs(diff);
  const isPast: boolean = diff <= 0;

  if (absoluteAfterMs !== undefined && abs >= absoluteAfterMs) {
    return {
      text: new Intl.DateTimeFormat(locale, absoluteFormat).format(target),
      unit: "absolute",
      // A past date never leaves the absolute range; a future one re-enters
      // relative formatting once it is closer than `absoluteAfterMs`.
      nextUpdateInMs: isPast
        ? MAX_UPDATE_DELAY_MS
        : clampDelay(abs - absoluteAfterMs + 1),
    };
  }

  const formatter = new Intl.RelativeTimeFormat(locale, { style: formatStyle, numeric });

  if (abs < nowThresholdMs) {
    return {
      text: formatter.format(0, "second"),
      unit: "second",
      nextUpdateInMs: clampDelay(isPast ? nowThresholdMs - abs : SECOND_MS),
    };
  }

  const { unit, ms } =
    UNITS.find((candidate) => abs >= candidate.ms) ?? UNITS[UNITS.length - 1]!;
  const value: number = Math.trunc(abs / ms);
  const remainder: number = abs % ms;

  return {
    text: formatter.format(isPast ? -value : value, unit),
    unit,
    // Past: the value grows when the next whole unit elapses.
    // Future: the value shrinks once the remainder runs out.
    nextUpdateInMs: clampDelay(isPast ? ms - remainder : remainder || ms),
  };
}

export function formatAbsoluteTime(
  date: RelativeTimeInput,
  locale?: Intl.LocalesArgument,
  format: Intl.DateTimeFormatOptions = { dateStyle: "full", timeStyle: "long" },
): string | null {
  const timestamp: number = toTimestamp(date);
  if (!Number.isFinite(timestamp)) return null;
  return new Intl.DateTimeFormat(locale, format).format(timestamp);
}
