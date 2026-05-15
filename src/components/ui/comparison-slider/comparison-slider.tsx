"use client";

import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const comparisonSliderOrientations = [
  "horizontal",
  "vertical",
] as const satisfies string[];
export type ComparisonSliderOrientation =
  (typeof comparisonSliderOrientations)[number];

export const comparisonSliderHandleVariantIds = [
  "default",
  "minimal",
  "brand",
] as const satisfies string[];
export type ComparisonSliderHandleVariantId =
  (typeof comparisonSliderHandleVariantIds)[number];

const dividerVariants = cva("pointer-events-none absolute z-10", {
  variants: {
    orientation: {
      horizontal: "inset-y-0 w-px -translate-x-1/2",
      vertical: "inset-x-0 h-px -translate-y-1/2",
    },
    handleVariant: {
      default: "bg-foreground/80",
      minimal: "bg-border",
      brand: "bg-[var(--schemavaults-brand-blue)]",
    } satisfies Record<ComparisonSliderHandleVariantId, string>,
  },
  defaultVariants: {
    orientation: "horizontal",
    handleVariant: "default",
  },
});

const handleVariants = cva(
  "absolute z-20 flex items-center justify-center rounded-full border-2 shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      orientation: {
        horizontal: "top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize",
        vertical: "left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-ns-resize",
      },
      handleVariant: {
        default:
          "h-10 w-10 border-foreground/80 bg-background text-foreground hover:bg-accent",
        minimal:
          "h-8 w-8 border-border bg-background text-muted-foreground hover:bg-muted",
        brand:
          "h-10 w-10 border-[var(--schemavaults-brand-blue)] bg-background text-[var(--schemavaults-brand-blue)] hover:bg-[var(--schemavaults-brand-blue)]/10",
      } satisfies Record<ComparisonSliderHandleVariantId, string>,
    },
    defaultVariants: {
      orientation: "horizontal",
      handleVariant: "default",
    },
  },
);

function clampPercentage(value: number): number {
  if (Number.isNaN(value)) return 50;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

function HandleGlyph({
  orientation,
}: {
  orientation: ComparisonSliderOrientation;
}): ReactElement {
  if (orientation === "horizontal") {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="9 6 4 12 9 18" />
        <polyline points="15 6 20 12 15 18" />
      </svg>
    );
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 4 18 9" />
      <polyline points="6 15 12 20 18 15" />
    </svg>
  );
}

export interface ComparisonSliderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof handleVariants> {
  /** Content displayed on the "before" (left/top) side. */
  before: ReactNode;
  /** Content displayed on the "after" (right/bottom) side. */
  after: ReactNode;
  /** Optional accessible label announcing what is being compared (e.g. "Before and after photo"). */
  label?: string;
  /** Optional caption shown over the "before" content. */
  beforeLabel?: ReactNode;
  /** Optional caption shown over the "after" content. */
  afterLabel?: ReactNode;
  /** Controlled position (0-100). When provided, the component is controlled. */
  position?: number;
  /** Initial position (0-100) when uncontrolled. Defaults to 50. */
  defaultPosition?: number;
  /** Fires on every position change (drag / keyboard). */
  onPositionChange?: (position: number) => void;
  /** Step (in percent) applied to keyboard arrow keys. Defaults to 2. */
  keyboardStep?: number;
  /** Orientation of the divider. Horizontal slides left/right, vertical slides up/down. */
  orientation?: ComparisonSliderOrientation;
  /** Visual variant for the divider line and handle. */
  handleVariant?: ComparisonSliderHandleVariantId;
  /** Disable interaction. */
  disabled?: boolean;
  /** className passed to the root container. */
  className?: string;
  /** Imperative handle exposing setPosition / getPosition. Passed directly as a React 19 prop. */
  ref?: Ref<ComparisonSliderRef>;
}

export interface ComparisonSliderRef {
  /** Programmatically set the divider position (0-100). */
  setPosition: (position: number) => void;
  /** Returns the current divider position (0-100). */
  getPosition: () => number;
}

