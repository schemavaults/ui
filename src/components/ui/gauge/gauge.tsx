"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, ReactNode } from "react";

import { m } from "@/framer-motion";
import { cn } from "@/lib/utils";

export const gaugeSizeIds = ["sm", "default", "lg", "xl"] as const;
export type GaugeSizeId = (typeof gaugeSizeIds)[number];

export const gaugeColorIds = [
  "default",
  "positive",
  "warning",
  "destructive",
] as const;
export type GaugeColorId = (typeof gaugeColorIds)[number];

export const gaugeVariants = cva(
  "relative inline-flex shrink-0 flex-col items-center justify-end",
  {
    variants: {
      size: {
        sm: "w-32",
        default: "w-48",
        lg: "w-64",
        xl: "w-80",
      } satisfies Record<GaugeSizeId, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const gaugeIndicatorVariants = cva(
  "transition-colors duration-300",
  {
    variants: {
      color: {
        default: "stroke-schemavaults-brand-blue",
        positive: "stroke-emerald-500 dark:stroke-emerald-400",
        warning: "stroke-warning",
        destructive: "stroke-destructive",
      } satisfies Record<GaugeColorId, string>,
    },
    defaultVariants: {
      color: "default",
    },
  },
);

const gaugeNeedleVariants = cva("transition-colors duration-300", {
  variants: {
    color: {
      default: "fill-foreground stroke-foreground",
      positive: "fill-emerald-500 stroke-emerald-500 dark:fill-emerald-400 dark:stroke-emerald-400",
      warning: "fill-warning stroke-warning",
      destructive: "fill-destructive stroke-destructive",
    } satisfies Record<GaugeColorId, string>,
  },
  defaultVariants: {
    color: "default",
  },
});

export const gaugeValueLabelVariants = cva(
  "font-semibold tabular-nums leading-none text-foreground",
  {
    variants: {
      size: {
        sm: "text-base",
        default: "text-2xl",
        lg: "text-3xl",
        xl: "text-4xl",
      } satisfies Record<GaugeSizeId, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const SIZE_TO_STROKE_WIDTH: Record<GaugeSizeId, number> = {
  sm: 12,
  default: 14,
  lg: 16,
  xl: 18,
};

const VIEWBOX_WIDTH = 200;
const ARC_RADIUS = 80;
const ARC_CENTER_X = 100;
const ARC_CENTER_Y = 100;
const ARC_START_X = ARC_CENTER_X - ARC_RADIUS;
const ARC_END_X = ARC_CENTER_X + ARC_RADIUS;
const ARC_PATH = `M ${ARC_START_X} ${ARC_CENTER_Y} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${ARC_END_X} ${ARC_CENTER_Y}`;

/**
 * A single color zone painted along the gauge arc.
 *
 * Zones are rendered in order, each filling the portion of the arc between
 * `from` and `to` (both expressed in the gauge's value space, not as
 * percentages — they are normalized against the gauge's `min`/`max`).
 */
export interface GaugeZone {
  /** Start of the zone, in the gauge's value space. */
  from: number;
  /** End of the zone, in the gauge's value space. */
  to: number;
  /** One of the standard gauge colors. */
  color: GaugeColorId;
}

const ZONE_STROKE_CLASSES: Record<GaugeColorId, string> = {
  default: "stroke-schemavaults-brand-blue/60",
  positive: "stroke-emerald-500/60 dark:stroke-emerald-400/60",
  warning: "stroke-warning/70",
  destructive: "stroke-destructive/60",
};

function clampValue(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function valueToPercentage(value: number, min: number, max: number): number {
  if (max === min) {
    return 0;
  }
  return ((value - min) / (max - min)) * 100;
}

function valueToNeedleAngle(percentage: number): number {
  // Map 0% → -90deg (pointing left) and 100% → +90deg (pointing right),
  // so the needle rotates through the top of the dial.
  return -90 + (percentage / 100) * 180;
}

export interface GaugeProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "role" | "color">,
    VariantProps<typeof gaugeVariants>,
    VariantProps<typeof gaugeIndicatorVariants> {
  /** Current value (clamped to [min, max]). */
  value: number;
  /** Accessible label describing what the gauge represents. */
  label: string;
  /** Minimum value (defaults to 0). */
  min?: number;
  /** Maximum value (defaults to 100). */
  max?: number;
  /** Override the SVG stroke width. Defaults are size-aware. */
  strokeWidth?: number;
  /** When true (default), shows the numeric value below the arc. */
  showValue?: boolean;
  /** When true, render min/max tick labels below the arc endpoints. */
  showRange?: boolean;
  /**
   * Optional color zones rendered behind the indicator. Use to highlight
   * acceptable / warning / danger ranges (e.g. CPU thresholds).
   */
  zones?: ReadonlyArray<GaugeZone>;
  /**
   * When true and `zones` is provided, the indicator + value label color is
   * automatically chosen from whichever zone contains the current value,
   * overriding the `color` prop.
   */
  autoColorFromZones?: boolean;
  /** When true (default), render a needle indicator on top of the arc. */
  showNeedle?: boolean;
  /** When provided, displayed beneath the value (e.g. "ms", "%", "req/s"). */
  unit?: string;
  /** Custom content rendered beneath the arc, replacing the default value display. */
  children?: ReactNode;
  /** Additional classes for the indicator (animated) arc. */
  indicatorClassName?: string;
  /** Additional classes for the track (background) arc. */
  trackClassName?: string;
  /** Additional classes for the value label. */
  valueLabelClassName?: string;
}

function resolveAutoColor(
  value: number,
  zones: ReadonlyArray<GaugeZone> | undefined,
  fallback: GaugeColorId,
): GaugeColorId {
  if (!zones || zones.length === 0) {
    return fallback;
  }
  for (const zone of zones) {
    const lo: number = Math.min(zone.from, zone.to);
    const hi: number = Math.max(zone.from, zone.to);
    if (value >= lo && value <= hi) {
      return zone.color;
    }
  }
  return fallback;
}

export function Gauge({
  value,
  label,
  min = 0,
  max = 100,
  size,
  color,
  strokeWidth,
  showValue = true,
  showRange = false,
  showNeedle = true,
  zones,
  autoColorFromZones = false,
  unit,
  children,
  className,
  indicatorClassName,
  trackClassName,
  valueLabelClassName,
  ...props
}: GaugeProps): ReactElement {
  const resolvedSize: GaugeSizeId = size ?? "default";
  const resolvedStrokeWidth: number =
    strokeWidth ?? SIZE_TO_STROKE_WIDTH[resolvedSize];
  const clamped: number = clampValue(value, min, max);
  const percentage: number = valueToPercentage(clamped, min, max);
  const fallbackColor: GaugeColorId = color ?? "default";
  const indicatorColor: GaugeColorId = autoColorFromZones
    ? resolveAutoColor(clamped, zones, fallbackColor)
    : fallbackColor;
  const needleAngle: number = valueToNeedleAngle(percentage);

  return (
    <div
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={label}
      className={cn(gaugeVariants({ size }), className)}
      {...props}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${ARC_CENTER_Y + resolvedStrokeWidth + 4}`}
        className="w-full"
        aria-hidden="true"
      >
        <path
          d={ARC_PATH}
          fill="none"
          strokeWidth={resolvedStrokeWidth}
          strokeLinecap="round"
          className={cn("stroke-secondary", trackClassName)}
          pathLength={1}
        />
        {zones?.map((zone, index) => {
          const zoneLo: number = clampValue(
            Math.min(zone.from, zone.to),
            min,
            max,
          );
          const zoneHi: number = clampValue(
            Math.max(zone.from, zone.to),
            min,
            max,
          );
          const startPct: number = valueToPercentage(zoneLo, min, max) / 100;
          const endPct: number = valueToPercentage(zoneHi, min, max) / 100;
          const span: number = Math.max(0, endPct - startPct);
          if (span === 0) {
            return null;
          }
          return (
            <path
              key={`zone-${index.toString()}`}
              d={ARC_PATH}
              fill="none"
              strokeWidth={resolvedStrokeWidth}
              strokeLinecap="butt"
              pathLength={1}
              strokeDasharray={`${span} ${1 - span}`}
              strokeDashoffset={-startPct}
              className={ZONE_STROKE_CLASSES[zone.color]}
            />
          );
        })}
        <m.path
          d={ARC_PATH}
          fill="none"
          strokeWidth={resolvedStrokeWidth}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          initial={{ strokeDashoffset: 1 }}
          animate={{ strokeDashoffset: 1 - percentage / 100 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn(
            gaugeIndicatorVariants({ color: indicatorColor }),
            indicatorClassName,
          )}
        />
        {showNeedle && (
          <m.g
            initial={{ rotate: valueToNeedleAngle(0) }}
            animate={{ rotate: needleAngle }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ transformOrigin: `${ARC_CENTER_X}px ${ARC_CENTER_Y}px` }}
          >
            <line
              x1={ARC_CENTER_X}
              y1={ARC_CENTER_Y}
              x2={ARC_CENTER_X}
              y2={ARC_CENTER_Y - (ARC_RADIUS - resolvedStrokeWidth / 2 - 2)}
              strokeWidth={3}
              strokeLinecap="round"
              className={gaugeNeedleVariants({ color: indicatorColor })}
            />
            <circle
              cx={ARC_CENTER_X}
              cy={ARC_CENTER_Y}
              r={6}
              className={cn(
                gaugeNeedleVariants({ color: indicatorColor }),
                "stroke-background",
              )}
              strokeWidth={2}
            />
          </m.g>
        )}
      </svg>
      {showRange && (
        <div className="flex w-[88%] justify-between text-xs tabular-nums text-muted-foreground -mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      )}
      {(children || showValue) && (
        <div
          className={cn(
            "mt-1 flex flex-col items-center gap-0.5",
            valueLabelClassName,
          )}
        >
          {children ?? (
            <>
              <span className={gaugeValueLabelVariants({ size: resolvedSize })}>
                {Math.round(clamped)}
              </span>
              {unit && (
                <span className="text-xs uppercase tracking-wide text-muted-foreground">
                  {unit}
                </span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

Gauge.displayName = "Gauge";
