import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "storybook/test";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";

import DashboardLayout, { type DashboardLayoutProps } from "./dashboard-layout";
import LoremIpsumText from "@/stories/LoremImpsumText";
import { PageColumnContainer } from "@/components/layout/page-column-container";
import { AlarmClock, Lock, Plane, Share2, Tornado, Users } from "lucide-react";
import {
  Activity,
  Archive,
  BarChart3,
  Bell,
  Bookmark,
  BookOpen,
  Calendar,
  Cloud,
  Clock,
  CreditCard,
  Database,
  FileCode,
  FileText,
  Flag,
  Folder,
  GitBranch,
  Globe,
  Inbox,
  Key,
  LayoutDashboard,
  LifeBuoy,
  LineChart,
  Mail,
  Package,
  Palette,
  PieChart,
  Plug,
  Puzzle,
  Receipt,
  Search,
  Server,
  Shield,
  ShoppingCart,
  SlidersHorizontal,
  Tag,
  Terminal,
  Trash2,
  TrendingUp,
  Truck,
  UserPlus,
  Video,
  Webhook,
} from "lucide-react";
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
import type {
  DashboardSidebarItemDefinition,
  DashboardSidebarItemGroupDefinition,
  DashboardSidebarItemsAndGroupsDefinitions,
} from "./dashboard-sidebar";
import type {
  CustomizableDashboardLayoutComponent,
  ICustomizableDashboardLayoutComponentProps,
} from "./customizable-dashboard-component-type";
import type { LinkComponentProps, LinkComponentType } from "@/types/Link";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

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

// --- Many links: the case where flex-shrink used to bite ---------------
//
// A realistic, product-sized menu: 46 links spread across ungrouped runs and
// eight groups, comfortably taller than any viewport. This is the shape that
// exposed the original bug -- ungrouped rows were direct children of the
// scrolling menu <nav>, so once the menu overflowed they were squashed to
// their text height (~18px) while grouped rows, nested one level deeper in
// their group's <ul>, held their full 2.5rem. Scroll the sidebar and toggle it
// collapsed/expanded: every row is the same height and every gap is the same
// 8px, whichever kind of link it is.
//
// The assertions that lock this in live in MixedGroupedAndUngroupedLinks
// below; this story is here to be looked at.

type SidebarIconSource = ComponentType<{ className?: string }>;

function manyLinksItem(
  title: string,
  IconComponent: SidebarIconSource,
): DashboardSidebarItemDefinition {
  const slug: string = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return {
    type: "dashboard-sidebar-item-definition",
    title,
    url: `/many-links/${slug}`,
    icon: ({ className }): ReactElement => (
      <IconComponent className={className} />
    ),
  };
}

function manyLinksGroup(
  title: string,
  items: readonly DashboardSidebarItemDefinition[],
  adminOnly: boolean = false,
): DashboardSidebarItemGroupDefinition {
  return {
    type: "dashboard-sidebar-item-group",
    title,
    items,
    adminOnly,
  };
}

