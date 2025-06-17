import type { ReactElement, ReactNode } from "react";

export interface DashboardSidebarItemDefinition {
  type: "dashboard-sidebar-item-definition";
  icon?: ReactNode | ReactElement;
  url: string;
  title: string;
}
