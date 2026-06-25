"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  Binary,
  Braces,
  Brackets,
  CalendarClock,
  CalendarDays,
  CircleQuestionMark,
  CircleSlash,
  FileCode,
  FingerprintPattern,
  Hash,
  List,
  Sigma,
  ToggleLeft,
  Type as TypeIcon,
  type LucideIcon,
} from "lucide-react";
import type { ComponentProps, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";
import {
  fieldTypeBadgeAppearanceIds,
  fieldTypeBadgeSizeIds,
  fieldTypeIds,
  type FieldType,
  type FieldTypeBadgeAppearance,
  type FieldTypeBadgeSize,
} from "./field-type-badge-variants";

/**
 * Per-type colour palette. Theme tokens (`primary`, `destructive`, `warning`,
 * `muted`) are used when their semantics align; the remaining types use
 * Tailwind colour primitives so they still adapt to light/dark mode and stay
 * visually distinct in dense schema viewers.
 */
const fieldTypeColors: Record<
  FieldType,
  Record<FieldTypeBadgeAppearance, string>
> = {
  string: {
    solid:
      "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500",
    soft: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-500/20",
    outline:
      "bg-transparent text-emerald-700 border-emerald-500/50 dark:text-emerald-300 dark:border-emerald-400/60",
  },
  integer: {
    solid:
      "bg-sky-600 text-white border-sky-600 dark:bg-sky-500 dark:border-sky-500",
    soft: "bg-sky-500/15 text-sky-700 border-sky-500/30 dark:text-sky-300 dark:bg-sky-500/20",
    outline:
      "bg-transparent text-sky-700 border-sky-500/50 dark:text-sky-300 dark:border-sky-400/60",
  },
  number: {
    solid:
      "bg-cyan-600 text-white border-cyan-600 dark:bg-cyan-500 dark:border-cyan-500",
    soft: "bg-cyan-500/15 text-cyan-700 border-cyan-500/30 dark:text-cyan-300 dark:bg-cyan-500/20",
    outline:
      "bg-transparent text-cyan-700 border-cyan-500/50 dark:text-cyan-300 dark:border-cyan-400/60",
  },
  boolean: {
    solid:
      "bg-violet-600 text-white border-violet-600 dark:bg-violet-500 dark:border-violet-500",
    soft: "bg-violet-500/15 text-violet-700 border-violet-500/30 dark:text-violet-300 dark:bg-violet-500/20",
    outline:
      "bg-transparent text-violet-700 border-violet-500/50 dark:text-violet-300 dark:border-violet-400/60",
  },
  object: {
    solid:
      "bg-amber-600 text-white border-amber-600 dark:bg-amber-500 dark:border-amber-500",
    soft: "bg-amber-500/15 text-amber-700 border-amber-500/30 dark:text-amber-300 dark:bg-amber-500/20",
    outline:
      "bg-transparent text-amber-700 border-amber-500/50 dark:text-amber-300 dark:border-amber-400/60",
  },
  array: {
    solid:
      "bg-orange-600 text-white border-orange-600 dark:bg-orange-500 dark:border-orange-500",
    soft: "bg-orange-500/15 text-orange-700 border-orange-500/30 dark:text-orange-300 dark:bg-orange-500/20",
    outline:
      "bg-transparent text-orange-700 border-orange-500/50 dark:text-orange-300 dark:border-orange-400/60",
  },
  null: {
    solid: "bg-foreground text-background border-foreground",
    soft: "bg-muted text-muted-foreground border-border",
    outline: "bg-transparent text-muted-foreground border-border",
  },
  date: {
    solid:
      "bg-pink-600 text-white border-pink-600 dark:bg-pink-500 dark:border-pink-500",
    soft: "bg-pink-500/15 text-pink-700 border-pink-500/30 dark:text-pink-300 dark:bg-pink-500/20",
    outline:
      "bg-transparent text-pink-700 border-pink-500/50 dark:text-pink-300 dark:border-pink-400/60",
  },
  datetime: {
    solid:
      "bg-rose-600 text-white border-rose-600 dark:bg-rose-500 dark:border-rose-500",
    soft: "bg-rose-500/15 text-rose-700 border-rose-500/30 dark:text-rose-300 dark:bg-rose-500/20",
    outline:
      "bg-transparent text-rose-700 border-rose-500/50 dark:text-rose-300 dark:border-rose-400/60",
  },
  uuid: {
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
  binary: {
    solid:
      "bg-zinc-700 text-white border-zinc-700 dark:bg-zinc-500 dark:border-zinc-500",
    soft: "bg-zinc-500/15 text-zinc-700 border-zinc-500/30 dark:text-zinc-300 dark:bg-zinc-500/20",
    outline:
      "bg-transparent text-zinc-700 border-zinc-500/50 dark:text-zinc-300 dark:border-zinc-400/60",
  },
  json: {
    solid:
      "bg-yellow-600 text-white border-yellow-600 dark:bg-yellow-500 dark:border-yellow-500",
    soft: "bg-yellow-500/15 text-yellow-800 border-yellow-500/30 dark:text-yellow-300 dark:bg-yellow-500/20",
    outline:
      "bg-transparent text-yellow-800 border-yellow-500/50 dark:text-yellow-300 dark:border-yellow-400/60",
  },
  any: {
    solid:
      "bg-slate-600 text-white border-slate-600 dark:bg-slate-500 dark:border-slate-500",
    soft: "bg-slate-500/15 text-slate-700 border-slate-500/30 dark:text-slate-300 dark:bg-slate-500/20",
    outline:
      "bg-transparent text-slate-700 border-slate-500/50 dark:text-slate-300 dark:border-slate-400/60",
  },
};

const fieldTypeIcons: Record<FieldType, LucideIcon> = {
  string: TypeIcon,
  integer: Hash,
  number: Sigma,
  boolean: ToggleLeft,
  object: Braces,
  array: Brackets,
  null: CircleSlash,
  date: CalendarDays,
  datetime: CalendarClock,
  uuid: FingerprintPattern,
  enum: List,
  binary: Binary,
  json: FileCode,
  any: CircleQuestionMark,
};

/** Aliases users frequently pass — normalised to a canonical {@link FieldType}. */
const fieldTypeAliases: Record<string, FieldType> = {
  str: "string",
  text: "string",
  varchar: "string",
  char: "string",
  int: "integer",
  int32: "integer",
  int64: "integer",
  long: "integer",
  bigint: "integer",
  float: "number",
  double: "number",
  decimal: "number",
  numeric: "number",
  bool: "boolean",
  map: "object",
  record: "object",
  dict: "object",
  list: "array",
  tuple: "array",
  set: "array",
  none: "null",
  void: "null",
  timestamp: "datetime",
  "date-time": "datetime",
  time: "datetime",
  guid: "uuid",
  bytes: "binary",
  blob: "binary",
  buffer: "binary",
  unknown: "any",
  mixed: "any",
};

const fieldTypeBadgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-md border font-mono font-semibold tracking-wide whitespace-nowrap select-none align-middle transition-colors",
  {
    variants: {
      size: {
        sm: "h-5 px-1.5 text-[10px] leading-none",
        md: "h-6 px-2 text-xs leading-none",
        lg: "h-7 px-2.5 text-sm leading-none",
      } satisfies Record<FieldTypeBadgeSize, string>,
      width: {
        auto: "",
        // Fixed width keeps badges vertically aligned in column lists. The
        // widest canonical type we render is "datetime" / "boolean" (8 chars)
        // — with an icon, that needs a bit more room than the http-method
        // badge.
        fixed: "",
      },
    },
    compoundVariants: [
      { size: "sm", width: "fixed", className: "w-[5rem]" },
      { size: "md", width: "fixed", className: "w-[5.5rem]" },
      { size: "lg", width: "fixed", className: "w-[6.25rem]" },
    ],
    defaultVariants: {
      size: "md",
      width: "auto",
    },
  },
);

const iconSizeByBadgeSize: Record<FieldTypeBadgeSize, number> = {
  sm: 10,
  md: 12,
  lg: 14,
};

type CvaRootProps = VariantProps<typeof fieldTypeBadgeVariants>;

export interface FieldTypeBadgeProps
  extends Omit<ComponentProps<"span">, "children">,
    Omit<CvaRootProps, "width"> {
  /**
   * Field/data type to render. Case-insensitive. Common aliases are accepted
   * (e.g. `int` → `integer`, `bool` → `boolean`, `timestamp` → `datetime`).
   * Unknown types fall through to the `any` palette.
   */
  type: FieldType | (string & {});
  /** Colour intensity. `soft` (default) is best for dense lists; `solid` for emphasis. */
  appearance?: FieldTypeBadgeAppearance;
  /**
   * When `fixed`, the badge takes a constant width so types stack neatly in
   * schema/column lists. Defaults to `auto`.
   */
  width?: "auto" | "fixed";
  /** Override the label rendered inside the badge. Defaults to the canonical type name. */
  label?: string;
  /** Hide the leading icon. Defaults to `false`. */
  hideIcon?: boolean;
  /** Mark the field as nullable — appends a trailing `?` to the label. */
  nullable?: boolean;
  ref?: Ref<HTMLSpanElement>;
}

function normalizeType(input: string): FieldType {
  const lower = input.toLowerCase();
  if ((fieldTypeIds as readonly string[]).includes(lower)) {
    return lower as FieldType;
  }
  return fieldTypeAliases[lower] ?? "any";
}

function FieldTypeBadge({
  className,
  type,
  appearance = "soft",
  size,
  width = "auto",
  label,
  hideIcon = false,
  nullable = false,
  ref,
  ...props
}: FieldTypeBadgeProps): ReactElement {
  const normalized = normalizeType(type);
  const palette = fieldTypeColors[normalized];
  const Icon = fieldTypeIcons[normalized];
  const resolvedSize: FieldTypeBadgeSize = size ?? "md";
  const iconPx = iconSizeByBadgeSize[resolvedSize];
  const displayLabel = `${label ?? normalized}${nullable ? "?" : ""}`;
  return (
    <span
      ref={ref}
      data-slot="field-type-badge"
      data-type={normalized}
      data-appearance={appearance}
      data-nullable={nullable ? "true" : undefined}
      className={cn(
        fieldTypeBadgeVariants({ size, width }),
        palette[appearance],
        className,
      )}
      {...props}
    >
      {!hideIcon && (
        <Icon
          aria-hidden="true"
          width={iconPx}
          height={iconPx}
          strokeWidth={2.25}
          className="shrink-0"
        />
      )}
      {displayLabel}
    </span>
  );
}
FieldTypeBadge.displayName = "FieldTypeBadge";

export {
  FieldTypeBadge,
  fieldTypeBadgeVariants,
  fieldTypeColors,
  fieldTypeIcons,
  fieldTypeIds,
  fieldTypeBadgeAppearanceIds,
  fieldTypeBadgeSizeIds,
};
export type { FieldType, FieldTypeBadgeAppearance, FieldTypeBadgeSize };

export default FieldTypeBadge;
