/**
 * React-free helpers behind `<RelativeTime>`: turning a timestamp
 * into "3 minutes ago" / "in 2 days", and working out how long that label
 * stays correct so the component can sleep until it actually changes.
 */

export const relativeTimeUnitIds = [
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
  "year",
] as const satisfies Intl.RelativeTimeFormatUnit[];

export type RelativeTimeUnitId = (typeof relativeTimeUnitIds)[number];

export type RelativeTimeInput = Date | string | number;

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;
// Calendar-agnostic averages: good enough for "3 months ago", and they keep
// the label a pure function of the elapsed milliseconds.
const MONTH_MS = 30 * DAY_MS;
const YEAR_MS = 365 * DAY_MS;

/** Size of each unit in milliseconds. */
export const RELATIVE_TIME_UNIT_MS: Readonly<Record<RelativeTimeUnitId, number>> =
  {
    second: SECOND_MS,
    minute: MINUTE_MS,
    hour: HOUR_MS,
    day: DAY_MS,
    week: WEEK_MS,
    month: MONTH_MS,
    year: YEAR_MS,
  };

/**
 * Upper bound (exclusive, in ms of elapsed time) for each unit. Past the bound
 * the next-larger unit takes over. Each bound is a whole multiple of the unit
 * below it, so the label never skips (e.g. "59 minutes ago" → "1 hour ago").
 */
const UNIT_UPPER_BOUND_MS: Readonly<Record<RelativeTimeUnitId, number>> = {
  second: MINUTE_MS,
  minute: HOUR_MS,
  hour: DAY_MS,
  day: WEEK_MS,
  week: 4 * WEEK_MS + 2 * DAY_MS, // up to 30 days, then months
  month: YEAR_MS,
  year: Number.POSITIVE_INFINITY,
};

/** Default window, either side of `now`, rendered as `nowLabel` ("just now"). */
export const DEFAULT_JUST_NOW_THRESHOLD_MS: number = 45 * SECOND_MS;

export function toTimestamp(value: RelativeTimeInput): number {
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value;
  return new Date(value).getTime();
}

export interface RelativeTimeParts {
  /** Signed count in `unit`: negative is in the past, positive in the future. */
  value: number;
  unit: RelativeTimeUnitId;
  /** True when the timestamp falls inside the "just now" window. */
  isNow: boolean;
  /** `date - now` in ms (negative for the past). */
  diffMs: number;
}

export interface RelativeTimeOptions {
  /** Reference time. Defaults to `Date.now()`. */
  now?: RelativeTimeInput;
  /** Window (ms, either side of now) treated as "just now". `0` disables it. */
  justNowThresholdMs?: number;
  /** Largest unit allowed, e.g. `"day"` to get "45 days ago" instead of months. */
  maxUnit?: RelativeTimeUnitId;
  /** Smallest unit allowed, e.g. `"minute"` to never show seconds. */
  minUnit?: RelativeTimeUnitId;
}

function unitIndex(unit: RelativeTimeUnitId): number {
  return relativeTimeUnitIds.indexOf(unit);
}

/**
 * Picks the unit and (floored, signed) count for `date` relative to `now`.
 * Counts are floored toward zero, so "1 hour ago" covers 60–119 minutes.
 */
