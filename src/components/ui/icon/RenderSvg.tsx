"use client";

import type { ReactElement } from "react";
import LoadedSvgIcon from "./LoadedSvgIcon";
import type { IconProps } from "./IconProps";

export interface IRenderSvgProps extends Omit<IconProps, "src"> {
  svg: SVGSVGElement;
}

function RenderSvg({ svg, ...props }: IRenderSvgProps): ReactElement {
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

  let withOptionals: Omit<typeof props, "svgPromise"> & {
    svgPromise?: unknown;
    src?: unknown;
  } = {
    ...props,
  };

  delete withOptionals.svgPromise;
  delete withOptionals.src;

  const withouts: Omit<typeof props, "svgPromise"> = withOptionals;

  return (
    <LoadedSvgIcon
      innerHTML={innerHTML}
      viewBox={viewBox}
      svgAttributes={svgAttributes}
      {...withouts}
    />
  );
}

export default RenderSvg;
