import type { ReactNode } from "react";

type SidebarItemIconComponent = ({
  className,
}: {
  className: string;
}) => ReactNode;

export interface DashboardSidebarItemDefinition {
  type: "dashboard-sidebar-item-definition";
  icon: SidebarItemIconComponent;
  url: string;
  title: string;
}
