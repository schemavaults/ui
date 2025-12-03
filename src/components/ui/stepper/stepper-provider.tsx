"use client";

import type { PropsWithChildren, ReactElement } from "react";
import type { Step } from "./step_definition";
import { StepperContext } from "./stepper-context";
import type { BaseStepperState } from "./base-stepper-state-type";
import { StepperContextType } from "./stepper-context-type";

export interface StepperProviderProps<
  StepperState extends BaseStepperState,
  StepsTypes extends Step<StepperState>[] = Step<StepperState>[],
> extends PropsWithChildren {
  steps: StepsTypes;
  activeStep: number;
  canGoNext: boolean;
  canGoBack: boolean;
  setCurrentStep: (step_index: number) => void;
}

export function StepperProvider<
  StepperState extends BaseStepperState,
  StepsTypes extends Step<StepperState>[] = Step<StepperState>[],
>({
  children,
  steps,
  activeStep,
  canGoNext,
  canGoBack,
  setCurrentStep,
}: StepperProviderProps<StepperState, StepsTypes>): ReactElement {
  const totalSteps: number = steps.length;
  if (totalSteps < 1) {
    throw new Error("No steps provided to stepper!");
  }

  const currentStep: number = activeStep;

  const nextStep = (): void => {
    if (canGoNext) {
      const newActiveStep: number = Math.min(currentStep + 1, totalSteps - 1);
      if (process.env.NODE_ENV === "development") {
        console.log("[nextStep] New Active Step: ", newActiveStep);
      }
      setCurrentStep(newActiveStep);
    }
  };

  const prevStep = (): void => {
    if (canGoBack) {
      const newActiveStep: number = Math.max(currentStep - 1, 0);
      if (process.env.NODE_ENV === "development") {
        console.log("[prevStep] New Active Step: ", newActiveStep);
      }
      setCurrentStep(newActiveStep);
    }
  };

  const contextValue: StepperContextType<StepperState, StepsTypes> = {
    steps,
    nextStep,
    prevStep,
    activeStep: currentStep,
    canGoNext,
  };

  const contextWithoutGenericType: StepperContextType<
    BaseStepperState,
    Step<BaseStepperState>[]
  > = contextValue as unknown as StepperContextType<
    BaseStepperState,
    Step<BaseStepperState>[]
  >;

  return (
    <StepperContext.Provider value={contextWithoutGenericType}>
      {children}
    </StepperContext.Provider>
  );
}

export default StepperProvider;