export function ComparisonSlider({
  before,
  after,
  label,
  beforeLabel,
  afterLabel,
  position,
  defaultPosition = 50,
  onPositionChange,
  keyboardStep = 2,
  orientation = "horizontal",
  handleVariant = "default",
  disabled = false,
  className,
  ref,
  ...rest
}: ComparisonSliderProps): ReactElement {
  const isControlled = typeof position === "number";
  const [internalPosition, setInternalPosition] = useState<number>(
    clampPercentage(defaultPosition),
  );
  const currentPosition = clampPercentage(
    isControlled ? (position as number) : internalPosition,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);
  const draggingRef = useRef<boolean>(false);
  const headingId = useId();

  const commitPosition = useCallback(
    (nextValue: number): void => {
      const clamped = clampPercentage(nextValue);
      if (!isControlled) {
        setInternalPosition(clamped);
      }
      onPositionChange?.(clamped);
    },
    [isControlled, onPositionChange],
  );

  useImperativeHandle(
    ref,
    () => ({
      setPosition: (next: number) => commitPosition(next),
      getPosition: () => currentPosition,
    }),
    [commitPosition, currentPosition],
  );

  const updateFromClientCoords = useCallback(
    (clientX: number, clientY: number): void => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      if (orientation === "horizontal") {
        if (rect.width <= 0) return;
        const next = ((clientX - rect.left) / rect.width) * 100;
        commitPosition(next);
      } else {
        if (rect.height <= 0) return;
        const next = ((clientY - rect.top) / rect.height) * 100;
        commitPosition(next);
      }
    },
    [commitPosition, orientation],
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLElement>): void => {
      if (disabled) return;
      event.preventDefault();
      draggingRef.current = true;
      const target = event.currentTarget;
      try {
        target.setPointerCapture(event.pointerId);
      } catch {
        // Some environments (e.g. RTL jsdom) may not support pointer capture; safe to ignore.
      }
      updateFromClientCoords(event.clientX, event.clientY);
      handleRef.current?.focus({ preventScroll: true });
    },
    [disabled, updateFromClientCoords],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLElement>): void => {
      if (!draggingRef.current || disabled) return;
      updateFromClientCoords(event.clientX, event.clientY);
    },
    [disabled, updateFromClientCoords],
  );

  const stopDragging = useCallback(
    (event: ReactPointerEvent<HTMLElement>): void => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        // ignore
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>): void => {
      if (disabled) return;
      const step = keyboardStep;
      const decKeys =
        orientation === "horizontal"
          ? ["ArrowLeft", "ArrowDown"]
          : ["ArrowUp", "ArrowLeft"];
      const incKeys =
        orientation === "horizontal"
          ? ["ArrowRight", "ArrowUp"]
          : ["ArrowDown", "ArrowRight"];
      if (decKeys.includes(event.key)) {
        event.preventDefault();
        commitPosition(currentPosition - step);
      } else if (incKeys.includes(event.key)) {
        event.preventDefault();
        commitPosition(currentPosition + step);
      } else if (event.key === "Home") {
        event.preventDefault();
        commitPosition(0);
      } else if (event.key === "End") {
        event.preventDefault();
        commitPosition(100);
      } else if (event.key === "PageDown") {
        event.preventDefault();
        commitPosition(currentPosition - step * 5);
      } else if (event.key === "PageUp") {
        event.preventDefault();
        commitPosition(currentPosition + step * 5);
      }
    },
    [commitPosition, currentPosition, disabled, keyboardStep, orientation],
  );

  // Ensure dragging is cancelled if the pointer is released outside the slider.
  useEffect(() => {
    function handleWindowUp(): void {
      draggingRef.current = false;
    }
    window.addEventListener("pointerup", handleWindowUp);
    window.addEventListener("pointercancel", handleWindowUp);
    return () => {
      window.removeEventListener("pointerup", handleWindowUp);
      window.removeEventListener("pointercancel", handleWindowUp);
    };
  }, []);

  const clipStyle: CSSProperties =
    orientation === "horizontal"
      ? { clipPath: `inset(0 ${100 - currentPosition}% 0 0)` }
      : { clipPath: `inset(0 0 ${100 - currentPosition}% 0)` };

  const dividerStyle: CSSProperties =
    orientation === "horizontal"
      ? { left: `${currentPosition}%` }
      : { top: `${currentPosition}%` };

  const handleStyle: CSSProperties =
    orientation === "horizontal"
      ? { left: `${currentPosition}%` }
      : { top: `${currentPosition}%` };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-md border border-border bg-background select-none",
        orientation === "horizontal" ? "aspect-video" : "aspect-square",
        disabled && "opacity-60",
        className,
      )}
      role="group"
      aria-labelledby={label ? headingId : undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      {...rest}
    >
      {label ? (
        <span id={headingId} className="sr-only">
          {label}
        </span>
      ) : null}

      {/* "After" layer fills the container as the base. */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        {after}
      </div>

      {/* "Before" layer is clipped to reveal "after" beyond the divider. */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={clipStyle}
        aria-hidden="false"
      >
        {before}
      </div>

      {beforeLabel ? (
        <span
          className={cn(
            "absolute z-10 rounded bg-foreground/70 px-2 py-0.5 text-xs font-medium text-background",
            orientation === "horizontal" ? "left-2 top-2" : "left-2 top-2",
          )}
        >
          {beforeLabel}
        </span>
      ) : null}
      {afterLabel ? (
        <span
          className={cn(
            "absolute z-10 rounded bg-foreground/70 px-2 py-0.5 text-xs font-medium text-background",
            orientation === "horizontal"
              ? "right-2 top-2"
              : "left-2 bottom-2",
          )}
        >
          {afterLabel}
        </span>
      ) : null}

      <div
        className={cn(dividerVariants({ orientation, handleVariant }))}
        style={dividerStyle}
        aria-hidden="true"
      />

      <button
        ref={handleRef}
        type="button"
        className={cn(handleVariants({ orientation, handleVariant }))}
        style={handleStyle}
        role="slider"
        aria-orientation={orientation}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(currentPosition)}
        aria-label={label ?? "Comparison slider position"}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? -1 : 0}
        disabled={disabled}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onKeyDown={handleKeyDown}
      >
        <HandleGlyph orientation={orientation} />
      </button>
    </div>
  );
}

ComparisonSlider.displayName = "ComparisonSlider";

export default ComparisonSlider;
