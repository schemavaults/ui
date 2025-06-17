"use client";

import type { PropsWithChildren, ReactElement } from "react";
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
}

export function DashboardLayoutContextProvider({
  children,
  sidebarItems,
  ...props
}: DashboardLayoutContextProviderProps): ReactElement {
  return (
    <DashboardSidebarOpenStateProvider>
      <DashboardSidebarItemsAndGroupsContext.Provider value={sidebarItems}>
        <DashboardLayoutSidebarSizeContext.Provider
          value={props.sizing ?? DEFAULT_DASHBOARD_SIDEBAR_SIZE}
        >
          {children}
        </DashboardLayoutSidebarSizeContext.Provider>
      </DashboardSidebarItemsAndGroupsContext.Provider>
    </DashboardSidebarOpenStateProvider>
  );
}

export default DashboardLayoutContextProvider;
