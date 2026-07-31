"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type {
  ComponentProps,
  ReactElement,
  ReactNode,
  Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  statusPillAppearanceIds,
  statusPillDefaultLabels,
  statusPillSizeIds,
  statusPillStatusIds,
  type StatusPillAppearance,
  type StatusPillSize,
  type StatusPillStatusId,
} from "./status-pill-variants";

/**
 * Colour palette per status. Each status maps to its own semantic colour
 * across the four appearance modes (soft / solid / outline / plain).
 *
 * Semantic theme tokens (`primary`, `destructive`, `warning`, `muted-foreground`)
 * are preferred where the semantics line up so brand overrides in
 * `@schemavaults/theme` propagate automatically. The remaining statuses use
 * Tailwind colour primitives with explicit dark-mode counterparts so they
 * still adapt correctly to light/dark themes.
 */
const statusPillColors: Record<
  StatusPillStatusId,
  Record<StatusPillAppearance, string>
> = {
  neutral: {
    soft: "bg-muted text-foreground border-transparent",
    solid: "bg-foreground text-background border-foreground",
    outline: "bg-transparent text-foreground border-border",
    plain: "bg-transparent text-foreground border-transparent",
  },
  active: {
    soft: "bg-primary/10 text-primary border-transparent dark:bg-primary/20 dark:text-primary-foreground",
    solid: "bg-primary text-primary-foreground border-primary",
    outline:
      "bg-transparent text-primary border-primary/40 dark:text-primary-foreground dark:border-primary/60",
    plain:
      "bg-transparent text-primary border-transparent dark:text-primary-foreground",
  },
  success: {
    soft: "bg-emerald-500/15 text-emerald-700 border-transparent dark:bg-emerald-500/20 dark:text-emerald-300",
    solid:
      "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500",
    outline:
      "bg-transparent text-emerald-700 border-emerald-500/40 dark:text-emerald-300 dark:border-emerald-400/60",
    plain:
      "bg-transparent text-emerald-700 border-transparent dark:text-emerald-300",
  },
  info: {
    soft: "bg-sky-500/15 text-sky-700 border-transparent dark:bg-sky-500/20 dark:text-sky-300",
    solid:
      "bg-sky-600 text-white border-sky-600 dark:bg-sky-500 dark:border-sky-500",
    outline:
      "bg-transparent text-sky-700 border-sky-500/40 dark:text-sky-300 dark:border-sky-400/60",
    plain:
      "bg-transparent text-sky-700 border-transparent dark:text-sky-300",
  },
  warning: {
    soft: "bg-warning/15 text-warning-foreground border-transparent dark:bg-warning/25",
    solid: "bg-warning text-warning-foreground border-warning",
    outline:
      "bg-transparent text-warning-foreground border-warning/50 dark:border-warning/70",
    plain: "bg-transparent text-warning-foreground border-transparent",
  },
  danger: {
    soft: "bg-destructive/15 text-destructive border-transparent",
    solid: "bg-destructive text-white border-destructive dark:bg-destructive/80",
    outline:
      "bg-transparent text-destructive border-destructive/40 dark:border-destructive/70",
    plain: "bg-transparent text-destructive border-transparent",
  },
  pending: {
    soft: "bg-amber-500/15 text-amber-700 border-transparent dark:bg-amber-500/20 dark:text-amber-300",
    solid:
      "bg-amber-500 text-white border-amber-500 dark:bg-amber-500 dark:text-amber-950",
    outline:
      "bg-transparent text-amber-700 border-amber-500/40 dark:text-amber-300 dark:border-amber-400/60",
    plain:
      "bg-transparent text-amber-700 border-transparent dark:text-amber-300",
  },
  muted: {
    soft: "bg-muted text-muted-foreground border-transparent",
    solid:
      "bg-muted-foreground text-background border-muted-foreground dark:bg-muted-foreground/80",
    outline: "bg-transparent text-muted-foreground border-border",
    plain: "bg-transparent text-muted-foreground border-transparent",
  },
};

/**
 * Dot colour per status. The dot always renders in the "strong" version of
 * the palette so it stays legible across all appearance modes — including on
 * `soft` pills where the surrounding text uses a lower-contrast tint.
 */
const statusPillDotColors: Record<StatusPillStatusId, string> = {
  neutral: "bg-foreground",
  active: "bg-primary",
  success: "bg-emerald-500 dark:bg-emerald-400",
  info: "bg-sky-500 dark:bg-sky-400",
  warning: "bg-warning",
  danger: "bg-destructive",
  pending: "bg-amber-500 dark:bg-amber-400",
  muted: "bg-muted-foreground",
};

/**
 * When the pill uses the `solid` appearance the dot needs a contrasting
 * colour so it remains visible against the filled background.
 */
const statusPillSolidDotColors: Record<StatusPillStatusId, string> = {
  neutral: "bg-background",
  active: "bg-primary-foreground",
  success: "bg-white",
  info: "bg-white",
  warning: "bg-warning-foreground",
  danger: "bg-white",
  pending: "bg-white dark:bg-amber-950",
  muted: "bg-background",
};

