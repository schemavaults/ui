"use client";

import { useContext } from "react";
import { DashboardSidebarItemsAndGroupsContext } from "./dashboard-sidebar-items-and-groups-context";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";
import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";

export function useDashboardSidebarItemsAndGroups(): readonly (
  | DashboardSidebarItemDefinition
  | DashboardSidebarItemGroupDefinition
)[] {
  const sidebarItems = useContext(DashboardSidebarItemsAndGroupsContext);
  if (!Array.isArray(sidebarItems) || sidebarItems.length === 0) {
    throw new Error();
  }
  return sidebarItems;
}

export default useDashboardSidebarItemsAndGroups;