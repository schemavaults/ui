"use client";

import type { ReactNode, ReactElement, FC } from "react";
import DashboardSidebar, {
  DashboardLayoutSidebarTrigger,
  DashboardSidebarContextProvider,
  useCloseDashboardSidebarOnRouteChange,
  useDashboardSidebarOpenState,
  useDashboardSidebarSizing,
} from "./dashboard-sidebar";
import type { DashboardLayoutProps } from "./DashboardLayoutProps";
import { Separator } from "@/components/ui/separator";
import DashboardLayoutMainContentContainer from "./dashboard-layout-main-content-container";
import type { ICustomizableDashboardLayoutComponentProps } from "./customizable-dashboard-component-type";
import { cn } from "@/lib/utils";

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
  ...props
}: DashboardLayoutProps): ReactElement {
  const size = useDashboardSidebarSizing();

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

  return (
    <DashboardSidebarContextProvider
      sidebarItems={props.sidebarItems}
      sizing={props.sizing}
      onOpenSidebar={props.onOpenSidebar}
      onCloseSidebar={props.onCloseSidebar}
    >
      {typeof usePathname === "function" && (
        <AutoCloseSidebarOnNavigation usePathname={usePathname} />
      )}
      <div id="dashboard-layout-container" className="w-full h-dvh min-h-dvh">
        <DashboardSidebar
          wordmark={wordmark}
          Link={Link}
          brandHref={brandHref}
          logo={logo}
          sidebarFooterContent={props.sidebarFooterContent}
        />
        <DashboardLayoutMainContentContainer>
          <header
            id="dashboard-layout-main-content-header"
            className={cn(
              "sticky top-0",
              "flex shrink-0 items-center gap-2",
              "transition-[width,height] ease-linear",
              "bg-background",
              "border-b border-border",
              size.sidebar_and_header_z_index_classname,
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
  );
}

export default DashboardLayout;
