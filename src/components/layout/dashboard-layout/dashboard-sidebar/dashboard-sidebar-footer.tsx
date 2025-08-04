"use client";

import type { PropsWithChildren, ReactElement } from "react";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import type { CustomizableDashboardLayoutComponent } from "../customizable-dashboard-component-type";
import useDashboardSidebarSizing from "./useDashboardSidebarSizing";
import type { LinkComponentType } from "@/types/Link";

export interface DashboardSidebarFooterProps {
  Link: LinkComponentType;
  sidebarFooterContent: CustomizableDashboardLayoutComponent;
}

export function DashboardSidebarFooter({
  Link,
  sidebarFooterContent,
}: DashboardSidebarFooterProps): ReactElement {
  const FooterContentComponent = sidebarFooterContent;

  return (
    <footer className="bg-background">
      <FooterContentComponent
        useDashboardSidebarSizing={useDashboardSidebarSizing}
        useDashboardSidebarOpenState={useDashboardSidebarOpenState}
        Link={Link}
      />
    </footer>
  );
}

export default DashboardSidebarFooter;
