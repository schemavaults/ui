import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { Avatar, AvatarFallback } from "../avatar/avatar";
import {
  PresenceIndicator,
  presenceSizeIds,
  presenceStatusIds,
  type PresenceStatusId,
} from "./presence-indicator";

const meta = {
  title: "Components/PresenceIndicator",
  component: PresenceIndicator,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      options: presenceStatusIds,
      control: { type: "radio" },
      table: {
        type: {
          summary: "PresenceStatusId",
          detail: presenceStatusIds.map((s) => `'${s}'`).join(" | "),
        },
      },
    },
    size: {
      options: presenceSizeIds,
      control: { type: "radio" },
      table: {
        type: {
          summary: "PresenceSizeId",
          detail: presenceSizeIds.map((s) => `'${s}'`).join(" | "),
        },
      },
    },
    pulse: { control: { type: "boolean" } },
    bordered: { control: { type: "boolean" } },
    label: { control: { type: "text" } },
  },
  args: {
    status: "online",
    size: "md",
    pulse: false,
    bordered: false,
  },
} satisfies Meta<typeof PresenceIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Pulsing: Story = {
  args: {
    status: "online",
    pulse: true,
  },
};

export const WithLabel: Story = {
  args: {
    status: "online",
    label: true,
  },
};

export const CustomLabel: Story = {
  args: {
    status: "idle",
    label: "Back in 5",
  },
};

function AllStatusesExample(): ReactElement {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-3">
      {presenceStatusIds.map((status: PresenceStatusId) => (
        <div key={status} className="flex items-center gap-2">
          <PresenceIndicator status={status} />
          <span className="text-sm capitalize text-foreground">{status}</span>
        </div>
      ))}
    </div>
  );
}

export const AllStatuses: Story = {
  render: (): ReactElement => <AllStatusesExample />,
};

function AllSizesExample(): ReactElement {
  return (
    <div className="flex items-end gap-6">
      {presenceSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <PresenceIndicator status="online" size={size} />
          <span className="text-xs text-muted-foreground">{size}</span>
        </div>
      ))}
    </div>
  );
}

export const Sizes: Story = {
  render: (): ReactElement => <AllSizesExample />,
};

function WithLabelsExample(): ReactElement {
  return (
    <div className="flex flex-col gap-2">
      {presenceStatusIds.map((status: PresenceStatusId) => (
        <PresenceIndicator key={status} status={status} label />
      ))}
    </div>
  );
}

export const StatusesWithLabels: Story = {
  render: (): ReactElement => <WithLabelsExample />,
};

function OnAvatarExample(): ReactElement {
  const users: { initials: string; color: string; status: PresenceStatusId }[] = [
    { initials: "AB", color: "bg-primary text-primary-foreground", status: "online" },
    { initials: "CD", color: "bg-destructive text-white", status: "busy" },
    { initials: "EF", color: "bg-secondary text-secondary-foreground", status: "idle" },
    { initials: "GH", color: "bg-accent text-accent-foreground", status: "away" },
    { initials: "IJ", color: "bg-muted text-muted-foreground", status: "dnd" },
    { initials: "KL", color: "bg-muted text-muted-foreground", status: "offline" },
  ];

  return (
    <div className="flex flex-wrap items-end gap-6">
      {users.map((user) => (
        <div key={user.initials} className="flex flex-col items-center gap-2">
          <span className="relative inline-block">
            <Avatar size="lg">
              <AvatarFallback className={user.color}>{user.initials}</AvatarFallback>
            </Avatar>
            <PresenceIndicator
              status={user.status}
              size="md"
              bordered
              className="absolute bottom-0 right-0"
            />
          </span>
          <span className="text-xs capitalize text-muted-foreground">
            {user.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export const OnAvatar: Story = {
  render: (): ReactElement => <OnAvatarExample />,
};

function PulsingOnlineRosterExample(): ReactElement {
  const teammates: { name: string; initials: string; status: PresenceStatusId }[] = [
    { name: "Ada Lovelace", initials: "AL", status: "online" },
    { name: "Grace Hopper", initials: "GH", status: "online" },
    { name: "Linus Torvalds", initials: "LT", status: "idle" },
    { name: "Margaret Hamilton", initials: "MH", status: "busy" },
    { name: "Edsger Dijkstra", initials: "ED", status: "offline" },
  ];

  return (
    <ul className="flex w-64 flex-col divide-y divide-border rounded-md border border-border bg-card">
      {teammates.map((teammate) => (
        <li
          key={teammate.initials}
          className="flex items-center gap-3 px-3 py-2"
        >
          <span className="relative inline-block">
            <Avatar size="sm">
              <AvatarFallback className="bg-muted text-muted-foreground">
                {teammate.initials}
              </AvatarFallback>
            </Avatar>
            <PresenceIndicator
              status={teammate.status}
              size="sm"
              bordered
              pulse={teammate.status === "online"}
              className="absolute bottom-0 right-0"
            />
          </span>
          <span className="flex-1 text-sm text-foreground">{teammate.name}</span>
          <PresenceIndicator status={teammate.status} label size="xs" />
        </li>
      ))}
    </ul>
  );
}

export const TeamRoster: Story = {
  render: (): ReactElement => <PulsingOnlineRosterExample />,
};
