import type { Meta, StoryObj } from "@storybook/react";
import { FullscreenImage } from "./fullscreen-image";
import type { ComponentProps, ReactElement } from "react";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import { fn } from "@storybook/test";

const meta = {
  title: "Components/Fullscreen Image",
  component: FullscreenImage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "The FullscreenImage component displays an image that can be viewed as fullscreen by clicking on it!",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    src: {
      control: "text",
      description: "Image source for the thumbnail/regular view",
    },
    alt: {
      control: "text",
      description: "Alt text for the image",
    },
    fullscreenSrc: {
      control: "text",
      description: "Optional high-resolution image source for fullscreen view",
    },
    disableZoomCursor: {
      control: "boolean",
      description: "Disable the zoom cursor on hover",
    },
    thumbnailClassName: {
      control: "text",
      description: "Custom className for the thumbnail container",
    },
    fullscreenClassName: {
      control: "text",
      description: "Custom className for the fullscreen image",
    },
  },
  decorators: [
    (Story): ReactElement => {
      return (
        <LazyFramerMotionProvider>
          <Story />
        </LazyFramerMotionProvider>
      );
    },
    (Story): ReactElement => {
      return (
        <div className="w-full h-full min-h-screen flex items-center justify-center">
          <div className="w-[400px] h-[300px]">
            <Story />
          </div>
        </div>
      );
    },
  ],
} satisfies Meta<typeof FullscreenImage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample images for demo purposes
const sampleImage = "https://picsum.photos/400/300?random=1";
const sampleImageHD = "https://picsum.photos/1920/1080?random=1";
const samplePortrait = "https://picsum.photos/300/400?random=2";
const sampleLandscape = "https://picsum.photos/600/300?random=3";

export const Default: Story = {
  args: {
    src: sampleImage,
    alt: "Sample image",
    className: "w-[400px] h-[300px]",
  },
};

export const WithHighResFullscreen: Story = {
  args: {
    src: sampleImage,
    fullscreenSrc: sampleImageHD,
    alt: "Sample image with high-res fullscreen",
    className: "w-[400px] h-[300px]",
  },
};

export const Portrait: Story = {
  args: {
    src: samplePortrait,
    alt: "Portrait image",
    className: "w-48 h-64",
  },
};

export const Landscape: Story = {
  args: {
    src: sampleLandscape,
    alt: "Landscape image",
    className: "w-96 h-48",
  },
};

export const CustomThumbnail: Story = {
  args: {
    src: sampleImage,
    alt: "Custom thumbnail example",
    thumbnail: (
      <div className="w-[400px] h-[300px] bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-semibold rounded-lg">
        Click to view image
      </div>
    ),
  },
};

export const WithCustomStyling: Story = {
  args: {
    src: sampleImage,
    alt: "Custom styled image",
    className: "w-[400px] h-[300px] border-4 border-blue-500",
    thumbnailClassName: "shadow-xl hover:shadow-2xl transition-shadow",
    fullscreenClassName: "border-8 border-white",
  },
};

export const DisableZoomCursor: Story = {
  args: {
    src: sampleImage,
    alt: "No zoom cursor",
    className: "w-[400px] h-[300px]",
    disableZoomCursor: true,
  },
};

export const WithCallbacks: Story = {
  args: {
    src: sampleImage,
    alt: "Image with callbacks",
    className: "w-[400px] h-[300px]",
    onOpen: () => console.log("Fullscreen opened"),
    onClose: () => console.log("Fullscreen closed"),
  },
};

// Mock Next.js Image component for demonstration
const MockCustomImageComponent = ({
  src,
  alt,
  className,
  onLoad,
  ...props
}: ComponentProps<"img">) => (
  <img
    src={src}
    alt={alt}
    className={className}
    onLoad={onLoad}
    style={{
      ...props.style,
      filter: "sepia(20%) saturate(120%)", // Add a filter to show it's using the "Next.js" component
    }}
    {...props}
  />
);

export const WithCustomImageComponent: Story = {
  args: {
    src: sampleImage,
    fullscreenSrc: sampleImageHD,
    alt: "Using Custom Image component (e.g. next/image). However, this 'alt' message should be overwritten by custom props passed!",
    ImageComponent: MockCustomImageComponent,
    imageProps: {
      alt: "Small non-fullscreen image alt message",
    },
    fullscreenImageProps: {
      alt: "Fullscreen image alt message",
    },
    className: "w-[400px] h-[300px]",
  },
};

export const CustomLoadingComponent: Story = {
  args: {
    src: sampleImageHD, // Use HD image to show loading
    alt: "Custom loading component",
    className: "w-[400px] h-[300px]",
    loadingComponent: (
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-white text-sm">Loading high quality image...</p>
      </div>
    ),
  },
};

export const Gallery = {
  render: () => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {Array.from({ length: 6 }, (_, i) => (
        <FullscreenImage
          key={i}
          src={`https://picsum.photos/300/200?random=${i + 10}`}
          fullscreenSrc={`https://picsum.photos/1920/1080?random=${i + 10}`}
          alt={`Gallery image ${i + 1}`}
          className="w-full aspect-[3/2] object-cover"
        />
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "A gallery of images using the FullscreenImage component.",
      },
    },
  },
};
