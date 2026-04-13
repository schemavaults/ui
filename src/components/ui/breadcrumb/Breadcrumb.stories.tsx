import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import {
  breadcrumbSeparatorVariantIds,
  breadcrumbSizeIds,
  breadcrumbVariantIds,
  type BreadcrumbSeparatorVariant,
  type BreadcrumbSize,
  type BreadcrumbVariant,
} from "./breadcrumb-variants";

interface BreadcrumbExampleProps {
  separator?: BreadcrumbSeparatorVariant;
  size?: BreadcrumbSize;
  variant?: BreadcrumbVariant;
  withEllipsis?: boolean;
}

function BreadcrumbExample({
  separator,
  size,
  variant,
  withEllipsis = false,
}: BreadcrumbExampleProps): ReactElement {
  return (
    <Breadcrumb separator={separator} size={size} variant={variant}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {withEllipsis ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        ) : (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/vaults">Vaults</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}
        <BreadcrumbItem>
          <BreadcrumbLink href="/vaults/customers">Customers</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Schema Editor</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const meta = {
  title: "Components/Breadcrumb",
  component: BreadcrumbExample,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    separator: {
      options: breadcrumbSeparatorVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: breadcrumbSizeIds,
      control: { type: "radio" },
    },
    variant: {
      options: breadcrumbVariantIds,
      control: { type: "radio" },
    },
    withEllipsis: {
      control: { type: "boolean" },
    },
  },
  args: {
    separator: "chevron",
    size: "default",
    variant: "default",
    withEllipsis: false,
  },
} satisfies Meta<typeof BreadcrumbExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultBreadcrumb: Story = {};

export const SlashSeparator: Story = {
  args: {
    separator: "slash",
  },
};

export const DotSeparator: Story = {
  args: {
    separator: "dot",
  },
};

export const ArrowSeparator: Story = {
  args: {
    separator: "arrow",
  },
};

export const SmallSize: Story = {
  args: {
    size: "sm",
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
  },
};

export const PrimaryVariant: Story = {
  args: {
    variant: "primary",
  },
};

export const MutedVariant: Story = {
  args: {
    variant: "muted",
  },
};

export const GhostVariant: Story = {
  args: {
    variant: "ghost",
  },
};

export const WithEllipsis: Story = {
  args: {
    withEllipsis: true,
  },
};

export const CollapsedLongPath: Story = {
  render: (): ReactElement => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/vaults/customers/schemas">
            Schemas
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Field: emailAddress</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};

export const CustomSeparator: Story = {
  render: (): ReactElement => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{"\u2022"}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>{"\u2022"}</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
};
