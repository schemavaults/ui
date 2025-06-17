"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { type PropsWithChildren, type ReactElement } from "react";
import DashboardLayoutSidebar from "./dashboard-sidebar";
import type { DashboardLayoutProps } from "./DashboardLayoutProps";
import { DashboardSidebarItemsAndGroupsContext } from "./dashboard-sidebar-items-and-groups-context";

export type { DashboardLayoutProps };

interface DashboardLayoutProvidersProps extends PropsWithChildren {
  open: boolean;
  onOpenChange: (newOpenState: boolean) => void;
  sidebarItems: DashboardLayoutProps["sidebarItems"];
}

function DashboardLayoutProviders({
  children,
  open,
  onOpenChange,
  sidebarItems,
}: DashboardLayoutProvidersProps): ReactElement {
  return (
    <SidebarProvider open={open} onOpenChange={onOpenChange}>
      <DashboardSidebarItemsAndGroupsContext.Provider value={sidebarItems}>
        {children}
      </DashboardSidebarItemsAndGroupsContext.Provider>
    </SidebarProvider>
  );
}

export function DashboardLayout({
  children,
  sidebarItems,
  wordmark,
  logo,
  Link,
  brandHref,
  ...props
}: DashboardLayoutProps): ReactElement {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "[DashboardLayout] rendering with sidebar configuration: ",
      sidebarItems,
    );
  }

  return (
    <DashboardLayoutProviders
      open={props.open}
      onOpenChange={props.onOpenChange}
      sidebarItems={sidebarItems}
    >
      <DashboardLayoutSidebar
        logo={logo}
        wordmark={wordmark}
        Link={Link}
        brandHref={brandHref}
      />
      <div className="absolute left-[11rem]">
        <SidebarTrigger />
        {children}
      </div>
    </DashboardLayoutProviders>
  );
}

export default DashboardLayout;
