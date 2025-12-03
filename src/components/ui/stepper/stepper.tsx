"use client";

import { useMemo, type ReactElement } from "react";

import { Separator } from "@/components/ui/separator";
import type { Step } from "./step_definition";
import StepperProvider from "./stepper-provider";
import StepperFooter from "./stepper-footer";
import StepsIndicator from "./steps-indicator";
import StepperBody from "./stepper-body";
import type { BaseStepperState, StepperProps } from "./stepper-types";

export type { StepperProps };

export function Stepper<
  StepperState extends BaseStepperState,
  StepsTypes extends Step<StepperState>[] = Step<StepperState>[],
>({
  steps,
  state,
  footer_decorator,
  setCurrentStep,
  getCurrentStep,
  id,
  canGoNext,
  canGoBack,
  FinalStepSubmitButton,
}: StepperProps<StepperState, StepsTypes>): ReactElement {
  const activeStep: number = useMemo((): number => {
    return getCurrentStep(state);
  }, [getCurrentStep, state]);

  const canGoNextFn: boolean = useMemo(() => {
    return canGoNext({
      state,
      getCurrentStep,
    });
  }, [state, canGoNext, getCurrentStep]);

  const canGoBackFn: boolean = useMemo(() => {
    return canGoBack({
      state,
      getCurrentStep,
    });
  }, [state, canGoBack, getCurrentStep]);

  return (
    <StepperProvider<StepperState, StepsTypes>
      key={`stepper-${id}`}
      steps={steps}
      activeStep={activeStep}
      canGoNext={canGoNextFn}
      canGoBack={canGoBackFn}
      setCurrentStep={setCurrentStep}
    >
      <div className="flex flex-col w-full grow gap-2">
        <StepsIndicator />

        <Separator />

        <StepperBody<StepperState> />

        <Separator />

        <StepperFooter<StepperState>
          decorator={footer_decorator}
          FinalStepSubmitButton={FinalStepSubmitButton}
          state={state}
          getCurrentStep={getCurrentStep}
        />
      </div>
    </StepperProvider>
  );
}
