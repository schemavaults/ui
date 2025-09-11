function parseSvgIcon(utf8_svg_icon: string): SVGSVGElement {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(utf8_svg_icon, "image/svg+xml");

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
