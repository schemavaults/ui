"use client";

import { type ReactElement, useMemo } from "react";
import type { IconProps } from "./IconProps";
import { extractBase64SvgData, isValidSvgDataUrlPrefix } from "./SvgDataUrl";
import { Buffer } from "buffer";
import IconFromUtf8XmlSvg from "./IconFromUtf8XmlSvg";

function base64ToUtf8(b64: string): string {
  const buffer = Buffer.from(b64, "base64");
  return buffer.toString("utf-8");
}

function IconFromSvgDataUrl({
  src,
  size,
  ...props
}: IconProps & { src: string; size: number }): ReactElement {
  const base64_svg_data: string = useMemo((): string => {
    if (typeof src !== "string") {
      throw new TypeError(
        "Expected 'src' to be a string for IconFromSvgDataUrl component!",
      );
    }
    if (!isValidSvgDataUrlPrefix(src)) {
      throw new TypeError("Invalid base64 data url for 'src'!");
    }
    return extractBase64SvgData(src);
  }, [src]);

  const utf8_svg_xml_data: string = useMemo((): string => {
    const asUtf8 = base64ToUtf8(base64_svg_data);
    if (!asUtf8.includes("<svg")) {
      throw new TypeError(
        "Failed to parse valid <svg> element from base64 data!",
      );
    }
    return asUtf8;
  }, [base64_svg_data]);

  return <IconFromUtf8XmlSvg src={utf8_svg_xml_data} {...props} size={size} />;
}

export default IconFromSvgDataUrl;
