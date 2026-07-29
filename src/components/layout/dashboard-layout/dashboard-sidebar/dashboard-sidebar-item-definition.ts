import type { SidebarItemIconComponent } from "./dashboard-sidebar-item-icon-component";

export interface DashboardSidebarItemDefinition {
  type: "dashboard-sidebar-item-definition";
  icon: SidebarItemIconComponent;
  url: string;
  title: string;
  /**
   * Overrides the hover tooltip text for this menu item. When omitted, the
   * tooltip falls back to `title`. Use this to pair a short menu label with
   * an extended description, e.g. a "MFA" item whose tooltip reads
   * "Multi-Factor Authentication".
   */
  tooltip?: string;
}
