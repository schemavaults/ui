import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { Fragment, type ReactElement } from "react";
import { Rocket, ShieldCheck, Clock, ServerCrash } from "lucide-react";

import { StatusPill } from "./status-pill";
import {
  statusPillAppearanceIds,
  statusPillDefaultLabels,
  statusPillSizeIds,
  statusPillStatusIds,
  type StatusPillStatusId,
} from "./status-pill-variants";

const meta = {
  title: "Components/StatusPill",
  component: StatusPill,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    status: {
      options: statusPillStatusIds,
      control: { type: "select" },
      description:
        "Semantic status. Drives colour, default dot colour, and default label.",
    },
    appearance: {
      options: statusPillAppearanceIds,
      control: { type: "radio" },
      description:
        "Visual appearance — soft (default) reads well in dense tables; solid emphasises; outline stays restrained; plain drops the background entirely.",
    },
    size: {
      options: statusPillSizeIds,
      control: { type: "radio" },
    },
    pulse: {
      control: { type: "boolean" },
      description:
        "Renders a soft ping animation around the dot — signals live / in-flight state.",
    },
    label: {
      control: { type: "text" },
      description:
        "Text label rendered next to the dot. Defaults to a humanised version of the status. Pass `null` to hide.",
    },
  },
  args: {
    status: "active",
    appearance: "soft",
    size: "md",
    pulse: false,
  },
} satisfies Meta<typeof StatusPill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Active: Story = {
  args: { status: "active" },
};

export const Success: Story = {
  args: { status: "success", label: "Deployed" },
};

export const Info: Story = {
  args: { status: "info", label: "Read replica" },
};

export const Warning: Story = {
  args: { status: "warning", label: "Degraded" },
};

export const Danger: Story = {
  args: { status: "danger", label: "Suspended" },
};

export const Pending: Story = {
  args: { status: "pending", label: "Provisioning" },
};

export const Muted: Story = {
  args: { status: "muted", label: "Archived" },
};

export const Neutral: Story = {
  args: { status: "neutral", label: "Draft" },
};

export const SolidAppearance: Story = {
  args: { status: "success", appearance: "solid", label: "Live" },
};

export const OutlineAppearance: Story = {
  args: { status: "danger", appearance: "outline", label: "Failed" },
};

export const PlainAppearance: Story = {
  args: { status: "info", appearance: "plain", label: "Info" },
};

export const Pulsing: Story = {
  args: { status: "success", pulse: true, label: "Live" },
};

export const DotOnly: Story = {
  name: "Dot-only (label={null})",
  args: { status: "success", label: null },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `label={null}` for a compact dot-only pill — useful in dense tables or as an inline status marker.",
      },
    },
  },
};

export const WithLeadingIcon: Story = {
  args: {
    status: "info",
    label: "Verified",
    icon: <ShieldCheck />,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `icon` to replace the default coloured dot with a custom leading icon.",
      },
    },
  },
};

