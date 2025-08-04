import type { PropsWithChildren, ReactElement } from "react";
import type {
  DashboardLayoutSidebarSizing,
  IDashboardSidebarOpenStateContextType,
} from "./dashboard-sidebar";

export interface ICustomizableDashboardLayoutComponentProps {
  useDashboardSidebarSizing: () => DashboardLayoutSidebarSizing;
  useDashboardSidebarOpenState: () => IDashboardSidebarOpenStateContextType;
  Link: (
    props: PropsWithChildren<{ href: string; className?: string }>,
  ) => ReactElement;
}

export type CustomizableDashboardLayoutComponent = (
  props: ICustomizableDashboardLayoutComponentProps,
) => ReactElement;
