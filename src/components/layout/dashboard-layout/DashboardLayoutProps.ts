import type { PropsWithChildren, ReactElement, ReactNode } from "react";
import type { CustomizableDashboardLayoutComponent } from "./customizable-dashboard-component-type";

export interface DashboardLayoutProps extends PropsWithChildren {
  wordmark: ReactNode;
  logo: ReactNode;
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
  brandHref: string;
  topBarTitle: string | CustomizableDashboardLayoutComponent;
  topBarButtons?: CustomizableDashboardLayoutComponent;
  sidebarFooterContent?: CustomizableDashboardLayoutComponent;
}
