"use client";

import {
  RefObject,
  useState,
  useTransition,
  type PropsWithChildren,
  type ReactElement,
} from "react";
import type { Step } from "./step_definition";
import { useStepperContext } from "./useStepperContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, m } from "framer-motion";
import { Button } from "../button";
import { useToast } from "@/components/hooks/use-toast";
import type { BaseStepperState } from "./base-stepper-state-type";

export type FooterDecorator = ({ children }: PropsWithChildren) => ReactElement;

export interface StepperFooterProps<StepperState extends BaseStepperState> {
  decorator?: FooterDecorator;
  FinalStepSubmitButton?: () => ReactElement;
  state: StepperState;
  getCurrentStep: (state: StepperState) => number;
}

export function StepperFooter<StepperState extends BaseStepperState>({
  decorator,
  FinalStepSubmitButton,
  state,
  getCurrentStep,
}: StepperFooterProps<StepperState>): ReactElement {
  const stepperContext = useStepperContext<StepperState>();
  if (!stepperContext) {
    throw new Error("StepperFooter not within StepperContext!");
  }
  const { activeStep, steps, nextStep, prevStep } = stepperContext;

  function AnimatedFooterComponent(): ReactElement {
    const active: Step<StepperState> = steps[activeStep];
    const isFirstStep: boolean = activeStep === 0;
    const isLastStep: boolean = activeStep === steps.length - 1;

    const isNextButtonVisible: boolean = !isLastStep;
    const nextButtonLabel: string = "Next step";

    const isPreviousButtonVisible: boolean = !isFirstStep;
    const previousButtonLabel: string = "Previous step";

    const canGoBack: boolean = isPreviousButtonVisible;
    const canGoNext: boolean = isNextButtonVisible && stepperContext.canGoNext;

    const NextIconComponent: ({
      className,
    }: {
      className?: string;
    }) => ReactElement = ({ className }) => {
      return <ArrowRight className={className} />;
    };

    const BackIconComponent: ({
      className,
    }: {
      className?: string;
    }) => ReactElement = ({ className }) => {
      return <ArrowLeft className={className} />;
    };

    const [navigating, setNavigating] = useState<boolean>(false);

    const { toast } = useToast();

    const goNextStep = (): void => {
      setNavigating(true);

      async function checkIfCanGoNextStep(): Promise<boolean> {
        let isValid: boolean = true;

        if (
          "beforeNextStep" in active &&
          typeof active.beforeNextStep === "function"
        ) {
          isValid = await active.beforeNextStep({
            state,
            getCurrentStep,
          });
        }
        return isValid;
      } // end of checkIfCanGoNextStep

      checkIfCanGoNextStep()
        .then((isValid: boolean) => {
          if (isValid) {
            nextStep();
          } else {
            toast({
              variant: "destructive",
              title: "Please check this step's inputs again",
              description: "Validation failed to move to the next step",
            });
          }
        })
        .catch((e) => {
          toast({
            variant: "destructive",
            title: "Failed to check if this step's inputs are valid!",
            description:
              e instanceof Error ? e.message : "An unknown error occurred!",
          });
        })
        .finally(() => {
          try {
            setNavigating(false);
          } catch (e: unknown) {}
        });
    };

    return (
      <AnimatePresence initial={false} mode="wait">
        <m.div
          key={active.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "end",
            flexWrap: "nowrap",
            gap: 2,
          }}
        >
          {isPreviousButtonVisible && (
            <Button
              type="submit"
              disabled={!canGoBack || navigating}
              onClick={prevStep}
              variant={"secondary"}
            >
              <BackIconComponent className="h-4 w-4 mr-2" />
              {previousButtonLabel}
            </Button>
          )}
          {isNextButtonVisible && (
            <Button
              type="submit"
              disabled={!canGoNext || navigating}
              onClick={goNextStep}
            >
              <NextIconComponent className="h-4 w-4 mr-2" />
              {nextButtonLabel}
            </Button>
          )}
          {typeof FinalStepSubmitButton === "function" && isLastStep && (
            <FinalStepSubmitButton />
          )}
        </m.div>
      </AnimatePresence>
    );
  }

  if (typeof decorator === "function") {
    const Decorator = decorator;
    return (
      <Decorator>
        <AnimatedFooterComponent />
      </Decorator>
    );
  }

  return <AnimatedFooterComponent />;
}
