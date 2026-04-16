"use client";

import {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  useState,
  useCallback,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Info, CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react";

import { cn } from "@/lib/utils";

export const bannerVariantIds = [
  "info",
  "success",
  "warning",
  "destructive",
] as const satisfies string[];

export type BannerVariantId = (typeof bannerVariantIds)[number];

const bannerVariants = cva(
  "relative flex w-full items-center gap-3 border px-4 py-3 text-sm [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        info: "border-primary/30 bg-primary/10 text-primary-foreground dark:bg-primary/15 dark:text-foreground [&>svg]:text-primary",
        success:
          "border-green-500/30 bg-green-500/10 text-green-900 dark:bg-green-500/15 dark:text-green-100 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        warning:
          "border-warning/30 bg-warning/10 text-warning-foreground [&>svg]:text-warning",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/15 dark:text-destructive-foreground [&>svg]:text-destructive",
      } satisfies Record<BannerVariantId, string>,
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

const defaultIcons: Record<BannerVariantId, ReactElement> = {
  info: <Info className="size-4" />,
  success: <CheckCircle className="size-4" />,
  warning: <AlertTriangle className="size-4" />,
  destructive: <AlertOctagon className="size-4" />,
};

export interface BannerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  ref?: Ref<HTMLDivElement>;
  /** Whether the banner can be dismissed via a close button. Defaults to false. */
  dismissible?: boolean;
  /** Callback fired when the banner is dismissed. */
  onDismiss?: () => void;
  /** Override the default icon. Pass `null` to hide the icon entirely. */
  icon?: ReactNode | null;
  /** Optional action element (e.g. a Button) rendered on the right side. */
  action?: ReactNode;
}

function Banner({
  className,
  variant = "info",
  dismissible = false,
  onDismiss,
  icon,
  action,
  children,
  ref,
  ...props
}: BannerProps): ReactElement | null {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = useCallback((): void => {
    setDismissed(true);
    onDismiss?.();
  }, [onDismiss]);

  if (dismissed) {
    return null;
  }

  const resolvedIcon =
    icon === null ? null : icon ?? defaultIcons[variant ?? "info"];

  return (
    <div
      ref={ref}
      role="status"
      data-slot="banner"
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    >
      {resolvedIcon}

      <div className="flex-1 min-w-0">{children}</div>

      {action && <div className="shrink-0">{action}</div>}

      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss banner"
          onClick={handleDismiss}
          className="shrink-0 rounded-sm p-0.5 opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
Banner.displayName = "Banner";

export { Banner, bannerVariants };

export default Banner;
