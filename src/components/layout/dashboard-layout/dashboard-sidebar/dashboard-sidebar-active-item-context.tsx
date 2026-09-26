"use client";

import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import {
  DEFAULT_DASHBOARD_SIDEBAR_ACTIVE_ITEM_STYLE,
  normalizeDashboardSidebarPath,
  resolveActiveDashboardSidebarItemPath,
  type DashboardSidebarActiveItemStyle,
} from "./dashboard-sidebar-active-item";
import {
  DashboardSidebarItemsAndGroupsContext,
  type DashboardSidebarItemsAndGroupsDefinitions,
} from "./dashboard-sidebar-items-and-groups-context";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";

export interface DashboardSidebarActiveItemContextValue {
  /**
   * The normalized path of the menu item for the current page, or `null`
   * when the current page is unknown or matches no item.
   */
  activePath: string | null;
  style: DashboardSidebarActiveItemStyle;
}

export const DashboardSidebarActiveItemContext =
  createContext<DashboardSidebarActiveItemContextValue>({
    activePath: null,
    style: DEFAULT_DASHBOARD_SIDEBAR_ACTIVE_ITEM_STYLE,
  });

export interface DashboardSidebarActiveItemProviderProps
  extends PropsWithChildren {
  /** The current page's pathname (or full href). */
  currentPathname?: string;
  activeItemStyle?: DashboardSidebarActiveItemStyle;
}

export function DashboardSidebarActiveItemProvider({
  currentPathname,
  activeItemStyle,
  children,
}: DashboardSidebarActiveItemProviderProps): ReactElement {
  const sidebarItems: DashboardSidebarItemsAndGroupsDefinitions = useContext(
    DashboardSidebarItemsAndGroupsContext,
  );
  const style: DashboardSidebarActiveItemStyle =
    activeItemStyle ?? DEFAULT_DASHBOARD_SIDEBAR_ACTIVE_ITEM_STYLE;
  const activePath: string | null = useMemo(
    (): string | null =>
      resolveActiveDashboardSidebarItemPath(sidebarItems, currentPathname),
    [sidebarItems, currentPathname],
  );
  const value: DashboardSidebarActiveItemContextValue = useMemo(
    (): DashboardSidebarActiveItemContextValue => ({ activePath, style }),
    [activePath, style],
  );
  return (
    <DashboardSidebarActiveItemContext.Provider value={value}>
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
  ...props
}: DashboardSidebarActiveItemFromPathnameHookProviderProps): ReactElement {
  const pathname: string = usePathname();
  return (
    <DashboardSidebarActiveItemProvider
      currentPathname={currentPathname ?? pathname}
      {...props}
    />
  );
}

export interface DashboardSidebarItemActiveState {
  active: boolean;
  style: DashboardSidebarActiveItemStyle;
}

export function useDashboardSidebarItemActiveState(
  item: DashboardSidebarItemDefinition,
): DashboardSidebarItemActiveState {
  const { activePath, style } = useContext(DashboardSidebarActiveItemContext);
  const active: boolean =
    activePath !== null &&
    normalizeDashboardSidebarPath(item.url) === activePath;
  return { active, style };
}
