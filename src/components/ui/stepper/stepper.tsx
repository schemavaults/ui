"use client";

import { useMemo, type ReactElement } from "react";

import { Separator } from "@/components/ui/separator";
import type { Step } from "./step_definition";
import { StepperProvider, type StepperProviderProps } from "./stepper-provider";
import { type FooterDecorator, StepperFooter } from "./stepper-footer";
import { StepsIndicator } from "./steps-indicator";
import { StepperBody } from "./stepper-body";
import type { BaseStepperState, StepperProps } from "./stepper-types";

export type { StepperProps };

export function Stepper<
  StepperState extends BaseStepperState,
  StepsTypes extends Step<StepperState>[] = Step<StepperState>[],
>(props: StepperProps<StepperState, StepsTypes>): ReactElement {
  const { steps, state, footer_decorator, setCurrentStep, getCurrentStep, id } =
    props;

  const activeStep: number = useMemo((): number => {
    return getCurrentStep(state);
  }, [getCurrentStep, state]);

  const canGoNext: boolean = useMemo(() => {
    return props.canGoNext({
      state,
      getCurrentStep,
    });
  }, [state, props.canGoNext, getCurrentStep]);

  const canGoBack: boolean = useMemo(() => {
    return props.canGoBack({
      state,
      getCurrentStep,
    });
  }, [state, props.canGoBack, getCurrentStep]);

  return (
    <StepperProvider<StepperState, StepsTypes>
      key={`stepper-${id}`}
      steps={steps}
      activeStep={activeStep}
      canGoNext={canGoNext}
      canGoBack={canGoBack}
      setCurrentStep={setCurrentStep}
    >
      <div className="flex flex-col w-full grow gap-2">
        <StepsIndicator />

        <Separator />

        <StepperBody<StepperState> />

        <Separator />

        <StepperFooter<StepperState>
          decorator={footer_decorator}
          FinalStepSubmitButton={props.FinalStepSubmitButton}
          state={state}
          getCurrentStep={getCurrentStep}
        />
      </div>
    </StepperProvider>
  );
}
