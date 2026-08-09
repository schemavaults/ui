"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Info,
  Loader2,
  TriangleAlert,
} from "lucide-react";
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
import { buttonVariants } from "../button";

/**
 * Tone drives the accent styling of the optional leading icon and the default
 * styling of {@link PopconfirmAction}. Destructive confirmations (e.g. remove
 * a tag, delete a row) should use the `destructive` tone so the confirm button
 * is unmistakably risky.
 */
export const popconfirmToneIds = [
  "default",
  "destructive",
  "warning",
  "success",
  "info",
] as const satisfies readonly string[];
export type PopconfirmToneId = (typeof popconfirmToneIds)[number];

interface PopconfirmContextValue {
  tone: PopconfirmToneId;
}

const PopconfirmContext = createContext<PopconfirmContextValue>({
  tone: "default",
});

function usePopconfirmTone(): PopconfirmToneId {
  return useContext(PopconfirmContext).tone;
}

/**
 * Inline confirmation popover for lightweight, easily-recoverable actions
 * (removing a row, discarding an unsaved draft, revoking an API key preview).
 * Prefer {@link AlertDialog} for consequential, hard-to-recover confirmations —
 * Popconfirm is a smaller, less-interrupting UI that anchors to the trigger.
 */
const Popconfirm = PopoverPrimitive.Root;

const PopconfirmTrigger = PopoverPrimitive.Trigger;

const PopconfirmPortal = PopoverPrimitive.Portal;

const PopconfirmAnchor = PopoverPrimitive.Anchor;

export interface PopconfirmContentProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  /** Accent tone shared with the icon and default action button. */
  tone?: PopconfirmToneId;
}

function PopconfirmContent({
  className,
  align = "center",
  sideOffset = 6,
  tone = "default",
  children,
  ...props
}: PopconfirmContentProps): ReactElement {
  return (
    <PopconfirmContext.Provider value={{ tone }}>
      <PopconfirmPortal>
        <PopoverPrimitive.Content
          role="alertdialog"
          data-slot="popconfirm-content"
          data-tone={tone}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 w-72 rounded-md border bg-popover p-3 text-popover-foreground shadow-md outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          {...props}
        >
          {children}
        </PopoverPrimitive.Content>
      </PopconfirmPortal>
    </PopconfirmContext.Provider>
  );
}
PopconfirmContent.displayName = "PopconfirmContent";

function PopconfirmHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): ReactElement {
  return (
    <div
      data-slot="popconfirm-header"
      className={cn("flex items-start gap-2.5", className)}
      {...props}
    />
  );
}
PopconfirmHeader.displayName = "PopconfirmHeader";

