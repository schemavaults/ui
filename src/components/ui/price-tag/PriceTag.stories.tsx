import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  PriceTag,
  PriceTagAmount,
  PriceTagAmountRow,
  PriceTagCaption,
  PriceTagComparisonRow,
  PriceTagCurrency,
  PriceTagDiscount,
  PriceTagFraction,
  PriceTagOriginal,
  PriceTagPeriod,
  PriceTagSkeleton,
  priceTagAlignmentIds,
  priceTagDiscountIntents,
  priceTagSizeIds,
  priceTagVariantIds,
  type PriceTagAlignmentId,
  type PriceTagDiscountIntent,
  type PriceTagSizeId,
  type PriceTagVariantId,
} from "./price-tag";

interface PriceTagExampleProps {
  variant?: PriceTagVariantId;
  size?: PriceTagSizeId;
  alignment?: PriceTagAlignmentId;
  currency?: string;
  amount?: string;
  fraction?: string;
  period?: string;
  caption?: string;
  showOriginalPrice?: boolean;
  originalPrice?: string;
  showDiscount?: boolean;
  discountIntent?: PriceTagDiscountIntent;
  discountLabel?: string;
  loading?: boolean;
}

function PriceTagExample({
  variant = "default",
  size = "md",
  alignment = "start",
  currency = "$",
  amount = "29",
  fraction = "99",
  period = "/mo",
  caption = "Billed monthly, cancel any time.",
  showOriginalPrice = false,
  originalPrice = "$49.99",
  showDiscount = false,
  discountIntent = "positive",
  discountLabel = "40% OFF",
  loading = false,
}: PriceTagExampleProps): ReactElement {
  if (loading) {
    return <PriceTagSkeleton size={size} />;
  }
  return (
    <PriceTag variant={variant} alignment={alignment}>
      {showOriginalPrice || showDiscount ? (
        <PriceTagComparisonRow>
          {showOriginalPrice ? (
            <PriceTagOriginal size={size}>{originalPrice}</PriceTagOriginal>
          ) : null}
          {showDiscount ? (
            <PriceTagDiscount intent={discountIntent}>
              {discountLabel}
            </PriceTagDiscount>
          ) : null}
        </PriceTagComparisonRow>
      ) : null}
      <PriceTagAmountRow size={size}>
        <PriceTagCurrency size={size}>{currency}</PriceTagCurrency>
        <PriceTagAmount>{amount}</PriceTagAmount>
        {fraction ? (
          <PriceTagFraction size={size}>{fraction}</PriceTagFraction>
        ) : null}
        {period ? (
          <PriceTagPeriod size={size}>{period}</PriceTagPeriod>
        ) : null}
      </PriceTagAmountRow>
      {caption ? (
        <PriceTagCaption size={size}>{caption}</PriceTagCaption>
      ) : null}
    </PriceTag>
  );
}

const meta = {
  title: "Components/PriceTag",
  component: PriceTagExample,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: priceTagVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: priceTagSizeIds,
      control: { type: "radio" },
    },
    alignment: {
      options: priceTagAlignmentIds,
      control: { type: "radio" },
    },
    discountIntent: {
      options: priceTagDiscountIntents,
      control: { type: "radio" },
    },
    currency: { control: { type: "text" } },
    amount: { control: { type: "text" } },
    fraction: { control: { type: "text" } },
    period: { control: { type: "text" } },
    caption: { control: { type: "text" } },
    originalPrice: { control: { type: "text" } },
    discountLabel: { control: { type: "text" } },
    showOriginalPrice: { control: { type: "boolean" } },
    showDiscount: { control: { type: "boolean" } },
    loading: { control: { type: "boolean" } },
  },
  args: {
    variant: "default",
    size: "md",
    alignment: "start",
    currency: "$",
    amount: "29",
    fraction: "99",
    period: "/mo",
    caption: "Billed monthly, cancel any time.",
    showOriginalPrice: false,
    originalPrice: "$49.99",
    showDiscount: false,
    discountIntent: "positive",
    discountLabel: "40% OFF",
    loading: false,
  },
} satisfies Meta<typeof PriceTagExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Primary: Story = {
  args: {
    variant: "primary",
    amount: "49",
    fraction: "00",
    caption: "Most popular for growing teams.",
  },
};

export const Muted: Story = {
  args: {
    variant: "muted",
    amount: "0",
    fraction: "",
    period: "",
    caption: "Free forever for personal use.",
  },
};

export const Featured: Story = {
  args: {
    variant: "featured",
    amount: "199",
    fraction: "00",
    period: "/mo",
    caption: "Includes premium support and audit logs.",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    amount: "499",
    fraction: "00",
    period: "/mo",
    caption: "Overage tier — switch to Enterprise to remove.",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    amount: "9",
    fraction: "99",
    caption: "Hobby plan.",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    amount: "99",
    fraction: "00",
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
    amount: "299",
    fraction: "00",
  },
};

