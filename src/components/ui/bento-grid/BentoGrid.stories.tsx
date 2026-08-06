import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Bot,
  Database,
  Layers,
  Rocket,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

import {
  BentoGrid,
  BentoGridItem,
  BentoGridItemContent,
  BentoGridItemDescription,
  BentoGridItemFooter,
  BentoGridItemHeader,
  BentoGridItemIcon,
  BentoGridItemTitle,
  bentoGridColumnIds,
  bentoGridGapIds,
  bentoGridItemSizeIds,
  bentoGridItemVariantIds,
  type BentoGridColumnId,
  type BentoGridGapId,
} from "./bento-grid";

interface BentoGridExampleProps {
  columns?: BentoGridColumnId;
  gap?: BentoGridGapId;
}

function BentoGridExample({
  columns,
  gap,
}: BentoGridExampleProps): ReactElement {
  return (
    <div className="w-[960px] max-w-full">
      <BentoGrid columns={columns} gap={gap}>
        <BentoGridItem size="hero" variant="primary">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Sparkles />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Ship faster with SchemaVaults</BentoGridItemTitle>
          <BentoGridItemDescription>
            A single source of truth for every schema in your organisation.
            Version, validate, and share — without leaving your workflow.
          </BentoGridItemDescription>
          <BentoGridItemContent>
            Bring your Postgres, Snowflake, and BigQuery models together and
            keep every consumer in lockstep.
          </BentoGridItemContent>
          <BentoGridItemFooter>Included with every plan</BentoGridItemFooter>
        </BentoGridItem>

        <BentoGridItem size="sm">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Database />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Typed models</BentoGridItemTitle>
          <BentoGridItemDescription>
            Generate SDKs for TypeScript, Python, and Rust.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem size="sm" variant="muted">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Shield />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>SOC 2 ready</BentoGridItemTitle>
          <BentoGridItemDescription>
            Row-level access, audit logs, and SSO out of the box.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem size="md" variant="accent">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Zap />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Instant migrations</BentoGridItemTitle>
          <BentoGridItemDescription>
            Preview, review, and apply schema changes with zero downtime.
          </BentoGridItemDescription>
        </BentoGridItem>

        <BentoGridItem size="sm" variant="outlined">
          <BentoGridItemHeader>
            <BentoGridItemIcon>
              <Bell />
            </BentoGridItemIcon>
          </BentoGridItemHeader>
          <BentoGridItemTitle>Alerting</BentoGridItemTitle>
          <BentoGridItemDescription>
            Get notified the moment a breaking change lands.
          </BentoGridItemDescription>
        </BentoGridItem>
      </BentoGrid>
    </div>
  );
}

const meta = {
  title: "Components/BentoGrid",
  component: BentoGridExample,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    columns: {
      options: bentoGridColumnIds,
      control: { type: "select" },
    },
    gap: {
      options: bentoGridGapIds,
      control: { type: "radio" },
    },
  },
  args: {
    columns: 3,
    gap: "md",
  },
} satisfies Meta<typeof BentoGridExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FourColumns: Story = {
  args: { columns: 4 },
};

export const SmallGap: Story = {
  args: { gap: "sm" },
};

export const LargeGap: Story = {
  args: { gap: "lg" },
};

export const AllItemSizes: Story = {
  render: (): ReactElement => (
    <div className="w-[960px] max-w-full">
      <BentoGrid columns={3} gap="md">
        {bentoGridItemSizeIds.map((size) => (
          <BentoGridItem key={size} size={size}>
            <BentoGridItemHeader>
              <BentoGridItemIcon>
                <Layers />
              </BentoGridItemIcon>
            </BentoGridItemHeader>
            <BentoGridItemTitle>
              size=&quot;{size}&quot;
            </BentoGridItemTitle>
            <BentoGridItemDescription>
              Each size maps to a column/row span combination so items can
              claim more real estate on wider viewports.
            </BentoGridItemDescription>
          </BentoGridItem>
        ))}
      </BentoGrid>
    </div>
  ),
};

export const AllItemVariants: Story = {
  render: (): ReactElement => (
    <div className="w-[960px] max-w-full">
      <BentoGrid columns={3} gap="md">
        {bentoGridItemVariantIds.map((variant) => (
          <BentoGridItem key={variant} variant={variant}>
            <BentoGridItemHeader>
              <BentoGridItemIcon>
                <Sparkles />
              </BentoGridItemIcon>
            </BentoGridItemHeader>
            <BentoGridItemTitle>
              variant=&quot;{variant}&quot;
            </BentoGridItemTitle>
            <BentoGridItemDescription>
              Uses semantic tokens from @schemavaults/theme so the item stays
              on-brand in both light and dark mode.
            </BentoGridItemDescription>
          </BentoGridItem>
        ))}
      </BentoGrid>
    </div>
  ),
};

export const Interactive: Story = {
  render: (): ReactElement => (
    <div className="w-[720px] max-w-full">
      <BentoGrid columns={2} gap="md">
        {[
          { icon: Rocket, title: "Launch checklist" },
          { icon: Activity, title: "Live traffic" },
          { icon: BarChart3, title: "Query analytics" },
          { icon: Bot, title: "AI assistant" },
        ].map(({ icon: Icon, title }) => (
          <BentoGridItem
            key={title}
            interactive
            onClick={(): void => {
              /* wire up navigation here */
            }}
          >
            <BentoGridItemHeader>
              <BentoGridItemIcon>
                <Icon />
              </BentoGridItemIcon>
            </BentoGridItemHeader>
            <BentoGridItemTitle>{title}</BentoGridItemTitle>
            <BentoGridItemDescription>
              Interactive items get focus rings, cursor styling, and a subtle
              hover border. Wire an <code>onClick</code> handler to make them
              act as buttons or links.
            </BentoGridItemDescription>
          </BentoGridItem>
        ))}
      </BentoGrid>
    </div>
  ),
};

export const WithMedia: Story = {
  render: (): ReactElement => (
    <div className="w-[720px] max-w-full">
      <BentoGrid columns={2} gap="md">
        <BentoGridItem
          size="md"
          media={
            <div className="h-full w-full bg-gradient-to-br from-primary/40 via-primary/20 to-accent" />
          }
        >
          <BentoGridItemTitle>Onboarding hero</BentoGridItemTitle>
          <BentoGridItemDescription>
            The <code>media</code> slot renders edge-to-edge above the header.
            Perfect for gradients, illustrations, or a chart preview.
          </BentoGridItemDescription>
        </BentoGridItem>
        <BentoGridItem
          media={
            <div className="grid h-full w-full place-items-center bg-muted">
              <Sparkles aria-hidden className="size-8 text-muted-foreground" />
            </div>
          }
        >
          <BentoGridItemTitle>Feature preview</BentoGridItemTitle>
          <BentoGridItemDescription>
            Drop any React node into the media slot — it will fill the
            container while respecting the card&apos;s rounded corners.
          </BentoGridItemDescription>
        </BentoGridItem>
      </BentoGrid>
    </div>
  ),
};
