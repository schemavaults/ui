"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import { Button } from "../button/button";
import { DropdownMenuContent } from "../dropdown-menu/dropdown-menu";
import {
  splitButtonSizeIds,
  splitButtonVariantIds,
  type SplitButtonSize,
  type SplitButtonVariant,
} from "./split-button-variants";

interface SplitButtonContextValue {
  variant: SplitButtonVariant;
  size: SplitButtonSize;
  disabled: boolean;
}

const SplitButtonContext = createContext<SplitButtonContextValue | null>(null);

function useSplitButtonContext(componentName: string): SplitButtonContextValue {
  const ctx = useContext(SplitButtonContext);
  if (ctx === null) {
    throw new Error(
      `<${componentName}> must be rendered inside a <SplitButton> parent.`,
    );
  }
  return ctx;
}

const dividerClassByVariant = {
  default: "border-l border-primary-foreground/25",
  destructive: "border-l border-destructive-foreground/25",
  outline: "border-l border-input",
  secondary: "border-l border-secondary-foreground/20",
  ghost: "border-l border-border",
} satisfies Record<SplitButtonVariant, string>;

const triggerSizeClass = {
  sm: "h-9 w-8 px-0",
  default: "h-10 w-10 px-0",
  lg: "h-11 w-11 px-0",
} satisfies Record<SplitButtonSize, string>;

const triggerIconSizeClass = {
  sm: "h-3.5 w-3.5",
  default: "h-4 w-4",
  lg: "h-5 w-5",
} satisfies Record<SplitButtonSize, string>;

export interface SplitButtonProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual style shared by both halves. Mirrors the Button variants. */
  variant?: SplitButtonVariant;
  /** Height/padding shared by both halves. */
  size?: SplitButtonSize;
  /** Disables both the primary action and the dropdown trigger. */
  disabled?: boolean;
  /** Controlled open state for the dropdown menu. */
  open?: boolean;
  /** Uncontrolled initial open state for the dropdown menu. */
  defaultOpen?: boolean;
  /** Fires when the dropdown opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Text direction forwarded to the underlying DropdownMenu.Root. */
  dir?: "ltr" | "rtl";
  /** Modal control forwarded to the underlying DropdownMenu.Root. */
  modal?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function SplitButton({
  variant = "default",
  size = "default",
  disabled = false,
  open,
  defaultOpen,
  onOpenChange,
  dir,
  modal,
  className,
  children,
  ref,
  ...props
}: SplitButtonProps): ReactElement {
  return (
    <SplitButtonContext.Provider value={{ variant, size, disabled }}>
      <DropdownMenuPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        dir={dir}
        modal={modal}
      >
        <div
          ref={ref}
          data-slot="split-button"
          data-variant={variant}
          data-size={size}
          data-disabled={disabled ? "true" : "false"}
          className={cn("inline-flex items-stretch", className)}
          {...props}
        >
          {children}
        </div>
      </DropdownMenuPrimitive.Root>
    </SplitButtonContext.Provider>
  );
}
SplitButton.displayName = "SplitButton";

export interface SplitButtonActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Override the container-provided variant just for the primary action. */
  variant?: SplitButtonVariant;
  /** Override the container-provided size just for the primary action. */
  size?: SplitButtonSize;
}

function SplitButtonAction({
  className,
  variant,
  size,
  disabled,
  type = "button",
  ...props
}: SplitButtonActionProps): ReactElement {
  const ctx = useSplitButtonContext("SplitButtonAction");
  const resolvedVariant: SplitButtonVariant = variant ?? ctx.variant;
  const resolvedSize: SplitButtonSize = size ?? ctx.size;
  const resolvedDisabled: boolean = disabled ?? ctx.disabled;

  return (
    <Button
      type={type}
      variant={resolvedVariant}
      size={resolvedSize}
      disabled={resolvedDisabled}
      data-slot="split-button-action"
      className={cn(
        "rounded-r-none border-r-0 focus-visible:z-10",
        className,
      )}
      {...props}
    />
  );
}
SplitButtonAction.displayName = "SplitButtonAction";

export interface SplitButtonTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Override the container-provided variant just for the trigger. */
  variant?: SplitButtonVariant;
  /** Override the container-provided size just for the trigger. */
  size?: SplitButtonSize;
  /** Optional replacement for the default chevron icon. */
  icon?: ReactNode;
  /**
   * Accessible label for the icon-only trigger. Defaults to
   * "Show more actions".
   */
  "aria-label"?: string;
}

function SplitButtonTrigger({
  className,
  variant,
  size,
  disabled,
  icon,
  type = "button",
  "aria-label": ariaLabel = "Show more actions",
  ...props
}: SplitButtonTriggerProps): ReactElement {
  const ctx = useSplitButtonContext("SplitButtonTrigger");
  const resolvedVariant: SplitButtonVariant = variant ?? ctx.variant;
  const resolvedSize: SplitButtonSize = size ?? ctx.size;
  const resolvedDisabled: boolean = disabled ?? ctx.disabled;

  return (
    <DropdownMenuPrimitive.Trigger asChild disabled={resolvedDisabled}>
      <Button
        type={type}
        variant={resolvedVariant}
        size={resolvedSize}
        disabled={resolvedDisabled}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        data-slot="split-button-trigger"
        className={cn(
          "rounded-l-none focus-visible:z-10 data-[state=open]:bg-accent/60",
          triggerSizeClass[resolvedSize],
          dividerClassByVariant[resolvedVariant],
          className,
        )}
        {...props}
      >
        {icon ?? (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "transition-transform duration-150 data-[state=open]:rotate-180",
              triggerIconSizeClass[resolvedSize],
            )}
          />
        )}
      </Button>
    </DropdownMenuPrimitive.Trigger>
  );
}
SplitButtonTrigger.displayName = "SplitButtonTrigger";

export type SplitButtonContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuContent
>;

function SplitButtonContent({
  align = "end",
  sideOffset = 4,
  className,
  ...props
}: SplitButtonContentProps): ReactElement {
  return (
    <DropdownMenuContent
      align={align}
      sideOffset={sideOffset}
      data-slot="split-button-content"
      className={cn("min-w-[10rem]", className)}
      {...props}
    />
  );
}
SplitButtonContent.displayName = "SplitButtonContent";

export {
  SplitButton,
  SplitButtonAction,
  SplitButtonTrigger,
  SplitButtonContent,
  splitButtonSizeIds,
  splitButtonVariantIds,
};
export type { SplitButtonSize, SplitButtonVariant };
