export * from "./dashboard-layout";
export type * from "./dashboard-layout";
export { DashboardLayout as default } from "./dashboard-layout";

export type * from "./customizable-dashboard-component-type";

export type { DashboardLayoutReducedMotionSetting } from "./dashboard-layout-reduced-motion";
export { DEFAULT_DASHBOARD_LAYOUT_REDUCED_MOTION_SETTING } from "./dashboard-layout-reduced-motion";
// Exported so consumer-supplied top bar / sidebar footer components can match
// the motion of the layout chrome they are rendered into.
export { useDashboardLayoutReducedMotion } from "./useDashboardLayoutReducedMotion";

export {
  useDashboardSidebarOpenState,
  useDashboardSidebarOpenStateDispatch,
  useCloseDashboardSidebarOnRouteChange,
} from "./dashboard-sidebar";
export type {
  DashboardSidebarItemDefinition,
  DashboardSidebarItemGroupDefinition,
  DashboardSidebarItemsAndGroupsDefinitions,
} from "./dashboard-sidebar";
export { resolveActiveDashboardSidebarItemPath } from "./dashboard-sidebar";
export {
  DASHBOARD_SIDEBAR_OPEN_WIDTH_CSS_VARIABLE,
  DEFAULT_DASHBOARD_SIDEBAR_OPEN_WIDTH,
  DEFAULT_LEADING_SIDEBAR_MENU_GROUP_LABEL_TOP_PADDING,
} from "./dashboard-sidebar";
