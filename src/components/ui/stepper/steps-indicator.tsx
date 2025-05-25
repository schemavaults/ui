"use client";

import type { ReactElement, ReactNode } from "react";
import type { BaseStep } from "./step_definition";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStepperContext } from "./useStepperContext";

function StepIndicatorSlot(
  { step, activeStep, stepIndex }: { step: BaseStep, activeStep: number, stepIndex: number }
): ReactElement {
  let Indicator: ({ className }: { className: string }) => ReactNode;

  const active: boolean = activeStep === stepIndex;

  if (
    (step.state === 'valid') || (stepIndex < activeStep)
  ) {
    Indicator = ({ className }): ReactElement => (
      <Check
        className={cn(
          className,
          "text-green-500"
        )}
      />
    );
  } else if (active) {
    Indicator = ({ className }): ReactElement => (
      <div
        className={cn(
          className,
          "bg-blue-500 rounded-full animate-pulse h-4 w-4"
        )}
      />
    );
  } else if (step.state === 'invalid') {
    Indicator = ({ className }): ReactElement => (
      <X
        className={cn(
          className,
          "text-red-500"
        )}
      />
    );
  } else if (step.state === 'unfilled') {
    Indicator = ({ className }): ReactElement => (
      <div
        className={cn(
          "bg-gray-300 rounded-full",
          className
        )}
      />
    );
  } else {
    Indicator = () => null;
  }

  return (
    <div className="h-6 w-6 flex items-center justify-center">
      <Indicator className="h-4 w-4" />
    </div>
  )
}

interface StepsIndicatorProps {}

export function StepsIndicator(
  {  }: StepsIndicatorProps
): ReactElement {
  const stepperContext = useStepperContext();
  if (!stepperContext) {
    throw new Error("StepperFooter not within StepperContext!");
  }
  const { activeStep, steps } = stepperContext;

  return (
    <ol
      className={cn(
        "flex flex-col md:flex-row justify-between items-stretch mb-4",
        "overflow-y-hidden overflow-x-scroll no-scrollbar",
        "list-decimal",
        "gap-1 sm:gap-2 md:gap-4"
      )}
    >
      {steps.map(
        (step, index): ReactElement => {
          return (
            <li
              key={`step-${step.id}-${index}`}
              className="flex items-center justify-start gap-2"
            >
              <StepIndicatorSlot
                stepIndex={index}
                activeStep={activeStep}
                step={step}
              />
              <span>
                {step.label}
              </span>
            </li>
          );
        }
      )}
    </ol>
  );
}
