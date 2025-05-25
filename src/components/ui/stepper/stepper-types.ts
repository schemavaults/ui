import type { ReactElement } from "react";
import type { Step } from "./step_definition";
import type { FooterDecorator } from "./stepper-footer";
import type { BaseStepperState } from "./base-stepper-state-type";

export type { BaseStepperState };

type GetCurrentStepSelector<StepperState extends BaseStepperState> = (
  state: StepperState,
) => number;

interface ICanMoveStepsFnContext<StepperState extends BaseStepperState> {
  state: StepperState;
  getCurrentStep: GetCurrentStepSelector<StepperState>;
}

export interface StepperProps<
  StepperState extends BaseStepperState,
  StepsTypes extends Step<StepperState>[] = Step<StepperState>[],
> {
  footer_decorator?: FooterDecorator;
  FinalStepSubmitButton?: () => ReactElement;
  getCurrentStep: GetCurrentStepSelector<StepperState>;
  id: string; // stepper id
  canGoNext: (opts: ICanMoveStepsFnContext<StepperState>) => boolean;
  canGoBack: (opts: ICanMoveStepsFnContext<StepperState>) => boolean;
  steps: StepsTypes;
  state: StepperState;
  setCurrentStep: (newCurrentStep: number) => void;
}
