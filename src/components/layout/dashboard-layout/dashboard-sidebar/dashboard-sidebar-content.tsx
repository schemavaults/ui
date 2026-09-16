"use client";

import type { ReactElement, ReactNode } from "react";

import DashboardSidebarItemRenderer from "./dashboard-sidebar-item-renderer";
import type { DashboardSidebarItemDefinition } from "./dashboard-sidebar-item-definition";
import type { DashboardSidebarItemGroupDefinition } from "./dashboard-sidebar-item-group";
import DashboardSidebarItemGroupRenderer from "./dashboard-sidebar-item-group-renderer";
import useDashboardSidebarItemsAndGroups from "./useDashboardSidebarItemsAndGroups";
import { m } from "@/framer-motion";
import { cn } from "@/lib/utils";
import type { LinkComponentType } from "@/types/Link";
import useDashboardSidebarSizing from "./useDashboardSidebarSizing";
import useDashboardLayoutReducedMotion from "../useDashboardLayoutReducedMotion";

export interface DashboardLayoutSidebarContentProps {
  Link: LinkComponentType;
}

type DashboardSidebarEntry =
  | DashboardSidebarItemDefinition
  | DashboardSidebarItemGroupDefinition;

/**
 * A consecutive run of ungrouped menu items, rendered into a single <ul>.
 *
 * Ungrouped items used to be emitted as bare <li> children of the menu <nav>.
 * That is invalid markup — an <li> outside a list container — and it meant the
 * spacing between plain links came from the <nav>'s own gap while the spacing
 * between grouped links came from each group's <ul> gap: two independent
 * declarations that only agreed by coincidence. Collecting ungrouped items
 * into their own list gives both paths the same structure, so they cannot
 * drift apart again.
 */
interface UngroupedSidebarItemRun {
  kind: "ungrouped-item-run";
  items: DashboardSidebarItemDefinition[];
}

interface SidebarGroupBlock {
  kind: "group";
  group: DashboardSidebarItemGroupDefinition;
}

type DashboardSidebarRenderBlock = UngroupedSidebarItemRun | SidebarGroupBlock;

/**
 * Collapse the flat item/group list into render blocks, preserving the order
 * the consumer supplied. Adjacent ungrouped items merge into one run; a group
 * always starts a new block.
 */
export function toDashboardSidebarRenderBlocks(
  entries: readonly DashboardSidebarEntry[],
): DashboardSidebarRenderBlock[] {
  const blocks: DashboardSidebarRenderBlock[] = [];

  for (const entry of entries) {
    if (entry.type === "dashboard-sidebar-item-definition") {
      const previousBlock: DashboardSidebarRenderBlock | undefined =
        blocks[blocks.length - 1];
      if (previousBlock !== undefined && previousBlock.kind === "ungrouped-item-run") {
        previousBlock.items.push(entry);
      } else {
        blocks.push({ kind: "ungrouped-item-run", items: [entry] });
      }
    } else if (entry.type === "dashboard-sidebar-item-group") {
      blocks.push({ kind: "group", group: entry });
    } else {
      throw new TypeError(
        "Invalid 'type' for sidebar content item in render list!",
      );
    }
  }

  return blocks;
}

export function DashboardSidebarContent({
  Link,
}: DashboardLayoutSidebarContentProps): ReactElement {
  const sidebarItems: readonly DashboardSidebarEntry[] =
    useDashboardSidebarItemsAndGroups();
  const sizes = useDashboardSidebarSizing();
  const reducedMotion: boolean = useDashboardLayoutReducedMotion();
  const blocks: DashboardSidebarRenderBlock[] =
    toDashboardSidebarRenderBlocks(sidebarItems);

  return (
    <m.nav
      className={cn(
        "bg-background grow w-full",
        "flex flex-col items-center justify-start flex-nowrap",
        sizes.sidebar_menu_item_gap_classname,
        "overflow-x-hidden overflow-y-scroll",
        "no-scrollbar",
      )}
    >
      {blocks.map((block: DashboardSidebarRenderBlock): ReactNode => {
        if (block.kind === "group") {
          const group: DashboardSidebarItemGroupDefinition = block.group;
          return (
            <DashboardSidebarItemGroupRenderer
              group={group}
              Link={Link}
              key={`sidebar-group-[${group.title}]`}
            />
          );
        }

        const firstItemTitle: string = block.items[0]!.title;
        return (
          <m.ul
            key={`sidebar-ungrouped-items-[${firstItemTitle}]`}
            layout={!reducedMotion}
            className={cn(
              "w-full flex flex-col",
              "items-start justify-start",
              sizes.sidebar_menu_item_gap_classname,
              // The <nav> is a scrolling flex column; without this the run
              // would be squashed once the menu overflows.
              "flex-shrink-0",
            )}
          >
            {block.items.map(
              (item: DashboardSidebarItemDefinition): ReactElement => (
                <DashboardSidebarItemRenderer
                  item={item}
                  Link={Link}
                  key={`sidebar-item-[${item.title}]`}
                />
              ),
            )}
          </m.ul>
        );
      })}
    </m.nav>
  );
}

export default DashboardSidebarContent;
