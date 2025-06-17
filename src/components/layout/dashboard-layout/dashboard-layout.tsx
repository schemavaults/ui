"use client";

import { type ReactNode, type ReactElement, FC } from "react";
import DashboardLayoutSidebar from "./dashboard-sidebar";
import type { DashboardLayoutProps } from "./DashboardLayoutProps";
import { Separator } from "@/components/ui/separator";
import DashboardLayoutMainContentContainer from "./dashboard-layout-main-content-container";
import DashboardLayoutSidebarTrigger from "./dashboard-layout-sidebar-trigger";
import useDashboardSidebarSizing from "./useDashboardSidebarSizing";
import type { ICustomizableDashboardLayoutComponentProps } from "./customizable-dashboard-component-type";
import useDashboardSidebarOpenState from "./useDashboardSidebarOpenState";

export type { DashboardLayoutProps };

/**
 * @requires Must be wrapped in a DashboardLayoutContextProvider
 *
 * @param param0 DashboardLayoutProps
 *
 * @returns A layout component wrapping the page content of 'children'
 */
export function DashboardLayout({
  children,
  wordmark,
  logo,
  Link,
  brandHref,
  topBarTitle,
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
        />
      );
    }
  }

  const TopBarButtonsComponent:
    | FC<ICustomizableDashboardLayoutComponentProps>
    | undefined = props.topBarButtons;

  return (
    <div className="w-screen min-h-screen">
      <DashboardLayoutSidebar
        logo={logo}
        wordmark={wordmark}
        Link={Link}
        brandHref={brandHref}
      />
      <DashboardLayoutMainContentContainer>
        <header
          className="flex shrink-0 items-center gap-2 transition-[width,height] ease-linear"
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
              />
            )}
          </div>
        </header>
        {children}
      </DashboardLayoutMainContentContainer>
    </div>
  );
}

export default DashboardLayout;
