import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";

/**
 * Whether a sidebar group's links are folded away under its heading.
 *
 * In order of precedence:
 *
 * 1. A group that is not `collapsible` is never collapsed.
 * 2. A controlled group (`collapsed` supplied) is whatever its owner says.
 * 3. A group the viewer has toggled stays as they left it.
 * 4. Otherwise it starts from `defaultCollapsed` — unless it holds the item
 *    for the page being viewed, which a default must not hide. Only a
 *    default yields to the active item: a viewer who folds that group away
 *    has asked for it, and an owner controlling the state already knows
 *    which page is current.
 *
 * @param toggledCollapsed The state the viewer last toggled the group to, or
 * `undefined` when they have not toggled it.
 * @param containsActiveItem Whether one of the group's items is the menu item
 * for the current page.
 */
export function resolveDashboardSidebarItemGroupCollapsed(
  group: DashboardSidebarItemGroupDefinition,
  toggledCollapsed: boolean | undefined,
  containsActiveItem: boolean,
): boolean {
  if (group.collapsible !== true) {
    return false;
  }
  if (group.collapsed !== undefined) {
    return group.collapsed;
  }
  if (toggledCollapsed !== undefined) {
    return toggledCollapsed;
  }
  return (group.defaultCollapsed ?? false) && !containsActiveItem;
}
