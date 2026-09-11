import { createContext } from "react";

/**
 * CSS custom property that carries the desktop *open* (expanded) sidebar
 * width. `DashboardLayout` sets it on its root container from the
 * `sidebarOpenWidth` prop, and the default sizing classnames below read it
 * with a `14rem` fallback — so a consumer can pick any width without needing
 * Tailwind to have generated a matching arbitrary-value class for it.
 */
export const DASHBOARD_SIDEBAR_OPEN_WIDTH_CSS_VARIABLE =
  "--dashboard-sidebar-open-width";

/**
 * The desktop open (expanded) sidebar width used when `sidebarOpenWidth` is
 * not supplied to `DashboardLayout`.
 */
export const DEFAULT_DASHBOARD_SIDEBAR_OPEN_WIDTH = "14rem";

export interface DashboardLayoutSidebarSizing {
  desktop_collapsed_width: string;
  desktop_collapsed_width_classname: string;
  desktop_expanded_width: string;
  desktop_expanded_width_classname: string;
  mobile_expanded_width: string;
  mobile_expanded_width_classname: string;
  header_height: string;
  header_height_classname: string;
  content_container_desktop_sidebar_open_width_classname: string;
  content_container_desktop_sidebar_open_left_classname: string;
  content_container_desktop_sidebar_closed_width_classname: string;
  content_container_desktop_sidebar_closed_left_classname: string;
  sidebar_menu_item_height: string;
  sidebar_menu_item_height_classname: string;
  /**
   * Space, in pixels, between a group's label and the first item beneath it.
   *
   * This is a raw number rather than a Tailwind class because it is animated
   * by Framer Motion as the sidebar expands and collapses (the label's height
   * and padding animate to 0 on collapse), and Framer needs a numeric target.
   *
   * Keep it equal to `sidebar_menu_item_gap_classname` expressed in pixels —
   * the default `gap-2` is 0.5rem, i.e. 8px. A mismatch is exactly what made
   * grouped items sit on a different vertical rhythm than ungrouped ones.
   */
  sidebar_expanded_menu_group_label_bottom_padding: number;
  sidebar_and_header_z_index_classname: string;
  /**
   * The single vertical rhythm for the sidebar menu. Applied to every list of
   * menu items — the ungrouped run at the top level and each group's own list
   * — so both paths space their rows identically.
   */
  sidebar_menu_item_gap_classname: string;
  /**
   * @deprecated No longer read by any sidebar component. Group labels are now
   * aligned to the icon column (`desktop_collapsed_width`) so that a group
   * heading and the item titles below it share a left edge; menu item rows
   * themselves are full-bleed so their hover state spans the sidebar. Retained
   * so that consumers passing a complete `sizing` object keep type-checking.
   */
  sidebar_menu_item_x_margin_classname: string;
}

export const DEFAULT_DASHBOARD_SIDEBAR_SIZE = {
  desktop_collapsed_width: `4rem`,
  desktop_collapsed_width_classname: `w-[4rem]`,
  desktop_expanded_width: DEFAULT_DASHBOARD_SIDEBAR_OPEN_WIDTH,
  // Reads the `--dashboard-sidebar-open-width` custom property (falling back
  // to 14rem) so `DashboardLayout`'s `sidebarOpenWidth` prop can override the
  // expanded width with an inline CSS variable. Keep this, the two
  // `content_container_desktop_sidebar_open_*` classnames below, and
  // `DEFAULT_DASHBOARD_SIDEBAR_OPEN_WIDTH` in sync.
  desktop_expanded_width_classname: `w-[var(--dashboard-sidebar-open-width,14rem)]`,
  mobile_expanded_width: `16rem`,
  mobile_expanded_width_classname: `w-[16rem]`,
  header_height: `4rem`,
  header_height_classname: `h-[4rem]`,
  content_container_desktop_sidebar_open_width_classname:
    "md:w-[calc(100%-var(--dashboard-sidebar-open-width,14rem))]",
  content_container_desktop_sidebar_open_left_classname:
    "md:left-[var(--dashboard-sidebar-open-width,14rem)]",
  content_container_desktop_sidebar_closed_width_classname:
    "md:w-[calc(100%-4rem)]",
  content_container_desktop_sidebar_closed_left_classname: "md:left-[4rem]",
  sidebar_menu_item_height: "2.5rem",
  sidebar_menu_item_height_classname: "h-[2.5rem]",
  // 8px === gap-2 === sidebar_menu_item_gap_classname. See the doc comment on
  // the interface field before changing this.
  sidebar_expanded_menu_group_label_bottom_padding: 8,
  sidebar_and_header_z_index_classname: "z-40",
  sidebar_menu_item_gap_classname: "gap-2",
  sidebar_menu_item_x_margin_classname: "mx-2",
} as const satisfies DashboardLayoutSidebarSizing;

export const DashboardLayoutSidebarSizeContext =
  createContext<DashboardLayoutSidebarSizing>(DEFAULT_DASHBOARD_SIDEBAR_SIZE);
