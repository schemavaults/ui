"use client";

import type { ReactElement } from "react";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";
import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";
import DashboardSidebarItemRenderer from "./dashboard-sidebar-item-renderer";
import { Label } from "@/components/ui";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "@/framer-motion";
import useDashboardSidebarSizing from "./useDashboardSidebarSizing";
import { toggleDashboardLayoutCollapsedTransitionEasing } from "../toggle-dashboard-layout-collapsed-transition-time";
import useToggleDashboardLayoutCollapsedTransitionTime from "../useToggleDashboardLayoutCollapsedTransitionTime";
import useDashboardLayoutReducedMotion from "../useDashboardLayoutReducedMotion";
import { DashboardSidebarAdminOnlyItemsContext } from "./dashboard-sidebar-admin-only-items-context";
import { DEFAULT_LEADING_SIDEBAR_MENU_GROUP_LABEL_TOP_PADDING } from "./dashboard-sidebar-sizing";
import type { LinkComponentType } from "@/types/Link";

export interface DashboardSidebarItemGroupRendererProps {
  group: DashboardSidebarItemGroupDefinition;
  Link: LinkComponentType;
  /**
   * Whether this group is the first block in the menu.
   *
   * The menu <nav> spaces its blocks with a gap, which only ever puts space
   * *between* two blocks — the first one has nothing above it, so a leading
   * group's heading rendered flush against the sidebar header's bottom border.
   * A leading group therefore supplies that inset itself.
   */
  first?: boolean;
}

export function DashboardSidebarItemGroupRenderer({
  group,
  Link,
  first = false,
}: DashboardSidebarItemGroupRendererProps): ReactElement {
  const groupTitle: string = group.title;
  const openState = useDashboardSidebarOpenState();
  const sizes = useDashboardSidebarSizing();
  const reducedMotion: boolean = useDashboardLayoutReducedMotion();
  const transitionTime: number =
    useToggleDashboardLayoutCollapsedTransitionTime();

  const groupItemsContainerId: string = `sidebar-group-items-[${group.title}]`;
  const showGroupLabel = openState.mobile || openState.open;

  // Zero for every group but the leading one, so the animation targets below
  // stay a single set of values rather than two conditional variants: a
  // non-leading group animates a padding of 0 to 0 and is unaffected. It rides
  // on the label rather than on the group container because it exists to keep
  // the *heading* off the header border — collapse the sidebar and the heading
  // goes away, along with the reason to reserve space for it, leaving the
  // leading group's icon rows sitting exactly where leading ungrouped rows do.
  const labelTopPadding: number = first
    ? (sizes.sidebar_leading_menu_group_label_top_padding ??
      DEFAULT_LEADING_SIDEBAR_MENU_GROUP_LABEL_TOP_PADDING)
    : 0;

  return (
    <m.div
      key={`sidebar-group-[${group.title}]`}
      className={cn(
        "w-full",
        "flex flex-col flex-nowrap",
        "items-start justify-start",
        // The menu <nav> is a scrolling flex column, so its children shrink
        // by default once the menu overflows. Keep the group at its natural
        // height and let the <nav> scroll instead.
        "flex-shrink-0",
      )}
      layout={!reducedMotion}
    >
      <AnimatePresence>
        {showGroupLabel && (
          <m.div
            className="w-full text-nowrap"
            key="sidebar-item-group-label"
            initial={{
              scale: 0,
              opacity: 0,
              width: 0,
              height: 0,
              transitionEnd: {
                display: "none",
              },
              paddingTop: 0,
              paddingBottom: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              width: "100%",
              height: "auto",
              display: "block",
              paddingTop: labelTopPadding,
              paddingBottom:
                sizes.sidebar_expanded_menu_group_label_bottom_padding,
              transition: {
                duration: transitionTime,
                ease: toggleDashboardLayoutCollapsedTransitionEasing,
                // Both zero when motion is reduced, so the heading is present
                // as soon as the sidebar is open instead of easing in behind
                // it.
                delay: transitionTime / 1.5,
              },
            }}
            exit={{
              scale: 0,
              opacity: 0,
              width: 0,
              height: 0,
              transitionEnd: {
                display: "none",
              },
              paddingTop: 0,
              paddingBottom: 0,
              transition: {
                duration: transitionTime,
                ease: toggleDashboardLayoutCollapsedTransitionEasing,
                delay: 0,
              },
            }}
          >
            <Label
              htmlFor={groupItemsContainerId}
              className={cn("font-bold text-nowrap", "block")}
              // Align the group heading with the item titles underneath it:
              // each item renders its icon inside a box exactly
              // `desktop_collapsed_width` wide, so its title starts at that
              // offset. Deriving the inset from the same value keeps heading
              // and titles on one left edge instead of the old `mx-2`, which
              // lined up with neither the icons nor the titles.
              style={{
                paddingLeft: sizes.desktop_collapsed_width,
                paddingRight: "0.5rem",
              }}
            >
              {groupTitle}
            </Label>
          </m.div>
        )}
      </AnimatePresence>

      <DashboardSidebarAdminOnlyItemsContext.Provider
        value={group.adminOnly ?? false}
      >
        <m.ul
          id={groupItemsContainerId}
          layout={!reducedMotion}
          className={cn(
            "w-full flex flex-col",
            "items-start justify-start",
            sizes.sidebar_menu_item_gap_classname,
          )}
        >
          {group.items.map(
            (item: DashboardSidebarItemDefinition): ReactElement => {
              return (
                <DashboardSidebarItemRenderer
                  item={item}
                  Link={Link}
                  key={`sidebar-item-[${groupTitle}]-[${item.title satisfies string}]`}
                />
              );
            },
          )}
        </m.ul>
      </DashboardSidebarAdminOnlyItemsContext.Provider>
    </m.div>
  );
}

export default DashboardSidebarItemGroupRenderer;
