"use client";

import {
  type ComponentPropsWithoutRef,
  type ReactElement,
  type Ref,
  createContext,
  useContext,
  useMemo,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  type PaginationShape,
  type PaginationSize,
  type PaginationVariant,
} from "./pagination-variants";

interface PaginationContextValue {
  size: PaginationSize;
  variant: PaginationVariant;
  shape: PaginationShape;
}

const PaginationContext = createContext<PaginationContextValue>({
  size: "default",
  variant: "default",
  shape: "rounded",
});

function usePaginationContext(): PaginationContextValue {
  return useContext(PaginationContext);
}

export interface PaginationProps extends ComponentPropsWithoutRef<"nav"> {
  size?: PaginationSize;
  variant?: PaginationVariant;
  shape?: PaginationShape;
  ref?: Ref<HTMLElement>;
}

function Pagination({
  className,
  size = "default",
  variant = "default",
  shape = "rounded",
  ref,
  ...props
}: PaginationProps): ReactElement {
  const contextValue = useMemo<PaginationContextValue>(
    () => ({ size, variant, shape }),
    [size, variant, shape],
  );

  return (
    <PaginationContext.Provider value={contextValue}>
      <nav
        ref={ref}
        role="navigation"
        aria-label="pagination"
        data-slot="pagination"
        className={cn("mx-auto flex w-full justify-center", className)}
        {...props}
      />
    </PaginationContext.Provider>
  );
}
Pagination.displayName = "Pagination";

export interface PaginationContentProps
  extends ComponentPropsWithoutRef<"ul"> {
  ref?: Ref<HTMLUListElement>;
}

function PaginationContent({
  className,
  ref,
  ...props
}: PaginationContentProps): ReactElement {
  return (
    <ul
      ref={ref}
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}
PaginationContent.displayName = "PaginationContent";

export interface PaginationItemProps extends ComponentPropsWithoutRef<"li"> {
  ref?: Ref<HTMLLIElement>;
}

function PaginationItem({
  className,
  ref,
  ...props
}: PaginationItemProps): ReactElement {
  return (
    <li
      ref={ref}
      data-slot="pagination-item"
      className={cn(className)}
      {...props}
    />
  );
}
PaginationItem.displayName = "PaginationItem";

const paginationLinkVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 select-none",
  {
    variants: {
      size: {
        sm: "h-8 min-w-8 px-2 text-xs [&_svg]:size-3.5",
        default: "h-10 min-w-10 px-3 text-sm [&_svg]:size-4",
        lg: "h-11 min-w-11 px-4 text-base [&_svg]:size-5",
      } satisfies Record<PaginationSize, string>,
      variant: {
        default:
          "text-foreground hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90",
        outline:
          "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground data-[active=true]:border-primary data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:hover:bg-primary/90",
        ghost:
          "text-muted-foreground hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-semibold",
      } satisfies Record<PaginationVariant, string>,
      shape: {
        rounded: "rounded-md",
        square: "rounded-none",
        pill: "rounded-full",
      } satisfies Record<PaginationShape, string>,
    },
    defaultVariants: {
      size: "default",
      variant: "default",
      shape: "rounded",
    },
  },
);

export interface PaginationLinkProps
  extends ComponentPropsWithoutRef<"a">,
    VariantProps<typeof paginationLinkVariants> {
  isActive?: boolean;
  asChild?: boolean;
  ref?: Ref<HTMLAnchorElement>;
}

function PaginationLink({
  className,
  isActive = false,
  asChild = false,
  size,
  variant,
  shape,
  ref,
  ...props
}: PaginationLinkProps): ReactElement {
  const ctx = usePaginationContext();
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive ? "true" : undefined}
      className={cn(
        paginationLinkVariants({
          size: size ?? ctx.size,
          variant: variant ?? ctx.variant,
          shape: shape ?? ctx.shape,
        }),
        className,
      )}
      {...props}
    />
  );
}
PaginationLink.displayName = "PaginationLink";

export interface PaginationPreviousProps
  extends Omit<PaginationLinkProps, "children"> {
  label?: string;
  showLabel?: boolean;
}

