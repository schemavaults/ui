import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  ArrowUpRight,
  BarChart3,
  BellRing,
  Bot,
  Cloud,
  Cpu,
  Database,
  KeyRound,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { Badge } from "../badge/badge";
import { Sparkline } from "../sparkline/sparkline";
import {
  BentoGrid,
  BentoGridItem,
  bentoGridAutoRowIds,
  bentoGridColumnIds,
  bentoGridGapIds,
  bentoGridItemColSpanIds,
  bentoGridItemPaddingIds,
  bentoGridItemRowSpanIds,
  bentoGridItemVariantIds,
} from "./bento-grid";

const meta = {
  title: "Components/BentoGrid",
  component: BentoGrid,
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: [
          "`BentoGrid` is an asymmetric, feature-tile grid inspired by Apple / Vercel / Linear",
          "product pages. It pairs a responsive column container (`BentoGrid`) with an",
          "opinionated tile (`BentoGridItem`) that ships with slots for `icon`, `title`,",
          "`description`, free-form `children`, a decorative `background`, and a `footer`.",
          "\n\nReach for it when you need to showcase a set of features, metrics, or entry",
          "points with visual variety — tiles can span multiple columns/rows so the layout",
          "reads as designed rather than uniform. All colours and borders resolve to",
          "`@schemavaults/theme` tokens (`bg-card`, `text-foreground`, `border-border`,",
          "`bg-primary`, `bg-accent`, `bg-muted`), so light and dark themes both track the",
          "active brand palette out of the box.",
          "\n\nCompose freely inside a tile: charts (`<Sparkline />`), badges, code, buttons —",
          "anything. Pass an `href` to turn a tile into a full-card link, or `as=\"button\"`",
          "to make it interactive.",
        ].join(" "),
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    columns: { options: bentoGridColumnIds, control: { type: "radio" } },
    gap: { options: bentoGridGapIds, control: { type: "radio" } },
    autoRows: { options: bentoGridAutoRowIds, control: { type: "radio" } },
    denseFlow: { control: { type: "boolean" } },
  },
  args: {
    columns: "3",
    gap: "default",
    autoRows: "default",
    denseFlow: false,
  },
} satisfies Meta<typeof BentoGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ================================================================== */
/* Default — feature grid                                             */
/* ================================================================== */

function GradientBackground(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-accent/25"
    />
  );
}

function DotsBackground(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] [background-size:14px_14px] text-muted-foreground/40"
    />
  );
}

export const Default: Story = {
  render: (args): ReactElement => (
    <BentoGrid {...args}>
      <BentoGridItem
        colSpan="2"
        rowSpan="2"
        variant="primary"
        icon={<Sparkles />}
        title="Agentic vaults"
        description="Delegate secret rotation, access reviews and audit summaries to fleet-scoped agents. Bring your own model or use ours."
        background={<GradientBackground />}
        footer={
          <>
            <Badge variant="secondary">New</Badge>
            <span>Beta · opt-in</span>
          </>
        }
      >
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline">GPT-4o</Badge>
          <Badge variant="outline">Claude</Badge>
          <Badge variant="outline">Gemini</Badge>
          <Badge variant="outline">Local</Badge>
        </div>
      </BentoGridItem>

      <BentoGridItem
        icon={<ShieldCheck />}
        title="SOC 2 out of the box"
        description="Continuous evidence collection so you never assemble a spreadsheet the day before an audit."
        footer={<span>Type II · 2026</span>}
      />

      <BentoGridItem
        icon={<KeyRound />}
        title="Short-lived credentials"
        description="Every access token expires in minutes, not months. Rotate keys without touching prod."
      />

      <BentoGridItem
        colSpan="2"
        variant="muted"
        icon={<BarChart3 />}
        title="Usage that reads at a glance"
        description="Per-vault, per-agent, per-consumer telemetry with a shared time cursor."
        background={<DotsBackground />}
      >
        <div className="mt-4">
          <Sparkline
            className="h-14 w-full"
            label="Requests per minute over the last 14 minutes"
            data={[6, 9, 8, 12, 14, 11, 15, 18, 22, 24, 21, 27, 30, 33]}
            variant="area"
            color="primary"
          />
        </div>
      </BentoGridItem>

      <BentoGridItem
        icon={<Cloud />}
        title="Works everywhere"
        description="AWS, GCP, Azure, Kubernetes and self-hosted. One SDK, every runtime."
        footer={<span>18 integrations</span>}
      />
    </BentoGrid>
  ),
};

/* ================================================================== */
/* Interactive tiles                                                  */
/* ================================================================== */

