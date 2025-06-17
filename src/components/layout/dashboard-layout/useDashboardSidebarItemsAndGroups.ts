"use client";

import { useContext } from "react";
import { DashboardSidebarItemsAndGroupsContext } from "./dashboard-sidebar-items-and-groups-context";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";
import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";

export function useDashboardSidebarItemsAndGroups(): readonly (
  | DashboardSidebarItemDefinition
  | DashboardSidebarItemGroupDefinition
)[] {
  return useContext(DashboardSidebarItemsAndGroupsContext);
}
