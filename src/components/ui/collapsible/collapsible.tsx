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
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { ChevronDown } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "@/framer-motion";
import {
  collapsibleContentInnerVariants,
  collapsibleRootVariants,
  collapsibleTriggerVariants,
  type CollapsibleSizeId,
  type CollapsibleVariantId,
} from "./collapsible-variants";

interface CollapsibleContextValue {
  open: boolean;
  disabled: boolean;
  contentId: string;
  triggerId: string;
  variant: CollapsibleVariantId;
  size: CollapsibleSizeId;
  toggle: () => void;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext(componentName: string): CollapsibleContextValue {
  const ctx = useContext(CollapsibleContext);
  if (ctx === null) {
    throw new Error(
      `<${componentName}> must be rendered inside a <Collapsible> root.`,
    );
  }
  return ctx;
}

export interface CollapsibleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof collapsibleRootVariants> {
  /** Controlled open state. */
  open?: boolean;
  /** Initial open state when uncontrolled. */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Disable the trigger interaction. */
  disabled?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function Collapsible({
  className,
  variant,
  size,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  ref,
  ...props
}: CollapsibleProps): ReactElement {
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const isControlled = openProp !== undefined;
  const open = isControlled ? openProp : internalOpen;

  const reactId = useId();
  const triggerId = `collapsible-trigger-${reactId}`;
  const contentId = `collapsible-content-${reactId}`;

  const resolvedVariant: CollapsibleVariantId = variant ?? "default";
  const resolvedSize: CollapsibleSizeId = size ?? "md";

  const toggle = useCallback((): void => {
    if (disabled) return;
    const next = !open;
    if (!isControlled) {
      setInternalOpen(next);
    }
    onOpenChange?.(next);
  }, [disabled, open, isControlled, onOpenChange]);

  const ctx = useMemo<CollapsibleContextValue>(
    () => ({
      open,
      disabled,
      contentId,
      triggerId,
      variant: resolvedVariant,
      size: resolvedSize,
      toggle,
    }),
    [open, disabled, contentId, triggerId, resolvedVariant, resolvedSize, toggle],
  );

  return (
    <CollapsibleContext.Provider value={ctx}>
      <div
        ref={ref}
        data-slot="collapsible"
        data-state={open ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        className={cn(
          collapsibleRootVariants({ variant: resolvedVariant, size: resolvedSize }),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}
Collapsible.displayName = "Collapsible";

export interface CollapsibleTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Hide the chevron icon on the right. */
  hideIcon?: boolean;
  /** Replace the default chevron with a custom icon. */
  icon?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

function CollapsibleTrigger({
  className,
  children,
  hideIcon = false,
  icon,
  onClick,
  type,
  disabled: disabledProp,
  ref,
  ...props
}: CollapsibleTriggerProps): ReactElement {
  const { open, toggle, disabled, contentId, triggerId, variant, size } =
    useCollapsibleContext("CollapsibleTrigger");

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      toggle();
    },
    [onClick, toggle],
  );

  const isDisabled = Boolean(disabledProp) || disabled;

  return (
    <button
      ref={ref}
      id={triggerId}
      type={type ?? "button"}
      data-slot="collapsible-trigger"
      data-state={open ? "open" : "closed"}
      aria-expanded={open}
      aria-controls={contentId}
      disabled={isDisabled}
      onClick={handleClick}
      className={cn(collapsibleTriggerVariants({ variant, size }), className)}
      {...props}
    >
      <span className="flex-1 text-left">{children}</span>
      {hideIcon ? null : (
        <span
          aria-hidden
          className={cn(
            "inline-flex shrink-0 transition-transform duration-200",
            open ? "rotate-180" : "rotate-0",
          )}
        >
          {icon ?? <ChevronDown />}
        </span>
      )}
    </button>
  );
}
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
  /** When true, content stays mounted while closed (useful for forms). */
  forceMount?: boolean;
  ref?: Ref<HTMLDivElement>;
}

function CollapsibleContent({
  className,
  children,
  forceMount = false,
  ref,
  ...props
}: CollapsibleContentProps): ReactElement {
  const { open, contentId, triggerId, variant, size } =
    useCollapsibleContext("CollapsibleContent");

  if (forceMount) {
    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        data-slot="collapsible-content"
        data-state={open ? "open" : "closed"}
        className={cn("overflow-hidden", className)}
        {...props}
      >
        <div className={cn(collapsibleContentInnerVariants({ variant, size }))}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <m.div
          key="collapsible-content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{
            height: { duration: 0.22, ease: [0.4, 0, 0.2, 1] },
            opacity: { duration: 0.18, ease: "easeOut" },
          }}
          className="overflow-hidden"
        >
          <div
            ref={ref}
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            data-slot="collapsible-content"
            data-state="open"
            className={className}
            {...props}
          >
            <div className={cn(collapsibleContentInnerVariants({ variant, size }))}>
              {children}
            </div>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
CollapsibleContent.displayName = "CollapsibleContent";

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  collapsibleRootVariants,
  collapsibleTriggerVariants,
  collapsibleContentInnerVariants,
};
export {
  collapsibleVariantIds,
  collapsibleSizeIds,
  type CollapsibleVariantId,
  type CollapsibleSizeId,
} from "./collapsible-variants";
