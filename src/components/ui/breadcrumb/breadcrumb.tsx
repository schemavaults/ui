"use client";

import {
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
  type Ref,
  createContext,
  useContext,
  useMemo,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal, ArrowRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  type BreadcrumbSeparatorVariant,
  type BreadcrumbSize,
  type BreadcrumbVariant,
} from "./breadcrumb-variants";

interface BreadcrumbContextValue {
  separator: BreadcrumbSeparatorVariant;
  size: BreadcrumbSize;
  variant: BreadcrumbVariant;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue>({
  separator: "chevron",
  size: "default",
  variant: "default",
});

function useBreadcrumbContext(): BreadcrumbContextValue {
  return useContext(BreadcrumbContext);
}

const breadcrumbListVariants = cva(
  "flex flex-wrap items-center break-words gap-1.5 sm:gap-2.5",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
      variant: {
        default: "text-muted-foreground",
        muted: "text-muted-foreground/70",
        primary: "text-primary/80",
        ghost: "text-foreground/70",
      },
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

export interface BreadcrumbProps
  extends ComponentPropsWithoutRef<"nav"> {
  separator?: BreadcrumbSeparatorVariant;
  size?: BreadcrumbSize;
  variant?: BreadcrumbVariant;
  ref?: Ref<HTMLElement>;
}

function Breadcrumb({
  separator = "chevron",
  size = "default",
  variant = "default",
  ref,
  ...props
}: BreadcrumbProps): ReactElement {
  const contextValue = useMemo<BreadcrumbContextValue>(
    () => ({ separator, size, variant }),
    [separator, size, variant],
  );

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      <nav ref={ref} aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
    </BreadcrumbContext.Provider>
  );
}
Breadcrumb.displayName = "Breadcrumb";

export interface BreadcrumbListProps
  extends ComponentPropsWithoutRef<"ol">,
    VariantProps<typeof breadcrumbListVariants> {
  ref?: Ref<HTMLOListElement>;
}

function BreadcrumbList({
  className,
  size,
  variant,
  ref,
  ...props
}: BreadcrumbListProps): ReactElement {
  const ctx = useBreadcrumbContext();
  return (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn(
        breadcrumbListVariants({
          size: size ?? ctx.size,
          variant: variant ?? ctx.variant,
        }),
        className,
      )}
      {...props}
    />
  );
}
BreadcrumbList.displayName = "BreadcrumbList";

export interface BreadcrumbItemProps extends ComponentPropsWithoutRef<"li"> {
  ref?: Ref<HTMLLIElement>;
}

function BreadcrumbItem({
  className,
  ref,
  ...props
}: BreadcrumbItemProps): ReactElement {
  return (
    <li
      ref={ref}
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}
BreadcrumbItem.displayName = "BreadcrumbItem";

export interface BreadcrumbLinkProps
  extends ComponentPropsWithoutRef<"a"> {
  asChild?: boolean;
  ref?: Ref<HTMLAnchorElement>;
}

function BreadcrumbLink({
  asChild = false,
  className,
  ref,
  ...props
}: BreadcrumbLinkProps): ReactElement {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      ref={ref}
      data-slot="breadcrumb-link"
      className={cn(
        "transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:rounded-sm",
        className,
      )}
      {...props}
    />
  );
}
BreadcrumbLink.displayName = "BreadcrumbLink";

export interface BreadcrumbPageProps
  extends ComponentPropsWithoutRef<"span"> {
  ref?: Ref<HTMLSpanElement>;
}

function BreadcrumbPage({
  className,
  ref,
  ...props
}: BreadcrumbPageProps): ReactElement {
  return (
    <span
      ref={ref}
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  );
}
BreadcrumbPage.displayName = "BreadcrumbPage";

function renderDefaultSeparator(
  variant: BreadcrumbSeparatorVariant,
): ReactNode {
  switch (variant) {
    case "slash":
      return <span aria-hidden="true">/</span>;
    case "dot":
      return (
        <span
          aria-hidden="true"
          className="size-1 rounded-full bg-current"
        />
      );
    case "arrow":
      return <ArrowRight aria-hidden="true" />;
    case "chevron":
    default:
      return <ChevronRight aria-hidden="true" />;
  }
}

export interface BreadcrumbSeparatorProps
  extends ComponentPropsWithoutRef<"li"> {
  ref?: Ref<HTMLLIElement>;
}

function BreadcrumbSeparator({
  children,
  className,
  ref,
  ...props
}: BreadcrumbSeparatorProps): ReactElement {
  const ctx = useBreadcrumbContext();
  return (
    <li
      ref={ref}
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-separator"
      className={cn(
        "[&>svg]:size-3.5 inline-flex items-center justify-center text-muted-foreground/70",
        className,
      )}
      {...props}
    >
      {children ?? renderDefaultSeparator(ctx.separator)}
    </li>
  );
}
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export interface BreadcrumbEllipsisProps
  extends ComponentPropsWithoutRef<"span"> {
  ref?: Ref<HTMLSpanElement>;
}

function BreadcrumbEllipsis({
  className,
  ref,
  ...props
}: BreadcrumbEllipsisProps): ReactElement {
  return (
    <span
      ref={ref}
      role="presentation"
      aria-hidden="true"
      data-slot="breadcrumb-ellipsis"
      className={cn(
        "flex size-9 items-center justify-center text-muted-foreground",
        className,
      )}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};

export default Breadcrumb;
