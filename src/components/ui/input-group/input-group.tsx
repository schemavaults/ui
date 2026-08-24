"use client";

import {
  createContext,
  useContext,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type Ref,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import {
  type InputGroupSize,
  type InputGroupVariant,
  inputGroupSizeIds,
  inputGroupVariantIds,
} from "./input-group-variants";

interface InputGroupContextValue {
  size: InputGroupSize;
  variant: InputGroupVariant;
  disabled: boolean;
  invalid: boolean;
}

const InputGroupContext = createContext<InputGroupContextValue | null>(null);

function useInputGroupContext(component: string): InputGroupContextValue {
  const ctx = useContext(InputGroupContext);
  if (!ctx) {
    throw new Error(
      `<${component}> must be used inside <InputGroup>. Wrap it with <InputGroup>…</InputGroup>.`,
    );
  }
  return ctx;
}

const inputGroupVariants = cva(
  "relative inline-flex w-full items-stretch overflow-hidden rounded-md ring-offset-background transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 aria-invalid:ring-destructive/40 aria-invalid:focus-within:ring-destructive data-[invalid=true]:border-destructive data-[invalid=true]:focus-within:ring-destructive data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-input bg-background",
        outline: "border border-primary/40 bg-background",
        ghost: "border border-transparent bg-muted/40",
      } satisfies Record<InputGroupVariant, string>,
      size: {
        sm: "h-8 text-xs",
        md: "h-10 text-sm",
        lg: "h-12 text-base",
      } satisfies Record<InputGroupSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface InputGroupProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inputGroupVariants> {
  ref?: Ref<HTMLDivElement>;
  /** Marks the group visually and semantically as disabled. */
  disabled?: boolean;
  /** Marks the group as invalid. Renders a destructive-colored ring/border. */
  invalid?: boolean;
}

function InputGroup({
  className,
  variant = "default",
  size = "md",
  disabled = false,
  invalid = false,
  children,
  ref,
  ...props
}: InputGroupProps): ReactElement {
  const resolvedVariant: InputGroupVariant = variant ?? "default";
  const resolvedSize: InputGroupSize = size ?? "md";
  return (
    <InputGroupContext.Provider
      value={{
        variant: resolvedVariant,
        size: resolvedSize,
        disabled,
        invalid,
      }}
    >
      <div
        ref={ref}
        data-slot="input-group"
        data-disabled={disabled || undefined}
        data-invalid={invalid || undefined}
        aria-invalid={invalid || undefined}
        className={cn(
          inputGroupVariants({ variant: resolvedVariant, size: resolvedSize }),
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
}
InputGroup.displayName = "InputGroup";

const inputGroupAddonVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap text-muted-foreground [&>svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-muted/60",
        outline: "bg-muted/40",
        ghost: "bg-transparent",
      } satisfies Record<InputGroupVariant, string>,
      size: {
        sm: "px-2 text-xs [&>svg]:size-3.5",
        md: "px-3 text-sm [&>svg]:size-4",
        lg: "px-4 text-base [&>svg]:size-5",
      } satisfies Record<InputGroupSize, string>,
      position: {
        start: "border-r border-input",
        end: "border-l border-input",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      position: "start",
    },
  },
);

export interface InputGroupAddonProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  /**
   * Which side of the group this addon sits on. Controls the border and
   * padding treatment. Defaults to `"start"`.
   */
  position?: "start" | "end";
}

function InputGroupAddon({
  className,
  position = "start",
  ref,
  ...props
}: InputGroupAddonProps): ReactElement {
  const { size, variant } = useInputGroupContext("InputGroupAddon");
  return (
    <div
      ref={ref}
      data-slot="input-group-addon"
      data-position={position}
      className={cn(
        inputGroupAddonVariants({ variant, size, position }),
        className,
      )}
      {...props}
    />
  );
}
InputGroupAddon.displayName = "InputGroupAddon";

const inputGroupInputVariants = cva(
  "flex-1 min-w-0 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
  {
    variants: {
      size: {
        sm: "px-2 text-xs",
        md: "px-3 text-sm",
        lg: "px-4 text-base",
      } satisfies Record<InputGroupSize, string>,
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export interface InputGroupInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  ref?: Ref<HTMLInputElement>;
}

function InputGroupInput({
  className,
  disabled,
  ref,
  ...props
}: InputGroupInputProps): ReactElement {
  const { size, disabled: groupDisabled, invalid } =
    useInputGroupContext("InputGroupInput");
  const effectiveDisabled = disabled || groupDisabled;
  return (
    <input
      ref={ref}
      data-slot="input-group-input"
      disabled={effectiveDisabled}
      aria-invalid={invalid || undefined}
      className={cn(inputGroupInputVariants({ size }), className)}
      {...props}
    />
  );
}
InputGroupInput.displayName = "InputGroupInput";

const inputGroupButtonVariants = cva(
  "inline-flex shrink-0 select-none items-center justify-center gap-1 whitespace-nowrap font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 [&>svg]:size-4",
  {
    variants: {
      size: {
        sm: "px-2 text-xs [&>svg]:size-3.5",
        md: "px-3 text-sm [&>svg]:size-4",
        lg: "px-4 text-base [&>svg]:size-5",
      } satisfies Record<InputGroupSize, string>,
      position: {
        start: "border-r border-input",
        end: "border-l border-input",
      },
    },
    defaultVariants: {
      size: "md",
      position: "end",
    },
  },
);

export interface InputGroupButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size"> {
  ref?: Ref<HTMLButtonElement>;
  position?: "start" | "end";
}

function InputGroupButton({
  className,
  position = "end",
  type = "button",
  ref,
  ...props
}: InputGroupButtonProps): ReactElement {
  const { size } = useInputGroupContext("InputGroupButton");
  return (
    <button
      ref={ref}
      type={type}
      data-slot="input-group-button"
      data-position={position}
      className={cn(inputGroupButtonVariants({ size, position }), className)}
      {...props}
    />
  );
}
InputGroupButton.displayName = "InputGroupButton";

export {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
  inputGroupVariants,
  inputGroupAddonVariants,
  inputGroupInputVariants,
  inputGroupButtonVariants,
  inputGroupSizeIds,
  inputGroupVariantIds,
};
export type { InputGroupSize, InputGroupVariant };

export default InputGroup;
