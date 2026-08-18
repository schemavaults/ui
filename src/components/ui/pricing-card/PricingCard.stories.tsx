import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";
import { Sparkles } from "lucide-react";

import { Button } from "../button/button";
import {
  PricingCard,
  PricingCardAmount,
  PricingCardBadge,
  PricingCardDescription,
  PricingCardFeature,
  PricingCardFeatures,
  PricingCardFooter,
  PricingCardHeader,
  PricingCardName,
  PricingCardPeriod,
  PricingCardPrice,
  pricingCardSizeIds,
  pricingCardVariantIds,
  type PricingCardSizeId,
  type PricingCardVariantId,
} from "./pricing-card";

interface PricingCardExampleProps {
  variant?: PricingCardVariantId;
  size?: PricingCardSizeId;
  name?: string;
  description?: string;
  currency?: string;
  amount?: string;
  period?: string;
  ctaLabel?: string;
  showBadge?: boolean;
  badgeLabel?: string;
}

function PricingCardExample({
  variant = "default",
  size = "md",
  name = "Team",
  description = "Everything a growing team needs to ship schemas confidently.",
  currency = "$",
  amount = "29",
  period = "/ user / month",
  ctaLabel = "Start free trial",
  showBadge = false,
  badgeLabel = "Most popular",
}: PricingCardExampleProps): ReactElement {
  return (
    <div style={{ width: 340 }}>
      <PricingCard variant={variant} size={size}>
        {showBadge ? (
          <PricingCardBadge variant={variant}>
            <Sparkles aria-hidden className="size-3" />
            {badgeLabel}
          </PricingCardBadge>
        ) : null}
        <PricingCardHeader>
          <PricingCardName size={size}>{name}</PricingCardName>
          <PricingCardDescription>{description}</PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice>
          <PricingCardAmount size={size} currency={currency}>
            {amount}
          </PricingCardAmount>
          <PricingCardPeriod>{period}</PricingCardPeriod>
        </PricingCardPrice>
        <PricingCardFeatures>
          <PricingCardFeature>Unlimited private schemas</PricingCardFeature>
          <PricingCardFeature>Version history &amp; branching</PricingCardFeature>
          <PricingCardFeature>Slack &amp; email notifications</PricingCardFeature>
          <PricingCardFeature state="coming-soon">
            AI-assisted schema review
          </PricingCardFeature>
          <PricingCardFeature state="excluded">
            Dedicated single-tenant deployment
          </PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button
            variant={variant === "highlighted" ? "default" : "outline"}
            className="w-full"
          >
            {ctaLabel}
          </Button>
        </PricingCardFooter>
      </PricingCard>
    </div>
  );
}

const meta = {
  title: "Components/PricingCard",
  component: PricingCardExample,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: pricingCardVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: pricingCardSizeIds,
      control: { type: "radio" },
    },
    name: { control: { type: "text" } },
    description: { control: { type: "text" } },
    currency: { control: { type: "text" } },
    amount: { control: { type: "text" } },
    period: { control: { type: "text" } },
    ctaLabel: { control: { type: "text" } },
    showBadge: { control: { type: "boolean" } },
    badgeLabel: { control: { type: "text" } },
  },
  args: {
    variant: "default",
    size: "md",
    name: "Team",
    description:
      "Everything a growing team needs to ship schemas confidently.",
    currency: "$",
    amount: "29",
    period: "/ user / month",
    ctaLabel: "Start free trial",
    showBadge: false,
    badgeLabel: "Most popular",
  },
} satisfies Meta<typeof PricingCardExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Muted: Story = {
  args: {
    variant: "muted",
    name: "Starter",
    description: "For hobbyists exploring schema-first workflows.",
    amount: "0",
    period: "forever",
    ctaLabel: "Get started",
  },
};

export const Primary: Story = {
  args: {
    variant: "primary",
    name: "Growth",
    description: "Scale collaboration across product and platform teams.",
    amount: "79",
    period: "/ user / month",
    ctaLabel: "Upgrade to Growth",
  },
};

