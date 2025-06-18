"use client";

import { m } from "@/framer-motion";
import type { PropsWithChildren, ReactElement } from "react";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import { useDashboardSidebarSizing } from "./useDashboardSidebarSizing";
import toggleDashboardLayoutCollapsedTransitionTime from "./toggle-dashboard-layout-collapsed-transition-time";

export interface DashboardLayoutMainContentContainerProps
  extends PropsWithChildren {}

export function DashboardLayoutMainContentContainer({
  children,
}: DashboardLayoutMainContentContainerProps): ReactElement {
  const openState = useDashboardSidebarOpenState();
  const size = useDashboardSidebarSizing();

  return (
    <m.div
      layout
      className="absolute min-h-screen overflow-x-hidden overflow-y-scroll"
      variants={{
        fullscreen: {
          width: "100vw",
          left: 0,
          opacity: 1,
        },
        desktop_open_sidebar: {
          width: `calc(100vw - ${size.desktop_expanded})`,
          left: size.desktop_expanded,
          opacity: 1,
        },
        desktop_collapsed_sidebar: {
          width: `calc(100vw - ${size.desktop_collapsed})`,
          left: size.desktop_collapsed,
          opacity: 1,
        },
        hidden: {
          opacity: 0,
          left: 0,
          width: openState.mobile
            ? "100vw"
            : `calc(100vw - ${size.desktop_expanded})`,
        },
      }}
      initial="hidden"
      animate={
        openState.mobile
          ? "fullscreen"
          : openState.open
            ? "desktop_open_sidebar"
            : "desktop_collapsed_sidebar"
      }
      transition={{
        duration: toggleDashboardLayoutCollapsedTransitionTime,
      }}
    >
      {children}
    </m.div>
  );
}

export default DashboardLayoutMainContentContainer;
