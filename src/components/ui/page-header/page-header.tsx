"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";

export const pageHeaderSizeIds = ["sm", "default", "lg"] as const satisfies string[];
export type PageHeaderSizeId = (typeof pageHeaderSizeIds)[number];

export const pageHeaderVariantIds = [
  "default",
  "muted",
  "accent",
] as const satisfies string[];
export type PageHeaderVariantId = (typeof pageHeaderVariantIds)[number];

export const pageHeaderAlignIds = ["start", "center"] as const satisfies string[];
export type PageHeaderAlignId = (typeof pageHeaderAlignIds)[number];

const pageHeaderVariants = cva(
  "flex w-full flex-col text-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        muted: "bg-muted/40 rounded-lg",
        accent: "bg-accent/40 rounded-lg",
      } satisfies Record<PageHeaderVariantId, string>,
      size: {
        sm: "gap-1.5",
        default: "gap-2",
        lg: "gap-3",
      } satisfies Record<PageHeaderSizeId, string>,
      padded: {
        true: "",
        false: "",
      },
      bordered: {
        true: "border-b border-border pb-4",
        false: "",
      },
    },
    compoundVariants: [
      { variant: "muted", padded: true, className: "p-4 sm:p-6" },
      { variant: "accent", padded: true, className: "p-4 sm:p-6" },
      { variant: "default", padded: true, size: "sm", className: "py-3" },
      { variant: "default", padded: true, size: "default", className: "py-4" },
      { variant: "default", padded: true, size: "lg", className: "py-6" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
      padded: false,
      bordered: false,
    },
  },
);

export interface PageHeaderProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof pageHeaderVariants> {
  ref?: Ref<HTMLElement>;
}

function PageHeader({
  className,
  variant,
  size,
  padded,
  bordered,
  ref,
  ...props
}: PageHeaderProps): ReactElement {
  return (
    <header
      ref={ref}
      data-slot="page-header"
      className={cn(
        pageHeaderVariants({ variant, size, padded, bordered }),
        className,
      )}
      {...props}
    />
  );
}
PageHeader.displayName = "PageHeader";

export interface PageHeaderEyebrowProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

function PageHeaderEyebrow({
  className,
  ref,
  ...props
}: PageHeaderEyebrowProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="page-header-eyebrow"
      className={cn(
        "text-xs font-medium uppercase tracking-wider text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
PageHeaderEyebrow.displayName = "PageHeaderEyebrow";

const pageHeaderRowAlignClasses = {
  start: "items-start",
  center: "items-center",
} satisfies Record<PageHeaderAlignId, string>;

export interface PageHeaderRowProps extends HTMLAttributes<HTMLDivElement> {
  align?: PageHeaderAlignId;
  ref?: Ref<HTMLDivElement>;
}

function PageHeaderRow({
  className,
  align = "start",
  ref,
  ...props
}: PageHeaderRowProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="page-header-row"
      className={cn(
        "flex w-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between",
        pageHeaderRowAlignClasses[align],
        className,
      )}
      {...props}
    />
  );
}
PageHeaderRow.displayName = "PageHeaderRow";

export interface PageHeaderTitleGroupProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PageHeaderTitleGroup({
  className,
  ref,
  ...props
}: PageHeaderTitleGroupProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="page-header-title-group"
      className={cn("flex min-w-0 items-start gap-3", className)}
      {...props}
    />
  );
}
PageHeaderTitleGroup.displayName = "PageHeaderTitleGroup";

const pageHeaderIconVariants = cva(
  "flex shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground [&>svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "size-8 [&>svg]:size-4",
        default: "size-10 [&>svg]:size-5",
        lg: "size-12 [&>svg]:size-6",
      } satisfies Record<PageHeaderSizeId, string>,
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface PageHeaderIconProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageHeaderIconVariants> {
  ref?: Ref<HTMLDivElement>;
}

function PageHeaderIcon({
  className,
  size,
  ref,
  ...props
}: PageHeaderIconProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="page-header-icon"
      className={cn(pageHeaderIconVariants({ size }), className)}
      {...props}
    />
  );
}
PageHeaderIcon.displayName = "PageHeaderIcon";

export interface PageHeaderTitleAreaProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PageHeaderTitleArea({
  className,
  ref,
  ...props
}: PageHeaderTitleAreaProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="page-header-title-area"
      className={cn("flex min-w-0 flex-col gap-1", className)}
      {...props}
    />
  );
}
PageHeaderTitleArea.displayName = "PageHeaderTitleArea";

const pageHeaderTitleSizes = {
  sm: "text-lg",
  default: "text-2xl",
  lg: "text-3xl",
} satisfies Record<PageHeaderSizeId, string>;

export interface PageHeaderTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  size?: PageHeaderSizeId;
  ref?: Ref<HTMLHeadingElement>;
}

function PageHeaderTitle({
  className,
  size = "default",
  ref,
  ...props
}: PageHeaderTitleProps): ReactElement {
  return (
    <h1
      ref={ref}
      data-slot="page-header-title"
      className={cn(
        "truncate font-semibold leading-tight tracking-tight text-foreground",
        pageHeaderTitleSizes[size],
        className,
      )}
      {...props}
    >
      {props.children}
    </h1>
  );
}
PageHeaderTitle.displayName = "PageHeaderTitle";

export interface PageHeaderDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
}

function PageHeaderDescription({
  className,
  ref,
  ...props
}: PageHeaderDescriptionProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="page-header-description"
      className={cn(
        "max-w-prose text-sm text-muted-foreground [&_p]:leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
PageHeaderDescription.displayName = "PageHeaderDescription";

export interface PageHeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PageHeaderActions({
  className,
  ref,
  ...props
}: PageHeaderActionsProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="page-header-actions"
      className={cn(
        "flex shrink-0 flex-wrap items-center gap-2 sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}
PageHeaderActions.displayName = "PageHeaderActions";

export interface PageHeaderMetaProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PageHeaderMeta({
  className,
  ref,
  ...props
}: PageHeaderMetaProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="page-header-meta"
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
PageHeaderMeta.displayName = "PageHeaderMeta";

export {
  PageHeader,
  PageHeaderEyebrow,
  PageHeaderRow,
  PageHeaderTitleGroup,
  PageHeaderIcon,
  PageHeaderTitleArea,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderActions,
  PageHeaderMeta,
  pageHeaderVariants,
  pageHeaderIconVariants,
};
