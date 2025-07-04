import type { PropsWithChildren, ReactNode } from "react";
import type { CustomizableDashboardLayoutComponent } from "./customizable-dashboard-component-type";
import type { DashboardSidebarItemsAndGroupsDefinitions } from "./dashboard-sidebar-items-and-groups-context";
import type { DashboardLayoutSidebarSizing } from "./dashboard-sidebar-sizing";
import type { LinkComponentType } from "./link-component-type";

export interface DashboardLayoutProps extends PropsWithChildren {
  wordmark: ReactNode;
  logo: ReactNode;
  Link: LinkComponentType;
  brandHref: string;
  topBarTitle: string | CustomizableDashboardLayoutComponent;
  topBarButtons?: CustomizableDashboardLayoutComponent;
  sidebarFooterContent?: CustomizableDashboardLayoutComponent;
  sidebarItems: DashboardSidebarItemsAndGroupsDefinitions;
  sizing?: DashboardLayoutSidebarSizing;
}
