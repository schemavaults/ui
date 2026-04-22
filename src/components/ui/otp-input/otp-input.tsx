"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ClipboardEvent as ReactClipboardEvent,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactElement,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const otpSlotVariants = cva(
  "relative flex items-center justify-center text-center font-medium tabular-nums bg-background text-foreground ring-offset-background transition-[color,box-shadow,border-color,background-color] outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-input",
        outline: "border-2 border-input",
        underline:
          "border-0 border-b-2 border-input rounded-none bg-transparent",
        filled:
          "border border-transparent bg-muted text-foreground focus-visible:bg-background focus-visible:border-input",
      },
      size: {
        sm: "h-9 w-8 text-sm",
        md: "h-11 w-10 text-base",
        lg: "h-14 w-12 text-xl",
      },
      invalid: {
        true: "border-destructive text-destructive focus-visible:ring-destructive",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        invalid: false,
        class: "focus-visible:border-ring",
      },
      {
        variant: "outline",
        invalid: false,
        class: "focus-visible:border-ring",
      },
      {
        variant: "filled",
        invalid: false,
        class: "focus-visible:border-ring",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      invalid: false,
    },
  },
);

type OTPInputMode = "numeric" | "alphanumeric";

export interface OTPInputHandle {
  focus: () => void;
  clear: () => void;
}

export interface OTPInputProps extends VariantProps<typeof otpSlotVariants> {
  /** Number of slots rendered. Defaults to 6. */
  length?: number;
  /** Controlled value. Extra characters beyond `length` are ignored. */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Called with the current concatenated string on every keystroke. */
  onChange?: (value: string) => void;
  /** Called once the user fills every slot. */
  onComplete?: (value: string) => void;
  /** Restrict input to digits ("numeric") or letters+digits ("alphanumeric"). */
  mode?: OTPInputMode;
  /** Mask characters as dots (useful for sensitive one-time passwords). */
  mask?: boolean;
  /** Render a visual separator between groups of this many slots. */
  groupSize?: number;
  /** Focus the first slot on mount. */
  focusOnMount?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  /** Optional name used when emitting a hidden input for form submissions. */
  name?: string;
  /** Placeholder character shown in empty slots. */
  placeholder?: string;
  /** Accessible label for the group of inputs. */
  "aria-label"?: string;
  className?: string;
  slotClassName?: string;
  separatorClassName?: string;
}

const sanitize = (raw: string, mode: OTPInputMode): string => {
  const pattern = mode === "numeric" ? /[^0-9]/g : /[^a-zA-Z0-9]/g;
  return raw.replace(pattern, "");
};

