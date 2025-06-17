"use client";

import { m } from "@/framer-motion";
import type { PropsWithChildren, ReactElement } from "react";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import { useDashboardSidebarSizing } from "./useDashboardSidebarSizing";

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
        },
        desktop_open_sidebar: {
          width: `calc(100vw - ${size.desktop_expanded})`,
          left: size.desktop_expanded,
        },
        desktop_collapsed_sidebar: {
          width: `calc(100vw - ${size.desktop_collapsed})`,
          left: size.desktop_collapsed,
        },
      }}
      animate={
        openState.mobile
          ? "fullscreen"
          : openState.open
            ? "desktop_open_sidebar"
            : "desktop_collapsed_sidebar"
      }
    >
      {children}
    </m.div>
  );
}

export default DashboardLayoutMainContentContainer;