export const AllStatuses: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-col gap-3 p-4">
      {statusPillAppearanceIds.map((appearance) => (
        <div key={appearance} className="flex flex-wrap items-center gap-2">
          <span className="w-16 text-xs uppercase tracking-wide text-muted-foreground">
            {appearance}
          </span>
          {statusPillStatusIds.map((status) => (
            <StatusPill
              key={status}
              status={status}
              appearance={appearance}
              label={statusPillDefaultLabels[status]}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const AllSizes: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-col gap-4 p-4">
      {statusPillSizeIds.map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-10 text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          {(
            [
              "active",
              "success",
              "warning",
              "danger",
              "pending",
              "muted",
            ] satisfies StatusPillStatusId[]
          ).map((status) => (
            <StatusPill key={status} status={status} size={size} />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const AllAppearances: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="grid grid-cols-[auto_repeat(4,minmax(0,1fr))] items-center gap-3 p-4">
      <span />
      {statusPillAppearanceIds.map((appearance) => (
        <span
          key={appearance}
          className="text-xs uppercase tracking-wide text-muted-foreground"
        >
          {appearance}
        </span>
      ))}
      {statusPillStatusIds.map((status) => (
        <Fragment key={status}>
          <span className="text-xs font-medium capitalize text-muted-foreground">
            {status}
          </span>
          {statusPillAppearanceIds.map((appearance) => (
            <div key={`${status}-${appearance}`}>
              <StatusPill status={status} appearance={appearance} />
            </div>
          ))}
        </Fragment>
      ))}
    </div>
  ),
};

interface MockDeployment {
  id: string;
  service: string;
  status: StatusPillStatusId;
  label: string;
  pulse?: boolean;
  updatedAt: string;
}

const mockDeployments: MockDeployment[] = [
  {
    id: "dep_01",
    service: "api-gateway",
    status: "success",
    label: "Healthy",
    updatedAt: "2m ago",
  },
  {
    id: "dep_02",
    service: "vault-store",
    status: "active",
    label: "Rolling out",
    pulse: true,
    updatedAt: "just now",
  },
  {
    id: "dep_03",
    service: "notification-worker",
    status: "pending",
    label: "Provisioning",
    updatedAt: "1m ago",
  },
  {
    id: "dep_04",
    service: "schema-indexer",
    status: "warning",
    label: "Degraded",
    updatedAt: "4m ago",
  },
  {
    id: "dep_05",
    service: "audit-log",
    status: "danger",
    label: "Crashed",
    updatedAt: "10m ago",
  },
  {
    id: "dep_06",
    service: "legacy-billing",
    status: "muted",
    label: "Retired",
    updatedAt: "12h ago",
  },
];

export const InDeploymentTable: Story = {
  name: "In a deployment status table",
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="w-full max-w-2xl overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
      <div className="border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold">Service health</h3>
        <p className="text-xs text-muted-foreground">
          Live status across production services
        </p>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-2 text-left font-medium">Service</th>
            <th className="px-4 py-2 text-left font-medium">Status</th>
            <th className="px-4 py-2 text-right font-medium">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {mockDeployments.map((row) => (
            <tr key={row.id}>
              <td className="px-4 py-2 font-mono text-xs">{row.service}</td>
              <td className="px-4 py-2">
                <StatusPill
                  status={row.status}
                  label={row.label}
                  pulse={row.pulse}
                  size="sm"
                />
              </td>
              <td className="px-4 py-2 text-right text-xs text-muted-foreground">
                {row.updatedAt}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
};

export const InlineWithText: Story = {
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <p className="max-w-md text-sm text-foreground leading-7">
      Your vault is currently <StatusPill status="active" size="sm" /> — new
      writes will flow into the primary region. If it changes to{" "}
      <StatusPill status="warning" label="Degraded" size="sm" /> or{" "}
      <StatusPill status="danger" label="Suspended" size="sm" />, you&apos;ll
      receive an alert in Slack.
    </p>
  ),
};

export const IconGallery: Story = {
  name: "With custom leading icons",
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <StatusPill status="active" label="Launched" icon={<Rocket />} />
      <StatusPill status="success" label="Verified" icon={<ShieldCheck />} />
      <StatusPill status="pending" label="Queued" icon={<Clock />} />
      <StatusPill status="danger" label="Crashed" icon={<ServerCrash />} />
    </div>
  ),
};

export const LivePulsing: Story = {
  name: "Pulsing live indicators",
  parameters: { layout: "padded" },
  render: (): ReactElement => (
    <div className="flex flex-wrap items-center gap-3 p-4">
      <StatusPill status="danger" label="Recording" pulse />
      <StatusPill status="success" label="Live" pulse appearance="solid" />
      <StatusPill status="info" label="Streaming" pulse />
      <StatusPill status="pending" label="Syncing" pulse />
    </div>
  ),
};

export const AccessibilitySmoke: Story = {
  name: "A11y smoke test",
  args: { status: "success", label: "Deployed" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pill = canvas.getByRole("status", { name: "Deployed" });
    expect(pill).toBeInTheDocument();
    expect(pill.getAttribute("data-status")).toBe("success");
    expect(pill.getAttribute("data-appearance")).toBe("soft");
  },
};
