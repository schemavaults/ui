"use client";

import { use, type ReactElement } from "react";
import type { IconProps } from "./IconProps";
import LoadedSvgIcon from "./LoadedSvgIcon";

export function LazySvgIcon(
  props: Omit<IconProps, "src"> & {
    svgPromise: Promise<SVGSVGElement>;
    size: number;
  },
): ReactElement {
  const svg: SVGSVGElement = use(props.svgPromise);

  // Extract SVG content and attributes
  const innerHTML: string = svg.innerHTML;
  const viewBox = svg.getAttribute("viewBox") || undefined;

  // Extract other SVG attributes (excluding ones we handle separately)
  const svgAttributes: Record<string, string> = {};
  Array.from(svg.attributes).forEach((attr) => {
    if (!["viewBox", "width", "height", "style", "class"].includes(attr.name)) {
      svgAttributes[attr.name] = attr.value;
    }
  });

  let withOptionalSvgPromise: Omit<typeof props, "svgPromise"> & {
    svgPromise?: unknown;
  } = {
    ...props,
  };

  delete withOptionalSvgPromise.svgPromise;

  const withoutSvgPromise: Omit<typeof props, "svgPromise"> =
    withOptionalSvgPromise;

  return (
    <LoadedSvgIcon
      innerHTML={innerHTML}
      viewBox={viewBox}
      svgAttributes={svgAttributes}
      {...withoutSvgPromise}
    />
  );
}

export default LazySvgIcon;
