import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import { Button } from "../button/button";
import {
  PricingCard,
  PricingCardBadge,
  PricingCardDescription,
  PricingCardFeature,
  PricingCardFeatures,
  PricingCardFooter,
  PricingCardHeader,
  PricingCardPrice,
  PricingCardTitle,
  pricingCardSizeIds,
  pricingCardVariantIds,
  type PricingCardSizeId,
  type PricingCardVariantId,
} from "./pricing-card";

interface PricingCardExampleProps {
  variant?: PricingCardVariantId;
  size?: PricingCardSizeId;
  showBadge?: boolean;
}

function PricingCardExample({
  variant = "default",
  size = "md",
  showBadge = false,
}: PricingCardExampleProps): ReactElement {
  return (
    <div style={{ width: 320 }}>
      <PricingCard variant={variant} size={size}>
        {showBadge ? (
          <PricingCardBadge intent="primary">Most popular</PricingCardBadge>
        ) : null}
        <PricingCardHeader>
          <PricingCardTitle size={size}>Pro</PricingCardTitle>
          <PricingCardDescription>
            For growing teams that need more vaults and seats.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice
          currency="$"
          amount="29"
          period="/seat / month"
          size={size}
        />
        <PricingCardFeatures>
          <PricingCardFeature>Unlimited vaults</PricingCardFeature>
          <PricingCardFeature>SSO with Okta &amp; Google</PricingCardFeature>
          <PricingCardFeature>Role-based access controls</PricingCardFeature>
          <PricingCardFeature state="limited">
            Up to 50 GB schema storage
          </PricingCardFeature>
          <PricingCardFeature state="excluded">
            Dedicated infrastructure
          </PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button
            variant={variant === "featured" ? "default" : "outline"}
            className="w-full"
          >
            Choose Pro
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
    layout: "centered",
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
    showBadge: { control: { type: "boolean" } },
  },
  args: {
    variant: "default",
    size: "md",
    showBadge: false,
  },
} satisfies Meta<typeof PricingCardExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Featured: Story = {
  args: { variant: "featured", showBadge: true },
};

export const Muted: Story = {
  args: { variant: "muted" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const FreeTier: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <PricingCard variant="muted">
        <PricingCardHeader>
          <PricingCardTitle>Hobby</PricingCardTitle>
          <PricingCardDescription>
            Perfect for personal projects and getting started.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice amount="Free" />
        <PricingCardFeatures>
          <PricingCardFeature>1 vault</PricingCardFeature>
          <PricingCardFeature>1 GB storage</PricingCardFeature>
          <PricingCardFeature>Community support</PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button variant="outline" className="w-full">
            Get started
          </Button>
        </PricingCardFooter>
      </PricingCard>
    </div>
  ),
};

export const EnterpriseTier: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <PricingCard variant="outline">
        <PricingCardHeader>
          <PricingCardTitle>Enterprise</PricingCardTitle>
          <PricingCardDescription>
            Custom pricing for organizations with advanced needs.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice amount="Custom" period="contact sales" />
        <PricingCardFeatures>
          <PricingCardFeature>Everything in Pro</PricingCardFeature>
          <PricingCardFeature>Dedicated infrastructure</PricingCardFeature>
          <PricingCardFeature>SAML SSO &amp; SCIM</PricingCardFeature>
          <PricingCardFeature>Audit log streaming</PricingCardFeature>
          <PricingCardFeature>24/7 priority support</PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button className="w-full">Contact sales</Button>
        </PricingCardFooter>
      </PricingCard>
    </div>
  ),
};

export const WithDiscount: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <PricingCard variant="featured">
        <PricingCardBadge intent="success">Save 40%</PricingCardBadge>
        <PricingCardHeader>
          <PricingCardTitle>Team annual</PricingCardTitle>
          <PricingCardDescription>
            Billed yearly. Cancel anytime.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice
          currency="$"
          amount="17"
          period="/seat / month"
          originalAmount="$29 / seat / month"
        />
        <PricingCardFeatures>
          <PricingCardFeature>Unlimited vaults</PricingCardFeature>
          <PricingCardFeature>SSO with Okta &amp; Google</PricingCardFeature>
          <PricingCardFeature>Priority email support</PricingCardFeature>
          <PricingCardFeature>Audit logs (90 days)</PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button className="w-full">Upgrade now</Button>
        </PricingCardFooter>
      </PricingCard>
    </div>
  ),
};

