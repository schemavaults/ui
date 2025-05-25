"use client";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactElement, Ref } from "react";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  ref?: Ref<HTMLDivElement>;
}

function Alert({
  className,
  variant,
  ref,
  ...props
}: AlertProps): ReactElement {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}
Alert.displayName = "Alert";

export interface AlertTitleProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof alertVariants> {
  ref?: Ref<HTMLParagraphElement>;
}

function AlertTitle({
  className,
  ref,
  ...props
}: AlertTitleProps): ReactElement {
  return (
    <h5
      ref={ref}
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}
AlertTitle.displayName = "AlertTitle";

export interface AlertDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof alertVariants> {
  ref?: Ref<HTMLParagraphElement>;
}

function AlertDescription({ className, ref, ...props }: AlertDescriptionProps) {
  return (
    <div
      ref={ref}
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  );
}
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
