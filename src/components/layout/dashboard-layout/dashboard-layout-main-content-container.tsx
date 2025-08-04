"use client";

import { m } from "@/framer-motion";
import type { PropsWithChildren, ReactElement } from "react";
import {
  useDashboardSidebarSizing,
  useDashboardSidebarOpenState,
} from "./dashboard-sidebar";
import toggleDashboardLayoutCollapsedTransitionTime, {
  toggleDashboardLayoutCollapsedTransitionEasing,
} from "./toggle-dashboard-layout-collapsed-transition-time";
import { cn } from "@/lib/utils";

export interface DashboardLayoutMainContentContainerProps
  extends PropsWithChildren {}

export function DashboardLayoutMainContentContainer({
  children,
}: DashboardLayoutMainContentContainerProps): ReactElement {
  const openState = useDashboardSidebarOpenState();
  const size = useDashboardSidebarSizing();

  return (
    <div
      id="dashboard-layout-main-content-container"
      className={cn(
        "absolute",
        "h-full grow",
        "overflow-x-hidden overflow-y-scroll",
        "max-md:w-screen",
        "transition-[width,left] ease-linear will-change-[width]",
        openState.open
          ? size.content_container_desktop_sidebar_open_width_classname
          : size.content_container_desktop_sidebar_closed_width_classname,
        "max-md:left-0",
        openState.open
          ? size.content_container_desktop_sidebar_open_left_classname
          : size.content_container_desktop_sidebar_closed_left_classname,
      )}
    >
      {children}
    </div>
  );
}

export default DashboardLayoutMainContentContainer;
