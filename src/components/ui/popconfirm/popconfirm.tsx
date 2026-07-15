"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertTriangle,
  HelpCircle,
  Info,
  OctagonAlert,
} from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent as ReactMouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import { Button, type ButtonVariantId } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export const popconfirmIntentIds = [
  "info",
  "question",
  "warning",
  "danger",
] as const satisfies readonly string[];
export type PopconfirmIntentId = (typeof popconfirmIntentIds)[number];

const popconfirmContentVariants = cva(
  "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      intent: {
        info: "[--popconfirm-color:hsl(217_91%_60%)]",
        question: "[--popconfirm-color:hsl(var(--muted-foreground))]",
        warning: "[--popconfirm-color:hsl(var(--warning))]",
        danger: "[--popconfirm-color:hsl(var(--destructive))]",
      } satisfies Record<PopconfirmIntentId, string>,
    },
    defaultVariants: {
      intent: "question",
    },
  },
);

const defaultIntentIcons: Record<PopconfirmIntentId, ReactNode> = {
  info: <Info aria-hidden className="size-4" />,
  question: <HelpCircle aria-hidden className="size-4" />,
  warning: <AlertTriangle aria-hidden className="size-4" />,
  danger: <OctagonAlert aria-hidden className="size-4" />,
};

const defaultConfirmVariant: Record<PopconfirmIntentId, ButtonVariantId> = {
  info: "default",
  question: "default",
  warning: "default",
  danger: "destructive",
};

interface PopconfirmContextValue {
  setOpen: (open: boolean) => void;
}

const PopconfirmContext = createContext<PopconfirmContextValue | null>(null);

export interface PopconfirmProps
  extends Omit<
    ComponentProps<typeof PopoverPrimitive.Root>,
    "open" | "onOpenChange" | "defaultOpen"
  > {
  /**
   * Controlled open state. When set, `onOpenChange` should be provided too.
   */
  open?: boolean;
  /**
   * Called when the open state changes (user opens the popover, cancels,
   * confirms, or presses Escape).
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Uncontrolled initial open state. Defaults to `false`.
   */
  defaultOpen?: boolean;
}

