"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";
import {
  httpMethodBadgeAppearanceIds,
  httpMethodBadgeSizeIds,
  httpMethodIds,
  type HttpMethod,
  type HttpMethodBadgeAppearance,
  type HttpMethodBadgeSize,
} from "./http-method-badge-variants";

/**
 * Color palette per HTTP method. Each method maps to its own semantic colour
 * across the three appearance modes (solid / soft / outline). Theme tokens
 * (`primary`, `destructive`, `warning`, `muted`) are preferred where the
 * semantics line up; the remaining methods use Tailwind colour primitives so
 * they still adapt to light/dark mode.
 */
const httpMethodColors: Record<
  HttpMethod,
  Record<HttpMethodBadgeAppearance, string>
> = {
  GET: {
    solid:
      "bg-sky-600 text-white border-sky-600 dark:bg-sky-500 dark:border-sky-500",
    soft: "bg-sky-500/15 text-sky-700 border-sky-500/30 dark:text-sky-300 dark:bg-sky-500/20",
    outline:
      "bg-transparent text-sky-700 border-sky-500/50 dark:text-sky-300 dark:border-sky-400/60",
  },
  POST: {
    solid:
      "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500",
    soft: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:text-emerald-300 dark:bg-emerald-500/20",
    outline:
      "bg-transparent text-emerald-700 border-emerald-500/50 dark:text-emerald-300 dark:border-emerald-400/60",
  },
  PUT: {
    solid: "bg-warning text-warning-foreground border-warning",
    soft: "bg-warning/15 text-warning-foreground border-warning/40 dark:bg-warning/20",
    outline:
      "bg-transparent text-warning-foreground border-warning/50 dark:border-warning/70",
  },
  PATCH: {
    solid:
      "bg-violet-600 text-white border-violet-600 dark:bg-violet-500 dark:border-violet-500",
    soft: "bg-violet-500/15 text-violet-700 border-violet-500/30 dark:text-violet-300 dark:bg-violet-500/20",
    outline:
      "bg-transparent text-violet-700 border-violet-500/50 dark:text-violet-300 dark:border-violet-400/60",
  },
  DELETE: {
    solid: "bg-destructive text-white border-destructive",
    soft: "bg-destructive/15 text-destructive border-destructive/30",
    outline:
      "bg-transparent text-destructive border-destructive/50 dark:border-destructive/70",
  },
  OPTIONS: {
    solid:
      "bg-foreground text-background border-foreground",
    soft: "bg-muted text-muted-foreground border-border",
    outline: "bg-transparent text-muted-foreground border-border",
  },
  HEAD: {
    solid:
      "bg-slate-600 text-white border-slate-600 dark:bg-slate-500 dark:border-slate-500",
    soft: "bg-slate-500/15 text-slate-700 border-slate-500/30 dark:text-slate-300 dark:bg-slate-500/20",
    outline:
      "bg-transparent text-slate-700 border-slate-500/50 dark:text-slate-300 dark:border-slate-400/60",
  },
  TRACE: {
    solid:
      "bg-zinc-600 text-white border-zinc-600 dark:bg-zinc-500 dark:border-zinc-500",
    soft: "bg-zinc-500/15 text-zinc-700 border-zinc-500/30 dark:text-zinc-300 dark:bg-zinc-500/20",
    outline:
      "bg-transparent text-zinc-700 border-zinc-500/50 dark:text-zinc-300 dark:border-zinc-400/60",
  },
  CONNECT: {
    solid:
      "bg-stone-600 text-white border-stone-600 dark:bg-stone-500 dark:border-stone-500",
    soft: "bg-stone-500/15 text-stone-700 border-stone-500/30 dark:text-stone-300 dark:bg-stone-500/20",
    outline:
      "bg-transparent text-stone-700 border-stone-500/50 dark:text-stone-300 dark:border-stone-400/60",
  },
};

const httpMethodBadgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border font-mono font-semibold uppercase tracking-wide whitespace-nowrap select-none align-middle transition-colors",
  {
    variants: {
      size: {
        sm: "h-5 px-1.5 text-[10px] leading-none",
        md: "h-6 px-2 text-xs leading-none",
        lg: "h-7 px-2.5 text-sm leading-none",
      } satisfies Record<HttpMethodBadgeSize, string>,
      width: {
        auto: "",
        // Fixed width keeps badges vertically aligned in endpoint lists. The
        // widest method we render is "OPTIONS" / "CONNECT" (7 chars).
        fixed: "",
      },
    },
    compoundVariants: [
      { size: "sm", width: "fixed", className: "w-[3.75rem]" },
      { size: "md", width: "fixed", className: "w-[4.25rem]" },
      { size: "lg", width: "fixed", className: "w-[5rem]" },
    ],
    defaultVariants: {
      size: "md",
      width: "auto",
    },
  },
);

type CvaRootProps = VariantProps<typeof httpMethodBadgeVariants>;

export interface HttpMethodBadgeProps
  extends Omit<ComponentProps<"span">, "children">,
    Omit<CvaRootProps, "width"> {
  /** HTTP method to render. Case-insensitive — always rendered upper-case. */
  method: HttpMethod | Lowercase<HttpMethod>;
  /** Colour intensity. `soft` (default) is best for dense lists; `solid` for emphasis. */
  appearance?: HttpMethodBadgeAppearance;
  /**
   * When `fixed`, the badge takes a constant width so methods stack neatly
   * in endpoint lists. Defaults to `auto`.
   */
  width?: "auto" | "fixed";
  /** Override the label rendered inside the badge. Defaults to the method name. */
  label?: string;
  ref?: Ref<HTMLSpanElement>;
}

function normalizeMethod(method: HttpMethodBadgeProps["method"]): HttpMethod {
  return method.toUpperCase() as HttpMethod;
}

function HttpMethodBadge({
  className,
  method,
  appearance = "soft",
  size,
  width = "auto",
  label,
  ref,
  ...props
}: HttpMethodBadgeProps): ReactElement {
  const normalized = normalizeMethod(method);
  const palette = httpMethodColors[normalized];
  return (
    <span
      ref={ref}
      data-slot="http-method-badge"
      data-method={normalized}
      data-appearance={appearance}
      className={cn(
        httpMethodBadgeVariants({ size, width }),
        palette[appearance],
        className,
      )}
      {...props}
    >
      {label ?? normalized}
    </span>
  );
}
HttpMethodBadge.displayName = "HttpMethodBadge";

export {
  HttpMethodBadge,
  httpMethodBadgeVariants,
  httpMethodColors,
  httpMethodIds,
  httpMethodBadgeAppearanceIds,
  httpMethodBadgeSizeIds,
};
export type { HttpMethod, HttpMethodBadgeAppearance, HttpMethodBadgeSize };

export default HttpMethodBadge;