export function getRelativeTimeParts(
  date: RelativeTimeInput,
  options: RelativeTimeOptions = {},
): RelativeTimeParts {
  const nowMs: number =
    options.now === undefined ? Date.now() : toTimestamp(options.now);
  const target: number = toTimestamp(date);
  const diffMs: number =
    Number.isFinite(target) && Number.isFinite(nowMs) ? target - nowMs : 0;
  const abs: number = Math.abs(diffMs);

  const justNow: number = Math.max(
    0,
    options.justNowThresholdMs ?? DEFAULT_JUST_NOW_THRESHOLD_MS,
  );
  const minIdx: number = unitIndex(options.minUnit ?? "second");
  const maxIdx: number = Math.max(
    minIdx,
    unitIndex(options.maxUnit ?? "year"),
  );

  let unit: RelativeTimeUnitId = relativeTimeUnitIds[maxIdx];
  for (let i = minIdx; i <= maxIdx; i++) {
    const candidate: RelativeTimeUnitId = relativeTimeUnitIds[i];
    if (abs < UNIT_UPPER_BOUND_MS[candidate] || i === maxIdx) {
      unit = candidate;
      break;
    }
  }

  const count: number = Math.floor(abs / RELATIVE_TIME_UNIT_MS[unit]);
  // A count of 0 only happens when minUnit forces a too-large unit (e.g.
  // 20 s with minUnit "minute"); that is "now" just like the threshold.
  const isNow: boolean = abs < justNow || count === 0;
  const value: number = diffMs < 0 ? -count : count;
  return { value: value === 0 ? 0 : value, unit, isNow, diffMs };
}

export interface FormatRelativeTimeOptions extends RelativeTimeOptions {
  /** BCP 47 locale(s) passed to `Intl.RelativeTimeFormat`. */
  locale?: string | string[];
  /** `"long"` → "3 minutes ago", `"short"` → "3 min. ago", `"narrow"` → "3m ago". */
  style?: Intl.RelativeTimeFormatStyle;
  /** `"auto"` allows "yesterday" / "next week"; `"always"` keeps numbers. */
  numeric?: Intl.RelativeTimeFormatNumeric;
  /** Label for timestamps inside the just-now window. Defaults to `"just now"`. */
  nowLabel?: string;
}

/** Formats `date` relative to `now`, e.g. `"3 minutes ago"` or `"in 2 days"`. */
export function formatRelativeTime(
  date: RelativeTimeInput,
  options: FormatRelativeTimeOptions = {},
): string {
  const { locale, style = "long", numeric = "always", nowLabel } = options;
  const parts: RelativeTimeParts = getRelativeTimeParts(date, options);
  if (parts.isNow) return nowLabel ?? "just now";
  return new Intl.RelativeTimeFormat(locale, { style, numeric }).format(
    parts.value,
    parts.unit,
  );
}

/** Longest single sleep, well under setTimeout's 2^31-1 ms ceiling. */
export const MAX_RELATIVE_TIME_UPDATE_DELAY_MS: number = HOUR_MS;
const MIN_UPDATE_DELAY_MS = 250;

/**
 * Milliseconds until the label produced by {@link getRelativeTimeParts} can
 * next change, so a live component sleeps exactly that long instead of
 * ticking every second. Clamped to [250 ms, 1 hour].
 */
export function getRelativeTimeUpdateDelay(
  date: RelativeTimeInput,
  options: RelativeTimeOptions = {},
): number {
  const parts: RelativeTimeParts = getRelativeTimeParts(date, options);
  const abs: number = Math.abs(parts.diffMs);
  const justNow: number = Math.max(
    0,
    options.justNowThresholdMs ?? DEFAULT_JUST_NOW_THRESHOLD_MS,
  );

  let delay: number;
  if (parts.isNow && abs < justNow) {
    // Past: leaves the window when |diff| reaches the threshold.
    // Future: the label stays "just now" until the timestamp passes and
    // then leaves the window on the other side.
    delay = parts.diffMs <= 0 ? justNow - abs : parts.diffMs + justNow;
  } else {
    const size: number = RELATIVE_TIME_UNIT_MS[parts.unit];
    const intoUnit: number = abs % size;
    // Past timestamps drift away from now (|diff| grows to the next multiple);
    // future ones drift toward it (|diff| shrinks below the current multiple).
    delay = parts.diffMs <= 0 ? size - intoUnit : intoUnit + 1;
    if (parts.diffMs > 0 && abs - delay < justNow) {
      delay = Math.max(1, abs - justNow + 1);
    }
  }

  return Math.min(
    MAX_RELATIVE_TIME_UPDATE_DELAY_MS,
    Math.max(MIN_UPDATE_DELAY_MS, Math.ceil(delay)),
  );
}
