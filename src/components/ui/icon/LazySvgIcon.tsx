"use client";

import { use, type ReactElement } from "react";
import type { IconProps } from "./IconProps";
import RenderSvg from "./RenderSvg";

export function LazySvgIcon(
  props: Omit<IconProps, "src"> & {
    svgPromise: Promise<SVGSVGElement>;
    size: number;
  },
): ReactElement {
  const svg: SVGSVGElement = use(props.svgPromise);
  return <RenderSvg svg={svg} {...props} />;
}

export default LazySvgIcon;
