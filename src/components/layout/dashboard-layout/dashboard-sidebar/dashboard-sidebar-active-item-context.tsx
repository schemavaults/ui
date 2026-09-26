"use client";

import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import {
  normalizeDashboardSidebarPath,
  resolveActiveDashboardSidebarItemPath,
} from "./dashboard-sidebar-active-item";
import {
  DashboardSidebarItemsAndGroupsContext,
  type DashboardSidebarItemsAndGroupsDefinitions,
} from "./dashboard-sidebar-items-and-groups-context";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";

/**
 * The normalized path of the menu item for the current page, or `null` when
 * the current page is unknown or matches no item.
 */
export const DashboardSidebarActiveItemContext = createContext<string | null>(
  null,
);

export interface DashboardSidebarActiveItemProviderProps
  extends PropsWithChildren {
  /** The current page's pathname (or full href). */
  currentPathname?: string;
}

export function DashboardSidebarActiveItemProvider({
  currentPathname,
  children,
}: DashboardSidebarActiveItemProviderProps): ReactElement {
  const sidebarItems: DashboardSidebarItemsAndGroupsDefinitions = useContext(
    DashboardSidebarItemsAndGroupsContext,
  );
  const activePath: string | null = useMemo(
    (): string | null =>
      resolveActiveDashboardSidebarItemPath(sidebarItems, currentPathname),
    [sidebarItems, currentPathname],
  );
  return (
    <DashboardSidebarActiveItemContext.Provider value={activePath}>
      {children}
    </DashboardSidebarActiveItemContext.Provider>
  );
}

export interface DashboardSidebarActiveItemFromPathnameHookProviderProps
  extends DashboardSidebarActiveItemProviderProps {
  usePathname: () => string;
}

/**
 * Reads the current page from the consumer's `usePathname` hook. Kept as its
 * own component so `DashboardLayout` can choose between this and the plain
 * provider without calling a hook conditionally. An explicit
 * `currentPathname` still wins over the hook's value.
 */
export function DashboardSidebarActiveItemFromPathnameHookProvider({
  usePathname,
  currentPathname,
  children,
}: DashboardSidebarActiveItemFromPathnameHookProviderProps): ReactElement {
  const pathname: string = usePathname();
  return (
    <DashboardSidebarActiveItemProvider
      currentPathname={currentPathname ?? pathname}
    >
      {children}
    </DashboardSidebarActiveItemProvider>
  );
}

/** Whether `item` is the menu item for the page currently being viewed. */
export function useIsDashboardSidebarItemActive(
  item: DashboardSidebarItemDefinition,
): boolean {
  const activePath: string | null = useContext(
    DashboardSidebarActiveItemContext,
  );
  return (
    activePath !== null &&
    normalizeDashboardSidebarPath(item.url) === activePath
  );
}
