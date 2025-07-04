import type { MouseEvent, PropsWithChildren, ReactElement } from "react";

export interface LinkComponentProps
  extends PropsWithChildren<{
    href: string;
    className?: string;
    onClick?: (e: MouseEvent) => void;
  }> {}

export type LinkComponentType = (props: LinkComponentProps) => ReactElement;
