"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";
import {
  dataTypeBadgeAppearanceIds,
  dataTypeBadgeSizeIds,
  dataTypeCategoryIds,
  knownDataTypes,
  type DataTypeBadgeAppearance,
  type DataTypeBadgeSize,
  type DataTypeCategory,
} from "./data-type-badge-variants";

/**
 * Colour palette per data-type category. Each category maps to its own
 * semantic colour across the three appearance modes (solid / soft /
 * outline). Where the semantics line up with shadcn theme tokens
 * (`primary`, `warning`, `muted`) the token is preferred; the remaining
 * categories use Tailwind colour primitives so they still adapt to
 * light/dark mode.
 */
const dataTypeColors: Record<
  DataTypeCategory,
  Record<DataTypeBadgeAppearance, string>
> = {
  numeric: {
    solid:
      "bg-sky-600 text-white border-sky-600 dark:bg-sky-500 dark:border-sky-500",
    soft: "bg-sky-500/15 text-sky-700 border-sky-500/30 dark:text-sky-300 dark:bg-sky-500/20",
    outline:
      "bg-transparent text-sky-700 border-sky-500/50 dark:text-sky-300 dark:border-sky-400/60",
  },
  text: {
    solid:
      "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500",
    soft: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-500/20",
    outline:
      "bg-transparent text-emerald-700 border-emerald-500/50 dark:text-emerald-300 dark:border-emerald-400/60",
  },
  boolean: {
    solid:
      "bg-violet-600 text-white border-violet-600 dark:bg-violet-500 dark:border-violet-500",
    soft: "bg-violet-500/15 text-violet-700 border-violet-500/30 dark:text-violet-300 dark:bg-violet-500/20",
    outline:
      "bg-transparent text-violet-700 border-violet-500/50 dark:text-violet-300 dark:border-violet-400/60",
  },
  datetime: {
    solid: "bg-warning text-warning-foreground border-warning",
    soft: "bg-warning/15 text-warning-foreground border-warning/40 dark:bg-warning/20",
    outline:
      "bg-transparent text-warning-foreground border-warning/50 dark:border-warning/70",
  },
  binary: {
    solid:
      "bg-slate-600 text-white border-slate-600 dark:bg-slate-500 dark:border-slate-500",
    soft: "bg-slate-500/15 text-slate-700 border-slate-500/30 dark:text-slate-300 dark:bg-slate-500/20",
    outline:
      "bg-transparent text-slate-700 border-slate-500/50 dark:text-slate-300 dark:border-slate-400/60",
  },
  json: {
    solid:
      "bg-orange-600 text-white border-orange-600 dark:bg-orange-500 dark:border-orange-500",
    soft: "bg-orange-500/15 text-orange-700 border-orange-500/30 dark:text-orange-300 dark:bg-orange-500/20",
    outline:
      "bg-transparent text-orange-700 border-orange-500/50 dark:text-orange-300 dark:border-orange-400/60",
  },
  uuid: {
    solid:
      "bg-cyan-600 text-white border-cyan-600 dark:bg-cyan-500 dark:border-cyan-500",
    soft: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30 dark:text-cyan-300 dark:bg-cyan-500/20",
    outline:
      "bg-transparent text-cyan-700 border-cyan-500/50 dark:text-cyan-300 dark:border-cyan-400/60",
  },
  array: {
    solid:
      "bg-indigo-600 text-white border-indigo-600 dark:bg-indigo-500 dark:border-indigo-500",
    soft: "bg-indigo-500/15 text-indigo-700 border-indigo-500/30 dark:text-indigo-300 dark:bg-indigo-500/20",
    outline:
      "bg-transparent text-indigo-700 border-indigo-500/50 dark:text-indigo-300 dark:border-indigo-400/60",
  },
  enum: {
    solid:
      "bg-fuchsia-600 text-white border-fuchsia-600 dark:bg-fuchsia-500 dark:border-fuchsia-500",
    soft: "bg-fuchsia-500/15 text-fuchsia-700 border-fuchsia-500/30 dark:text-fuchsia-300 dark:bg-fuchsia-500/20",
    outline:
      "bg-transparent text-fuchsia-700 border-fuchsia-500/50 dark:text-fuchsia-300 dark:border-fuchsia-400/60",
  },
  geo: {
    solid:
      "bg-teal-600 text-white border-teal-600 dark:bg-teal-500 dark:border-teal-500",
    soft: "bg-teal-500/15 text-teal-700 border-teal-500/30 dark:text-teal-300 dark:bg-teal-500/20",
    outline:
      "bg-transparent text-teal-700 border-teal-500/50 dark:text-teal-300 dark:border-teal-400/60",
  },
  xml: {
    solid:
      "bg-rose-600 text-white border-rose-600 dark:bg-rose-500 dark:border-rose-500",
    soft: "bg-rose-500/15 text-rose-700 border-rose-500/30 dark:text-rose-300 dark:bg-rose-500/20",
    outline:
      "bg-transparent text-rose-700 border-rose-500/50 dark:text-rose-300 dark:border-rose-400/60",
  },
  money: {
    solid: "bg-primary text-primary-foreground border-primary",
    soft: "bg-primary/15 text-primary border-primary/30 dark:bg-primary/20",
    outline:
      "bg-transparent text-primary border-primary/50 dark:border-primary/70",
  },
  other: {
    solid: "bg-foreground text-background border-foreground",
    soft: "bg-muted text-muted-foreground border-border",
    outline: "bg-transparent text-muted-foreground border-border",
  },
};

const dataTypeBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border font-mono font-semibold uppercase tracking-wide whitespace-nowrap select-none align-middle transition-colors",
  {
    variants: {
      size: {
        sm: "h-5 px-1.5 text-[10px] leading-none",
        md: "h-6 px-2 text-xs leading-none",
        lg: "h-7 px-2.5 text-sm leading-none",
      } satisfies Record<DataTypeBadgeSize, string>,
      width: {
        auto: "",
        // Fixed width helps badges line up in column lists. The width is
        // tuned to comfortably fit common types (VARCHAR, BOOLEAN,
        // TIMESTAMP); longer labels still expand naturally.
        fixed: "",
      },
    },
    compoundVariants: [
      { size: "sm", width: "fixed", className: "min-w-[5rem]" },
      { size: "md", width: "fixed", className: "min-w-[6rem]" },
      { size: "lg", width: "fixed", className: "min-w-[7rem]" },
    ],
    defaultVariants: {
      size: "md",
      width: "auto",
    },
  },
);

type CvaRootProps = VariantProps<typeof dataTypeBadgeVariants>;

export interface DataTypeBadgeProps
  extends Omit<ComponentProps<"span">, "children">,
    Omit<CvaRootProps, "width"> {
  /**
   * The data type to render — e.g. `"VARCHAR(255)"`, `"int4"`, `"jsonb"`,
   * `"TEXT[]"`. Case-insensitive and rendered upper-case. Parameter
   * suffixes (`(n)`, `(p,s)`) and array suffixes (`[]`) are preserved in
   * the label but stripped before category lookup.
   */
  type: string;
  /**
   * Optional explicit category override. Useful when the automatic
   * resolver picks the wrong category for a custom or dialect-specific
   * type (e.g. an application-level enum string).
   */
  category?: DataTypeCategory;
  /** Colour intensity. `soft` (default) is best for dense lists; `solid` for emphasis. */
  appearance?: DataTypeBadgeAppearance;
  /**
   * When `fixed`, the badge has a minimum width so types stack neatly in
   * column lists. Defaults to `auto`.
   */
  width?: "auto" | "fixed";
  /** Override the label rendered inside the badge. Defaults to the normalised type string. */
  label?: string;
  ref?: Ref<HTMLSpanElement>;
}

interface NormalizedDataType {
  /** Uppercase form with `(…)` and `[]` suffixes removed — used for category lookup. */
  base: string;
  /** Uppercase form preserving parameter and array suffixes — used as the default label. */
  display: string;
  /** True if the type ends with one or more `[]` suffixes. */
  isArray: boolean;
}

function normalizeDataType(input: string): NormalizedDataType {
  const upper = input.trim().toUpperCase().replace(/\s+/g, " ");
  let working = upper;
  let isArray = false;
  // Strip one or more trailing `[]` array markers.
  while (working.endsWith("[]")) {
    working = working.slice(0, -2).trimEnd();
    isArray = true;
  }
  // Strip parameter suffix like `(255)` or `(10,2)`.
  const parenIdx = working.indexOf("(");
  const base = parenIdx >= 0 ? working.slice(0, parenIdx).trimEnd() : working;
  return { base, display: upper, isArray };
}

/**
 * Resolve a free-form data type string to its semantic category. Exposed
 * separately so callers can colour-match adjacent UI to the badge.
 */
export function resolveDataTypeCategory(input: string): DataTypeCategory {
  const { base, isArray } = normalizeDataType(input);
  if (isArray) return "array";
  return knownDataTypes[base] ?? "other";
}

function DataTypeBadge({
  className,
  type,
  category: overrideCategory,
  appearance = "soft",
  size,
  width = "auto",
  label,
  ref,
  ...props
}: DataTypeBadgeProps): ReactElement {
  const normalized = normalizeDataType(type);
  const category =
    overrideCategory ??
    (normalized.isArray
      ? "array"
      : (knownDataTypes[normalized.base] ?? "other"));
  const palette = dataTypeColors[category];
  return (
    <span
      ref={ref}
      data-slot="data-type-badge"
      data-type={normalized.display}
      data-category={category}
      data-appearance={appearance}
      className={cn(
        dataTypeBadgeVariants({ size, width }),
        palette[appearance],
        className,
      )}
      {...props}
    >
      {label ?? normalized.display}
    </span>
  );
}
DataTypeBadge.displayName = "DataTypeBadge";

export {
  DataTypeBadge,
  dataTypeBadgeVariants,
  dataTypeColors,
  dataTypeCategoryIds,
  dataTypeBadgeAppearanceIds,
  dataTypeBadgeSizeIds,
  knownDataTypes,
};
export type { DataTypeCategory, DataTypeBadgeAppearance, DataTypeBadgeSize };

export default DataTypeBadge;
