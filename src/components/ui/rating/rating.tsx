"use client";

import { Star } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  useCallback,
  useMemo,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  ratingColorIds,
  ratingSizeIds,
  type RatingColor,
  type RatingSize,
} from "./rating-variants";

const ratingContainerVariants = cva(
  "inline-flex items-center align-middle text-muted-foreground/40",
  {
    variants: {
      size: {
        sm: "gap-0.5",
        md: "gap-1",
        lg: "gap-1.5",
        xl: "gap-2",
      } satisfies Record<RatingSize, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const starSizeClasses = {
  sm: "size-3.5",
  md: "size-5",
  lg: "size-6",
  xl: "size-8",
} as const satisfies Record<RatingSize, string>;

const filledColorClasses = {
  warning: "text-warning",
  primary: "text-primary",
  destructive: "text-destructive",
  foreground: "text-foreground",
} as const satisfies Record<RatingColor, string>;

export interface RatingProps
  extends VariantProps<typeof ratingContainerVariants> {
  /** Current rating value (0..max). Supports fractional values when `allowHalf` is true. */
  value?: number;
  /** Default uncontrolled value. */
  defaultValue?: number;
  /** Maximum number of stars. Defaults to 5. */
  max?: number;
  /** Color used for filled portions of stars. */
  color?: RatingColor;
  /** When true, allow half-star granularity in interactive mode. */
  allowHalf?: boolean;
  /** Disable interaction; render as a display-only rating. */
  readOnly?: boolean;
  /** Disabled state — non-interactive and visually muted. */
  disabled?: boolean;
  /** Callback fired when the user selects a new value. */
  onValueChange?: (value: number) => void;
  /** Optional accessible label for the rating widget. */
  "aria-label"?: string;
  /** Optional id of an element labelling the rating widget. */
  "aria-labelledby"?: string;
  /** Custom class name forwarded to the root container. */
  className?: string;
  /** Optional ref to the root container. */
  ref?: Ref<HTMLDivElement>;
  /** Optional name to render a hidden form input (helpful for native form submission). */
  name?: string;
}

function clampValue(value: number, max: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > max) return max;
  return value;
}

export function Rating({
  value,
  defaultValue,
  max = 5,
  size,
  color = "warning",
  allowHalf = false,
  readOnly = false,
  disabled = false,
  onValueChange,
  className,
  ref,
  name,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: RatingProps): ReactElement {
  const isControlled = value !== undefined;
  const [internal, setInternal] = useState<number>(
    clampValue(defaultValue ?? 0, max),
  );
  const [hover, setHover] = useState<number | null>(null);

  const current = clampValue(isControlled ? (value as number) : internal, max);
  const display = hover !== null ? hover : current;

  const interactive = !readOnly && !disabled;

  const updateValue = useCallback(
    (next: number): void => {
      const clamped = clampValue(next, max);
      if (!isControlled) setInternal(clamped);
      onValueChange?.(clamped);
    },
    [isControlled, max, onValueChange],
  );

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>, index: number): void => {
      if (!interactive) return;
      let next = index + 1;
      if (allowHalf) {
        const target = event.currentTarget;
        const rect = target.getBoundingClientRect();
        const isLeftHalf = event.clientX - rect.left < rect.width / 2;
        next = index + (isLeftHalf ? 0.5 : 1);
      }
      // Toggle off when clicking the currently selected single-unit value.
      if (!allowHalf && current === next) {
        next = next - 1;
      }
      updateValue(next);
    },
    [interactive, allowHalf, current, updateValue],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>): void => {
      if (!interactive) return;
      const step = allowHalf ? 0.5 : 1;
      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          event.preventDefault();
          updateValue(current + step);
          break;
        case "ArrowLeft":
        case "ArrowDown":
          event.preventDefault();
          updateValue(current - step);
          break;
        case "Home":
          event.preventDefault();
          updateValue(0);
          break;
        case "End":
          event.preventDefault();
          updateValue(max);
          break;
        default:
          break;
      }
    },
    [interactive, allowHalf, current, max, updateValue],
  );

  const stars = useMemo(
    () => Array.from({ length: max }, (_, i) => i),
    [max],
  );

  const starClass = size ? starSizeClasses[size] : starSizeClasses.md;
  const filledClass = filledColorClasses[color];

  return (
    <div
      ref={ref}
      role={interactive ? "slider" : "img"}
      aria-label={ariaLabel ?? `Rating: ${current} out of ${max}`}
      aria-labelledby={ariaLabelledBy}
      aria-valuemin={interactive ? 0 : undefined}
      aria-valuemax={interactive ? max : undefined}
      aria-valuenow={interactive ? current : undefined}
      aria-valuetext={`${current} out of ${max}`}
      aria-readonly={readOnly || undefined}
      aria-disabled={disabled || undefined}
      tabIndex={interactive ? 0 : -1}
      onKeyDown={handleKeyDown}
      data-slot="rating"
      className={cn(
        ratingContainerVariants({ size }),
        interactive
          ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
          : "cursor-default",
        disabled && "opacity-50 pointer-events-none",
        className,
      )}
    >
      {stars.map((index) => {
        const fill = Math.max(0, Math.min(1, display - index));
        const filledPct = `${Math.round(fill * 100)}%`;
        return (
          <button
            key={index}
            type="button"
            tabIndex={-1}
            disabled={!interactive}
            aria-hidden="true"
            data-slot="rating-star"
            data-index={index}
            data-fill={fill}
            onClick={(e) => handleClick(e, index)}
            onMouseMove={(e) => {
              if (!interactive) return;
              if (allowHalf) {
                const rect = e.currentTarget.getBoundingClientRect();
                const isLeftHalf =
                  e.clientX - rect.left < rect.width / 2;
                setHover(index + (isLeftHalf ? 0.5 : 1));
              } else {
                setHover(index + 1);
              }
            }}
            onMouseLeave={() => setHover(null)}
            onFocus={() => undefined}
            className={cn(
              "relative inline-flex items-center justify-center bg-transparent border-0 p-0 m-0",
              "transition-transform duration-150",
              interactive && "hover:scale-110 active:scale-95",
              !interactive && "cursor-default",
            )}
          >
            {/* Empty star outline */}
            <Star className={cn(starClass, "stroke-current fill-none")} aria-hidden="true" />
            {/* Filled overlay clipped to the fill percentage */}
            <span
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute inset-0 inline-flex items-center justify-center overflow-hidden",
                filledClass,
              )}
              style={{ clipPath: `inset(0 ${100 - parseInt(filledPct, 10)}% 0 0)` }}
            >
              <Star
                className={cn(starClass, "fill-current stroke-current")}
                aria-hidden="true"
              />
            </span>
          </button>
        );
      })}
      {name ? (
        <input type="hidden" name={name} value={current} readOnly />
      ) : null}
    </div>
  );
}
Rating.displayName = "Rating";

export { ratingContainerVariants, ratingColorIds, ratingSizeIds };
export type { RatingColor, RatingSize };

export default Rating;
