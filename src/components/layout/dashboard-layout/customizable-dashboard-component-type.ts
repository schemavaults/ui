import { ReactElement } from "react";
import { type useDashboardSidebarOpenState } from "./useDashboardSidebarOpenState";
import { type useDashboardSidebarSizing } from "./useDashboardSidebarSizing";

export interface ICustomizableDashboardLayoutComponentProps {
  useDashboardSidebarSizing: typeof useDashboardSidebarSizing;
  useDashboardSidebarOpenState: typeof useDashboardSidebarOpenState;
}

export type CustomizableDashboardLayoutComponent = (
  props: ICustomizableDashboardLayoutComponentProps,
) => ReactElement;
