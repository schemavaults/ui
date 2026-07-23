import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { ArrowUp, ChevronsUp, Rocket } from "lucide-react";
import { useRef, type ReactElement, type RefObject } from "react";

import {
  ScrollToTop,
  scrollToTopPositionIds,
  scrollToTopSizeIds,
  scrollToTopVariantIds,
  type ScrollToTopPositionId,
  type ScrollToTopSizeId,
  type ScrollToTopVariantId,
} from "./scroll-to-top";

interface ScrollToTopExampleProps {
  variant?: ScrollToTopVariantId;
  size?: ScrollToTopSizeId;
  position?: ScrollToTopPositionId;
  label?: string;
  threshold?: number;
  alwaysVisible?: boolean;
  onScrolledToTop?: () => void;
}

/**
 * Story-friendly wrapper that hosts a scrollable container. In real apps,
 * you would typically omit `containerRef` so the button tracks and scrolls
 * the window; here we scope everything to a container so the button appears
 * inside the demo panel rather than floating across the Storybook iframe.
 */
function ScrollToTopExample({
  variant,
  size,
  position = "bottom-right",
  label,
  threshold,
  alwaysVisible,
  onScrolledToTop,
}: ScrollToTopExampleProps): ReactElement {
  const containerRef: RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement | null>(null);
  const isFixed: boolean = position !== "static";

  return (
    <div className="relative w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div
        ref={containerRef}
        data-testid="scroll-to-top-container"
        className="h-[420px] overflow-y-auto p-6"
      >
        <div className="space-y-4 pb-24">
          <div className="rounded-md border border-dashed border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            Scroll this panel down past the threshold to reveal the button in
            the bottom corner. Click it to smoothly scroll back to the top.
          </div>
          {Array.from({ length: 22 }).map((_, idx) => (
            <p
              key={idx}
              className="text-sm leading-relaxed text-muted-foreground"
            >
              <span className="font-semibold text-foreground">
                Section {idx + 1}.
              </span>{" "}
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
          ))}
        </div>
      </div>
      <ScrollToTop
        containerRef={containerRef}
        variant={variant}
        size={size}
        position={position}
        label={label}
        threshold={threshold}
        alwaysVisible={alwaysVisible}
        onScrolledToTop={onScrolledToTop}
        className={isFixed ? "absolute" : undefined}
      />
    </div>
  );
}

const meta = {
  title: "Components/ScrollToTop",
  component: ScrollToTopExample,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A floating 'back to top' button that appears once the user scrolls past a configurable threshold and smoothly scrolls the page (or an embedded container) back to the top. Complements `FloatingActionButton` (which is generic) and `ScrollProgress` (which visualises how far along the reader is). Respects `prefers-reduced-motion`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: scrollToTopVariantIds,
      control: { type: "select" },
    },
    size: {
      options: scrollToTopSizeIds,
      control: { type: "radio" },
    },
    position: {
      options: scrollToTopPositionIds,
      control: { type: "select" },
    },
    label: {
      control: { type: "text" },
    },
    threshold: {
      control: { type: "number", min: 0, step: 40 },
    },
    alwaysVisible: {
      control: { type: "boolean" },
    },
  },
  args: {
    variant: "primary",
    size: "default",
    position: "bottom-right",
    threshold: 120,
    alwaysVisible: false,
    onScrolledToTop: fn(),
  },
} satisfies Meta<typeof ScrollToTopExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const AlwaysVisible: Story = {
  args: {
    alwaysVisible: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "`alwaysVisible` bypasses the scroll-threshold gate so the button is always rendered — handy for reviewing style/variant work without having to scroll first.",
      },
    },
  },
};

export const Extended: Story = {
  args: {
    alwaysVisible: true,
    label: "Back to top",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Passing a `label` switches the button to its extended pill layout — useful when there's ambient space and you want the affordance to be unambiguous.",
      },
    },
  },
};

export const Brand: Story = {
  args: {
    alwaysVisible: true,
    variant: "brand",
    label: "Back to top",
  },
};

export const Outline: Story = {
  args: {
    alwaysVisible: true,
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    alwaysVisible: true,
    variant: "ghost",
  },
  parameters: {
    docs: {
      description: {
        story:
          "The `ghost` variant uses a translucent, blurred background so the button reads clearly on top of complex, colourful page content without dominating it.",
      },
    },
  },
};

export const Small: Story = {
  args: {
    alwaysVisible: true,
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    alwaysVisible: true,
    size: "lg",
  },
};

export const BottomLeft: Story = {
  args: {
    alwaysVisible: true,
    position: "bottom-left",
  },
};

export const BottomCenter: Story = {
  args: {
    alwaysVisible: true,
    position: "bottom-center",
  },
};

function AllVariantsExample(): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
      {scrollToTopVariantIds.map((variant) => (
        <div
          key={variant}
          className="flex flex-col items-center gap-3 rounded-md border border-border bg-card p-6"
        >
          <ScrollToTop
            position="static"
            variant={variant}
            alwaysVisible
            aria-label={`${variant} scroll to top`}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {variant}
          </span>
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: (): ReactElement => <AllVariantsExample />,
  args: {},
};

function AllSizesExample(): ReactElement {
  return (
    <div className="flex flex-wrap items-end gap-6">
      {scrollToTopSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-3">
          <ScrollToTop
            position="static"
            size={size}
            alwaysVisible
            aria-label={`${size} scroll to top`}
          />
          <span className="text-xs font-medium text-muted-foreground">
            {size}
          </span>
        </div>
      ))}
    </div>
  );
}

export const AllSizes: Story = {
  render: (): ReactElement => <AllSizesExample />,
  args: {},
};

function CustomIconsExample(): ReactElement {
  return (
    <div className="flex flex-wrap items-center gap-6">
      <ScrollToTop
        position="static"
        alwaysVisible
        icon={<ArrowUp />}
        aria-label="Arrow up"
      />
      <ScrollToTop
        position="static"
        variant="secondary"
        alwaysVisible
        icon={<ChevronsUp />}
        aria-label="Chevrons up"
      />
      <ScrollToTop
        position="static"
        variant="brand"
        alwaysVisible
        icon={<Rocket />}
        label="Blast off"
      />
    </div>
  );
}

export const CustomIcons: Story = {
  render: (): ReactElement => <CustomIconsExample />,
  args: {},
};

export const ScrollInteraction: Story = {
  args: {
    threshold: 120,
    variant: "brand",
    onScrolledToTop: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interaction test: scrolls the container down past the threshold, waits for the button to become visible, clicks it, and asserts the container scrolls back to the top.",
      },
    },
  },
  play: async ({ canvasElement, args }): Promise<void> => {
    const canvas = within(canvasElement);

    const container = canvas.getByTestId(
      "scroll-to-top-container",
    ) as HTMLDivElement;

    // Not visible at rest.
    expect(canvas.queryByRole("button", { name: "Scroll to top" })).toBeNull();

    // Scroll past the threshold.
    container.scrollTop = 600;
    container.dispatchEvent(new Event("scroll"));

    const button = await canvas.findByRole("button", { name: "Scroll to top" });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);

    await waitFor((): void => {
      expect(container.scrollTop).toBe(0);
    });

    expect(args.onScrolledToTop).toHaveBeenCalled();
  },
};
