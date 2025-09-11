"use client";

import { Suspense, useMemo, type ReactElement } from "react";
import parseSvgIcon from "./parseSvgIcon";
import type { IconProps } from "./IconProps";
import IconSkeleton from "./IconSkeleton";
import LazySvgIcon from "./LazySvgIcon";

function IconFromUtf8XmlSvg({
  src,
  size,
  ...props
}: IconProps & { size: number }): ReactElement {
  const iconData: Promise<SVGSVGElement> = useMemo(() => {
    return (async (): Promise<SVGSVGElement> => {
      if (typeof src !== "string") {
        throw new Error("Invalid UTF-8 to parse into SVG element!");
      }
      return parseSvgIcon(src);
    })();
  }, [src]);

  return (
    <Suspense fallback={<IconSkeleton size={size} />}>
      <LazySvgIcon svgPromise={iconData} size={size} {...props} />
    </Suspense>
  );
}

export default IconFromUtf8XmlSvg;
