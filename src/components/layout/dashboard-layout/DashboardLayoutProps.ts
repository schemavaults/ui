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
  onOpenSidebar?: () => void;
  onCloseSidebar?: () => void;
  /**
   * Optional `usePathname` hook (e.g. from `next/navigation`). When provided,
   * the mobile sidebar will automatically close whenever the pathname
   * changes. Pass the hook itself, not its return value.
   */
  usePathname?: () => string;
  /**
   * When `true`, the dashboard "chrome" (the left sidebar and the top header
   * bar) is hidden from printed output via `@media print`, so the system print
   * dialog renders only the main page content. The on-screen layout is
   * unaffected. The main content area also expands to the full page width when
   * printing so it is not offset by the now-hidden sidebar. Defaults to
   * `false`, preserving the previous print behaviour.
   */
  printHidden?: boolean;
}
