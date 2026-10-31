export {
  RelativeTime,
  relativeTimeVariants,
  relativeTimeVariantIds,
  relativeTimeSizeIds,
  relativeTimeFreshnessIds,
  getRelativeTimeFreshness,
} from "./relative-time";
export type * from "./relative-time";
export {
  formatRelativeTime,
  getRelativeTimeParts,
  getRelativeTimeUpdateDelay,
  relativeTimeUnitIds,
  RELATIVE_TIME_UNIT_MS,
  DEFAULT_JUST_NOW_THRESHOLD_MS,
  MAX_RELATIVE_TIME_UPDATE_DELAY_MS,
} from "./format-relative-time";
export type * from "./format-relative-time";
export { RelativeTime as default } from "./relative-time";
