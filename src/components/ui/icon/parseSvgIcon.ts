import toReactSvgTransform from "./toReactSvgTransform";

/**
 *
 * @param utf8_svg_icon A string containing an SVG element. E.g. `<svg>...</svg>`
 * @param str_transforms A list of functions that transform <svg>...</svg> to e.g. modify attributes
 * @returns SVGSVGElement The parsed SVG DOM
 */
function parseSvgIcon(
  utf8_svg_icon: string,
  str_transforms: ((a: string) => string)[] = [toReactSvgTransform],
): SVGSVGElement {
  let domToParse: string = utf8_svg_icon;
  for (const transformFn of str_transforms) {
    domToParse = transformFn(domToParse);
  }

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(domToParse, "image/svg+xml");

  // Check for parsing errors
  const parserError = svgDoc.querySelector("parsererror");
  if (parserError) {
    throw new Error("Failed to parse SVG content");
  }

  const svgElement = svgDoc.documentElement as unknown as SVGSVGElement;

  if (svgElement.tagName.toLowerCase() !== "svg") {
    throw new TypeError("Fetched content is not a valid SVG");
  }

  return svgElement;
}

export default parseSvgIcon;
