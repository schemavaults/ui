import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import type { FC, ReactElement } from "react";
import BackgroundBlur, {
  backgroundBlurIntensityVariants,
  type BackgroundBlurProps,
} from "./background-blur";
import Wordmark from "@/components/ui/wordmark";

interface BackgroundBlurExampleProps
  extends Omit<BackgroundBlurProps, "foreground" | "background"> {
  backgroundImageHref: string;
}

function BackgroundBlurExample(
  props: BackgroundBlurExampleProps,
): ReactElement {
  return (
    <BackgroundBlur
      {...props}
      background={() => {
        return (
          <div className="w-full h-full">
            <img
              className="object-cover w-full h-full"
              src={props.backgroundImageHref}
            />
          </div>
        );
      }}
      foreground={() => {
        return (
          <div className="w-full h-full flex items-center justify-center">
            <h2 className="text-4xl">
              Welcome to <Wordmark />
            </h2>
          </div>
        );
      }}
    />
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Background Blur",
  component: BackgroundBlurExample,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    intensity: {
      options: backgroundBlurIntensityVariants,
      control: {
        type: "radio",
      },
    },
    foreground: {
      type: "function",
      table: {
        type: {
          summary: "FC",
        },
      },
      description: "Component to render in front of blur effect.",
    },
    background: {
      type: "function",
      table: {
        type: {
          summary: "FC",
        },
      },
      description: "Component to render behind blur effect.",
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
  decorators: [
    (Story, context) => {
      return (
        <main className="w-full min-h-screen">
          <Story {...context} />
        </main>
      );
    },
  ],
} satisfies Meta<typeof BackgroundBlurExample & FC<BackgroundBlurProps>>;

export default meta;
type Story = StoryObj<typeof meta>;

const exampleBackgroundImageSrc: string =
  "https://www.goodfreephotos.com/albums/astrophotography/starry-milky-way-galaxy.jpg";

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {
    intensity: "xs",
    backgroundImageHref: exampleBackgroundImageSrc,
  },
};
