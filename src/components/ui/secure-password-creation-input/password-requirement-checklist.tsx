"use client";

import type { ReactElement } from "react";
import { Check, X } from "lucide-react";
import { m } from "@/framer-motion";
import { cn } from "@/lib/utils";
import type { PasswordRequirementResult } from "./secure-password-creation-input-types";

export interface PasswordRequirementChecklistProps {
  results: PasswordRequirementResult[];
  className?: string;
}

export function PasswordRequirementChecklist({
  results,
  className,
}: PasswordRequirementChecklistProps): ReactElement {
  return (
    <ul
      className={cn("flex flex-col gap-1.5 mt-2", className)}
      aria-label="Password requirements"
    >
      {results.map(
        ({ requirement, isMet }): ReactElement => (
          <m.li
            key={requirement.id}
            className="flex items-center gap-2 text-sm"
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span
              className={cn(
                "flex items-center justify-center h-4 w-4 shrink-0",
                isMet ? "text-green-500" : "text-muted-foreground",
              )}
            >
              {isMet ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
            </span>
            <span
              className={cn(
                "transition-colors duration-200",
                isMet
                  ? "text-green-500 line-through"
                  : "text-muted-foreground",
              )}
            >
              {requirement.label}
            </span>
          </m.li>
        ),
      )}
    </ul>
  );
}

PasswordRequirementChecklist.displayName = "PasswordRequirementChecklist";
