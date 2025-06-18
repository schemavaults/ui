"use client";

import type { PropsWithChildren, ReactElement, ReactNode } from "react";
import { Button } from "./button";
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
      className="
        flex flex-col
        justify-start items-stretch
        bg-background
        border border-accent
        rounded-md
        shadow-md
      "
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
    <div className="h-6 w-6 flex items-center justify-center">{children}</div>
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

export function InlineMenuItem(props: InlineMenuItemDefinition): ReactElement {
  const destructive: boolean = props.destructive ?? false;
  const color = destructive ? "red" : undefined;

  const iconClassName = "h-4 w-4" as const;

  const Icon = props.icon;

  const onPress = props.disabled ? undefined : props.onPress;

  const className = cn(
    "w-full grow",
    "flex flex-row flex-nowrap gap-2",
    "items-center justify-start",
    props.disabled ? "hover:cursor-not-allowed" : "hover:cursor-pointer",
  );

  return (
    <li role="menuitem" className="w-full p-2">
      <Button
        variant={"ghost"}
        color={color}
        onClick={onPress}
        className={className}
      >
        <MenuItemIconSlot>
          {typeof Icon === "function" && <Icon className={iconClassName} />}
        </MenuItemIconSlot>
        <p className="text-foreground">{props.label}</p>
      </Button>
    </li>
  );
}

export interface InlineMenuProps {
  items: InlineMenuItemDefinition[];
  close?: () => void;
}

export function InlineMenu(props: InlineMenuProps): ReactElement {
  return (
    <InlineMenuContainer close={props.close}>
      {props.items.map((inlineItem) => {
        return <InlineMenuItem {...inlineItem} key={inlineItem.id} />;
      })}
    </InlineMenuContainer>
  );
}
