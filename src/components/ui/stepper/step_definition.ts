import type {
  ForwardedRef,
  RefObject,
  ReactElement,
  RefAttributes,
} from "react";
import { BaseStepperState } from "./base-stepper-state-type";

export interface BaseStep {
  id: string;
  label: string;
  state: "valid" | "invalid" | "unfilled";
}

export interface StepComponentProps {
  step: BaseStep;
  step_index: number;
  className?: string;
}

export interface ValidateStepFnInputOptions {
  searchParams: URLSearchParams;
}

export type StepComponentType = (props: StepComponentProps) => ReactElement;

interface BeforeNextStepOptions<StepperState extends BaseStepperState> {
  state: StepperState;
  getCurrentStep: (state: StepperState) => number;
}

export interface Step<StepperState extends BaseStepperState> extends BaseStep {
  stepComponent: StepComponentType;

  // Will stop if false returned
  beforeNextStep?: (
    opts: BeforeNextStepOptions<StepperState>,
  ) => Promise<boolean>;
}
