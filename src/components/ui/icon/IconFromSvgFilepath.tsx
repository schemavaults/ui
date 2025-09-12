"use client";

import { type ReactElement, useMemo, Suspense } from "react";
import type { IconProps } from "./IconProps";
import parseSvgIcon from "./parseSvgIcon";
import IconSkeleton from "./IconSkeleton";
import LazySvgIcon from "./LazySvgIcon";
import RenderSvg from "./RenderSvg";

async function loadSvgFromRemote(svg_url: string): Promise<SVGSVGElement> {
  if (typeof svg_url !== "string" || !svg_url.endsWith(".svg")) {
    throw new Error("Invalid src path to SVG element!");
  }
  const response = await fetch(svg_url, { method: "GET" });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch SVG at path '${svg_url}': ${response.status} ${response.statusText}`,
    );
  }

  const svgText = await response.text();
  return parseSvgIcon(svgText);
}

function IconFromSvgFilepath({
  src,
  size,
  ...props
}: IconProps & { size: number; preloaded?: SVGSVGElement }): ReactElement {
  const iconData: Promise<SVGSVGElement> = useMemo(() => {
    return (async (): Promise<SVGSVGElement> => {
      if (typeof src === "string") {
        if (!src.endsWith(".svg")) {
          throw new TypeError(
            "Expected source path to end in .svg within IconFromSvgFilepath component",
          );
        }
        return await loadSvgFromRemote(src);
      } else if (!src) {
        throw new TypeError(
          "Did not receive a 'src' property to render SVG with!",
        );
      } else {
        return src satisfies SVGSVGElement;
      }
    })();
  }, [src]);

  if (props.preloaded) {
    return <RenderSvg svg={props.preloaded} {...props} />;
  }

  return (
    <Suspense fallback={<IconSkeleton size={size} />}>
      <LazySvgIcon svgPromise={iconData} size={size} {...props} />
    </Suspense>
  );
}

export default IconFromSvgFilepath;
