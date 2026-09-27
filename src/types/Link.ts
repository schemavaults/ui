import type { MouseEvent, PropsWithChildren, ReactElement } from "react";

export interface LinkComponentProps
  extends PropsWithChildren<{
    href: string;
    className?: string;
    onClick?: (e: MouseEvent) => void;
    /**
     * Set to `"page"` on the dashboard sidebar link for the page currently
     * being viewed. Forward it to the rendered `<a>` so assistive technology
     * announces the link as the current page.
     */
    "aria-current"?: "page";
  }> {}

export type LinkComponentType = (props: LinkComponentProps) => ReactElement;
export type { LinkComponentType as Link };
