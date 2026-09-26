"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { useId } from "react";

import { cn } from "@/lib/utils";

export const treeMapSizeIds = [
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies string[];
export type TreeMapSizeId = (typeof treeMapSizeIds)[number];

export const treeMapColorIds = [
  "default",
  "primary",
  "positive",
  "warning",
  "destructive",
  "muted",
] as const satisfies string[];
export type TreeMapColorId = (typeof treeMapColorIds)[number];

/**
 * How a tile is painted.
 *
 * - `"soft"` — translucent fill behind a solid border. The default; labels sit
 *   on a near-background surface, so they keep full `foreground` contrast.
 * - `"solid"` — full-strength fill. Labels get a `background`-colored halo
 *   (`paint-order: stroke`) so they stay legible on top of saturated brand
 *   colors in both light and dark mode.
 * - `"outline"` — border only, no fill. Useful when the treemap is layered
 *   over an existing surface, or when the tiles are annotations rather than
 *   the primary subject of the chart.
 */
export const treeMapVariantIds = [
  "soft",
  "solid",
  "outline",
] as const satisfies string[];
export type TreeMapVariantId = (typeof treeMapVariantIds)[number];

/** Default canvas dimensions per size. Either axis can be overridden via the
 * `width` / `height` props. */
const SIZE_TO_CANVAS: Record<TreeMapSizeId, { width: number; height: number }> =
  {
    sm: { width: 260, height: 180 },
    md: { width: 380, height: 260 },
    lg: { width: 520, height: 340 },
    xl: { width: 680, height: 440 },
  };

const FILL_CLASSES: Record<TreeMapColorId, string> = {
  default: "fill-schemavaults-brand-blue",
  primary: "fill-primary",
  positive: "fill-emerald-500 dark:fill-emerald-400",
  warning: "fill-warning",
  destructive: "fill-destructive",
  muted: "fill-muted-foreground",
};

const STROKE_CLASSES: Record<TreeMapColorId, string> = {
  default: "stroke-schemavaults-brand-blue",
  primary: "stroke-primary",
  positive: "stroke-emerald-500 dark:stroke-emerald-400",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
  muted: "stroke-muted-foreground",
};

/**
 * Fallback color rotation when a top-level node doesn't specify its own color.
 * Index is the node's position among its siblings, modulo the palette length.
 * Descendants inherit their ancestor's color unless they override it, so each
 * branch of the tree reads as one family.
 */
const DEFAULT_COLOR_ROTATION: ReadonlyArray<TreeMapColorId> = [
  "default",
  "positive",
  "warning",
  "destructive",
  "primary",
  "muted",
];

/** Base fill opacity per variant, before the per-depth falloff is applied. */
const VARIANT_BASE_FILL_OPACITY: Record<TreeMapVariantId, number> = {
  soft: 0.18,
  solid: 0.9,
  outline: 0,
};

export const treeMapVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        md: "text-[11px]",
        lg: "text-xs",
        xl: "text-sm",
      } satisfies Record<TreeMapSizeId, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface TreeMapNode {
  /** Stable identifier. Used as the React key and in the click payload. */
  id: string;
  /** Human-readable name rendered inside the tile, when it fits. */
  label?: string;
  /**
   * Magnitude of this node. Ignored when `children` is non-empty — a branch is
   * always worth the sum of its children. Negative and non-finite values are
   * treated as `0`, and zero-valued nodes are omitted from the layout.
   */
  value?: number;
  /** Child nodes, laid out inside this node's tile. */
  children?: ReadonlyArray<TreeMapNode>;
  /**
   * Preset color id from the chart palette. Inherited by descendants that
   * don't set their own. Ignored if `fill` is provided.
   */
  color?: TreeMapColorId;
  /**
   * Override the fill and border with a raw CSS color (e.g. `"#ff0080"` or
   * `"hsl(var(--chart-1))"`). Takes precedence over `color`, and is *not*
   * inherited by descendants.
   */
  fill?: string;
  /** Extra classes applied to this node's `<rect>`. */
  className?: string;
  /** Fired when this tile is clicked or activated via keyboard. */
  onClick?: (
    node: TreeMapNode,
    event: MouseEvent<SVGRectElement> | KeyboardEvent<SVGRectElement>,
  ) => void;
}

