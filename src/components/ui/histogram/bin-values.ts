/**
 * Framework-free binning for `Histogram`: turns raw values into adjacent
 * buckets with round edges.
 */

import { cleanNumber, niceStep } from "@/components/ui/chart-primitives/chart-scale";

/** One histogram bar: the values in `[lower, upper)`. */
export interface HistogramBucket {
  /** Inclusive lower edge. */
  lower: number;
  /** Exclusive upper edge, or `null` for an open-ended overflow bucket. */
  upper: number | null;
  count: number;
}

export const histogramScaleIds = ["linear", "log"] as const satisfies string[];
export type HistogramScaleId = (typeof histogramScaleIds)[number];

export interface BinValuesOptions {
  /**
   * `"linear"` (default): equal-width bins of a nice width (1, 2 or 5 ×
   * 10^k). `"log"`: edges at 0, 1, 2, 5, 10, 20, 50 … up past the largest
   * value, for data spread over orders of magnitude.
   */
  scale?: HistogramScaleId;
  /**
   * The data's resolution: no bin is narrower than this, and log edges start
   * no lower. Pass `1` for whole-number data (milliseconds, counts) so there
   * are no bins with nothing in them by construction. Defaults to `0`.
   */
  minBinWidth?: number;
  /**
   * Linear only: fold values past the 95th percentile into one open-ended
   * overflow bucket when the largest value is more than twice the p95 (and
   * there are at least 20 values), so a long tail doesn't flatten the rest.
   * Defaults to `true`.
   */
  foldTail?: boolean;
  /** Linear only: fewest bins to aim for. Defaults to `8`. */
  minBins?: number;
  /** Linear only: most bins to aim for. Defaults to `40`. */
  maxBins?: number;
}

function ascending(a: number, b: number): number {
  return a - b;
}

/**
 * Percentile `p` (0–1) of ascending-sorted values, interpolating linearly
 * between the closest ranks (like Postgres `percentile_cont`).
 */
function percentile(sorted: readonly number[], p: number): number {
  const rank: number = Math.min(1, Math.max(0, p)) * (sorted.length - 1);
  const lower: number = Math.floor(rank);
  const upper: number = Math.ceil(rank);
  return sorted[lower]! + (sorted[upper]! - sorted[lower]!) * (rank - lower);
}

/** Decimal places that represent multiples of `width` exactly enough for edges. */
function decimalsOf(width: number): number {
  if (!(width > 0) || width >= 1) return 0;
  return Math.min(20, Math.ceil(-Math.log10(width) - 1e-9) + 1);
}

function linearEdges(
  sorted: readonly number[],
  options: Required<Pick<BinValuesOptions, "minBinWidth" | "foldTail" | "minBins" | "maxBins">>,
): { edges: number[]; overflowFrom: number | null } {
  const min: number = sorted[0]!;
  const max: number = sorted[sorted.length - 1]!;
  const p95: number = percentile(sorted, 0.95);
  // Distances from the minimum, so the test doesn't depend on where zero is.
  const hasLongTail: boolean =
    options.foldTail &&
    sorted.length >= 20 &&
    p95 > min &&
    max - min > 2 * (p95 - min);
  const top: number = hasLongTail ? p95 : max;
  const bins: number = Math.min(
    Math.max(1, options.maxBins),
    Math.max(Math.max(1, options.minBins), Math.ceil(Math.sqrt(sorted.length))),
  );
  // Identical values: one bin at the data's resolution (or its decade).
  const width: number =
    top > min
      ? niceStep((top - min) / bins, options.minBinWidth)
      : options.minBinWidth > 0
        ? niceStep(options.minBinWidth)
        : min !== 0
          ? 10 ** Math.floor(Math.log10(Math.abs(min)))
          : 1;
  // Each edge is start + k·width, rounded to the width's own precision (not
  // accumulated, so no float drift), and must move forward: a width below
  // the values' precision (epoch milliseconds binned by 0.1) stops the walk
  // instead of looping forever.
  const decimals: number = decimalsOf(width);
  const edgeAt = (k: number): number =>
    Number((Math.floor(min / width) * width + k * width).toFixed(decimals));
  const edges: number[] = [edgeAt(0)];
  const maxEdges: number = bins * 3 + 3;
  for (let k = 1; edges[edges.length - 1]! <= top && k <= maxEdges; k += 1) {
    const next: number = edgeAt(k);
    if (next <= edges[edges.length - 1]!) break;
    edges.push(next);
  }
  if (edges.length === 1) edges.push(edges[0]! + width);
  return {
    edges,
    overflowFrom: hasLongTail ? edges[edges.length - 1]! : null,
  };
}

