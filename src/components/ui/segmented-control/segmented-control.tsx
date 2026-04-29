"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LazyMotion, domAnimation, m } from "framer-motion";

import { cn } from "@/lib/utils";

export const segmentedControlVariantIds = [
  "default",
  "outline",
  "ghost",
] as const satisfies readonly string[];
export type SegmentedControlVariantId =
  (typeof segmentedControlVariantIds)[number];

export const segmentedControlSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type SegmentedControlSizeId = (typeof segmentedControlSizeIds)[number];

export const segmentedControlVariants = cva(
  "relative inline-flex items-center justify-center gap-1 rounded-lg p-1 text-muted-foreground select-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        outline: "border border-input bg-background",
        ghost: "bg-transparent",
      } satisfies Record<SegmentedControlVariantId, string>,
      size: {
        sm: "h-8 text-xs",
        default: "h-9 text-sm",
        lg: "h-11 text-base",
      } satisfies Record<SegmentedControlSizeId, string>,
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      fullWidth: false,
    },
  },
);

export const segmentedControlItemVariants = cva(
  "relative z-10 inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground data-[state=inactive]:hover:text-foreground/80 cursor-pointer",
  {
    variants: {
      size: {
        sm: "h-6 px-2.5 text-xs",
        default: "h-7 px-3 text-sm",
        lg: "h-9 px-4 text-base",
      } satisfies Record<SegmentedControlSizeId, string>,
      fullWidth: {
        true: "flex-1",
        false: "",
      },
    },
    defaultVariants: {
      size: "default",
      fullWidth: false,
    },
  },
);

const segmentedControlIndicatorVariants = cva(
  "absolute inset-0 z-0 rounded-md",
  {
    variants: {
      variant: {
        default: "bg-background shadow-sm",
        outline: "bg-accent",
        ghost: "bg-muted",
      } satisfies Record<SegmentedControlVariantId, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface SegmentedControlContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  layoutId: string;
  size: SegmentedControlSizeId;
  variant: SegmentedControlVariantId;
  fullWidth: boolean;
  disabled: boolean;
}

const SegmentedControlContext =
  createContext<SegmentedControlContextValue | null>(null);

function useSegmentedControlContext(): SegmentedControlContextValue {
  const ctx = useContext(SegmentedControlContext);
  if (!ctx) {
    throw new Error(
      "SegmentedControlItem must be rendered inside a <SegmentedControl />",
    );
  }
  return ctx;
}

export interface SegmentedControlProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue">,
    VariantProps<typeof segmentedControlVariants> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
}

export function SegmentedControl({
  className,
  value: controlledValue,
  defaultValue,
  onValueChange,
  variant,
  size,
  fullWidth,
  disabled = false,
  children,
  ...props
}: SegmentedControlProps): ReactElement {
  const reactId = useId();
  const [uncontrolledValue, setUncontrolledValue] = useState<string | undefined>(
    defaultValue,
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = useCallback(
    (next: string): void => {
      if (!isControlled) {
        setUncontrolledValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const resolvedVariant: SegmentedControlVariantId = variant ?? "default";
  const resolvedSize: SegmentedControlSizeId = size ?? "default";
  const resolvedFullWidth: boolean = fullWidth ?? false;

  const ctx = useMemo<SegmentedControlContextValue>(
    () => ({
      value,
      setValue,
      layoutId: `segmented-control-indicator-${reactId}`,
      size: resolvedSize,
      variant: resolvedVariant,
      fullWidth: resolvedFullWidth,
      disabled,
    }),
    [value, setValue, reactId, resolvedSize, resolvedVariant, resolvedFullWidth, disabled],
  );

  return (
    <SegmentedControlContext.Provider value={ctx}>
      <LazyMotion features={domAnimation} strict>
        <div
          role="radiogroup"
          aria-disabled={disabled || undefined}
          className={cn(
            segmentedControlVariants({
              variant: resolvedVariant,
              size: resolvedSize,
              fullWidth: resolvedFullWidth,
            }),
            className,
          )}
          {...props}
        >
          {children}
        </div>
      </LazyMotion>
    </SegmentedControlContext.Provider>
  );
}
SegmentedControl.displayName = "SegmentedControl";

export interface SegmentedControlItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
  children: ReactNode;
}

export function SegmentedControlItem({
  value,
  className,
  children,
  disabled: itemDisabled,
  onClick,
  ...props
}: SegmentedControlItemProps): ReactElement {
  const { value: activeValue, setValue, layoutId, size, variant, fullWidth, disabled: groupDisabled } =
    useSegmentedControlContext();
  const isActive = activeValue === value;
  const isDisabled = groupDisabled || itemDisabled;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isActive}
      data-state={isActive ? "active" : "inactive"}
      disabled={isDisabled}
      onClick={(event): void => {
        onClick?.(event);
        if (!event.defaultPrevented && !isDisabled) {
          setValue(value);
        }
      }}
      className={cn(
        segmentedControlItemVariants({ size, fullWidth }),
        className,
      )}
      {...props}
    >
      {isActive ? (
        <m.span
          layoutId={layoutId}
          aria-hidden="true"
          className={cn(segmentedControlIndicatorVariants({ variant }))}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
        />
      ) : null}
      <span className="relative z-10 inline-flex items-center justify-center gap-1.5">
        {children}
      </span>
    </button>
  );
}
SegmentedControlItem.displayName = "SegmentedControlItem";
