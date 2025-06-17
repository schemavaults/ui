import type { PropsWithChildren, ReactElement, ReactNode } from "react";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";
import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";

export interface DashboardLayoutProps extends PropsWithChildren {
  wordmark: ReactNode;
  logo: ReactNode;
  sidebarItems: readonly (
    | DashboardSidebarItemDefinition
    | DashboardSidebarItemGroupDefinition
  )[];
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
  brandHref: string;
  open: boolean;
  onOpenChange: (newOpenState: boolean) => void;
}
