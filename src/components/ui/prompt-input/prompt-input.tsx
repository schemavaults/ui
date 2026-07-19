"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type FormEvent,
  type FormHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
  type TextareaHTMLAttributes,
} from "react";
import { ArrowUp, Square } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "../button/button";
import {
  promptInputSizeIds,
  promptInputTextareaSizeClass,
  promptInputToolbarSizeClass,
  promptInputVariantIds,
  promptInputVariants,
  type PromptInputSize,
  type PromptInputVariant,
} from "./prompt-input-variants";

/* ------------------------------------------------------------------ */
/* Context                                                            */
/* ------------------------------------------------------------------ */

interface PromptInputContextValue {
  value: string;
  setValue: (next: string) => void;
  disabled: boolean;
  isLoading: boolean;
  maxLength?: number;
  size: PromptInputSize;
  variant: PromptInputVariant;
  submit: () => void;
  stop: () => void;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
}

const PromptInputContext = createContext<PromptInputContextValue | null>(null);

function usePromptInputContext(component: string): PromptInputContextValue {
  const ctx = useContext(PromptInputContext);
  if (ctx === null) {
    throw new Error(
      `<${component}> must be rendered inside a <PromptInput> parent.`,
    );
  }
  return ctx;
}

/* ------------------------------------------------------------------ */
/* PromptInput (container / form)                                     */
/* ------------------------------------------------------------------ */

export interface PromptInputProps
  extends Omit<
    FormHTMLAttributes<HTMLFormElement>,
    "onSubmit" | "onChange" | "children"
  > {
  /** Controlled value. Omit to use uncontrolled mode with `defaultValue`. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Fires on every keystroke. */
  onValueChange?: (next: string) => void;
  /**
   * Fires when the user presses Enter (without Shift) or clicks the submit
   * button. Receives the trimmed current value.
   */
  onSubmit?: (value: string) => void;
  /**
   * Fires when the user clicks the submit slot while `isLoading` is true —
   * i.e. the button is showing its Stop state.
   */
  onStop?: () => void;
  /** Marks the whole surface as loading. Submit swaps to a Stop button. */
  isLoading?: boolean;
  /** Disables the whole surface. */
  disabled?: boolean;
  /** Optional hard character cap. Enter+submit are blocked when exceeded. */
  maxLength?: number;
  /**
   * Trim whitespace before dispatching `onSubmit` and validating "is empty".
   * Default: true.
   */
  trimOnSubmit?: boolean;
  /** Visual style. */
  variant?: PromptInputVariant;
  /** Overall spacing / typography scale. */
  size?: PromptInputSize;
  children?: ReactNode;
  ref?: Ref<HTMLFormElement>;
}

function PromptInput({
  value: controlledValue,
  defaultValue,
  onValueChange,
  onSubmit,
  onStop,
  isLoading = false,
  disabled = false,
  maxLength,
  trimOnSubmit = true,
  variant = "default",
  size = "default",
  className,
  children,
  ref,
  ...formProps
}: PromptInputProps): ReactElement {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? "",
  );
  const value: string = isControlled ? (controlledValue as string) : internalValue;

  const setValue = useCallback(
    (next: string): void => {
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const submit = useCallback((): void => {
    if (disabled) return;
    const outgoing = trimOnSubmit ? value.trim() : value;
    if (outgoing.length === 0) return;
    if (maxLength !== undefined && outgoing.length > maxLength) return;
    onSubmit?.(outgoing);
  }, [disabled, maxLength, onSubmit, trimOnSubmit, value]);

  const stop = useCallback((): void => {
    onStop?.();
  }, [onStop]);

  const handleFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      if (isLoading) {
        stop();
        return;
      }
      submit();
    },
    [isLoading, stop, submit],
  );

  const contextValue = useMemo<PromptInputContextValue>(
    () => ({
      value,
      setValue,
      disabled,
      isLoading,
      maxLength,
      size,
      variant,
      submit,
      stop,
      textareaRef,
    }),
    [
      value,
      setValue,
      disabled,
      isLoading,
      maxLength,
      size,
      variant,
      submit,
      stop,
    ],
  );

  return (
    <PromptInputContext.Provider value={contextValue}>
      <form
        ref={ref}
        data-slot="prompt-input"
        data-variant={variant}
        data-size={size}
        data-loading={isLoading ? "true" : "false"}
        data-disabled={disabled ? "true" : "false"}
        onSubmit={handleFormSubmit}
        className={cn(promptInputVariants({ variant, size }), className)}
        {...formProps}
      >
        {children}
      </form>
    </PromptInputContext.Provider>
  );
}
PromptInput.displayName = "PromptInput";

/* ------------------------------------------------------------------ */
/* PromptInputTextarea                                                */
/* ------------------------------------------------------------------ */

