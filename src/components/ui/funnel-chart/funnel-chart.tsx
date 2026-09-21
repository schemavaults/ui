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

export const funnelChartSizeIds = [
  "sm",
  "md",
  "lg",
  "xl",
] as const satisfies string[];
export type FunnelChartSizeId = (typeof funnelChartSizeIds)[number];

export const funnelChartOrientationIds = [
  "vertical",
  "horizontal",
] as const satisfies string[];
export type FunnelChartOrientationId =
  (typeof funnelChartOrientationIds)[number];

export const funnelChartStageColorIds = [
  "default",
  "primary",
  "positive",
  "warning",
  "destructive",
  "muted",
] as const satisfies string[];
export type FunnelChartStageColorId =
  (typeof funnelChartStageColorIds)[number];

/**
 * Baseline used when computing each stage's conversion rate.
 *
 * - `"previous"` — share of the immediately preceding stage (step conversion).
 * - `"first"` — share of the first stage (cumulative conversion).
 * - `"none"` — don't compute conversion rates.
 */
export const funnelChartConversionModeIds = [
  "previous",
  "first",
  "none",
] as const satisfies string[];
export type FunnelChartConversionModeId =
  (typeof funnelChartConversionModeIds)[number];

/** Default canvas dimensions per size. Either axis can be overridden via the
 * `width` / `height` props. */
const SIZE_TO_CANVAS: Record<
  FunnelChartSizeId,
  { width: number; height: number }
> = {
  sm: { width: 260, height: 160 },
  md: { width: 380, height: 220 },
  lg: { width: 500, height: 300 },
  xl: { width: 660, height: 400 },
};

const STAGE_FILL_CLASSES: Record<FunnelChartStageColorId, string> = {
  default: "fill-schemavaults-brand-blue",
  primary: "fill-primary",
  positive: "fill-emerald-500 dark:fill-emerald-400",
  warning: "fill-warning",
  destructive: "fill-destructive",
  muted: "fill-muted-foreground",
};

/**
 * Fallback color rotation when a stage doesn't specify its own color. Index is
 * the stage position in the input array, modulo the palette length.
 */
const DEFAULT_COLOR_ROTATION: ReadonlyArray<FunnelChartStageColorId> = [
  "default",
  "positive",
  "warning",
  "destructive",
  "primary",
  "muted",
];

