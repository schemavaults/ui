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

  // Zero for every group but the leading one, so the target below stays a
  // single value rather than two conditional variants: a non-leading group
  // animates 0 to 0 and is unaffected.
  //
  // It sits on the group container rather than on the heading, even though it
  // exists for the heading's sake. AnimatePresence mounts and unmounts the
  // heading, and a padding that belongs to an unmounting element cannot
  // animate out — it is simply gone the frame the element leaves, taking its
  // space with it. Framer also cannot drive a border-box element's height
  // below its own padding, so while the inset lived on the heading the
  // collapse bottomed out 24px short and snapped the rest. The container is
  // mounted for as long as the group is, so the same 0 <-> 16 change is an
  // animation rather than a jump, and the end states are unchanged: collapsed
  // means 0, leaving a leading group's icon rows where leading ungrouped rows
  // sit.
  const groupTopPadding: number = first
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
      // No entrance animation: a group that mounts already open starts at its
      // resting inset rather than easing into it.
      initial={false}
      animate={{
        paddingTop: showGroupLabel ? groupTopPadding : 0,
        transition: {
          duration: transitionTime,
          ease: toggleDashboardLayoutCollapsedTransitionEasing,
          // Matches the heading's own timing on both legs, so the inset and
          // the heading it is reserving space for move as one: held back on
          // the way in until the sidebar is most of the way open, and leaving
          // immediately on the way out. Both are 0 under reduced motion.
          delay: showGroupLabel ? transitionTime / 1.5 : 0,
        },
      }}
    >
      <AnimatePresence>
        {showGroupLabel && (
          <m.div
            // A one-row grid whose track animates between `0fr` and `1fr`,
            // which is how the heading opens and closes without anyone having
            // to measure it. The obvious spelling — `height` between 0 and
            // `auto` — does not survive the mount and unmount that
            // AnimatePresence puts either side of it. Framer resolves `auto`
            // by measuring, and the frame it does so paints at the heading's
            // intrinsic height, so opening jumped the rows below down 14px
            // before animating them the rest of the way; closing, it could not
            // drive a border-box height below the element's own padding, so it
            // stopped short and the unmount dropped the remainder in one
            // frame. An `fr` track has neither problem: `0fr` is a true zero,
            // reached before the unmount, and `1fr` resolves against content
            // in an auto-height container with nothing measured up front.
            className="w-full grid"
            key="sidebar-item-group-label"
            initial={{
              scale: 0,
              opacity: 0,
              gridTemplateRows: "0fr",
            }}
            animate={{
              scale: 1,
              opacity: 1,
              gridTemplateRows: "1fr",
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
              gridTemplateRows: "0fr",
              transition: {
                duration: transitionTime,
                ease: toggleDashboardLayoutCollapsedTransitionEasing,
                delay: 0,
              },
            }}
          >
            {/*
              The grid item. `min-h-0` lets it shrink past its content — a grid
              item floors at `min-content` otherwise, and the track would never
              reach zero — and `overflow-hidden` clips the heading on the way.

              It carries no padding of its own, and that is the point. Padding
              is part of the box and does not shrink with it, so an element
              that has any cannot be driven below it: while the gap below the
              heading sat out here, the row floored at 8px and the unmount
              dropped those 8px in a single frame. Everything that takes up
              space lives one level further in, as content this element clips.
            */}
            <div className={cn("min-h-0 overflow-hidden", "text-nowrap")}>
              <div
                style={{
                  paddingBottom:
                    sizes.sidebar_expanded_menu_group_label_bottom_padding,
                }}
              >
                <Label
                  htmlFor={groupItemsContainerId}
                  className={cn("font-bold text-nowrap", "block")}
                  // Align the group heading with the item titles underneath
                  // it: each item renders its icon inside a box exactly
                  // `desktop_collapsed_width` wide, so its title starts at
                  // that offset. Deriving the inset from the same value keeps
                  // heading and titles on one left edge instead of the old
                  // `mx-2`, which lined up with neither the icons nor the
                  // titles.
                  style={{
                    paddingLeft: sizes.desktop_collapsed_width,
                    paddingRight: "0.5rem",
                  }}
                >
                  {groupTitle}
                </Label>
              </div>
            </div>
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
