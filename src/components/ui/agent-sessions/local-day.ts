/**
 * Internal: local calendar-day boundaries for the session list's recency
 * groups. Not re-exported from the package index.
 */

/** Local midnight at the start of the day `ms` falls on. */
export function startOfLocalDay(ms: number): number {
  const date = new Date(ms);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
}

/** Local midnight at the start of the day after the one `ms` falls on. */
export function startOfNextLocalDay(ms: number): number {
  const date = new Date(ms);
  date.setHours(24, 0, 0, 0);
  return date.getTime();
}
