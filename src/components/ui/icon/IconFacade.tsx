"use client";

import { useMemo, type ReactElement, type FC } from "react";
import type { IconProps } from "./IconProps";
import IconFromSvgFilepath from "./IconFromSvgFilepath";
import IconFromUtf8XmlSvg from "./IconFromUtf8XmlSvg";
import DEFAULT_ICON_SIZE from "./DefaultIconSize";
import RenderSvg from "./RenderSvg";

type IconDisplayMethod = "filepath" | "dataurl" | "SvgSvgInstance";

function determineIconDisplayMethod(src: IconProps["src"]): IconDisplayMethod {
  if (typeof src === "string" && src.endsWith(".svg")) {
    return "filepath";
  }

  if (typeof src === "string" && src.includes("<svg")) {
    return "dataurl";
  }

  if (typeof src === "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("Invalid 'src':", src);
    }
    throw new Error(
      "Invalid 'src' property, invalid string to render icon with!",
    );
  }

  if (typeof src !== "string" && !!src) {
    return "SvgSvgInstance";
  }

  throw new Error(`Failed to determine how to render (type: ${typeof src})`);
}

function IconFacade({ src, ...props }: IconProps): ReactElement {
  const size: number = useMemo((): number => {
    return typeof props.size === "number" ? props.size : DEFAULT_ICON_SIZE;
  }, [props.size]);

  const displayMethod: IconDisplayMethod = useMemo(
    (): IconDisplayMethod => determineIconDisplayMethod(src),
    [src],
  );

  switch (displayMethod) {
    case "filepath":
      return <IconFromSvgFilepath src={src} {...props} size={size} />;
    case "dataurl":
      return <IconFromUtf8XmlSvg src={src} {...props} size={size} />;
    case "SvgSvgInstance":
      if (!(src instanceof SVGSVGElement)) {
        throw new TypeError(
          "Expected 'src' to be an instance of SVGSVGElement",
        );
      }
      return <RenderSvg svg={src} {...props} size={size} />;
    default:
      throw new TypeError(
        "Invalid 'src' for Icon component! Failed to determine how to render SVG icon!",
      );
  }
}

IconFacade.displayName = "Icon";

export const Icon: FC<IconProps> = IconFacade;

export default Icon;
