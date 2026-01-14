import { createContext } from "react";

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
  sidebar_expanded_menu_group_label_bottom_padding: number;
  sidebar_and_header_z_index_classname: string;
  sidebar_menu_item_gap_classname: string;
  sidebar_menu_item_x_margin_classname: string;
}

export const DEFAULT_DASHBOARD_SIDEBAR_SIZE = {
  desktop_collapsed_width: `4rem`,
  desktop_collapsed_width_classname: `w-[4rem]`,
  desktop_expanded_width: `14rem`,
  desktop_expanded_width_classname: `w-[14rem]`,
  mobile_expanded_width: `16rem`,
  mobile_expanded_width_classname: `w-[16rem]`,
  header_height: `4rem`,
  header_height_classname: `h-[4rem]`,
  content_container_desktop_sidebar_open_width_classname:
    "md:w-[calc(100vw-14rem)]",
  content_container_desktop_sidebar_open_left_classname: "md:left-[14rem]",
  content_container_desktop_sidebar_closed_width_classname:
    "md:w-[calc(100vw-4rem)]",
  content_container_desktop_sidebar_closed_left_classname: "md:left-[4rem]",
  sidebar_menu_item_height: '2.5rem',
  sidebar_menu_item_height_classname: 'h-[2.5rem]',
  sidebar_expanded_menu_group_label_bottom_padding: 4,
  sidebar_and_header_z_index_classname: "z-40",
  sidebar_menu_item_gap_classname: "gap-2",
  sidebar_menu_item_x_margin_classname: "mx-2"
} as const satisfies DashboardLayoutSidebarSizing;

export const DashboardLayoutSidebarSizeContext =
  createContext<DashboardLayoutSidebarSizing>(DEFAULT_DASHBOARD_SIDEBAR_SIZE);
