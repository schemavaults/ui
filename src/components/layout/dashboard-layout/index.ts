export * from "./dashboard-layout";
export type * from "./dashboard-layout";
export { DashboardLayout as default } from "./dashboard-layout";

export type * from "./customizable-dashboard-component-type";

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
export {
  DASHBOARD_SIDEBAR_OPEN_WIDTH_CSS_VARIABLE,
  DEFAULT_DASHBOARD_SIDEBAR_OPEN_WIDTH,
} from "./dashboard-sidebar";
