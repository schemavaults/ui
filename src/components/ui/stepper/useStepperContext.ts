"use client";

import { useContext } from "react";
import type { StepperContextType } from "./stepper-context-type";
import { StepperContext } from "./stepper-context";
import type { BaseStepperState } from "./base-stepper-state-type";
import type { Step } from "./step_definition";

export function useStepperContext<
  StepperState extends BaseStepperState,
  StepsTypes extends Step<StepperState>[] = Step<StepperState>[],
>(): StepperContextType<StepperState, StepsTypes> {
  const context:
    | StepperContextType<BaseStepperState, Step<BaseStepperState>[]>
    | undefined = useContext(StepperContext);
  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider");
  }
  const preTypeCast: StepperContextType<
    BaseStepperState,
    Step<BaseStepperState>[]
  > = context;

  const withStateType = preTypeCast as unknown as StepperContextType<
    StepperState,
    StepsTypes
  >;
  return withStateType;
}
