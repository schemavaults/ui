/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";

import { formatRelativeTime } from "./format-relative-time";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const NOW = Date.UTC(2026, 9, 10, 12, 0, 0);

function format(
  offsetMs: number,
  options?: Parameters<typeof formatRelativeTime>[2],
): ReturnType<typeof formatRelativeTime> {
  return formatRelativeTime(NOW + offsetMs, NOW, { locale: "en-US", ...options });
}

describe("formatRelativeTime", () => {
  test("renders 'now' inside the threshold", () => {
    expect(format(0)?.text).toBe("now");
    expect(format(-9 * SECOND)?.text).toBe("now");
    expect(format(9 * SECOND)?.text).toBe("now");
    expect(format(-9 * SECOND, { nowThresholdMs: 0 })?.text).toBe("9 seconds ago");
  });

  test("picks the largest whole unit and truncates", () => {
    expect(format(-45 * SECOND)?.text).toBe("45 seconds ago");
    expect(format(-59 * MINUTE - 59 * SECOND)?.text).toBe("59 minutes ago");
    expect(format(-3 * HOUR)?.text).toBe("3 hours ago");
    expect(format(-1 * DAY)?.text).toBe("yesterday");
    expect(format(-14 * DAY)?.text).toBe("2 weeks ago");
    expect(format(-400 * DAY)?.text).toBe("last year");
    expect(format(2 * HOUR + 5 * MINUTE)?.text).toBe("in 2 hours");
  });

  test("respects numeric and style", () => {
    expect(format(-1 * DAY, { numeric: "always" })?.text).toBe("1 day ago");
    expect(format(-5 * MINUTE, { formatStyle: "short" })?.text).toBe("5 min. ago");
  });

  test("switches to an absolute date past absoluteAfterMs", () => {
    const result = format(-10 * DAY, {
      absoluteAfterMs: 7 * DAY,
      absoluteFormat: { dateStyle: "medium", timeZone: "UTC" },
    });
    expect(result?.unit).toBe("absolute");
    expect(result?.text).toBe("Sep 30, 2026");
  });

  test("schedules the next update for when the text changes", () => {
    // 3m20s ago → becomes "4 minutes ago" in 40s.
    expect(format(-3 * MINUTE - 20 * SECOND)?.nextUpdateInMs).toBe(40 * SECOND);
    // in 3m20s → becomes "in 2 minutes" in 20s.
    expect(format(3 * MINUTE + 20 * SECOND)?.nextUpdateInMs).toBe(20 * SECOND);
    // Never faster than once a second, never slower than once an hour.
    expect(format(-30 * SECOND - 999)?.nextUpdateInMs).toBe(SECOND);
    expect(format(-3 * DAY)?.nextUpdateInMs).toBe(HOUR);
  });

  test("returns null for invalid dates", () => {
    expect(formatRelativeTime("not a date", NOW)).toBeNull();
  });
});
