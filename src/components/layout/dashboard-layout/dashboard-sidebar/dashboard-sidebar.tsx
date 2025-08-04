"use client";

import { type ReactElement, useContext } from "react";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import { DashboardSidebarOpenStateDispatchContext } from "./dashboard-sidebar-open-state";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import DashboardLayoutSidebarLayout, {
  type DashboardLayoutSidebarLayoutProps,
} from "./dashboard-sidebar-layout";
import useDashboardSidebarSizing from "./useDashboardSidebarSizing";
import { cn } from "@/lib/utils";

export function DashboardSidebar(
  props: DashboardLayoutSidebarLayoutProps,
): ReactElement {
  const size = useDashboardSidebarSizing();
  const openState = useDashboardSidebarOpenState();
  const setOpen = useContext(DashboardSidebarOpenStateDispatchContext);
  if (openState.mobile) {
    return (
      <Sheet
        open={openState.open}
        onOpenChange={(newOpenState: boolean): void => {
          setOpen(newOpenState);
        }}
        defaultOpen={openState.open}
      >
        <SheetContent
          side="left"
          className={cn(size.mobile_expanded_classname)}
          style={{
            zIndex: 1000,
          }}
        >
          <DashboardLayoutSidebarLayout
            logo={props.logo}
            wordmark={props.wordmark}
            Link={props.Link}
            brandHref={props.brandHref}
            sidebarFooterContent={props.sidebarFooterContent}
          />
        </SheetContent>
      </Sheet>
    );
  } else {
    return (
      <DashboardLayoutSidebarLayout
        logo={props.logo}
        wordmark={props.wordmark}
        Link={props.Link}
        brandHref={props.brandHref}
        sidebarFooterContent={props.sidebarFooterContent}
      />
    );
  }
}

export default DashboardSidebar;
