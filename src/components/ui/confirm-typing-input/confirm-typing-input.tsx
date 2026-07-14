"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { AlertTriangle, Check, X } from "lucide-react";
import {
  useCallback,
  useId,
  useMemo,
  useState,
  type ChangeEvent,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

export const confirmTypingInputVariantIds = [
  "destructive",
  "warning",
  "neutral",
] as const satisfies string[];
export type ConfirmTypingInputVariant =
  (typeof confirmTypingInputVariantIds)[number];

export const confirmTypingInputSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies string[];
export type ConfirmTypingInputSize =
  (typeof confirmTypingInputSizeIds)[number];

const inputVariants = cva(
  "flex w-full font-mono tabular-nums bg-background text-foreground placeholder:text-muted-foreground/60 ring-offset-background transition-[color,border-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        destructive: "border-destructive/50 focus-visible:ring-destructive",
        warning: "border-warning/60 focus-visible:ring-warning",
        neutral: "border-input focus-visible:ring-ring",
      } satisfies Record<ConfirmTypingInputVariant, string>,
      size: {
        sm: "h-8 rounded-md border px-2.5 text-xs",
        md: "h-10 rounded-md border px-3 text-sm",
        lg: "h-12 rounded-md border px-4 text-base",
      } satisfies Record<ConfirmTypingInputSize, string>,
      matched: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        matched: true,
        class:
          "border-emerald-500/70 focus-visible:ring-emerald-500 dark:border-emerald-400/70 dark:focus-visible:ring-emerald-400",
      },
    ],
    defaultVariants: {
      variant: "destructive",
      size: "md",
      matched: false,
    },
  },
);

const promptVariants = cva("select-none leading-snug", {
  variants: {
    variant: {
      destructive: "text-destructive",
      warning: "text-warning",
      neutral: "text-muted-foreground",
    } satisfies Record<ConfirmTypingInputVariant, string>,
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-sm",
    } satisfies Record<ConfirmTypingInputSize, string>,
  },
  defaultVariants: {
    variant: "destructive",
    size: "md",
  },
});

const iconWrapVariants = cva(
  "pointer-events-none absolute inset-y-0 flex items-center justify-center text-muted-foreground",
  {
    variants: {
      side: {
        left: "left-0",
        right: "right-0",
      },
      size: {
        sm: "w-7 [&>svg]:size-3.5",
        md: "w-9 [&>svg]:size-4",
        lg: "w-11 [&>svg]:size-[18px]",
      } satisfies Record<ConfirmTypingInputSize, string>,
    },
    defaultVariants: {
      side: "left",
      size: "md",
    },
  },
);

function normalize(value: string, caseSensitive: boolean): string {
  return caseSensitive ? value : value.toLowerCase();
}

function isMatch(
  value: string,
  phrase: string,
  caseSensitive: boolean,
  trim: boolean,
): boolean {
  if (phrase.length === 0) return false;
  const v = trim ? value.trim() : value;
  return normalize(v, caseSensitive) === normalize(phrase, caseSensitive);
}

export interface ConfirmTypingInputRenderPromptContext {
  /** The phrase the user must type. */
  phrase: string;
  /** Whether comparison is case-sensitive. */
  caseSensitive: boolean;
  /** A pre-rendered `<code>` element for the phrase. */
  phraseElement: ReactElement;
}

