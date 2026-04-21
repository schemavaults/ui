import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "@storybook/test";

import { useState, type ReactElement, type ReactNode } from "react";

import DashboardLayout, { type DashboardLayoutProps } from "./dashboard-layout";
import LoremIpsumText from "@/stories/LoremImpsumText";
import { PageColumnContainer } from "@/components/layout/page-column-container";
import { AlarmClock, Lock, Plane, Share2, Tornado, Users } from "lucide-react";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import { Button, TooltipProvider, Wordmark } from "@/components/ui";
import { Stepper, type Step } from "@/components/ui/stepper";
import type { BaseStepperState } from "@/components/ui/stepper/base-stepper-state-type";
import Toaster from "@/components/ui/toaster";
import { useToast } from "@/components/hooks/use-toast";
import { AnimatePresence, m } from "@/framer-motion";
import { cn } from "@/lib/utils";
import { Settings } from "lucide-react";
import type { DashboardSidebarItemsAndGroupsDefinitions } from "./dashboard-sidebar";
import type {
  CustomizableDashboardLayoutComponent,
  ICustomizableDashboardLayoutComponentProps,
} from "./customizable-dashboard-component-type";
import type { LinkComponentProps, LinkComponentType } from "@/types/Link";
import { fn } from "@storybook/test";

function ExampleChildrenForContainer(): ReactNode {
  const REPEAT_TEXT: number = 25;
  return (
    <div className="flex flex-col gap-4 justify-start items-start p-4">
      {Array.from({ length: REPEAT_TEXT }).map((_, index) => (
        <p key={index}>{LoremIpsumText satisfies string}</p>
      ))}
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
  onClick,
}: LinkComponentProps): ReactElement {
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

Link satisfies LinkComponentType;

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
    logo: (
      <img
        src="/media/icon.png"
        alt="SchemaVaults icon for dashboard layout example header"
        width={40}
        height={40}
      />
    ),
    wordmark: <Wordmark />,
    topBarTitle: "Page Title",
    sidebarFooterContent:
      ExampleFooterContent satisfies CustomizableDashboardLayoutComponent,
    topBarButtons: ExampleHeaderButtonsContent,
    onOpenSidebar: fn(),
    onCloseSidebar: fn(),
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
    // Wrap in Tooltip Provider
    (Story, context): ReactElement => {
      return (
        <TooltipProvider>
          <Story {...context} />
        </TooltipProvider>
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

// --- Full-screen Stepper page content ----------------------------------

interface FullScreenStepperState extends BaseStepperState {
  currentStep: number;
}

function FullScreenStepContent({ message }: { message: string }): ReactElement {
  return (
    <div className="relative">
      <p className="font-bold">{message}</p>
    </div>
  );
}

const fullScreenSteps: Step<FullScreenStepperState>[] = [
  {
    id: "account",
    label: "Account",
    stepComponent: (): ReactElement => (
      <FullScreenStepContent message="Configure your account details." />
    ),
    state: "unfilled",
    beforeNextStep: async (): Promise<boolean> => true,
  },
  {
    id: "team",
    label: "Team",
    stepComponent: (): ReactElement => (
      <FullScreenStepContent message="Invite your teammates." />
    ),
    state: "unfilled",
    beforeNextStep: async (): Promise<boolean> => true,
  },
  {
    id: "review",
    label: "Review",
    stepComponent: (): ReactElement => (
      <FullScreenStepContent message="Review and submit." />
    ),
    state: "unfilled",
    beforeNextStep: async (): Promise<boolean> => true,
  },
];

function FullScreenStepperPageContent(): ReactElement {
  const [state, setState] = useState<FullScreenStepperState>({
    currentStep: 0,
  });
  const { toast } = useToast();

  // Stepper's body uses flex-1, so it needs a bounded flex-column ancestor to
  // grow into. Sizing to the viewport minus the dashboard header keeps the
  // outer dashboard content container from introducing page-level scroll —
  // the stepper body handles its own overflow.
  return (
    <div
      className="flex flex-col w-full"
      style={{ height: "calc(100svh - 56px)" }}
    >
      <Stepper
        id="dashboard-full-screen-stepper"
        steps={fullScreenSteps}
        state={state}
        getCurrentStep={(s: FullScreenStepperState): number => s.currentStep}
        setCurrentStep={(next: number): void =>
          setState({ currentStep: next })
        }
        canGoNext={(opts): boolean =>
          opts.getCurrentStep(opts.state) < fullScreenSteps.length
        }
        canGoBack={(opts): boolean => opts.getCurrentStep(opts.state) > 0}
        FinalStepSubmitButton={(): ReactElement => (
          <Button
            onClick={(): void => {
              toast({
                variant: "default",
                title: "Pretending to submit Stepper",
                description: "This is a Storybook demo.",
              });
            }}
          >
            Submit
          </Button>
        )}
      />
    </div>
  );
}

export const WithFullScreenStepper: Story = {
  args: {
    sidebarItems: exampleSidebarItems,
    topBarTitle: "Onboarding",
  } satisfies Partial<DashboardLayoutProps>,
  render: (args): ReactElement => (
    <DashboardLayout {...args}>
      <FullScreenStepperPageContent />
    </DashboardLayout>
  ),
  decorators: [
    (Story): ReactElement => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
};