function Popconfirm({
  open: openProp,
  onOpenChange,
  defaultOpen = false,
  children,
  ...props
}: PopconfirmProps): ReactElement {
  const isControlled: boolean = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState<boolean>(defaultOpen);
  const currentOpen: boolean = isControlled ? (openProp as boolean) : internalOpen;

  const setOpen = useCallback(
    (next: boolean): void => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const contextValue = useMemo<PopconfirmContextValue>(
    (): PopconfirmContextValue => ({ setOpen }),
    [setOpen],
  );

  return (
    <PopconfirmContext.Provider value={contextValue}>
      <PopoverPrimitive.Root
        open={currentOpen}
        onOpenChange={setOpen}
        {...props}
      >
        {children}
      </PopoverPrimitive.Root>
    </PopconfirmContext.Provider>
  );
}
Popconfirm.displayName = "Popconfirm";

export interface PopconfirmTriggerProps
  extends ComponentProps<typeof PopoverPrimitive.Trigger> {
  ref?: Ref<HTMLButtonElement>;
}

const PopconfirmTrigger = PopoverPrimitive.Trigger;

export interface PopconfirmAnchorProps
  extends ComponentProps<typeof PopoverPrimitive.Anchor> {}

const PopconfirmAnchor = PopoverPrimitive.Anchor;

export interface PopconfirmContentProps
  extends Omit<ComponentProps<typeof PopoverPrimitive.Content>, "title">,
    VariantProps<typeof popconfirmContentVariants> {
  /** Headline for the confirmation, rendered next to the intent icon. */
  title?: ReactNode;
  /** Optional supporting copy shown beneath the title. */
  description?: ReactNode;
  /** Label for the confirm action. Defaults to "Confirm". */
  confirmLabel?: ReactNode;
  /** Label for the cancel action. Defaults to "Cancel". */
  cancelLabel?: ReactNode;
  /**
   * Called when the user clicks the confirm button. May return a promise; if
   * it does, the confirm button shows a spinner until it settles. The popover
   * closes on resolution; on rejection it stays open so the caller can surface
   * an error state.
   */
  onConfirm?: () => void | Promise<void>;
  /**
   * Called when the user clicks the cancel button. The popover closes
   * regardless.
   */
  onCancel?: () => void;
  /**
   * Override the button variant for the confirm action. Defaults to
   * `destructive` when `intent="danger"`, otherwise `default`.
   */
  confirmButtonVariant?: ButtonVariantId;
  /** Override the button variant for the cancel action. Defaults to `ghost`. */
  cancelButtonVariant?: ButtonVariantId;
  /** Override the icon shown next to the title. Pass `null` to hide it. */
  icon?: ReactNode | null;
  /** When true, disables the confirm button. */
  confirmDisabled?: boolean;
  /**
   * Force the confirm button into a loading state. When `onConfirm` returns a
   * promise the loading state is managed automatically.
   */
  loading?: boolean;
}

function PopconfirmContent({
  className,
  align = "center",
  sideOffset = 4,
  intent,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  confirmButtonVariant,
  cancelButtonVariant = "ghost",
  icon,
  confirmDisabled = false,
  loading = false,
  children,
  ...props
}: PopconfirmContentProps): ReactElement {
  const ctx = useContext(PopconfirmContext);
  const resolvedIntent: PopconfirmIntentId = intent ?? "question";
  const resolvedIcon: ReactNode =
    icon === null ? null : icon ?? defaultIntentIcons[resolvedIntent];
  const resolvedConfirmVariant: ButtonVariantId =
    confirmButtonVariant ?? defaultConfirmVariant[resolvedIntent];

  const [pending, setPending] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(true);
  useEffect((): (() => void) => {
    mountedRef.current = true;
    return (): void => {
      mountedRef.current = false;
    };
  }, []);

  const isBusy: boolean = loading || pending;

  const closePopover = useCallback((): void => {
    ctx?.setOpen(false);
  }, [ctx]);

  const handleCancel = useCallback(
    (event: ReactMouseEvent<HTMLButtonElement>): void => {
      if (event.defaultPrevented) return;
      onCancel?.();
      closePopover();
    },
    [onCancel, closePopover],
  );

  const handleConfirm = useCallback(
    async (event: ReactMouseEvent<HTMLButtonElement>): Promise<void> => {
      if (event.defaultPrevented) return;

      const result: void | Promise<void> = onConfirm?.();
      if (result instanceof Promise) {
        setPending(true);
        try {
          await result;
          closePopover();
        } catch {
          // Leave the popover open so the caller can surface the error state.
        } finally {
          if (mountedRef.current) setPending(false);
        }
        return;
      }
      closePopover();
    },
    [onConfirm, closePopover],
  );

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        align={align}
        sideOffset={sideOffset}
        data-slot="popconfirm-content"
        data-intent={resolvedIntent}
        className={cn(
          popconfirmContentVariants({ intent: resolvedIntent }),
          className,
        )}
        onOpenAutoFocus={(event): void => {
          event.preventDefault();
        }}
        {...props}
      >
        <div className="flex flex-col gap-3">
          {(title !== undefined || resolvedIcon !== null) && (
            <div className="flex items-start gap-2">
              {resolvedIcon !== null && (
                <span
                  aria-hidden
                  className="mt-0.5 shrink-0 text-[var(--popconfirm-color)]"
                >
                  {resolvedIcon}
                </span>
              )}
              {title !== undefined && (
                <div className="min-w-0 flex-1 text-sm font-semibold leading-snug text-foreground">
                  {title}
                </div>
              )}
            </div>
          )}
          {description !== undefined && (
            <div className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </div>
          )}
          {children !== undefined && (
            <div className="text-sm text-foreground">{children}</div>
          )}
          <div className="mt-1 flex items-center justify-end gap-2">
            <Button
              type="button"
              size="sm"
              variant={cancelButtonVariant}
              disabled={isBusy}
              onClick={handleCancel}
              data-slot="popconfirm-cancel"
            >
              {cancelLabel}
            </Button>
            <Button
              type="button"
              size="sm"
              variant={resolvedConfirmVariant}
              disabled={confirmDisabled || isBusy}
              onClick={handleConfirm}
              data-slot="popconfirm-confirm"
              data-loading={isBusy ? "true" : "false"}
              className="min-w-[4.5rem]"
            >
              {isBusy ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner size="xs" variant="muted" aria-hidden />
                  <span>{confirmLabel}</span>
                </span>
              ) : (
                confirmLabel
              )}
            </Button>
          </div>
        </div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
PopconfirmContent.displayName = "PopconfirmContent";

export {
  Popconfirm,
  PopconfirmTrigger,
  PopconfirmAnchor,
  PopconfirmContent,
  popconfirmContentVariants,
};
