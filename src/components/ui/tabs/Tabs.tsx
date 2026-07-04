"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";
import type { ReactElement } from "react";

const Tabs = TabsPrimitive.Root;

export interface TabsListProps extends TabsPrimitive.TabsListProps {}

function TabsList({ className, ...props }: TabsListProps): ReactElement {
  return (
    <TabsPrimitive.List
      className={cn(
        "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
TabsList.displayName = TabsPrimitive.List.displayName;

export interface TabsTriggerProps extends TabsPrimitive.TabsTriggerProps {
  className?: string;
}

function TabsTrigger({ className, ...props }: TabsTriggerProps): ReactElement {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
        className,
      )}
      {...props}
    />
  );
}
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export interface TabsContentProps extends TabsPrimitive.TabsContentProps {}

function TabsContent({ className, ...props }: TabsContentProps): ReactElement {
  return (
    <TabsPrimitive.Content
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  );
}
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
