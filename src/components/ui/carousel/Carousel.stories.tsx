import type { Meta, StoryObj } from "@storybook/react";
import { type ReactElement, useState } from "react";
import {
  BarChart3,
  Database,
  GitBranch,
  Lock,
  Shield,
  Sparkles,
} from "lucide-react";

import {
  Carousel,
  CarouselItem,
  carouselSizeIds,
  carouselArrowPositionIds,
} from "./carousel";

interface DemoArgs {
  size?: (typeof carouselSizeIds)[number];
  arrowPosition?: (typeof carouselArrowPositionIds)[number];
  loop?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  pauseOnHover?: boolean;
  showArrows?: boolean;
  showIndicators?: boolean;
}

const featurePanels: Array<{
  icon: ReactElement;
  title: string;
  body: string;
}> = [
  {
    icon: <Shield className="h-7 w-7 text-primary" />,
    title: "Encrypted at rest",
    body: "Every vault is sealed with AES-256 before it ever touches disk.",
  },
  {
    icon: <GitBranch className="h-7 w-7 text-primary" />,
    title: "Versioned schemas",
    body: "Each change is a commit — diff, review and roll back with ease.",
  },
  {
    icon: <Database className="h-7 w-7 text-primary" />,
    title: "Composable vaults",
    body: "Stack and reference vaults like building blocks across teams.",
  },
  {
    icon: <Lock className="h-7 w-7 text-primary" />,
    title: "Scoped access",
    body: "Fine-grained, audited permissions down to a single secret.",
  },
];

function CarouselDemo(args: DemoArgs): ReactElement {
  return (
    <div className="w-[640px]">
      <Carousel aria-label="Product highlights" {...args}>
        {featurePanels.map((panel) => (
          <CarouselItem key={panel.title}>
            {panel.icon}
            <h3 className="text-lg font-semibold text-foreground">
              {panel.title}
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {panel.body}
            </p>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
}

const meta = {
  title: "Components/Carousel",
  component: CarouselDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: carouselSizeIds,
      control: { type: "radio" },
    },
    arrowPosition: {
      options: carouselArrowPositionIds,
      control: { type: "radio" },
    },
    loop: { control: { type: "boolean" } },
    autoplay: { control: { type: "boolean" } },
    autoplayInterval: {
      control: { type: "number", min: 1000, max: 10000, step: 500 },
    },
    pauseOnHover: { control: { type: "boolean" } },
    showArrows: { control: { type: "boolean" } },
    showIndicators: { control: { type: "boolean" } },
  },
  args: {
    size: "default",
    arrowPosition: "inside",
    loop: false,
    autoplay: false,
    autoplayInterval: 4000,
    pauseOnHover: true,
    showArrows: true,
    showIndicators: true,
  },
} satisfies Meta<typeof CarouselDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Looping: Story = {
  args: { loop: true },
};

export const Autoplay: Story = {
  args: { autoplay: true, loop: true, autoplayInterval: 3000 },
};

export const ArrowsOutside: Story = {
  args: { arrowPosition: "outside" },
};

export const SmallControls: Story = {
  args: { size: "sm" },
};

export const LargeControls: Story = {
  args: { size: "lg" },
};

export const IndicatorsOnly: Story = {
  args: { showArrows: false },
};

export const ArrowsOnly: Story = {
  args: { showIndicators: false },
};

function ImageCarouselDemo(): ReactElement {
  const slides: Array<{ from: string; label: string }> = [
    { from: "from-primary/30", label: "Overview" },
    { from: "from-secondary/40", label: "Metrics" },
    { from: "from-accent/50", label: "Activity" },
    { from: "from-muted", label: "Settings" },
  ];
  return (
    <div className="w-[680px]">
      <Carousel aria-label="Dashboard preview" loop>
        {slides.map((slide) => (
          <div
            key={slide.label}
            className={`flex h-72 items-center justify-center bg-gradient-to-br ${slide.from} to-background`}
          >
            <div className="flex flex-col items-center gap-2">
              <BarChart3 className="h-10 w-10 text-foreground/70" />
              <span className="text-xl font-semibold text-foreground">
                {slide.label}
              </span>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export const FullBleedSlides: Story = {
  render: () => <ImageCarouselDemo />,
};

function ControlledCarouselDemo(): ReactElement {
  const [index, setIndex] = useState<number>(0);
  return (
    <div className="flex w-[560px] flex-col gap-4">
      <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-4 py-2 text-sm">
        <span className="text-muted-foreground">
          Controlled active index: <strong>{index}</strong>
        </span>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={
                i === index
                  ? "rounded bg-primary px-2 py-1 text-xs text-primary-foreground"
                  : "rounded border border-border px-2 py-1 text-xs text-foreground hover:bg-accent"
              }
            >
              Step {i + 1}
            </button>
          ))}
        </div>
      </div>
      <Carousel
        index={index}
        onIndexChange={setIndex}
        aria-label="Onboarding steps"
        loop
      >
        {["Connect a source", "Map your schema", "Deploy the vault"].map(
          (text, i) => (
            <CarouselItem key={text}>
              <Sparkles className="h-7 w-7 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Step {i + 1}
              </h3>
              <p className="text-sm text-muted-foreground">{text}</p>
            </CarouselItem>
          ),
        )}
      </Carousel>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledCarouselDemo />,
};
