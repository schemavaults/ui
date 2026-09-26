import type { DashboardSidebarActiveItemStyle } from "./dashboard-sidebar-active-item";

export interface DashboardSidebarActiveItemClassNames {
  /**
   * Classes for the decoration painted behind the active row's icon and
   * label — a fill, an edge bar, or a pill — or `null` when the style has
   * none. The element is absolutely positioned inside the row's link, so it
   * never shifts the icon column or the label.
   */
  indicator: string | null;
  /** Colour and weight for the active row's icon and label. */
  content: string;
}

/**
 * The classes for each active item style, in a normal group and in an
 * `adminOnly` group. Admin rows are red whether or not they are active, so
 * their active treatment swaps the neutral or blue accent for red rather than
 * losing the colour that marks them as admin-only.
 */
export function getDashboardSidebarActiveItemClassNames(
  style: DashboardSidebarActiveItemStyle,
  adminOnly: boolean,
): DashboardSidebarActiveItemClassNames {
  switch (style) {
    case "highlight":
      return adminOnly
        ? { indicator: "inset-0 bg-red-500/10", content: "font-semibold text-red-500" }
        : { indicator: "inset-0 bg-primary/10", content: "font-semibold text-foreground" };
    case "right-border":
      return adminOnly
        ? { indicator: "inset-y-0 right-0 w-1 bg-red-500", content: "font-semibold text-red-500" }
        : { indicator: "inset-y-0 right-0 w-1 bg-primary", content: "font-semibold text-foreground" };
    case "color-shift":
      return adminOnly
        ? { indicator: null, content: "font-semibold text-red-600 dark:text-red-400" }
        : { indicator: null, content: "font-semibold text-blue-600 dark:text-blue-400" };
    case "tinted":
      return adminOnly
        ? {
            indicator:
              "inset-0 border-l-4 border-red-600 bg-red-500/10 dark:border-red-400 dark:bg-red-400/15",
            content: "font-semibold text-red-700 dark:text-red-300",
          }
        : {
            indicator:
              "inset-0 border-l-4 border-blue-600 bg-blue-500/10 dark:border-blue-400 dark:bg-blue-400/15",
            content: "font-semibold text-blue-700 dark:text-blue-300",
          };
    case "solid":
      return adminOnly
        ? { indicator: "inset-x-2 inset-y-0.5 rounded-md bg-red-600", content: "font-medium text-white" }
        : {
            indicator: "inset-x-2 inset-y-0.5 rounded-md bg-primary",
            content: "font-medium text-primary-foreground",
          };
    case "none":
      return adminOnly
        ? { indicator: null, content: "text-red-500" }
        : { indicator: null, content: "text-foreground" };
  }
}