const manyLinksSidebarItems = [
  // A run of ungrouped links, straight off the top of the menu.
  manyLinksItem("Overview", LayoutDashboard),
  manyLinksItem("Search", Search),
  manyLinksItem("Inbox", Inbox),
  manyLinksItem("Notifications", Bell),

  manyLinksGroup("Analytics", [
    manyLinksItem("Reports", BarChart3),
    manyLinksItem("Trends", LineChart),
    manyLinksItem("Segments", PieChart),
    manyLinksItem("Funnels", TrendingUp),
    manyLinksItem("Realtime", Activity),
  ]),

  manyLinksGroup("Content", [
    manyLinksItem("Pages", FileText),
    manyLinksItem("Media", Video),
    manyLinksItem("Snippets", FileCode),
    manyLinksItem("Collections", Folder),
    manyLinksItem("Saved", Bookmark),
  ]),

  // A second ungrouped run, this time sandwiched between two groups -- the
  // arrangement that made the old spacing mismatch most obvious.
  manyLinksItem("Calendar", Calendar),
  manyLinksItem("Schedule", Clock),
  manyLinksItem("Tasks", Flag),

  manyLinksGroup("Commerce", [
    manyLinksItem("Orders", ShoppingCart),
    manyLinksItem("Payments", CreditCard),
    manyLinksItem("Products", Package),
    manyLinksItem("Invoices", Receipt),
    manyLinksItem("Discounts", Tag),
    manyLinksItem("Shipping", Truck),
  ]),

  manyLinksGroup("Team", [
    manyLinksItem("Members", Users),
    manyLinksItem("Invitations", UserPlus),
    manyLinksItem("Roles", Shield),
    manyLinksItem("API Keys", Key),
  ]),

  manyLinksGroup("Integrations", [
    manyLinksItem("Email", Mail),
    manyLinksItem("Webhooks", Webhook),
    manyLinksItem("Plugins", Plug),
    manyLinksItem("Extensions", Puzzle),
    manyLinksItem("Domains", Globe),
  ]),

  manyLinksGroup("Developer", [
    manyLinksItem("Database", Database),
    manyLinksItem("Servers", Server),
    manyLinksItem("Storage", Cloud),
    manyLinksItem("Console", Terminal),
    manyLinksItem("Deployments", GitBranch),
  ]),

  // A third ungrouped run, near the bottom of a menu that is already
  // scrolling.
  manyLinksItem("Preferences", SlidersHorizontal),
  manyLinksItem("Appearance", Palette),
  manyLinksItem("Documentation", BookOpen),

  manyLinksGroup("Support", [
    manyLinksItem("Help Center", LifeBuoy),
    manyLinksItem("Archive", Archive),
  ]),

  // Admin groups render in red, so this also shows that the shared rhythm
  // holds for a group with its own item styling.
  manyLinksGroup(
    "Admin",
    [
      manyLinksItem("Audit Log", Lock),
      manyLinksItem("Feature Flags", Flag),
      manyLinksItem("Purge Data", Trash2),
      manyLinksItem("Archived Orgs", Archive),
    ],
    true,
  ),
] satisfies DashboardSidebarItemsAndGroupsDefinitions;

export const ManySidebarLinks: Story = {
  args: {
    sidebarItems: manyLinksSidebarItems,
    topBarTitle: "Many links",
  } satisfies Partial<DashboardLayoutProps>,
};

// --- Menu rhythm: ungrouped and grouped links must match ----------------
//
// The sidebar menu <nav> is a flex column with its own scrollbar. Flex
// children shrink by default, so before this story existed, a menu long
// enough to overflow squashed its ungrouped rows (they are direct children of
// the <nav>) while leaving grouped rows alone (they sit one level deeper,
// inside their group's <ul>). Plain links rendered ~18px tall next to 40px
// grouped links. This story mixes both kinds and supplies enough items to
// overflow any reasonable viewport, and its play() test measures the result.

const rhythmSidebarItems = [
  ...Array.from({ length: 9 }).map((_, index) => ({
    type: "dashboard-sidebar-item-definition" as const,
    title: `Plain Link ${index + 1}`,
    url: `/rhythm/plain-${index + 1}`,
    icon: ({ className }: { className?: string }): ReactElement => (
      <Tornado className={className} />
    ),
  })),
  {
    type: "dashboard-sidebar-item-group",
    title: "First Group",
    items: Array.from({ length: 6 }).map((_, index) => ({
      type: "dashboard-sidebar-item-definition" as const,
      title: `Grouped Link ${index + 1}`,
      url: `/rhythm/grouped-${index + 1}`,
      icon: ({ className }: { className?: string }): ReactElement => (
        <AlarmClock className={className} />
      ),
    })),
  },
  ...Array.from({ length: 6 }).map((_, index) => ({
    type: "dashboard-sidebar-item-definition" as const,
    title: `Trailing Link ${index + 1}`,
    url: `/rhythm/trailing-${index + 1}`,
    icon: ({ className }: { className?: string }): ReactElement => (
      <Plane className={className} />
    ),
  })),
  {
    type: "dashboard-sidebar-item-group",
    title: "Second Group",
    items: Array.from({ length: 6 }).map((_, index) => ({
      type: "dashboard-sidebar-item-definition" as const,
      title: `Second Grouped Link ${index + 1}`,
      url: `/rhythm/second-grouped-${index + 1}`,
      icon: ({ className }: { className?: string }): ReactElement => (
        <Users className={className} />
      ),
    })),
  },
] satisfies DashboardSidebarItemsAndGroupsDefinitions;

