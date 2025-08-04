import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { useEffect, useState, type ReactElement } from "react";
import { TypewriterEffect, TypewriterEffectProps } from "./typewriter-effect";
import { AnimatePresence } from "@/framer-motion";
import { LazyFramerMotionProvider } from "@/components/providers";

const exampleMessage1: string[] = [..."Hello there! "];
exampleMessage1.push("👋");

const exampleMessage2: string[] = [..."What's going on? "];
exampleMessage2.push("🤠");

const exampleMessage3: string[] = [..."@schemavaults/ui is the best! "];
exampleMessage3.push("🤩");

const exampleMessages: string[][] = [
  exampleMessage1,
  exampleMessage2,
  exampleMessage3,
];

interface TypewriterEffectExampleProps
  extends Omit<TypewriterEffectProps, "message"> {
  initial: boolean;
}

function TypewriterEffectExample(
  props: TypewriterEffectExampleProps,
): ReactElement {
  const [activeMessageIndex, setActiveMessageIndex] = useState<number | null>(
    props.initial ? null : 0,
  );

  useEffect(() => {
    if (typeof activeMessageIndex !== "number") {
      setActiveMessageIndex(0);
    }
  }, [activeMessageIndex]);

  const activeMessage: string[] | undefined =
    typeof activeMessageIndex === "number"
      ? exampleMessages[activeMessageIndex]
      : undefined;

  return (
    <main className="w-full h-full min-h-screen flex flex-col items-center justify-center">
      <AnimatePresence mode="wait" initial={props.initial}>
        {Array.isArray(activeMessage) && (
          <TypewriterEffect
            key={activeMessage.join("")}
            message={activeMessage}
            duration={props.duration}
            initial={props.initial}
            onComplete={(x: "enter" | "exit"): void => {
              props.onComplete(x);
              const delayNextMessageMs: number = 1500;
              setTimeout(() => {
                try {
                  if (x === "enter" && typeof activeMessageIndex === "number") {
                    const currentMessageIndex: number = activeMessageIndex;
                    setActiveMessageIndex(
                      (currentMessageIndex + 1) % exampleMessages.length,
                    );
                  }
                } catch (e: unknown) {}
              }, delayNextMessageMs);
            }}
            className={props.className}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Typewriter Effect",
  component: TypewriterEffectExample,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    duration: {
      type: "number",
      control: {
        min: 0,
        type: "number",
      },
    },
    className: {
      type: "string",
      control: {
        type: "text",
      },
    },
    onComplete: {
      type: "function",
      description:
        "A callback that is triggered whenever the typewriter effect finishes entering or exiting",
    },
    initial: {
      description: "Allow disabling initial entrance animation",
      type: "boolean",
      control: {
        type: "boolean",
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    duration: 2.0,
    onComplete: fn(),
    className: "text-4xl text-center",
    initial: true,
  },
  decorators: [
    (Story): ReactElement => {
      return (
        <LazyFramerMotionProvider>
          <Story />
        </LazyFramerMotionProvider>
      );
    },
  ],
} satisfies Meta<typeof TypewriterEffectExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {},
};

export const InitialEntryDisabled: Story = {
  args: {
    initial: false,
  },
};
