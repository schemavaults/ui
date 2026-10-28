"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";
import { resolveDashboardSidebarItemGroupCollapsed } from "./dashboard-sidebar-item-group-collapsed";
import { useDashboardSidebarItemGroupContainsActiveItem } from "./dashboard-sidebar-active-item-context";

export interface IDashboardSidebarToggledGroupsContextType {
  /** The collapsed state of each group the viewer has toggled, by title. */
  toggledGroups: ReadonlyMap<string, boolean>;
  setGroupToggled: (title: string, collapsed: boolean) => void;
}

/**
 * The groups the viewer has collapsed or expanded.
 *
 * Held above the sidebar rather than in each group, because the sidebar does
 * not stay mounted: the mobile Sheet unmounts its content every time it
 * closes, and the sidebar swaps between the Sheet and the desktop rail when
 * the viewport crosses the breakpoint. State kept in a group would reset to
 * `defaultCollapsed` on every one of those.
 */
export const DashboardSidebarToggledGroupsContext =
  createContext<IDashboardSidebarToggledGroupsContextType>({
    toggledGroups: new Map<string, boolean>(),
    setGroupToggled: (title: string, collapsed: boolean): void => {
      void title;
      void collapsed;
      throw new Error(
        "Not within <DashboardSidebarToggledGroupsProvider>!",
      );
    },
  });

export function DashboardSidebarToggledGroupsProvider({
  children,
}: PropsWithChildren): ReactElement {
  // A Map rather than a plain object, so that a group titled `constructor` or
  // `__proto__` cannot read a prototype member as its state.
  const [toggledGroups, setToggledGroups] = useState<
    ReadonlyMap<string, boolean>
  >((): ReadonlyMap<string, boolean> => new Map<string, boolean>());

  const setGroupToggled = useCallback(
    (title: string, collapsed: boolean): void => {
      setToggledGroups(
        (
          previous: ReadonlyMap<string, boolean>,
        ): ReadonlyMap<string, boolean> =>
          new Map<string, boolean>(previous).set(title, collapsed),
      );
    },
    [],
  );

  const value: IDashboardSidebarToggledGroupsContextType = useMemo(
    (): IDashboardSidebarToggledGroupsContextType => ({
      toggledGroups,
      setGroupToggled,
    }),
    [toggledGroups, setGroupToggled],
  );

  return (
    <DashboardSidebarToggledGroupsContext.Provider value={value}>
      {children}
    </DashboardSidebarToggledGroupsContext.Provider>
  );
}

export interface DashboardSidebarItemGroupCollapsedState {
  /** Whether the group is collapsed. Always `false` unless `collapsible`. */
  collapsed: boolean;
  /** Collapse an expanded group, or expand a collapsed one. */
  toggle: () => void;
}

/**
 * The collapsed state of a sidebar group, and the toggle for its heading. See
 * {@link resolveDashboardSidebarItemGroupCollapsed} for how it is decided.
 */
export function useDashboardSidebarItemGroupCollapsedState(
  group: DashboardSidebarItemGroupDefinition,
): DashboardSidebarItemGroupCollapsedState {
  const { toggledGroups, setGroupToggled } = useContext(
    DashboardSidebarToggledGroupsContext,
  );
  const containsActiveItem: boolean =
    useDashboardSidebarItemGroupContainsActiveItem(group);

  const collapsed: boolean = resolveDashboardSidebarItemGroupCollapsed(
    group,
    toggledGroups.get(group.title),
    containsActiveItem,
  );

  function toggle(): void {
    const next: boolean = !collapsed;
    // A controlled group's state belongs to its owner, who hears about the
    // toggle below; recording it here as well would resurface as a stale
    // value if the owner ever stopped passing `collapsed`.
    if (group.collapsed === undefined) {
      setGroupToggled(group.title, next);
    }
    group.onCollapsedChange?.(next);
  }

  return { collapsed, toggle };
}
