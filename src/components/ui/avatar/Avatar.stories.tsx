import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { avatarSizeIds, avatarShapeIds } from "./avatar-variants";

// Sample image within storybook-assets/ folder for demo purposes
const avatarImage: string = "/media/example_images/avatar-placeholder.svg";

const meta = {
  title: "Components/Avatar",
  component: Avatar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: avatarSizeIds,
      control: {
        type: "radio",
      },
    },
    shape: {
      options: avatarShapeIds,
      control: {
        type: "radio",
      },
    },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic avatar with an image
export const WithImage: Story = {
  render: (args): ReactElement => (
    <Avatar {...args}>
      <AvatarImage
        src={avatarImage}
        alt="SchemaVaults"
      />
      <AvatarFallback>SV</AvatarFallback>
    </Avatar>
  ),
};

// Avatar with fallback initials (no image)
export const WithFallback: Story = {
  render: (args): ReactElement => (
    <Avatar {...args}>
      <AvatarFallback>JD</AvatarFallback>
    </Avatar>
  ),
};

// All sizes
function SizesExample(): ReactElement {
  return (
    <div className="flex items-end gap-4">
      {avatarSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size}>
            <AvatarFallback>SV</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  );
}

export const Sizes: Story = {
  render: (): ReactElement => <SizesExample />,
};

// Circle vs Square shapes
function ShapesExample(): ReactElement {
  return (
    <div className="flex items-center gap-6">
      {avatarShapeIds.map((shape) => (
        <div key={shape} className="flex flex-col items-center gap-2">
          <Avatar shape={shape}>
            <AvatarFallback>SV</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{shape}</span>
        </div>
      ))}
    </div>
  );
}

export const Shapes: Story = {
  render: (): ReactElement => <ShapesExample />,
};

// Avatar with broken image shows fallback
export const BrokenImage: Story = {
  render: (args): ReactElement => (
    <Avatar {...args}>
      <AvatarImage
        src="https://broken-link.example.com/image.jpg"
        alt="Broken"
      />
      <AvatarFallback>BR</AvatarFallback>
    </Avatar>
  ),
};

// Custom styled fallback
export const CustomFallback: Story = {
  render: (args): ReactElement => (
    <Avatar {...args}>
      <AvatarFallback className="bg-primary text-primary-foreground">
        AB
      </AvatarFallback>
    </Avatar>
  ),
};

// Destructive-styled fallback
export const DestructiveFallback: Story = {
  render: (args): ReactElement => (
    <Avatar {...args}>
      <AvatarFallback className="bg-destructive text-white">
        !
      </AvatarFallback>
    </Avatar>
  ),
};

// NOTE: `AvatarGroup` now has its own story file — see `AvatarGroup.stories.tsx`.
