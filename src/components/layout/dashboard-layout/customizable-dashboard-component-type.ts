import type { PropsWithChildren, ReactElement } from "react";
import type { useDashboardSidebarOpenState } from "./useDashboardSidebarOpenState";
import type { useDashboardSidebarSizing } from "./useDashboardSidebarSizing";

export interface ICustomizableDashboardLayoutComponentProps {
  useDashboardSidebarSizing: typeof useDashboardSidebarSizing;
  useDashboardSidebarOpenState: typeof useDashboardSidebarOpenState;
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
}

export type CustomizableDashboardLayoutComponent = (
  props: ICustomizableDashboardLayoutComponentProps,
) => ReactElement;
