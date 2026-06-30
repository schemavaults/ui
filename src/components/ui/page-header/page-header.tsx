"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes, ReactElement, Ref } from "react";

import { cn } from "@/lib/utils";

export const pageHeaderVariantIds = [
  "default",
  "bordered",
  "muted",
  "primary",
] as const satisfies string[];

export type PageHeaderVariantId = (typeof pageHeaderVariantIds)[number];

export const pageHeaderSizeIds = ["sm", "md", "lg"] as const satisfies string[];

export type PageHeaderSizeId = (typeof pageHeaderSizeIds)[number];

const pageHeaderVariants = cva(
  "flex w-full flex-col text-foreground",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        bordered: "border-b border-border bg-transparent",
        muted: "rounded-lg border border-border bg-muted/40",
        primary:
          "rounded-lg border border-primary/30 bg-primary/5 dark:bg-primary/10",
      } satisfies Record<PageHeaderVariantId, string>,
      size: {
        sm: "gap-2 py-3",
        md: "gap-3 py-4",
        lg: "gap-4 py-6",
      } satisfies Record<PageHeaderSizeId, string>,
      padded: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        padded: true,
        size: "sm",
        className: "px-3",
      },
      {
        padded: true,
        size: "md",
        className: "px-4",
      },
      {
        padded: true,
        size: "lg",
        className: "px-6",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      padded: false,
    },
  },
);

export interface PageHeaderProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof pageHeaderVariants> {
  /**
   * Add horizontal padding scaled to the chosen size. Useful for
   * `muted`/`primary` variants where padding looks better inside the
   * background, and ignored by default for `bordered`/`default` so the
   * header can hug the edge of an outer page container.
   */
  padded?: boolean;
  ref?: Ref<HTMLElement>;
}

function PageHeader({
  className,
  variant,
  size,
  padded,
  ref,
  ...props
}: PageHeaderProps): ReactElement {
  return (
    <header
      ref={ref}
      data-slot="page-header"
      className={cn(pageHeaderVariants({ variant, size, padded }), className)}
      {...props}
    />
  );
}
PageHeader.displayName = "PageHeader";

export interface PageHeaderBreadcrumbProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PageHeaderBreadcrumb({
  className,
  ref,
  ...props
}: PageHeaderBreadcrumbProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="page-header-breadcrumb"
      className={cn("flex w-full items-center", className)}
      {...props}
    />
  );
}
PageHeaderBreadcrumb.displayName = "PageHeaderBreadcrumb";

export interface PageHeaderTopProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PageHeaderTop({
  className,
  ref,
  ...props
}: PageHeaderTopProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="page-header-top"
      className={cn(
        "flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
      {...props}
    />
  );
}
PageHeaderTop.displayName = "PageHeaderTop";

export interface PageHeaderHeadingProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PageHeaderHeading({
  className,
  ref,
  ...props
}: PageHeaderHeadingProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="page-header-heading"
      className={cn("flex min-w-0 flex-1 items-start gap-3", className)}
      {...props}
    />
  );
}
PageHeaderHeading.displayName = "PageHeaderHeading";

const pageHeaderIconVariants = cva(
  "flex shrink-0 items-center justify-center rounded-md [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        bordered: "bg-muted text-muted-foreground",
        muted: "bg-background text-muted-foreground",
        primary: "bg-primary/10 text-primary dark:text-primary-foreground",
      } satisfies Record<PageHeaderVariantId, string>,
      size: {
        sm: "size-8 [&>svg]:size-4",
        md: "size-10 [&>svg]:size-5",
        lg: "size-12 [&>svg]:size-6",
      } satisfies Record<PageHeaderSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
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
  variant,
  size,
  ref,
  ...props
}: PageHeaderIconProps): ReactElement {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-slot="page-header-icon"
      className={cn(pageHeaderIconVariants({ variant, size }), className)}
      {...props}
    />
  );
}
PageHeaderIcon.displayName = "PageHeaderIcon";

export interface PageHeaderContentProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PageHeaderContent({
  className,
  ref,
  ...props
}: PageHeaderContentProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="page-header-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-1", className)}
      {...props}
    />
  );
}
PageHeaderContent.displayName = "PageHeaderContent";

const pageHeaderTitleSizes = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
} satisfies Record<PageHeaderSizeId, string>;

export interface PageHeaderTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  size?: PageHeaderSizeId;
  /**
   * The heading level to render. Defaults to `h1` since page headers are
   * typically the top-level heading on a page.
   */
  as?: "h1" | "h2" | "h3";
  ref?: Ref<HTMLHeadingElement>;
}

function PageHeaderTitle({
  className,
  size = "md",
  as: Heading = "h1",
  ref,
  ...props
}: PageHeaderTitleProps): ReactElement {
  return (
    <Heading
      ref={ref}
      data-slot="page-header-title"
      className={cn(
        "font-semibold leading-tight tracking-tight text-foreground",
        pageHeaderTitleSizes[size],
        className,
      )}
      {...props}
    />
  );
}
PageHeaderTitle.displayName = "PageHeaderTitle";

const pageHeaderDescriptionSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
} satisfies Record<PageHeaderSizeId, string>;

export interface PageHeaderDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  size?: PageHeaderSizeId;
  ref?: Ref<HTMLParagraphElement>;
}

function PageHeaderDescription({
  className,
  size = "md",
  ref,
  ...props
}: PageHeaderDescriptionProps): ReactElement {
  return (
    <p
      ref={ref}
      data-slot="page-header-description"
      className={cn(
        "text-muted-foreground leading-relaxed [text-wrap:pretty]",
        pageHeaderDescriptionSizes[size],
        className,
      )}
      {...props}
    />
  );
}
PageHeaderDescription.displayName = "PageHeaderDescription";

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
        "mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
PageHeaderMeta.displayName = "PageHeaderMeta";

export interface PageHeaderActionsProps
  extends HTMLAttributes<HTMLDivElement> {
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
        "flex flex-shrink-0 flex-wrap items-center gap-2",
        className,
      )}
      {...props}
    />
  );
}
PageHeaderActions.displayName = "PageHeaderActions";

export interface PageHeaderToolbarProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function PageHeaderToolbar({
  className,
  ref,
  ...props
}: PageHeaderToolbarProps): ReactElement {
  return (
    <div
      ref={ref}
      data-slot="page-header-toolbar"
      className={cn(
        "flex w-full flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3",
        className,
      )}
      {...props}
    />
  );
}
PageHeaderToolbar.displayName = "PageHeaderToolbar";

export {
  PageHeader,
  PageHeaderBreadcrumb,
  PageHeaderTop,
  PageHeaderHeading,
  PageHeaderIcon,
  PageHeaderContent,
  PageHeaderTitle,
  PageHeaderDescription,
  PageHeaderMeta,
  PageHeaderActions,
  PageHeaderToolbar,
  pageHeaderVariants,
  pageHeaderIconVariants,
};
