"use client";

import type { PropsWithChildren, ReactElement, ReactNode } from "react";

import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import DashboardSidebarHeader from "./dashboard-sidebar-header";
import DashboardSidebarContent from "./dashboard-sidebar-content";
import DashboardSidebarFooter from "./dashboard-sidebar-footer";

export interface DashboardLayoutSidebarProps {
  wordmark: ReactNode;
  logo: ReactNode;
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
  brandHref: string;
}

export function DashboardLayoutSidebar({
  logo,
  wordmark,
  Link,
  brandHref,
}: DashboardLayoutSidebarProps): ReactElement {
  return (
    <Sidebar
      side="left"
      collapsible="icon"
      variant="sidebar"
      className="transition-[width] ease-linear"
    >
      <DashboardSidebarHeader
        wordmark={wordmark}
        logo={logo}
        Link={Link}
        brandHref={brandHref}
      />
      <DashboardSidebarContent Link={Link} />
      <DashboardSidebarFooter Link={Link} />
      <SidebarRail />
    </Sidebar>
  );
}

export default DashboardLayoutSidebar;
