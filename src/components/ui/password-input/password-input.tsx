"use client";

import { useState, type ReactElement } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";

import { Input, type InputProps } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface PasswordInputProps
  extends Omit<InputProps, "icon" | "rightButton" | "type"> {}

const PasswordInput = ({
  ...props
}: PasswordInputProps): ReactElement => {
  const [visible, setVisible] = useState<boolean>(false);

  const ToggleIcon = visible ? EyeOff : Eye;

  return (
    <Input
      type={visible ? "text" : "password"}
      icon={KeyRound}
      rightButton={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 mr-1"
          onClick={(): void => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <ToggleIcon className="h-4 w-4" />
        </Button>
      }
      {...props}
    />
  );
};
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };

export default PasswordInput;
