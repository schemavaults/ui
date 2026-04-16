"use client";

import type { ReactElement } from "react";
import { cn } from "@/lib/utils";
import { PasswordInput } from "@/components/ui/password-input";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { ProgressBarColorId } from "@/components/ui/progress-bar";
import { usePasswordValidation } from "./use-password-validation";
import { PasswordRequirementChecklist } from "./password-requirement-checklist";
import { defaultPasswordRequirements } from "./default-password-requirements";
import type {
  SecurePasswordCreationInputProps,
  PasswordStrength,
} from "./secure-password-creation-input-types";

const strengthColorMap: Record<PasswordStrength, ProgressBarColorId> = {
  weak: "destructive",
  fair: "warning",
  strong: "positive",
};

export function SecurePasswordCreationInput({
  value,
  onChange,
  requirements = defaultPasswordRequirements,
  hideChecklist = false,
  hideProgressBar = false,
  progressBarSize = "sm",
  progressBarClassName,
  className,
  ...passwordInputProps
}: SecurePasswordCreationInputProps): ReactElement {
  const validation = usePasswordValidation(value, requirements);

  return (
    <div className={cn("flex flex-col w-full", className)}>
      <PasswordInput value={value} onChange={onChange} {...passwordInputProps} />

      {!hideProgressBar && (
        <ProgressBar
          value={validation.percentage}
          label="Password strength"
          size={progressBarSize}
          color={strengthColorMap[validation.strength]}
          indicatorClassName={progressBarClassName}
          className="mt-2"
        />
      )}

      {!hideChecklist && (
        <PasswordRequirementChecklist results={validation.results} />
      )}
    </div>
  );
}

SecurePasswordCreationInput.displayName = "SecurePasswordCreationInput";

export default SecurePasswordCreationInput;
