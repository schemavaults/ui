/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";

import {
  formatRelativeTime,
  getRelativeTimeParts,
  getRelativeTimeUpdateDelay,
  MAX_RELATIVE_TIME_UPDATE_DELAY_MS,
} from "./format-relative-time";

const NOW = Date.UTC(2026, 9, 31, 12, 0, 0);
const S = 1000;
const M = 60 * S;
const H = 60 * M;
const D = 24 * H;

function fmt(offsetMs: number, extra: Parameters<typeof formatRelativeTime>[1] = {}): string {
  return formatRelativeTime(NOW + offsetMs, { now: NOW, locale: "en-US", ...extra });
}

describe("formatRelativeTime", () => {
  test("just-now window on both sides", () => {
    expect(fmt(0)).toBe("just now");
    expect(fmt(-44 * S)).toBe("just now");
    expect(fmt(30 * S)).toBe("just now");
    expect(fmt(-10 * S, { nowLabel: "now" })).toBe("now");
  });

  test("picks the largest fitting unit and floors the count", () => {
    expect(fmt(-50 * S)).toBe("50 seconds ago");
    expect(fmt(-90 * S)).toBe("1 minute ago");
    expect(fmt(-59 * M - 59 * S)).toBe("59 minutes ago");
    expect(fmt(-60 * M)).toBe("1 hour ago");
    expect(fmt(-119 * M)).toBe("1 hour ago");
    expect(fmt(-25 * H)).toBe("1 day ago");
    expect(fmt(-8 * D)).toBe("1 week ago");
    expect(fmt(-45 * D)).toBe("1 month ago");
    expect(fmt(-400 * D)).toBe("1 year ago");
    expect(fmt(3 * D + H)).toBe("in 3 days");
  });

  test("min/max units clamp the scale", () => {
    expect(fmt(-45 * D, { maxUnit: "day" })).toBe("45 days ago");
    expect(fmt(-50 * S, { minUnit: "minute", justNowThresholdMs: 0 })).toBe("just now");
    expect(fmt(-3 * M, { minUnit: "hour" })).toBe("just now");
  });

  test("style and numeric pass through to Intl", () => {
    expect(fmt(-D - H, { numeric: "auto" })).toBe("yesterday");
    expect(fmt(-5 * M, { style: "short" })).toBe("5 min. ago");
  });

  test("invalid dates do not throw", () => {
    expect(getRelativeTimeParts("not a date", { now: NOW }).isNow).toBe(true);
  });
});

describe("getRelativeTimeUpdateDelay", () => {
  test("past timestamps wake at the next unit boundary", () => {
    expect(getRelativeTimeUpdateDelay(NOW - 90 * S, { now: NOW })).toBe(30 * S);
    expect(getRelativeTimeUpdateDelay(NOW - 10 * S, { now: NOW })).toBe(35 * S);
    expect(getRelativeTimeUpdateDelay(NOW - 50 * S, { now: NOW })).toBe(S);
  });

  test("future timestamps wake when the count drops", () => {
    expect(getRelativeTimeUpdateDelay(NOW + 5 * M + 20 * S, { now: NOW })).toBe(20 * S + 1);
  });

  test("never sleeps longer than the cap", () => {
    expect(getRelativeTimeUpdateDelay(NOW - 400 * D, { now: NOW })).toBe(
      MAX_RELATIVE_TIME_UPDATE_DELAY_MS,
    );
  });

  test("the label actually changes after the delay (past)", () => {
    for (const offset of [-47 * S, -90 * S, -3 * H - 5 * M, -6 * D - 23 * H]) {
      const date = NOW + offset;
      const delay = getRelativeTimeUpdateDelay(date, { now: NOW });
      if (delay >= MAX_RELATIVE_TIME_UPDATE_DELAY_MS) continue;
      const before = formatRelativeTime(date, { now: NOW + delay - 1, locale: "en-US" });
      const after = formatRelativeTime(date, { now: NOW + delay, locale: "en-US" });
      expect(after).not.toBe(before);
    }
  });
});
