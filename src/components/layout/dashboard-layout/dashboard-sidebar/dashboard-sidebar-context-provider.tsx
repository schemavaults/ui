"use client";

import { useMemo, type PropsWithChildren, type ReactElement } from "react";
import {
  DashboardSidebarItemsAndGroupsContext,
  type DashboardSidebarItemsAndGroupsDefinitions,
} from "./dashboard-sidebar-items-and-groups-context";
import DashboardSidebarOpenStateProvider from "./dashboard-sidebar-open-state-provider";
import {
  DashboardLayoutSidebarSizeContext,
  DEFAULT_DASHBOARD_SIDEBAR_SIZE,
  type DashboardLayoutSidebarSizing,
} from "./dashboard-sidebar-sizing";

interface DashboardLayoutContextProviderProps extends PropsWithChildren {
  sidebarItems: DashboardSidebarItemsAndGroupsDefinitions;
  sizing?: DashboardLayoutSidebarSizing;
  /**
   * Desktop open (expanded) sidebar width, as any CSS length. When provided,
   * it is reflected into the sizing context's `desktop_expanded_width` so
   * that consumer components reading `useDashboardSidebarSizing()` see the
   * effective value. The actual layout width is driven by the
   * `--dashboard-sidebar-open-width` custom property, which `DashboardLayout`
   * sets on its root container.
   */
  sidebarOpenWidth?: string;
  onOpenSidebar?: () => void;
  onCloseSidebar?: () => void;
}

export function DashboardSidebarContextProvider({
  children,
  sidebarItems,
  ...props
}: DashboardLayoutContextProviderProps): ReactElement {
  const baseSizing: DashboardLayoutSidebarSizing =
    props.sizing ?? DEFAULT_DASHBOARD_SIDEBAR_SIZE;
  const sidebarOpenWidth: string | undefined = props.sidebarOpenWidth;
  const sizing: DashboardLayoutSidebarSizing = useMemo(
    (): DashboardLayoutSidebarSizing =>
      typeof sidebarOpenWidth === "string" && sidebarOpenWidth.length > 0
        ? { ...baseSizing, desktop_expanded_width: sidebarOpenWidth }
        : baseSizing,
    [baseSizing, sidebarOpenWidth],
  );
  return (
    <DashboardSidebarOpenStateProvider
      onOpenSidebar={props.onOpenSidebar}
      onCloseSidebar={props.onCloseSidebar}
    >
      <DashboardSidebarItemsAndGroupsContext.Provider value={sidebarItems}>
        <DashboardLayoutSidebarSizeContext.Provider value={sizing}>
          {children}
        </DashboardLayoutSidebarSizeContext.Provider>
      </DashboardSidebarItemsAndGroupsContext.Provider>
    </DashboardSidebarOpenStateProvider>
  );
}

export default DashboardSidebarContextProvider;
