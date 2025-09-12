"use client";

import { useMemo, type ReactElement } from "react";
import parseSvgIcon from "./parseSvgIcon";
import type { IconProps } from "./IconProps";
import RenderSvg from "./RenderSvg";

function IconFromUtf8XmlSvg({
  src,
  size,
  ...props
}: IconProps & { size: number }): ReactElement {
  const iconData: SVGSVGElement = useMemo(() => {
    return ((): SVGSVGElement => {
      if (typeof src !== "string") {
        throw new Error("Invalid UTF-8 to parse into SVG element!");
      }
      return parseSvgIcon(src);
    })();
  }, [src]);

  return <RenderSvg svg={iconData} {...props} size={size} />;
}

export default IconFromUtf8XmlSvg;
