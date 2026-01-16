"use client";

import { createContext, useContext, useMemo, type FC, type PropsWithChildren, type ReactElement, type ReactNode } from "react";
import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface InlineMenuContainerProps extends PropsWithChildren {
  close?: () => void;
}

// Used to render
export function InlineMenuContainer(
  props: InlineMenuContainerProps,
): ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col",
        "justify-start items-stretch",
        "bg-background",
        "border border-accent",
        "rounded-md",
        "shadow-md",
        "relative"
      )}
      role="menu"
    >
      {props.close && (
        <Button
          className="
            absolute transform translate-x-1/2 -translate-y-1/2
            top-0 right-0 m-2
            flex items-center justify-center
            rounded-full
          "
          onClick={props.close}
          aria-label="Close menu"
          variant={"secondary"}
        >
          <X />
        </Button>
      )}
      <ul
        className="
          flex flex-col
          justify-start items-stretch
          p-1
        "
        role="menu"
      >
        {props.children}
      </ul>
    </div>
  );
}

function MenuItemIconSlot({ children }: PropsWithChildren): ReactElement {
  return (
    <div className="h-6 w-6 flex items-center justify-center text-current">{children}</div>
  );
}

export interface InlineMenuItemDefinition {
  id: string;
  label: string;
  onPress?: () => void;
  destructive?: boolean;
  icon?: ({ className }: { className?: string }) => ReactNode;
  disabled?: boolean;
}

const InlineMenuHasIconsSetContext = createContext<boolean | null>(null);

function useInlineMenuHasIconsSet(): boolean {
  const context = useContext(InlineMenuHasIconsSetContext);
  if (typeof context !== "boolean") {
    throw new Error("useInlineMenuHasIconsSet must be used within an InlineMenuHasIconsSetContext provider");
  }
  return context;
}

export function InlineMenuItem(props: InlineMenuItemDefinition): ReactElement {
  const destructive: boolean = props.destructive ?? false;
  const color = destructive ? "red" : undefined;

  const colorClassName: string = destructive ? "text-red-500" : "text-foreground";
  const iconClassName: string = cn(
    "h-4 w-4"
  );

  const hasIconsSet: boolean = useInlineMenuHasIconsSet();
  const Icon: FC<{ className?: string }> | undefined = props.icon;

  const onPress = props.disabled ? undefined : props.onPress;

  const className = cn(
    "w-full grow",
    "flex flex-row flex-nowrap gap-2",
    "items-center justify-start",
    colorClassName,
    props.disabled ? "hover:cursor-not-allowed" : "hover:cursor-pointer",
  );

  return (
    <li role="menuitem" className="w-full p-2">
      <Button
        variant={"ghost"}
        color={color}
        onClick={onPress}
        className={className}
        disabled={props.disabled}
      >
        { hasIconsSet && (
          <MenuItemIconSlot>
            {typeof Icon === "function" && <Icon className={iconClassName} />}
          </MenuItemIconSlot>
        )}
        
        <p className={cn(colorClassName)}>{props.label}</p>
      </Button>
    </li>
  );
}

export interface InlineMenuProps {
  items: InlineMenuItemDefinition[];
  close?: () => void;
}

export function InlineMenu(props: InlineMenuProps): ReactElement {
  const hasAnIconSet: boolean = useMemo(() => props.items.some((item) => typeof item.icon === 'function'), [props.items]);
  return (
    <InlineMenuHasIconsSetContext.Provider value={hasAnIconSet}>
      <InlineMenuContainer close={props.close}>
        {props.items.map((inlineItem) => {
          return <InlineMenuItem key={inlineItem.id} {...inlineItem} />;
        })}
      </InlineMenuContainer>
    </InlineMenuHasIconsSetContext.Provider>
  );
}

export default InlineMenu;