"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactElement, ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  type CharacterCountMode,
  type CharacterCountSize,
  type CharacterCountState,
  characterCountModeIds,
  characterCountSizeIds,
  characterCountStateIds,
} from "./character-count-variants";

const characterCountVariants = cva(
  "inline-flex items-center gap-1 font-medium tabular-nums transition-colors",
  {
    variants: {
      state: {
        default: "text-muted-foreground",
        warning: "text-warning",
        danger: "text-destructive",
      } satisfies Record<CharacterCountState, string>,
      size: {
        sm: "text-[10px] leading-none",
        default: "text-xs leading-none",
        lg: "text-sm leading-none",
      } satisfies Record<CharacterCountSize, string>,
    },
    defaultVariants: {
      state: "default",
      size: "default",
    },
  },
);

export interface CharacterCountProps
  extends Omit<ComponentProps<"span">, "children">,
    Pick<VariantProps<typeof characterCountVariants>, "size"> {
  /**
   * Current value being measured. When a string is provided the length is
   * derived automatically (either character count or word count, depending on
   * `mode`). When a number is provided it is used as-is.
   */
  value: string | number;
  /**
   * Optional maximum count. When provided, the label displays `used / max`
   * (or `remaining` when `showRemaining` is true) and the auto-computed
   * `state` transitions through `warning` and `danger` as the value grows.
   */
  max?: number;
  /**
   * Whether to count characters or words. Defaults to `characters`.
   */
  mode?: CharacterCountMode;
  /**
   * Ratio of `max` at which the component enters the `warning` state (only
   * used when `max` is set and `state` is not overridden). Defaults to `0.8`.
   */
  warnAtRatio?: number;
  /**
   * Force a specific visual state. When set, the auto-computed state based
   * on `value` / `max` is ignored.
   */
  state?: CharacterCountState;
  /**
   * When true and `max` is provided, the label reads `N left` instead of the
   * `used / max` form.
   */
  showRemaining?: boolean;
  /**
   * Custom formatter for the visible label. Receives the resolved counts and
   * should return the node to render. Overrides `showRemaining`.
   */
  format?: (args: {
    used: number;
    max: number | undefined;
    remaining: number | undefined;
    state: CharacterCountState;
  }) => ReactNode;
}

function countWords(input: string): number {
  const trimmed = input.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/u).length;
}

function resolveUsed(value: string | number, mode: CharacterCountMode): number {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  }
  return mode === "words" ? countWords(value) : Array.from(value).length;
}

function resolveState(
  used: number,
  max: number | undefined,
  warnAtRatio: number,
  override: CharacterCountState | undefined,
): CharacterCountState {
  if (override) return override;
  if (max === undefined || max <= 0) return "default";
  if (used > max) return "danger";
  if (used / max >= warnAtRatio) return "warning";
  return "default";
}

function defaultFormat({
  used,
  max,
  remaining,
  showRemaining,
  mode,
}: {
  used: number;
  max: number | undefined;
  remaining: number | undefined;
  showRemaining: boolean;
  mode: CharacterCountMode;
}): ReactNode {
  const unit = mode === "words" ? "word" : "character";
  if (max === undefined) {
    return (
      <>
        <span>{used.toLocaleString()}</span>
        <span className="sr-only">
          {" "}
          {used === 1 ? unit : `${unit}s`}
        </span>
      </>
    );
  }
  if (showRemaining) {
    const left = remaining ?? 0;
    const overBy = left < 0 ? -left : 0;
    return (
      <>
        <span>
          {overBy > 0 ? `${overBy.toLocaleString()} over` : `${left.toLocaleString()} left`}
        </span>
        <span className="sr-only">
          {" "}
          {mode === "words" ? "words" : "characters"}
        </span>
      </>
    );
  }
  return (
    <>
      <span>{used.toLocaleString()}</span>
      <span aria-hidden="true">/</span>
      <span>{max.toLocaleString()}</span>
      <span className="sr-only">
        {" "}
        {mode === "words" ? "words" : "characters"}
      </span>
    </>
  );
}

function CharacterCount({
  ref,
  className,
  value,
  max,
  mode = "characters",
  warnAtRatio = 0.8,
  state: stateOverride,
  size,
  showRemaining = false,
  format,
  role,
  ...props
}: CharacterCountProps): ReactElement {
  const used = resolveUsed(value, mode);
  const state = resolveState(used, max, warnAtRatio, stateOverride);
  const remaining = max !== undefined ? max - used : undefined;

  const content = format
    ? format({ used, max, remaining, state })
    : defaultFormat({ used, max, remaining, showRemaining, mode });

  return (
    <span
      ref={ref}
      data-slot="character-count"
      data-state={state}
      data-mode={mode}
      role={role ?? "status"}
      aria-live="polite"
      aria-atomic="true"
      className={cn(characterCountVariants({ state, size }), className)}
      {...props}
    >
      {content}
    </span>
  );
}

CharacterCount.displayName = "CharacterCount";

export {
  CharacterCount,
  characterCountVariants,
  characterCountStateIds,
  characterCountSizeIds,
  characterCountModeIds,
};
export type { CharacterCountState, CharacterCountSize, CharacterCountMode };

export default CharacterCount;
