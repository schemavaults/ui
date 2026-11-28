/**
 * Framework-free cron expression parsing, description and next-run
 * computation used by `<CronSchedule />`.
 *
 * Supports the standard 5-field POSIX/Vixie syntax:
 *
 * ```
 * ┌ minute (0-59)
 * │ ┌ hour (0-23)
 * │ │ ┌ day of month (1-31)
 * │ │ │ ┌ month (1-12 or JAN-DEC)
 * │ │ │ │ ┌ day of week (0-7 or SUN-SAT, 0 and 7 are Sunday)
 * * * * * *
 * ```
 *
 * plus `*`, `?` (alias of `*`), lists (`1,15`), ranges (`MON-FRI`), steps
 * (`*\/5`, `0-30/10`, `5/15`) and the `@yearly` / `@annually` / `@monthly` /
 * `@weekly` / `@daily` / `@midnight` / `@hourly` macros.
 *
 * As in Vixie cron, when *both* day-of-month and day-of-week are restricted a
 * time matches if *either* matches.
 */

export const cronFieldIds = [
  "minute",
  "hour",
  "dayOfMonth",
  "month",
  "dayOfWeek",
] as const satisfies readonly string[];
export type CronFieldId = (typeof cronFieldIds)[number];

interface CronFieldSpec {
  id: CronFieldId;
  label: string;
  min: number;
  max: number;
  names?: readonly string[];
}

