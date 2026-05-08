import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { ImageIcon, PlayCircle } from "lucide-react";

import {
  AspectRatio,
  ASPECT_RATIO_PRESETS,
  aspectRatioPresetIds,
  aspectRatioRadiusIds,
  type AspectRatioPresetId,
} from "./aspect-ratio";

const sampleImage: string = "/media/example_images/milky-way-1920x1080.webp";
const sampleImageThumb: string = "/media/example_images/milky-way-400x300.webp";

const meta = {
  title: "Components/AspectRatio",
  component: AspectRatio,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "AspectRatio constrains its content to a fixed width-to-height ratio. " +
          "Useful for images, videos, iframes, and embedded media that should keep a consistent shape regardless of viewport size. " +
          "Built on the modern CSS `aspect-ratio` property; `<img>`, `<video>`, and `<iframe>` direct children automatically fill the container. " +
          "Provide either a numeric `ratio` (e.g. `16 / 9`) or a named `preset` (`square`, `video`, `photo`, `wide`, `ultrawide`, `cinema`, `portrait`, `classic-portrait`, `story`).",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    preset: {
      options: aspectRatioPresetIds,
      control: { type: "select" },
    },
    radius: {
      options: aspectRatioRadiusIds,
      control: { type: "radio" },
    },
    bordered: {
      control: { type: "boolean" },
    },
    ratio: {
      control: { type: "number", min: 0.1, max: 10, step: 0.05 },
      description:
        "Numeric width / height. Takes precedence over `preset` when set.",
    },
  },
  args: {
    preset: "video",
    radius: "md",
    bordered: false,
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

const containerStyle = { width: 480 } as const;

/** Default 16:9 video aspect ratio with a sample image. */
export const Default: Story = {
  render: (args): ReactElement => (
    <div style={containerStyle}>
      <AspectRatio {...args}>
        <img src={sampleImage} alt="Milky way over a mountain range" />
      </AspectRatio>
    </div>
  ),
};

/** Square 1:1 ratio - common for avatars, album art, profile tiles. */
export const Square: Story = {
  args: { preset: "square" },
  render: (args): ReactElement => (
    <div style={{ width: 320 }}>
      <AspectRatio {...args}>
        <img src={sampleImageThumb} alt="Milky way thumbnail" />
      </AspectRatio>
    </div>
  ),
};

/** Cinematic 21:9 ultrawide - good for hero banners. */
export const Ultrawide: Story = {
  args: { preset: "ultrawide" },
  render: (args): ReactElement => (
    <div style={{ width: 720 }}>
      <AspectRatio {...args}>
        <img src={sampleImage} alt="Ultrawide milky way banner" />
      </AspectRatio>
    </div>
  ),
};

/** Vertical 9:16 story / mobile reel ratio. */
export const VerticalStory: Story = {
  args: { preset: "story" },
  render: (args): ReactElement => (
    <div style={{ width: 240 }}>
      <AspectRatio {...args}>
        <img src={sampleImage} alt="Vertical story" />
      </AspectRatio>
    </div>
  ),
};

/** Custom numeric ratio - takes precedence over `preset`. */
export const CustomRatio: Story = {
  args: { ratio: 5 / 2 },
  render: (args): ReactElement => (
    <div style={{ width: 600 }}>
      <AspectRatio {...args}>
        <img src={sampleImage} alt="5:2 custom ratio" />
      </AspectRatio>
    </div>
  ),
};

/** With a fallback / placeholder when no media is available. */
export const Placeholder: Story = {
  args: { preset: "video", bordered: true },
  render: (args): ReactElement => (
    <div style={containerStyle}>
      <AspectRatio
        {...args}
        className="bg-muted flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <ImageIcon className="size-8" />
          <span className="text-sm">No image available</span>
        </div>
      </AspectRatio>
    </div>
  ),
};

/** Embed an iframe (e.g. video, map) at a fixed aspect ratio. */
export const IframeEmbed: Story = {
  args: { preset: "video", radius: "lg", bordered: true },
  render: (args): ReactElement => (
    <div style={containerStyle}>
      <AspectRatio {...args}>
        <iframe
          title="Sample embed"
          src="about:blank"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="bg-gradient-to-br from-schemavaults-brand-blue/30 via-violet-500/20 to-fuchsia-500/30"
        />
      </AspectRatio>
    </div>
  ),
};

/** Use an `AspectRatio` as a clickable video thumbnail. */
export const VideoThumbnail: Story = {
  args: { preset: "video", radius: "lg" },
  render: (args): ReactElement => (
    <div style={containerStyle}>
      <AspectRatio {...args} className="group cursor-pointer">
        <img src={sampleImage} alt="Video thumbnail" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
          <PlayCircle className="size-16 text-white drop-shadow-lg transition-transform group-hover:scale-110" />
        </div>
      </AspectRatio>
    </div>
  ),
};

/** Side-by-side comparison of every preset at a fixed width. */
function PresetGridExample(): ReactElement {
  const presets: ReadonlyArray<AspectRatioPresetId> = aspectRatioPresetIds;
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
      {presets.map((preset) => (
        <div key={preset} className="flex flex-col gap-2" style={{ width: 220 }}>
          <AspectRatio preset={preset} radius="md" bordered>
            <img src={sampleImageThumb} alt={`${preset} preset`} />
          </AspectRatio>
          <div className="flex items-baseline justify-between text-xs">
            <span className="font-medium">{preset}</span>
            <span className="text-muted-foreground">
              {ASPECT_RATIO_PRESETS[preset].toFixed(3)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export const AllPresets: Story = {
  render: (): ReactElement => <PresetGridExample />,
  parameters: {
    layout: "padded",
  },
};

/** Showcase every radius variant with a square image. */
function RadiusGridExample(): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {aspectRatioRadiusIds.map((radius) => (
        <div key={radius} className="flex flex-col gap-2" style={{ width: 160 }}>
          <AspectRatio preset="square" radius={radius} bordered>
            <img src={sampleImageThumb} alt={`${radius} radius`} />
          </AspectRatio>
          <span className="text-center text-xs font-medium">{radius}</span>
        </div>
      ))}
    </div>
  );
}

export const AllRadii: Story = {
  render: (): ReactElement => <RadiusGridExample />,
  parameters: {
    layout: "padded",
  },
};

/** Use `asChild` to apply the aspect ratio directly to a child element. */
export const AsChild: Story = {
  args: { preset: "square", radius: "full" },
  render: (args): ReactElement => (
    <div style={{ width: 200 }}>
      <AspectRatio {...args} asChild>
        <img src={sampleImageThumb} alt="Circular thumbnail using asChild" />
      </AspectRatio>
    </div>
  ),
};

/** Card-like media tile composing AspectRatio inside a card surface. */
export const MediaCard: Story = {
  args: { preset: "wide", radius: "md" },
  render: (args): ReactElement => (
    <div
      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 shadow-sm"
      style={{ width: 360 }}
    >
      <AspectRatio {...args}>
        <img src={sampleImage} alt="Galactic vista" />
      </AspectRatio>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold">Galactic vista</h3>
        <p className="text-xs text-muted-foreground">
          Captured from the Atacama desert at 4,200m elevation. The 3:2 wide
          preset frames landscapes naturally without heavy cropping.
        </p>
      </div>
    </div>
  ),
};
