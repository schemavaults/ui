import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import type { ReactElement } from "react";

import { Banner, bannerVariantIds, type BannerVariantId } from "./banner";
import { Button } from "../button/button";

interface BannerExampleProps {
  variant?: BannerVariantId;
  dismissible?: boolean;
  children?: string;
  showAction?: boolean;
  onDismiss?: () => void;
}

function BannerExample({
  showAction,
  children,
  ...props
}: BannerExampleProps): ReactElement {
  return (
    <Banner
      {...props}
      action={
        showAction ? (
          <Button variant="outline" size="sm">
            Learn more
          </Button>
        ) : undefined
      }
    >
      {children}
    </Banner>
  );
}

const meta = {
  title: "Components/Banner",
  component: BannerExample,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: bannerVariantIds,
      control: {
        type: "radio",
      },
    },
    dismissible: {
      control: {
        type: "boolean",
      },
    },
    showAction: {
      control: {
        type: "boolean",
      },
    },
    children: {
      control: {
        type: "text",
      },
    },
  },
  args: {
    children: "This is a banner message for your attention.",
    onDismiss: fn(),
  },
} satisfies Meta<typeof BannerExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: {
    variant: "info",
    children: "A new version of the platform is available. Refresh to update.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Your changes have been saved successfully.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    children:
      "Scheduled maintenance will occur on Saturday from 2:00 AM to 4:00 AM UTC.",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children:
      "Service disruption detected. Some features may be temporarily unavailable.",
  },
};

export const Dismissible: Story = {
  args: {
    variant: "info",
    dismissible: true,
    children: "This banner can be dismissed by clicking the X button.",
  },
};

export const WithAction: Story = {
  args: {
    variant: "warning",
    showAction: true,
    children: "Your trial expires in 3 days.",
  },
};

export const DismissibleWithAction: Story = {
  args: {
    variant: "success",
    dismissible: true,
    showAction: true,
    children: "Deployment completed. Your changes are now live.",
  },
};

function AllVariantsExample(): ReactElement {
  return (
    <div className="flex flex-col gap-3 w-full">
      {bannerVariantIds.map((variant) => (
        <Banner key={variant} variant={variant} dismissible>
          This is a <strong>{variant}</strong> banner with a dismiss button.
        </Banner>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: () => <AllVariantsExample />,
  args: {},
};
