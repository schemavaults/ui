"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type Ref,
  type ReactElement,
} from "react";

import { cn } from "@/lib/utils";

export const toolbarOrientationIds = [
  "horizontal",
  "vertical",
] as const satisfies readonly string[];
export type ToolbarOrientation = (typeof toolbarOrientationIds)[number];

export const toolbarVariantIds = [
  "default",
  "muted",
  "floating",
  "ghost",
] as const satisfies readonly string[];
export type ToolbarVariant = (typeof toolbarVariantIds)[number];

export const toolbarSizeIds = [
  "sm",
  "default",
  "lg",
] as const satisfies readonly string[];
export type ToolbarSize = (typeof toolbarSizeIds)[number];

const toolbarVariants = cva(
  "flex items-center text-foreground data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
  {
    variants: {
      variant: {
        default: "bg-card border border-border rounded-md shadow-sm",
        muted: "bg-muted/60 border border-border/60 rounded-md",
        floating:
          "bg-card border border-border rounded-lg shadow-lg backdrop-blur",
        ghost: "bg-transparent",
      } satisfies Record<ToolbarVariant, string>,
      size: {
        sm: "gap-0.5 p-1",
        default: "gap-1 p-1.5",
        lg: "gap-1.5 p-2",
      } satisfies Record<ToolbarSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const TOOLBAR_ITEM_SELECTOR =
  '[data-toolbar-item]:not([data-disabled="true"]):not([data-disabled=""])';

interface ToolbarContextValue {
  orientation: ToolbarOrientation;
  size: ToolbarSize;
}

const ToolbarContext = createContext<ToolbarContextValue | null>(null);

function useToolbarContext(component: string): ToolbarContextValue {
  const ctx = useContext(ToolbarContext);
  if (!ctx) {
    throw new Error(`${component} must be rendered inside a <Toolbar>`);
  }
  return ctx;
}

export interface ToolbarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toolbarVariants> {
  orientation?: ToolbarOrientation;
  /**
   * Accessible label for the toolbar. Required by WAI-ARIA when the
   * toolbar contains more than a single meaningful action. Prefer this
   * over `aria-labelledby` when the label isn't already rendered on
   * screen.
   */
  "aria-label"?: string;
  ref?: Ref<HTMLDivElement>;
}

function Toolbar({
  className,
  variant,
  size,
  orientation = "horizontal",
  onKeyDown,
  ref,
  children,
  ...props
}: ToolbarProps): ReactElement {
  const localRef = useRef<HTMLDivElement | null>(null);

  const setRef = useCallback(
    (node: HTMLDivElement | null): void => {
      localRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref && typeof ref === "object") {
        (ref as { current: HTMLDivElement | null }).current = node;
      }
    },
    [ref],
  );

  const getItems = useCallback((): HTMLElement[] => {
    const root = localRef.current;
    if (!root) return [];
    return Array.from(root.querySelectorAll<HTMLElement>(TOOLBAR_ITEM_SELECTOR));
  }, []);

  useEffect(() => {
    const items = getItems();
    if (items.length === 0) return;
    const alreadyFocusable = items.some((item) => item.tabIndex === 0);
    if (alreadyFocusable) return;
    items.forEach((item, index): void => {
      item.tabIndex = index === 0 ? 0 : -1;
    });
  });

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;

    const items = getItems();
    if (items.length === 0) return;

    const isHorizontal =
      (props["aria-orientation"] ?? orientation) === "horizontal";
    const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
    const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";

    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    let targetIndex = -1;

    if (event.key === nextKey) {
      targetIndex =
        currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
    } else if (event.key === prevKey) {
      targetIndex =
        currentIndex === -1
          ? items.length - 1
          : (currentIndex - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = items.length - 1;
    }

    if (targetIndex >= 0) {
      event.preventDefault();
      items[targetIndex]?.focus();
    }
  };

  const handleFocus = (event: ReactFocusEvent<HTMLDivElement>): void => {
    const target = event.target as HTMLElement | null;
    if (!target || !target.hasAttribute("data-toolbar-item")) return;
    const items = getItems();
    if (items.length === 0) return;
    items.forEach((item): void => {
      item.tabIndex = item === target ? 0 : -1;
    });
  };

  return (
    <ToolbarContext.Provider value={{ orientation, size: size ?? "default" }}>
      <div
        ref={setRef}
        role="toolbar"
        aria-orientation={orientation}
        data-slot="toolbar"
        data-orientation={orientation}
        data-variant={variant ?? "default"}
        data-size={size ?? "default"}
        onKeyDown={handleKeyDown}
        onFocusCapture={handleFocus}
        className={cn(toolbarVariants({ variant, size }), className)}
        {...props}
      >
        {children}
      </div>
    </ToolbarContext.Provider>
  );
}
Toolbar.displayName = "Toolbar";

export const toolbarItemVariantIds = [
  "default",
  "primary",
  "destructive",
] as const satisfies readonly string[];
export type ToolbarItemVariant = (typeof toolbarItemVariantIds)[number];

const toolbarItemSizes = {
  sm: "h-7 min-w-7 px-2 text-xs [&_svg]:size-3.5",
  default: "h-8 min-w-8 px-2.5 text-sm [&_svg]:size-4",
  lg: "h-9 min-w-9 px-3 text-sm [&_svg]:size-4",
} satisfies Record<ToolbarSize, string>;

const toolbarItemVariants = cva(
  "inline-flex select-none items-center justify-center gap-1.5 rounded-sm font-medium leading-none whitespace-nowrap outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-foreground hover:bg-accent hover:text-accent-foreground data-[pressed=true]:bg-accent data-[pressed=true]:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
        primary:
          "text-primary hover:bg-primary/10 data-[pressed=true]:bg-primary data-[pressed=true]:text-primary-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
        destructive:
          "text-destructive hover:bg-destructive/10 data-[pressed=true]:bg-destructive data-[pressed=true]:text-destructive-foreground data-[active=true]:bg-destructive data-[active=true]:text-destructive-foreground",
      } satisfies Record<ToolbarItemVariant, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ToolbarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toolbarItemVariants> {
  /**
   * Optional visual/logical "active" state (e.g. the currently-selected
   * tool in an editor). Semantically distinct from a toggle: use
   * `ToolbarToggle` when you need `aria-pressed`.
   */
  active?: boolean;
  /**
   * When true, render the button as the child element (via Radix `Slot`).
   * This is what you use to graft external triggers such as
   * `DropdownMenuTrigger asChild`, `PopoverTrigger asChild`, or
   * `TooltipTrigger asChild` onto a `ToolbarButton` while keeping its
   * roving-tabindex wiring (`data-toolbar-item`) and item styles.
   */
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

function ToolbarButton({
  className,
  variant,
  active,
  disabled,
  type = "button",
  asChild = false,
  ref,
  ...props
}: ToolbarButtonProps): ReactElement {
  const ctx = useToolbarContext("ToolbarButton");
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      type={type}
      disabled={disabled}
      data-toolbar-item=""
      data-slot="toolbar-button"
      data-active={active ? "true" : undefined}
      data-disabled={disabled ? "true" : undefined}
      tabIndex={-1}
      className={cn(
        toolbarItemVariants({ variant }),
        toolbarItemSizes[ctx.size],
        className,
      )}
      {...props}
    />
  );
}
ToolbarButton.displayName = "ToolbarButton";

export interface ToolbarToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof toolbarItemVariants> {
  pressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  /**
   * When true, render the toggle as the child element (via Radix `Slot`).
   * Useful for hanging a `PopoverTrigger asChild` or similar off a
   * pressed-state toolbar item while keeping the toolbar's roving-tabindex
   * wiring intact.
   */
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

function ToolbarToggle({
  className,
  variant,
  pressed = false,
  onPressedChange,
  onClick,
  disabled,
  type = "button",
  asChild = false,
  ref,
  ...props
}: ToolbarToggleProps): ReactElement {
  const ctx = useToolbarContext("ToolbarToggle");
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      type={type}
      disabled={disabled}
      aria-pressed={pressed}
      data-toolbar-item=""
      data-slot="toolbar-toggle"
      data-state={pressed ? "on" : "off"}
      data-pressed={pressed ? "true" : "false"}
      data-disabled={disabled ? "true" : undefined}
      tabIndex={-1}
      onClick={(event): void => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        onPressedChange?.(!pressed);
      }}
      className={cn(
        toolbarItemVariants({ variant }),
        toolbarItemSizes[ctx.size],
        className,
      )}
      {...props}
    />
  );
}
ToolbarToggle.displayName = "ToolbarToggle";

export interface ToolbarLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof toolbarItemVariants> {
  ref?: Ref<HTMLAnchorElement>;
}

function ToolbarLink({
  className,
  variant,
  children,
  ref,
  ...props
}: ToolbarLinkProps): ReactElement {
  const ctx = useToolbarContext("ToolbarLink");
  return (
    <a
      ref={ref}
      data-toolbar-item=""
      data-slot="toolbar-link"
      tabIndex={-1}
      className={cn(
        toolbarItemVariants({ variant }),
        toolbarItemSizes[ctx.size],
        "underline-offset-2 hover:underline",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
ToolbarLink.displayName = "ToolbarLink";

export interface ToolbarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function ToolbarSeparator({
  className,
  ref,
  ...props
}: ToolbarSeparatorProps): ReactElement {
  const ctx = useToolbarContext("ToolbarSeparator");
  const separatorOrientation =
    ctx.orientation === "horizontal" ? "vertical" : "horizontal";
  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation={separatorOrientation}
      data-slot="toolbar-separator"
      data-orientation={separatorOrientation}
      className={cn(
        "shrink-0 bg-border",
        separatorOrientation === "vertical"
          ? "mx-0.5 h-5 w-px"
          : "my-0.5 h-px w-full",
        className,
      )}
      {...props}
    />
  );
}
ToolbarSeparator.displayName = "ToolbarSeparator";

export interface ToolbarGroupProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function ToolbarGroup({
  className,
  ref,
  ...props
}: ToolbarGroupProps): ReactElement {
  const ctx = useToolbarContext("ToolbarGroup");
  return (
    <div
      ref={ref}
      role="group"
      data-slot="toolbar-group"
      data-orientation={ctx.orientation}
      className={cn(
        "flex items-center gap-0.5",
        ctx.orientation === "vertical" && "flex-col items-stretch",
        className,
      )}
      {...props}
    />
  );
}
ToolbarGroup.displayName = "ToolbarGroup";

export interface ToolbarSpacerProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function ToolbarSpacer({
  className,
  ref,
  ...props
}: ToolbarSpacerProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="toolbar-spacer"
      className={cn("flex-1", className)}
      {...props}
    />
  );
}
ToolbarSpacer.displayName = "ToolbarSpacer";

export {
  Toolbar,
  ToolbarButton,
  ToolbarToggle,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarGroup,
  ToolbarSpacer,
  toolbarVariants,
  toolbarItemVariants,
};
