import type { Meta, StoryObj } from "@storybook/react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  accordionVariantIds,
  type AccordionVariantId,
} from "./accordion";
import type { ReactElement } from "react";

interface AccordionExampleProps {
  variant?: AccordionVariantId;
}

const items = [
  {
    value: "item-1",
    title: "Is it accessible?",
    content: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    value: "item-2",
    title: "Is it styled?",
    content:
      "Yes. It comes with default styles that match the other components' aesthetic.",
  },
  {
    value: "item-3",
    title: "Is it animated?",
    content:
      "Yes. It's animated by default, but you can disable it if you prefer.",
  },
];

function AccordionExample({ variant }: AccordionExampleProps): ReactElement {
  return (
    <Accordion type="single" collapsible variant={variant} className="w-80">
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

const meta = {
  title: "Components/Accordion",
  component: AccordionExample,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: accordionVariantIds,
      control: {
        type: "radio",
      },
    },
  },
  args: {},
} satisfies Meta<typeof AccordionExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
  },
};

export const Bordered: Story = {
  args: {
    variant: "bordered",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};
