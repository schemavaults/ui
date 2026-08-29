import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import type { ReactElement } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { AvatarGroup } from "./avatar-group";
import {
  avatarGroupSpacingIds,
  avatarShapeIds,
  avatarSizeIds,
} from "./avatar-variants";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../tooltip";

const avatarImage: string = "/media/example_images/avatar-placeholder.svg";

interface DemoUser {
  name: string;
  initials: string;
  className: string;
}

const users: DemoUser[] = [
  { name: "Ada Byron", initials: "AB", className: "bg-primary text-primary-foreground" },
  { name: "Carl Djerassi", initials: "CD", className: "bg-destructive text-white" },
  { name: "Edsger Floyd", initials: "EF", className: "bg-secondary text-secondary-foreground" },
  { name: "Grace Hopper", initials: "GH", className: "bg-accent text-accent-foreground" },
  { name: "Ida Jones", initials: "IJ", className: "bg-muted text-muted-foreground" },
  { name: "Ken Lamport", initials: "KL", className: "bg-primary text-primary-foreground" },
  { name: "Margaret Newell", initials: "MN", className: "bg-destructive text-white" },
];

function userAvatars(count: number = users.length): ReactElement[] {
  return users.slice(0, count).map((user) => (
    <Avatar key={user.initials}>
      <AvatarFallback className={user.className}>{user.initials}</AvatarFallback>
    </Avatar>
  ));
}

const meta = {
  title: "Components/AvatarGroup",
  component: AvatarGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Overlapping stack of `Avatar`s for showing the people attached to a vault, a document, or a run. `size` and `shape` are declared once on the group and inherited by every child avatar **and** by the `+N` overflow chip, so the stack stays visually consistent at any scale. The overlap amount is resolved per-size, so an `xs` stack and an `xl` stack overlap by the same proportion. Colors come entirely from `@schemavaults/theme` tokens (`background` for the separating rings, `muted`/`muted-foreground` for the overflow chip), so the group reads correctly in both light and dark mode.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: avatarSizeIds,
      control: { type: "radio" },
    },
    shape: {
      options: avatarShapeIds,
      control: { type: "radio" },
    },
    spacing: {
      options: avatarGroupSpacingIds,
      control: { type: "radio" },
    },
    max: { control: { type: "number" } },
    total: { control: { type: "number" } },
    ring: { control: { type: "boolean" } },
  },
  args: {
    size: "default",
    shape: "circle",
    spacing: "default",
    ring: true,
  },
} satisfies Meta<typeof AvatarGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args): ReactElement => (
    <AvatarGroup {...args}>
      {userAvatars(5)}
    </AvatarGroup>
  ),
};

/** Collapse everything past `max` into a `+N` chip. */
export const WithMax: Story = {
  args: { max: 3 },
  render: (args): ReactElement => (
    <AvatarGroup {...args}>
      {userAvatars()}
    </AvatarGroup>
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    // 3 avatars rendered, the other 4 folded into the chip.
    await expect(canvas.getByText("AB")).toBeInTheDocument();
    await expect(canvas.getByText("EF")).toBeInTheDocument();
    await expect(canvas.queryByText("GH")).not.toBeInTheDocument();
    await expect(canvas.getByText("+4")).toBeInTheDocument();
  },
};

/**
 * When the server only sends the first few members, pass the real headcount as
 * `total` and the chip counts the members you never received.
 */
export const WithTotalCount: Story = {
  args: { max: 4, total: 128 },
  render: (args): ReactElement => (
    <AvatarGroup {...args}>
      {userAvatars(4)}
    </AvatarGroup>
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("+124")).toBeInTheDocument();
  },
};

/**
 * The overflow chip inherits the group's `size`. Previously it was hardcoded to
 * `h-10 w-10`, so it towered over an `xs` stack and got swallowed by an `xl`
 * one — this story is the regression guard for that.
 */
function AllSizesExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {avatarSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-4">
          <span className="w-16 text-xs text-muted-foreground">{size}</span>
          <AvatarGroup size={size} max={3} data-testid={`group-${size}`}>
            {userAvatars()}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

export const AllSizes: Story = {
  render: (): ReactElement => <AllSizesExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    for (const size of avatarSizeIds) {
      const group = canvas.getByTestId(`group-${size}`);
      const chip = within(group).getByText("+4");
      const firstAvatar = within(group).getByText("AB");
      // The chip must be laid out at exactly the same box size as the avatars
      // it is standing in for.
      expect(chip.getBoundingClientRect().width).toBeCloseTo(
        firstAvatar.getBoundingClientRect().width,
        0,
      );
    }
  },
};

/** `shape` propagates to the child avatars, the overflow chip, and the rings. */
function AllShapesExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {avatarShapeIds.map((shape) => (
        <div key={shape} className="flex items-center gap-4">
          <span className="w-16 text-xs text-muted-foreground">{shape}</span>
          <AvatarGroup shape={shape} max={4}>
            {userAvatars()}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

export const AllShapes: Story = {
  render: (): ReactElement => <AllShapesExample />,
};

/** How much neighboring avatars overlap. */
function AllSpacingsExample(): ReactElement {
  return (
    <div className="flex flex-col gap-6">
      {avatarGroupSpacingIds.map((spacing) => (
        <div key={spacing} className="flex items-center gap-4">
          <span className="w-16 text-xs text-muted-foreground">{spacing}</span>
          <AvatarGroup spacing={spacing} max={5}>
            {userAvatars()}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

export const AllSpacings: Story = {
  render: (): ReactElement => <AllSpacingsExample />,
};

/** Photos, initials, and a conditionally-rendered avatar all in one stack. */
function MixedContentExample(): ReactElement {
  const showPendingInvite = false;

  return (
    <AvatarGroup size="lg" max={4} data-testid="mixed-group">
      <Avatar>
        <AvatarImage src={avatarImage} alt="SchemaVaults" />
        <AvatarFallback>SV</AvatarFallback>
      </Avatar>
      {showPendingInvite ? (
        <Avatar>
          <AvatarFallback>PI</AvatarFallback>
        </Avatar>
      ) : null}
      {userAvatars(5)}
    </AvatarGroup>
  );
}

export const MixedContent: Story = {
  render: (): ReactElement => <MixedContentExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const group = canvas.getByTestId("mixed-group");
    // The `null` child is dropped and the nested array is flattened, so the
    // overflow count reflects real avatars only:
    // 1 image + 5 initials = 6 avatars, 4 shown, 2 hidden.
    await expect(within(group).getByText("+2")).toBeInTheDocument();
  },
};

/** Turn the separating rings off for stacks placed on a busy background. */
export const WithoutRings: Story = {
  args: { ring: false, max: 4 },
  render: (args): ReactElement => (
    <AvatarGroup {...args}>
      {userAvatars()}
    </AvatarGroup>
  ),
};

/** Replace the `+N` chip entirely — here with a tooltip listing who is hidden. */
function CustomOverflowExample(): ReactElement {
  return (
    <TooltipProvider>
      <AvatarGroup
        max={3}
        renderOverflow={(overflowCount): ReactElement => (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                +{overflowCount}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {users
                .slice(3)
                .map((user) => user.name)
                .join(", ")}
            </TooltipContent>
          </Tooltip>
        )}
      >
        {userAvatars()}
      </AvatarGroup>
    </TooltipProvider>
  );
}

export const CustomOverflow: Story = {
  render: (): ReactElement => <CustomOverflowExample />,
};

/** A realistic "who is on this vault" row. */
function CollaboratorRowExample(): ReactElement {
  return (
    <div className="flex w-[420px] items-center justify-between rounded-lg border border-border bg-card p-4">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-card-foreground">
          Production Schema Vault
        </span>
        <span className="text-xs text-muted-foreground">7 collaborators</span>
      </div>
      <AvatarGroup size="sm" max={4}>
        {userAvatars()}
      </AvatarGroup>
    </div>
  );
}

export const CollaboratorRow: Story = {
  render: (): ReactElement => <CollaboratorRowExample />,
  parameters: { layout: "centered" },
};
