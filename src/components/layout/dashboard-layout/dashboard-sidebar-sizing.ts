import { createContext } from "react";

export interface DashboardLayoutSidebarSizing {
  desktop_collapsed: string;
  desktop_expanded: string;
  mobile_expanded: string;
  header_height: string;
  sidebar_menu_item_icon_gap: number;
  sidebar_expanded_menu_group_indent: number;
  sidebar_expanded_menu_group_label_bottom_padding: number;
  sidebar_and_header_z_index_classname: string;
}

export const DASHBOARD_SIDEBAR_WIDTH_COLLAPSED = "4rem";
export const DASHBOARD_SIDEBAR_WIDTH_DESKTOP = "14rem";
export const DASHBOARD_SIDEBAR_WIDTH_MOBILE = "16rem";

export const DASHBOARD_SIDEBAR_HEADER_HEIGHT =
  DASHBOARD_SIDEBAR_WIDTH_COLLAPSED;

export const DEFAULT_DASHBOARD_SIDEBAR_SIZE: DashboardLayoutSidebarSizing = {
  desktop_collapsed: DASHBOARD_SIDEBAR_WIDTH_COLLAPSED,
  desktop_expanded: DASHBOARD_SIDEBAR_WIDTH_DESKTOP,
  mobile_expanded: DASHBOARD_SIDEBAR_WIDTH_MOBILE,
  header_height: DASHBOARD_SIDEBAR_HEADER_HEIGHT,
  sidebar_menu_item_icon_gap: 8,
  sidebar_expanded_menu_group_indent: 8,
  sidebar_expanded_menu_group_label_bottom_padding: 4,
  sidebar_and_header_z_index_classname: "z-40",
};

export const DashboardLayoutSidebarSizeContext =
  createContext<DashboardLayoutSidebarSizing>(DEFAULT_DASHBOARD_SIDEBAR_SIZE);
