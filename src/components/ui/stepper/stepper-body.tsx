"use client";

import { AnimatePresence, m } from "framer-motion";
import { useStepperContext } from "./useStepperContext";
import type { ReactNode } from "react";
import type { Step } from "./step_definition";
import type { BaseStepperState } from "./base-stepper-state-type";

export function StepperBody<StepperState extends BaseStepperState>() {
  const stepperContext = useStepperContext<StepperState>();
  if (!stepperContext) {
    throw new Error("StepperFooter not within StepperContext!");
  }
  const { activeStep, steps } = stepperContext;

  return (
    <div
      className="
        flex flex-col
        w-full h-[40vh]
        justify-start items-start
        overflow-x-hidden
        schemavaults-stepper-body
        no-scrollbar
      "
    >
      <AnimatePresence initial={false} mode="wait">
        {steps.map((step, step_index: number): ReactNode => {
          if (step_index !== activeStep) {
            return null;
          }

          const ActiveStep: Step<StepperState> = steps[activeStep];
          const ActiveStepComponent = ActiveStep.stepComponent;

          // const activeStepDataRef = ActiveStep.data_ref;

          return (
            <m.div
              key={`step-${ActiveStep.id}`}
              initial={{ opacity: 0, x: activeStep > step_index ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeStep > step_index ? -100 : 100 }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                overflowY: "scroll",
                height: "40vh",
                position: "relative",
                top: 0,
                left: 0,
              }}
            >
              <ActiveStepComponent
                key={`step-${step}-${ActiveStep.label}-${ActiveStep.state}`}
                step={ActiveStep}
                step_index={step_index}
                className={"grow bg-background"}
                // ref={activeStepDataRef}
              />
            </m.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