/** 0, then the 1-2-5 series from the smallest positive value's decade (or `minBinWidth`) past `max`. */
function logEdges(sorted: readonly number[], minBinWidth: number): number[] {
  const max: number = sorted[sorted.length - 1]!;
  const smallestPositive: number | undefined = sorted.find((v) => v > 0);
  const decade: number =
    smallestPositive === undefined
      ? 1
      : 10 ** Math.floor(Math.log10(smallestPositive));
  let edge: number = niceStep(Math.max(decade, minBinWidth));
  const edges: number[] = [0, edge];
  while (edges[edges.length - 1]! <= max) {
    edge = nextOneTwoFive(edge);
    edges.push(edge);
  }
  return edges;
}

/** The next value in 1, 2, 5, 10, 20, 50 … after `value` (itself on the series). */
function nextOneTwoFive(value: number): number {
  const magnitude: number = 10 ** Math.floor(Math.log10(value) + 1e-9);
  const leading: number = Math.round(value / magnitude);
  const next: number = leading < 2 ? 2 : leading < 5 ? 5 : 10;
  return cleanNumber(next * magnitude);
}

/**
 * Bins `values` for a `Histogram`. Every finite value lands in exactly one
 * bucket (the counts sum to the number of finite values; `NaN` and
 * infinities are skipped). Empty buckets at either end are trimmed; empty
 * buckets inside the range stay, so gaps show.
 *
 * - linear: bins of a nice width starting at the smallest value, about √n of
 *   them (8–40). A long tail past twice the p95 folds into one overflow
 *   bucket (`upper: null`).
 * - log: edges at 0, 1, 2, 5, 10 … (scaled to the data's smallest decade),
 *   up past the largest value. Values at or below 0 count in the first
 *   bucket.
 */
export function binValues(
  values: readonly number[],
  options: BinValuesOptions = {},
): HistogramBucket[] {
  const {
    scale = "linear",
    minBinWidth = 0,
    foldTail = true,
    minBins = 8,
    maxBins = 40,
  } = options;
  const sorted: number[] = values.filter(Number.isFinite).sort(ascending);
  if (sorted.length === 0) return [];

  const safeMinBinWidth: number =
    Number.isFinite(minBinWidth) && minBinWidth > 0 ? minBinWidth : 0;
  const { edges, overflowFrom } =
    scale === "log"
      ? { edges: logEdges(sorted, safeMinBinWidth), overflowFrom: null }
      : linearEdges(sorted, {
          minBinWidth: safeMinBinWidth,
          foldTail,
          minBins,
          maxBins,
        });

  const buckets: HistogramBucket[] = [];
  for (let i = 0; i < edges.length - 1; i += 1) {
    buckets.push({ lower: edges[i]!, upper: edges[i + 1]!, count: 0 });
  }
  if (overflowFrom !== null) {
    buckets.push({ lower: overflowFrom, upper: null, count: 0 });
  }

  let index: number = 0;
  for (const value of sorted) {
    while (
      index < buckets.length - 1 &&
      buckets[index]!.upper !== null &&
      value >= buckets[index]!.upper!
    ) {
      index += 1;
    }
    buckets[index]!.count += 1;
  }

  const first: number = buckets.findIndex((bucket) => bucket.count > 0);
  let last: number = buckets.length - 1;
  while (last > first && buckets[last]!.count === 0) last -= 1;
  return buckets.slice(first, last + 1);
}
