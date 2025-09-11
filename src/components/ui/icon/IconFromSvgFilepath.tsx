"use client";

import { type ReactElement, useMemo, Suspense } from "react";
import type { IconProps } from "./IconProps";
import parseSvgIcon from "./parseSvgIcon";
import IconSkeleton from "./IconSkeleton";
import LazySvgIcon from "./LazySvgIcon";

function IconFromSvgFilepath({
  src,
  size,
  ...props
}: IconProps & { size: number }): ReactElement {
  const iconData: Promise<SVGSVGElement> = useMemo(() => {
    return (async (): Promise<SVGSVGElement> => {
      if (typeof src !== "string" || !src.endsWith(".svg")) {
        throw new Error("Invalid src path to SVG element!");
      }

      const response = await fetch(src, { method: "GET" });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch SVG: ${response.status} ${response.statusText}`,
        );
      }

      const svgText = await response.text();
      return parseSvgIcon(svgText);
    })();
  }, [src]);

  return (
    <Suspense fallback={<IconSkeleton size={size} />}>
      <LazySvgIcon svgPromise={iconData} size={size} {...props} />
    </Suspense>
  );
}

export default IconFromSvgFilepath;