export const MONTH_NAMES: readonly string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAY_NAMES: readonly string[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTH_ABBREVIATIONS: readonly string[] = MONTH_NAMES.map((n) =>
  n.slice(0, 3).toUpperCase(),
);
const WEEKDAY_ABBREVIATIONS: readonly string[] = WEEKDAY_NAMES.map((n) =>
  n.slice(0, 3).toUpperCase(),
);

export const CRON_FIELD_SPECS: Readonly<Record<CronFieldId, CronFieldSpec>> = {
  minute: { id: "minute", label: "Minute", min: 0, max: 59 },
  hour: { id: "hour", label: "Hour", min: 0, max: 23 },
  dayOfMonth: { id: "dayOfMonth", label: "Day (month)", min: 1, max: 31 },
  month: {
    id: "month",
    label: "Month",
    min: 1,
    max: 12,
    names: MONTH_ABBREVIATIONS,
  },
  dayOfWeek: {
    id: "dayOfWeek",
    label: "Day (week)",
    min: 0,
    // 7 is accepted as an alias of Sunday and folded to 0 after parsing.
    max: 7,
    names: WEEKDAY_ABBREVIATIONS,
  },
};

export const CRON_MACROS: Readonly<Record<string, string>> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

export interface CronField {
  id: CronFieldId;
  label: string;
  /** The token exactly as written (after macro expansion). */
  raw: string;
  /** Sorted, de-duplicated matching values. */
  values: readonly number[];
  /** `true` when the token is `*` or `?` (matches everything, unrestricted). */
  isWildcard: boolean;
  /** Human-readable description of this field on its own. */
  description: string;
}

export interface ParsedCronExpression {
  ok: true;
  /** The input, trimmed and whitespace-normalised. */
  expression: string;
  /** Set when the input was a macro such as `@daily`. */
  macro?: string;
  fields: Readonly<Record<CronFieldId, CronField>>;
}

export interface CronParseError {
  ok: false;
  expression: string;
  error: string;
  /** The field the error occurred in, when it can be attributed to one. */
  fieldId?: CronFieldId;
}

export type CronParseResult = ParsedCronExpression | CronParseError;

class CronFieldError extends Error {
  constructor(
    message: string,
    public readonly fieldId: CronFieldId,
  ) {
    super(message);
  }
}

function parseValue(token: string, spec: CronFieldSpec): number {
  const upper = token.toUpperCase();
  if (spec.names) {
    const nameIndex = spec.names.indexOf(upper);
    if (nameIndex !== -1) return spec.min === 1 ? nameIndex + 1 : nameIndex;
  }
  if (!/^\d+$/.test(token)) {
    throw new CronFieldError(
      `${spec.label}: "${token}" is not a valid value`,
      spec.id,
    );
  }
  const value = Number(token);
  if (value < spec.min || value > spec.max) {
    throw new CronFieldError(
      `${spec.label}: ${value} is out of range (${spec.min}-${spec.max})`,
      spec.id,
    );
  }
  return value;
}

function parseFieldValues(raw: string, spec: CronFieldSpec): number[] {
  const values = new Set<number>();
  for (const part of raw.split(",")) {
    if (part === "") {
      throw new CronFieldError(`${spec.label}: empty list item`, spec.id);
    }
    const [rangePart, stepPart, ...extra] = part.split("/");
    if (extra.length > 0 || rangePart === undefined || rangePart === "") {
      throw new CronFieldError(
        `${spec.label}: "${part}" is not a valid expression`,
        spec.id,
      );
    }
    let step = 1;
    if (stepPart !== undefined) {
      if (!/^\d+$/.test(stepPart) || Number(stepPart) === 0) {
        throw new CronFieldError(
          `${spec.label}: step "${stepPart}" must be a positive integer`,
          spec.id,
        );
      }
      step = Number(stepPart);
    }

    let start: number;
    let end: number;
    if (rangePart === "*" || rangePart === "?") {
      start = spec.min;
      end = spec.id === "dayOfWeek" ? 6 : spec.max;
    } else if (rangePart.includes("-")) {
      const bounds = rangePart.split("-");
      if (bounds.length !== 2 || !bounds[0] || !bounds[1]) {
        throw new CronFieldError(
          `${spec.label}: "${rangePart}" is not a valid range`,
          spec.id,
        );
      }
      start = parseValue(bounds[0], spec);
      end = parseValue(bounds[1], spec);
      if (start > end) {
        throw new CronFieldError(
          `${spec.label}: range "${rangePart}" runs backwards`,
          spec.id,
        );
      }
    } else {
      start = parseValue(rangePart, spec);
      // `5/15` means "every 15 starting at 5" through the field's maximum.
      end = stepPart !== undefined ? spec.max : start;
    }

    for (let v = start; v <= end; v += step) {
      values.add(spec.id === "dayOfWeek" && v === 7 ? 0 : v);
    }
  }
  return [...values].sort((a, b) => a - b);
}

// ---------------------------------------------------------------------------
// Description
// ---------------------------------------------------------------------------

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

function joinList(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

function nameValue(id: CronFieldId, token: string): string {
  const spec = CRON_FIELD_SPECS[id];
  const value = parseValue(token, spec);
  if (id === "month") return MONTH_NAMES[value - 1] ?? token;
  if (id === "dayOfWeek") return WEEKDAY_NAMES[value % 7] ?? token;
  if (id === "hour") return `${pad2(value)}:00`;
  return value.toString();
}

const UNIT_PLURAL: Record<CronFieldId, string> = {
  minute: "minutes",
  hour: "hours",
  dayOfMonth: "days",
  month: "months",
  dayOfWeek: "days of the week",
};
const UNIT_SINGULAR: Record<CronFieldId, string> = {
  minute: "minute",
  hour: "hour",
  dayOfMonth: "day",
  month: "month",
  dayOfWeek: "day of the week",
};

/** Describes one comma-separated item (`*`, `*\/5`, `1-5`, `MON`, `5/15`). */
function describeItem(id: CronFieldId, item: string): string {
  const [rangePart = "", stepPart] = item.split("/");
  const isAll = rangePart === "*" || rangePart === "?";
  const every =
    stepPart !== undefined
      ? `every ${stepPart === "1" ? UNIT_SINGULAR[id] : `${stepPart} ${UNIT_PLURAL[id]}`}`
      : `every ${UNIT_SINGULAR[id]}`;
  if (isAll) return every;
  if (rangePart.includes("-")) {
    const [a = "", b = ""] = rangePart.split("-");
    const range = `${nameValue(id, a)} through ${nameValue(id, b)}`;
    return stepPart !== undefined ? `${every}, ${range}` : range;
  }
  if (stepPart !== undefined) {
    return `${every} starting at ${nameValue(id, rangePart)}`;
  }
  return nameValue(id, rangePart);
}

function describeField(id: CronFieldId, raw: string): string {
  return joinList(raw.split(",").map((item) => describeItem(id, item)));
}

function isSingleValue(field: CronField): boolean {
  return /^[A-Za-z0-9]+$/.test(field.raw);
}

function isSimpleList(field: CronField): boolean {
  return /^[A-Za-z0-9]+(,[A-Za-z0-9]+)*$/.test(field.raw);
}

function isPlainStep(field: CronField): string | undefined {
  const match = /^[*?]\/(\d+)$/.exec(field.raw);
  return match?.[1];
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Lists named values ("Monday, Wednesday and Friday") for stepped fields. */
function listNamedValues(field: CronField): string {
  return joinList(
    field.values.map((v) =>
      field.id === "month"
        ? (MONTH_NAMES[v - 1] ?? String(v))
        : (WEEKDAY_NAMES[v] ?? String(v)),
    ),
  );
}

function describeTime(minute: CronField, hour: CronField): string {
  const hourStep = isPlainStep(hour);

  // Specific clock times: "At 09:00", "At 09:00 and 17:30".
  if (isSingleValue(minute) && isSimpleList(hour) && hour.values.length <= 6) {
    const m = minute.values[0] ?? 0;
    return `At ${joinList(hour.values.map((h) => `${pad2(h)}:${pad2(m)}`))}`;
  }

  // Minutes that recur within an hour ("every minute", "every 5 minutes",
  // "every 10 minutes, 0 through 30") read as a frequency, not a point.
  const recurring = minute.isWildcard || /[-/]/.test(minute.raw);
  const onTheHour = isSingleValue(minute) && minute.values[0] === 0;
  const minutePart = recurring
    ? capitalize(describeField("minute", minute.raw))
    : `At minute${minute.values.length > 1 ? "s" : ""} ${joinList(minute.values.map(String))}`;

  if (hour.isWildcard) {
    if (onTheHour) return "Every hour, on the hour";
    return recurring ? minutePart : `${minutePart} past every hour`;
  }
  if (hourStep !== undefined) {
    const every = hourStep === "1" ? "every hour" : `every ${hourStep} hours`;
    if (onTheHour) return `${capitalize(every)}, on the hour`;
    return recurring ? `${minutePart}, ${every}` : `${minutePart} past ${every}`;
  }
  const lead = onTheHour
    ? "Every hour, on the hour"
    : recurring
      ? minutePart
      : `${minutePart} past the hour`;
  const hourRange = /^(\d+)-(\d+)$/.exec(hour.raw);
  if (hourRange) {
    const from = `${pad2(Number(hourRange[1]))}:00`;
    const to = `${pad2(Number(hourRange[2]))}:59`;
    return `${lead}, between ${from} and ${to}`;
  }
  if (isSimpleList(hour)) {
    const plural = hour.values.length > 1 ? "hours" : "hour";
    return `${lead}, during the ${joinList(hour.values.map((h) => `${pad2(h)}:00`))} ${plural}`;
  }
  return `${lead}, at ${describeField("hour", hour.raw)}`;
}

function describeDays(dom: CronField, dow: CronField): string {
  const domText = dom.isWildcard
    ? undefined
    : isPlainStep(dom) !== undefined
      ? describeField("dayOfMonth", dom.raw)
      : `on the ${joinList(
          dom.raw
            .split(",")
            .map((item) =>
              /^\d+$/.test(item)
                ? ordinal(Number(item))
                : describeItem("dayOfMonth", item),
            ),
        )} of the month`;
  const dowText = dow.isWildcard
    ? undefined
    : dow.raw.includes("/")
      ? `on ${listNamedValues(dow)}`
      : `on ${describeField("dayOfWeek", dow.raw)}`;
  if (domText && dowText) return `${domText} or ${dowText}`;
  return domText ?? dowText ?? "";
}

function describeMonths(month: CronField): string {
  if (month.isWildcard) return "";
  if (isPlainStep(month) !== undefined) return describeField("month", month.raw);
  if (month.raw.includes("/")) return `in ${listNamedValues(month)}`;
  return `in ${describeField("month", month.raw)}`;
}

/** Plain-English description, e.g. `"At 09:00, on Monday through Friday"`. */
export function describeCronExpression(parsed: ParsedCronExpression): string {
  const { minute, hour, dayOfMonth, month, dayOfWeek } = parsed.fields;
  return [
    describeTime(minute, hour),
    describeDays(dayOfMonth, dayOfWeek),
    describeMonths(month),
  ]
    .filter((part) => part !== "")
    .join(", ");
}

// ---------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------

/** Parses a cron expression. Never throws — returns `{ ok: false }` instead. */
export function parseCronExpression(input: string): CronParseResult {
  const normalised = input.trim().replace(/\s+/g, " ");
  let expanded = normalised;
  let macro: string | undefined;
  if (normalised.startsWith("@")) {
    const lower = normalised.toLowerCase();
    const expansion = CRON_MACROS[lower];
    if (!expansion) {
      return {
        ok: false,
        expression: normalised,
        error: `Unknown macro "${normalised}"`,
      };
    }
    macro = lower;
    expanded = expansion;
  }

  const tokens = expanded === "" ? [] : expanded.split(" ");
  if (tokens.length !== cronFieldIds.length) {
    return {
      ok: false,
      expression: normalised,
      error: `Expected 5 fields (minute hour day month weekday), got ${tokens.length}`,
    };
  }

  try {
    const fields = {} as Record<CronFieldId, CronField>;
    cronFieldIds.forEach((id, index) => {
      const spec = CRON_FIELD_SPECS[id];
      const raw = tokens[index] ?? "";
      const values = parseFieldValues(raw, spec);
      fields[id] = {
        id,
        label: spec.label,
        raw,
        values,
        isWildcard: raw === "*" || raw === "?",
        description: describeField(id, raw),
      };
    });
    return { ok: true, expression: normalised, macro, fields };
  } catch (error) {
    if (error instanceof CronFieldError) {
      return {
        ok: false,
        expression: normalised,
        error: error.message,
        fieldId: error.fieldId,
      };
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Next runs
// ---------------------------------------------------------------------------

export interface GetNextCronRunsOptions {
  /** Reference time; runs strictly after it are returned. Defaults to now. */
  from?: Date | number;
  /** How many runs to compute. Defaults to 5. */
  count?: number;
  /** Evaluate the schedule in UTC instead of the runtime's local zone. */
  utc?: boolean;
}

/** Give up after this many years of searching (e.g. `0 0 30 2 *` never runs). */
const MAX_SEARCH_YEARS = 8;

export function getNextCronRuns(
  parsed: ParsedCronExpression,
  options: GetNextCronRunsOptions = {},
): Date[] {
  const { from = Date.now(), count = 5, utc = false } = options;
  const { minute, hour, dayOfMonth, month, dayOfWeek } = parsed.fields;
  const minutes = new Set(minute.values);
  const hours = new Set(hour.values);
  const doms = new Set(dayOfMonth.values);
  const months = new Set(month.values);
  const dows = new Set(dayOfWeek.values);
  const domRestricted = !dayOfMonth.isWildcard;
  const dowRestricted = !dayOfWeek.isWildcard;

  const get = {
    year: (d: Date): number => (utc ? d.getUTCFullYear() : d.getFullYear()),
    month: (d: Date): number => (utc ? d.getUTCMonth() : d.getMonth()),
    date: (d: Date): number => (utc ? d.getUTCDate() : d.getDate()),
    day: (d: Date): number => (utc ? d.getUTCDay() : d.getDay()),
    hours: (d: Date): number => (utc ? d.getUTCHours() : d.getHours()),
    minutes: (d: Date): number => (utc ? d.getUTCMinutes() : d.getMinutes()),
  };
  const make = (y: number, mo: number, d = 1, h = 0, mi = 0): Date =>
    utc ? new Date(Date.UTC(y, mo, d, h, mi)) : new Date(y, mo, d, h, mi);

  const dayMatches = (d: Date): boolean => {
    const domOk = doms.has(get.date(d));
    const dowOk = dows.has(get.day(d));
    if (domRestricted && dowRestricted) return domOk || dowOk;
    if (domRestricted) return domOk;
    if (dowRestricted) return dowOk;
    return true;
  };

  const start = new Date(typeof from === "number" ? from : from.getTime());
  // Advance to the next whole minute strictly after `from`.
  let cursor = make(
    get.year(start),
    get.month(start),
    get.date(start),
    get.hours(start),
    get.minutes(start) + 1,
  );
  const limit = make(get.year(start) + MAX_SEARCH_YEARS, 0);
  const runs: Date[] = [];

  while (runs.length < count && cursor < limit) {
    const y = get.year(cursor);
    const mo = get.month(cursor);
    if (!months.has(mo + 1)) {
      cursor = make(y, mo + 1);
      continue;
    }
    const d = get.date(cursor);
    if (!dayMatches(cursor)) {
      cursor = make(y, mo, d + 1);
      continue;
    }
    const h = get.hours(cursor);
    if (!hours.has(h)) {
      cursor = make(y, mo, d, h + 1);
      continue;
    }
    if (!minutes.has(get.minutes(cursor))) {
      cursor = make(y, mo, d, h, get.minutes(cursor) + 1);
      continue;
    }
    runs.push(cursor);
    cursor = make(y, mo, d, h, get.minutes(cursor) + 1);
  }
  return runs;
}
