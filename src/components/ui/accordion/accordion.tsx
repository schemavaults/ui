"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import {
  type ComponentPropsWithoutRef,
  type ReactElement,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";

export const accordionVariantIds = [
  "default",
  "bordered",
  "ghost",
] as const satisfies string[];

export type AccordionVariantId = (typeof accordionVariantIds)[number];

const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      bordered: "rounded-lg border",
      ghost: "",
    } satisfies Record<AccordionVariantId, string>,
  },
  defaultVariants: {
    variant: "default",
  },
});

// --- Accordion (Root) ---

export type AccordionSingleProps = ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
> & {
  type: "single";
} & VariantProps<typeof accordionVariants> & {
    ref?: Ref<HTMLDivElement>;
  };

export type AccordionMultipleProps = ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
> & {
  type: "multiple";
} & VariantProps<typeof accordionVariants> & {
    ref?: Ref<HTMLDivElement>;
  };

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

function Accordion({
  className,
  variant,
  ref,
  ...props
}: AccordionProps): ReactElement {
  return (
    <AccordionPrimitive.Root
      ref={ref}
      className={cn(accordionVariants({ variant }), className)}
      {...props}
    />
  );
}
Accordion.displayName = "Accordion";

// --- AccordionItem ---

export interface AccordionItemProps
  extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {
  ref?: Ref<HTMLDivElement>;
}

function AccordionItem({
  className,
  ref,
  ...props
}: AccordionItemProps): ReactElement {
  return (
    <AccordionPrimitive.Item
      ref={ref}
      className={cn("border-b", className)}
      {...props}
    />
  );
}
AccordionItem.displayName = "AccordionItem";

// --- AccordionTrigger ---

export interface AccordionTriggerProps
  extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  ref?: Ref<HTMLButtonElement>;
}

function AccordionTrigger({
  className,
  children,
  ref,
  ...props
}: AccordionTriggerProps): ReactElement {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
AccordionTrigger.displayName = "AccordionTrigger";

// --- AccordionContent ---

export interface AccordionContentProps
  extends ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {
  ref?: Ref<HTMLDivElement>;
}

function AccordionContent({
  className,
  children,
  ref,
  ...props
}: AccordionContentProps): ReactElement {
  return (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pb-4 pt-0", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
