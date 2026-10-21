/**
 * Splits a fixed number of grid cells between values in proportion to their
 * share of `total`, using the largest-remainder (Hamilton) method so the
 * counts always add up exactly and no value is off by more than one cell.
 *
 * When `total` exceeds the sum of `values`, the leftover share stays
 * unallocated (the returned counts sum to less than `cellCount`). A `total`
 * below the sum is ignored and the sum is used instead.
 */
export function allocateWaffleCells(
  values: readonly number[],
  cellCount: number,
  total?: number,
): number[] {
  const cells: number = Math.max(0, Math.floor(cellCount));
  const clean: number[] = values.map((v) =>
    Number.isFinite(v) && v > 0 ? v : 0,
  );
  const sum: number = clean.reduce((acc, v) => acc + v, 0);
  const denominator: number =
    total !== undefined && Number.isFinite(total) && total > sum ? total : sum;
  if (cells === 0 || denominator <= 0) return clean.map(() => 0);

  const exact: number[] = clean.map((v) => (v / denominator) * cells);
  const counts: number[] = exact.map((x) => Math.floor(x));
  // Cells the values are owed in total; less than `cells` when there is a remainder.
  const target: number = Math.round((sum / denominator) * cells);
  let leftover: number = target - counts.reduce((acc, c) => acc + c, 0);

  // Hand out the leftover cells to the largest fractional parts, ties to the
  // earlier value so the result is stable.
  const order: number[] = exact
    .map((_, i) => i)
    .sort((a, b) => exact[b]! - counts[b]! - (exact[a]! - counts[a]!) || a - b);
  for (const i of order) {
    if (leftover <= 0) break;
    if (clean[i]! <= 0) continue;
    counts[i]! += 1;
    leftover -= 1;
  }
  return counts;
}
