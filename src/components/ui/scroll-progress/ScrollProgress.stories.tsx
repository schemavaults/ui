import type { Meta, StoryObj } from "@storybook/react";
import { useRef, type ReactElement, type RefObject } from "react";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import {
  ScrollProgress,
  scrollProgressColorIds,
  scrollProgressSizeIds,
  scrollProgressPositionIds,
  type ScrollProgressProps,
} from "./scroll-progress";

/**
 * Story-friendly wrapper that fills a scroll container and tracks scroll
 * progress within it (rather than relying on the document's scroll, which
 * is awkward to control inside a Storybook iframe).
 */
function ScrollProgressDemo(props: ScrollProgressProps): ReactElement {
  const containerRef: RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);

  return (
    <div className="relative w-[420px] overflow-hidden rounded-lg border border-border bg-background shadow-sm">
      <ScrollProgress {...props} containerRef={containerRef} />
      <div
        ref={containerRef}
        className="h-[360px] overflow-y-auto px-6 pb-6 pt-4 text-sm leading-relaxed text-foreground"
      >
        <h3 className="mb-3 text-base font-semibold">
          Scroll inside this panel
        </h3>
        {Array.from({ length: 24 }).map((_, index) => (
          <p key={index} className="mb-3 text-muted-foreground">
            Section {index + 1}. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo
            consequat.
          </p>
        ))}
      </div>
    </div>
  );
}

const meta = {
  title: "Components/ScrollProgress",
  component: ScrollProgressDemo,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A horizontal scroll progress indicator that fills as the user scrolls. By default it tracks document/window scroll; pass a `containerRef` to instead track scroll inside a specific element (as shown in these stories). Animation uses a spring follow and respects `prefers-reduced-motion`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    position: {
      options: scrollProgressPositionIds,
      control: { type: "radio" },
    },
    size: {
      options: scrollProgressSizeIds,
      control: { type: "radio" },
    },
    color: {
      options: scrollProgressColorIds,
      control: { type: "select" },
    },
    label: {
      control: { type: "text" },
    },
  },
  args: {
    position: "static",
    size: "default",
    color: "default",
    label: "Article scroll progress",
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
} satisfies Meta<typeof ScrollProgressDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    position: "static",
  },
};

export const Small: Story = {
  args: {
    position: "static",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    position: "static",
    size: "lg",
  },
};

export const Brand: Story = {
  args: {
    position: "static",
    color: "brand",
  },
};

export const Primary: Story = {
  args: {
    position: "static",
    color: "primary",
  },
};

export const Positive: Story = {
  args: {
    position: "static",
    color: "positive",
  },
};

export const Warning: Story = {
  args: {
    position: "static",
    color: "warning",
  },
};

export const Destructive: Story = {
  args: {
    position: "static",
    color: "destructive",
  },
};

export const BottomPositioned: Story = {
  args: {
    position: "static",
    size: "lg",
    color: "brand",
  },
  parameters: {
    docs: {
      description: {
        story:
          "In a real application you would typically pass `position=\"top\"` or `position=\"bottom\"` to pin the bar to the viewport. Inside Storybook we use `position=\"static\"` so the bar appears inside the demo panel rather than floating across the iframe.",
      },
    },
  },
};