export const Highlighted: Story = {
  args: {
    variant: "highlighted",
    name: "Business",
    description: "Enterprise-grade governance with SSO and audit logs.",
    amount: "149",
    period: "/ user / month",
    ctaLabel: "Contact sales",
    showBadge: true,
    badgeLabel: "Most popular",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    name: "Solo",
    amount: "12",
    period: "/ month",
    ctaLabel: "Choose Solo",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    name: "Enterprise",
    description:
      "Custom deployment, procurement support, and 24/7 response SLAs.",
    amount: "Custom",
    currency: "",
    period: "billed annually",
    ctaLabel: "Talk to sales",
    showBadge: true,
    badgeLabel: "Recommended",
  },
};

function PricingTable(): ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 24,
        width: "100%",
        maxWidth: 1080,
        alignItems: "stretch",
      }}
    >
      <PricingCard variant="muted">
        <PricingCardHeader>
          <PricingCardName>Starter</PricingCardName>
          <PricingCardDescription>
            Try schema-first workflows on personal projects.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice>
          <PricingCardAmount currency="$">0</PricingCardAmount>
          <PricingCardPeriod>forever</PricingCardPeriod>
        </PricingCardPrice>
        <PricingCardFeatures>
          <PricingCardFeature>Up to 3 schemas</PricingCardFeature>
          <PricingCardFeature>Public sharing links</PricingCardFeature>
          <PricingCardFeature>Community support</PricingCardFeature>
          <PricingCardFeature state="excluded">
            Version branching
          </PricingCardFeature>
          <PricingCardFeature state="excluded">
            SSO &amp; audit logs
          </PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button variant="outline" className="w-full">
            Start free
          </Button>
        </PricingCardFooter>
      </PricingCard>

      <PricingCard variant="highlighted">
        <PricingCardBadge variant="highlighted">
          <Sparkles aria-hidden className="size-3" />
          Most popular
        </PricingCardBadge>
        <PricingCardHeader>
          <PricingCardName>Team</PricingCardName>
          <PricingCardDescription>
            Ship schemas confidently across product and platform teams.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice>
          <PricingCardAmount currency="$">29</PricingCardAmount>
          <PricingCardPeriod>/ user / month</PricingCardPeriod>
        </PricingCardPrice>
        <PricingCardFeatures>
          <PricingCardFeature>Unlimited private schemas</PricingCardFeature>
          <PricingCardFeature>Version history &amp; branching</PricingCardFeature>
          <PricingCardFeature>Slack &amp; email notifications</PricingCardFeature>
          <PricingCardFeature state="coming-soon">
            AI-assisted schema review
          </PricingCardFeature>
          <PricingCardFeature state="excluded">
            Dedicated deployment
          </PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button className="w-full">Start free trial</Button>
        </PricingCardFooter>
      </PricingCard>

      <PricingCard variant="default">
        <PricingCardHeader>
          <PricingCardName>Enterprise</PricingCardName>
          <PricingCardDescription>
            Custom deployment with procurement support and 24/7 SLAs.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice>
          <PricingCardAmount>Custom</PricingCardAmount>
          <PricingCardPeriod>billed annually</PricingCardPeriod>
        </PricingCardPrice>
        <PricingCardFeatures>
          <PricingCardFeature>Everything in Team</PricingCardFeature>
          <PricingCardFeature>SSO / SAML &amp; SCIM</PricingCardFeature>
          <PricingCardFeature>Detailed audit logs</PricingCardFeature>
          <PricingCardFeature>Dedicated single-tenant instance</PricingCardFeature>
          <PricingCardFeature>Named support engineer</PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button variant="outline" className="w-full">
            Talk to sales
          </Button>
        </PricingCardFooter>
      </PricingCard>
    </div>
  );
}

export const PricingTableExample: StoryObj = {
  render: () => <PricingTable />,
  parameters: {
    layout: "padded",
  },
};