function PaginationPrevious({
  className,
  label = "Previous",
  showLabel = true,
  ...props
}: PaginationPreviousProps): ReactElement {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      className={cn(showLabel ? "px-2.5" : undefined, className)}
      {...props}
    >
      <ChevronLeft aria-hidden="true" />
      {showLabel ? <span>{label}</span> : null}
    </PaginationLink>
  );
}
PaginationPrevious.displayName = "PaginationPrevious";

export interface PaginationNextProps
  extends Omit<PaginationLinkProps, "children"> {
  label?: string;
  showLabel?: boolean;
}

function PaginationNext({
  className,
  label = "Next",
  showLabel = true,
  ...props
}: PaginationNextProps): ReactElement {
  return (
    <PaginationLink
      aria-label="Go to next page"
      className={cn(showLabel ? "px-2.5" : undefined, className)}
      {...props}
    >
      {showLabel ? <span>{label}</span> : null}
      <ChevronRight aria-hidden="true" />
    </PaginationLink>
  );
}
PaginationNext.displayName = "PaginationNext";

export interface PaginationFirstProps
  extends Omit<PaginationLinkProps, "children"> {}

function PaginationFirst({
  className,
  ...props
}: PaginationFirstProps): ReactElement {
  return (
    <PaginationLink
      aria-label="Go to first page"
      className={className}
      {...props}
    >
      <ChevronsLeft aria-hidden="true" />
    </PaginationLink>
  );
}
PaginationFirst.displayName = "PaginationFirst";

export interface PaginationLastProps
  extends Omit<PaginationLinkProps, "children"> {}

function PaginationLast({
  className,
  ...props
}: PaginationLastProps): ReactElement {
  return (
    <PaginationLink
      aria-label="Go to last page"
      className={className}
      {...props}
    >
      <ChevronsRight aria-hidden="true" />
    </PaginationLink>
  );
}
PaginationLast.displayName = "PaginationLast";

export interface PaginationEllipsisProps
  extends ComponentPropsWithoutRef<"span"> {
  ref?: Ref<HTMLSpanElement>;
}

function PaginationEllipsis({
  className,
  ref,
  ...props
}: PaginationEllipsisProps): ReactElement {
  const ctx = usePaginationContext();
  const sizeClass =
    ctx.size === "sm"
      ? "h-8 min-w-8 [&_svg]:size-3.5"
      : ctx.size === "lg"
        ? "h-11 min-w-11 [&_svg]:size-5"
        : "h-10 min-w-10 [&_svg]:size-4";
  return (
    <span
      ref={ref}
      role="presentation"
      aria-hidden="true"
      data-slot="pagination-ellipsis"
      className={cn(
        "flex items-center justify-center text-muted-foreground",
        sizeClass,
        className,
      )}
      {...props}
    >
      <MoreHorizontal />
      <span className="sr-only">More pages</span>
    </span>
  );
}
PaginationEllipsis.displayName = "PaginationEllipsis";

type PaginationPageEntry =
  | { kind: "page"; page: number }
  | { kind: "ellipsis"; key: string };

function buildPageList(
  page: number,
  totalPages: number,
  siblingCount: number,
  boundaryCount: number,
): PaginationPageEntry[] {
  const totalNumbers = siblingCount * 2 + boundaryCount * 2 + 3;
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => ({
      kind: "page" as const,
      page: i + 1,
    }));
  }

  const startPages = Array.from({ length: boundaryCount }, (_, i) => i + 1);
  const endPages = Array.from(
    { length: boundaryCount },
    (_, i) => totalPages - boundaryCount + i + 1,
  );

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0]! - 2 : totalPages - 1,
  );

  const items: PaginationPageEntry[] = [];

  for (const p of startPages) {
    items.push({ kind: "page", page: p });
  }

  if (siblingsStart > boundaryCount + 2) {
    items.push({ kind: "ellipsis", key: "start-ellipsis" });
  } else if (boundaryCount + 1 < totalPages - boundaryCount) {
    items.push({ kind: "page", page: boundaryCount + 1 });
  }

  for (let p = siblingsStart; p <= siblingsEnd; p++) {
    items.push({ kind: "page", page: p });
  }

  if (siblingsEnd < totalPages - boundaryCount - 1) {
    items.push({ kind: "ellipsis", key: "end-ellipsis" });
  } else if (totalPages - boundaryCount > boundaryCount) {
    items.push({ kind: "page", page: totalPages - boundaryCount });
  }

  for (const p of endPages) {
    items.push({ kind: "page", page: p });
  }

  const seen = new Set<number>();
  return items.filter((entry) => {
    if (entry.kind === "ellipsis") return true;
    if (seen.has(entry.page)) return false;
    seen.add(entry.page);
    return true;
  });
}