function PopconfirmBody({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): ReactElement {
  return (
    <div
      data-slot="popconfirm-body"
      className={cn("flex min-w-0 flex-1 flex-col gap-1", className)}
      {...props}
    />
  );
}
PopconfirmBody.displayName = "PopconfirmBody";

const popconfirmIconVariants = cva(
  "flex size-6 shrink-0 items-center justify-center rounded-full [&>svg]:size-4",
  {
    variants: {
      tone: {
        default: "bg-muted text-muted-foreground",
        destructive: "bg-destructive/15 text-destructive",
        warning: "bg-warning/20 text-warning-foreground",
        success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        info: "bg-schemavaults-brand-blue/15 text-schemavaults-brand-blue",
      } satisfies Record<PopconfirmToneId, string>,
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

const toneIcons = {
  default: HelpCircle,
  destructive: TriangleAlert,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
} satisfies Record<PopconfirmToneId, typeof HelpCircle>;

export interface PopconfirmIconProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof popconfirmIconVariants> {
  /** Override the auto-selected tone icon with a custom node. */
  children?: ReactNode;
}

/**
 * Optional themed leading icon. When no `children` are provided a sensible icon
 * is chosen from the surrounding {@link PopconfirmContent} tone.
 */
function PopconfirmIcon({
  className,
  tone: toneProp,
  children,
  ...props
}: PopconfirmIconProps): ReactElement {
  const contextTone = usePopconfirmTone();
  const tone = toneProp ?? contextTone;
  const FallbackIcon = toneIcons[tone];
  return (
    <span
      aria-hidden="true"
      data-slot="popconfirm-icon"
      className={cn(popconfirmIconVariants({ tone }), className)}
      {...props}
    >
      {children ?? <FallbackIcon />}
    </span>
  );
}
PopconfirmIcon.displayName = "PopconfirmIcon";

function PopconfirmTitle({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>): ReactElement {
  return (
    <p
      data-slot="popconfirm-title"
      className={cn(
        "text-sm font-semibold leading-tight text-foreground",
        className,
      )}
      {...props}
    />
  );
}
PopconfirmTitle.displayName = "PopconfirmTitle";

function PopconfirmDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>): ReactElement {
  return (
    <p
      data-slot="popconfirm-description"
      className={cn(
        "text-xs leading-snug text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
PopconfirmDescription.displayName = "PopconfirmDescription";

function PopconfirmFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): ReactElement {
  return (
    <div
      data-slot="popconfirm-footer"
      className={cn(
        "mt-3 flex flex-row items-center justify-end gap-2",
        className,
      )}
      {...props}
    />
  );
}
PopconfirmFooter.displayName = "PopconfirmFooter";

const popconfirmActionVariants = cva("", {
  variants: {
    tone: {
      default: "",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      warning: "bg-warning text-warning-foreground hover:bg-warning/90",
      success:
        "bg-emerald-600 text-white hover:bg-emerald-600/90 dark:bg-emerald-500 dark:hover:bg-emerald-500/90",
      info: "bg-schemavaults-brand-blue text-primary-foreground hover:bg-schemavaults-brand-blue/90",
    } satisfies Record<PopconfirmToneId, string>,
  },
  defaultVariants: {
    tone: "default",
  },
});

export interface PopconfirmActionProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * When true, disable the button and render a spinner alongside the label.
   * Also short-circuits the auto-close behaviour so the popover stays open
   * while an async confirm handler is in flight — pair with controlled
   * `open`/`onOpenChange` on {@link Popconfirm} and close it yourself when
   * the request resolves.
   */
  loading?: boolean;
  /**
   * Override the tone inherited from {@link PopconfirmContent}. Usually you
   * should set the tone on the content instead so the icon matches.
   */
  tone?: PopconfirmToneId;
  ref?: Ref<HTMLButtonElement>;
}

/**
 * The confirm button. Inherits its accent from the surrounding
 * {@link PopconfirmContent} tone (e.g. a `destructive` tone yields a red
 * confirm button). Closes the popover on click by default; when `loading` is
 * true the popover stays open so async confirm handlers can complete before
 * the caller closes it via controlled state.
 */
function PopconfirmAction({
  className,
  tone: toneProp,
  loading = false,
  disabled,
  children,
  type = "button",
  ref,
  ...props
}: PopconfirmActionProps): ReactElement {
  const contextTone = usePopconfirmTone();
  const tone = toneProp ?? contextTone;
  const classNames = cn(
    buttonVariants({ variant: "default", size: "sm" }),
    popconfirmActionVariants({ tone }),
    "min-w-16 gap-1.5",
    className,
  );
  const content = loading ? (
    <>
      <Loader2 aria-hidden="true" className="size-3.5 animate-spin" />
      <span>{children}</span>
    </>
  ) : (
    children
  );

  if (loading) {
    return (
      <button
        ref={ref}
        data-slot="popconfirm-action"
        data-tone={tone}
        data-loading=""
        type={type}
        disabled={disabled ?? true}
        className={classNames}
        {...props}
      >
        {content}
      </button>
    );
  }

  return (
    <PopoverPrimitive.Close
      ref={ref}
      data-slot="popconfirm-action"
      data-tone={tone}
      type={type}
      disabled={disabled}
      className={classNames}
      {...props}
    >
      {content}
    </PopoverPrimitive.Close>
  );
}
PopconfirmAction.displayName = "PopconfirmAction";

export interface PopconfirmCancelProps
  extends ComponentPropsWithoutRef<typeof PopoverPrimitive.Close> {}

/**
 * The dismiss button. Closes the popover without performing the action. Is the
 * initially-focused element when the popover opens, so pressing Enter on the
 * default focus is always safe.
 */
function PopconfirmCancel({
  className,
  ...props
}: PopconfirmCancelProps): ReactElement {
  return (
    <PopoverPrimitive.Close
      data-slot="popconfirm-cancel"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "min-w-16",
        className,
      )}
      {...props}
    />
  );
}
PopconfirmCancel.displayName = "PopconfirmCancel";

export {
  Popconfirm,
  PopconfirmAnchor,
  PopconfirmTrigger,
  PopconfirmPortal,
  PopconfirmContent,
  PopconfirmHeader,
  PopconfirmBody,
  PopconfirmIcon,
  PopconfirmTitle,
  PopconfirmDescription,
  PopconfirmFooter,
  PopconfirmAction,
  PopconfirmCancel,
  popconfirmIconVariants,
  popconfirmActionVariants,
};
