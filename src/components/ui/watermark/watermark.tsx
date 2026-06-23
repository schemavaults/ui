"use client";

import {
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  useId,
  useMemo,
} from "react";

import { cn } from "@/lib/utils";

export const watermarkVariantIds = [
  "muted",
  "foreground",
  "primary",
  "secondary",
  "accent",
  "destructive",
  "warning",
] as const satisfies readonly string[];
export type WatermarkVariantId = (typeof watermarkVariantIds)[number];

const variantFillClass: Record<WatermarkVariantId, string> = {
  muted: "fill-muted-foreground",
  foreground: "fill-foreground",
  primary: "fill-primary",
  secondary: "fill-secondary",
  accent: "fill-accent",
  destructive: "fill-destructive",
  warning: "fill-warning",
};

export interface WatermarkProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content"> {
  /** Text content tiled across the overlay. Pass an array to render multi-line text per tile. */
  content: string | readonly string[];
  /** Color variant — pulls from @schemavaults/theme tokens. Default: `"muted"`. */
  variant?: WatermarkVariantId;
  /** Rotation of the watermark text in degrees. Default: `-22`. */
  rotation?: number;
  /** Horizontal spacing between tiles in pixels. Default: `220`. */
  gapX?: number;
  /** Vertical spacing between tiles in pixels. Default: `140`. */
  gapY?: number;
  /** Font size in pixels. Default: `18`. */
  fontSize?: number;
  /** Font weight (CSS font-weight). Default: `500`. */
  fontWeight?: number | string;
  /** Letter spacing (any valid CSS length). Default: `"0.08em"`. */
  letterSpacing?: string;
  /** Overlay opacity (0-1). Default: `0.18`. */
  opacity?: number;
  /** z-index of the overlay layer relative to the wrapper. Default: `5`. */
  zIndex?: number;
  /**
   * Stop user-select on the wrapped content. Watermarks are commonly used to deter
   * copying — enabling this matches that intent. Default: `false`.
   */
  disableTextSelection?: boolean;
  /** Wrapped content the watermark sits over. */
  children?: ReactNode;
}

/**
 * Watermark overlays repeating, rotated text across its children — useful for
 * `DEMO` / `PREVIEW` / `CONFIDENTIAL` indicators, sample-data banners, or
 * lightweight brand protection. The overlay is `pointer-events: none`,
 * `user-select: none`, and `aria-hidden`, so it never interferes with the
 * underlying content or assistive tech.
 *
 * The pattern is rendered as a single SVG `<pattern>` (one DOM node, GPU-friendly,
 * resolution-independent) and pulls colors from the @schemavaults/theme tokens
 * via the `variant` prop.
 */
export function Watermark({
  content,
  variant = "muted",
  rotation = -22,
  gapX = 220,
  gapY = 140,
  fontSize = 18,
  fontWeight = 500,
  letterSpacing = "0.08em",
  opacity = 0.18,
  zIndex = 5,
  disableTextSelection = false,
  className,
  children,
  style,
  ...props
}: WatermarkProps): ReactElement {
  const rawId = useId();
  const patternId = useMemo(
    (): string => `watermark-pattern-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    [rawId],
  );

  const lines: readonly string[] = Array.isArray(content)
    ? (content as readonly string[])
    : [content as string];

  const tileWidth = Math.max(40, gapX);
  const tileHeight = Math.max(40, gapY);
  const lineHeight = fontSize * 1.25;
  const textBlockHeight = lines.length * lineHeight;
  // Center the text block vertically inside its tile.
  const topOffset = (tileHeight - textBlockHeight) / 2 + fontSize * 0.85;

  const overlayStyle: CSSProperties = {
    zIndex,
    opacity,
  };

  const wrapperStyle: CSSProperties = {
    ...(disableTextSelection ? { userSelect: "none" } : {}),
    ...style,
  };

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={wrapperStyle}
      {...props}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none"
        style={overlayStyle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id={patternId}
              patternUnits="userSpaceOnUse"
              width={tileWidth}
              height={tileHeight}
              patternTransform={`rotate(${rotation})`}
            >
              <g
                className={variantFillClass[variant]}
                style={{ fontWeight, letterSpacing }}
              >
                {lines.map(
                  (line, index): ReactElement => (
                    <text
                      key={index}
                      x={tileWidth / 2}
                      y={topOffset + index * lineHeight}
                      fontSize={fontSize}
                      textAnchor="middle"
                    >
                      {line}
                    </text>
                  ),
                )}
              </g>
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill={`url(#${patternId})`}
          />
        </svg>
      </div>
    </div>
  );
}
Watermark.displayName = "Watermark";

export default Watermark;