export const funnelChartVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center",
  {
    variants: {
      size: {
        sm: "text-[10px]",
        md: "text-[11px]",
        lg: "text-xs",
        xl: "text-sm",
      } satisfies Record<FunnelChartSizeId, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface FunnelChartStage {
  /** Stable identifier for the stage. Used as React key and click payload. */
  id: string;
  /**
   * Population that reached this stage. Stage thickness is `value / max`.
   * Negative and non-finite values are treated as `0`.
   */
  value: number;
  /** Human-readable stage name rendered in the label gutter. */
  label?: string;
  /** Preset color id from the chart palette. Ignored if `fill` is provided. */
  color?: FunnelChartStageColorId;
  /**
   * Override the fill with a raw CSS color (e.g. `"#ff0080"` or
   * `"hsl(var(--chart-1))"`). Takes precedence over `color`.
   */
  fill?: string;
  /** Extra classes applied to this stage's `<polygon>`. */
  className?: string;
  /** Fired when this stage is clicked or activated via keyboard. */
  onClick?: (
    stage: FunnelChartStage,
    event: MouseEvent<SVGPolygonElement> | KeyboardEvent<SVGPolygonElement>,
  ) => void;
}

export interface FunnelChartLabelContext {
  stage: FunnelChartStage;
  value: number;
  /** Share of the scale max, in the range 0–1. */
  fraction: number;
  /**
   * Share of the conversion baseline, in the range 0–1, or `null` for the
   * first stage in `"previous"` mode (nothing precedes it) and whenever the
   * baseline is `0`.
   */
  conversion: number | null;
  index: number;
  /** Total number of stages in the funnel. */
  count: number;
}

export interface FunnelChartProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onClick">,
    VariantProps<typeof funnelChartVariants> {
  /** Stages to render, in funnel order (widest first, by convention). */
  stages: ReadonlyArray<FunnelChartStage>;
  /** Accessible label describing what the funnel represents. */
  label: string;
  /**
   * Funnel direction. `"vertical"` (default) narrows downward; `"horizontal"`
   * narrows to the right.
   */
  orientation?: FunnelChartOrientationId;
  /**
   * Upper bound of the value scale. Defaults to the largest stage value (or
   * `1` when every stage is `0`). Useful for pinning multiple funnels to a
   * shared scale.
   */
  max?: number;
  /** Override the rendered canvas width in pixels (defaults are size-aware). */
  width?: number;
  /** Override the rendered canvas height in pixels (defaults are size-aware). */
  height?: number;
  /** Gap between stage bands, in pixels. Defaults to `4`. */
  stageGap?: number;
  /**
   * Smallest thickness any non-zero stage may shrink to, as a fraction of the
   * full scale (0–1). Keeps deep-funnel stages visible. Defaults to `0.04`.
   */
  minStageRatio?: number;
  /**
   * Render the final stage as a rectangle (`false`, the default) or taper it
   * to a point (`true`).
   */
  taperLastStage?: boolean;
  /** Which baseline conversion rates are measured against. Defaults to `"previous"`. */
  conversionMode?: FunnelChartConversionModeId;
  /** Render each stage's `label` in the label gutter. Defaults to `true`. */
  showStageLabels?: boolean;
  /** Render each stage's value beneath its label. Defaults to `true`. */
  showValueLabels?: boolean;
  /**
   * Render each stage's conversion rate in the opposite gutter. Defaults to
   * `true`. Ignored when `conversionMode` is `"none"`.
   */
  showConversionLabels?: boolean;
  /** Customize the stage-label text. Return `null` to skip a stage. */
  stageLabelFormatter?: (context: FunnelChartLabelContext) => string | null;
  /**
   * Customize the value text. Return `null` to skip a stage. Defaults to the
   * locale-formatted value.
   */
  valueLabelFormatter?: (context: FunnelChartLabelContext) => string | null;
  /**
   * Customize the conversion text. Return `null` to skip a stage. Defaults to
   * a rounded percentage (e.g. `"62%"`).
   */
  conversionLabelFormatter?: (
    context: FunnelChartLabelContext,
  ) => string | null;
  /**
   * Fallback handler invoked for any stage that doesn't have its own
   * `onClick`. Receives the clicked stage.
   */
  onStageClick?: (
    stage: FunnelChartStage,
    event: MouseEvent<SVGPolygonElement> | KeyboardEvent<SVGPolygonElement>,
  ) => void;
  /** Optional content overlaid on top of the plot area. */
  children?: ReactNode;
  /** Extra classes for the overlay content wrapper. */
  overlayClassName?: string;
  /** Extra classes applied to every stage-label `<text>` element. */
  stageLabelClassName?: string;
  /** Extra classes applied to every value-label `<text>` element. */
  valueLabelClassName?: string;
  /** Extra classes applied to every conversion-label `<text>` element. */
  conversionLabelClassName?: string;
  /** Optional ref forwarded to the wrapper element. */
  ref?: Ref<HTMLDivElement>;
}

interface ResolvedStage {
  stage: FunnelChartStage;
  value: number;
  fraction: number;
  conversion: number | null;
  /** Trapezoid corners in SVG user units, already gap-adjusted. */
  points: string;
  /** Anchor for the stage / value labels (label gutter side). */
  labelX: number;
  labelY: number;
  /** Anchor for the conversion label (opposite gutter). */
  conversionX: number;
  conversionY: number;
  fillClass: string | undefined;
  fill: string | undefined;
}

function sanitizeValue(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0;
  return value;
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

function defaultValueLabel({ value }: FunnelChartLabelContext): string {
  return value.toLocaleString();
}

function defaultConversionLabel({
  conversion,
}: FunnelChartLabelContext): string | null {
  if (conversion === null) return null;
  return `${Math.round(conversion * 100)}%`;
}

function FunnelChart({
  stages,
  label,
  orientation = "vertical",
  max,
  size,
  width,
  height,
  stageGap = 4,
  minStageRatio = 0.04,
  taperLastStage = false,
  conversionMode = "previous",
  showStageLabels = true,
  showValueLabels = true,
  showConversionLabels = true,
  stageLabelFormatter,
  valueLabelFormatter,
  conversionLabelFormatter,
  onStageClick,
  children,
  className,
  overlayClassName,
  stageLabelClassName,
  valueLabelClassName,
  conversionLabelClassName,
  ref,
  ...props
}: FunnelChartProps): ReactElement {
  const resolvedSize: FunnelChartSizeId = size ?? "md";
  const canvas = SIZE_TO_CANVAS[resolvedSize];
  const W: number = width ?? canvas.width;
  const H: number = height ?? canvas.height;

  const titleId: string = useId();

  const isHorizontal: boolean = orientation === "horizontal";
  const showConversion: boolean =
    showConversionLabels && conversionMode !== "none";
  const hasLabelGutter: boolean = showStageLabels || showValueLabels;

  // One gutter carries the stage name + value, the opposite one carries the
  // conversion rate. Vertical funnels read left-to-right; horizontal funnels
  // put the names underneath, like a category axis.
  const labelGutter: number = hasLabelGutter ? (isHorizontal ? 38 : 92) : 6;
  const conversionGutter: number = showConversion
    ? isHorizontal
      ? 18
      : 54
    : 6;

  const padTop: number = isHorizontal ? conversionGutter : 6;
  const padBottom: number = isHorizontal ? labelGutter : 6;
  const padLeft: number = isHorizontal ? 6 : labelGutter;
  const padRight: number = isHorizontal ? 6 : conversionGutter;

  const plotX0: number = padLeft;
  const plotY0: number = padTop;
  const plotW: number = Math.max(0, W - padLeft - padRight);
  const plotH: number = Math.max(0, H - padTop - padBottom);

  const count: number = stages.length;
  const sanitized: ReadonlyArray<number> = stages.map((s) =>
    sanitizeValue(s.value),
  );
  const computedMax: number = max ?? Math.max(0, ...sanitized);
  const scaleMax: number = computedMax > 0 ? computedMax : 1;

  const minRatio: number = Math.max(0, Math.min(1, minStageRatio));

  /** Thickness of the funnel, in SVG units, for a given stage value. */
  function thicknessFor(value: number): number {
    const span: number = isHorizontal ? plotH : plotW;
    const raw: number = value / scaleMax;
    const ratio: number = value > 0 ? Math.max(minRatio, raw) : 0;
    return Math.min(1, ratio) * span;
  }

  function conversionFor(index: number): number | null {
    if (conversionMode === "none") return null;
    if (conversionMode === "first") {
      const baseline: number = sanitized[0] ?? 0;
      return baseline > 0 ? sanitized[index]! / baseline : null;
    }
    if (index === 0) return null;
    const baseline: number = sanitized[index - 1]!;
    return baseline > 0 ? sanitized[index]! / baseline : null;
  }

  const resolved: ReadonlyArray<ResolvedStage> = (() => {
    if (count === 0) return [];
    const flowSpan: number = isHorizontal ? plotW : plotH;
    const band: number = flowSpan / count;
    const gap: number = Math.max(0, Math.min(band, stageGap));
    // Center line the funnel is mirrored around.
    const center: number = isHorizontal
      ? plotY0 + plotH / 2
      : plotX0 + plotW / 2;

    return stages.map((stage, index): ResolvedStage => {
      const value: number = sanitized[index]!;
      const isLast: boolean = index === count - 1;
      const startThickness: number = thicknessFor(value);
      const endThickness: number = isLast
        ? taperLastStage
          ? 0
          : startThickness
        : thicknessFor(sanitized[index + 1]!);

      // Interpolate the edges across the band, then inset by the gap so the
      // silhouette stays continuous no matter how wide the gap is.
      const bandStart: number = (isHorizontal ? plotX0 : plotY0) + index * band;
      const a: number = bandStart + gap / 2;
      const b: number = bandStart + band - gap / 2;
      const tA: number = band > 0 ? (a - bandStart) / band : 0;
      const tB: number = band > 0 ? (b - bandStart) / band : 1;
      const thicknessA: number = lerp(startThickness, endThickness, tA);
      const thicknessB: number = lerp(startThickness, endThickness, tB);

      const points: string = isHorizontal
        ? [
            `${a},${center - thicknessA / 2}`,
            `${b},${center - thicknessB / 2}`,
            `${b},${center + thicknessB / 2}`,
            `${a},${center + thicknessA / 2}`,
          ].join(" ")
        : [
            `${center - thicknessA / 2},${a}`,
            `${center + thicknessA / 2},${a}`,
            `${center + thicknessB / 2},${b}`,
            `${center - thicknessB / 2},${b}`,
          ].join(" ");

      const mid: number = (a + b) / 2;
      const presetColor: FunnelChartStageColorId =
        stage.color ??
        DEFAULT_COLOR_ROTATION[index % DEFAULT_COLOR_ROTATION.length]!;
      const fillClass: string | undefined = stage.fill
        ? undefined
        : STAGE_FILL_CLASSES[presetColor];

      return {
        stage,
        value,
        fraction: value / scaleMax,
        conversion: conversionFor(index),
        points,
        labelX: isHorizontal ? mid : plotX0 - 10,
        labelY: isHorizontal ? plotY0 + plotH + 14 : mid,
        conversionX: isHorizontal ? mid : plotX0 + plotW + 10,
        conversionY: isHorizontal ? plotY0 - 6 : mid,
        fillClass,
        fill: stage.fill,
      };
    });
  })();

  function contextFor(r: ResolvedStage, index: number): FunnelChartLabelContext {
    return {
      stage: r.stage,
      value: r.value,
      fraction: r.fraction,
      conversion: r.conversion,
      index,
      count,
    };
  }

  return (
    <div
      ref={ref}
      role="img"
      aria-labelledby={titleId}
      data-slot="funnel-chart"
      data-orientation={orientation}
      className={cn(funnelChartVariants({ size }), className)}
      style={{ width: W, height: H }}
      {...props}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden={children ? "true" : undefined}
        className="h-full w-full overflow-visible"
      >
        <title id={titleId}>{label}</title>

        {resolved.length === 0 ? (
          <text
            x={W / 2}
            y={H / 2}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground"
          >
            No data
          </text>
        ) : (
          resolved.map((r) => {
            const handler = r.stage.onClick ?? onStageClick;
            const isInteractive: boolean = typeof handler === "function";
            const name: string = r.stage.label ?? r.stage.id;
            return (
              <polygon
                key={r.stage.id}
                points={r.points}
                fill={r.fill}
                data-stage-id={r.stage.id}
                role={isInteractive ? "button" : undefined}
                tabIndex={isInteractive ? 0 : undefined}
                aria-label={`${name}: ${r.value}`}
                onClick={
                  isInteractive
                    ? (event: MouseEvent<SVGPolygonElement>): void => {
                        handler!(r.stage, event);
                      }
                    : undefined
                }
                onKeyDown={
                  isInteractive
                    ? (event: KeyboardEvent<SVGPolygonElement>): void => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          handler!(r.stage, event);
                        }
                      }
                    : undefined
                }
                className={cn(
                  "transition-opacity",
                  r.fillClass,
                  isInteractive &&
                    "cursor-pointer hover:opacity-80 focus:outline-none focus-visible:opacity-80",
                  r.stage.className,
                )}
              />
            );
          })
        )}

        {hasLabelGutter && resolved.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="funnel-chart-stage-labels"
            className="pointer-events-none select-none"
          >
            {resolved.map((r, index) => {
              const context: FunnelChartLabelContext = contextFor(r, index);
              const name: string | null = showStageLabels
                ? stageLabelFormatter
                  ? stageLabelFormatter(context)
                  : (r.stage.label ?? r.stage.id)
                : null;
              const value: string | null = showValueLabels
                ? (valueLabelFormatter ?? defaultValueLabel)(context)
                : null;
              if (!name && !value) return null;
              // Two stacked lines: the name, then the value underneath it.
              const bothLines: boolean = Boolean(name) && Boolean(value);
              const anchor: "end" | "middle" = isHorizontal ? "middle" : "end";
              return (
                <g key={`${r.stage.id}-label`}>
                  {name ? (
                    <text
                      x={r.labelX}
                      y={r.labelY}
                      dy={bothLines && !isHorizontal ? "-0.25em" : 0}
                      textAnchor={anchor}
                      dominantBaseline={isHorizontal ? "auto" : "central"}
                      className={cn(
                        "fill-foreground font-medium",
                        stageLabelClassName,
                      )}
                    >
                      {name}
                    </text>
                  ) : null}
                  {value ? (
                    <text
                      x={r.labelX}
                      y={r.labelY}
                      dy={bothLines ? "1.25em" : isHorizontal ? 0 : "0.35em"}
                      textAnchor={anchor}
                      dominantBaseline={isHorizontal ? "auto" : "central"}
                      className={cn(
                        "fill-muted-foreground tabular-nums",
                        valueLabelClassName,
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

        {showConversion && resolved.length > 0 ? (
          <g
            aria-hidden="true"
            data-slot="funnel-chart-conversion-labels"
            className="pointer-events-none select-none"
          >
            {resolved.map((r, index) => {
              const text: string | null = (
                conversionLabelFormatter ?? defaultConversionLabel
              )(contextFor(r, index));
              if (text === null || text === "") return null;
              return (
                <text
                  key={`${r.stage.id}-conv`}
                  x={r.conversionX}
                  y={r.conversionY}
                  textAnchor={isHorizontal ? "middle" : "start"}
                  dominantBaseline={isHorizontal ? "auto" : "central"}
                  className={cn(
                    "fill-muted-foreground tabular-nums",
                    conversionLabelClassName,
                  )}
                >
                  {text}
                </text>
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
FunnelChart.displayName = "FunnelChart";

export { FunnelChart };
