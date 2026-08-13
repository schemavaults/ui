import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  avatarSizeIds,
  avatarShapeIds,
  avatarGroupSpacingIds,
  avatarGroupDirectionIds,
  type AvatarSizeId,
} from "./avatar";

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

const sampleUsers: Array<{ initials: string; color: string }> = [
  { initials: "AB", color: "bg-primary text-primary-foreground" },
  { initials: "CD", color: "bg-destructive text-white" },
  { initials: "EF", color: "bg-secondary text-secondary-foreground" },
  { initials: "GH", color: "bg-accent text-accent-foreground" },
  { initials: "IJ", color: "bg-muted text-muted-foreground" },
  { initials: "KL", color: "bg-primary text-primary-foreground" },
  { initials: "MN", color: "bg-destructive text-white" },
];

// Avatar group showing multiple users
function AvatarGroupExample(): ReactElement {
  return (
    <AvatarGroup aria-label="Project members">
      {sampleUsers.slice(0, 5).map((user) => (
        <Avatar key={user.initials}>
          <AvatarFallback className={user.color}>{user.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}

export const Group: Story = {
  render: (): ReactElement => <AvatarGroupExample />,
};

// Avatar group with max limit and overflow indicator
function AvatarGroupMaxExample(): ReactElement {
  return (
    <AvatarGroup max={3} aria-label="7 project members">
      {sampleUsers.map((user) => (
        <Avatar key={user.initials}>
          <AvatarFallback className={user.color}>{user.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}

export const GroupWithMax: Story = {
  render: (): ReactElement => <AvatarGroupMaxExample />,
};

// Sized groups — overflow chip and overlap scale with `size`
function AvatarGroupSizesExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {avatarSizeIds.map((size: AvatarSizeId) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-16 text-xs text-muted-foreground">{size}</span>
          <AvatarGroup size={size} max={3} aria-label={`${size} avatar group`}>
            {sampleUsers.slice(0, 6).map((user) => (
              <Avatar key={user.initials} size={size}>
                <AvatarFallback className={user.color}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

export const GroupSizes: Story = {
  render: (): ReactElement => <AvatarGroupSizesExample />,
};

// Square-shape group — overflow chip and rings follow the child shape
function AvatarGroupSquareExample(): ReactElement {
  return (
    <AvatarGroup shape="square" max={3} aria-label="Squad">
      {sampleUsers.slice(0, 6).map((user) => (
        <Avatar key={user.initials} shape="square">
          <AvatarFallback className={user.color}>{user.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}

export const GroupSquare: Story = {
  render: (): ReactElement => <AvatarGroupSquareExample />,
};

// Spacing variants
function AvatarGroupSpacingExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {avatarGroupSpacingIds.map((spacing) => (
        <div key={spacing} className="flex items-center gap-4">
          <span className="w-20 text-xs text-muted-foreground">{spacing}</span>
          <AvatarGroup spacing={spacing} max={4}>
            {sampleUsers.map((user) => (
              <Avatar key={user.initials}>
                <AvatarFallback className={user.color}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

export const GroupSpacing: Story = {
  render: (): ReactElement => <AvatarGroupSpacingExample />,
};

// Stack direction (which avatar paints on top)
function AvatarGroupDirectionExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {avatarGroupDirectionIds.map((direction) => (
        <div key={direction} className="flex items-center gap-4">
          <span className="w-16 text-xs text-muted-foreground">{direction}</span>
          <AvatarGroup direction={direction} spacing="tight" max={4}>
            {sampleUsers.map((user) => (
              <Avatar key={user.initials}>
                <AvatarFallback className={user.color}>
                  {user.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

export const GroupDirection: Story = {
  render: (): ReactElement => <AvatarGroupDirectionExample />,
};

// Custom overflow renderer + accent styling
function AvatarGroupCustomOverflowExample(): ReactElement {
  return (
    <AvatarGroup
      max={3}
      overflowClassName="bg-primary text-primary-foreground"
      renderOverflow={(n): ReactElement => (
        <span className="text-xs">+{n}</span>
      )}
      aria-label="Team"
    >
      {sampleUsers.map((user) => (
        <Avatar key={user.initials}>
          <AvatarFallback className={user.color}>{user.initials}</AvatarFallback>
        </Avatar>
      ))}
    </AvatarGroup>
  );
}

export const GroupCustomOverflow: Story = {
  render: (): ReactElement => <AvatarGroupCustomOverflowExample />,
};
