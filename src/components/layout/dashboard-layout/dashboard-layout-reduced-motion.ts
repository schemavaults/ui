/**
 * How `DashboardLayout` decides whether to animate.
 *
 * Mirrors Framer Motion's `MotionConfig` `reducedMotion` setting, which is
 * what the layout hands down to its own `m.*` elements:
 *
 * - `"user"` — follow the `prefers-reduced-motion` media query (the default).
 * - `"always"` — never animate, regardless of the OS setting. Use this to
 *   drive the layout from an in-app "reduce motion" preference.
 * - `"never"` — always animate, ignoring the OS setting.
 */
export type DashboardLayoutReducedMotionSetting = "user" | "always" | "never";

/**
 * `DashboardLayout` honours `prefers-reduced-motion` unless a consumer opts
 * out, so the default setting is `"user"` rather than Framer Motion's own
 * `"never"` default.
 */
export const DEFAULT_DASHBOARD_LAYOUT_REDUCED_MOTION_SETTING =
  "user" as const satisfies DashboardLayoutReducedMotionSetting;

/**
 * Classnames that stop an element's CSS transitions and keyframe animations
 * when motion is reduced.
 *
 * Framer Motion covers the parts of the layout that animate in JavaScript
 * (the wordmark, the group labels, and the `layout` reflow of the menu), but
 * the sidebar width, the content container's width/offset, the header, and
 * the mobile sidebar's slide-in are plain CSS — they have to be switched off
 * in CSS too.
 *
 * Keying this off the setting rather than a resolved boolean is deliberate:
 *
 * - `"user"` becomes a `motion-reduce:` media query, so the preference is
 *   honoured during SSR and before hydration. The sidebar cannot slide once
 *   on first paint and only then start respecting the setting.
 * - `"always"` is a preference no media query can express, so it is applied
 *   unconditionally.
 * - `"never"` emits nothing at all — a media query here would override the
 *   very opt-out the consumer asked for.
 *
 * The utilities are `!important` so they beat the `data-[state]`-qualified
 * animation utilities on the mobile sidebar's `Sheet`, which carry a higher
 * specificity than a plain utility class.
 */
export function reducedMotionClassName(
  setting: DashboardLayoutReducedMotionSetting,
): string {
  switch (setting) {
    case "always":
      return "!transition-none !animate-none";
    case "never":
      return "";
    case "user":
      return "motion-reduce:!transition-none motion-reduce:!animate-none";
  }
}
