/**
 * Framework-free geometry and tick helpers shared by the chart components.
 */

/**
 * The smallest "nice" step (1, 2 or 5 × 10^k) that is at least `rawStep`,
 * never below `minStep` (1 for whole-number data such as counts).
 */
export function niceStep(rawStep: number, minStep: number = 0): number {
  if (!Number.isFinite(rawStep) || rawStep <= 0) {
    return Math.max(minStep, 1);
  }
  const magnitude: number = 10 ** Math.floor(Math.log10(rawStep));
  const residual: number = rawStep / magnitude;
  const nice: number =
    residual <= 1 ? 1 : residual <= 2 ? 2 : residual <= 5 ? 5 : 10;
  return Math.max(minStep, nice * magnitude);
}

/** Rounds away float drift (0.1 + 0.2) so tick labels stay clean. */
export function cleanNumber(value: number): number {
  return Number(value.toPrecision(12));
}

export interface NiceAxis {
  ticks: number[];
  /** The last tick: the top of the scale. */
  top: number;
  step: number;
}

/**
 * A zero-based value axis: nice ticks from 0 up to the first tick at or
 * above `max`, with about `target` intervals.
 */
export function niceAxis(
  max: number,
  target: number = 4,
  minStep: number = 0,
): NiceAxis {
  const safeMax: number = Number.isFinite(max) ? Math.max(0, max) : 0;
  const step: number = niceStep(safeMax / Math.max(1, target), minStep);
  const top: number = Math.max(step, Math.ceil(cleanNumber(safeMax / step)) * step);
  const ticks: number[] = [];
  for (let value = 0; value <= top + step * 1e-9; value += step) {
    ticks.push(cleanNumber(value));
  }
  return { ticks, top: cleanNumber(top), step };
}

/**
 * Log-scale ticks at whole decades covering `[min, max]`. The bottom decade
 * is the one holding the smallest positive value, so zeros and negatives
 * (which a log scale cannot place) sit on the bottom line.
 */
export function logDecadeTicks(min: number, max: number): number[] {
  const floor: number =
    Number.isFinite(min) && min > 0 ? Math.floor(Math.log10(min)) : 0;
  const ceiling: number =
    Number.isFinite(max) && max > 0
      ? Math.max(floor + 1, Math.ceil(cleanNumber(Math.log10(max))))
      : floor + 1;
  const ticks: number[] = [];
  for (let exponent = floor; exponent <= ceiling; exponent += 1) {
    ticks.push(cleanNumber(10 ** exponent));
  }
  return ticks;
}

/** Evenly spaced indices (always the first and last) so at most `maxLabels` labels render. */
export function thinIndices(count: number, maxLabels: number): number[] {
  if (count <= 0) return [];
  if (count <= maxLabels) {
    return Array.from({ length: count }, (_, index: number): number => index);
  }
  const step: number = Math.ceil((count - 1) / Math.max(1, maxLabels - 1));
  const indices: number[] = [];
  for (let index = 0; index < count - 1; index += step) {
    indices.push(index);
  }
  // Drop the last regular label when it would crowd the closing one.
  if (count - 1 - indices[indices.length - 1]! < step / 2 && indices.length > 1) {
    indices.pop();
  }
  indices.push(count - 1);
  return indices;
}

/** Index of the value in ascending `sorted` closest to `target`; -1 when empty. */
export function nearestSortedIndex(
  sorted: readonly number[],
  target: number,
): number {
  if (sorted.length === 0) return -1;
  let low: number = 0;
  let high: number = sorted.length - 1;
  while (low < high) {
    const mid: number = (low + high) >> 1;
    if (sorted[mid]! < target) low = mid + 1;
    else high = mid;
  }
  if (low > 0 && Math.abs(sorted[low - 1]! - target) <= Math.abs(sorted[low]! - target)) {
    return low - 1;
  }
  return low;
}

export type BarFreeEnd = "top" | "right";

