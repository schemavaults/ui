import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { expect, waitFor } from "storybook/test";
import ThemedPageBackground, {
  type ThemedPageBackgroundProps,
} from "./themed-page-background";

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Themed Page Background",
  component: ThemedPageBackground,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    className: {
      control: "text",
    },
    backgroundClassName: {
      control: "text",
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    className: "w-full min-h-screen",
    backgroundClassName: "h-screen",
  } satisfies ThemedPageBackgroundProps,
} satisfies Meta<typeof ThemedPageBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
  args: {},
};

export const CustomGradientColors: Story = {
  args: {
    gradientColors: ["#FFAA00", "#AAFF00"],
  },
};

/**
 * Regression test for the auth-server full-height gradient bug.
 *
 * Every other story renders tall content, so the gradient always *looked* like
 * it filled the screen even when it was (incorrectly) painted on the short
 * inner content wrapper. This story mirrors how the auth-server login /
 * register / reset-password / verify-email pages consume the component: a
 * single small centered card inside a full-height (`min-h-dvh`, i.e.
 * `min-h-[100dvh]`) background container.
 *
 * With minimal content the gradient must STILL cover the full container height
 * (no white space at the bottom). That only holds when the gradient is painted
 * on the full-height background container rather than the content wrapper — see
 * `themed-page-background.tsx`.
 *
 * The decorator supplies a definite viewport-height ancestor so the measurement
 * is deterministic in the Storybook build (the container's height is otherwise
 * sensitive to Tailwind utility source-order).
 */
export const FillsViewportWithMinimalContent: Story = {
  decorators: [
    (Story): ReactElement => (
      <div style={{ height: "100vh", width: "100vw" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    // Mirror the auth-server usage (`min-h-dvh` === `min-h-[100dvh]`).
    className: "items-center justify-center flex",
    backgroundClassName: "grow min-h-dvh h-full no-scrollbar",
    children: (
      <div className="rounded-lg bg-white/90 px-6 py-4 shadow">
        <p>Minimal content</p>
      </div>
    ),
  },
  play: async ({ canvasElement }): Promise<void> => {
    const background = await waitFor((): HTMLElement => {
      const el = canvasElement.querySelector<HTMLElement>(
        ".schemavaults-themed-page-background",
      );
      if (el === null) {
        throw new Error("background container has not rendered yet");
      }
      return el;
    });
    const content = canvasElement.querySelector<HTMLElement>(
      ".schemavaults-themed-page-background-internal-content",
    );
    expect(content).not.toBeNull();

    // The gradient must be painted on the full-bleed background container...
    expect(window.getComputedStyle(background).backgroundImage).toContain(
      "linear-gradient",
    );
    // ...and NOT on the (content-sized) inner wrapper. If the gradient regresses
    // back onto the content wrapper, it only covers the small card and leaves
    // white space below — exactly the auth-server bug this guards against.
    expect(window.getComputedStyle(content!).backgroundImage).toBe("none");

    // Despite only holding a small card, the gradient container fills the full
    // (viewport) height of its ancestor.
    const ancestorHeight: number = window.innerHeight;
    await waitFor((): void => {
      expect(background.getBoundingClientRect().height).toBeGreaterThanOrEqual(
        ancestorHeight - 4,
      );
    });
  },
};
