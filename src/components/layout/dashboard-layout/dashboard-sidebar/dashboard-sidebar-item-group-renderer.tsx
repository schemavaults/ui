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
import { DashboardSidebarAdminOnlyItemsContext } from "./dashboard-sidebar-admin-only-items-context";
import type { LinkComponentType } from "@/types/Link";

export function DashboardSidebarItemGroupRenderer({
  group,
  Link,
}: {
  group: DashboardSidebarItemGroupDefinition;
  Link: LinkComponentType;
}): ReactElement {
  const groupTitle: string = group.title;
  const openState = useDashboardSidebarOpenState();
  const sizes = useDashboardSidebarSizing();

  const groupItemsContainerId: string = `sidebar-group-items-[${group.title}]`;
  const showGroupLabel = openState.mobile || openState.open;

  return (
    <m.div
      key={`sidebar-group-[${group.title}]`}
      className={cn(
        "w-full",
        "flex flex-col flex-nowrap",
        "items-start justify-start",
      )}
      layout
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
              paddingBottom: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
              width: "100%",
              height: "auto",
              display: "block",
              paddingBottom:
                sizes.sidebar_expanded_menu_group_label_bottom_padding,
            }}
            exit={{
              scale: 0,
              opacity: 0,
              width: 0,
              height: 0,
              transitionEnd: {
                display: "none",
              },
              paddingBottom: 0,
            }}
          >
            <Label
              htmlFor={groupItemsContainerId}
              className={cn("font-bold text-nowrap", sizes.sidebar_menu_item_x_margin_classname)}
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
          layout
          className={cn(
            "w-full flex flex-col",
            "items-start justify-start",
            sizes.sidebar_menu_item_gap_classname
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
