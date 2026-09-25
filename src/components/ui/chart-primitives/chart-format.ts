/**
 * Default number formatting for chart ticks and readouts: thousands
 * separators and no float noise (`12,500`, `0.35`, `1.5`).
 *
 * The locale is pinned so the server render and the browser agree (a
 * locale-dependent default would be a hydration mismatch); pass a chart's
 * `formatX` / `formatY` / `formatValue` for units or another locale.
 */

const FORMATTERS: Map<number, Intl.NumberFormat> = new Map();

function numberFormat(maximumFractionDigits: number): Intl.NumberFormat {
  const digits: number = Math.max(0, Math.min(20, Math.round(maximumFractionDigits)));
  let formatter: Intl.NumberFormat | undefined = FORMATTERS.get(digits);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: digits,
    });
    FORMATTERS.set(digits, formatter);
  }
  return formatter;
}

/** A readout value: up to two decimals, more for values under 1. */
export function formatChartNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const magnitude: number = Math.abs(value);
  const digits: number =
    magnitude === 0 || magnitude >= 1
      ? 2
      : Math.min(6, 1 - Math.floor(Math.log10(magnitude)));
  return numberFormat(digits).format(value);
}

/** A tick label, with only as many decimals as the tick `step` needs. */
export function formatChartTick(value: number, step: number): string {
  if (!Number.isFinite(value)) return "";
  const digits: number =
    Number.isFinite(step) && step > 0 && step < 1
      ? Math.min(6, Math.ceil(-Math.log10(step) - 1e-9))
      : 0;
  return numberFormat(digits).format(value);
}