export interface PromptInputTextareaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "value" | "defaultValue" | "onChange"
  > {
  /**
   * Enable Enter-to-submit. Shift+Enter still inserts a newline.
   * Default: true.
   */
  submitOnEnter?: boolean;
  /**
   * Maximum height (in pixels) that auto-resize will grow to before the
   * textarea starts scrolling internally. Default: 240.
   */
  maxHeightPx?: number;
}

function PromptInputTextarea({
  className,
  submitOnEnter = true,
  maxHeightPx = 240,
  onKeyDown,
  rows = 1,
  ref: forwardedRef,
  ...props
}: PromptInputTextareaProps & { ref?: Ref<HTMLTextAreaElement> }): ReactElement {
  const ctx = usePromptInputContext("PromptInputTextarea");
  const internalRef = ctx.textareaRef;

  // Merge external ref if the consumer passed one.
  const setRef = useCallback(
    (node: HTMLTextAreaElement | null): void => {
      internalRef.current = node;
      if (typeof forwardedRef === "function") {
        forwardedRef(node);
      } else if (forwardedRef && typeof forwardedRef === "object") {
        (forwardedRef as MutableRefObject<HTMLTextAreaElement | null>).current =
          node;
      }
    },
    [forwardedRef, internalRef],
  );

  // Auto-resize: recompute height whenever the value changes.
  useLayoutEffect((): void => {
    const el = internalRef.current;
    if (el === null) return;
    el.style.height = "0px";
    const nextHeight = Math.min(el.scrollHeight, maxHeightPx);
    el.style.height = `${nextHeight}px`;
    el.style.overflowY = el.scrollHeight > maxHeightPx ? "auto" : "hidden";
  }, [ctx.value, maxHeightPx, internalRef]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>): void => {
      ctx.setValue(event.target.value);
    },
    [ctx],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>): void => {
      onKeyDown?.(event);
      if (event.defaultPrevented) return;
      if (!submitOnEnter) return;
      if (event.key !== "Enter") return;
      if (event.shiftKey || event.altKey || event.nativeEvent.isComposing) {
        return;
      }
      event.preventDefault();
      if (ctx.isLoading) {
        ctx.stop();
      } else {
        ctx.submit();
      }
    },
    [ctx, onKeyDown, submitOnEnter],
  );

  return (
    <textarea
      ref={setRef}
      data-slot="prompt-input-textarea"
      value={ctx.value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      disabled={ctx.disabled}
      rows={rows}
      maxLength={ctx.maxLength}
      className={cn(
        "w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed",
        promptInputTextareaSizeClass[ctx.size],
        className,
      )}
      {...props}
    />
  );
}
PromptInputTextarea.displayName = "PromptInputTextarea";

/* ------------------------------------------------------------------ */
/* PromptInputToolbar / actions row                                   */
/* ------------------------------------------------------------------ */

export interface PromptInputToolbarProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PromptInputToolbar({
  className,
  ref,
  ...props
}: PromptInputToolbarProps): ReactElement {
  const ctx = usePromptInputContext("PromptInputToolbar");
  return (
    <div
      ref={ref}
      data-slot="prompt-input-toolbar"
      className={cn(
        "flex items-center justify-between",
        promptInputToolbarSizeClass[ctx.size],
        className,
      )}
      {...props}
    />
  );
}
PromptInputToolbar.displayName = "PromptInputToolbar";

export interface PromptInputActionsProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PromptInputActions({
  className,
  ref,
  ...props
}: PromptInputActionsProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="prompt-input-actions"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  );
}
PromptInputActions.displayName = "PromptInputActions";

/* ------------------------------------------------------------------ */
/* PromptInputAction — a themed icon-button convenience slot          */
/* ------------------------------------------------------------------ */

export interface PromptInputActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required accessible label — actions are icon-only by default. */
  "aria-label": string;
}

