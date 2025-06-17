"use client";

import type { PropsWithChildren, ReactElement } from "react";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";
import DashboardSidebarItemRenderer from "./dashboard-sidebar-item-renderer";

export function DashboardSidebarItemGroupRenderer({
  group,
  Link,
}: {
  group: DashboardSidebarItemGroupDefinition;
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
}): ReactElement {
  const groupTitle: string = group.title;

  return (
    <SidebarGroup key={`sidebar-group-[${group.title}]`}>
      <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
        {groupTitle}
      </SidebarGroupLabel>

      <SidebarGroupContent>
        <SidebarMenu>
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
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export default DashboardSidebarItemGroupRenderer;