export const InteractiveTiles: Story = {
  parameters: {
    docs: {
      description: {
        story: [
          "Passing `href` renders the tile as an `<a>` and applies hover / focus styling.",
          "Use for entry-point grids on landing pages, empty states and 'what next?' screens.",
        ].join(" "),
      },
    },
  },
  render: (args): ReactElement => (
    <BentoGrid {...args}>
      <BentoGridItem
        href="#create"
        icon={<Database />}
        title="Create a vault"
        description="Provision an isolated key store for a project or environment."
        footer={
          <span className="inline-flex items-center gap-1 text-primary">
            Get started <ArrowUpRight className="size-3" />
          </span>
        }
      />
      <BentoGridItem
        href="#agents"
        icon={<Bot />}
        title="Deploy an agent"
        description="Spin up a rotation, review or audit agent from a template."
        footer={
          <span className="inline-flex items-center gap-1 text-primary">
            Browse templates <ArrowUpRight className="size-3" />
          </span>
        }
      />
      <BentoGridItem
        href="#invite"
        icon={<BellRing />}
        title="Invite your team"
        description="Add teammates with role-based access — reviewer, operator or owner."
        footer={
          <span className="inline-flex items-center gap-1 text-primary">
            Send invites <ArrowUpRight className="size-3" />
          </span>
        }
      />
    </BentoGrid>
  ),
};

/* ================================================================== */
/* Variants — every visual style                                      */
/* ================================================================== */

export const AllVariants: Story = {
  parameters: {
    docs: {
      description: {
        story: [
          "The `variant` prop on `BentoGridItem` chooses the surface treatment.",
          "All variants use theme tokens so light and dark themes look correct.",
        ].join(" "),
      },
    },
  },
  args: {
    columns: "3",
  },
  render: (args): ReactElement => (
    <BentoGrid {...args}>
      {bentoGridItemVariantIds.map((variant) => (
        <BentoGridItem
          key={variant}
          variant={variant}
          icon={<Sparkles />}
          title={`variant="${variant}"`}
          description="Surfaces, borders and hover states all resolve to @schemavaults/theme tokens."
        />
      ))}
    </BentoGrid>
  ),
};

/* ================================================================== */
/* Column density                                                     */
/* ================================================================== */

export const TwelveColumnLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: [
          "For editorial dashboards where you need finer control over tile widths,",
          "switch to a 12-column grid and mix `colSpan` values.",
        ].join(" "),
      },
    },
  },
  args: {
    columns: "12",
    autoRows: "lg",
  },
  render: (args): ReactElement => (
    <BentoGrid {...args}>
      <BentoGridItem
        colSpan="6"
        rowSpan="2"
        variant="primary"
        icon={<Zap />}
        title="Zero-config performance"
        description="Edge-resident routing, HTTP/3 by default, and per-region cache locality."
        background={<GradientBackground />}
      />
      <BentoGridItem
        colSpan="3"
        icon={<Cpu />}
        title="Compute-adjacent"
        description="Vaults co-locate with your workloads."
      />
      <BentoGridItem
        colSpan="3"
        icon={<Lock />}
        title="AES-256"
        description="Envelope-encrypted at rest."
      />
      <BentoGridItem
        colSpan="3"
        variant="muted"
        icon={<Cloud />}
        title="Multi-region"
        description="Global fail-over ≤ 30s."
      />
      <BentoGridItem
        colSpan="3"
        variant="muted"
        icon={<ShieldCheck />}
        title="Signed audit log"
        description="Merkle-tree tamper evidence."
      />
    </BentoGrid>
  ),
};

/* ================================================================== */
/* Playground                                                         */
/* ================================================================== */

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Toggle `columns`, `gap`, `autoRows`, and `denseFlow` on the container from the controls panel.",
      },
    },
  },
  argTypes: {
    columns: { options: bentoGridColumnIds, control: { type: "radio" } },
    gap: { options: bentoGridGapIds, control: { type: "radio" } },
    autoRows: { options: bentoGridAutoRowIds, control: { type: "radio" } },
    denseFlow: { control: { type: "boolean" } },
  },
  args: {
    columns: "4",
    gap: "default",
    autoRows: "default",
    denseFlow: true,
  },
  render: (args): ReactElement => (
    <BentoGrid {...args}>
      <BentoGridItem colSpan="2" rowSpan="2" icon={<Sparkles />} title="Featured" description="Spans 2×2." />
      <BentoGridItem icon={<KeyRound />} title="Rotate" description="Standard tile." />
      <BentoGridItem icon={<Lock />} title="Encrypt" description="Standard tile." />
      <BentoGridItem colSpan="2" icon={<BarChart3 />} title="Analytics" description="Spans 2 columns." />
      <BentoGridItem icon={<Cloud />} title="Sync" description="Standard tile." />
      <BentoGridItem icon={<BellRing />} title="Alerts" description="Standard tile." />
      <BentoGridItem icon={<Database />} title="Storage" description="Standard tile." />
    </BentoGrid>
  ),
};

/* ================================================================== */
/* Coverage — every span combination we actually offer                */
/* ================================================================== */

export const SpanCoverage: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Reference grid showing every supported `colSpan` × `rowSpan` × `padding` combination on a 6-column container.",
      },
    },
  },
  args: {
    columns: "6",
    autoRows: "sm",
  },
  render: (args): ReactElement => (
    <BentoGrid {...args}>
      {bentoGridItemColSpanIds.map((colSpan) =>
        bentoGridItemRowSpanIds.map((rowSpan) => (
          <BentoGridItem
            key={`${colSpan}-${rowSpan}`}
            colSpan={colSpan}
            rowSpan={rowSpan}
            padding={bentoGridItemPaddingIds[1]}
            title={`col:${colSpan} row:${rowSpan}`}
            description="Span coverage tile."
          />
        )),
      )}
    </BentoGrid>
  ),
};
