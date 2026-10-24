export interface BulletChartBandSpan {
  from: number;
  to: number;
}

/**
 * Splits `[min, max]` at the ascending `ranges` thresholds that fall strictly
 * inside it; the last band always closes at `max`.
 */
export function resolveBulletChartBands(
  ranges: ReadonlyArray<number>,
  min: number,
  max: number,
): BulletChartBandSpan[] {
  const cuts: number[] = [...ranges]
    .filter((cut) => Number.isFinite(cut) && cut > min && cut < max)
    .sort((a, b) => a - b);
  const bands: BulletChartBandSpan[] = [];
  let from: number = min;
  for (const cut of cuts) {
    if (cut > from) {
      bands.push({ from, to: cut });
      from = cut;
    }
  }
  if (max > from) bands.push({ from, to: max });
  return bands;
}