const OTPInput = forwardRef<OTPInputHandle, OTPInputProps>(
  (
    {
      length = 6,
      value: controlledValue,
      defaultValue = "",
      onChange,
      onComplete,
      mode = "numeric",
      mask = false,
      groupSize,
      focusOnMount = false,
      disabled = false,
      invalid = false,
      name,
      placeholder = "",
      variant,
      size,
      className,
      slotClassName,
      separatorClassName,
      "aria-label": ariaLabel = "One-time passcode",
    },
    ref,
  ): ReactElement => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState<string>(() =>
      sanitize(defaultValue, mode).slice(0, length),
    );
    const currentValue = sanitize(
      isControlled ? (controlledValue ?? "") : internalValue,
      mode,
    ).slice(0, length);

    const slotRefs = useRef<Array<HTMLInputElement | null>>([]);
    const hasFiredCompleteRef = useRef<boolean>(false);

    useImperativeHandle(
      ref,
      (): OTPInputHandle => ({
        focus: (): void => {
          const target =
            slotRefs.current[currentValue.length] ?? slotRefs.current[0];
          target?.focus();
        },
        clear: (): void => {
          if (!isControlled) setInternalValue("");
          onChange?.("");
          slotRefs.current[0]?.focus();
        },
      }),
      [currentValue.length, isControlled, onChange],
    );

    useEffect((): void => {
      if (!focusOnMount) return;
      slotRefs.current[0]?.focus();
    }, [focusOnMount]);

    const commit = useCallback(
      (next: string): void => {
        const clean = sanitize(next, mode).slice(0, length);
        if (!isControlled) setInternalValue(clean);
        onChange?.(clean);
        if (clean.length === length) {
          if (!hasFiredCompleteRef.current) {
            hasFiredCompleteRef.current = true;
            onComplete?.(clean);
          }
        } else {
          hasFiredCompleteRef.current = false;
        }
      },
      [isControlled, length, mode, onChange, onComplete],
    );

    const focusSlot = (index: number): void => {
      const clamped = Math.max(0, Math.min(length - 1, index));
      const target = slotRefs.current[clamped];
      if (!target) return;
      target.focus();
      target.select();
    };

    const handleChangeAt = (
      index: number,
      rawValue: string,
    ): void => {
      const cleaned = sanitize(rawValue, mode);
      if (cleaned.length === 0) return;

      const chars = currentValue.split("");
      if (cleaned.length === 1) {
        chars[index] = cleaned;
        const next = chars.join("").slice(0, length);
        commit(next);
        if (index < length - 1) focusSlot(index + 1);
        return;
      }

      // Multi-character input (e.g. browser autofill of the full code).
      const merged =
        currentValue.slice(0, index) + cleaned + currentValue.slice(index);
      const next = merged.slice(0, length);
      commit(next);
      focusSlot(Math.min(length - 1, next.length));
    };

    const handleKeyDown = (
      index: number,
      event: ReactKeyboardEvent<HTMLInputElement>,
    ): void => {
      const chars = currentValue.split("");

      if (event.key === "Backspace") {
        event.preventDefault();
        if (chars[index]) {
          chars[index] = "";
          commit(chars.join(""));
          return;
        }
        if (index > 0) {
          chars[index - 1] = "";
          commit(chars.join(""));
          focusSlot(index - 1);
        }
        return;
      }

      if (event.key === "Delete") {
        event.preventDefault();
        chars[index] = "";
        commit(chars.join(""));
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        focusSlot(index - 1);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        focusSlot(index + 1);
        return;
      }

      if (event.key === "Home") {
        event.preventDefault();
        focusSlot(0);
        return;
      }

      if (event.key === "End") {
        event.preventDefault();
        focusSlot(length - 1);
      }
    };

    const handlePaste = (
      index: number,
      event: ReactClipboardEvent<HTMLInputElement>,
    ): void => {
      event.preventDefault();
      const pasted = sanitize(event.clipboardData.getData("text"), mode);
      if (!pasted) return;
      const merged =
        currentValue.slice(0, index) + pasted + currentValue.slice(index);
      const next = merged.slice(0, length);
      commit(next);
      focusSlot(Math.min(length - 1, next.length));
    };

    const handleFocus = (event: ReactFocusEvent<HTMLInputElement>): void => {
      event.target.select();
    };

    return (
      <div
        role="group"
        aria-label={ariaLabel}
        data-slot="otp-input"
        className={cn("inline-flex items-center", className)}
      >
        {Array.from({ length }, (_unused, index) => {
          const char = currentValue[index] ?? "";
          const displayChar = char ? (mask ? "•" : char) : "";
          const showSeparator =
            groupSize && index > 0 && index % groupSize === 0;

          return (
            <span key={index} className="inline-flex items-center">
              {showSeparator ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "select-none text-muted-foreground mx-1 text-lg",
                    separatorClassName,
                  )}
                >
                  &ndash;
                </span>
              ) : null}
              <input
                ref={(el): void => {
                  slotRefs.current[index] = el;
                }}
                type="text"
                inputMode={mode === "numeric" ? "numeric" : "text"}
                pattern={mode === "numeric" ? "[0-9]*" : "[a-zA-Z0-9]*"}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                autoCorrect="off"
                spellCheck={false}
                maxLength={1}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                aria-label={`${ariaLabel} digit ${index + 1}`}
                placeholder={placeholder}
                value={displayChar}
                onFocus={handleFocus}
                onChange={(e): void => handleChangeAt(index, e.target.value)}
                onKeyDown={(e): void => handleKeyDown(index, e)}
                onPaste={(e): void => handlePaste(index, e)}
                className={cn(
                  otpSlotVariants({ variant, size, invalid }),
                  variant !== "underline" &&
                    "first:rounded-l-md last:rounded-r-md",
                  variant === "underline" && "rounded-none",
                  variant !== "underline" &&
                    !groupSize &&
                    "[&+span>input]:-ml-px",
                  slotClassName,
                )}
              />
            </span>
          );
        })}
        {name ? (
          <input type="hidden" name={name} value={currentValue} readOnly />
        ) : null}
      </div>
    );
  },
);
OTPInput.displayName = "OTPInput";

export { OTPInput, otpSlotVariants };

export default OTPInput;
