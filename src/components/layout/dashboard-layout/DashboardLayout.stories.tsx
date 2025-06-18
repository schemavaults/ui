import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import type { PropsWithChildren, ReactElement, ReactNode } from "react";

import DashboardLayout, { type DashboardLayoutProps } from "./dashboard-layout";
import LoremIpsumText from "@/stories/LoremImpsumText";
import { PageColumnContainer } from "@/components/layout/page-column-container";
import { AlarmClock, Lock, Plane, Share2, Tornado, Users } from "lucide-react";
import { LazyFramerMotionProvider } from "@/components/providers";
import { Button, Wordmark } from "@/components/ui";
import { AnimatePresence, m } from "@/framer-motion";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import DashboardLayoutContextProvider from "./dashboard-layout-context-provider";
import { DashboardSidebarItemsAndGroupsDefinitions } from "./dashboard-sidebar-items-and-groups-context";
import { ICustomizableDashboardLayoutComponentProps } from "./customizable-dashboard-component-type";

function ExampleChildrenForContainer(): ReactNode {
  return (
    <div>
      <p>{LoremIpsumText}</p>
    </div>
  );
}

const exampleSidebarItems = [
  {
    type: "dashboard-sidebar-item-group",
    title: "Sidebar Group",
    items: [
      {
        type: "dashboard-sidebar-item-definition",
        title: "Menu Item 1",
        url: "#",
        icon: ({ className }) => <Tornado className={className} />,
      },
      {
        type: "dashboard-sidebar-item-definition",
        title: "Menu Item 2",
        url: "#",
        icon: ({ className }) => <AlarmClock className={className} />,
      },
      {
        type: "dashboard-sidebar-item-definition",
        title: "Menu Item 3",
        url: "#",
        icon: ({ className }) => <Plane className={className} />,
      },
    ],
  },
] satisfies DashboardSidebarItemsAndGroupsDefinitions;

function ExapleDashboardPageContent(): ReactElement {
  return (
    <PageColumnContainer>
      <ExampleChildrenForContainer />
    </PageColumnContainer>
  );
}

function Link({
  href,
  children,
  className,
}: PropsWithChildren<{ href: string; className?: string }>): ReactElement {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

function ExampleFooterContent({
  useDashboardSidebarOpenState,
}: ICustomizableDashboardLayoutComponentProps): ReactElement {
  const { open, mobile } = useDashboardSidebarOpenState();
  const showLabel: boolean = mobile || open;

  return (
    <Link
      className={cn(
        "w-full",
        "flex flex-row text-gray-400 gap-2",
        "justify-center",
        "p-2",
      )}
      href="#"
    >
      <Settings />
      <AnimatePresence>{showLabel && <m.p>Settings</m.p>}</AnimatePresence>
    </Link>
  );
}

function ExampleHeaderButtonsContent({}: ICustomizableDashboardLayoutComponentProps): ReactElement {
  return (
    <Button variant={"secondary"}>
      <Share2 className="h-6 w-6 pr-2" /> Share
    </Button>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Layouts/Dashboard Layout",
  component: DashboardLayout,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    children: {
      control: {},
      description: "React children to render within container component",
      table: {
        disable: true,
      },
    },
    logo: {
      table: {
        disable: true,
      },
    },
    wordmark: {
      table: {
        disable: true,
      },
    },
    Link: {
      table: {
        disable: true,
      },
    },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {
    children: <ExapleDashboardPageContent />,
    brandHref: "https://ui.schemavaults.com",
    Link,
    logo: <img src="/media/icon.png" width={40} height={40} />,
    wordmark: <Wordmark />,
    topBarTitle: "Page Title",
    sidebarFooterContent: ExampleFooterContent,
    topBarButtons: ExampleHeaderButtonsContent,
  },
  decorators: [
    // Wrap in Framer Motion Provider
    (Story, context): ReactElement => {
      return (
        <LazyFramerMotionProvider>
          <Story {...context} />
        </LazyFramerMotionProvider>
      );
    },
  ],
} satisfies Meta<typeof DashboardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const LayoutPreview: Story = {
  args: {
    sidebarItems: exampleSidebarItems,
  } satisfies Partial<DashboardLayoutProps>,
};

export const WithAdminOnlyLinks: Story = {
  args: {
    sidebarItems: [
      ...exampleSidebarItems,
      {
        type: "dashboard-sidebar-item-group",
        adminOnly: true,
        title: "Admin Links",
        items: [
          {
            type: "dashboard-sidebar-item-definition",
            title: "Admin Item 1",
            url: "#",
            icon: ({ className }) => <Lock className={className} />,
          },
          {
            type: "dashboard-sidebar-item-definition",
            title: "Admin Item 2",
            url: "#",
            icon: ({ className }) => <Users className={className} />,
          },
        ],
      },
    ],
  } satisfies Partial<DashboardLayoutProps>,
};
