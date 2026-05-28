"use client";

import {
  createContext,
  useContext,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cva, type VariantProps } from "class-variance-authority";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  TriangleAlert,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "../button";

/**
 * Tone drives the accent styling of the optional leading icon and the default
 * styling of {@link AlertDialogAction}. Destructive confirmations (e.g. delete)
 * should use the `destructive` tone so the confirm button is unmistakably risky.
 */
export const alertDialogToneIds = [
  "default",
  "destructive",
  "warning",
  "success",
  "info",
] as const satisfies readonly string[];
export type AlertDialogToneId = (typeof alertDialogToneIds)[number];

interface AlertDialogContextValue {
  tone: AlertDialogToneId;
}

const AlertDialogContext = createContext<AlertDialogContextValue>({
  tone: "default",
});

function useAlertDialogTone(): AlertDialogToneId {
  return useContext(AlertDialogContext).tone;
}

/**
 * Root of the alert dialog. A modal, focus-trapped dialog that interrupts the
 * user to confirm a consequential action. Unlike {@link Dialog}, it renders
 * with `role="alertdialog"`, omits the corner close button, and does not
 * dismiss on an outside click — the user must pick an explicit action.
 */
const AlertDialog = DialogPrimitive.Root;

const AlertDialogTrigger = DialogPrimitive.Trigger;

const AlertDialogPortal = DialogPrimitive.Portal;

const AlertDialogOverlay = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>): ReactElement => (
  <DialogPrimitive.Overlay
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    {...props}
  />
);
AlertDialogOverlay.displayName = "AlertDialogOverlay";

export interface AlertDialogContentProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  /** Accent tone shared with the icon and default action button. */
  tone?: AlertDialogToneId;
}

const AlertDialogContent = ({
  className,
  children,
  tone = "default",
  onInteractOutside,
  ...props
}: AlertDialogContentProps): ReactElement => (
  <AlertDialogContext.Provider value={{ tone }}>
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <DialogPrimitive.Content
        role="alertdialog"
        onInteractOutside={(event): void => {
          // Require an explicit choice — never dismiss on outside click.
          event.preventDefault();
          onInteractOutside?.(event);
        }}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className,
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </AlertDialogPortal>
  </AlertDialogContext.Provider>
);
AlertDialogContent.displayName = "AlertDialogContent";

const AlertDialogHeader = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): ReactElement => (
  <div
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
);
AlertDialogHeader.displayName = "AlertDialogHeader";

const AlertDialogFooter = ({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>): ReactElement => (
  <div
    className={cn(
      "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2",
      className,
    )}
    {...props}
  />
);
AlertDialogFooter.displayName = "AlertDialogFooter";

const AlertDialogTitle = ({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DialogPrimitive.Title>): ReactElement => (
  <DialogPrimitive.Title
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
);
AlertDialogTitle.displayName = "AlertDialogTitle";

const AlertDialogDescription = ({
  className,
  ...props
}: ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>): ReactElement => (
  <DialogPrimitive.Description
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);
AlertDialogDescription.displayName = "AlertDialogDescription";

const alertDialogIconVariants = cva(
  "mx-auto flex size-11 shrink-0 items-center justify-center rounded-full sm:mx-0 [&>svg]:size-5",
  {
    variants: {
      tone: {
        default: "bg-muted text-foreground",
        destructive: "bg-destructive/15 text-destructive",
        warning: "bg-warning/20 text-warning-foreground",
        success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        info: "bg-schemavaults-brand-blue/15 text-schemavaults-brand-blue",
      } satisfies Record<AlertDialogToneId, string>,
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

const toneIcons = {
  default: Info,
  destructive: TriangleAlert,
  warning: AlertTriangle,
  success: CheckCircle2,
  info: Info,
} satisfies Record<AlertDialogToneId, typeof Info>;

export interface AlertDialogIconProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children">,
    VariantProps<typeof alertDialogIconVariants> {
  /** Override the auto-selected tone icon with a custom node. */
  children?: ReactNode;
}

/**
 * Optional themed icon for the header. When no `children` are provided, a
 * sensible icon is chosen from the surrounding {@link AlertDialogContent} tone.
 */
const AlertDialogIcon = ({
  className,
  tone: toneProp,
  children,
  ...props
}: AlertDialogIconProps): ReactElement => {
  const contextTone = useAlertDialogTone();
  const tone = toneProp ?? contextTone;
  const FallbackIcon = toneIcons[tone];

  return (
    <span
      aria-hidden="true"
      data-slot="alert-dialog-icon"
      className={cn(alertDialogIconVariants({ tone }), className)}
      {...props}
    >
      {children ?? <FallbackIcon />}
    </span>
  );
};
AlertDialogIcon.displayName = "AlertDialogIcon";

const alertDialogActionVariants = cva("", {
  variants: {
    tone: {
      default: "",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      warning: "bg-warning text-warning-foreground hover:bg-warning/90",
      success:
        "bg-emerald-600 text-white hover:bg-emerald-600/90 dark:bg-emerald-500 dark:hover:bg-emerald-500/90",
      info: "bg-schemavaults-brand-blue text-primary-foreground hover:bg-schemavaults-brand-blue/90",
    } satisfies Record<AlertDialogToneId, string>,
  },
  defaultVariants: {
    tone: "default",
  },
});

export interface AlertDialogActionProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {}

/**
 * The confirm button. Clicking it runs the supplied `onClick` and then closes
 * the dialog. By default it inherits the surrounding tone (e.g. a `destructive`
 * tone yields a red confirm button); pass your own `className` to override.
 */
const AlertDialogAction = ({
  className,
  ...props
}: AlertDialogActionProps): ReactElement => {
  const tone = useAlertDialogTone();
  return (
    <DialogPrimitive.Close
      data-slot="alert-dialog-action"
      className={cn(
        buttonVariants({ variant: "default" }),
        alertDialogActionVariants({ tone }),
        className,
      )}
      {...props}
    />
  );
};
AlertDialogAction.displayName = "AlertDialogAction";

export interface AlertDialogCancelProps
  extends ComponentPropsWithoutRef<typeof DialogPrimitive.Close> {}

/**
 * The dismiss button. Closes the dialog without performing the action and is
 * the focused element when the dialog opens, so pressing Enter is always safe.
 */
const AlertDialogCancel = ({
  className,
  ...props
}: AlertDialogCancelProps): ReactElement => (
  <DialogPrimitive.Close
    data-slot="alert-dialog-cancel"
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className,
    )}
    {...props}
  />
);
AlertDialogCancel.displayName = "AlertDialogCancel";

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogIcon,
  AlertDialogAction,
  AlertDialogCancel,
  alertDialogIconVariants,
  alertDialogActionVariants,
};
