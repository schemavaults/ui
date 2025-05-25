import { createContext } from "react";
import type { StepperContextType } from "./stepper-context-type";
import { BaseStepperState } from "./base-stepper-state-type";

export const StepperContext = createContext<
  StepperContextType<BaseStepperState> | undefined
>(undefined);
