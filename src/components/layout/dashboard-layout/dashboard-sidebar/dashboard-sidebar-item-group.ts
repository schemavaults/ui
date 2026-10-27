import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";

export interface DashboardSidebarItemGroupDefinition {
  type: "dashboard-sidebar-item-group";
  items: readonly DashboardSidebarItemDefinition[];
  title: string;
  adminOnly?: boolean;
  /**
   * Lets the viewer fold the group's links away under its heading. The heading
   * becomes a button with a chevron that collapses and expands the group's
   * list. Defaults to `false`, which renders the group exactly as before.
   *
   * Only the expanded menu folds: the collapsed (icon-only) desktop sidebar
   * shows no headings, so it has no toggle to reopen a group with, and it
   * lists every link whether its group is collapsed or not.
   *
   * The collapsed state is remembered for as long as the layout is mounted,
   * including while the mobile sidebar is closed. A group is identified by its
   * `title`, so keep titles unique among collapsible groups. Use `collapsed`
   * and `onCollapsedChange` to persist it any longer, e.g. across reloads.
   */
  collapsible?: boolean;
  /**
   * Whether a `collapsible` group starts out collapsed. Defaults to `false`.
   *
   * It does not hide the page being viewed: while the group holds the active
   * item (see `DashboardLayout`'s `activeHref` and `usePathname`) it starts
   * expanded instead. Once the viewer toggles the group, their choice wins.
   * Ignored when `collapsed` is supplied.
   */
  defaultCollapsed?: boolean;
  /**
   * The collapsed state of a `collapsible` group, for controlling it from
   * outside. Leave it `undefined` to let the sidebar manage the state itself,
   * starting from `defaultCollapsed`.
   */
  collapsed?: boolean;
  /**
   * Called with the group's new collapsed state when the viewer toggles a
   * `collapsible` group, whether or not `collapsed` is supplied.
   */
  onCollapsedChange?: (collapsed: boolean) => void;
}
