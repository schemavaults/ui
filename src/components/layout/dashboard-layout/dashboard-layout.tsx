"use client";

import type { CSSProperties, ReactNode, ReactElement, FC } from "react";
import DashboardSidebar, {
  DashboardLayoutSidebarTrigger,
  DashboardSidebarActiveItemFromPathnameHookProvider,
  DashboardSidebarActiveItemProvider,
  DashboardSidebarContextProvider,
  useCloseDashboardSidebarOnRouteChange,
  useDashboardSidebarOpenState,
  useDashboardSidebarSizing,
  DASHBOARD_SIDEBAR_OPEN_WIDTH_CSS_VARIABLE,
} from "./dashboard-sidebar";
import type { DashboardLayoutProps } from "./DashboardLayoutProps";
import { Separator } from "@/components/ui/separator";
import DashboardLayoutMainContentContainer from "./dashboard-layout-main-content-container";
import type { ICustomizableDashboardLayoutComponentProps } from "./customizable-dashboard-component-type";
import { cn } from "@/lib/utils";
import { MotionConfig } from "@/framer-motion";
import {
  reducedMotionClassName,
  type DashboardLayoutReducedMotionSetting,
} from "./dashboard-layout-reduced-motion";
import { useResolvedDashboardLayoutReducedMotionSetting } from "./useDashboardLayoutReducedMotion";

export type { DashboardLayoutProps };

/**
 *
 * @param param0 DashboardLayoutProps
 *
 * @returns A layout component wrapping the page content of 'children'
 */
// Sibling component that subscribes to `usePathname` and closes the mobile
// sidebar on navigation. Rendered conditionally only when consumers opt in
// by passing `usePathname` — keeping the hook call out of the parent avoids
// the rule-of-hooks issue of a conditionally-called hook.
function AutoCloseSidebarOnNavigation({
  usePathname,
}: {
  usePathname: () => string;
}): null {
  useCloseDashboardSidebarOnRouteChange(usePathname);
  return null;
}

export function DashboardLayout({
  children,
  wordmark,
  logo,
  Link,
  brandHref,
  topBarTitle,
  usePathname,
  activeHref,
  printHidden = false,
  sidebarOpenWidth,
  reducedMotion,
  ...props
}: DashboardLayoutProps): ReactElement {
  const size = useDashboardSidebarSizing();

  // Resolved once, here, and published on the subtree through `MotionConfig`
  // below. Everything the layout animates — in CSS or in Framer Motion —
  // reads it back from there, so the two halves cannot disagree about whether
  // the layout is animating.
  const reducedMotionSetting: DashboardLayoutReducedMotionSetting =
    useResolvedDashboardLayoutReducedMotionSetting(reducedMotion);

  // The open-width override travels as a CSS custom property on the root
  // container. The default sizing classnames for the expanded sidebar and the
  // content container's open-state width/offset read it with a 14rem
  // fallback, so an unset prop leaves the layout exactly as before.
  const containerStyle: CSSProperties | undefined =
    typeof sidebarOpenWidth === "string" && sidebarOpenWidth.length > 0
      ? ({
          [DASHBOARD_SIDEBAR_OPEN_WIDTH_CSS_VARIABLE]: sidebarOpenWidth,
        } as CSSProperties)
      : undefined;

  function HeaderBarPageIdentifierComponent(): ReactNode {
    if (typeof topBarTitle === "string") {
      return <h2 className="font-bold text-lg">{topBarTitle}</h2>;
    } else {
      const CustomTopBarHeaderComponent = topBarTitle;
      return (
        <CustomTopBarHeaderComponent
          useDashboardSidebarSizing={useDashboardSidebarSizing}
          useDashboardSidebarOpenState={useDashboardSidebarOpenState}
          Link={Link}
        />
      );
    }
  }

  const TopBarButtonsComponent:
    | FC<ICustomizableDashboardLayoutComponentProps>
    | undefined = props.topBarButtons;

  const sidebar: ReactElement = (
    <DashboardSidebar
      wordmark={wordmark}
      Link={Link}
      brandHref={brandHref}
      logo={logo}
      sidebarFooterContent={props.sidebarFooterContent}
      className={cn(printHidden && "print:hidden")}
    />
  );

  return (
    // Hands the resolved preference to every Framer Motion element inside the
    // layout — the sidebar's own `m.*` elements, and any the consumer renders
    // in `children`, the top bar or the sidebar footer. Framer Motion defaults
    // this to "never", i.e. it ignores `prefers-reduced-motion` until asked
    // not to, so the layout has to opt in on its subtree's behalf.
    <MotionConfig reducedMotion={reducedMotionSetting}>
      <DashboardSidebarContextProvider
        sidebarItems={props.sidebarItems}
        sizing={props.sizing}
        sidebarOpenWidth={sidebarOpenWidth}
        onOpenSidebar={props.onOpenSidebar}
        onCloseSidebar={props.onCloseSidebar}
      >
        {typeof usePathname === "function" && (
          <AutoCloseSidebarOnNavigation usePathname={usePathname} />
        )}
        <div
          id="dashboard-layout-container"
          className={cn(
            "w-full h-dvh min-h-dvh",
            // When hiding chrome for print, let the container grow to fit all
            // page content across printed pages instead of clamping to the
            // on-screen viewport height.
            printHidden && "print:h-auto print:min-h-0",
          )}
          style={containerStyle}
        >
          {/*
            Only the sidebar reads the active item, so only the sidebar is
            wrapped. Which provider renders depends on whether a
            `usePathname` hook was supplied (the hook cannot be called
            conditionally); a consumer that starts or stops passing one
            remounts the sidebar, never the page content beside it.
          */}
          {typeof usePathname === "function" ? (
            <DashboardSidebarActiveItemFromPathnameHookProvider
              usePathname={usePathname}
              currentPathname={activeHref}
            >
              {sidebar}
            </DashboardSidebarActiveItemFromPathnameHookProvider>
          ) : (
            <DashboardSidebarActiveItemProvider currentPathname={activeHref}>
              {sidebar}
            </DashboardSidebarActiveItemProvider>
          )}
          <DashboardLayoutMainContentContainer printHidden={printHidden}>
            <header
              id="dashboard-layout-main-content-header"
              className={cn(
                "sticky top-0",
                "flex shrink-0 items-center gap-2",
                "transition-[width,height] ease-linear",
                reducedMotionClassName(reducedMotionSetting),
                "bg-background",
                "border-b border-border",
                size.sidebar_and_header_z_index_classname,
                printHidden && "print:hidden",
              )}
              style={{
                height: size.header_height,
              }}
            >
              <div className="flex flex-row justify-between items-center gap-2 px-4 w-full">
                <DashboardLayoutSidebarTrigger />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-4"
                />
                <HeaderBarPageIdentifierComponent />
                <div role="none" className="grow" />
                {typeof TopBarButtonsComponent === "function" && (
                  <TopBarButtonsComponent
                    useDashboardSidebarSizing={useDashboardSidebarSizing}
                    useDashboardSidebarOpenState={useDashboardSidebarOpenState}
                    Link={Link}
                  />
                )}
              </div>
            </header>
            {children}
          </DashboardLayoutMainContentContainer>
        </div>
      </DashboardSidebarContextProvider>
    </MotionConfig>
  );
}

export default DashboardLayout;
