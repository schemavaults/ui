"use client";

import type { InputHTMLAttributes, ReactElement, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  rightButton?: ReactNode;
}

const Input = ({
  className,
  type,
  icon: Icon,
  rightButton,
  ...props
}: InputProps): ReactElement => {
  const hasAdornments = Icon || rightButton;

  const inputElement = (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full text-sm bg-transparent placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        hasAdornments
          ? cn(Icon ? "pl-9" : "pl-3", rightButton ? "pr-0" : "pr-3", "py-2")
          : "rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    />
  );

  if (!hasAdornments) return inputElement;

  return (
    <div className="relative flex items-center rounded-md border border-input bg-background ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {Icon && (
        <Icon className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
      )}
      {inputElement}
      {rightButton}
    </div>
  );
};
Input.displayName = "Input";

export { Input };

export default Input;
