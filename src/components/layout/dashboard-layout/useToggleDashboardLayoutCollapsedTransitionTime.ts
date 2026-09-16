"use client";

import toggleDashboardLayoutCollapsedTransitionTime from "./toggle-dashboard-layout-collapsed-transition-time";
import useDashboardLayoutReducedMotion from "./useDashboardLayoutReducedMotion";

/**
 * The duration, in seconds, of the sidebar expand/collapse animations.
 *
 * `0` when motion is reduced, so the wordmark and the group labels appear and
 * disappear with the sidebar instead of scaling and fading over a third of a
 * second. The staggered delays in those variants are derived from this same
 * value, so they collapse to `0` along with it.
 *
 * Framer Motion's own `reducedMotion` handling only switches off *transform*
 * and layout animations; the width, height and padding animations in the
 * sidebar are none of those, which is why the duration is zeroed explicitly.
 */
export function useToggleDashboardLayoutCollapsedTransitionTime(): number {
  const reduced: boolean = useDashboardLayoutReducedMotion();
  return reduced ? 0 : toggleDashboardLayoutCollapsedTransitionTime;
}

export default useToggleDashboardLayoutCollapsedTransitionTime;
