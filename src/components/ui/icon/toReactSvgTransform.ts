function toReactSvgTransform(svg: string): string {
  let output: string = svg;

  // Replace stroke-width with strokeWidth
  output = output.replace(/stroke-width=/g, "strokeWidth=");

  // Replace stroke-linecap with strokeLinecap
  output = output.replace(/stroke-linecap=/g, "strokeLinecap=");

  // Replace stroke-linejoin with strokeLinejoin
  output = output.replace(/stroke-linejoin=/g, "strokeLinejoin=");

  return output;
}

export default toReactSvgTransform;
