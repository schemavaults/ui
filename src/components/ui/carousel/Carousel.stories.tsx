import type { Meta, StoryObj } from "@storybook/react";
import { type ReactElement, type ReactNode, useState } from "react";
import {
  BarChart3,
  Boxes,
  Database,
  GitBranch,
  Lock,
  Shield,
  Sparkles,
} from "lucide-react";

import { LazyFramerMotionProvider } from "@/providers/lazy_framer";

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

interface Panel {
  icon: ReactElement;
  title: string;
  body: string;
  /** Theme-token classes so each slide is visually distinct at a glance. */
  chip: string;
  bar: string;
}

const featurePanels: Panel[] = [
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Encrypted at rest",
    body: "Every vault is sealed with AES-256 before it ever touches disk.",
    chip: "bg-primary/10 text-primary",
    bar: "bg-primary",
  },
  {
    icon: <GitBranch className="h-7 w-7" />,
    title: "Versioned schemas",
    body: "Each change is a commit — diff, review and roll back with ease.",
    chip: "bg-accent text-accent-foreground",
    bar: "bg-accent-foreground/60",
  },
  {
    icon: <Boxes className="h-7 w-7" />,
    title: "Composable vaults",
    body: "Stack and reference vaults like building blocks across teams.",
    chip: "bg-secondary text-secondary-foreground",
    bar: "bg-secondary-foreground/50",
  },
  {
    icon: <Lock className="h-7 w-7" />,
    title: "Scoped access",
    body: "Fine-grained, audited permissions down to a single secret.",
    chip: "bg-warning/20 text-foreground",
    bar: "bg-warning",
  },
  {
    icon: <Sparkles className="h-7 w-7" />,
    title: "Smart diffs",
    body: "Only the deltas ship — fast syncs, tiny audit trails.",
    chip: "bg-destructive/10 text-destructive",
    bar: "bg-destructive",
  },
];

function FeatureSlide({
  panel,
  position,
  total,
}: {
  panel: Panel;
  position: number;
  total: number;
}): ReactElement {
  return (
    <CarouselItem className="gap-3">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Slide {position} of {total}
      </span>
      <span
        className={`flex h-14 w-14 items-center justify-center rounded-full ${panel.chip}`}
      >
        {panel.icon}
      </span>
      <h3 className="text-lg font-semibold text-foreground">{panel.title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{panel.body}</p>
      <span className={`mt-1 h-1 w-12 rounded-full ${panel.bar}`} />
    </CarouselItem>
  );
}

function Hint(): ReactElement {
  return (
    <p className="mt-3 text-center text-xs text-muted-foreground">
      Drag to swipe, or use the arrows, the dots, or ←/→ when a dot is focused.
    </p>
  );
}

function CarouselDemo(args: DemoArgs): ReactElement {
  return (
    <div className="w-[640px]">
      <Carousel aria-label="Product highlights" {...args}>
        {featurePanels.map((panel, i) => (
          <FeatureSlide
            key={panel.title}
            panel={panel}
            position={i + 1}
            total={featurePanels.length}
          />
        ))}
      </Carousel>
      <Hint />
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
  decorators: [
    (Story): ReactElement => {
      return (
        <LazyFramerMotionProvider>
          <Story />
        </LazyFramerMotionProvider>
      );
    },
  ],
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

function FullBleedSlide({
  tint,
  label,
  position,
  total,
}: {
  tint: string;
  label: string;
  position: number;
  total: number;
}): ReactElement {
  return (
    <div
      className={`flex h-72 flex-col items-center justify-center gap-2 bg-gradient-to-br ${tint} to-background`}
    >
      <span className="text-xs font-medium uppercase tracking-wider text-foreground/60">
        {position} / {total}
      </span>
      <BarChart3 className="h-10 w-10 text-foreground/70" />
      <span className="text-xl font-semibold text-foreground">{label}</span>
    </div>
  );
}

function ImageCarouselDemo(): ReactElement {
  const slides: Array<{ tint: string; label: string }> = [
    { tint: "from-primary/30", label: "Overview" },
    { tint: "from-accent", label: "Metrics" },
    { tint: "from-secondary", label: "Activity" },
    { tint: "from-warning/30", label: "Audit log" },
    { tint: "from-destructive/25", label: "Settings" },
  ];
  return (
    <div className="w-[680px]">
      <Carousel aria-label="Dashboard preview" loop>
        {slides.map((slide, i) => (
          <FullBleedSlide
            key={slide.label}
            tint={slide.tint}
            label={slide.label}
            position={i + 1}
            total={slides.length}
          />
        ))}
      </Carousel>
      <Hint />
    </div>
  );
}

export const FullBleedSlides: Story = {
  render: () => <ImageCarouselDemo />,
};

function ControlledCarouselDemo(): ReactElement {
  const steps: Array<{ icon: ReactNode; title: string; body: string }> = [
    {
      icon: <Database className="h-7 w-7" />,
      title: "Connect a source",
      body: "Point SchemaVaults at your database or API.",
    },
    {
      icon: <GitBranch className="h-7 w-7" />,
      title: "Map your schema",
      body: "Review the inferred schema and adjust mappings.",
    },
    {
      icon: <Sparkles className="h-7 w-7" />,
      title: "Deploy the vault",
      body: "Ship it — every change is versioned from here on.",
    },
  ];
  const [index, setIndex] = useState<number>(0);
  return (
    <div className="flex w-[560px] flex-col gap-4">
      <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-4 py-2 text-sm">
        <span className="text-muted-foreground">
          Controlled active index: <strong>{index}</strong>
        </span>
        <div className="flex gap-2">
          {steps.map((step, i) => (
            <button
              key={step.title}
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
        {steps.map((step, i) => (
          <CarouselItem key={step.title} className="gap-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Step {i + 1} of {steps.length}
            </span>
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              {step.icon}
            </span>
            <h3 className="text-lg font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {step.body}
            </p>
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledCarouselDemo />,
};
