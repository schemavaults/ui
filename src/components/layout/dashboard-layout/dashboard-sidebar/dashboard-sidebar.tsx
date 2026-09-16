"use client";

import { type ReactElement, useContext } from "react";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";
import { DashboardSidebarOpenStateDispatchContext } from "./dashboard-sidebar-open-state";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import DashboardLayoutSidebarLayout, {
  type DashboardLayoutSidebarLayoutProps,
} from "./dashboard-sidebar-layout";
import useDashboardSidebarSizing from "./useDashboardSidebarSizing";
import { cn } from "@/lib/utils";
import VisuallyHidden from "@/components/ui/visually-hidden";
import {
  reducedMotionClassName,
  type DashboardLayoutReducedMotionSetting,
} from "../dashboard-layout-reduced-motion";
import { useDashboardLayoutReducedMotionSetting } from "../useDashboardLayoutReducedMotion";

export function DashboardSidebar(
  props: DashboardLayoutSidebarLayoutProps,
): ReactElement {
  const size = useDashboardSidebarSizing();
  const openState = useDashboardSidebarOpenState();
  const reducedMotion: DashboardLayoutReducedMotionSetting =
    useDashboardLayoutReducedMotionSetting();
  const setOpen = useContext(DashboardSidebarOpenStateDispatchContext);
  if (openState.mobile) {
    return (
      <Sheet
        open={openState.open}
        onOpenChange={(newOpenState: boolean): void => {
          setOpen(newOpenState);
        }}
      >
        <SheetContent
          side="left"
          className={cn(
            size.mobile_expanded_width_classname,
            // Reduced motion: the mobile sidebar appears and disappears in
            // place rather than sliding in from the edge of the screen.
            // Radix unmounts the panel as soon as it sees no running
            // animation, so cancelling the keyframes is enough to close it.
            reducedMotionClassName(reducedMotion),
            props.className,
          )}
          style={{
            zIndex: 1000,
          }}
        >
          <VisuallyHidden>
            <SheetHeader>
              <SheetTitle>Sidebar Mobile Navigation Menu</SheetTitle>
              <SheetDescription>
                This sidebar contains links for navigating to other pages within
                this application.
              </SheetDescription>
            </SheetHeader>
          </VisuallyHidden>
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
        className={props.className}
      />
    );
  }
}

export default DashboardSidebar;
