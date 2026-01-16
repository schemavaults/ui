import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import type { ReactElement } from "react";
import { Copy, Edit, Trash2, Share, Download, Settings } from "lucide-react";

import InlineMenu from "./inline-menu";
import type { InlineMenuItemDefinition } from "./inline-menu";

const basicItems: InlineMenuItemDefinition[] = [
  { id: "edit", label: "Edit", onPress: fn() },
  { id: "copy", label: "Copy", onPress: fn() },
  { id: "share", label: "Share", onPress: fn() },
];

const itemsWithIcons: InlineMenuItemDefinition[] = [
  { id: "edit", label: "Edit", icon: ({ className }) => <Edit  className={className} />, onPress: fn() },
  { id: "copy", label: "Copy", icon: ({ className }) => <Copy  className={className} />, onPress: fn() },
  { id: "share", label: "Share", icon: ({ className }) => <Share  className={className} />, onPress: fn() },
  { id: "download", label: "Download", icon: ({ className }) => <Download  className={className} />, onPress: fn() },
];

const itemsWithDestructive: InlineMenuItemDefinition[] = [
  { id: "edit", label: "Edit", icon: ({ className }) => <Edit  className={className} />, onPress: fn() },
  { id: "copy", label: "Copy", icon: ({ className }) => <Copy  className={className} />, onPress: fn() },
  { id: "delete", label: "Delete", icon: ({ className }) => <Trash2  className={className} />, destructive: true, onPress: fn() },
];

const itemsWithDisabled: InlineMenuItemDefinition[] = [
  { id: "edit", label: "Edit", icon: ({ className }) => <Edit  className={className} />, onPress: fn() },
  { id: "copy", label: "Copy", icon: ({ className }) => <Copy  className={className} />, disabled: true },
  { id: "settings", label: "Settings", icon: ({ className }) => <Settings  className={className} />, disabled: true },
  { id: "share", label: "Share", icon: ({ className }) => <Share  className={className} />, onPress: fn() },
];

function BasicDemo(): ReactElement {
  return <InlineMenu items={basicItems} />;
}

function WithIconsDemo(): ReactElement {
  return <InlineMenu items={itemsWithIcons} />;
}

function WithDestructiveDemo(): ReactElement {
  return <InlineMenu items={itemsWithDestructive} />;
}

function WithDisabledDemo(): ReactElement {
  return <InlineMenu items={itemsWithDisabled} />;
}

function WithCloseButtonDemo(): ReactElement {
  return <InlineMenu items={itemsWithIcons} close={fn()} />;
}

const meta = {
  title: "Components/InlineMenu",
  component: BasicDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {},
  args: {},
} satisfies Meta<typeof BasicDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <BasicDemo />,
};

export const WithIcons: Story = {
  render: () => <WithIconsDemo />,
};

export const WithDestructive: Story = {
  render: () => <WithDestructiveDemo />,
};

export const WithDisabled: Story = {
  render: () => <WithDisabledDemo />,
};

export const WithCloseButton: Story = {
  render: () => <WithCloseButtonDemo />,
};
