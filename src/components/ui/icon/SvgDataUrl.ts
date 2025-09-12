export const SvgDataUrlMimeType = "image/svg+xml" as const satisfies string;

export const svgDataUrlPrefix =
  `data:${SvgDataUrlMimeType};base64,` as const satisfies string;

export function isValidSvgDataUrlPrefix(
  maybeSvgDataUrl: string,
): maybeSvgDataUrl is `data:${typeof SvgDataUrlMimeType};base64,${string}` {
  if (typeof maybeSvgDataUrl === "string") {
    if (maybeSvgDataUrl.startsWith(svgDataUrlPrefix)) {
      if (maybeSvgDataUrl.length > svgDataUrlPrefix.length) {
        return true;
      }
    }
  }

  return false;
}

export function extractBase64SvgData(
  svg_dataurl: `data:${typeof SvgDataUrlMimeType};base64,${string}`,
): string {
  return svg_dataurl.slice(svgDataUrlPrefix.length);
}
