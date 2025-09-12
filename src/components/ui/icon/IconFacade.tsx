"use client";

import { useMemo, type ReactElement, type FC } from "react";
import type { IconProps } from "./IconProps";
import IconFromSvgFilepath from "./IconFromSvgFilepath";
import IconFromUtf8XmlSvg from "./IconFromUtf8XmlSvg";
import DEFAULT_ICON_SIZE from "./DefaultIconSize";
import RenderSvg from "./RenderSvg";
import IconFromSvgDataUrl from "./IconFromSvgDataUrl";

type IconDisplayMethod = "filepath" | "utf8-xml" | "dataurl" | "SvgSvgInstance";

function determineIconDisplayMethod(src: IconProps["src"]): IconDisplayMethod {
  if (typeof src === "string") {
    if (src.endsWith(".svg")) {
      return "filepath";
    } else if (src.startsWith("data:")) {
      return "dataurl";
    } else if (src.includes("<svg")) {
      return "utf8-xml";
    } else {
      console.warn("Unhandled string format to display SVG from!");
    }
  }

  // src as string should be handled by this point
  if (typeof src === "string") {
    if (process.env.NODE_ENV === "development") {
      console.warn("Invalid 'src' string format:", src);
    }
    throw new Error(
      "Invalid 'src' property, unhandled string type to render SVG icon with!",
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
    case "utf8-xml":
      return <IconFromUtf8XmlSvg src={src} {...props} size={size} />;
    case "dataurl":
      if (typeof src !== "string") {
        throw new TypeError(
          "Expected 'src' to be a string for dataurl render method!",
        );
      }
      return <IconFromSvgDataUrl src={src} {...props} size={size} />;
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
