import type { PropsWithChildren, ReactNode } from "react";
import type { CustomizableDashboardLayoutComponent } from "./customizable-dashboard-component-type";
import type {
  DashboardSidebarItemsAndGroupsDefinitions,
  DashboardLayoutSidebarSizing,
} from "./dashboard-sidebar";
import type { LinkComponentType } from "@/types/Link";

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
