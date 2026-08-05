import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import type { ReactElement } from "react";

import {
  PriceTag,
  priceTagAlignmentIds,
  priceTagCurrencyPositionIds,
  priceTagSizeIds,
  priceTagVariantIds,
} from "./price-tag";

const meta = {
  title: "Components/PriceTag",
  component: PriceTag,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Formatted price display for pricing pages, product cards, invoices, and stat rows. Handles currency symbol placement (leading / trailing), a superscripted fractional part at the larger sizes, an optional strikethrough `originalAmount` with an auto-computed `−N%` discount badge, `prefix` (`From`, `Starting at`) and recurring `period` (`/mo`, `/user`) affordances, and locale-aware grouping via `Intl.NumberFormat`. All colours resolve to `@schemavaults/theme` tokens (`bg-primary`, `text-muted-foreground`, `border-border`, `bg-destructive`) so the tag tracks the active theme.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { options: priceTagVariantIds, control: { type: "radio" } },
    size: { options: priceTagSizeIds, control: { type: "radio" } },
    alignment: { options: priceTagAlignmentIds, control: { type: "inline-radio" } },
    currencyPosition: {
      options: priceTagCurrencyPositionIds,
      control: { type: "inline-radio" },
    },
    originalPosition: {
      options: ["before", "after"],
      control: { type: "inline-radio" },
    },
    amount: { control: { type: "number", step: 0.01 } },
    originalAmount: { control: { type: "number", step: 0.01 } },
    currency: { control: { type: "text" } },
    locale: { control: { type: "text" } },
    prefix: { control: { type: "text" } },
    suffix: { control: { type: "text" } },
    period: { control: { type: "text" } },
    decimals: { control: { type: "number", min: 0, max: 4, step: 1 } },
    hideCurrencySymbol: { control: { type: "boolean" } },
    hideDiscountBadge: { control: { type: "boolean" } },
    superscriptFraction: { control: { type: "boolean" } },
    block: { control: { type: "boolean" } },
  },
  args: {
    amount: 19.99,
    currency: "USD",
    size: "md",
    variant: "default",
    alignment: "start",
    currencyPosition: "leading",
    originalPosition: "before",
  },
} satisfies Meta<typeof PriceTag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllSizes: Story = {
  name: "All sizes",
  render: (args): ReactElement => (
    <div className="flex flex-col items-start gap-4">
      {priceTagSizeIds.map((s) => (
        <div key={s} className="flex items-baseline gap-4">
          <span className="w-8 text-xs uppercase tracking-wide text-muted-foreground">
            {s}
          </span>
          <PriceTag {...args} size={s} />
        </div>
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  name: "All variants",
  render: (args): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      {priceTagVariantIds.map((v) => (
        <div key={v} className="flex items-baseline gap-4">
          <span className="w-24 text-xs uppercase tracking-wide text-muted-foreground">
            {v}
          </span>
          <PriceTag {...args} variant={v} />
        </div>
      ))}
    </div>
  ),
};

export const WithRecurringPeriod: Story = {
  name: "With recurring period",
  args: {
    amount: 12,
    period: "mo",
    size: "lg",
    variant: "primary",
  },
};

export const StartingAt: Story = {
  name: "With prefix (Starting at)",
  args: {
    amount: 49,
    prefix: "From",
    period: "user/mo",
    size: "xl",
  },
};

export const OnSaleBefore: Story = {
  name: "On sale — original before",
  args: {
    amount: 79,
    originalAmount: 129,
    size: "xl",
    variant: "success",
    originalPosition: "before",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Setting `originalAmount` renders a strikethrough was-price and an auto `−N%` discount badge. `variant=\"success\"` tints the amount with `text-primary` so the sale price pops.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("group");
    expect(group.dataset.hasDiscount).toBe("true");
    const discount = group.querySelector('[data-slot="price-tag-discount"]');
    expect(discount).not.toBeNull();
    expect(discount?.textContent).toContain("39");
  },
};

export const OnSaleAfter: Story = {
  name: "On sale — original after",
  args: {
    amount: 79,
    originalAmount: 129,
    size: "lg",
    originalPosition: "after",
  },
};

export const CustomDiscountLabel: Story = {
  name: "Custom discount label",
  args: {
    amount: 19,
    originalAmount: 49,
    size: "lg",
    discountLabel: "BLACK FRIDAY",
  },
};

export const Zero: Story = {
  name: "Free (0.00)",
  args: {
    amount: 0,
    size: "xl",
    variant: "success",
    suffix: "forever",
  },
};

export const NegativeAmount: Story = {
  name: "Negative (refund)",
  args: {
    amount: -24.5,
    size: "lg",
    variant: "destructive",
    prefix: "Refund",
  },
};

export const Superscripted: Story = {
  name: "Superscripted fraction",
  args: {
    amount: 19.99,
    size: "xl",
    superscriptFraction: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "The fractional cents render smaller and superscripted at `lg` and `xl` by default. Toggle explicitly with `superscriptFraction`.",
      },
    },
  },
};

export const Currencies: Story = {
  name: "Currencies",
  render: (): ReactElement => (
    <div className="grid grid-cols-2 gap-x-8 gap-y-3">
      <PriceTag amount={19.99} currency="USD" period="mo" />
      <PriceTag amount={17.99} currency="EUR" period="mo" />
      <PriceTag amount={14.99} currency="GBP" period="mo" />
      <PriceTag amount={2980} currency="JPY" period="mo" />
      <PriceTag amount={28900} currency="KRW" period="mo" />
      <PriceTag amount={1699} currency="INR" period="mo" />
      <PriceTag amount={26.99} currency="CAD" period="mo" />
      <PriceTag amount={29.99} currency="AUD" period="mo" />
      <PriceTag amount={129.9} currency="BRL" period="mo" />
      <PriceTag amount={1699} currency="RUB" period="mo" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Symbols come from a curated map for common currencies; anything not in the map falls back to `Intl.NumberFormat`'s narrow symbol, and finally to the ISO code. Zero-fraction currencies like JPY / KRW drop the cents automatically.",
      },
    },
  },
};

