"use client";

import {
  type RefObject,
  Suspense,
  use,
  useMemo,
  type ComponentProps,
  type ReactElement,
} from "react";
import Skeleton from "@/components/ui/skeleton";

export interface IconProps {
  src: string;
  size?: number;
  className?: string;
  style?: ComponentProps<"img">["style"];
}

export const DEFAULT_ICON_SIZE = 24 as const satisfies number;

function IconSkeleton({ size }: Pick<IconProps, "size">): ReactElement {
  return <Skeleton style={{ width: size, height: size }} />;
}

function LoadedSvgIcon(
  props: Omit<IconProps, "src"> & {
    innerHTML: string;
    viewBox?: string;
    svgAttributes?: Record<string, string>;
  },
): ReactElement {
  const { innerHTML, viewBox, svgAttributes, size, ...restProps } = props;
  return (
    <svg
      {...svgAttributes}
      {...restProps}
      viewBox={viewBox}
      width={size}
      height={size}
      dangerouslySetInnerHTML={{ __html: innerHTML }}
    />
  );
}

function LazySvgIcon(
  props: Omit<IconProps, "src"> & { svgPromise: Promise<SVGSVGElement> },
): ReactElement {
  const svg = use(props.svgPromise);

  // Extract SVG content and attributes
  const innerHTML = svg.innerHTML;
  const viewBox = svg.getAttribute("viewBox") || undefined;

  // Extract other SVG attributes (excluding ones we handle separately)
  const svgAttributes: Record<string, string> = {};
  Array.from(svg.attributes).forEach((attr) => {
    if (!["viewBox", "width", "height", "style", "class"].includes(attr.name)) {
      svgAttributes[attr.name] = attr.value;
    }
  });

  return (
    <LoadedSvgIcon
      innerHTML={innerHTML}
      viewBox={viewBox}
      svgAttributes={svgAttributes}
      size={props.size}
      {...props}
    />
  );
}

export function Icon({ src, ...props }: IconProps): ReactElement {
  const size: number = useMemo((): number => {
    return typeof props.size === "number" ? props.size : DEFAULT_ICON_SIZE;
  }, [props.size]);

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
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, "image/svg+xml");

      // Check for parsing errors
      const parserError = svgDoc.querySelector("parsererror");
      if (parserError) {
        throw new Error("Failed to parse SVG content");
      }

      const svgElement = svgDoc.documentElement as unknown as SVGSVGElement;

      if (svgElement.tagName.toLowerCase() !== "svg") {
        throw new Error("Fetched content is not a valid SVG");
      }

      return svgElement;
    })();
  }, [src]);

  return (
    <Suspense fallback={<IconSkeleton size={size} />}>
      <LazySvgIcon svgPromise={iconData} size={size} {...props} />
    </Suspense>
  );
}

export default Icon;
