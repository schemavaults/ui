"use client";

import type { ReactElement, ReactNode } from "react";

import DashboardSidebarHeader from "./dashboard-sidebar-header";
import DashboardSidebarContent from "./dashboard-sidebar-content";
import DashboardSidebarFooter from "./dashboard-sidebar-footer";
import { cn } from "@/lib/utils";
import { useDashboardSidebarSizing } from "./useDashboardSidebarSizing";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import { Separator } from "@/components/ui";
import type { CustomizableDashboardLayoutComponent } from "../customizable-dashboard-component-type";
import type { LinkComponentType } from "@/types/Link";

export interface DashboardLayoutSidebarLayoutProps {
  wordmark: ReactNode;
  logo: ReactNode;
  Link: LinkComponentType;
  brandHref: string;
  sidebarFooterContent?: CustomizableDashboardLayoutComponent;
  className?: string;
}

export function DashboardLayoutSidebarLayout({
  logo,
  wordmark,
  Link,
  brandHref,
  ...props
}: DashboardLayoutSidebarLayoutProps): ReactElement {
  const size = useDashboardSidebarSizing();
  const openState = useDashboardSidebarOpenState();
  const desktop: boolean = !openState.mobile;

  let widthClassName: string;
  if (openState.mobile) {
    widthClassName = size.mobile_expanded_classname;
  } else {
    // desktop
    if (openState.open) {
      widthClassName = size.desktop_expanded_classname;
    } else {
      widthClassName = size.desktop_collapsed_classname;
    }
  }

  return (
    <menu
      className={cn(
        "h-screen max-h-screen",
        desktop ? "absolute" : undefined,
        "transition-[width] ease-linear will-change-[width]",
        "flex flex-col justify-between items-stretch",
        "border-r",
        "p-0",
        size.sidebar_and_header_z_index_classname,
        widthClassName,
        props.className,
      )}
    >
      <DashboardSidebarHeader
        wordmark={wordmark}
        logo={logo}
        Link={Link}
        brandHref={brandHref}
      />
      <Separator />
      <DashboardSidebarContent Link={Link} />
      {typeof props.sidebarFooterContent === "function" && (
        <>
          <Separator />
          <DashboardSidebarFooter
            Link={Link}
            sidebarFooterContent={props.sidebarFooterContent}
          />
        </>
      )}
    </menu>
  );
}

export default DashboardLayoutSidebarLayout;
