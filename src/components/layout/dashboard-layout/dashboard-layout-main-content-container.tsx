"use client";

import type { PropsWithChildren, ReactElement } from "react";
import {
  useDashboardSidebarSizing,
  useDashboardSidebarOpenState,
} from "./dashboard-sidebar";
import { cn } from "@/lib/utils";

export interface DashboardLayoutMainContentContainerProps
  extends PropsWithChildren {
  /**
   * When `true`, the content area drops its sidebar-aware absolute positioning
   * under `@media print` and fills the full page width. This pairs with the
   * sidebar/header being hidden for print so the printed content is not offset
   * by, or clipped to, the now-hidden chrome.
   */
  printHidden?: boolean;
}

export function DashboardLayoutMainContentContainer({
  children,
  printHidden = false,
}: DashboardLayoutMainContentContainerProps): ReactElement {
  const openState = useDashboardSidebarOpenState();
  const size = useDashboardSidebarSizing();

  return (
    <div
      id="dashboard-layout-main-content-container"
      className={cn(
        "absolute",
        "h-full grow",
        "flex flex-col flex-nowrap justify-start items-stretch",
        "overflow-x-hidden overflow-y-scroll",
        "overscroll-none",
        "no-scrollbar",
        "max-md:w-full",
        "transition-[width,left] ease-linear will-change-[width]",
        openState.open
          ? size.content_container_desktop_sidebar_open_width_classname
          : size.content_container_desktop_sidebar_closed_width_classname,
        "max-md:left-0",
        openState.open
          ? size.content_container_desktop_sidebar_open_left_classname
          : size.content_container_desktop_sidebar_closed_left_classname,
        // For print, expand to the full page (the sidebar/header are hidden)
        // and allow content to flow across pages instead of scrolling within a
        // viewport-height box.
        printHidden &&
          "print:static print:left-0 print:h-auto print:w-full print:overflow-visible",
      )}
    >
      {children}
    </div>
  );
}

export default DashboardLayoutMainContentContainer;