export const PricingTable: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
      <PricingCard variant="muted">
        <PricingCardHeader>
          <PricingCardTitle>Hobby</PricingCardTitle>
          <PricingCardDescription>
            For personal projects and exploration.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice amount="Free" />
        <PricingCardFeatures>
          <PricingCardFeature>1 vault</PricingCardFeature>
          <PricingCardFeature>1 GB storage</PricingCardFeature>
          <PricingCardFeature>Community support</PricingCardFeature>
          <PricingCardFeature state="excluded">SSO</PricingCardFeature>
          <PricingCardFeature state="excluded">Audit log</PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button variant="outline" className="w-full">
            Get started
          </Button>
        </PricingCardFooter>
      </PricingCard>

      <PricingCard variant="featured">
        <PricingCardBadge intent="primary">Most popular</PricingCardBadge>
        <PricingCardHeader>
          <PricingCardTitle>Pro</PricingCardTitle>
          <PricingCardDescription>
            For growing teams that need more vaults and seats.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice
          currency="$"
          amount="29"
          period="/seat / month"
        />
        <PricingCardFeatures>
          <PricingCardFeature>Unlimited vaults</PricingCardFeature>
          <PricingCardFeature>50 GB storage</PricingCardFeature>
          <PricingCardFeature>SSO with Okta &amp; Google</PricingCardFeature>
          <PricingCardFeature>Audit log (30 days)</PricingCardFeature>
          <PricingCardFeature state="limited">
            Standard support
          </PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button className="w-full">Choose Pro</Button>
        </PricingCardFooter>
      </PricingCard>

      <PricingCard variant="outline">
        <PricingCardHeader>
          <PricingCardTitle>Enterprise</PricingCardTitle>
          <PricingCardDescription>
            For organizations with advanced compliance needs.
          </PricingCardDescription>
        </PricingCardHeader>
        <PricingCardPrice amount="Custom" period="contact sales" />
        <PricingCardFeatures>
          <PricingCardFeature>Everything in Pro</PricingCardFeature>
          <PricingCardFeature>Unlimited storage</PricingCardFeature>
          <PricingCardFeature>SAML SSO &amp; SCIM</PricingCardFeature>
          <PricingCardFeature>Audit log streaming</PricingCardFeature>
          <PricingCardFeature>24/7 priority support</PricingCardFeature>
        </PricingCardFeatures>
        <PricingCardFooter>
          <Button variant="outline" className="w-full">
            Contact sales
          </Button>
        </PricingCardFooter>
      </PricingCard>
    </div>
  ),
};

export const AllVariants: Story = {
  parameters: { layout: "padded" },
  render: () => (
    <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {pricingCardVariantIds.map((variant) => (
        <PricingCard key={variant} variant={variant}>
          <PricingCardHeader>
            <PricingCardTitle>
              {variant.charAt(0).toUpperCase() + variant.slice(1)}
            </PricingCardTitle>
            <PricingCardDescription>
              Variant <code className="font-mono text-xs">{variant}</code>.
            </PricingCardDescription>
          </PricingCardHeader>
          <PricingCardPrice currency="$" amount="29" period="/mo" />
          <PricingCardFeatures>
            <PricingCardFeature>Feature one</PricingCardFeature>
            <PricingCardFeature>Feature two</PricingCardFeature>
            <PricingCardFeature state="excluded">
              Excluded feature
            </PricingCardFeature>
          </PricingCardFeatures>
          <PricingCardFooter>
            <Button
              className="w-full"
              variant={variant === "featured" ? "default" : "outline"}
            >
              Select
            </Button>
          </PricingCardFooter>
        </PricingCard>
      ))}
    </div>
  ),
};
