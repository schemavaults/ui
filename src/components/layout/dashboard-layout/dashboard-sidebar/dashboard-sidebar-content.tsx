"use client";

import type { PropsWithChildren, ReactElement, ReactNode } from "react";

import DashboardSidebarItemRenderer from "./dashboard-sidebar-item-renderer";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";
import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";
import DashboardSidebarItemGroupRenderer from "./dashboard-sidebar-item-group-renderer";
import { useDashboardSidebarItemsAndGroups } from "./useDashboardSidebarItemsAndGroups";
import { m } from "@/framer-motion";
import { cn } from "@/lib/utils";
import type { LinkComponentType } from "@/types/Link";

export interface DashboardLayoutSidebarContentProps {
  Link: LinkComponentType;
}

export function DashboardSidebarContent({
  Link,
}: DashboardLayoutSidebarContentProps): ReactElement {
  const sidebarItems: readonly (
    | DashboardSidebarItemDefinition
    | DashboardSidebarItemGroupDefinition
  )[] = useDashboardSidebarItemsAndGroups();
  return (
    <m.nav
      className={cn(
        "bg-background grow w-full",
        "flex flex-col items-stretch justify-start",
        "p-2",
        "overflow-x-hidden overflow-y-scroll",
      )}
    >
      {sidebarItems.map(
        (
          itemOrGroup:
            | DashboardSidebarItemDefinition
            | DashboardSidebarItemGroupDefinition,
        ): ReactNode => {
          if (itemOrGroup.type === "dashboard-sidebar-item-definition") {
            const item: DashboardSidebarItemDefinition = itemOrGroup;
            return (
              <DashboardSidebarItemRenderer
                item={item}
                Link={Link}
                key={`sidebar-item-[${item.title}]`}
              />
            );
          } else if (itemOrGroup.type === "dashboard-sidebar-item-group") {
            const group: DashboardSidebarItemGroupDefinition = itemOrGroup;
            return (
              <DashboardSidebarItemGroupRenderer
                group={group}
                Link={Link}
                key={`sidebar-group-[${group.title}]`}
              />
            );
          } else {
            throw new Error(
              "Invalid 'type' for sidebar content item in render list!",
            );
          }
        },
      )}
    </m.nav>
  );
}

export default DashboardSidebarContent;