/**
 * SVG path of a bar with its free end rounded (`radius`, clamped to the
 * bar's size) and a square end on the baseline: the top for columns, the
 * right for horizontal bars.
 */
export function roundedBarPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  freeEnd: BarFreeEnd = "top",
): string {
  if (!(width > 0) || !(height > 0)) return "";
  const f = (value: number): string => value.toFixed(2);
  if (freeEnd === "right") {
    const r: number = Math.max(0, Math.min(radius, height / 2, width));
    const right: number = x + width;
    return [
      `M${f(x)},${f(y)}`,
      `H${f(right - r)}`,
      `Q${f(right)},${f(y)} ${f(right)},${f(y + r)}`,
      `V${f(y + height - r)}`,
      `Q${f(right)},${f(y + height)} ${f(right - r)},${f(y + height)}`,
      `H${f(x)}`,
      "Z",
    ].join(" ");
  }
  const r: number = Math.max(0, Math.min(radius, width / 2, height));
  const bottom: number = y + height;
  return [
    `M${f(x)},${f(bottom)}`,
    `V${f(y + r)}`,
    `Q${f(x)},${f(y)} ${f(x + r)},${f(y)}`,
    `H${f(x + width - r)}`,
    `Q${f(x + width)},${f(y)} ${f(x + width)},${f(y + r)}`,
    `V${f(bottom)}`,
    "Z",
  ].join(" ");
}

/**
 * The 1, 2 or 5 × 10^k step that splits `span` into the count of intervals
 * closest to `count` (d3's rounding), rather than the next one up.
 */
export function closestNiceStep(span: number, count: number): number {
  if (!Number.isFinite(span) || span <= 0) return 1;
  const raw: number = span / Math.max(1, count);
  const power: number = Math.floor(Math.log10(raw));
  const error: number = raw / 10 ** power;
  const factor: number =
    error >= Math.sqrt(50) ? 10 : error >= Math.sqrt(10) ? 5 : error >= Math.SQRT2 ? 2 : 1;
  return factor * 10 ** power;
}

/**
 * Round tick values inside `[min, max]` (the domain itself is left alone),
 * about `count` intervals apart.
 */
export function niceTicksWithin(min: number, max: number, count: number): number[] {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [];
  if (max <= min) return [cleanNumber(min)];
  const step: number = closestNiceStep(max - min, count);
  const first: number = Math.ceil(cleanNumber(min / step)) * step;
  const ticks: number[] = [];
  for (let value = first; value <= max + step * 1e-9; value += step) {
    ticks.push(cleanNumber(value));
  }
  return ticks;
}

/** Rough width of a tick label: SVG text can't be measured before it renders. */
export function estimateLabelWidth(text: string, fontPx: number): number {
  return text.length * fontPx * 0.62;
}

/**
 * Drops axis labels that would overlap their neighbour at `fontPx`, keeping
 * the first and (when it fits) the last, so ticks thin out on a narrow chart
 * instead of running together.
 */
export function thinLabels<T extends { x: number; text: string }>(
  labels: ReadonlyArray<T>,
  fontPx: number,
  minGap: number = 8,
): T[] {
  const half = (label: T): number => estimateLabelWidth(label.text, fontPx) / 2;
  const fits = (left: T, right: T): boolean =>
    right.x - half(right) >= left.x + half(left) + minGap;
  const kept: T[] = [];
  for (const label of labels) {
    const previous: T | undefined = kept[kept.length - 1];
    if (!previous || fits(previous, label)) kept.push(label);
  }
  const last: T | undefined = labels[labels.length - 1];
  // Prefer ending on the last label (the domain's end) over its neighbour.
  if (last && kept.length > 1 && kept[kept.length - 1] !== last) {
    const dropped: T = kept.pop()!;
    kept.push(fits(kept[kept.length - 1]!, last) ? last : dropped);
  }
  return kept;
}
