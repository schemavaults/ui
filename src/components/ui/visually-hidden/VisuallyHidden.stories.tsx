import type { Meta, StoryObj } from "@storybook/react";
import { VisuallyHidden } from "./visually-hidden";

const meta: Meta<typeof VisuallyHidden> = {
  title: "Components/Visually Hidden",
  component: VisuallyHidden,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "This text is visually hidden but accessible to screen readers",
  },
  render: (args) => (
    <div>
      <p>
        Visible text content (but there should be visually hidden content below
        this)
      </p>
      <VisuallyHidden {...args} />
      <p>
        More visible text content (but there should be visually hidden content
        above this)
      </p>
    </div>
  ),
};

export const WithButton: Story = {
  render: () => (
    <button>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 9L12 15L18 9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <VisuallyHidden>Expand menu</VisuallyHidden>
    </button>
  ),
};
