"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from "react";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  Toggle,
  toggleVariants,
  type ToggleProps,
  type ToggleSizeId,
  type ToggleVariantId,
} from "./toggle";

interface ToggleGroupContextValue {
  variant: ToggleVariantId | null | undefined;
  size: ToggleSizeId | null | undefined;
  isItemPressed: (value: string) => boolean;
  toggleItem: (value: string) => void;
  disabled: boolean;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroupContext(): ToggleGroupContextValue | null {
  return useContext(ToggleGroupContext);
}

type ToggleGroupBaseProps = Omit<HTMLAttributes<HTMLDivElement>, "onChange"> &
  VariantProps<typeof toggleVariants> & {
    /** Whether all items are disabled. */
    disabled?: boolean;
    ref?: Ref<HTMLDivElement>;
  };

export type ToggleGroupSingleProps = ToggleGroupBaseProps & {
  type: "single";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type ToggleGroupMultipleProps = ToggleGroupBaseProps & {
  type: "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type ToggleGroupProps =
  | ToggleGroupSingleProps
  | ToggleGroupMultipleProps;

function ToggleGroup(props: ToggleGroupProps): ReactElement {
  const {
    className,
    variant,
    size,
    disabled = false,
    children,
    ref,
    ...rest
  } = props;

  const [internalSingle, setInternalSingle] = useState<string>(
    props.type === "single" ? (props.defaultValue ?? "") : "",
  );
  const [internalMultiple, setInternalMultiple] = useState<string[]>(
    props.type === "multiple" ? (props.defaultValue ?? []) : [],
  );

  const isControlledSingle =
    props.type === "single" && props.value !== undefined;
  const isControlledMultiple =
    props.type === "multiple" && props.value !== undefined;

  const propsType = props.type;
  const singlePropValue = props.type === "single" ? props.value : undefined;
  const multiplePropValue =
    props.type === "multiple" ? props.value : undefined;

  const singleValue = useMemo<string>(() => {
    if (propsType !== "single") return "";
    return isControlledSingle ? (singlePropValue ?? "") : internalSingle;
  }, [propsType, isControlledSingle, singlePropValue, internalSingle]);

  const multipleValue = useMemo<string[]>(() => {
    if (propsType !== "multiple") return [];
    return isControlledMultiple ? (multiplePropValue ?? []) : internalMultiple;
  }, [propsType, isControlledMultiple, multiplePropValue, internalMultiple]);

  const isItemPressed = useCallback(
    (value: string): boolean => {
      if (props.type === "single") {
        return singleValue === value;
      }
      return multipleValue.includes(value);
    },
    [props.type, singleValue, multipleValue],
  );

  const toggleItem = useCallback(
    (value: string): void => {
      if (props.type === "single") {
        const next = singleValue === value ? "" : value;
        if (!isControlledSingle) {
          setInternalSingle(next);
        }
        props.onValueChange?.(next);
        return;
      }
      const exists = multipleValue.includes(value);
      const next = exists
        ? multipleValue.filter((v) => v !== value)
        : [...multipleValue, value];
      if (!isControlledMultiple) {
        setInternalMultiple(next);
      }
      props.onValueChange?.(next);
    },
    [
      props,
      singleValue,
      multipleValue,
      isControlledSingle,
      isControlledMultiple,
    ],
  );

  const ctx = useMemo<ToggleGroupContextValue>(
    () => ({
      variant,
      size,
      isItemPressed,
      toggleItem,
      disabled,
    }),
    [variant, size, isItemPressed, toggleItem, disabled],
  );

  // Strip out single/multiple specific props before spreading on div.
  const divProps: HTMLAttributes<HTMLDivElement> = {};
  for (const key of Object.keys(rest) as Array<keyof typeof rest>) {
    if (
      key === "type" ||
      key === "value" ||
      key === "defaultValue" ||
      key === "onValueChange"
    ) {
      continue;
    }
    (divProps as Record<string, unknown>)[key] = (
      rest as Record<string, unknown>
    )[key];
  }

  return (
    <ToggleGroupContext.Provider value={ctx}>
      <div
        ref={ref}
        data-slot="toggle-group"
        data-type={props.type}
        role="group"
        className={cn("inline-flex items-center gap-1", className)}
        {...(divProps as HTMLAttributes<HTMLDivElement>)}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}
ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends Omit<ToggleProps, "pressed" | "defaultPressed" | "onPressedChange"> {
  /** Stable identifier for this item within the group. */
  value: string;
}

function ToggleGroupItem({
  value,
  variant,
  size,
  disabled,
  onClick,
  ...props
}: ToggleGroupItemProps): ReactElement {
  const ctx = useToggleGroupContext();

  if (!ctx) {
    // Fallback: render as a standalone Toggle if not inside a group.
    return (
      <Toggle
        variant={variant}
        size={size}
        disabled={disabled}
        onClick={onClick}
        {...props}
      />
    );
  }

  const pressed = ctx.isItemPressed(value);

  return (
    <Toggle
      variant={variant ?? ctx.variant}
      size={size ?? ctx.size}
      disabled={disabled || ctx.disabled}
      pressed={pressed}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        ctx.toggleItem(value);
      }}
      {...props}
    />
  );
}
ToggleGroupItem.displayName = "ToggleGroupItem";

export { ToggleGroup, ToggleGroupItem };
