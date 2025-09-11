"use client";

import type { ReactElement } from "react";
import type { IconProps } from "./IconProps";

export function LoadedSvgIcon(
  props: Omit<IconProps, "src"> & {
    innerHTML: string;
    viewBox?: string;
    svgAttributes?: Record<string, string>;
  },
): ReactElement {
  const { innerHTML, viewBox, svgAttributes, size, ...restProps } = props;
  return (
    <svg
      {...svgAttributes}
      {...restProps}
      viewBox={viewBox}
      width={size}
      height={size}
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    />
  );
}

export default LoadedSvgIcon;
