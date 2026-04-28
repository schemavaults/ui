"use client";

import { Minus, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import {
  type NumberInputSize,
  type NumberInputStepperLayout,
  type NumberInputVariant,
} from "./number-input-variants";

const numberInputContainerVariants = cva(
  "relative inline-flex items-stretch w-full rounded-md transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background aria-invalid:ring-destructive/40 aria-invalid:focus-within:ring-destructive overflow-hidden",
  {
    variants: {
      variant: {
        default: "border border-input bg-background",
        outline: "border border-primary/40 bg-background",
        ghost: "border border-transparent bg-muted/40",
      } satisfies Record<NumberInputVariant, string>,
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      } satisfies Record<NumberInputSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const stepperButtonSizeClasses = {
  sm: "h-full w-7",
  md: "h-full w-9",
  lg: "h-full w-11",
} as const satisfies Record<NumberInputSize, string>;

const stackedStepperButtonSizeClasses = {
  sm: "h-1/2 w-7",
  md: "h-1/2 w-9",
  lg: "h-1/2 w-11",
} as const satisfies Record<NumberInputSize, string>;

const stepperIconSizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
} as const satisfies Record<NumberInputSize, string>;

const adornmentPaddingClasses = {
  sm: "px-2 text-muted-foreground",
  md: "px-3 text-muted-foreground",
  lg: "px-3.5 text-muted-foreground",
} as const satisfies Record<NumberInputSize, string>;

const inputPaddingClasses = {
  sm: "px-2 py-1",
  md: "px-3 py-2",
  lg: "px-4 py-2",
} as const satisfies Record<NumberInputSize, string>;

export interface NumberInputProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "value" | "defaultValue" | "onChange" | "size" | "type" | "prefix"
    >,
    VariantProps<typeof numberInputContainerVariants> {
  /** Controlled numeric value. Use `null` to represent an empty input. */
  value?: number | null;
  /** Default uncontrolled value. */
  defaultValue?: number | null;
  /** Minimum allowed value. */
  min?: number;
  /** Maximum allowed value. */
  max?: number;
  /** Increment / decrement step. Defaults to 1. */
  step?: number;
  /** Number of decimal places to display & enforce. */
  precision?: number;
  /** Layout of the stepper buttons. */
  stepperLayout?: NumberInputStepperLayout;
  /** Hide the stepper buttons entirely. */
  hideSteppers?: boolean;
  /** Optional prefix shown inside the input (e.g. "$"). */
  prefix?: ReactNode;
  /** Optional suffix shown inside the input (e.g. "%"). */
  suffix?: ReactNode;
  /** Marks the input as invalid (sets aria-invalid and shows the destructive ring). */
  invalid?: boolean;
  /** Callback invoked with the parsed numeric value (or `null` when empty). */
  onValueChange?: (value: number | null) => void;
  /** Native onChange forwarded for compatibility. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Optional ref to the inner input element. */
  inputRef?: Ref<HTMLInputElement>;
  /** Optional class for the outer container. */
  containerClassName?: string;
}

function clamp(value: number, min: number | undefined, max: number | undefined): number {
  let next = value;
  if (typeof min === "number" && next < min) next = min;
  if (typeof max === "number" && next > max) next = max;
  return next;
}

function formatValue(value: number, precision: number | undefined): string {
  if (typeof precision === "number" && precision >= 0) {
    return value.toFixed(precision);
  }
  return String(value);
}

export function NumberInput({
  value,
  defaultValue,
  min,
  max,
  step = 1,
  precision,
  size,
  variant,
  stepperLayout = "split",
  hideSteppers = false,
  prefix,
  suffix,
  invalid = false,
  disabled = false,
  readOnly = false,
  onValueChange,
  onChange,
  onBlur,
  onKeyDown,
  className,
  containerClassName,
  inputRef,
  id,
  name,
  placeholder,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: NumberInputProps): ReactElement {
  const isControlled = value !== undefined;
  const resolvedSize: NumberInputSize = size ?? "md";

  const [internal, setInternal] = useState<number | null>(
    defaultValue ?? null,
  );
  const [text, setText] = useState<string>(() => {
    const seed = isControlled ? value ?? null : defaultValue ?? null;
    return seed === null || seed === undefined ? "" : formatValue(seed, precision);
  });

  const lastEmittedRef = useRef<number | null | undefined>(undefined);

  const current = isControlled ? value ?? null : internal;

  useEffect(() => {
    if (!isControlled) return;
    const next = value ?? null;
    setText(next === null ? "" : formatValue(next, precision));
  }, [isControlled, value, precision]);

  const emit = useCallback(
    (next: number | null): void => {
      if (lastEmittedRef.current === next) return;
      lastEmittedRef.current = next;
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const applyDelta = useCallback(
    (direction: 1 | -1): void => {
      if (disabled || readOnly) return;
      const base = typeof current === "number" ? current : (min ?? 0);
      const candidate = base + direction * step;
      const clamped = clamp(candidate, min, max);
      const rounded =
        typeof precision === "number"
          ? Number(clamped.toFixed(precision))
          : clamped;
      setText(formatValue(rounded, precision));
      emit(rounded);
    },
    [current, disabled, readOnly, min, max, step, precision, emit],
  );

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const raw = event.target.value;
      setText(raw);
      onChange?.(event);

      if (raw === "" || raw === "-") {
        emit(null);
        return;
      }
      const parsed = Number(raw);
      if (!Number.isFinite(parsed)) return;
      emit(parsed);
    },
    [emit, onChange],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>): void => {
      onBlur?.(event);
      if (text === "" || text === "-") {
        emit(null);
        setText("");
        return;
      }
      const parsed = Number(text);
      if (!Number.isFinite(parsed)) {
        setText(current === null ? "" : formatValue(current, precision));
        return;
      }
      const clamped = clamp(parsed, min, max);
      const rounded =
        typeof precision === "number"
          ? Number(clamped.toFixed(precision))
          : clamped;
      setText(formatValue(rounded, precision));
      emit(rounded);
    },
    [text, onBlur, emit, min, max, precision, current],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>): void => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        applyDelta(1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        applyDelta(-1);
      }
    },
    [applyDelta, onKeyDown],
  );

  const isAtMin = typeof min === "number" && typeof current === "number" && current <= min;
  const isAtMax = typeof max === "number" && typeof current === "number" && current >= max;
  const stepperDisabled = disabled || readOnly;

  const renderStepperButton = (
    direction: 1 | -1,
    layout: NumberInputStepperLayout,
  ): ReactElement => {
    const sizeClass =
      layout === "stacked"
        ? stackedStepperButtonSizeClasses[resolvedSize]
        : stepperButtonSizeClasses[resolvedSize];
    const ariaLabel = direction === 1 ? "Increase value" : "Decrease value";
    const Icon =
      layout === "stacked"
        ? direction === 1
          ? ChevronUp
          : ChevronDown
        : direction === 1
          ? Plus
          : Minus;
    const disabledForDirection =
      stepperDisabled || (direction === 1 ? isAtMax : isAtMin);
    return (
      <button
        type="button"
        tabIndex={-1}
        aria-label={ariaLabel}
        disabled={disabledForDirection}
        onClick={(): void => applyDelta(direction)}
        data-slot="number-input-stepper"
        data-direction={direction === 1 ? "up" : "down"}
        className={cn(
          "inline-flex items-center justify-center select-none shrink-0",
          "text-muted-foreground hover:text-foreground hover:bg-accent",
          "transition-colors",
          "disabled:opacity-40 disabled:pointer-events-none",
          "focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground",
          sizeClass,
        )}
      >
        <Icon
          className={cn(
            layout === "stacked"
              ? "h-3 w-3"
              : stepperIconSizeClasses[resolvedSize],
          )}
          aria-hidden="true"
        />
      </button>
    );
  };

  const stepperDecrement = !hideSteppers ? renderStepperButton(-1, "split") : null;
  const stepperIncrement = !hideSteppers ? renderStepperButton(1, "split") : null;
  const stackedSteppers = !hideSteppers ? (
    <div
      className="flex flex-col items-stretch shrink-0 border-l border-input"
      data-slot="number-input-stepper-group"
    >
      {renderStepperButton(1, "stacked")}
      <div className="border-t border-input" aria-hidden="true" />
      {renderStepperButton(-1, "stacked")}
    </div>
  ) : null;

  return (
    <div
      data-slot="number-input"
      data-disabled={disabled || undefined}
      data-readonly={readOnly || undefined}
      aria-invalid={invalid || undefined}
      className={cn(
        numberInputContainerVariants({ variant, size: resolvedSize }),
        disabled && "opacity-50 cursor-not-allowed",
        containerClassName,
      )}
    >
      {stepperLayout === "split" && stepperDecrement ? (
        <div className="flex items-stretch border-r border-input">
          {stepperDecrement}
        </div>
      ) : null}

      {prefix !== undefined && prefix !== null ? (
        <span
          data-slot="number-input-prefix"
          className={cn(
            "inline-flex items-center justify-center",
            adornmentPaddingClasses[resolvedSize],
          )}
        >
          {prefix}
        </span>
      ) : null}

      <input
        {...rest}
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        inputMode="decimal"
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current ?? undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid || undefined}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        value={text}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex-1 min-w-0 bg-transparent text-center tabular-nums",
          "placeholder:text-muted-foreground",
          "focus:outline-none",
          "disabled:cursor-not-allowed",
          inputPaddingClasses[resolvedSize],
          className,
        )}
      />

      {suffix !== undefined && suffix !== null ? (
        <span
          data-slot="number-input-suffix"
          className={cn(
            "inline-flex items-center justify-center",
            adornmentPaddingClasses[resolvedSize],
          )}
        >
          {suffix}
        </span>
      ) : null}

      {stepperLayout === "split" && stepperIncrement ? (
        <div className="flex items-stretch border-l border-input">
          {stepperIncrement}
        </div>
      ) : null}

      {stepperLayout === "stacked" ? stackedSteppers : null}
    </div>
  );
}
NumberInput.displayName = "NumberInput";

export { numberInputContainerVariants };

export default NumberInput;