export interface ConfirmTypingInputProps
  extends Omit<
      InputHTMLAttributes<HTMLInputElement>,
      "size" | "onChange" | "prefix" | "value" | "defaultValue"
    >,
    VariantProps<typeof inputVariants> {
  /**
   * The exact phrase the user must type to confirm. This is compared against
   * the input value on every keystroke and drives the `matched` state.
   */
  phrase: string;
  /** Controlled value. */
  value?: string;
  /** Uncontrolled default value. */
  defaultValue?: string;
  /** Called on every keystroke with the current input value. */
  onChange?: (value: string) => void;
  /**
   * Fired once, the moment the input value transitions from not matching to
   * matching the phrase.
   */
  onConfirm?: (value: string) => void;
  /**
   * Whether the comparison against `phrase` is case-sensitive. Defaults to
   * `true` — matching the strictness of GitHub/Vercel-style delete flows.
   */
  caseSensitive?: boolean;
  /**
   * Whether to trim surrounding whitespace from the input before comparing.
   * Defaults to `true` — accidental trailing spaces should not block the
   * confirmation.
   */
  trim?: boolean;
  /**
   * Prompt text rendered above the input. Defaults to a helpful message that
   * embeds `phrase` in a `<code>` element. Pass `null` to hide it, or a render
   * function to fully customize the message.
   */
  prompt?:
    | ReactNode
    | null
    | ((context: ConfirmTypingInputRenderPromptContext) => ReactNode);
  /**
   * Show a status icon at the end of the input reflecting the match state.
   * Defaults to `true`.
   */
  showStatusIcon?: boolean;
  /**
   * Show a leading warning icon inside the input. Defaults to `true` for the
   * `destructive` and `warning` variants and `false` for `neutral`.
   */
  showLeadingIcon?: boolean;
  /**
   * Optional slot rendered below the input (e.g. a submit button that is
   * disabled until the phrase is matched). Receives the current match state.
   */
  footer?: ReactNode | ((matched: boolean) => ReactNode);
  /** Extra classes for the outer wrapper. */
  className?: string;
  /** Extra classes for the input element. */
  inputClassName?: string;
  /** Extra classes for the prompt text element. */
  promptClassName?: string;
  /** Ref forwarded to the underlying `<input>`. */
  ref?: Ref<HTMLInputElement>;
}

function DefaultPrompt({
  phraseElement,
}: ConfirmTypingInputRenderPromptContext): ReactElement {
  return (
    <span>
      To confirm, type {phraseElement} below.
    </span>
  );
}

