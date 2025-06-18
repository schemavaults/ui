import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";

export interface DashboardSidebarItemGroupDefinition {
  type: "dashboard-sidebar-item-group";
  items: readonly DashboardSidebarItemDefinition[];
  title: string;
  adminOnly?: boolean;
}