function PromptInputAction({
  className,
  type = "button",
  disabled,
  ref,
  ...props
}: PromptInputActionProps & { ref?: Ref<HTMLButtonElement> }): ReactElement {
  const ctx = usePromptInputContext("PromptInputAction");
  const resolvedDisabled = disabled ?? ctx.disabled;
  return (
    <button
      ref={ref}
      type={type}
      data-slot="prompt-input-action"
      disabled={resolvedDisabled}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
PromptInputAction.displayName = "PromptInputAction";

/* ------------------------------------------------------------------ */
/* PromptInputSubmit                                                  */
/* ------------------------------------------------------------------ */

export interface PromptInputSubmitProps
  extends Omit<ButtonProps, "type" | "children"> {
  /** Content shown when the input is idle. Default: an up-arrow icon. */
  children?: ReactNode;
  /** Content shown when `isLoading` is true. Default: a stop-square icon. */
  loadingChildren?: ReactNode;
  /**
   * Accessible label used when the button is in its idle send state.
   * Default: "Send message".
   */
  sendLabel?: string;
  /**
   * Accessible label used when the button is in its loading (stop) state.
   * Default: "Stop generating".
   */
  stopLabel?: string;
}

function PromptInputSubmit({
  className,
  variant,
  size,
  children,
  loadingChildren,
  disabled,
  sendLabel = "Send message",
  stopLabel = "Stop generating",
  ...props
}: PromptInputSubmitProps): ReactElement {
  const ctx = usePromptInputContext("PromptInputSubmit");
  const isEmpty =
    ctx.value.trim().length === 0 ||
    (ctx.maxLength !== undefined && ctx.value.length > ctx.maxLength);
  const idleDisabled = ctx.disabled || isEmpty;
  const resolvedDisabled = ctx.isLoading
    ? ctx.disabled
    : (disabled ?? idleDisabled);

  const iconSizeClass =
    ctx.size === "lg" ? "h-4 w-4" : ctx.size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <Button
      type="submit"
      data-slot="prompt-input-submit"
      data-state={ctx.isLoading ? "loading" : "idle"}
      aria-label={ctx.isLoading ? stopLabel : sendLabel}
      variant={variant ?? (ctx.isLoading ? "secondary" : "default")}
      size={size ?? "icon"}
      disabled={resolvedDisabled}
      className={cn("shrink-0", className)}
      {...props}
    >
      {ctx.isLoading
        ? (loadingChildren ?? (
            <Square
              aria-hidden="true"
              className={cn(iconSizeClass, "fill-current")}
            />
          ))
        : (children ?? (
            <ArrowUp aria-hidden="true" className={iconSizeClass} />
          ))}
    </Button>
  );
}
PromptInputSubmit.displayName = "PromptInputSubmit";

/* ------------------------------------------------------------------ */
/* PromptInputCharCount                                               */
/* ------------------------------------------------------------------ */

export interface PromptInputCharCountProps
  extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Percentage (0-100) at which the count starts warning. Default: 90.
   */
  warnAtPercent?: number;
  /**
   * Render prop to fully customise the display. Called with the raw and
   * derived state — return the node to display inside the span.
   */
  render?: (state: {
    length: number;
    maxLength: number | undefined;
    remaining: number | undefined;
    isOverLimit: boolean;
    isNearLimit: boolean;
  }) => ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

function PromptInputCharCount({
  className,
  warnAtPercent = 90,
  render,
  ref,
  ...props
}: PromptInputCharCountProps): ReactElement | null {
  const ctx = usePromptInputContext("PromptInputCharCount");
  const length = ctx.value.length;
  const maxLength = ctx.maxLength;
  const remaining = maxLength !== undefined ? maxLength - length : undefined;
  const isOverLimit = maxLength !== undefined && length > maxLength;
  const isNearLimit =
    maxLength !== undefined && length >= (maxLength * warnAtPercent) / 100;

  if (maxLength === undefined && render === undefined) {
    return null;
  }

  const content =
    render !== undefined
      ? render({ length, maxLength, remaining, isOverLimit, isNearLimit })
      : `${length}/${maxLength}`;

  return (
    <span
      ref={ref}
      data-slot="prompt-input-char-count"
      data-over-limit={isOverLimit ? "true" : "false"}
      data-near-limit={isNearLimit ? "true" : "false"}
      aria-live="polite"
      className={cn(
        "tabular-nums text-xs text-muted-foreground",
        isNearLimit && !isOverLimit && "text-amber-600 dark:text-amber-400",
        isOverLimit && "text-destructive",
        className,
      )}
      {...props}
    >
      {content}
    </span>
  );
}
PromptInputCharCount.displayName = "PromptInputCharCount";

/* ------------------------------------------------------------------ */
/* PromptInputHint — quiet helper text (e.g. keyboard shortcuts)      */
/* ------------------------------------------------------------------ */

export interface PromptInputHintProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
}

function PromptInputHint({
  className,
  ref,
  ...props
}: PromptInputHintProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="prompt-input-hint"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}
PromptInputHint.displayName = "PromptInputHint";

/* ------------------------------------------------------------------ */
/* Utility hook: consumers who want to reach into the parent state    */
/* ------------------------------------------------------------------ */

/**
 * Read the current `<PromptInput>` state from inside a custom child.
 * Only callable inside a `<PromptInput>` tree.
 */
function usePromptInput(): PromptInputContextValue {
  return usePromptInputContext("usePromptInput");
}

export {
  PromptInput,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputActions,
  PromptInputAction,
  PromptInputSubmit,
  PromptInputCharCount,
  PromptInputHint,
  usePromptInput,
  promptInputSizeIds,
  promptInputVariantIds,
};
export type { PromptInputSize, PromptInputVariant };
