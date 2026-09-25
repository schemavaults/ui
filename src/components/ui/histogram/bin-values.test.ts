/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";

import { binValues, type HistogramBucket } from "./bin-values";

function totalCount(buckets: readonly HistogramBucket[]): number {
  return buckets.reduce((sum, bucket) => sum + bucket.count, 0);
}

/** Every bucket starts where the previous one ended. */
function expectAdjacent(buckets: readonly HistogramBucket[]): void {
  for (let i = 1; i < buckets.length; i += 1) {
    expect(buckets[i]!.lower).toBe(buckets[i - 1]!.upper as number);
  }
}

/**
 * 1,000 durations shaped like the /admin/traces sample (median 30 ms, p95
 * 499 ms, max 3.97 s), built from evenly spaced quantiles so it is stable.
 */
function traceLikeSample(): number[] {
  return Array.from({ length: 1_000 }, (_, i): number => {
    const u: number = i / 999;
    if (u <= 0.5) return Math.round((u / 0.5) * 30);
    if (u <= 0.95) return Math.round(30 + ((u - 0.5) / 0.45) * 469);
    return Math.round(500 + ((u - 0.95) / 0.05) ** 2 * 3_470);
  });
}

describe("binValues", () => {
  test("is empty for no values", () => {
    expect(binValues([])).toEqual([]);
    expect(binValues([], { scale: "log" })).toEqual([]);
  });

  test("skips NaN and infinities and keeps every finite value", () => {
    const buckets = binValues([1, Number.NaN, 2, Number.POSITIVE_INFINITY, 3]);
    expect(totalCount(buckets)).toBe(3);
  });

  test("bins linearly with a nice width from the smallest value", () => {
    const values: number[] = Array.from({ length: 100 }, (_, i) => i * 3);
    const buckets = binValues(values, { minBinWidth: 1 });
    expect(totalCount(buckets)).toBe(100);
    expectAdjacent(buckets);
    const width: number = buckets[0]!.upper! - buckets[0]!.lower;
    expect([1, 2, 5, 10, 20, 50, 100]).toContain(width);
    expect(buckets[0]!.lower).toBe(0);
    // √100 = 10 bins asked for; rounding the width up to a nice one leaves
    // somewhat fewer.
    expect(buckets.length).toBeGreaterThanOrEqual(4);
    expect(buckets.length).toBeLessThanOrEqual(10);
    // No overflow bucket without a long tail.
    expect(buckets.every((bucket) => bucket.upper !== null)).toBe(true);
  });

  test("puts identical values in a single bin at the data's resolution", () => {
    expect(binValues([5, 5, 5], { minBinWidth: 1 })).toEqual([
      { lower: 5, upper: 6, count: 3 },
    ]);
    const buckets = binValues([0.25, 0.25]);
    expect(buckets).toHaveLength(1);
    expect(buckets[0]!.count).toBe(2);
    expect(buckets[0]!.lower).toBeLessThanOrEqual(0.25);
    expect(buckets[0]!.upper!).toBeGreaterThan(0.25);
  });

  test("never makes bins narrower than minBinWidth", () => {
    const buckets = binValues([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], {
      minBinWidth: 5,
    });
    for (const bucket of buckets) {
      expect(bucket.upper! - bucket.lower).toBeGreaterThanOrEqual(5);
    }
    expect(totalCount(buckets)).toBe(11);
  });

  test("folds a long tail past the p95 into an open-ended overflow bucket", () => {
    const values: number[] = [
      ...Array.from({ length: 95 }, (_, i) => i % 50),
      ...Array.from({ length: 5 }, (_, i) => 2_000 + i * 1_000),
    ];
    const buckets = binValues(values, { minBinWidth: 1 });
    const overflow = buckets[buckets.length - 1]!;
    expect(overflow.upper).toBeNull();
    expect(overflow.count).toBeGreaterThanOrEqual(5);
    expect(totalCount(buckets)).toBe(100);
    expectAdjacent(buckets.slice(0, -1));
    // The regular bins stop near the p95, not at the maximum.
    expect(overflow.lower).toBeLessThan(2_000);
  });

  test("does not fold a tail that isn't there when the data sits below zero", () => {
    const uniformNegative: number[] = Array.from({ length: 101 }, (_, i) => -100 + i);
    const buckets = binValues(uniformNegative, { minBinWidth: 1 });
    expect(buckets.every((bucket) => bucket.upper !== null)).toBe(true);
    expect(totalCount(buckets)).toBe(101);

    const mixedSign: number[] = Array.from({ length: 111 }, (_, i) => -100 + i);
    const mixed = binValues(mixedSign, { minBinWidth: 1 });
    expect(mixed.every((bucket) => bucket.upper !== null)).toBe(true);
    expect(mixed[0]!.lower).toBeLessThanOrEqual(-100);
    expect(mixed[mixed.length - 1]!.upper!).toBeGreaterThan(10);
    expect(totalCount(mixed)).toBe(111);
  });

  test("terminates and keeps every value when bins are finer than the values' precision", () => {
    // Epoch milliseconds a tenth of a millisecond apart: 13 significant digits.
    const epochs: number[] = Array.from({ length: 50 }, (_, i) => 1_727_000_000_000 + i * 0.1);
    const buckets = binValues(epochs);
    expect(totalCount(buckets)).toBe(50);
    expect(buckets.length).toBeGreaterThan(1);
    expectAdjacent(buckets);

    const wholeMs: number[] = Array.from({ length: 50 }, (_, i) => 1e12 + i);
    const whole = binValues(wholeMs, { minBinWidth: 1 });
    expect(totalCount(whole)).toBe(50);
    // Bins keep their nice width instead of drifting.
    for (const bucket of whole) {
      expect(bucket.upper! - bucket.lower).toBe(whole[0]!.upper! - whole[0]!.lower);
    }
  });

  test("keeps the tail when folding is off", () => {
    const values: number[] = [
      ...Array.from({ length: 95 }, (_, i) => i % 50),
      ...Array.from({ length: 5 }, (_, i) => 2_000 + i * 1_000),
    ];
    const buckets = binValues(values, { minBinWidth: 1, foldTail: false });
    expect(buckets.every((bucket) => bucket.upper !== null)).toBe(true);
    expect(buckets[buckets.length - 1]!.upper!).toBeGreaterThan(6_000);
    expect(totalCount(buckets)).toBe(100);
  });

  test("keeps empty buckets inside the range and trims them at the ends", () => {
    const values: number[] = [
      ...Array.from({ length: 30 }, () => 10),
      ...Array.from({ length: 30 }, () => 90),
    ];
    const buckets = binValues(values, { minBinWidth: 1 });
    expect(buckets[0]!.count).toBeGreaterThan(0);
    expect(buckets[buckets.length - 1]!.count).toBeGreaterThan(0);
    expect(buckets.some((bucket) => bucket.count === 0)).toBe(true);
    expect(totalCount(buckets)).toBe(60);
  });

  test("bins logarithmically on the 1-2-5 series and trims empty edges", () => {
    expect(binValues([3, 4, 60, 1_500], { scale: "log", minBinWidth: 1 })).toEqual([
      { lower: 2, upper: 5, count: 2 },
      { lower: 5, upper: 10, count: 0 },
      { lower: 10, upper: 20, count: 0 },
      { lower: 20, upper: 50, count: 0 },
      { lower: 50, upper: 100, count: 1 },
      { lower: 100, upper: 200, count: 0 },
      { lower: 200, upper: 500, count: 0 },
      { lower: 500, upper: 1_000, count: 0 },
      { lower: 1_000, upper: 2_000, count: 1 },
    ]);
  });

  test("puts zeros in the first log bucket", () => {
    expect(binValues([0, 0], { scale: "log", minBinWidth: 1 })).toEqual([
      { lower: 0, upper: 1, count: 2 },
    ]);
    const buckets = binValues([0, 0, 7], { scale: "log", minBinWidth: 1 });
    expect(buckets[0]).toEqual({ lower: 0, upper: 1, count: 2 });
    expect(totalCount(buckets)).toBe(3);
  });

  test("scales log edges to the data's smallest decade", () => {
    const buckets = binValues([0.003, 0.02, 0.4], { scale: "log" });
    // Edges 0, 0.001, 0.002, 0.005, 0.01 …; the empty leading ones are trimmed.
    expect(buckets[0]).toEqual({ lower: 0.002, upper: 0.005, count: 1 });
    expect(buckets[buckets.length - 1]).toEqual({ lower: 0.2, upper: 0.5, count: 1 });
    expect(totalCount(buckets)).toBe(3);
    expectAdjacent(buckets);
  });

  test("gives the auth server's trace sample ~25 bins up to 500 ms plus an overflow bar", () => {
    const values: number[] = traceLikeSample();
    const buckets = binValues(values, { minBinWidth: 1 });
    const overflow = buckets[buckets.length - 1]!;
    expect(overflow.upper).toBeNull();
    const regular = buckets.slice(0, -1);
    expect(regular.length).toBeGreaterThanOrEqual(20);
    expect(regular.length).toBeLessThanOrEqual(30);
    expect(regular[regular.length - 1]!.upper!).toBeGreaterThanOrEqual(480);
    expect(regular[regular.length - 1]!.upper!).toBeLessThanOrEqual(600);
    expect(totalCount(buckets)).toBe(1_000);
  });
});
