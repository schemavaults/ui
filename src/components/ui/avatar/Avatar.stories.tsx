import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import type { ReactElement } from "react";

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  avatarSizeIds,
  avatarShapeIds,
  avatarGroupSpacingIds,
  avatarGroupStackingIds,
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

// ---------------------------------------------------------------------------
// AvatarGroup
// ---------------------------------------------------------------------------

interface DemoUser {
  initials: string;
  className: string;
}

const demoUsers: DemoUser[] = [
  { initials: "AB", className: "bg-primary text-primary-foreground" },
  { initials: "CD", className: "bg-destructive text-white" },
  { initials: "EF", className: "bg-secondary text-secondary-foreground" },
  { initials: "GH", className: "bg-accent text-accent-foreground" },
  { initials: "IJ", className: "bg-muted text-muted-foreground" },
  { initials: "KL", className: "bg-primary text-primary-foreground" },
  { initials: "MN", className: "bg-destructive text-white" },
];

/**
 * Renders one Avatar per user. Note that none of these set `size` or `shape`:
 * they inherit whatever the surrounding <AvatarGroup> declares.
 */
function demoAvatars(users: DemoUser[]): ReactElement[] {
  return users.map((user) => (
    <Avatar key={user.initials}>
      <AvatarFallback className={user.className}>{user.initials}</AvatarFallback>
    </Avatar>
  ));
}

/** Height of the rendered element behind a `data-slot`, within one group. */
function slotHeight(group: Element, slot: string): number {
  const wrapper: Element | null = group.querySelector(`[data-slot="${slot}"]`);
  const element: Element | null | undefined = wrapper?.firstElementChild;
  if (!element) {
    throw new Error(`No [data-slot="${slot}"] content found in the group`);
  }
  return element.getBoundingClientRect().height;
}

// Avatar group showing multiple users
export const Group: Story = {
  render: (): ReactElement => (
    <AvatarGroup>
      {demoAvatars(demoUsers.slice(0, 5))}
    </AvatarGroup>
  ),
};

// Avatar group with max limit and overflow indicator
export const GroupWithMax: Story = {
  render: (): ReactElement => (
    <AvatarGroup max={3}>
      {demoAvatars(demoUsers)}
    </AvatarGroup>
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);

    // 7 users, max 3 => 3 avatars rendered and a "+4" chip for the rest.
    await expect(
      canvasElement.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(3);
    await expect(canvas.getByText("+4")).toBeInTheDocument();

    // The avatars past `max` are dropped, not just visually hidden.
    await expect(canvas.queryByText("GH")).not.toBeInTheDocument();

    // Screen readers get "+4 more", not a bare "+4".
    const overflow: HTMLElement = canvas.getByText("+4");
    await expect(overflow).toHaveTextContent("+4 more");
  },
};

/**
 * The +N chip is sized from the group, so it lines up with the avatars at
 * every size — it used to be hard-coded to the `default` (40px) avatar and
 * blew out the row on `xs` / `sm` and under-filled it on `lg` / `xl`.
 */
function GroupSizesExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {avatarSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-16 text-xs text-muted-foreground">{size}</span>
          <AvatarGroup size={size} max={3}>
            {demoAvatars(demoUsers)}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

export const GroupSizes: Story = {
  render: (): ReactElement => <GroupSizesExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const groups: NodeListOf<Element> = canvasElement.querySelectorAll(
      '[data-slot="avatar-group"]',
    );
    await expect(groups).toHaveLength(avatarSizeIds.length);

    for (const group of groups) {
      const avatarHeight: number = slotHeight(group, "avatar-group-item");
      const overflowHeight: number = slotHeight(group, "avatar-group-overflow");
      await expect(avatarHeight).toBeGreaterThan(0);
      await expect(overflowHeight).toBe(avatarHeight);
    }
  },
};

/**
 * `shape` is handed down to every avatar in the group, and the separator ring
 * and the +N chip follow it too — square avatars no longer get a circular ring
 * drawn around their corners.
 */
function GroupShapesExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {avatarShapeIds.map((shape) => (
        <div key={shape} className="flex items-center gap-4">
          <span className="w-16 text-xs text-muted-foreground">{shape}</span>
          <AvatarGroup shape={shape} max={4}>
            {demoAvatars(demoUsers)}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

export const GroupShapes: Story = {
  render: (): ReactElement => <GroupShapesExample />,
};

// How deeply the avatars overlap. `none` lays them out side by side instead.
function GroupSpacingExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {avatarGroupSpacingIds.map((spacing) => (
        <div key={spacing} className="flex items-center gap-4">
          <span className="w-16 text-xs text-muted-foreground">{spacing}</span>
          <AvatarGroup spacing={spacing} max={5}>
            {demoAvatars(demoUsers)}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

export const GroupSpacing: Story = {
  render: (): ReactElement => <GroupSpacingExample />,
};

// Which end of the stack sits on top of its neighbour.
function GroupStackingExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {avatarGroupStackingIds.map((stacking) => (
        <div key={stacking} className="flex items-center gap-4">
          <span className="w-24 text-xs text-muted-foreground">{stacking}</span>
          <AvatarGroup stacking={stacking} spacing="tight">
            {demoAvatars(demoUsers.slice(0, 5))}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

export const GroupStacking: Story = {
  render: (): ReactElement => <GroupStackingExample />,
};

/**
 * When you only have a page of members loaded, pass the real headcount as
 * `total` and the chip counts up to it instead of to the number of children.
 */
export const GroupWithTotal: Story = {
  render: (): ReactElement => (
    <AvatarGroup max={3} total={42}>
      {demoAvatars(demoUsers.slice(0, 3))}
    </AvatarGroup>
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("+39")).toBeInTheDocument();
  },
};

/**
 * The separator ring is `ring-background` by default. On any other surface,
 * re-point it with `itemClassName` so the gap matches what is behind it.
 */
function GroupOnCardExample(): ReactElement {
  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
      <span className="text-sm font-medium text-card-foreground">Reviewers</span>
      <AvatarGroup max={4} itemClassName="ring-card">
        {demoAvatars(demoUsers)}
      </AvatarGroup>
    </div>
  );
}

export const GroupOnCard: Story = {
  render: (): ReactElement => <GroupOnCardExample />,
};

// The separator ring can be dropped entirely.
export const GroupWithoutRing: Story = {
  render: (): ReactElement => (
    <AvatarGroup ring={false} spacing="loose">
      {demoAvatars(demoUsers.slice(0, 5))}
    </AvatarGroup>
  ),
};

// Bring your own overflow indicator via `renderOverflow`.
export const GroupCustomOverflow: Story = {
  render: (): ReactElement => (
    <AvatarGroup
      max={3}
      total={12}
      renderOverflow={(overflowCount): ReactElement => (
        <Avatar>
          <AvatarFallback className="bg-primary text-xs text-primary-foreground">
            {overflowCount}+
          </AvatarFallback>
        </Avatar>
      )}
    >
      {demoAvatars(demoUsers)}
    </AvatarGroup>
  ),
};

/**
 * Conditional and fragment children are flattened before counting, so a
 * `null` child never shows up as a phantom "+1".
 */
function GroupConditionalChildrenExample(): ReactElement {
  const showInvited: boolean = false;

  return (
    <AvatarGroup max={4}>
      <>
        {demoAvatars(demoUsers.slice(0, 2))}
      </>
      {showInvited ? (
        <Avatar>
          <AvatarFallback>??</AvatarFallback>
        </Avatar>
      ) : null}
    </AvatarGroup>
  );
}

export const GroupConditionalChildren: Story = {
  render: (): ReactElement => <GroupConditionalChildrenExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    await expect(
      canvasElement.querySelectorAll('[data-slot="avatar-group-item"]'),
    ).toHaveLength(2);
    await expect(
      canvasElement.querySelector('[data-slot="avatar-group-overflow"]'),
    ).toBeNull();
    await expect(canvas.queryByText("??")).not.toBeInTheDocument();
  },
};

// A group of avatars that each override the group size/shape defaults.
export const GroupWithPerAvatarOverrides: Story = {
  render: (): ReactElement => (
    <AvatarGroup size="lg" spacing="tight">
      <Avatar>
        <AvatarImage src={avatarImage} alt="SchemaVaults" />
        <AvatarFallback>SV</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback className="bg-primary text-primary-foreground">
          AB
        </AvatarFallback>
      </Avatar>
      <Avatar size="sm" shape="square">
        <AvatarFallback className="bg-accent text-accent-foreground">
          CD
        </AvatarFallback>
      </Avatar>
    </AvatarGroup>
  ),
};