export const WithDiscount: Story = {
  args: {
    showOriginalPrice: true,
    showDiscount: true,
    amount: "29",
    fraction: "99",
    originalPrice: "$49.99",
    discountLabel: "40% OFF",
    discountIntent: "positive",
    caption: "Limited-time launch pricing.",
  },
};

export const FlashSale: Story = {
  args: {
    variant: "primary",
    size: "lg",
    showOriginalPrice: true,
    showDiscount: true,
    amount: "12",
    fraction: "00",
    originalPrice: "$60.00",
    discountLabel: "80% OFF",
    discountIntent: "primary",
    period: "/mo",
    caption: "First 3 months, then $60/mo.",
  },
};

export const EuroCurrency: Story = {
  args: {
    currency: "€",
    amount: "24",
    fraction: "90",
    period: "/mois",
    caption: "Facturé mensuellement.",
  },
};

export const Annual: Story = {
  args: {
    amount: "299",
    fraction: "",
    period: "/yr",
    caption: "Save 17% vs. monthly billing.",
  },
};

export const OneTime: Story = {
  args: {
    amount: "1,499",
    fraction: "",
    period: "one-time",
    caption: "Lifetime license, no renewal required.",
  },
};

export const CenterAligned: Story = {
  args: {
    alignment: "center",
    amount: "49",
    fraction: "00",
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const LoadingLarge: Story = {
  args: {
    loading: true,
    size: "lg",
  },
};

function PricingComparisonGrid(): ReactElement {
  const plans = [
    {
      name: "Hobby",
      caption: "For personal projects and prototypes.",
      variant: "default" as const,
      amount: "0",
      fraction: "",
      period: "",
      tagline: "Free forever",
    },
    {
      name: "Pro",
      caption: "For growing teams shipping real product.",
      variant: "primary" as const,
      amount: "29",
      fraction: "00",
      period: "/mo",
      tagline: "Most popular",
    },
    {
      name: "Enterprise",
      caption: "SSO, audit logs, and a dedicated rep.",
      variant: "featured" as const,
      amount: "Custom",
      fraction: "",
      period: "",
      tagline: "Contact sales",
    },
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 24,
        width: "100%",
        maxWidth: 960,
      }}
    >
      {plans.map((plan) => (
        <div
          key={plan.name}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            padding: 24,
            borderRadius: 12,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: 0.6,
                color: "hsl(var(--muted-foreground))",
              }}
            >
              {plan.tagline}
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "hsl(var(--foreground))",
              }}
            >
              {plan.name}
            </span>
          </div>
          <PriceTag variant={plan.variant} alignment="start">
            <PriceTagAmountRow size="lg">
              {plan.amount === "Custom" ? (
                <PriceTagAmount>Custom</PriceTagAmount>
              ) : (
                <>
                  <PriceTagCurrency size="lg">$</PriceTagCurrency>
                  <PriceTagAmount>{plan.amount}</PriceTagAmount>
                  {plan.fraction ? (
                    <PriceTagFraction size="lg">{plan.fraction}</PriceTagFraction>
                  ) : null}
                  {plan.period ? (
                    <PriceTagPeriod size="lg">{plan.period}</PriceTagPeriod>
                  ) : null}
                </>
              )}
            </PriceTagAmountRow>
            <PriceTagCaption size="md">{plan.caption}</PriceTagCaption>
          </PriceTag>
        </div>
      ))}
    </div>
  );
}

export const PricingTable: Story = {
  render: () => <PricingComparisonGrid />,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};

function AllVariantsGrid(): ReactElement {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 24,
        width: "100%",
        maxWidth: 960,
      }}
    >
      {priceTagVariantIds.map((variant) => (
        <div
          key={variant}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            padding: 16,
            borderRadius: 12,
            border: "1px solid hsl(var(--border))",
            background: "hsl(var(--card))",
          }}
        >
          <span
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 0.6,
              color: "hsl(var(--muted-foreground))",
            }}
          >
            {variant}
          </span>
          <PriceTag variant={variant} alignment="start">
            <PriceTagAmountRow size="md">
              <PriceTagCurrency size="md">$</PriceTagCurrency>
              <PriceTagAmount>29</PriceTagAmount>
              <PriceTagFraction size="md">99</PriceTagFraction>
              <PriceTagPeriod size="md">/mo</PriceTagPeriod>
            </PriceTagAmountRow>
          </PriceTag>
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: () => <AllVariantsGrid />,
  parameters: {
    controls: { hideNoControlsWarning: true },
  },
};
