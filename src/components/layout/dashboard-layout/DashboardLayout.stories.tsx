import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import type { ReactElement, ReactNode } from "react";

import DashboardLayout, { type DashboardLayoutProps } from "./dashboard-layout";
import LoremIpsumText from "@/stories/LoremImpsumText";
import { PageColumnContainer } from "@/components/layout/page-column-container";
import { AlarmClock, Plane, Tornado } from "lucide-react";
import { LazyFramerMotionProvider } from "@/components/providers";
import { Wordmark } from "@/components/ui";
import { useArgs, useCallback, useMemo } from "@storybook/preview-api";

function ExampleChildrenForContainer(): ReactNode {
  return (
    <div>
      <p>{LoremIpsumText}</p>
    </div>
  );
}

function ExapleDashboardPageContent(): ReactElement {
  return (
    <PageColumnContainer>
      <ExampleChildrenForContainer />
    </PageColumnContainer>
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
    open: {
      control: {
        type: "boolean",
      },
      type: "boolean",
      defaultValue: false,
    },
    onOpenChange: {
      description: "Modify the state when the user closes the sidebar",
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
    Link: ({ href, children, className }): ReactElement => {
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    },
    logo: <img src="/media/icon.png" width={40} height={40} />,
    wordmark: <Wordmark />,
    open: false,
    onOpenChange: () => {
      if (process.env.NODE_ENV === "development") {
        console.error(
          "[DashboardLayout.stories.tsx] This should be overwritten by the decorator!",
        );
      }
      throw new Error(
        "[onOpenChange] This should be overwritten by a Storybook.js decorator that controls the open/closed state of the layout sidebar!",
      );
    },
  },
  decorators: [
    // Wrap in Framer Motion Provider
    (Story, context): ReactElement => {
      console.log(
        "[DashboardLayout.stories.tsx] rendering sidebar lazy framer motion decorator...",
      );
      return (
        <LazyFramerMotionProvider>
          <Story {...context} />
        </LazyFramerMotionProvider>
      );
    },
    // Connect 'open'/'onOpenChange' props to Storybook.js Controls
    (Story, context): ReactElement => {
      const [args, setArgs] = useArgs<DashboardLayoutProps>();
      // Use the wrapper component instead of modifying Story args

      const open = useMemo(() => args.open, [args.open]);

      const onOpenChange = useCallback(
        (newOpenState: boolean): void => {
          if (process.env.NODE_ENV === "development") {
            console.log("[onOpenChange] newOpenState: ", newOpenState);
          }
          setArgs({ open: newOpenState });
        },
        [setArgs],
      );

      if (process.env.NODE_ENV === "development") {
        console.log(
          "[DashboardLayout.stories.tsx] rendering sidebar open state controller decorator...",
        );
      }

      return <Story {...context} args={{ ...args, open, onOpenChange }} />;
    },
  ],
} satisfies Meta<typeof DashboardLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const exampleSidebarItems = [
  {
    type: "dashboard-sidebar-item-group",
    title: "Sidebar Group",
    items: [
      {
        type: "dashboard-sidebar-item-definition",
        title: "Menu Item 1",
        url: "#",
        icon: <Tornado />,
      },
      {
        type: "dashboard-sidebar-item-definition",
        title: "Menu Item 2",
        url: "#",
        icon: <AlarmClock />,
      },
      {
        type: "dashboard-sidebar-item-definition",
        title: "Menu Item 3",
        url: "#",
        icon: <Plane />,
      },
    ],
  },
] satisfies DashboardLayoutProps["sidebarItems"];

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const LayoutPreview: Story = {
  args: {
    sidebarItems: exampleSidebarItems,
  } satisfies Partial<DashboardLayoutProps>,
};
