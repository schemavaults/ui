import { createContext } from "react";

export interface DashboardLayoutSidebarSizing {
  desktop_collapsed: string;
  desktop_collapsed_classname: string;
  desktop_expanded: string;
  desktop_expanded_classname: string;
  mobile_expanded: string;
  mobile_expanded_classname: string;
  header_height: string;
  header_height_classname: string;
  content_container_desktop_sidebar_open_width_classname: string;
  content_container_desktop_sidebar_open_left_classname: string;
  content_container_desktop_sidebar_closed_width_classname: string;
  content_container_desktop_sidebar_closed_left_classname: string;
  sidebar_menu_item_icon_gap: number;
  sidebar_expanded_menu_group_indent: number;
  sidebar_expanded_menu_group_label_bottom_padding: number;
  sidebar_and_header_z_index_classname: string;
}

export const DEFAULT_DASHBOARD_SIDEBAR_SIZE = {
  desktop_collapsed: `4rem`,
  desktop_collapsed_classname: `w-[4rem]`,
  desktop_expanded: `14rem`,
  desktop_expanded_classname: `w-[14rem]`,
  mobile_expanded: `16rem`,
  mobile_expanded_classname: `w-[16rem]`,
  header_height: `4rem`,
  header_height_classname: `h-[4rem]`,
  content_container_desktop_sidebar_open_width_classname:
    "md:w-[calc(100vw-14rem)]",
  content_container_desktop_sidebar_open_left_classname: "md:left-[14rem]",
  content_container_desktop_sidebar_closed_width_classname:
    "md:w-[calc(100vw-4rem)]",
  content_container_desktop_sidebar_closed_left_classname: "md:left-[4rem]",
  sidebar_menu_item_icon_gap: 8,
  sidebar_expanded_menu_group_indent: 8,
  sidebar_expanded_menu_group_label_bottom_padding: 4,
  sidebar_and_header_z_index_classname: "z-40",
} as const satisfies DashboardLayoutSidebarSizing;

export const DashboardLayoutSidebarSizeContext =
  createContext<DashboardLayoutSidebarSizing>(DEFAULT_DASHBOARD_SIDEBAR_SIZE);
