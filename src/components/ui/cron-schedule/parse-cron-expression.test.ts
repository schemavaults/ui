/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";

import {
  describeCronExpression,
  getNextCronRuns,
  parseCronExpression,
  type ParsedCronExpression,
} from "./parse-cron-expression";

function parse(expression: string): ParsedCronExpression {
  const result = parseCronExpression(expression);
  if (!result.ok) throw new Error(`expected "${expression}" to parse: ${result.error}`);
  return result;
}

function describeExpr(expression: string): string {
  return describeCronExpression(parse(expression));
}

const FROM = Date.UTC(2026, 10, 28, 10, 7, 30); // Sat 28 Nov 2026 10:07:30Z

function nextIso(expression: string, count = 3): string[] {
  return getNextCronRuns(parse(expression), { from: FROM, count, utc: true }).map(
    (d) => d.toISOString(),
  );
}

describe("parseCronExpression", () => {
  test("expands lists, ranges and steps", () => {
    const { fields } = parse("*/15 9-11 1,15 JAN-MAR/2 MON-FRI");
    expect(fields.minute.values).toEqual([0, 15, 30, 45]);
    expect(fields.hour.values).toEqual([9, 10, 11]);
    expect(fields.dayOfMonth.values).toEqual([1, 15]);
    expect(fields.month.values).toEqual([1, 3]);
    expect(fields.dayOfWeek.values).toEqual([1, 2, 3, 4, 5]);
  });

  test("supports `start/step` and folds weekday 7 into Sunday", () => {
    const { fields } = parse("5/20 * * * 5-7");
    expect(fields.minute.values).toEqual([5, 25, 45]);
    expect(fields.dayOfWeek.values).toEqual([0, 5, 6]);
  });

  test("treats `?` as a wildcard", () => {
    expect(parse("0 0 ? * MON").fields.dayOfMonth.isWildcard).toBe(true);
  });

  test("expands macros and records them", () => {
    const result = parse("@daily");
    expect(result.macro).toBe("@daily");
    expect(result.fields.minute.raw).toBe("0");
    expect(result.fields.hour.raw).toBe("0");
  });

  test("normalises whitespace", () => {
    expect(parse("  0   9 * *\t1 ").expression).toBe("0 9 * * 1");
  });

  test.each([
    ["60 * * * *", "minute"],
    ["* 24 * * *", "hour"],
    ["* * 0 * *", "dayOfMonth"],
    ["* * * FOO *", "month"],
    ["* * * * 8", "dayOfWeek"],
    ["*/0 * * * *", "minute"],
    ["5-1 * * * *", "minute"],
    ["1,,2 * * * *", "minute"],
  ] as const)("rejects %s in the %s field", (expression, fieldId) => {
    const result = parseCronExpression(expression);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.fieldId).toBe(fieldId);
  });

  test("rejects the wrong number of fields and unknown macros", () => {
    expect(parseCronExpression("* * *").ok).toBe(false);
    expect(parseCronExpression("").ok).toBe(false);
    expect(parseCronExpression("@sometimes").ok).toBe(false);
  });
});

describe("describeCronExpression", () => {
  test.each([
    ["* * * * *", "Every minute"],
    ["*/5 * * * *", "Every 5 minutes"],
    ["0 * * * *", "Every hour, on the hour"],
    ["15 * * * *", "At minute 15 past every hour"],
    ["0 */6 * * *", "Every 6 hours, on the hour"],
    ["30 2 * * *", "At 02:30"],
    ["0 9,17 * * *", "At 09:00 and 17:00"],
    ["0 9 * * 1-5", "At 09:00, on Monday through Friday"],
    [
      "*/15 9-17 * * MON-FRI",
      "Every 15 minutes, between 09:00 and 17:59, on Monday through Friday",
    ],
    ["0 0 1,15 * *", "At 00:00, on the 1st and 15th of the month"],
    ["0 12 1 */3 *", "At 12:00, on the 1st of the month, every 3 months"],
    ["0 0 13 * 5", "At 00:00, on the 13th of the month or on Friday"],
    ["0 22 * * 1-5/2", "At 22:00, on Monday, Wednesday and Friday"],
    ["* 3 * * *", "Every minute, during the 03:00 hour"],
    ["@weekly", "At 00:00, on Sunday"],
  ])("%s → %s", (expression, expected) => {
    expect(describeExpr(expression)).toBe(expected);
  });
});

describe("getNextCronRuns", () => {
  test("returns runs strictly after `from`", () => {
    expect(nextIso("*/5 * * * *")).toEqual([
      "2026-11-28T10:10:00.000Z",
      "2026-11-28T10:15:00.000Z",
      "2026-11-28T10:20:00.000Z",
    ]);
  });

  test("skips weekends for weekday schedules", () => {
    expect(nextIso("0 9 * * MON-FRI", 2)).toEqual([
      "2026-11-30T09:00:00.000Z",
      "2026-12-01T09:00:00.000Z",
    ]);
  });

  test("rolls over months and years", () => {
    expect(nextIso("0 0 1 1 *", 2)).toEqual([
      "2027-01-01T00:00:00.000Z",
      "2028-01-01T00:00:00.000Z",
    ]);
  });

  test("ORs day-of-month and day-of-week when both are restricted", () => {
    expect(nextIso("0 0 13 * 5", 3)).toEqual([
      "2026-12-04T00:00:00.000Z",
      "2026-12-11T00:00:00.000Z",
      "2026-12-13T00:00:00.000Z",
    ]);
  });

  test("finds leap days", () => {
    expect(nextIso("0 0 29 2 *", 1)).toEqual(["2028-02-29T00:00:00.000Z"]);
  });

  test("returns nothing for schedules that can never run", () => {
    expect(nextIso("0 0 30 2 *")).toEqual([]);
  });
});
