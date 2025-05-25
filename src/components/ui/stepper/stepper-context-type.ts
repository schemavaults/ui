import type { BaseStepperState } from "./base-stepper-state-type";
import type { Step } from "./step_definition";

export interface StepperContextType<
  StepperState extends BaseStepperState,
  StepsTypes extends Step<StepperState>[] = Step<StepperState>[],
> {
  activeStep: number;
  steps: StepsTypes;
  nextStep: () => void;
  prevStep: () => void;
  canGoNext: boolean;
}
