"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";
import {
  environmentBadgeAppearanceIds,
  environmentBadgeShapeIds,
  environmentBadgeSizeIds,
  environmentIds,
  getDefaultEnvironmentLabel,
  type Environment,
  type EnvironmentBadgeAppearance,
  type EnvironmentBadgeShape,
  type EnvironmentBadgeSize,
} from "./environment-badge-variants";

/**
 * Colour palette per deployment environment. Each environment maps to its own
 * semantic colour across the three appearance modes (solid / soft / outline).
 * Theme tokens (`destructive`, `warning`, `primary`, `muted`) are preferred
 * where the semantics line up (production = danger, staging = caution). The
 * remaining environments use Tailwind colour primitives with dark-mode
 * counterparts.
 */
const environmentColors: Record<
  Environment,
  Record<EnvironmentBadgeAppearance, string>
> = {
  production: {
    solid: "bg-destructive text-white border-destructive",
    soft: "bg-destructive/15 text-destructive border-destructive/30",
    outline:
      "bg-transparent text-destructive border-destructive/50 dark:border-destructive/70",
  },
  staging: {
    solid: "bg-warning text-warning-foreground border-warning",
    soft: "bg-warning/15 text-warning-foreground border-warning/40 dark:bg-warning/20",
    outline:
      "bg-transparent text-warning-foreground border-warning/50 dark:border-warning/70",
  },
  preview: {
    solid:
      "bg-violet-600 text-white border-violet-600 dark:bg-violet-500 dark:border-violet-500",
    soft: "bg-violet-500/15 text-violet-700 border-violet-500/30 dark:text-violet-300 dark:bg-violet-500/20",
    outline:
      "bg-transparent text-violet-700 border-violet-500/50 dark:text-violet-300 dark:border-violet-400/60",
  },
  development: {
    solid:
      "bg-sky-600 text-white border-sky-600 dark:bg-sky-500 dark:border-sky-500",
    soft: "bg-sky-500/15 text-sky-700 border-sky-500/30 dark:text-sky-300 dark:bg-sky-500/20",
    outline:
      "bg-transparent text-sky-700 border-sky-500/50 dark:text-sky-300 dark:border-sky-400/60",
  },
  test: {
    solid:
      "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500",
    soft: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-500/20",
    outline:
      "bg-transparent text-emerald-700 border-emerald-500/50 dark:text-emerald-300 dark:border-emerald-400/60",
  },
  local: {
    solid:
      "bg-slate-600 text-white border-slate-600 dark:bg-slate-500 dark:border-slate-500",
    soft: "bg-slate-500/15 text-slate-700 border-slate-500/30 dark:text-slate-300 dark:bg-slate-500/20",
    outline:
      "bg-transparent text-slate-700 border-slate-500/50 dark:text-slate-300 dark:border-slate-400/60",
  },
  sandbox: {
    solid:
      "bg-amber-600 text-white border-amber-600 dark:bg-amber-500 dark:border-amber-500",
    soft: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300 dark:bg-amber-500/20",
    outline:
      "bg-transparent text-amber-700 border-amber-500/50 dark:text-amber-300 dark:border-amber-400/60",
  },
};

/**
 * The current-colour class for the leading status dot. Uses `currentColor` so
 * the dot inherits from the badge text colour in `soft`/`outline`, and from a
 * white/foreground override in `solid` mode.
 */
const environmentDotColors: Record<
  Environment,
  Record<EnvironmentBadgeAppearance, string>
> = {
  production: {
    solid: "bg-white/90",
    soft: "bg-destructive",
    outline: "bg-destructive",
  },
  staging: {
    solid: "bg-warning-foreground/80",
    soft: "bg-warning",
    outline: "bg-warning",
  },
  preview: {
    solid: "bg-white/90",
    soft: "bg-violet-500 dark:bg-violet-400",
    outline: "bg-violet-500 dark:bg-violet-400",
  },
  development: {
    solid: "bg-white/90",
    soft: "bg-sky-500 dark:bg-sky-400",
    outline: "bg-sky-500 dark:bg-sky-400",
  },
  test: {
    solid: "bg-white/90",
    soft: "bg-emerald-500 dark:bg-emerald-400",
    outline: "bg-emerald-500 dark:bg-emerald-400",
  },
  local: {
    solid: "bg-white/90",
    soft: "bg-slate-500 dark:bg-slate-400",
    outline: "bg-slate-500 dark:bg-slate-400",
  },
  sandbox: {
    solid: "bg-white/90",
    soft: "bg-amber-500 dark:bg-amber-400",
    outline: "bg-amber-500 dark:bg-amber-400",
  },
};

const environmentBadgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 border font-medium uppercase tracking-wide whitespace-nowrap select-none align-middle transition-colors",
  {
    variants: {
      size: {
        sm: "h-5 px-1.5 text-[10px] leading-none",
        md: "h-6 px-2 text-xs leading-none",
        lg: "h-7 px-2.5 text-sm leading-none",
      } satisfies Record<EnvironmentBadgeSize, string>,
      shape: {
        rounded: "rounded-md",
        pill: "rounded-full",
      } satisfies Record<EnvironmentBadgeShape, string>,
    },
    defaultVariants: {
      size: "md",
      shape: "rounded",
    },
  },
);

const environmentDotVariants = cva(
  "inline-block rounded-full shrink-0",
  {
    variants: {
      size: {
        sm: "size-1.5",
        md: "size-2",
        lg: "size-2.5",
      } satisfies Record<EnvironmentBadgeSize, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

type CvaRootProps = VariantProps<typeof environmentBadgeVariants>;

export interface EnvironmentBadgeProps
  extends Omit<ComponentProps<"span">, "children">,
    CvaRootProps {
  /**
   * Deployment environment to render. Case-insensitive — the label is
   * capitalised for you (e.g. "production" -> "Production"). Common short
   * aliases like "prod", "dev", and "stage" are normalised to their full form.
   */
  environment: Environment | (string & {});
  /**
   * Colour intensity. `soft` (default) is best for dense dashboards and lists,
   * `solid` for high-signal callouts, and `outline` for muted contexts.
   */
  appearance?: EnvironmentBadgeAppearance;
  /**
   * Show a small coloured status dot on the leading edge of the badge. Useful
   * when the badge appears alongside other environment metadata.
   */
  dot?: boolean;
  /**
   * When true, the leading dot pulses. Use sparingly to draw attention to a
   * production or destructive-action context.
   */
  pulse?: boolean;
  /**
   * Override the label rendered inside the badge. Defaults to the environment
   * name (e.g. "Production").
   */
  label?: string;
  ref?: Ref<HTMLSpanElement>;
}

const environmentAliases: Record<string, Environment> = {
  prod: "production",
  production: "production",
  stage: "staging",
  staging: "staging",
  qa: "staging",
  preview: "preview",
  pr: "preview",
  dev: "development",
  develop: "development",
  development: "development",
  test: "test",
  testing: "test",
  local: "local",
  localhost: "local",
  sandbox: "sandbox",
  sbx: "sandbox",
};

function normalizeEnvironment(
  environment: EnvironmentBadgeProps["environment"],
): Environment {
  const key = environment.trim().toLowerCase();
  return environmentAliases[key] ?? "development";
}

function EnvironmentBadge({
  className,
  environment,
  appearance = "soft",
  size,
  shape,
  dot = false,
  pulse = false,
  label,
  ref,
  ...props
}: EnvironmentBadgeProps): ReactElement {
  const normalized = normalizeEnvironment(environment);
  const palette = environmentColors[normalized];
  const dotColor = environmentDotColors[normalized][appearance];
  const resolvedLabel = label ?? getDefaultEnvironmentLabel(normalized);
  return (
    <span
      ref={ref}
      data-slot="environment-badge"
      data-environment={normalized}
      data-appearance={appearance}
      className={cn(
        environmentBadgeVariants({ size, shape }),
        palette[appearance],
        className,
      )}
      {...props}
    >
      {dot ? (
        <span
          aria-hidden="true"
          data-slot="environment-badge-dot"
          className={cn(
            "relative",
            environmentDotVariants({ size }),
            dotColor,
          )}
        >
          {pulse ? (
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-0 rounded-full animate-ping opacity-75",
                dotColor,
              )}
            />
          ) : null}
        </span>
      ) : null}
      <span data-slot="environment-badge-label">{resolvedLabel}</span>
    </span>
  );
}
EnvironmentBadge.displayName = "EnvironmentBadge";

export {
  EnvironmentBadge,
  environmentBadgeVariants,
  environmentColors,
  environmentIds,
  environmentBadgeAppearanceIds,
  environmentBadgeSizeIds,
  environmentBadgeShapeIds,
};
export type {
  Environment,
  EnvironmentBadgeAppearance,
  EnvironmentBadgeSize,
  EnvironmentBadgeShape,
};

export default EnvironmentBadge;