export interface TreeMapTileContext {
  node: TreeMapNode;
  /** The node's own value, or the sum of its subtree for a branch. */
  value: number;
  /** Share of the chart total, in the range 0–1. */
  fraction: number;
  /** Nesting level; top-level nodes are `0`. */
  depth: number;
  /** Ancestor ids, root-first, ending with this node's own id. */
  path: ReadonlyArray<string>;
  /** `true` when this node has rendered children inside it. */
  isBranch: boolean;
  /** Tile width in SVG user units. */
  width: number;
  /** Tile height in SVG user units. */
  height: number;
}

export interface TreeMapProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof treeMapVariants> {
  /** Nodes to render. Nest via each node's `children`. */
  nodes: ReadonlyArray<TreeMapNode>;
  /** Accessible label describing what the treemap represents. */
  label: string;
  /** Tile paint style. Defaults to `"soft"`. */
  variant?: TreeMapVariantId;
  /** Override the rendered canvas width in pixels (defaults are size-aware). */
  width?: number;
  /** Override the rendered canvas height in pixels (defaults are size-aware). */
  height?: number;
  /**
   * Denominator for every tile's `fraction`. Defaults to the sum of all node
   * values. Useful for pinning several treemaps to a shared scale, or for
   * showing a subset as a share of some known whole.
   */
  total?: number;
  /**
   * Deepest nesting level to render, 0-based. Nodes below it are collapsed
   * into their deepest rendered ancestor, which keeps its aggregate value.
   * Defaults to rendering the whole tree.
   */
  maxDepth?: number;
  /**
   * Sort siblings by descending value before laying them out. Defaults to
   * `true`, which is what makes the squarified layout produce compact,
   * near-square tiles. Set to `false` to preserve the input order.
   */
  sort?: boolean;
  /** Gap between sibling tiles, in pixels. Defaults to `2`. */
  tileGap?: number;
  /** Inner padding between a branch tile and its children. Defaults to `4`. */
  groupPadding?: number;
  /**
   * Height of the band reserved at the top of a labelled branch for its own
   * name. Defaults to `16`. The band is dropped when the branch is too short
   * to spare it.
   */
  groupHeaderHeight?: number;
  /** Corner radius of every tile, in pixels. Defaults to `3`. */
  cornerRadius?: number;
  /** Render each tile's `label` when it fits. Defaults to `true`. */
  showLabels?: boolean;
  /** Render each tile's value under its label when it fits. Defaults to `true`. */
  showValues?: boolean;
  /**
   * Smallest tile width, in SVG units, that may carry a label. Narrower tiles
   * render unlabelled rather than overflowing. Defaults to `48`.
   */
  minLabelWidth?: number;
  /**
   * Smallest *leaf* tile height, in SVG units, that may carry a label. Shorter
   * leaves render unlabelled. Defaults to `18`. A branch's name lives in its
   * header band instead, which is governed by `groupHeaderHeight`.
   */
  minLabelHeight?: number;
  /**
   * Fill opacity of a top-level tile, overriding the variant default
   * (`0.18` for `"soft"`, `0.9` for `"solid"`, `0` for `"outline"`).
   */
  tileFillOpacity?: number;
  /**
   * How much of the parent's fill opacity each nesting level keeps, so nested
   * tiles read as shades of one family. Defaults to `0.55`.
   */
  depthFillFalloff?: number;
  /** Customize the tile-label text. Return `null` to skip a tile's label. */
  labelFormatter?: (context: TreeMapTileContext) => string | null;
  /**
   * Customize the value text. Return `null` to skip it. Defaults to the
   * locale-formatted value.
   */
  valueFormatter?: (context: TreeMapTileContext) => string | null;
  /**
   * Fallback handler invoked for any tile that doesn't have its own `onClick`.
   */
  onNodeClick?: (
    node: TreeMapNode,
    event: MouseEvent<SVGRectElement> | KeyboardEvent<SVGRectElement>,
  ) => void;
  /** Optional content overlaid on top of the plot area. */
  children?: ReactNode;
  /** Extra classes for the overlay content wrapper. */
  overlayClassName?: string;
  /** Extra classes applied to every tile-label `<text>` element. */
  labelClassName?: string;
  /** Extra classes applied to every value-label `<text>` element. */
  valueClassName?: string;
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MeasuredNode {
  node: TreeMapNode;
  value: number;
  /** Empty for a leaf, or for a branch clipped off by `maxDepth`. */
  children: ReadonlyArray<MeasuredNode>;
}

interface ResolvedTile {
  node: TreeMapNode;
  /** Unique across the tree even if two branches reuse an id. */
  key: string;
  /**
   * Position in the flattened tile list. Used to build clip-path ids, because
   * `key` carries the node ids verbatim and those may contain characters that
   * are not valid in a CSS `url(#…)` reference.
   */
  index: number;
  path: ReadonlyArray<string>;
  depth: number;
  value: number;
  fraction: number;
  rect: Rect;
  isBranch: boolean;
  /** Vertical space taken by this branch's own label band, or `0`. */
  headerHeight: number;
  color: TreeMapColorId;
  fill: string | undefined;
  fillOpacity: number;
}

function sanitizeValue(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

/** Aggregate value of a subtree, used when `maxDepth` collapses a branch. */
function subtreeValue(node: TreeMapNode): number {
  const children: ReadonlyArray<TreeMapNode> = node.children ?? [];
  if (children.length === 0) return sanitizeValue(node.value ?? 0);
  let sum = 0;
  for (const child of children) sum += subtreeValue(child);
  return sum;
}

function measure(
  node: TreeMapNode,
  depth: number,
  maxDepth: number,
): MeasuredNode {
  const children: ReadonlyArray<TreeMapNode> = node.children ?? [];
  if (children.length === 0 || depth >= maxDepth) {
    return { node, value: subtreeValue(node), children: [] };
  }
  const measured: ReadonlyArray<MeasuredNode> = children
    .map((child) => measure(child, depth + 1, maxDepth))
    .filter((child) => child.value > 0);
  let sum = 0;
  for (const child of measured) sum += child.value;
  return { node, value: sum, children: measured };
}

/**
 * Worst (largest) aspect ratio produced by laying `values[start..end]` out as
 * one row of thickness `rowArea / side` across a side of length `side`.
 */
function worstAspect(
  values: ReadonlyArray<number>,
  start: number,
  end: number,
  scale: number,
  side: number,
): number {
  let rowValue = 0;
  for (let i = start; i <= end; i++) rowValue += values[i]!;
  const rowArea: number = rowValue * scale;
  if (rowArea <= 0 || side <= 0) return Number.POSITIVE_INFINITY;
  const thickness: number = rowArea / side;
  let worst = 0;
  for (let i = start; i <= end; i++) {
    const length: number = (values[i]! * scale) / thickness;
    if (length <= 0) return Number.POSITIVE_INFINITY;
    worst = Math.max(worst, thickness / length, length / thickness);
  }
  return worst;
}

/**
 * Squarified treemap layout (Bruls, Huizing & van Wijk, 2000).
 *
 * Fills `rect` with one rectangle per entry in `values`, each with an area
 * proportional to its value. Rows are grown greedily while they keep improving
 * the worst aspect ratio, which is what keeps the tiles close to square and
 * therefore comparable by eye. `values` is expected to be sorted descending
 * (the caller does that unless `sort` is off); an unsorted input still lays out
 * correctly, just with less square tiles.
 */
function squarify(values: ReadonlyArray<number>, rect: Rect): Array<Rect> {
  const out: Array<Rect> = values.map(() => ({
    x: rect.x,
    y: rect.y,
    w: 0,
    h: 0,
  }));
  const live: ReadonlyArray<number> = values
    .map((_, index) => index)
    .filter((index) => values[index]! > 0);
  if (live.length === 0) return out;

  const liveValues: ReadonlyArray<number> = live.map((index) => values[index]!);
  let remaining = 0;
  for (const value of liveValues) remaining += value;

  let free: Rect = { ...rect };
  let cursor = 0;

  while (cursor < liveValues.length && remaining > 0) {
    if (free.w <= 0 || free.h <= 0) break;

    // Rows run along the shorter side of the free rectangle; that is the
    // choice that keeps the aspect ratios low.
    const stacked: boolean = free.w >= free.h;
    const side: number = stacked ? free.h : free.w;
    const scale: number = (free.w * free.h) / remaining;

    let count = 1;
    let best: number = worstAspect(liveValues, cursor, cursor, scale, side);
    while (cursor + count < liveValues.length) {
      const next: number = worstAspect(
        liveValues,
        cursor,
        cursor + count,
        scale,
        side,
      );
      if (next > best) break;
      best = next;
      count += 1;
    }

    let rowValue = 0;
    for (let i = cursor; i < cursor + count; i++) rowValue += liveValues[i]!;
    // Clamp against the long side so floating-point drift can't push the last
    // row past the edge of the free rectangle.
    const thickness: number = Math.min(
      stacked ? free.w : free.h,
      (rowValue * scale) / side,
    );

    let offset = 0;
    for (let i = cursor; i < cursor + count; i++) {
      const area: number = liveValues[i]! * scale;
      const length: number =
        thickness > 0 ? Math.min(side - offset, area / thickness) : 0;
      out[live[i]!] = stacked
        ? { x: free.x, y: free.y + offset, w: thickness, h: length }
        : { x: free.x + offset, y: free.y, w: length, h: thickness };
      offset += length;
    }

    free = stacked
      ? { x: free.x + thickness, y: free.y, w: free.w - thickness, h: free.h }
      : { x: free.x, y: free.y + thickness, w: free.w, h: free.h - thickness };
    remaining -= rowValue;
    cursor += count;
  }

  return out;
}

/** Shrink a rectangle by `inset` on every side, never past zero. */
function deflate(rect: Rect, inset: number): Rect {
  const w: number = Math.max(0, rect.w - inset * 2);
  const h: number = Math.max(0, rect.h - inset * 2);
  return {
    x: rect.x + (rect.w - w) / 2,
    y: rect.y + (rect.h - h) / 2,
    w,
    h,
  };
}

interface LayoutOptions {
  total: number;
  sort: boolean;
  tileGap: number;
  groupPadding: number;
  groupHeaderHeight: number;
  variantFillOpacity: number;
  depthFillFalloff: number;
}

function layoutInto(
  siblings: ReadonlyArray<MeasuredNode>,
  rect: Rect,
  depth: number,
  parentPath: ReadonlyArray<string>,
  parentKey: string,
  inheritedColor: TreeMapColorId | undefined,
  options: LayoutOptions,
  out: Array<ResolvedTile>,
): void {
  if (siblings.length === 0 || rect.w <= 0 || rect.h <= 0) return;

  const ordered: ReadonlyArray<MeasuredNode> = options.sort
    ? [...siblings].sort((a, b) => b.value - a.value)
    : siblings;

  const rects: ReadonlyArray<Rect> = squarify(
    ordered.map((child) => child.value),
    rect,
  );

  ordered.forEach((measured, index) => {
    const raw: Rect = rects[index]!;
    const tileRect: Rect = deflate(raw, options.tileGap / 2);
    if (tileRect.w <= 0 || tileRect.h <= 0) return;

    const color: TreeMapColorId =
      measured.node.color ??
      inheritedColor ??
      DEFAULT_COLOR_ROTATION[index % DEFAULT_COLOR_ROTATION.length]!;
    const isBranch: boolean = measured.children.length > 0;
    const path: ReadonlyArray<string> = [...parentPath, measured.node.id];
    const key = `${parentKey}/${measured.node.id}:${index}`;

    // A branch only earns a header band if it is labelled and tall enough to
    // give one up without squashing its children.
    const wantsHeader: boolean =
      isBranch &&
      Boolean(measured.node.label) &&
      tileRect.h > options.groupHeaderHeight * 2.2;
    const headerHeight: number = wantsHeader ? options.groupHeaderHeight : 0;

    out.push({
      node: measured.node,
      key,
      index: out.length,
      path,
      depth,
      value: measured.value,
      fraction: options.total > 0 ? measured.value / options.total : 0,
      rect: tileRect,
      isBranch,
      headerHeight,
      color,
      fill: measured.node.fill,
      fillOpacity:
        options.variantFillOpacity *
        Math.pow(options.depthFillFalloff, depth) *
        (isBranch ? 0.6 : 1),
    });

    if (!isBranch) return;

    const inner: Rect = deflate(
      {
        x: tileRect.x,
        y: tileRect.y + headerHeight,
        w: tileRect.w,
        h: Math.max(0, tileRect.h - headerHeight),
      },
      options.groupPadding,
    );
    layoutInto(
      measured.children,
      inner,
      depth + 1,
      path,
      key,
      measured.node.fill ? undefined : color,
      options,
      out,
    );
  });
}

function defaultValueText({ value }: TreeMapTileContext): string {
  return value.toLocaleString();
}

function TreeMap({
  nodes,
  label,
  variant = "soft",
  size,
  width,
  height,
  total,
  maxDepth = Number.POSITIVE_INFINITY,
  sort = true,
  tileGap = 2,
  groupPadding = 4,
  groupHeaderHeight = 16,
  cornerRadius = 3,
  showLabels = true,
  showValues = true,
  minLabelWidth = 48,
  minLabelHeight = 18,
  tileFillOpacity,
  depthFillFalloff = 0.55,
  labelFormatter,
  valueFormatter,
  onNodeClick,
  children,
  className,
  overlayClassName,
  labelClassName,
  valueClassName,
  ref,
  ...props
}: TreeMapProps): ReactElement {
  const resolvedSize: TreeMapSizeId = size ?? "md";
  const canvas = SIZE_TO_CANVAS[resolvedSize];
  const W: number = width ?? canvas.width;
  const H: number = height ?? canvas.height;

  const titleId: string = useId();
  const clipIdPrefix: string = useId();

  const measured: ReadonlyArray<MeasuredNode> = nodes
    .map((node) => measure(node, 0, maxDepth))
    .filter((node) => node.value > 0);

  let measuredTotal = 0;
  for (const node of measured) measuredTotal += node.value;
  const scaleTotal: number = total ?? measuredTotal;

  const tiles: Array<ResolvedTile> = [];
  layoutInto(
    measured,
    { x: 0, y: 0, w: W, h: H },
    0,
    [],
    "root",
    undefined,
    {
      total: scaleTotal,
      sort,
      tileGap: Math.max(0, tileGap),
      groupPadding: Math.max(0, groupPadding),
      groupHeaderHeight: Math.max(0, groupHeaderHeight),
      variantFillOpacity:
        tileFillOpacity ?? VARIANT_BASE_FILL_OPACITY[variant],
      depthFillFalloff: Math.max(0, Math.min(1, depthFillFalloff)),
    },
    tiles,
  );

  // Labels sitting on a saturated fill need a halo to stay readable in both
  // brightness themes; `soft` and `outline` tiles are close enough to the page
  // background that plain foreground text is already high-contrast.
  const haloed: boolean = variant === "solid";

  function contextFor(tile: ResolvedTile): TreeMapTileContext {
    return {
      node: tile.node,
      value: tile.value,
      fraction: tile.fraction,
      depth: tile.depth,
      path: tile.path,
      isBranch: tile.isBranch,
      width: tile.rect.w,
      height: tile.rect.h,
    };
  }

  return (
    <div
      ref={ref}
      role="img"
      aria-labelledby={titleId}
      data-slot="treemap"
      data-variant={variant}
      className={cn(treeMapVariants({ size }), className)}
      style={{ width: W, height: H }}
      {...props}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden={children ? "true" : undefined}
        className="h-full w-full"
      >
        <title id={titleId}>{label}</title>

        {tiles.length === 0 ? (
          <text
            x={W / 2}
            y={H / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground"
          >
            No data
          </text>
        ) : null}

        {tiles.length > 0 ? (
          <defs>
            {tiles.map((tile) => (
              <clipPath key={tile.key} id={`${clipIdPrefix}-${tile.index}`}>
                <rect
                  x={tile.rect.x}
                  y={tile.rect.y}
                  width={tile.rect.w}
                  height={tile.rect.h}
                  rx={cornerRadius}
                />
              </clipPath>
            ))}
          </defs>
        ) : null}

        {tiles.map((tile) => {
          const handler = tile.node.onClick ?? onNodeClick;
          const isInteractive: boolean = typeof handler === "function";
          const name: string = tile.node.label ?? tile.node.id;
          return (
            <rect
              key={tile.key}
              x={tile.rect.x}
              y={tile.rect.y}
              width={tile.rect.w}
              height={tile.rect.h}
              rx={cornerRadius}
              data-slot={tile.isBranch ? "treemap-group" : "treemap-tile"}
              data-node-id={tile.node.id}
              data-depth={tile.depth}
              fill={tile.fill}
              fillOpacity={tile.fillOpacity}
              stroke={tile.fill}
              strokeWidth={variant === "outline" ? 1.5 : 1}
              strokeOpacity={variant === "solid" && !tile.isBranch ? 0 : 1}
              role={isInteractive ? "button" : undefined}
              tabIndex={isInteractive ? 0 : undefined}
              aria-label={`${name}: ${tile.value}`}
              onClick={
                isInteractive
                  ? (event: MouseEvent<SVGRectElement>): void => {
                      handler!(tile.node, event);
                    }
                  : undefined
              }
              onKeyDown={
                isInteractive
                  ? (event: KeyboardEvent<SVGRectElement>): void => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handler!(tile.node, event);
                      }
                    }
                  : undefined
              }
              className={cn(
                "transition-opacity",
                tile.fill === undefined && FILL_CLASSES[tile.color],
                tile.fill === undefined && STROKE_CLASSES[tile.color],
                isInteractive &&
                  "cursor-pointer hover:opacity-80 focus:outline-none focus-visible:opacity-80",
                tile.node.className,
              )}
            />
          );
        })}

        {showLabels || showValues ? (
          <g
            aria-hidden="true"
            data-slot="treemap-labels"
            className="pointer-events-none select-none"
          >
            {tiles.map((tile) => {
              const context: TreeMapTileContext = contextFor(tile);
              const name: string | null = showLabels
                ? labelFormatter
                  ? labelFormatter(context)
                  : (tile.node.label ?? tile.node.id)
                : null;
              const value: string | null = showValues
                ? (valueFormatter ?? defaultValueText)(context)
                : null;
              if (!name && !value) return null;

              // A branch prints its name in its header band; a leaf centers
              // its name (and value) in the middle of the tile.
              const band: number = tile.isBranch
                ? tile.headerHeight
                : tile.rect.h;
              if (band <= 0) return null;
              if (tile.rect.w < minLabelWidth) return null;
              // `minLabelHeight` is about a leaf having room for centered
              // text. A branch's band is already sized by `groupHeaderHeight`
              // and only exists when the branch was tall enough to spare it,
              // so applying the leaf threshold here would silently drop every
              // group name whenever `groupHeaderHeight < minLabelHeight`.
              if (!tile.isBranch && band < minLabelHeight) return null;

              const showBoth: boolean =
                Boolean(name) &&
                Boolean(value) &&
                !tile.isBranch &&
                band >= minLabelHeight * 2;
              const centerX: number = tile.rect.x + tile.rect.w / 2;
              const centerY: number = tile.isBranch
                ? tile.rect.y + tile.headerHeight / 2
                : tile.rect.y + tile.rect.h / 2;
              const anchorX: number = tile.isBranch
                ? tile.rect.x + 6
                : centerX;
              const textAnchor: "start" | "middle" = tile.isBranch
                ? "start"
                : "middle";
              const haloClasses: string | false =
                haloed && "[paint-order:stroke] stroke-background stroke-[3px]";

              return (
                <g
                  key={`${tile.key}-label`}
                  clipPath={`url(#${clipIdPrefix}-${tile.index})`}
                >
                  {name ? (
                    <text
                      x={anchorX}
                      y={centerY}
                      dy={showBoth ? "-0.25em" : 0}
                      textAnchor={textAnchor}
                      dominantBaseline="central"
                      className={cn(
                        "fill-foreground font-medium",
                        haloClasses,
                        labelClassName,
                      )}
                    >
                      {name}
                    </text>
                  ) : null}
                  {value && (showBoth || !name) ? (
                    <text
                      x={anchorX}
                      y={centerY}
                      dy={showBoth ? "1.1em" : 0}
                      textAnchor={textAnchor}
                      dominantBaseline="central"
                      className={cn(
                        "fill-muted-foreground tabular-nums",
                        haloClasses,
                        valueClassName,
                      )}
                    >
                      {value}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </g>
        ) : null}
      </svg>
      {children ? (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center text-center",
            overlayClassName,
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
TreeMap.displayName = "TreeMap";

export { TreeMap };
