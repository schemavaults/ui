import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "storybook/test";

import { useState, type ReactElement, type ReactNode } from "react";

import DashboardLayout, { type DashboardLayoutProps } from "./dashboard-layout";
import LoremIpsumText from "@/stories/LoremImpsumText";
import { PageColumnContainer } from "@/components/layout/page-column-container";
import { AlarmClock, Lock, Plane, Share2, Tornado, Users } from "lucide-react";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  TooltipProvider,
  Wordmark,
} from "@/components/ui";
import ThemedPageContainer from "@/components/layout/themed-page-container";
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
import { fn } from "storybook/test";

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
    printHidden: {
      control: "boolean",
      description:
        "Hide the left sidebar and top header from printed output (`@media print`) so the system print dialog renders only the main page content. The on-screen layout is unaffected.",
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
      id="example-dashboard-full-screen-stepper-container"
      className={cn("grow flex flex-col w-full", "p-2 md:p-4 lg:p-6 xl:p-8")}
    >
      <Stepper
        id="dashboard-full-screen-stepper"
        steps={fullScreenSteps}
        state={state}
        getCurrentStep={(s: FullScreenStepperState): number => s.currentStep}
        setCurrentStep={(next: number): void => setState({ currentStep: next })}
        canGoNext={(opts): boolean =>
          opts.getCurrentStep(opts.state) < fullScreenSteps.length
        }
        canGoBack={(opts): boolean => opts.getCurrentStep(opts.state) > 0}
        FinalStepSubmitButton={(): ReactElement => (
          <Button
            onClick={(): void => {
              toast({
                variant: "default",
                title: "Pretending to submit example Stepper!",
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

// --- DashboardLayout + ThemedPageContainer (branded gradient) ----------

function LoremParagraphs({ n }: { n: number }): ReactElement {
  return (
    <>
      {Array.from({ length: n }).map((_, index) => (
        <p key={index}>{LoremIpsumText satisfies string}</p>
      ))}
    </>
  );
}

function ThemedExampleCardSection({
  title,
  n_paragraphs = 5,
}: {
  title: string;
  n_paragraphs?: number;
}): ReactElement {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          This is an example description for {title}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LoremParagraphs n={n_paragraphs} />
      </CardContent>
      <CardFooter>
        <p>This is the footer for {title}!</p>
      </CardFooter>
    </Card>
  );
}

function ThemedDashboardPageContent(): ReactElement {
  const SECTION_COUNT: number = 6;
  return (
    <ThemedPageContainer>
      {Array.from({ length: SECTION_COUNT }).map((_, index) => (
        <ThemedExampleCardSection
          key={`themed-section-${index}`}
          title={`Section ${index + 1}`}
        />
      ))}
    </ThemedPageContainer>
  );
}

export const WithThemedPageContainer: Story = {
  args: {
    sidebarItems: exampleSidebarItems,
    topBarTitle: "Themed Page",
  } satisfies Partial<DashboardLayoutProps>,
  render: (args): ReactElement => (
    <DashboardLayout {...args}>
      <ThemedDashboardPageContent />
    </DashboardLayout>
  ),
};

// Exercises the `usePathname` integration so reviewers can verify two
// behaviours that 0.46.6 regressed/fixed: (1) on mobile, tapping the trigger
// must open the Sheet and keep it open (previously the close-on-route-change
// hook re-fired on every `open` flip and slammed it shut); (2) on a true
// pathname change, the sidebar must auto-close on mobile but persist on
// desktop. Switch Storybook's viewport between Mobile and Desktop to see
// both halves.
function WithUsePathnamePageContent({
  pathname,
  onSimulateNavigation,
}: {
  pathname: string;
  onSimulateNavigation: () => void;
}): ReactElement {
  return (
    <div className="flex flex-col gap-3 p-4 items-start">
      <p>
        Current pathname: <code>{pathname}</code>
      </p>
      <Button onClick={onSimulateNavigation}>Simulate navigation</Button>
      <p className="text-sm text-muted-foreground max-w-prose">
        On a mobile viewport: tap the sidebar trigger — the Sheet should stay
        open. Then click &ldquo;Simulate navigation&rdquo; — the sidebar
        should auto-close. On desktop, expanding the sidebar should persist
        across navigation.
      </p>
      <ExampleChildrenForContainer />
    </div>
  );
}

function WithUsePathnameStoryRender(
  args: Partial<DashboardLayoutProps>,
): ReactElement {
  const [pathname, setPathname] = useState<string>("/dashboard");
  const usePathname = (): string => pathname;
  return (
    <DashboardLayout
      {...(args as DashboardLayoutProps)}
      usePathname={usePathname}
    >
      <WithUsePathnamePageContent
        pathname={pathname}
        onSimulateNavigation={(): void => {
          setPathname(`/dashboard/${Date.now()}`);
        }}
      />
    </DashboardLayout>
  );
}

export const WithUsePathname: Story = {
  args: {
    sidebarItems: exampleSidebarItems,
    topBarTitle: "Mobile open + usePathname",
  } satisfies Partial<DashboardLayoutProps>,
  render: (args): ReactElement => <WithUsePathnameStoryRender {...args} />,
};

// --- printHidden: print only the main page content ---------------------
//
// With `printHidden` enabled, the dashboard "chrome" (the left sidebar and the
// top header bar) is hidden from printed output via `@media print`, and the
// main content area expands to the full page width. The on-screen layout is
// unchanged — open the browser's print preview (or click the button in the
// story) to watch the sidebar and header drop away, leaving just the page
// content. This is handy for printable reports rendered inside the dashboard.
function PrintablePageContent(): ReactElement {
  return (
    <PageColumnContainer>
      <div className="flex flex-col gap-4 p-4 items-start">
        <Button onClick={(): void => window.print()}>Open print dialog</Button>
        <p className="text-sm text-muted-foreground max-w-prose">
          This story sets <code>printHidden</code>. Open your browser&rsquo;s
          print preview (or click &ldquo;Open print dialog&rdquo;) and notice
          that the left sidebar and the top header are gone, while this content
          fills the full page width. The on-screen layout is unaffected.
        </p>
        <ExampleChildrenForContainer />
      </div>
    </PageColumnContainer>
  );
}

export const WithPrintHidden: Story = {
  args: {
    sidebarItems: exampleSidebarItems,
    topBarTitle: "Printable Report",
    printHidden: true,
  } satisfies Partial<DashboardLayoutProps>,
  render: (args): ReactElement => (
    <DashboardLayout {...args}>
      <PrintablePageContent />
    </DashboardLayout>
  ),
};