export interface PaginationControlsProps
  extends Omit<ComponentPropsWithoutRef<"nav">, "onChange"> {
  /** Currently selected page (1-indexed). */
  page: number;
  /** Total number of pages available. */
  totalPages: number;
  /** Called with the new 1-indexed page when the user navigates. */
  onPageChange: (nextPage: number) => void;
  /** Number of pages to show on each side of the current page. Defaults to 1. */
  siblingCount?: number;
  /** Number of pages to always show at the start and end. Defaults to 1. */
  boundaryCount?: number;
  /** Show first/last page jump buttons. Defaults to false. */
  showFirstLast?: boolean;
  /** Show previous/next buttons. Defaults to true. */
  showPrevNext?: boolean;
  /** Hide the textual label on previous/next, leaving only the chevron. */
  iconOnlyPrevNext?: boolean;
  /** Disable the entire control. */
  disabled?: boolean;
  size?: PaginationSize;
  variant?: PaginationVariant;
  shape?: PaginationShape;
}

function PaginationControls({
  page,
  totalPages,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  showFirstLast = false,
  showPrevNext = true,
  iconOnlyPrevNext = false,
  disabled = false,
  size,
  variant,
  shape,
  className,
  ...props
}: PaginationControlsProps): ReactElement {
  const safeTotal = Math.max(1, Math.floor(totalPages));
  const safePage = Math.min(Math.max(1, Math.floor(page)), safeTotal);

  const pages = useMemo(
    () =>
      buildPageList(
        safePage,
        safeTotal,
        Math.max(0, siblingCount),
        Math.max(0, boundaryCount),
      ),
    [safePage, safeTotal, siblingCount, boundaryCount],
  );

  const isFirst = safePage <= 1;
  const isLast = safePage >= safeTotal;

  const goTo = (target: number): void => {
    if (disabled) return;
    const clamped = Math.min(Math.max(1, target), safeTotal);
    if (clamped === safePage) return;
    onPageChange(clamped);
  };

  return (
    <Pagination
      size={size}
      variant={variant}
      shape={shape}
      className={className}
      {...props}
    >
      <PaginationContent>
        {showFirstLast ? (
          <PaginationItem>
            <PaginationFirst
              href="#"
              aria-disabled={disabled || isFirst}
              tabIndex={disabled || isFirst ? -1 : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (!isFirst) goTo(1);
              }}
            />
          </PaginationItem>
        ) : null}
        {showPrevNext ? (
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={disabled || isFirst}
              tabIndex={disabled || isFirst ? -1 : undefined}
              showLabel={!iconOnlyPrevNext}
              onClick={(e) => {
                e.preventDefault();
                if (!isFirst) goTo(safePage - 1);
              }}
            />
          </PaginationItem>
        ) : null}
        {pages.map((entry) =>
          entry.kind === "ellipsis" ? (
            <PaginationItem key={entry.key}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={entry.page}>
              <PaginationLink
                href="#"
                isActive={entry.page === safePage}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  goTo(entry.page);
                }}
              >
                {entry.page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {showPrevNext ? (
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={disabled || isLast}
              tabIndex={disabled || isLast ? -1 : undefined}
              showLabel={!iconOnlyPrevNext}
              onClick={(e) => {
                e.preventDefault();
                if (!isLast) goTo(safePage + 1);
              }}
            />
          </PaginationItem>
        ) : null}
        {showFirstLast ? (
          <PaginationItem>
            <PaginationLast
              href="#"
              aria-disabled={disabled || isLast}
              tabIndex={disabled || isLast ? -1 : undefined}
              onClick={(e) => {
                e.preventDefault();
                if (!isLast) goTo(safeTotal);
              }}
            />
          </PaginationItem>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}
PaginationControls.displayName = "PaginationControls";

export {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationEllipsis,
  PaginationControls,
  paginationLinkVariants,
};

export default Pagination;
