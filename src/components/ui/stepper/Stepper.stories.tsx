import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";
import { Stepper, type StepperProps } from "./stepper";
import type { Step } from "./step_definition";
import type { BaseStepperState } from "./base-stepper-state-type";
import { type ReactElement, useState } from "react";
import { LazyFramerMotionProvider } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/hooks";
import Button from "@/components/ui/button";
import { fn } from "@storybook/test";

interface ExampleStepperState extends BaseStepperState {
  currentStep: number;
}

function ExampleStepComponent({ message }: { message: string }): ReactElement {
  return (
    <div className="relative">
      <p className="font-bold">{message}</p>
    </div>
  );
}

const exampleSteps: Step<ExampleStepperState>[] = [
  {
    id: "step-1",
    label: "Step 1",
    stepComponent: () => <ExampleStepComponent message="Step one content!" />,
    state: "unfilled",
    beforeNextStep: async (): Promise<boolean> => {
      return true;
    },
  },
  {
    id: "step-2",
    label: "Step 2",
    stepComponent: () => <ExampleStepComponent message="Step two content!" />,
    state: "unfilled",
    beforeNextStep: async (): Promise<boolean> => {
      return true;
    },
  },
  {
    id: "step-3",
    label: "Step 3",
    stepComponent: () => <ExampleStepComponent message="Step three content!" />,
    state: "unfilled",
    beforeNextStep: async (): Promise<boolean> => {
      return true;
    },
  },
];

interface ExampleStepperProps
  extends Omit<
    StepperProps<ExampleStepperState>,
    | "steps"
    | "state"
    | "getCurrentStep"
    | "setCurrentStep"
    | "canGoNext"
    | "canGoBack"
  > {}

function ExampleStepper(props: ExampleStepperProps): ReactElement {
  const steps = exampleSteps;

  const [state, setState] = useState<ExampleStepperState>({
    currentStep: 0,
  });

  const { toast } = useToast();

  function getCurrentStep(state: ExampleStepperState): number {
    return state.currentStep;
  }

  return (
    <Stepper
      {...props}
      steps={exampleSteps}
      state={state}
      setCurrentStep={(newStep: number): void => {
        setState({
          currentStep: newStep,
        });
      }}
      getCurrentStep={(state: ExampleStepperState): number =>
        getCurrentStep(state)
      }
      canGoNext={(opts): boolean => {
        const currentStep: number = opts.getCurrentStep(opts.state);
        return currentStep < steps.length;
      }}
      canGoBack={(opts): boolean => {
        const currentStep: number = opts.getCurrentStep(opts.state);
        return currentStep > 0;
      }}
      FinalStepSubmitButton={() => {
        return (
          <Button
            onClick={() => {
              fn();
              toast({
                variant: "default",
                title: "Pretending to submit <Stepper />",
                description: "This is just a drill 🤙 Remain calm.",
              });
            }}
          >
            Submit Stepper
          </Button>
        );
      }}
    />
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Stepper",
  component: ExampleStepper,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "padded",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    id: "stepper",
  },
  decorators: [
    (Story): ReactElement => {
      return (
        <LazyFramerMotionProvider>
          <Story />
          <Toaster />
        </LazyFramerMotionProvider>
      );
    },
  ],
} satisfies Meta<typeof ExampleStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const DefaultStepper: Story = {
  args: {},
};