export const MixedGroupedAndUngroupedLinks: Story = {
  // A regression test for menu spacing rather than a showcase, and it needs a
  // real viewport height to overflow. Keep it out of the autodocs page.
  tags: ["!autodocs"],
  args: {
    sidebarItems: rhythmSidebarItems,
    topBarTitle: "Menu rhythm",
  } satisfies Partial<DashboardLayoutProps>,
  play: async ({ canvasElement }): Promise<void> => {
    const findRow = (href: string): HTMLLIElement | null => {
      const link = document.querySelector<HTMLElement>(`a[href="${href}"]`);
      return link ? link.closest("li") : null;
    };

    const findGroupHeading = (title: string): HTMLElement | null =>
      Array.from(document.querySelectorAll<HTMLElement>("label")).find(
        (el): boolean => el.textContent === title,
      ) ?? null;

    const sidebarTrigger = (): HTMLElement | null =>
      canvasElement.querySelector<HTMLElement>(
        "#dashboard-layout-main-content-header button",
      );

    // On a narrow viewport the sidebar is a closed Sheet, so no item links are
    // mounted yet -- open it via the header trigger first.
    if (!findRow("/rhythm/plain-1")) {
      const trigger = sidebarTrigger();
      if (trigger) {
        await userEvent.click(trigger);
      }
    }

    await waitFor((): void => {
      expect(findRow("/rhythm/plain-1")).not.toBeNull();
      expect(findRow("/rhythm/grouped-1")).not.toBeNull();
    });

    const allRowHrefs: string[] = rhythmSidebarItems.flatMap(
      (entry): string[] =>
        entry.type === "dashboard-sidebar-item-group"
          ? entry.items.map((item): string => item.url)
          : [entry.url],
    );

    // Every menu row -- ungrouped or grouped -- must be exactly one row tall.
    // This is the assertion that fails if the flex-shrink guard regresses:
    // the menu is deliberately long enough to overflow, and before the fix
    // the ungrouped rows collapsed to ~18px while grouped rows held at 40px.
    const assertUniformRowHeights = (): void => {
      const heights: number[] = allRowHrefs.map((href): number => {
        const row: HTMLLIElement | null = findRow(href);
        expect(row).not.toBeNull();
        return Math.round((row as HTMLLIElement).getBoundingClientRect().height);
      });
      const uniqueHeights: number[] = Array.from(new Set(heights));
      expect(uniqueHeights).toHaveLength(1);
      // 2.5rem === sidebar_menu_item_height.
      expect(uniqueHeights[0]).toBe(40);
    };

    // Rows inside a single list are spaced by the shared rhythm token
    // (gap-2 === 8px), whether that list is the ungrouped run or a group.
    const gapBetween = (firstHref: string, secondHref: string): number => {
      const first = findRow(firstHref) as HTMLLIElement;
      const second = findRow(secondHref) as HTMLLIElement;
      return Math.round(
        second.getBoundingClientRect().top -
          first.getBoundingClientRect().bottom,
      );
    };

    const assertUniformGaps = (): void => {
      const ungroupedGap: number = gapBetween(
        "/rhythm/plain-1",
        "/rhythm/plain-2",
      );
      const groupedGap: number = gapBetween(
        "/rhythm/grouped-1",
        "/rhythm/grouped-2",
      );
      expect(ungroupedGap).toBe(8);
      expect(groupedGap).toBe(ungroupedGap);
    };

    // The collapsed sidebar (the desktop default) hides labels but still
    // renders every row, so the rhythm has to hold here too.
    assertUniformRowHeights();
    assertUniformGaps();

    // Ungrouped rows belong to a real <ul>, exactly like grouped rows -- a
    // bare <li> child of the <nav> is invalid markup and was the reason the
    // two paths drew their spacing from two different gap declarations.
    const plainRow = findRow("/rhythm/plain-1") as HTMLLIElement;
    expect(plainRow.parentElement?.tagName).toBe("UL");

    // Expand the sidebar so the group headings and item titles mount. On
    // desktop the sidebar starts collapsed (open === false), so the labels are
    // not in the DOM until the trigger is clicked.
    if (!findGroupHeading("First Group")) {
      const trigger = sidebarTrigger();
      if (trigger) {
        await userEvent.click(trigger);
      }
    }

    const groupHeading: HTMLElement = await waitFor((): HTMLElement => {
      const heading = findGroupHeading("First Group");
      if (!heading) {
        throw new Error("Group heading has not rendered yet");
      }
      return heading;
    });

    // Expanding must not disturb the rhythm either.
    assertUniformRowHeights();
    assertUniformGaps();

    // A group heading sits on the same left edge as the item titles beneath
    // it, so the expanded menu reads as one column. Previously the heading was
    // inset by `mx-2` (8px) while titles started at the icon-column width
    // (4rem), lining the heading up with neither the icons nor the titles.
    const groupedRowLink = document.querySelector<HTMLElement>(
      'a[href="/rhythm/grouped-1"]',
    ) as HTMLElement;

    // Measure where the heading's *text* is painted, not the <label> box: the
    // heading is a full-width block and its inset is padding, which does not
    // move the element's border box.
    const renderedTextLeft = (el: HTMLElement): number => {
      const range: Range = document.createRange();
      range.selectNodeContents(el);
      return range.getBoundingClientRect().left;
    };

    await waitFor((): void => {
      const titleSpan: HTMLElement | null =
        groupedRowLink.querySelector<HTMLElement>("span");
      if (!titleSpan) {
        throw new Error("Item title has not rendered yet");
      }
      expect(
        Math.abs(
          Math.round(
            renderedTextLeft(titleSpan) - renderedTextLeft(groupHeading),
          ),
        ),
      ).toBeLessThanOrEqual(1);
    });
  },
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

// --- Tooltip override: short menu label, extended tooltip text ----------
//
// Sidebar item definitions accept an optional `tooltip` field that overrides
// the hover tooltip, which otherwise repeats the item's `title`. This lets a
// menu item keep a short label where sidebar space is limited (e.g. "MFA")
// while the tooltip spells out the full description ("Multi-Factor
// Authentication"). Items without a `tooltip` keep the title-as-tooltip
// behavior.

const tooltipOverrideSidebarItems = [
  {
    type: "dashboard-sidebar-item-group",
    title: "Security",
    items: [
      {
        type: "dashboard-sidebar-item-definition",
        title: "MFA",
        tooltip: "Multi-Factor Authentication",
        url: "/security/mfa",
        icon: ({ className }) => <Lock className={className} />,
      },
      {
        type: "dashboard-sidebar-item-definition",
        title: "Members",
        url: "/security/members",
        icon: ({ className }) => <Users className={className} />,
      },
    ],
  },
] satisfies DashboardSidebarItemsAndGroupsDefinitions;

// The tooltip content portals to document.body, so search there. Radix also
// renders a visually-hidden duplicate of the content for screen readers, so
// match against every element with role="tooltip" rather than expecting a
// single node.
function someTooltipContains(text: string): boolean {
  return Array.from(document.querySelectorAll('[role="tooltip"]')).some(
    (tooltip: Element): boolean => (tooltip.textContent ?? "").includes(text),
  );
}

export const WithTooltipOverride: Story = {
  // The play() test drives hover state; keep it out of the autodocs page so
  // it only runs in its own Canvas.
  tags: ["!autodocs"],
  args: {
    sidebarItems: tooltipOverrideSidebarItems,
    topBarTitle: "Tooltip Override",
  } satisfies Partial<DashboardLayoutProps>,
  decorators: [
    // A story-level provider sits closest to the tooltips, so its zero delay
    // wins over the meta-level provider's default — the play() hover
    // assertions don't have to race the open delay.
    (Story): ReactElement => (
      <TooltipProvider delayDuration={0}>
        <Story />
      </TooltipProvider>
    ),
  ],
  play: async ({ canvasElement }): Promise<void> => {
    const findLink = (href: string): HTMLElement | null =>
      document.querySelector<HTMLElement>(`a[href="${href}"]`);

    // On a narrow viewport the sidebar is a closed Sheet, so the item links
    // are not mounted yet — open it via the header trigger first.
    if (!findLink("/security/mfa")) {
      const sidebarTrigger = canvasElement.querySelector<HTMLElement>(
        "#dashboard-layout-main-content-header button",
      );
      if (sidebarTrigger) {
        await userEvent.click(sidebarTrigger);
      }
    }

    const mfaLink: HTMLElement = await waitFor((): HTMLElement => {
      const link = findLink("/security/mfa");
      if (!link) {
        throw new Error("MFA sidebar link has not rendered yet");
      }
      return link;
    });

    // The overridden tooltip text must only ever appear inside the tooltip,
    // never as the menu label.
    expect(mfaLink.textContent).not.toContain("Multi-Factor Authentication");

    await userEvent.hover(mfaLink);
    await waitFor(
      (): void => {
        expect(someTooltipContains("Multi-Factor Authentication")).toBe(true);
      },
      { timeout: 3000 },
    );
    await userEvent.unhover(mfaLink);

    // While the MFA tooltip is open, Radix treats the pointer as "in transit"
    // toward that tooltip's content and suppresses the next trigger's
    // pointermove until the pointer lands outside the grace area. Hover a
    // neutral element far from the tooltip first so the transit state clears
    // and the next sidebar item can open its own tooltip.
    const neutralHoverTarget: HTMLElement | null =
      canvasElement.querySelector<HTMLElement>(
        "#dashboard-layout-main-content-header",
      );
    if (neutralHoverTarget) {
      await userEvent.hover(neutralHoverTarget);
    }

    // An item without a `tooltip` override still falls back to its title.
    const membersLink: HTMLElement = await waitFor((): HTMLElement => {
      const link = findLink("/security/members");
      if (!link) {
        throw new Error("Members sidebar link has not rendered yet");
      }
      return link;
    });
    await userEvent.hover(membersLink);
    await waitFor(
      (): void => {
        expect(someTooltipContains("Members")).toBe(true);
      },
      { timeout: 3000 },
    );
    await userEvent.unhover(membersLink);
  },
};

// --- Regression: next/link-style navigation must not be swallowed ------
//
// DashboardSidebarItemRenderer used to call e.preventDefault() in the onClick
// it handed to the consumer <Link>. next/link (and React Router, TanStack
// Router, ...) read a prevented default as "the handler is navigating itself —
// stand down," so every sidebar link became a no-op. This story wires up a
// Link adapter that mimics next/link's contract: it runs the consumer onClick
// first and then navigates only if the event's default was not prevented.
// Clicking a sidebar item should record a navigation below; if the bug
// regresses, the adapter bails and nothing is recorded.

interface NavigationRecord {
  href: string;
  defaultPrevented: boolean;
}

// Declared at module scope so the Link component type is stable across
// renders — a fresh component identity on every render would unmount/remount
// the sidebar and re-fire its enter animations (see the note in
// dashboard-sidebar-header.tsx). The on-screen navigation log is fed through
// context instead, which re-renders the adapter without remounting it.
const RecordNavigationContext = createContext<
  (record: NavigationRecord) => void
>(() => {});

// Spy the play() function asserts against — records every forwarded click and
// whether the consumer onClick prevented default.
const navigateSpy = fn();

function NextLinkStyleLink({
  href,
  className,
  onClick,
  children,
}: LinkComponentProps): ReactElement {
  const record = useContext(RecordNavigationContext);
  return (
    <a
      href={href}
      className={className}
      onClick={(e): void => {
        // Run the consumer handler first, exactly like next/link does.
        if (typeof onClick === "function") {
          onClick(e);
        }
        const defaultPrevented: boolean = e.defaultPrevented;
        navigateSpy({ href, defaultPrevented } satisfies NavigationRecord);
        // next/link bails out here if the consumer prevented the default.
        if (defaultPrevented) {
          return;
        }
        // We perform client-side navigation ourselves, so stop the browser
        // from doing a real full-page nav to `href` (which would navigate the
        // Storybook iframe away mid-test).
        e.preventDefault();
        record({ href, defaultPrevented });
      }}
    >
      {children}
    </a>
  );
}

NextLinkStyleLink satisfies LinkComponentType;

const regressionSidebarItems = [
  {
    type: "dashboard-sidebar-item-group",
    title: "Navigation",
    items: [
      {
        type: "dashboard-sidebar-item-definition",
        title: "Reports",
        url: "/regression/reports",
        icon: ({ className }) => <Plane className={className} />,
      },
      {
        type: "dashboard-sidebar-item-definition",
        title: "Schedule",
        url: "/regression/schedule",
        icon: ({ className }) => <AlarmClock className={className} />,
      },
    ],
  },
] satisfies DashboardSidebarItemsAndGroupsDefinitions;

function NextLinkStyleNavigationRender(
  args: Partial<DashboardLayoutProps>,
): ReactElement {
  const [navigations, setNavigations] = useState<string[]>([]);
  const record = useCallback((rec: NavigationRecord): void => {
    setNavigations((prev): string[] => [...prev, rec.href]);
  }, []);
  return (
    <RecordNavigationContext.Provider value={record}>
      <DashboardLayout
        {...(args as DashboardLayoutProps)}
        Link={NextLinkStyleLink}
        sidebarItems={regressionSidebarItems}
      >
        <div className="flex flex-col gap-3 p-4 items-start">
          <p className="max-w-prose">
            Click a sidebar item. The <code>Link</code> adapter mimics{" "}
            <code>next/link</code>: it runs the item onClick handler and then
            navigates only when the click was not prevented. Successful
            navigations are listed here; if a sidebar item ever calls{" "}
            <code>preventDefault()</code> again, this list stays empty.
          </p>
          <ul data-testid="navigation-log" className="list-disc pl-6">
            {navigations.map((href, index) => (
              <li key={`${href}-${index}`}>
                Navigated to <code>{href}</code>
              </li>
            ))}
          </ul>
        </div>
      </DashboardLayout>
    </RecordNavigationContext.Provider>
  );
}

export const NextLinkStyleNavigation: Story = {
  // This is a regression test, not a showcase, and it drives the layout
  // responsively. Keep it out of the autodocs page — whose narrow preview
  // renders the mobile Sheet — so it runs only in its own Canvas.
  tags: ["!autodocs"],
  args: {
    sidebarItems: regressionSidebarItems,
    topBarTitle: "Navigation regression",
  } satisfies Partial<DashboardLayoutProps>,
  render: (args): ReactElement => <NextLinkStyleNavigationRender {...args} />,
  play: async ({ canvasElement }): Promise<void> => {
    navigateSpy.mockClear();
    const canvas = within(canvasElement);
    const targetHref: string = "/regression/reports";

    // Find the item link by its href, NOT by role="link": each item link is
    // nested inside a Radix Tooltip trigger <button>, whose descendants are
    // presentational and therefore absent from the accessibility tree. Search
    // the whole document because on a narrow viewport the sidebar is a Sheet
    // that portals its content to document.body.
    const findLink = (): HTMLElement | null =>
      document.querySelector<HTMLElement>(`a[href="${targetHref}"]`);

    // On a narrow viewport the sidebar renders as a closed Sheet, so its links
    // are not mounted yet. Open it once via the header trigger (the first
    // button in the layout header) when the link isn't already present.
    if (!findLink()) {
      const sidebarTrigger = canvasElement.querySelector<HTMLElement>(
        "#dashboard-layout-main-content-header button",
      );
      if (sidebarTrigger) {
        await userEvent.click(sidebarTrigger);
      }
    }

    const reportsLink: HTMLElement = await waitFor((): HTMLElement => {
      const link = findLink();
      if (!link) {
        throw new Error(`Sidebar link ${targetHref} has not rendered yet`);
      }
      return link;
    });

    await userEvent.click(reportsLink);

    // The consumer onClick must NOT have prevented the default, so the
    // next/link-style adapter is free to navigate.
    await waitFor((): void => {
      expect(navigateSpy).toHaveBeenCalledWith({
        href: targetHref,
        defaultPrevented: false,
      });
    });

    // ...and that navigation is reflected in the on-screen log.
    await waitFor((): void => {
      expect(canvas.getByTestId("navigation-log")).toHaveTextContent(
        targetHref,
      );
    });
  },
};