export const TrailingSymbol: Story = {
  name: "Trailing symbol (EUR-style)",
  args: {
    amount: 19.99,
    currency: "EUR",
    currencyPosition: "trailing",
    period: "mo",
    size: "lg",
  },
};

export const Locales: Story = {
  name: "Locale-aware grouping",
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-2">
      <PriceTag amount={1_234_567.89} currency="USD" locale="en-US" size="lg" />
      <PriceTag amount={1_234_567.89} currency="EUR" locale="de-DE" size="lg" currencyPosition="trailing" />
      <PriceTag amount={1_234_567.89} currency="EUR" locale="fr-FR" size="lg" currencyPosition="trailing" />
      <PriceTag amount={1_234_567} currency="JPY" locale="ja-JP" size="lg" />
    </div>
  ),
};

export const CustomDecimals: Story = {
  name: "Custom decimals",
  render: (): ReactElement => (
    <div className="flex flex-col items-start gap-3">
      <PriceTag amount={0.0001234} currency="USD" decimals={4} size="lg" prefix="Rate" />
      <PriceTag amount={17.5} currency="USD" decimals={0} size="lg" />
      <PriceTag amount={17.5} currency="USD" decimals={2} size="lg" />
    </div>
  ),
};

export const HideSymbol: Story = {
  name: "Hide currency symbol",
  args: {
    amount: 1249.5,
    hideCurrencySymbol: true,
    size: "lg",
    prefix: "Total",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use when the surrounding UI (e.g. table column header) already communicates the currency.",
      },
    },
  },
};

export const PricingTable: Story = {
  name: "Pricing table (composition)",
  render: (): ReactElement => (
    <div className="grid grid-cols-3 gap-4">
      {[
        {
          name: "Starter",
          price: 0,
          period: "forever",
          variant: "muted" as const,
        },
        {
          name: "Pro",
          price: 19,
          original: 29,
          period: "mo",
          variant: "primary" as const,
          highlight: true,
        },
        {
          name: "Team",
          price: 49,
          period: "user/mo",
          variant: "default" as const,
        },
      ].map((tier) => (
        <div
          key={tier.name}
          className={`flex flex-col gap-3 rounded-lg border p-5 shadow-sm ${
            tier.highlight
              ? "border-primary bg-primary/5 dark:bg-primary/10"
              : "border-border bg-card"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {tier.name}
            </span>
            {tier.highlight ? (
              <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                Popular
              </span>
            ) : null}
          </div>
          <PriceTag
            amount={tier.price}
            currency="USD"
            period={tier.period}
            originalAmount={tier.original}
            size="xl"
            variant={tier.variant}
          />
          <p className="text-xs text-muted-foreground">
            {tier.name === "Starter"
              ? "For hobby projects and evaluation."
              : tier.name === "Pro"
                ? "Everything in Starter, plus higher limits."
                : "SSO, audit logs, and priority support."}
          </p>
        </div>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "PriceTag composes cleanly inside cards — pair it with prose and a CTA to get a pricing tier out of the box.",
      },
    },
  },
};

export const InvoiceRow: Story = {
  name: "Invoice row (compact)",
  render: (): ReactElement => (
    <div className="w-[420px] rounded-lg border border-border bg-card">
      {[
        { label: "Pro subscription (x3)", amount: 57.0 },
        { label: "Add-on: Extra storage (500 GB)", amount: 12.0 },
        { label: "Volume discount", amount: -6.9 },
        { label: "Tax (VAT 20%)", amount: 12.42 },
      ].map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between border-b border-border px-4 py-2 last:border-b-0"
        >
          <span className="text-sm text-foreground">{row.label}</span>
          <PriceTag
            amount={row.amount}
            size="sm"
            variant={row.amount < 0 ? "success" : "default"}
          />
        </div>
      ))}
      <div className="flex items-baseline justify-between px-4 py-3 border-t border-border">
        <span className="text-sm font-semibold text-foreground">Total</span>
        <PriceTag amount={74.52} size="lg" variant="primary" />
      </div>
    </div>
  ),
};

export const A11yLabel: Story = {
  name: "Accessibility (aria-label)",
  args: {
    amount: 19,
    originalAmount: 29,
    period: "mo",
    prefix: "Starting at",
    size: "lg",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("group");
    const label = group.getAttribute("aria-label") ?? "";
    expect(label).toContain("USD");
    expect(label).toContain("19");
    expect(label).toContain("per mo");
    expect(label).toContain("was");
    expect(label).toContain("34% off");
  },
};
