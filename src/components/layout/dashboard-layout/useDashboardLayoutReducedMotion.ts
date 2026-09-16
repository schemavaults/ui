"use client";

import { useContext } from "react";
import { MotionConfigContext, useReducedMotionConfig } from "@/framer-motion";
import {
  DEFAULT_DASHBOARD_LAYOUT_REDUCED_MOTION_SETTING,
  type DashboardLayoutReducedMotionSetting,
} from "./dashboard-layout-reduced-motion";

/**
 * The reduced-motion setting in force for the surrounding dashboard layout.
 *
 * `DashboardLayout` publishes its resolved setting through Framer Motion's
 * `MotionConfig`, so this reads it straight back out — no second context to
 * keep in step. Pair it with
 * {@link ./dashboard-layout-reduced-motion!reducedMotionClassName} on any
 * element of the layout that animates in CSS.
 */
export function useDashboardLayoutReducedMotionSetting(): DashboardLayoutReducedMotionSetting {
  return (
    useContext(MotionConfigContext).reducedMotion ??
    DEFAULT_DASHBOARD_LAYOUT_REDUCED_MOTION_SETTING
  );
}

/**
 * Whether the dashboard layout should skip its animations right now.
 *
 * Accounts for both the `prefers-reduced-motion` media query and the layout's
 * `reducedMotion` prop. Use it for the animations that run in JavaScript —
 * Framer Motion's `layout` reflow and animation durations — where a decision
 * has to be made rather than a media query declared. Exported so
 * consumer-supplied top bar and sidebar footer components can match the
 * layout chrome they are rendered into.
 */
export function useDashboardLayoutReducedMotion(): boolean {
  // `useReducedMotionConfig()` is `boolean | null`; null only means the media
  // query has not been read, which is not a preference for reduced motion.
  return useReducedMotionConfig() === true;
}

/**
 * Resolve `DashboardLayout`'s `reducedMotion` prop into the setting it hands
 * to `MotionConfig` for its subtree.
 *
 * When the prop is omitted the default is `"user"`: the layout opts into
 * honouring `prefers-reduced-motion`, unlike Framer Motion, which defaults to
 * `"never"`. An enclosing `MotionConfig` that has already forced
 * `reducedMotion="always"` (an app-wide "reduce motion" preference) is
 * inherited rather than relaxed back to the media query; an enclosing
 * `"never"` is not, since ignoring the viewer's setting should have to be
 * opted into on the layout itself.
 */
export function useResolvedDashboardLayoutReducedMotionSetting(
  setting?: DashboardLayoutReducedMotionSetting,
): DashboardLayoutReducedMotionSetting {
  const inheritedSetting: DashboardLayoutReducedMotionSetting | undefined =
    useContext(MotionConfigContext).reducedMotion;

  if (setting !== undefined) {
    return setting;
  }
  return inheritedSetting === "always"
    ? "always"
    : DEFAULT_DASHBOARD_LAYOUT_REDUCED_MOTION_SETTING;
}

export default useDashboardLayoutReducedMotion;
