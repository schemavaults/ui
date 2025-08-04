"use client";

import { createContext } from "react";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";
import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";

export type DashboardSidebarItemsAndGroupsDefinitions = readonly (
  | DashboardSidebarItemDefinition
  | DashboardSidebarItemGroupDefinition
)[];

export const DashboardSidebarItemsAndGroupsContext =
  createContext<DashboardSidebarItemsAndGroupsDefinitions>([]);