function ConfirmTypingInput({
  phrase,
  value: controlledValue,
  defaultValue,
  onChange,
  onConfirm,
  caseSensitive = true,
  trim = true,
  prompt,
  variant,
  size,
  showStatusIcon = true,
  showLeadingIcon,
  footer,
  className,
  inputClassName,
  promptClassName,
  id,
  disabled,
  ref,
  ...props
}: ConfirmTypingInputProps): ReactElement {
  const resolvedVariant: ConfirmTypingInputVariant = variant ?? "destructive";
  const resolvedSize: ConfirmTypingInputSize = size ?? "md";

  const isControlled: boolean = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? "",
  );
  const currentValue: string = isControlled
    ? (controlledValue as string)
    : internalValue;

  const matched: boolean = useMemo(
    (): boolean => isMatch(currentValue, phrase, caseSensitive, trim),
    [currentValue, phrase, caseSensitive, trim],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const next: string = event.target.value;
      const wasMatched: boolean = isMatch(
        currentValue,
        phrase,
        caseSensitive,
        trim,
      );
      const willMatch: boolean = isMatch(next, phrase, caseSensitive, trim);
      if (!isControlled) setInternalValue(next);
      onChange?.(next);
      if (!wasMatched && willMatch) {
        onConfirm?.(next);
      }
    },
    [
      caseSensitive,
      currentValue,
      isControlled,
      onChange,
      onConfirm,
      phrase,
      trim,
    ],
  );

  const generatedId: string = useId();
  const inputId: string = id ?? generatedId;
  const promptId: string = `${inputId}-prompt`;

  const resolvedShowLeadingIcon: boolean =
    showLeadingIcon ?? resolvedVariant !== "neutral";

  const isEmpty: boolean = currentValue.length === 0;
  const showMismatchIcon: boolean =
    showStatusIcon && !isEmpty && !matched;
  const showMatchIcon: boolean = showStatusIcon && matched;

  const leadingPadding: string =
    resolvedSize === "sm"
      ? "pl-7"
      : resolvedSize === "lg"
        ? "pl-11"
        : "pl-9";
  const trailingPadding: string =
    resolvedSize === "sm"
      ? "pr-7"
      : resolvedSize === "lg"
        ? "pr-11"
        : "pr-9";

  const phraseElement: ReactElement = (
    <code
      data-slot="confirm-typing-input-phrase"
      className={cn(
        "rounded bg-muted px-1 py-0.5 font-mono font-semibold text-foreground",
        resolvedSize === "sm" ? "text-[10px]" : "text-xs",
      )}
    >
      {phrase}
    </code>
  );

  const renderedPrompt: ReactNode =
    prompt === null
      ? null
      : typeof prompt === "function"
        ? prompt({ phrase, caseSensitive, phraseElement })
        : (prompt ??
          DefaultPrompt({ phrase, caseSensitive, phraseElement }));

  const renderedFooter: ReactNode =
    typeof footer === "function" ? footer(matched) : footer;

  const LeadingIcon = AlertTriangle;

  return (
    <div
      data-slot="confirm-typing-input"
      data-variant={resolvedVariant}
      data-matched={matched ? "true" : "false"}
      className={cn("flex w-full flex-col gap-1.5", className)}
    >
      {renderedPrompt !== null && renderedPrompt !== undefined ? (
        <label
          id={promptId}
          htmlFor={inputId}
          data-slot="confirm-typing-input-prompt"
          className={cn(
            promptVariants({ variant: resolvedVariant, size: resolvedSize }),
            promptClassName,
          )}
        >
          {renderedPrompt}
        </label>
      ) : null}
      <div
        data-slot="confirm-typing-input-field"
        className="relative flex w-full items-center"
      >
        {resolvedShowLeadingIcon ? (
          <span
            aria-hidden="true"
            data-slot="confirm-typing-input-leading-icon"
            className={cn(
              iconWrapVariants({ side: "left", size: resolvedSize }),
              resolvedVariant === "destructive" && "text-destructive/70",
              resolvedVariant === "warning" && "text-warning/80",
            )}
          >
            <LeadingIcon />
          </span>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          type="text"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          disabled={disabled}
          value={currentValue}
          onChange={handleChange}
          aria-invalid={!isEmpty && !matched ? true : undefined}
          aria-describedby={
            renderedPrompt !== null && renderedPrompt !== undefined
              ? promptId
              : undefined
          }
          aria-label={props["aria-label"] ?? `Type "${phrase}" to confirm`}
          data-slot="confirm-typing-input-input"
          className={cn(
            inputVariants({
              variant: resolvedVariant,
              size: resolvedSize,
              matched,
            }),
            resolvedShowLeadingIcon && leadingPadding,
            showStatusIcon && trailingPadding,
            inputClassName,
          )}
          {...props}
        />
        {showMatchIcon ? (
          <span
            aria-hidden="true"
            data-slot="confirm-typing-input-status-icon"
            data-state="matched"
            className={cn(
              iconWrapVariants({ side: "right", size: resolvedSize }),
              "text-emerald-500 dark:text-emerald-400",
            )}
          >
            <Check strokeWidth={2.5} />
          </span>
        ) : null}
        {showMismatchIcon ? (
          <span
            aria-hidden="true"
            data-slot="confirm-typing-input-status-icon"
            data-state="mismatch"
            className={cn(
              iconWrapVariants({ side: "right", size: resolvedSize }),
              resolvedVariant === "destructive" && "text-destructive/70",
              resolvedVariant === "warning" && "text-warning/70",
              resolvedVariant === "neutral" && "text-muted-foreground",
            )}
          >
            <X strokeWidth={2.5} />
          </span>
        ) : null}
      </div>
      {renderedFooter !== undefined && renderedFooter !== null ? (
        <div
          data-slot="confirm-typing-input-footer"
          className="flex w-full items-center"
        >
          {renderedFooter}
        </div>
      ) : null}
    </div>
  );
}
ConfirmTypingInput.displayName = "ConfirmTypingInput";

export interface ConfirmTypingInputPromptProps
  extends HTMLAttributes<HTMLParagraphElement> {
  variant?: ConfirmTypingInputVariant;
  size?: ConfirmTypingInputSize;
  ref?: Ref<HTMLParagraphElement>;
}

/**
 * A standalone prompt with the same styling as the built-in prompt, exported
 * for consumers who want to render their own prompt content but keep the
 * variant/size styling consistent.
 */
function ConfirmTypingInputPrompt({
  className,
  variant,
  size,
  ref,
  ...props
}: ConfirmTypingInputPromptProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="confirm-typing-input-prompt"
      className={cn(promptVariants({ variant, size }), className)}
      {...props}
    />
  );
}
ConfirmTypingInputPrompt.displayName = "ConfirmTypingInputPrompt";

export {
  ConfirmTypingInput,
  ConfirmTypingInputPrompt,
  inputVariants as confirmTypingInputVariants,
  promptVariants as confirmTypingInputPromptVariants,
};

export default ConfirmTypingInput;
