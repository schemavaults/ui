import { useState, type ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import NumberInput from "./number-input";
import {
  numberInputSizeIds,
  numberInputStepperLayoutIds,
  numberInputVariantIds,
} from "./number-input-variants";

const meta = {
  title: "Components/NumberInput",
  component: NumberInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: numberInputSizeIds,
      control: { type: "radio" },
    },
    variant: {
      options: numberInputVariantIds,
      control: { type: "radio" },
    },
    stepperLayout: {
      options: numberInputStepperLayoutIds,
      control: { type: "radio" },
    },
    hideSteppers: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    readOnly: { control: { type: "boolean" } },
    invalid: { control: { type: "boolean" } },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number" } },
    precision: { control: { type: "number" } },
    placeholder: { control: { type: "text" } },
  },
  args: {
    onValueChange: fn(),
    placeholder: "Enter a number",
  },
  decorators: [
    (Story): ReactElement => (
      <div style={{ width: 280 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultValue: 0,
  },
};

export const WithBoundsAndStep: Story = {
  args: {
    defaultValue: 5,
    min: 0,
    max: 10,
    step: 1,
  },
};

export const FractionalStep: Story = {
  args: {
    defaultValue: 1.5,
    min: 0,
    max: 5,
    step: 0.25,
    precision: 2,
  },
};

export const StackedSteppers: Story = {
  args: {
    defaultValue: 0,
    stepperLayout: "stacked",
  },
};

export const HiddenSteppers: Story = {
  args: {
    defaultValue: 0,
    hideSteppers: true,
  },
};

export const WithPrefix: Story = {
  args: {
    defaultValue: 1999,
    min: 0,
    step: 100,
    prefix: "$",
  },
};

export const WithSuffix: Story = {
  args: {
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 5,
    suffix: "%",
  },
};

export const SmallSize: Story = {
  args: {
    defaultValue: 0,
    size: "sm",
  },
};

export const LargeSize: Story = {
  args: {
    defaultValue: 0,
    size: "lg",
  },
};

export const OutlineVariant: Story = {
  args: {
    defaultValue: 0,
    variant: "outline",
  },
};

export const GhostVariant: Story = {
  args: {
    defaultValue: 0,
    variant: "ghost",
  },
};

export const Invalid: Story = {
  args: {
    defaultValue: 999,
    min: 0,
    max: 100,
    invalid: true,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 7,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: 42,
    readOnly: true,
  },
};

function ControlledRenderer(): ReactElement {
  const [value, setValue] = useState<number | null>(3);
  return (
    <div className="flex flex-col gap-2">
      <NumberInput
        value={value}
        min={0}
        max={20}
        step={1}
        onValueChange={setValue}
      />
      <p className="text-xs text-muted-foreground">
        Current value: {value === null ? "(empty)" : value}
      </p>
    </div>
  );
}

export const Controlled: Story = {
  render: (): ReactElement => <ControlledRenderer />,
};

function CurrencyRenderer(): ReactElement {
  const [value, setValue] = useState<number | null>(19.99);
  return (
    <NumberInput
      value={value}
      min={0}
      step={0.5}
      precision={2}
      prefix="$"
      suffix="USD"
      onValueChange={setValue}
    />
  );
}

export const Currency: Story = {
  render: (): ReactElement => <CurrencyRenderer />,
};
