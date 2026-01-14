import type { SidebarItemIconComponent } from "./dashboard-sidebar-item-icon-component";

export interface DashboardSidebarItemDefinition {
  type: "dashboard-sidebar-item-definition";
  icon: SidebarItemIconComponent;
  url: string;
  title: string;
}
