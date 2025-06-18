"use client";

import type { PropsWithChildren, ReactElement, ReactNode } from "react";

import DashboardSidebarHeader from "./dashboard-sidebar-header";
import DashboardSidebarContent from "./dashboard-sidebar-content";
import DashboardSidebarFooter from "./dashboard-sidebar-footer";
import { cn } from "@/lib/utils";
import { m } from "@/framer-motion";
import { useDashboardSidebarSizing } from "./useDashboardSidebarSizing";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import { Separator } from "@/components/ui";
import toggleDashboardLayoutCollapsedTransitionTime from "./toggle-dashboard-layout-collapsed-transition-time";
import type { CustomizableDashboardLayoutComponent } from "./customizable-dashboard-component-type";

export interface DashboardLayoutSidebarProps {
  wordmark: ReactNode;
  logo: ReactNode;
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
  brandHref: string;
  sidebarFooterContent?: CustomizableDashboardLayoutComponent;
  className?: string;
}

export function DashboardLayoutSidebar({
  logo,
  wordmark,
  Link,
  brandHref,
  ...props
}: DashboardLayoutSidebarProps): ReactElement {
  const size = useDashboardSidebarSizing();
  const openState = useDashboardSidebarOpenState();
  const desktop: boolean = !openState.mobile;

  return (
    <m.menu
      className={cn(
        "h-screen max-h-screen",
        desktop ? "absolute z-40" : undefined,
        "transition-[width] ease-linear",
        "flex flex-col justify-between items-stretch",
        "border-r",
        "p-0",
        size.sidebar_and_header_z_index_classname,
        props.className,
      )}
      layout
      variants={{
        expanded: {
          width: openState.mobile
            ? size.mobile_expanded
            : size.desktop_expanded,
          opacity: 1,
        },
        collapsed: {
          width: size.desktop_collapsed,
          opacity: 1,
        },
        exit: {
          width: size.desktop_collapsed,
          opacity: 0,
        },
      }}
      initial={openState.mobile ? "expanded" : "collapsed"}
      animate={
        openState.mobile
          ? "expanded"
          : openState.open
            ? "expanded"
            : "collapsed"
      }
      exit={openState.mobile ? "expanded" : "exit"}
      transition={{
        duration: toggleDashboardLayoutCollapsedTransitionTime,
      }}
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
    </m.menu>
  );
}

export default DashboardLayoutSidebar;
