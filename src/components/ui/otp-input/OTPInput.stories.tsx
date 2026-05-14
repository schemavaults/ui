import { useRef, useState, type ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";

import { OTPInput, type OTPInputHandle } from "./otp-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const meta = {
  title: "Components/OTPInput",
  component: OTPInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    length: {
      control: { type: "number", min: 3, max: 10, step: 1 },
      description: "Number of slots rendered",
    },
    mode: {
      control: { type: "inline-radio" },
      options: ["numeric", "alphanumeric"],
      description: "Restrict input to digits or letters+digits",
    },
    variant: {
      control: { type: "inline-radio" },
      options: ["default", "outline", "underline", "filled"],
    },
    size: {
      control: { type: "inline-radio" },
      options: ["sm", "md", "lg"],
    },
    mask: {
      control: { type: "boolean" },
      description: "Mask entered characters as dots",
    },
    invalid: {
      control: { type: "boolean" },
    },
    disabled: {
      control: { type: "boolean" },
    },
    groupSize: {
      control: { type: "number", min: 0, max: 5, step: 1 },
      description: "Render a visual separator every N slots (0 = no grouping)",
    },
    placeholder: {
      control: { type: "text" },
    },
  },
  args: {
    length: 6,
    mode: "numeric",
    variant: "default",
    size: "md",
    mask: false,
    invalid: false,
    disabled: false,
    onChange: fn(),
    onComplete: fn(),
  },
} satisfies Meta<typeof OTPInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FourDigit: Story = {
  args: {
    length: 4,
    focusOnMount: true,
  },
};

export const EightDigitGrouped: Story = {
  args: {
    length: 8,
    groupSize: 4,
    placeholder: "•",
  },
};

export const OutlineVariant: Story = {
  args: {
    variant: "outline",
  },
};

export const UnderlineVariant: Story = {
  args: {
    variant: "underline",
  },
};

export const FilledVariant: Story = {
  args: {
    variant: "filled",
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
  },
};

export const SmallSize: Story = {
  args: {
    size: "sm",
    length: 4,
  },
};

export const Alphanumeric: Story = {
  args: {
    mode: "alphanumeric",
    length: 6,
    placeholder: "·",
  },
};

export const Masked: Story = {
  args: {
    mask: true,
    defaultValue: "123456",
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    defaultValue: "000000",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: "123",
  },
};

function ControlledRenderer(): ReactElement {
  const [value, setValue] = useState<string>("");
  const [completedAt, setCompletedAt] = useState<string | null>(null);
  const inputRef = useRef<OTPInputHandle | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <Label>Enter the 6-digit code we emailed you</Label>
      <OTPInput
        ref={inputRef}
        value={value}
        onChange={setValue}
        onComplete={(full): void => setCompletedAt(full)}
        focusOnMount
      />
      <div className="text-xs text-muted-foreground">
        Value: <code>{value || "(empty)"}</code>
        {completedAt ? (
          <span className="ml-2">
            — submitted <code>{completedAt}</code>
          </span>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(): void => inputRef.current?.clear()}
        >
          Clear
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(): void => inputRef.current?.focus()}
        >
          Focus
        </Button>
      </div>
    </div>
  );
}

export const ControlledWithImperativeHandle: Story = {
  render: (): ReactElement => <ControlledRenderer />,
};

function FormRenderer(): ReactElement {
  const [submitted, setSubmitted] = useState<string | null>(null);
  return (
    <form
      className="flex flex-col items-center gap-3"
      onSubmit={(e): void => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        setSubmitted(String(formData.get("otp") ?? ""));
      }}
    >
      <Label htmlFor="otp">Two-factor code</Label>
      <OTPInput name="otp" length={6} groupSize={3} focusOnMount />
      <Button type="submit" size="sm">
        Verify
      </Button>
      {submitted !== null ? (
        <div className="text-xs text-muted-foreground">
          Submitted: <code>{submitted || "(empty)"}</code>
        </div>
      ) : null}
    </form>
  );
}

export const InsideForm: Story = {
  render: (): ReactElement => <FormRenderer />,
};
