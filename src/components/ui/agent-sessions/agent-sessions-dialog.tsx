"use client";

import {
  useCallback,
  useMemo,
  useRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "../button/button";
import {
  AgentSessionsDialogContext,
  type AgentSessionsDialogContextValue,
} from "./agent-sessions-dialog-context";
import { mergeRefs } from "./merge-refs";

export const agentSessionsDialogPlacementIds = [
  "center",
  "bottom-right",
  "bottom-left",
  "fullscreen",
] as const satisfies readonly string[];

/**
 * Where the dialog opens. `center` is a large modal; `bottom-right` and
 * `bottom-left` are a chat-widget panel that opens just above a
 * `FloatingActionButton` in that corner; `fullscreen` covers the viewport.
 * Every placement goes full-screen below the `sm` breakpoint.
 */
export type AgentSessionsDialogPlacementId =
  (typeof agentSessionsDialogPlacementIds)[number];

const agentSessionsDialogContentVariants = cva(
  "fixed z-50 flex overflow-hidden border bg-background text-foreground shadow-2xl outline-none duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none max-sm:inset-0 max-sm:h-auto max-sm:w-auto max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:border-0",
  {
    variants: {
      placement: {
        center:
          "left-1/2 top-1/2 h-[min(46rem,calc(100dvh_-_2rem))] w-[min(64rem,calc(100vw_-_2rem))] -translate-x-1/2 -translate-y-1/2 rounded-xl data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:data-[state=closed]:slide-out-to-left-1/2 sm:data-[state=closed]:slide-out-to-top-[48%] sm:data-[state=open]:slide-in-from-left-1/2 sm:data-[state=open]:slide-in-from-top-[48%]",
        "bottom-right":
          "bottom-24 right-6 h-[min(40rem,calc(100dvh_-_8rem))] w-[min(28rem,calc(100vw_-_3rem))] origin-bottom-right rounded-xl data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4",
        "bottom-left":
          "bottom-24 left-6 h-[min(40rem,calc(100dvh_-_8rem))] w-[min(28rem,calc(100vw_-_3rem))] origin-bottom-left rounded-xl data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-4 data-[state=open]:slide-in-from-bottom-4",
        fullscreen: "inset-0 rounded-none border-0",
      } satisfies Record<AgentSessionsDialogPlacementId, string>,
    },
    defaultVariants: {
      placement: "center",
    },
  },
);

const agentSessionsDialogOverlayVariants = cva(
  "fixed inset-0 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 motion-reduce:animate-none",
  {
    variants: {
      placement: {
        center: "bg-black/60",
        "bottom-right": "bg-black/20",
        "bottom-left": "bg-black/20",
        fullscreen: "bg-black/60",
      } satisfies Record<AgentSessionsDialogPlacementId, string>,
    },
    defaultVariants: {
      placement: "center",
    },
  },
);

/* ------------------------------------------------------------------ */
/* Root & trigger                                                     */
/* ------------------------------------------------------------------ */

export type AgentSessionsDialogProps = ComponentProps<typeof DialogPrimitive.Root>;

/** The dialog's root: holds `open` / `onOpenChange` (controlled or not). */
function AgentSessionsDialog(props: AgentSessionsDialogProps): ReactElement {
  return <DialogPrimitive.Root {...props} />;
}
AgentSessionsDialog.displayName = "AgentSessionsDialog";

export type AgentSessionsDialogTriggerProps = ComponentProps<
  typeof DialogPrimitive.Trigger
>;

/**
 * Opens the dialog. Use `asChild` to make a `FloatingActionButton` (or any
 * button) the trigger.
 */
function AgentSessionsDialogTrigger(
  props: AgentSessionsDialogTriggerProps,
): ReactElement {
  return (
    <DialogPrimitive.Trigger data-slot="agent-sessions-dialog-trigger" {...props} />
  );
}
AgentSessionsDialogTrigger.displayName = "AgentSessionsDialogTrigger";

/* ------------------------------------------------------------------ */
/* AgentSessionsDialogContent                                         */
/* ------------------------------------------------------------------ */

export interface AgentSessionsDialogContentProps
  extends Omit<ComponentPropsWithoutRef<typeof DialogPrimitive.Content>, "title"> {
  /** The dialog's accessible name (visually hidden). Default: "Agent sessions". */
  title?: ReactNode;
  /** The dialog's accessible description (visually hidden). */
  description?: ReactNode;
  /** Where the dialog opens. Default: `center`. */
  placement?: AgentSessionsDialogPlacementId;
  /** Class for the backdrop. */
  overlayClassName?: string;
  ref?: Ref<HTMLDivElement>;
}

/**
 * The dialog surface to put an `<AgentSessions>` in. Sized for it, with a
 * visually hidden title and no built-in close button — an
 * `<AgentSessionsHeader>` inside it adds an `<AgentSessionsDialogClose>`
 * itself. On open it focuses the prompt textarea, and Escape first closes
 * the overlay sidebar, if open, before it closes the dialog.
 */
function AgentSessionsDialogContent({
  title = "Agent sessions",
  description,
  placement = "center",
  className,
  overlayClassName,
  children,
  onEscapeKeyDown,
  onOpenAutoFocus,
  ref,
  ...props
}: AgentSessionsDialogContentProps): ReactElement {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const mergedRef = useMemo(
    () => mergeRefs<HTMLDivElement>(contentRef, ref),
    [ref],
  );

  const escapeHandlersRef = useRef<Set<() => boolean>>(new Set());
  const dialogContext = useMemo<AgentSessionsDialogContextValue>(
    () => ({
      registerEscapeHandler: (handler: () => boolean): (() => void) => {
        escapeHandlersRef.current.add(handler);
        return (): void => {
          escapeHandlersRef.current.delete(handler);
        };
      },
    }),
    [],
  );

  const handleEscapeKeyDown = useCallback(
    (event: KeyboardEvent): void => {
      onEscapeKeyDown?.(event);
      if (event.defaultPrevented) return;
      for (const handler of escapeHandlersRef.current) {
        if (handler()) {
          event.preventDefault();
          return;
        }
      }
    },
    [onEscapeKeyDown],
  );

  // Land in the prompt, which is what someone opening an assistant wants;
  // Radix would otherwise focus the first button (the sidebar toggle).
  const handleOpenAutoFocus = useCallback(
    (event: Event): void => {
      onOpenAutoFocus?.(event);
      if (event.defaultPrevented) return;
      const textarea: HTMLTextAreaElement | null | undefined =
        contentRef.current?.querySelector<HTMLTextAreaElement>(
          'textarea[data-slot="prompt-input-textarea"]:not(:disabled)',
        );
      if (textarea) {
        event.preventDefault();
        textarea.focus({ preventScroll: true });
      }
    },
    [onOpenAutoFocus],
  );

  // Radix warns about a dialog with no description unless
  // `aria-describedby` is explicitly undefined.
  const describedBy: { "aria-describedby"?: undefined } =
    description === undefined ? { "aria-describedby": undefined } : {};

  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="agent-sessions-dialog-overlay"
        className={cn(
          agentSessionsDialogOverlayVariants({ placement }),
          overlayClassName,
        )}
      />
      <DialogPrimitive.Content
        ref={mergedRef}
        data-slot="agent-sessions-dialog-content"
        data-placement={placement}
        {...describedBy}
        onEscapeKeyDown={handleEscapeKeyDown}
        onOpenAutoFocus={handleOpenAutoFocus}
        className={cn(agentSessionsDialogContentVariants({ placement }), className)}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
        {description !== undefined ? (
          <DialogPrimitive.Description className="sr-only">
            {description}
          </DialogPrimitive.Description>
        ) : null}
        <AgentSessionsDialogContext.Provider value={dialogContext}>
          {children}
        </AgentSessionsDialogContext.Provider>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
AgentSessionsDialogContent.displayName = "AgentSessionsDialogContent";

/* ------------------------------------------------------------------ */
/* AgentSessionsDialogClose                                           */
/* ------------------------------------------------------------------ */

export interface AgentSessionsDialogCloseProps extends ButtonProps {
  /** Default: "Close". */
  "aria-label"?: string;
}

/**
 * An icon button that closes the dialog. `<AgentSessionsHeader>` renders
 * one at its end by default; place your own anywhere else in the dialog.
 */
function AgentSessionsDialogClose({
  className,
  children,
  variant = "ghost",
  size = "icon",
  "aria-label": ariaLabel = "Close",
  ...props
}: AgentSessionsDialogCloseProps): ReactElement {
  return (
    <DialogPrimitive.Close asChild>
      <Button
        type="button"
        variant={variant}
        size={size}
        data-slot="agent-sessions-dialog-close"
        aria-label={ariaLabel}
        className={cn(size === "icon" && "h-8 w-8 shrink-0", className)}
        {...props}
      >
        {children ?? <X aria-hidden="true" className="size-4" />}
      </Button>
    </DialogPrimitive.Close>
  );
}
AgentSessionsDialogClose.displayName = "AgentSessionsDialogClose";

export {
  AgentSessionsDialog,
  AgentSessionsDialogTrigger,
  AgentSessionsDialogContent,
  AgentSessionsDialogClose,
};
