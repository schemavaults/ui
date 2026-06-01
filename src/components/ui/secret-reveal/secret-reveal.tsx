"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/copy-button";
import {
  type SecretRevealMaskStyle,
  type SecretRevealSize,
  type SecretRevealVariant,
  secretRevealMaskStyleIds,
  secretRevealSizeIds,
  secretRevealVariantIds,
} from "./secret-reveal-variants";

const secretRevealVariants = cva(
  "group/secret-reveal inline-flex w-full items-center gap-1 rounded-md border font-mono transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground",
        outline: "border-input bg-background text-foreground",
        subtle:
          "border-transparent bg-muted/60 text-muted-foreground hover:text-foreground",
        terminal:
          "border-zinc-800 bg-zinc-950 text-zinc-100 dark:border-zinc-700",
        brand:
          "border-schemavaults-brand-blue/30 bg-schemavaults-brand-blue/5 text-foreground",
      } satisfies Record<SecretRevealVariant, string>,
      size: {
        sm: "h-8 px-2 text-xs gap-1",
        md: "h-9 px-2.5 text-sm gap-1.5",
        lg: "h-11 px-3 text-base gap-2",
      } satisfies Record<SecretRevealSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const secretRevealValueVariants = cva(
  "flex-1 truncate select-all tabular-nums",
  {
    variants: {
      masked: {
        true: "select-none",
        false: "",
      },
      maskStyle: {
        dots: "",
        asterisks: "",
        blur: "",
      } satisfies Record<SecretRevealMaskStyle, string>,
    },
    compoundVariants: [
      {
        masked: true,
        maskStyle: "blur",
        class: "blur-sm transition-[filter] duration-200",
      },
    ],
    defaultVariants: {
      masked: true,
      maskStyle: "dots",
    },
  },
);

const secretRevealActionVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-md text-muted-foreground ring-offset-background transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-6 w-6 [&_svg]:size-3.5",
        md: "h-7 w-7 [&_svg]:size-4",
        lg: "h-8 w-8 [&_svg]:size-[18px]",
      } satisfies Record<SecretRevealSize, string>,
      variant: {
        default: "hover:bg-background/60",
        outline: "hover:bg-accent",
        subtle: "hover:bg-muted",
        terminal: "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
        brand:
          "hover:bg-schemavaults-brand-blue/10 hover:text-schemavaults-brand-blue",
      } satisfies Record<SecretRevealVariant, string>,
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

function buildMaskString(
  value: string,
  maskStyle: SecretRevealMaskStyle,
  maskLength: number | "match" | "fixed",
): string {
  if (maskStyle === "blur") return value;
  const char: string = maskStyle === "asterisks" ? "*" : "•";
  if (maskLength === "match") return char.repeat(value.length);
  if (maskLength === "fixed") return char.repeat(8);
  return char.repeat(Math.max(0, maskLength));
}

