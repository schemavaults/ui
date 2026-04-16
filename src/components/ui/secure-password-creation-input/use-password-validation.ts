"use client";

import { useDeferredValue, useMemo } from "react";
import type {
  PasswordRequirement,
  PasswordRequirementResult,
  PasswordValidationResult,
  PasswordStrength,
} from "./secure-password-creation-input-types";

function getStrength(percentage: number): PasswordStrength {
  if (percentage >= 100) return "strong";
  if (percentage >= 50) return "fair";
  return "weak";
}

export function usePasswordValidation(
  password: string,
  requirements: PasswordRequirement[],
): PasswordValidationResult {
  const deferredPassword: string = useDeferredValue(password);

  return useMemo((): PasswordValidationResult => {
    const results: PasswordRequirementResult[] = requirements.map(
      (requirement): PasswordRequirementResult => ({
        requirement,
        isMet:
          deferredPassword.length > 0
            ? requirement.validate(deferredPassword)
            : false,
      }),
    );

    const metCount: number = results.filter(
      (r: PasswordRequirementResult): boolean => r.isMet,
    ).length;
    const totalCount: number = requirements.length;
    const percentage: number =
      totalCount > 0 ? Math.round((metCount / totalCount) * 100) : 0;

    return {
      results,
      metCount,
      totalCount,
      percentage,
      strength: getStrength(percentage),
    };
  }, [deferredPassword, requirements]);
}
