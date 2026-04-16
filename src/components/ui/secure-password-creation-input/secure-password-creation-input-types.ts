import type { ChangeEvent } from "react";
import type { PasswordInputProps } from "@/components/ui/password-input";
import type { ProgressBarSizeId } from "@/components/ui/progress-bar";

export interface PasswordRequirement {
  /** Unique identifier for this requirement */
  id: string;
  /** Human-readable label displayed in the checklist */
  label: string;
  /** Validator function: returns true if the password meets this requirement */
  validate: (password: string) => boolean;
}

export interface PasswordRequirementResult {
  /** The original requirement definition */
  requirement: PasswordRequirement;
  /** Whether the requirement is currently met */
  isMet: boolean;
}

export type PasswordStrength = "weak" | "fair" | "strong";

export interface PasswordValidationResult {
  /** Individual results for each requirement */
  results: PasswordRequirementResult[];
  /** Number of requirements met */
  metCount: number;
  /** Total number of requirements */
  totalCount: number;
  /** Percentage of requirements met (0-100) */
  percentage: number;
  /** Strength tier for color coding */
  strength: PasswordStrength;
}

export interface SecurePasswordCreationInputProps
  extends Omit<PasswordInputProps, "value" | "onChange"> {
  /** Current password value (controlled component) */
  value: string;
  /** Change handler */
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** Array of password requirements to validate against */
  requirements?: PasswordRequirement[];
  /** Whether to hide the requirement checklist */
  hideChecklist?: boolean;
  /** Whether to hide the progress bar */
  hideProgressBar?: boolean;
  /** Size variant for the progress bar */
  progressBarSize?: ProgressBarSizeId;
  /** Additional classes for the progress bar indicator */
  progressBarClassName?: string;
}
