import { cva } from "class-variance-authority";

export const collapsibleVariantIds = [
  "default",
  "outline",
  "ghost",
  "subtle",
  "primary",
] as const satisfies readonly string[];
export type CollapsibleVariantId = (typeof collapsibleVariantIds)[number];

export const collapsibleSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type CollapsibleSizeId = (typeof collapsibleSizeIds)[number];

export const collapsibleRootVariants = cva(
  "w-full overflow-hidden transition-colors",
  {
    variants: {
      variant: {
        default: "bg-background",
        outline: "rounded-lg border border-border bg-background",
        ghost: "bg-transparent",
        subtle: "rounded-lg bg-muted/50",
        primary:
          "rounded-lg border border-primary/30 bg-primary/5 text-foreground",
      } satisfies Record<CollapsibleVariantId, string>,
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      } satisfies Record<CollapsibleSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const collapsibleTriggerVariants = cva(
  "group/collapsible-trigger flex w-full items-center justify-between gap-2 font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "text-foreground hover:text-foreground/80",
        outline:
          "rounded-t-lg text-foreground hover:bg-accent/40 data-[state=closed]:rounded-b-lg",
        ghost: "text-foreground hover:text-foreground/80",
        subtle:
          "rounded-t-lg text-foreground hover:bg-muted/80 data-[state=closed]:rounded-b-lg data-[state=closed]:rounded-lg",
        primary:
          "rounded-t-lg text-primary hover:text-primary/90 data-[state=closed]:rounded-lg",
      } satisfies Record<CollapsibleVariantId, string>,
      size: {
        sm: "px-3 py-2 text-xs [&>svg]:size-3.5",
        md: "px-4 py-3 text-sm [&>svg]:size-4",
        lg: "px-5 py-4 text-base [&>svg]:size-5",
      } satisfies Record<CollapsibleSizeId, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export const collapsibleContentInnerVariants = cva("text-foreground/90", {
  variants: {
    variant: {
      default: "",
      outline: "border-t border-border",
      ghost: "",
      subtle: "",
      primary: "border-t border-primary/20",
    } satisfies Record<CollapsibleVariantId, string>,
    size: {
      sm: "px-3 py-2 text-xs",
      md: "px-4 py-3 text-sm",
      lg: "px-5 py-4 text-base",
    } satisfies Record<CollapsibleSizeId, string>,
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
