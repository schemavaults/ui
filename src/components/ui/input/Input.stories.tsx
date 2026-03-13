import { useState, type ReactElement } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { Dices, KeyRound } from "lucide-react";

import Input from "./input";
import { Button } from "@/components/ui/button";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      type: "string",
      control: {
        type: "text",
      },
      description:
        "Text that appears until the user has filled the text input with a string value",
      table: {
        defaultValue: undefined,
      },
    },
  },
  args: {
    onChange: (): void => {
      fn();
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultTextInput: Story = {
  args: {},
};

export const NumberInput: Story = {
  args: {
    type: "number",
  },
};

export const RangeInput: Story = {
  args: {
    type: "range",
    step: 1,
    min: 0,
    max: 100,
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: "This text input has placeholder text!",
  },
};

function UUIDWithRandomizeRenderer(): ReactElement {
  const [value, setValue] = useState<string>(crypto.randomUUID());
  return (
    <Input
      icon={KeyRound}
      value={value}
      onChange={(e): void => setValue(e.target.value)}
      rightButton={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 mr-1"
          onClick={(): void => setValue(crypto.randomUUID())}
        >
          <Dices className="h-4 w-4" />
        </Button>
      }
    />
  );
}

export const UUIDWithRandomize: Story = {
  render: (): ReactElement => <UUIDWithRandomizeRenderer />,
};