const statusPillVariants = cva(
  "group/status-pill inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap select-none align-middle transition-colors",
  {
    variants: {
      size: {
        sm: "h-5 px-1.5 text-[10px] leading-none [&_[data-slot=status-pill-icon]>svg]:size-3",
        md: "h-6 px-2 text-xs leading-none [&_[data-slot=status-pill-icon]>svg]:size-3.5",
        lg: "h-7 px-2.5 text-sm leading-none [&_[data-slot=status-pill-icon]>svg]:size-4",
      } satisfies Record<StatusPillSize, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const dotSizeClasses = {
  sm: "size-1.5",
  md: "size-2",
  lg: "size-2.5",
} satisfies Record<StatusPillSize, string>;

type CvaRootProps = VariantProps<typeof statusPillVariants>;

export interface StatusPillProps
  extends Omit<ComponentProps<"span">, "children" | "aria-label">,
    CvaRootProps {
  /** Semantic status. Drives colour, default dot colour, and default label. */
  status?: StatusPillStatusId;
  /**
   * Visual appearance. `soft` (default) reads well in dense tables; `solid`
   * for emphasis; `outline` for restrained UI chrome; `plain` for a
   * background-less inline treatment.
   */
  appearance?: StatusPillAppearance;
  /**
   * Text label rendered next to the dot. Defaults to a humanised version of
   * the `status` (e.g. `"Active"`, `"Pending"`). Pass `null` to hide the
   * label entirely — useful for compact dot-only variants.
   */
  label?: ReactNode | null;
  /** Alternative to `label` — accepts any React children (icons, spans, …). */
  children?: ReactNode;
  /**
   * When true the dot renders a soft `ping` animation, indicating a live /
   * in-flight state (e.g. "Streaming", "Recording", "Live").
   */
  pulse?: boolean;
  /**
   * Optional element rendered in place of the coloured dot — typically a
   * small icon. Pass `null` to omit the dot entirely (label-only pill).
   */
  icon?: ReactNode | null;
  /**
   * Accessible label describing the status. Defaults to the resolved text
   * label. Set to `null` to mark the pill as purely decorative (e.g. when
   * paired with adjacent text that already conveys the status).
   */
  "aria-label"?: string | null;
  ref?: Ref<HTMLSpanElement>;
}

function StatusPillDot({
  status,
  appearance,
  size,
  pulse,
}: {
  status: StatusPillStatusId;
  appearance: StatusPillAppearance;
  size: StatusPillSize;
  pulse: boolean;
}): ReactElement {
  const dotColor =
    appearance === "solid"
      ? statusPillSolidDotColors[status]
      : statusPillDotColors[status];
  return (
    <span
      aria-hidden="true"
      data-slot="status-pill-dot"
      className="relative inline-flex shrink-0 items-center justify-center"
    >
      {pulse ? (
        <span
          className={cn(
            "absolute inline-flex rounded-full opacity-75 animate-ping",
            dotColor,
            dotSizeClasses[size],
          )}
        />
      ) : null}
      <span
        className={cn(
          "relative inline-flex rounded-full",
          dotColor,
          dotSizeClasses[size],
        )}
      />
    </span>
  );
}

function StatusPill({
  className,
  status = "neutral",
  appearance = "soft",
  size,
  label,
  children,
  pulse = false,
  icon,
  "aria-label": ariaLabelProp,
  ref,
  ...props
}: StatusPillProps): ReactElement {
  const resolvedSize: StatusPillSize = size ?? "md";
  const resolvedLabel =
    children ??
    (label === undefined ? statusPillDefaultLabels[status] : label);
  const decorative = ariaLabelProp === null;
  const ariaLabel = decorative
    ? undefined
    : (ariaLabelProp ??
      (typeof resolvedLabel === "string"
        ? resolvedLabel
        : statusPillDefaultLabels[status]));

  const showIconSlot = icon !== null && icon !== undefined;
  const showDot = icon === undefined; // caller passed nothing → default to dot
  const showExplicitIcon = showIconSlot; // caller passed a ReactNode → render it

  return (
    <span
      ref={ref}
      data-slot="status-pill"
      data-status={status}
      data-appearance={appearance}
      role={decorative ? undefined : "status"}
      aria-label={ariaLabel}
      aria-hidden={decorative ? true : undefined}
      className={cn(
        statusPillVariants({ size: resolvedSize }),
        statusPillColors[status][appearance],
        className,
      )}
      {...props}
    >
      {showDot ? (
        <StatusPillDot
          status={status}
          appearance={appearance}
          size={resolvedSize}
          pulse={pulse}
        />
      ) : null}
      {showExplicitIcon ? (
        <span
          aria-hidden="true"
          data-slot="status-pill-icon"
          className="inline-flex shrink-0 items-center justify-center"
        >
          {icon}
        </span>
      ) : null}
      {resolvedLabel === null ? null : (
        <span data-slot="status-pill-label">{resolvedLabel}</span>
      )}
    </span>
  );
}
StatusPill.displayName = "StatusPill";

export {
  StatusPill,
  statusPillVariants,
  statusPillColors,
  statusPillDotColors,
  statusPillSolidDotColors,
  statusPillStatusIds,
  statusPillAppearanceIds,
  statusPillSizeIds,
  statusPillDefaultLabels,
};
export type { StatusPillStatusId, StatusPillAppearance, StatusPillSize };

export default StatusPill;