export interface SecretRevealProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof secretRevealVariants> {
  /** The sensitive value to display. */
  value: string;
  /** Controlled revealed state. */
  revealed?: boolean;
  /** Initial revealed state when uncontrolled. */
  defaultRevealed?: boolean;
  /** Called when the revealed state changes. */
  onRevealChange?: (revealed: boolean) => void;
  /**
   * Whether the value should be re-masked automatically after revealing.
   * When a number is provided, that's the timeout (in ms) before re-masking.
   * Pass `false` (default) to disable.
   */
  autoHideAfter?: number | false;
  /** Mask character style. Defaults to "dots". */
  maskStyle?: SecretRevealMaskStyle;
  /**
   * Controls how the mask is sized:
   * - "match" (default): one mask character per real character — leaks length.
   * - "fixed": always renders 8 mask characters — hides length.
   * - A number: render that many mask characters.
   */
  maskLength?: number | "match" | "fixed";
  /** Whether to render the built-in copy button. Defaults to true. */
  showCopyButton?: boolean;
  /** Whether to render the reveal/hide toggle button. Defaults to true. */
  showRevealToggle?: boolean;
  /** Optional label rendered to the left of the value. */
  label?: ReactNode;
  /** Accessible label for the reveal toggle button when masked. */
  revealAriaLabel?: string;
  /** Accessible label for the reveal toggle button when revealed. */
  hideAriaLabel?: string;
  /** Optional node rendered before the action buttons (e.g. an indicator). */
  trailing?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

function SecretReveal({
  value,
  variant,
  size,
  revealed: revealedProp,
  defaultRevealed = false,
  onRevealChange,
  autoHideAfter = false,
  maskStyle = "dots",
  maskLength = "match",
  showCopyButton = true,
  showRevealToggle = true,
  label,
  revealAriaLabel = "Reveal secret",
  hideAriaLabel = "Hide secret",
  trailing,
  className,
  ref,
  ...props
}: SecretRevealProps): ReactElement {
  const isControlled: boolean = revealedProp !== undefined;
  const [internalRevealed, setInternalRevealed] = useState<boolean>(
    defaultRevealed,
  );
  const revealed: boolean = isControlled
    ? (revealedProp as boolean)
    : internalRevealed;

  const autoHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearAutoHide = useCallback((): void => {
    if (autoHideTimer.current !== null) {
      clearTimeout(autoHideTimer.current);
      autoHideTimer.current = null;
    }
  }, []);

  useEffect((): (() => void) => {
    return (): void => {
      clearAutoHide();
    };
  }, [clearAutoHide]);

  const setRevealed = useCallback(
    (next: boolean): void => {
      if (!isControlled) setInternalRevealed(next);
      onRevealChange?.(next);
    },
    [isControlled, onRevealChange],
  );

  useEffect((): void => {
    clearAutoHide();
    if (
      revealed &&
      typeof autoHideAfter === "number" &&
      autoHideAfter > 0
    ) {
      autoHideTimer.current = setTimeout((): void => {
        setRevealed(false);
        autoHideTimer.current = null;
      }, autoHideAfter);
    }
  }, [revealed, autoHideAfter, clearAutoHide, setRevealed]);

  const handleToggle = useCallback((): void => {
    setRevealed(!revealed);
  }, [revealed, setRevealed]);

  const resolvedVariant: SecretRevealVariant = variant ?? "default";
  const resolvedSize: SecretRevealSize = size ?? "md";

  const displayedValue: string = useMemo((): string => {
    if (revealed) return value;
    return buildMaskString(value, maskStyle, maskLength);
  }, [revealed, value, maskStyle, maskLength]);

  const ToggleIcon = revealed ? EyeOff : Eye;
  const toggleAriaLabel: string = revealed ? hideAriaLabel : revealAriaLabel;

  return (
    <div
      ref={ref}
      data-slot="secret-reveal"
      data-variant={resolvedVariant}
      data-revealed={revealed ? "true" : "false"}
      className={cn(
        secretRevealVariants({ variant, size }),
        className,
      )}
      {...props}
    >
      {label !== undefined && label !== null ? (
        <span
          data-slot="secret-reveal-label"
          className="shrink-0 select-none pr-1 font-sans font-medium opacity-80"
        >
          {label}
        </span>
      ) : null}
      <span
        data-slot="secret-reveal-value"
        aria-live="polite"
        aria-label={revealed ? "Revealed secret value" : "Masked secret value"}
        className={cn(
          secretRevealValueVariants({
            masked: !revealed,
            maskStyle,
          }),
        )}
      >
        {displayedValue}
      </span>
      {trailing}
      {showRevealToggle ? (
        <button
          type="button"
          data-slot="secret-reveal-toggle"
          aria-pressed={revealed}
          aria-label={toggleAriaLabel}
          onClick={handleToggle}
          className={cn(
            secretRevealActionVariants({
              size: resolvedSize,
              variant: resolvedVariant,
            }),
          )}
        >
          <ToggleIcon aria-hidden="true" />
        </button>
      ) : null}
      {showCopyButton ? (
        <CopyButton
          value={value}
          variant="ghost"
          size={resolvedSize === "lg" ? "icon-md" : "icon-sm"}
          className={cn(
            resolvedVariant === "terminal" &&
              "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 data-[copied=true]:text-green-400",
            resolvedVariant === "brand" &&
              "hover:text-schemavaults-brand-blue data-[copied=true]:text-schemavaults-brand-blue",
          )}
        />
      ) : null}
    </div>
  );
}
SecretReveal.displayName = "SecretReveal";

export {
  SecretReveal,
  secretRevealVariants,
  secretRevealSizeIds,
  secretRevealVariantIds,
  secretRevealMaskStyleIds,
};
export type { SecretRevealSize, SecretRevealVariant, SecretRevealMaskStyle };

export default SecretReveal;
