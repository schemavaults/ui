import type { Meta, StoryObj } from "@storybook/react";
// import { fn } from "storybook/test";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type PropsWithChildren,
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
import { DEFAULT_LEADING_SIDEBAR_MENU_GROUP_LABEL_TOP_PADDING } from "./dashboard-sidebar";
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
  "aria-current": ariaCurrent,
}: LinkComponentProps): ReactElement {
  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      aria-current={ariaCurrent}
    >
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
  title: "Layout/Dashboard Layout",
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
    sidebarOpenWidth: {
      control: "text",
      description:
        "Width of the sidebar while open (expanded) on desktop, as any CSS length (e.g. `18rem`, `260px`). Defaults to `14rem`. The main content area shifts to match. The collapsed icon-only width and the mobile Sheet width are unaffected.",
      table: {
        defaultValue: { summary: "14rem" },
      },
    },
    activeHref: {
      control: "text",
      description:
        "Pathname of the current page, for marking its sidebar item active. Takes precedence over `usePathname`. An item is active when the path equals its `url` or is nested beneath it; the longest matching `url` wins. The active item gets a gradient wash, a glowing gradient bar and a bold gradient label, between the theme's `--sidebar-active-start` and `--sidebar-active-end` tokens (brand blue to brand red by default), and its link `aria-current=\"page\"`.",
    },
    reducedMotion: {
      control: "inline-radio",
      options: ["user", "always", "never"],
      description:
        "Whether the layout animates. `user` (default) follows the `prefers-reduced-motion` media query, `always` never animates (drive this from an in-app preference), `never` always animates. Applied through Framer Motion's `MotionConfig`, so it also reaches motion components rendered inside the layout.",
      table: {
        defaultValue: { summary: "user" },
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

// --- A group as the menu's first entry ----------------------------------
//
// The menu <nav> spaces its blocks with a gap, and a gap only ever falls
// *between* two blocks. That covers every group but the leading one: with
// nothing above it to space against, a group that opened the menu painted its
// heading flush against the bottom border of the sidebar header (a group
// further down looked right, which is what made the bug look like it was
// about groups rather than about position). A leading *item* never showed it
// -- a row is 2.5rem tall with its icon and title centred inside, so the row
// supplies breathing room that a bare text label does not.
//
// This story leads with a group and follows it with a second one, so the
// leading heading's inset can be measured against the inset the <nav> gap
// already gives the trailing heading: they must be the same 8px.

const leadingGroupSidebarItems = [
  {
    type: "dashboard-sidebar-item-group",
    title: "Leading Group",
    items: Array.from({ length: 3 }).map((_, index) => ({
      type: "dashboard-sidebar-item-definition" as const,
      title: `Leading Link ${index + 1}`,
      url: `/leading-group/link-${index + 1}`,
      icon: ({ className }: { className?: string }): ReactElement => (
        <Tornado className={className} />
      ),
    })),
  },
  {
    type: "dashboard-sidebar-item-group",
    title: "Trailing Group",
    items: Array.from({ length: 3 }).map((_, index) => ({
      type: "dashboard-sidebar-item-definition" as const,
      title: `Trailing Link ${index + 1}`,
      url: `/trailing-group/link-${index + 1}`,
      icon: ({ className }: { className?: string }): ReactElement => (
        <Plane className={className} />
      ),
    })),
  },
] satisfies DashboardSidebarItemsAndGroupsDefinitions;

export const SidebarItemGroupFirst: Story = {
  // A spacing regression test rather than a showcase, and its assertions need
  // a real viewport rather than the autodocs iframe.
  tags: ["!autodocs"],
  args: {
    sidebarItems: leadingGroupSidebarItems,
    topBarTitle: "Leading sidebar group",
  } satisfies Partial<DashboardLayoutProps>,
  play: async ({ canvasElement }): Promise<void> => {
    const findGroupHeading = (title: string): HTMLElement | null =>
      Array.from(document.querySelectorAll<HTMLElement>("label")).find(
        (el): boolean => el.textContent === title,
      ) ?? null;

    const findRow = (href: string): HTMLLIElement | null => {
      const link = document.querySelector<HTMLElement>(`a[href="${href}"]`);
      return link ? link.closest("li") : null;
    };

    const sidebarTrigger = (): HTMLElement => {
      const trigger: HTMLElement | null =
        canvasElement.querySelector<HTMLElement>(
          "#dashboard-layout-main-content-header button",
        );
      expect(trigger).not.toBeNull();
      return trigger as HTMLElement;
    };

    const sidebarHeader = (): HTMLElement => {
      const header: HTMLElement | null =
        document.querySelector<HTMLElement>("menu header");
      expect(header).not.toBeNull();
      return header as HTMLElement;
    };

    // The element the inset has to live on. It wraps a group's heading *and*
    // its list, so unlike the heading it stays mounted when the sidebar
    // collapses -- which is what lets the inset animate out instead of
    // vanishing with the element that carried it.
    const groupContainer = (title: string): HTMLElement => {
      const list: HTMLElement | null = document.getElementById(
        `sidebar-group-items-[${title}]`,
      );
      expect(list).not.toBeNull();
      const container: HTMLElement | null = (list as HTMLElement).parentElement;
      expect(container).not.toBeNull();
      return container as HTMLElement;
    };

    const paddingTopOf = (element: HTMLElement): number =>
      Math.round(parseFloat(getComputedStyle(element).paddingTop));

    const verticalPaddingOf = (element: HTMLElement): number => {
      const style: CSSStyleDeclaration = getComputedStyle(element);
      return Math.round(
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom),
      );
    };

    const rowOffsetFromHeader = (): number | null => {
      const row: HTMLLIElement | null = findRow("/leading-group/link-1");
      return row
        ? Math.round(
            row.getBoundingClientRect().top -
              sidebarHeader().getBoundingClientRect().bottom,
          )
        : null;
    };

    const desktop: boolean = window.matchMedia("(min-width: 768px)").matches;

    // Desktop starts collapsed, which is the state that shows the inset is
    // *for* the heading: with no heading rendered there is nothing to hold off
    // the header, so a leading group's first row starts exactly where a
    // leading ungrouped row would. The group container is still here, at zero
    // inset -- it is the thing that will animate the inset in.
    if (desktop) {
      expect(findGroupHeading("Leading Group")).toBeNull();
      expect(paddingTopOf(groupContainer("Leading Group"))).toBe(0);
      const firstRow: HTMLLIElement | null = findRow("/leading-group/link-1");
      expect(firstRow).not.toBeNull();
      expect(
        Math.round(
          (firstRow as HTMLLIElement).getBoundingClientRect().top -
            sidebarHeader().getBoundingClientRect().bottom,
        ),
      ).toBe(0);
    }

    // Open it: on mobile the sidebar is an unmounted Sheet, on desktop it is
    // collapsed to the icon column. Either way the headings mount only now.
    await userEvent.click(sidebarTrigger());

    await waitFor(
      (): void => {
        expect(findGroupHeading("Leading Group")).not.toBeNull();
        expect(findGroupHeading("Trailing Group")).not.toBeNull();
      },
      { timeout: 3000 },
    );

    // Measure the painted glyphs, not the boxes. Box spacing alone is what
    // made this bug easy to miss: matching the <nav> gap puts a leading
    // heading 8px under the header's border while a heading further down
    // clears the row above it by that same gap *plus* the row's bottom
    // half-leading. The complaint was visual, so the assertion is too.
    const textRect = (element: HTMLElement): DOMRect => {
      const range: Range = document.createRange();
      range.selectNodeContents(element);
      return range.getBoundingClientRect();
    };

    await waitFor(
      (): void => {
        const leadingHeading = findGroupHeading("Leading Group") as HTMLElement;
        const trailingHeading = findGroupHeading(
          "Trailing Group",
        ) as HTMLElement;
        const lastLeadingTitle =
          findRow("/leading-group/link-3")?.querySelector<HTMLElement>("span");
        expect(lastLeadingTitle).not.toBeNull();

        // The box inset is the sizing token, exactly.
        expect(
          Math.round(
            leadingHeading.getBoundingClientRect().top -
              sidebarHeader().getBoundingClientRect().bottom,
          ),
        ).toBe(DEFAULT_LEADING_SIDEBAR_MENU_GROUP_LABEL_TOP_PADDING);

        // ...and it is carried by the group container, not by the heading.
        // This is the difference between the inset animating away on collapse
        // and disappearing in one frame: AnimatePresence unmounts the heading,
        // so padding parked on it takes its space with it the moment it goes,
        // and Framer cannot drive a border-box element's height below its own
        // padding either. Measure where the inset lives, not just that the
        // heading ends up in the right place -- both arrangements pass the
        // assertion above, only one of them animates.
        expect(paddingTopOf(groupContainer("Leading Group"))).toBe(
          DEFAULT_LEADING_SIDEBAR_MENU_GROUP_LABEL_TOP_PADDING,
        );
        expect(paddingTopOf(groupContainer("Trailing Group"))).toBe(0);

        // Nothing between the animating wrapper and the heading may carry
        // vertical padding. Padding is part of the box and does not shrink
        // with it, so an element that has any cannot be driven to zero
        // height: it floors at its padding and the unmount drops whatever is
        // left in a single frame. Both elements in that chain must therefore
        // be bare, with the heading's own bottom gap living further in, as
        // content they clip.
        const paddedContent = leadingHeading.parentElement as HTMLElement;
        const clippingItem = paddedContent.parentElement as HTMLElement;
        const animatingWrapper = clippingItem.parentElement as HTMLElement;
        expect(verticalPaddingOf(clippingItem)).toBe(0);
        expect(verticalPaddingOf(animatingWrapper)).toBe(0);
        expect(verticalPaddingOf(paddedContent)).toBeGreaterThan(0);

        // Whitespace a reader actually sees above each heading. Before the fix
        // the leading one was 0 -- the heading sat on the header's border.
        const leadingWhitespace: number = Math.round(
          textRect(leadingHeading).top -
            sidebarHeader().getBoundingClientRect().bottom,
        );
        const trailingWhitespace: number = Math.round(
          textRect(trailingHeading).top -
            textRect(lastLeadingTitle as HTMLElement).bottom,
        );

        expect(leadingWhitespace).toBeGreaterThan(8);
        // Optically level with a heading that is not first, give or take the
        // rounding in a row's half-leading.
        expect(
          Math.abs(leadingWhitespace - trailingWhitespace),
        ).toBeLessThanOrEqual(4);
      },
      { timeout: 3000 },
    );

    // Collapsing must not drop the menu. The heading opens and closes between
    // a mount and an unmount, so whatever height it still occupies on its last
    // frame vanishes in one step on its next -- the rows below jumped by that
    // much. Watching the frame either side of the unmount measures that step
    // directly, and does so however fast or slow the frames happen to be
    // arriving, unlike a cap on per-frame movement. Desktop only: collapsing
    // on mobile unmounts the whole Sheet, rows included, so there is no
    // "after" position to compare against.
    if (!desktop) {
      return;
    }

    const watchUnmount: Promise<{ step: number; timedOut: boolean }> =
      new Promise((resolve): void => {
        const deadline: number = performance.now() + 3000;
        let lastWithHeading: number | null = null;
        const tick = (): void => {
          const offset: number | null = rowOffsetFromHeader();
          if (findGroupHeading("Leading Group") !== null) {
            if (offset !== null) {
              lastWithHeading = offset;
            }
            if (performance.now() > deadline) {
              resolve({ step: 0, timedOut: true });
              return;
            }
            requestAnimationFrame(tick);
            return;
          }
          resolve({
            step:
              offset !== null && lastWithHeading !== null
                ? Math.abs(offset - lastWithHeading)
                : 0,
            timedOut: false,
          });
        };
        requestAnimationFrame(tick);
      });

    await userEvent.click(sidebarTrigger());
    const unmount: { step: number; timedOut: boolean } = await watchUnmount;
    expect(unmount.timedOut).toBe(false);
    // Was 8px on its own, and 24px while the leading inset rode on the
    // heading too.
    expect(unmount.step).toBeLessThanOrEqual(1);

    // Leave the sidebar open: this story is the one someone opens to look at
    // a leading group, and collapsed it shows nothing of the kind.
    await userEvent.click(sidebarTrigger());
    await waitFor(
      (): void => {
        expect(findGroupHeading("Leading Group")).not.toBeNull();
      },
      { timeout: 3000 },
    );
  },
};

// --- Collapsible groups --------------------------------------------------
//
// A group with `collapsible: true` gets a heading button that folds its links
// away and brings them back, with a chevron that points down while the group
// is open and right while it is collapsed. `defaultCollapsed` starts a group
// folded, unless it holds the page being viewed: here "Team" asks to start
// collapsed but holds the active "Members" page, so it opens anyway, while
// "Integrations" starts folded. "Support" is an ordinary group for
// comparison.
//
// Only the expanded menu folds. The collapsed desktop sidebar has no headings
// to reopen a group with, so it lists every link in every group. Folded
// groups stay folded while the sidebar is closed and reopened, the mobile
// Sheet included.

const collapsibleGroupChangeSpy = fn();

const collapsibleGroupsSidebarItems = [
  manyLinksItem("Overview", LayoutDashboard),
  manyLinksItem("Inbox", Inbox),
  {
    ...manyLinksGroup("Analytics", [
      manyLinksItem("Reports", BarChart3),
      manyLinksItem("Trends", LineChart),
      manyLinksItem("Segments", PieChart),
    ]),
    collapsible: true,
    onCollapsedChange: collapsibleGroupChangeSpy,
  },
  {
    ...manyLinksGroup("Team", [
      manyLinksItem("Members", Users),
      manyLinksItem("Roles", Shield),
      manyLinksItem("API Keys", Key),
    ]),
    collapsible: true,
    defaultCollapsed: true,
  },
  {
    ...manyLinksGroup("Integrations", [
      manyLinksItem("Email", Mail),
      manyLinksItem("Webhooks", Webhook),
      manyLinksItem("Plugins", Plug),
    ]),
    collapsible: true,
    defaultCollapsed: true,
  },
  manyLinksGroup("Support", [
    manyLinksItem("Help Center", LifeBuoy),
    manyLinksItem("Documentation", BookOpen),
  ]),
] satisfies DashboardSidebarItemsAndGroupsDefinitions;

/** A collapsible group's heading button, or `null` while it is not shown. */
function findGroupToggle(title: string): HTMLButtonElement | null {
  return document.querySelector<HTMLButtonElement>(
    `button[aria-controls="sidebar-group-items-[${title}]"]`,
  );
}

/** The element that folds a collapsible group's list away. */
function findGroupFold(title: string): HTMLElement {
  const fold: HTMLElement | null | undefined = document
    .getElementById(`sidebar-group-items-[${title}]`)
    ?.closest<HTMLElement>('[data-slot="dashboard-sidebar-group-items-fold"]');
  expect(fold).toBeTruthy();
  return fold as HTMLElement;
}

function groupFoldHeight(title: string): number {
  return Math.round(findGroupFold(title).getBoundingClientRect().height);
}

/** Whether a group's links are out of the tab order. */
function isGroupInert(title: string): boolean {
  return (
    document
      .getElementById(`sidebar-group-items-[${title}]`)
      ?.closest("[inert]") != null
  );
}

// Three 2.5rem rows with the 8px gap between them.
const THREE_ROW_GROUP_HEIGHT: number = 3 * 40 + 2 * 8;

function sidebarTriggerIn(canvasElement: HTMLElement): HTMLElement {
  const trigger: HTMLElement | null = canvasElement.querySelector<HTMLElement>(
    "#dashboard-layout-main-content-header button",
  );
  expect(trigger).not.toBeNull();
  return trigger as HTMLElement;
}

export const CollapsibleGroups: Story = {
  args: {
    sidebarItems: collapsibleGroupsSidebarItems,
    topBarTitle: "Members",
    activeHref: "/many-links/members",
  } satisfies Partial<DashboardLayoutProps>,
  play: async ({ canvasElement }): Promise<void> => {
    collapsibleGroupChangeSpy.mockClear();
    const desktop: boolean = window.matchMedia("(min-width: 768px)").matches;

    // The collapsed desktop sidebar has no headings, so nothing could reopen a
    // folded group: every group lists its links, even one that starts
    // collapsed.
    if (desktop) {
      expect(findGroupToggle("Integrations")).toBeNull();
      expect(findGroupFold("Integrations")).toHaveAttribute(
        "data-state",
        "unfolded",
      );
      expect(groupFoldHeight("Integrations")).toBe(THREE_ROW_GROUP_HEIGHT);
      expect(isGroupInert("Integrations")).toBe(false);
    }

    await userEvent.click(sidebarTriggerIn(canvasElement));
    await waitFor(
      (): void => {
        expect(findGroupToggle("Integrations")).not.toBeNull();
      },
      { timeout: 3000 },
    );

    // `defaultCollapsed` folds the group as soon as it has a heading, and its
    // links leave the tab order with it.
    expect(findGroupToggle("Integrations")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await waitFor(
      (): void => {
        expect(groupFoldHeight("Integrations")).toBe(0);
      },
      { timeout: 3000 },
    );
    expect(isGroupInert("Integrations")).toBe(true);

    // ...but not when the group holds the page being viewed.
    expect(findGroupToggle("Team")).toHaveAttribute("aria-expanded", "true");
    expect(groupFoldHeight("Team")).toBe(THREE_ROW_GROUP_HEIGHT);

    // An ordinary group keeps its plain heading.
    expect(findGroupToggle("Support")).toBeNull();

    // At rest, an open group does not clip its rows, so an active row's glow
    // is not cropped at the edge of the group.
    expect(getComputedStyle(findGroupFold("Team")).overflow).toBe("visible");

    // Fold a group from its heading.
    await userEvent.click(findGroupToggle("Analytics") as HTMLButtonElement);
    expect(findGroupToggle("Analytics")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(collapsibleGroupChangeSpy).toHaveBeenLastCalledWith(true);
    await waitFor(
      (): void => {
        expect(groupFoldHeight("Analytics")).toBe(0);
      },
      { timeout: 3000 },
    );
    expect(isGroupInert("Analytics")).toBe(true);

    // And open one.
    await userEvent.click(findGroupToggle("Integrations") as HTMLButtonElement);
    expect(findGroupToggle("Integrations")).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await waitFor(
      (): void => {
        expect(groupFoldHeight("Integrations")).toBe(THREE_ROW_GROUP_HEIGHT);
        expect(getComputedStyle(findGroupFold("Integrations")).overflow).toBe(
          "visible",
        );
      },
      { timeout: 3000 },
    );
    expect(isGroupInert("Integrations")).toBe(false);

    // Close the sidebar. On desktop it drops back to the icon column, which
    // lists the folded group's links again; on mobile the Sheet unmounts
    // altogether (and, being modal, is closed from the keyboard here: the
    // page behind it does not take clicks while it is open).
    if (desktop) {
      await userEvent.click(sidebarTriggerIn(canvasElement));
      await waitFor(
        (): void => {
          expect(findGroupToggle("Analytics")).toBeNull();
          expect(groupFoldHeight("Analytics")).toBe(THREE_ROW_GROUP_HEIGHT);
        },
        { timeout: 3000 },
      );
      expect(isGroupInert("Analytics")).toBe(false);
    } else {
      await userEvent.keyboard("{Escape}");
      await waitFor(
        (): void => {
          expect(findGroupToggle("Analytics")).toBeNull();
        },
        { timeout: 3000 },
      );
    }

    // Reopen it: each group is as the viewer left it.
    await userEvent.click(sidebarTriggerIn(canvasElement));
    await waitFor(
      (): void => {
        expect(findGroupToggle("Analytics")).toHaveAttribute(
          "aria-expanded",
          "false",
        );
        expect(groupFoldHeight("Analytics")).toBe(0);
        expect(findGroupToggle("Integrations")).toHaveAttribute(
          "aria-expanded",
          "true",
        );
      },
      { timeout: 3000 },
    );
  },
};

// The same, in the mobile Sheet. The Sheet unmounts its content each time it
// closes, so this is the story that shows a folded group surviving that.
export const CollapsibleGroupsOnMobile: Story = {
  ...CollapsibleGroups,
  tags: ["!autodocs"],
  globals: { viewport: { value: "mobile1", isRotated: false } },
  // Spelled out rather than left to the spread: the test runner finds a
  // story's `play` by reading the object literal, and runs only a smoke test
  // for a story it cannot see one on.
  play: CollapsibleGroups.play,
};

// --- Controlled collapsible groups ---------------------------------------
//
// Pass `collapsed` and `onCollapsedChange` to own a group's state: to persist
// it (in localStorage, a cookie, a user preference), or to drive it from
// elsewhere on the page, like the buttons in this story. The heading still
// toggles the group; it does so by calling `onCollapsedChange`, and the group
// shows whatever `collapsed` comes back.

const controlledCollapsibleGroups = [
  manyLinksGroup("Analytics", [
    manyLinksItem("Reports", BarChart3),
    manyLinksItem("Trends", LineChart),
    manyLinksItem("Segments", PieChart),
  ]),
  manyLinksGroup("Team", [
    manyLinksItem("Members", Users),
    manyLinksItem("Roles", Shield),
    manyLinksItem("API Keys", Key),
  ]),
] satisfies DashboardSidebarItemGroupDefinition[];

function ControlledCollapsibleGroupsRender(
  args: Partial<DashboardLayoutProps>,
): ReactElement {
  const [collapsedGroups, setCollapsedGroups] = useState<
    Record<string, boolean>
  >({ Analytics: false, Team: true });

  const setAll = (collapsed: boolean): void => {
    setCollapsedGroups(
      Object.fromEntries(
        controlledCollapsibleGroups.map(
          (group: DashboardSidebarItemGroupDefinition): [string, boolean] => [
            group.title,
            collapsed,
          ],
        ),
      ),
    );
  };

  const sidebarItems: DashboardSidebarItemsAndGroupsDefinitions =
    controlledCollapsibleGroups.map(
      (
        group: DashboardSidebarItemGroupDefinition,
      ): DashboardSidebarItemGroupDefinition => ({
        ...group,
        collapsible: true,
        collapsed: collapsedGroups[group.title] ?? false,
        onCollapsedChange: (collapsed: boolean): void => {
          setCollapsedGroups(
            (previous: Record<string, boolean>): Record<string, boolean> => ({
              ...previous,
              [group.title]: collapsed,
            }),
          );
        },
      }),
    );

  return (
    <DashboardLayout
      {...(args as DashboardLayoutProps)}
      sidebarItems={sidebarItems}
    >
      <PageColumnContainer>
        <div className="flex flex-col gap-4 p-4 items-start">
          <p className="text-sm text-muted-foreground max-w-prose">
            The groups&rsquo; collapsed state lives in this page&rsquo;s React
            state. Expand the sidebar, then fold groups from their headings or
            from these buttons.
          </p>
          <div className="flex flex-row gap-2">
            <Button variant="secondary" onClick={(): void => setAll(true)}>
              Collapse all
            </Button>
            <Button variant="secondary" onClick={(): void => setAll(false)}>
              Expand all
            </Button>
          </div>
          <pre
            data-testid="collapsed-groups"
            className="text-xs bg-muted rounded-md p-2"
          >
            {JSON.stringify(collapsedGroups)}
          </pre>
        </div>
      </PageColumnContainer>
    </DashboardLayout>
  );
}

export const ControlledCollapsibleGroups: Story = {
  args: {
    sidebarItems: controlledCollapsibleGroups,
    topBarTitle: "Controlled collapsible groups",
  } satisfies Partial<DashboardLayoutProps>,
  render: (args): ReactElement => (
    <ControlledCollapsibleGroupsRender {...args} />
  ),
  play: async ({ canvasElement }): Promise<void> => {
    // The buttons are page content, which the modal mobile Sheet blocks while
    // it is open; `CollapsibleGroups` covers the heading on mobile.
    if (!window.matchMedia("(min-width: 768px)").matches) {
      return;
    }
    const canvas = within(canvasElement);
    const stateReadout = (): HTMLElement => canvas.getByTestId("collapsed-groups");

    await userEvent.click(sidebarTriggerIn(canvasElement));
    await waitFor(
      (): void => {
        expect(findGroupToggle("Team")).toHaveAttribute(
          "aria-expanded",
          "false",
        );
        expect(findGroupToggle("Analytics")).toHaveAttribute(
          "aria-expanded",
          "true",
        );
      },
      { timeout: 3000 },
    );

    // The heading reports the toggle, and the owner's state decides.
    await userEvent.click(findGroupToggle("Analytics") as HTMLButtonElement);
    await waitFor((): void => {
      expect(stateReadout()).toHaveTextContent('"Analytics":true');
      expect(findGroupToggle("Analytics")).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    // State driven from outside the sidebar reaches the groups.
    await userEvent.click(canvas.getByRole("button", { name: "Expand all" }));
    await waitFor(
      (): void => {
        expect(findGroupToggle("Analytics")).toHaveAttribute(
          "aria-expanded",
          "true",
        );
        expect(findGroupToggle("Team")).toHaveAttribute(
          "aria-expanded",
          "true",
        );
        expect(groupFoldHeight("Team")).toBe(THREE_ROW_GROUP_HEIGHT);
      },
      { timeout: 3000 },
    );
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
  "aria-current": ariaCurrent,
}: LinkComponentProps): ReactElement {
  const record = useContext(RecordNavigationContext);
  return (
    <a
      href={href}
      className={className}
      aria-current={ariaCurrent}
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

// --- sidebarOpenWidth: custom open (expanded) sidebar width ------------
//
// The desktop sidebar expands to 14rem by default. Some sites want it wider,
// so long link titles fit on one line, or narrower, for a compact menu. The
// `sidebarOpenWidth` prop takes any CSS length and is applied through the
// `--dashboard-sidebar-open-width` custom property, so no Tailwind class has
// to exist for the chosen value. The main content area shifts to match; the
// collapsed icon-only width and the mobile Sheet width are unchanged.
//
// These stories start with the sidebar collapsed (the desktop default). Click
// the trigger in the header to expand it and see the configured width.

const longTitleSidebarItems = [
  manyLinksItem("Overview", LayoutDashboard),
  manyLinksItem("Notifications & Alerts", Bell),
  manyLinksGroup("Reporting & Analytics", [
    manyLinksItem("Quarterly Revenue Reports", BarChart3),
    manyLinksItem("Customer Acquisition Trends", LineChart),
    manyLinksItem("Conversion Funnel Analysis", TrendingUp),
    manyLinksItem("Realtime Activity Monitor", Activity),
  ]),
  manyLinksGroup("Organization Settings", [
    manyLinksItem("Members & Permissions", Users),
    manyLinksItem("Pending Team Invitations", UserPlus),
    manyLinksItem("Billing & Payment Methods", CreditCard),
    manyLinksItem("API Keys & Access Tokens", Key),
  ]),
  manyLinksGroup("Developer Tools", [
    manyLinksItem("Database Administration", Database),
    manyLinksItem("Deployment History", GitBranch),
    manyLinksItem("Webhook Delivery Logs", Webhook),
  ]),
] satisfies DashboardSidebarItemsAndGroupsDefinitions;

function SidebarOpenWidthPageContent({
  sidebarOpenWidth,
}: {
  sidebarOpenWidth: string | undefined;
}): ReactElement {
  return (
    <PageColumnContainer>
      <div className="flex flex-col gap-4 p-4 items-start">
        <p className="text-sm text-muted-foreground max-w-prose">
          This story sets <code>sidebarOpenWidth</code> to{" "}
          <code>{sidebarOpenWidth ?? "(default: 14rem)"}</code>. On a desktop
          viewport, click the sidebar trigger in the header to expand the
          sidebar and see it open to that width, with the page content
          shifting to match. Collapse it again and the icon-only width is
          unchanged.
        </p>
        <ExampleChildrenForContainer />
      </div>
    </PageColumnContainer>
  );
}

export const WideSidebarOpenWidth: Story = {
  args: {
    sidebarItems: longTitleSidebarItems,
    topBarTitle: "Wide sidebar (22rem)",
    sidebarOpenWidth: "22rem",
  } satisfies Partial<DashboardLayoutProps>,
  render: (args): ReactElement => (
    <DashboardLayout {...args}>
      <SidebarOpenWidthPageContent sidebarOpenWidth={args.sidebarOpenWidth} />
    </DashboardLayout>
  ),
};

export const NarrowSidebarOpenWidth: Story = {
  args: {
    sidebarItems: exampleSidebarItems,
    topBarTitle: "Narrow sidebar (10rem)",
    sidebarOpenWidth: "10rem",
  } satisfies Partial<DashboardLayoutProps>,
  render: (args): ReactElement => (
    <DashboardLayout {...args}>
      <SidebarOpenWidthPageContent sidebarOpenWidth={args.sidebarOpenWidth} />
    </DashboardLayout>
  ),
};

export const PixelSidebarOpenWidth: Story = {
  args: {
    sidebarItems: longTitleSidebarItems,
    topBarTitle: "Pixel sidebar width (300px)",
    sidebarOpenWidth: "300px",
  } satisfies Partial<DashboardLayoutProps>,
  render: (args): ReactElement => (
    <DashboardLayout {...args}>
      <SidebarOpenWidthPageContent sidebarOpenWidth={args.sidebarOpenWidth} />
    </DashboardLayout>
  ),
};

// Regression test: the configured open width must be what the desktop
// sidebar actually renders at once expanded, and the main content container
// must sit flush against it. The default width (14rem) is asserted first so a
// broken fallback in the CSS variable is caught as well.
export const SidebarOpenWidthMeasured: Story = {
  tags: ["!autodocs"],
  args: {
    sidebarItems: longTitleSidebarItems,
    topBarTitle: "Sidebar open width (measured)",
    sidebarOpenWidth: "20rem",
  } satisfies Partial<DashboardLayoutProps>,
  play: async ({ canvasElement, args }): Promise<void> => {
    // The width override only applies to the persistent desktop sidebar; on a
    // narrow viewport the sidebar is a mobile Sheet whose width is governed
    // separately, so there is nothing to measure.
    if (!window.matchMedia("(min-width: 768px)").matches) {
      return;
    }

    const container: HTMLElement | null = canvasElement.querySelector(
      "#dashboard-layout-container",
    );
    expect(container).not.toBeNull();
    expect(
      (container as HTMLElement).style.getPropertyValue(
        "--dashboard-sidebar-open-width",
      ),
    ).toBe(args.sidebarOpenWidth);

    const sidebar: HTMLElement | null =
      canvasElement.querySelector<HTMLElement>("menu");
    const content: HTMLElement | null = canvasElement.querySelector(
      "#dashboard-layout-main-content-container",
    );
    expect(sidebar).not.toBeNull();
    expect(content).not.toBeNull();

    const remInPx: number = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const expectedOpenWidthPx: number = 20 * remInPx;
    const collapsedWidthPx: number = 4 * remInPx;

    // Collapsed by default on desktop: the icon-only width is not affected by
    // the override.
    await waitFor((): void => {
      expect(
        Math.round((sidebar as HTMLElement).getBoundingClientRect().width),
      ).toBe(Math.round(collapsedWidthPx));
    });

    const trigger: HTMLElement | null = canvasElement.querySelector(
      "#dashboard-layout-main-content-header button",
    );
    expect(trigger).not.toBeNull();
    await userEvent.click(trigger as HTMLElement);

    // The sidebar animates its width, so wait for the transition to settle at
    // the configured width, and for the content container to start exactly
    // where the sidebar ends.
    await waitFor(
      (): void => {
        const sidebarRect: DOMRect = (
          sidebar as HTMLElement
        ).getBoundingClientRect();
        const contentRect: DOMRect = (
          content as HTMLElement
        ).getBoundingClientRect();
        expect(Math.round(sidebarRect.width)).toBe(
          Math.round(expectedOpenWidthPx),
        );
        expect(Math.round(contentRect.left)).toBe(Math.round(sidebarRect.right));
        // The content container fills whatever the root container leaves
        // beside the sidebar (measured from the container rather than the
        // window so a scrollbar cannot skew the expectation).
        const containerWidth: number = (
          container as HTMLElement
        ).getBoundingClientRect().width;
        expect(Math.round(contentRect.width)).toBe(
          Math.round(containerWidth - expectedOpenWidthPx),
        );
      },
      { timeout: 3000 },
    );

    // Collapsing again returns to the untouched icon-only width.
    await userEvent.click(trigger as HTMLElement);
    await waitFor(
      (): void => {
        expect(
          Math.round((sidebar as HTMLElement).getBoundingClientRect().width),
        ).toBe(Math.round(collapsedWidthPx));
      },
      { timeout: 3000 },
    );
  },
};

// --- Reduced motion ------------------------------------------------------
//
// Everything the layout moves has to stop moving for a viewer who has asked
// for reduced motion: the sidebar's width, the content area's width/offset
// and the header (CSS transitions), the wordmark and the group labels (Framer
// Motion), and the mobile sidebar's slide-in (a Radix Sheet). Three stories,
// one per route to that state — the `prefers-reduced-motion` media query, the
// `reducedMotion` prop, and the prop opting back out of the media query.

interface DashboardLayoutMovingParts {
  sidebar: HTMLElement;
  content: HTMLElement;
  header: HTMLElement;
}

/** The three pieces of layout chrome that animate in CSS. */
function getDashboardLayoutMovingParts(
  canvasElement: HTMLElement,
): DashboardLayoutMovingParts {
  const sidebar: HTMLElement | null =
    canvasElement.querySelector<HTMLElement>("menu");
  const content: HTMLElement | null = canvasElement.querySelector<HTMLElement>(
    "#dashboard-layout-main-content-container",
  );
  const header: HTMLElement | null = canvasElement.querySelector<HTMLElement>(
    "#dashboard-layout-main-content-header",
  );

  expect(sidebar).not.toBeNull();
  expect(content).not.toBeNull();
  expect(header).not.toBeNull();

  return {
    sidebar: sidebar as HTMLElement,
    content: content as HTMLElement,
    header: header as HTMLElement,
  };
}

/**
 * `transition-none` resets `transition-property` and leaves the duration of
 * the utility it overrides in place, so it is the property — not the duration
 * — that says whether an element will animate.
 */
function transitionPropertiesOf(parts: DashboardLayoutMovingParts): string[] {
  return [parts.sidebar, parts.content, parts.header].map(
    (element: HTMLElement): string =>
      getComputedStyle(element).transitionProperty,
  );
}

/**
 * Open the sidebar and assert that it arrived without animating: the width is
 * reached, and the wordmark — which is a Framer Motion element, not CSS — is
 * fully opaque well inside the 0.2s delay plus 0.3s fade it would otherwise
 * take.
 */
async function expectSidebarOpensWithoutAnimating(
  canvasElement: HTMLElement,
  parts: DashboardLayoutMovingParts,
): Promise<void> {
  const trigger: HTMLElement | null = canvasElement.querySelector<HTMLElement>(
    "#dashboard-layout-main-content-header button",
  );
  expect(trigger).not.toBeNull();
  await userEvent.click(trigger as HTMLElement);

  const remInPx: number = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  await waitFor(
    (): void => {
      expect(Math.round(parts.sidebar.getBoundingClientRect().width)).toBe(
        Math.round(14 * remInPx),
      );
    },
    { timeout: 3000 },
  );

  await waitFor(
    (): void => {
      const wordmark: HTMLElement | null =
        parts.sidebar.querySelector<HTMLElement>(
          "header .will-change-transform",
        );
      expect(wordmark).not.toBeNull();
      expect(getComputedStyle(wordmark as HTMLElement).opacity).toBe("1");
    },
    { timeout: 300 },
  );
}

// `reducedMotion="always"` is the hook for an app that offers its own "reduce
// motion" preference rather than deferring to the operating system.
export const WithReducedMotion: Story = {
  args: {
    sidebarItems: exampleSidebarItems,
    topBarTitle: "Reduced motion",
    reducedMotion: "always",
  } satisfies Partial<DashboardLayoutProps>,
  play: async ({ canvasElement }): Promise<void> => {
    // The desktop sidebar is the animated one; on a narrow viewport it is a
    // Sheet whose motion is asserted by its own component's stories.
    if (!window.matchMedia("(min-width: 768px)").matches) {
      return;
    }

    const parts: DashboardLayoutMovingParts =
      getDashboardLayoutMovingParts(canvasElement);
    for (const transitionProperty of transitionPropertiesOf(parts)) {
      expect(transitionProperty).toBe("none");
    }

    await expectSidebarOpensWithoutAnimating(canvasElement, parts);
  },
};

// The default (`reducedMotion="user"`) under an emulated OS preference. The
// test runner turns the media query on for this story only — see
// `.storybook/test-runner.ts`.
export const RespectsPrefersReducedMotion: Story = {
  tags: ["!autodocs"],
  parameters: {
    emulateReducedMotion: true,
  },
  args: {
    sidebarItems: exampleSidebarItems,
    topBarTitle: "prefers-reduced-motion",
  } satisfies Partial<DashboardLayoutProps>,
  play: async ({ canvasElement }): Promise<void> => {
    if (!window.matchMedia("(min-width: 768px)").matches) {
      return;
    }
    // Only the test runner (or a viewer whose OS actually asks for reduced
    // motion) can put the media query under test into effect. Opened from a
    // Storybook that is not emulating it, this story is just the default
    // layout, and there is nothing to assert.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const parts: DashboardLayoutMovingParts =
      getDashboardLayoutMovingParts(canvasElement);
    for (const transitionProperty of transitionPropertiesOf(parts)) {
      expect(transitionProperty).toBe("none");
    }

    await expectSidebarOpensWithoutAnimating(canvasElement, parts);
  },
};

// `reducedMotion="never"` has to win against the media query, not merely
// against the prop's default — the CSS half of this feature is a
// `motion-reduce:` variant, which would otherwise keep firing behind the
// consumer's back.
export const WithMotionForcedOn: Story = {
  tags: ["!autodocs"],
  parameters: {
    emulateReducedMotion: true,
  },
  args: {
    sidebarItems: exampleSidebarItems,
    topBarTitle: "Motion forced on",
    reducedMotion: "never",
  } satisfies Partial<DashboardLayoutProps>,
  play: async ({ canvasElement }): Promise<void> => {
    if (!window.matchMedia("(min-width: 768px)").matches) {
      return;
    }

    const parts: DashboardLayoutMovingParts =
      getDashboardLayoutMovingParts(canvasElement);
    expect(getComputedStyle(parts.sidebar).transitionProperty).toBe("width");
    expect(getComputedStyle(parts.content).transitionProperty).toBe(
      "width, left",
    );
    expect(getComputedStyle(parts.header).transitionProperty).toBe(
      "width, height",
    );

    // Still opens, it just takes the scenic route to get there.
    const trigger: HTMLElement | null =
      canvasElement.querySelector<HTMLElement>(
        "#dashboard-layout-main-content-header button",
      );
    expect(trigger).not.toBeNull();
    await userEvent.click(trigger as HTMLElement);

    const remInPx: number = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    await waitFor(
      (): void => {
        expect(Math.round(parts.sidebar.getBoundingClientRect().width)).toBe(
          Math.round(14 * remInPx),
        );
      },
      { timeout: 3000 },
    );
  },
};

// --- Active page indicator ----------------------------------------------
//
// The sidebar marks the item for the page being viewed. The current page comes
// from `activeHref`, or from the `usePathname` hook when that is supplied; an
// item is active when the path equals its `url` or is nested beneath it, and
// the longest matching `url` wins. The active row gets a gradient wash, a
// glowing gradient bar down its left edge and a bold gradient label, running
// between the `--sidebar-active-start` and `--sidebar-active-end` tokens from
// `@schemavaults/theme` (the brand blue and brand red unless a deployment
// overrides them). An admin-only row keeps its red label and icon.
//
// The first three stories pin the current page with `activeHref`. Expand the
// sidebar with the header trigger to see the label; collapsed, the wash, bar
// and icon colour carry it.

function activeItemDemoItem(
  title: string,
  url: string,
  IconComponent: SidebarIconSource,
): DashboardSidebarItemDefinition {
  return {
    type: "dashboard-sidebar-item-definition",
    title,
    url,
    icon: ({ className }): ReactElement => (
      <IconComponent className={className} />
    ),
  };
}

const activeItemSidebarItems = [
  activeItemDemoItem("Overview", "/", LayoutDashboard),
  activeItemDemoItem("Inbox", "/inbox", Inbox),
  manyLinksGroup("Analytics", [
    activeItemDemoItem("Reports", "/analytics/reports", BarChart3),
    activeItemDemoItem("Trends", "/analytics/trends", LineChart),
    activeItemDemoItem("Segments", "/analytics/segments", PieChart),
  ]),
  manyLinksGroup("Team", [
    activeItemDemoItem("Members", "/team/members", Users),
    activeItemDemoItem("Roles", "/team/roles", Shield),
  ]),
  manyLinksGroup(
    "Admin",
    [
      activeItemDemoItem("Audit Log", "/admin/audit-log", Lock),
      activeItemDemoItem("Feature Flags", "/admin/feature-flags", Flag),
    ],
    true,
  ),
] satisfies DashboardSidebarItemsAndGroupsDefinitions;

function ActiveItemPageContent({
  activeHref,
}: {
  activeHref: string;
}): ReactElement {
  return (
    <PageColumnContainer>
      <div className="flex flex-col gap-4 p-4 items-start">
        <p className="text-sm text-muted-foreground max-w-prose">
          The current page is pinned to <code>{activeHref}</code> with{" "}
          <code>activeHref</code>. Expand the sidebar with the trigger in the
          header to see the active item&rsquo;s label.
        </p>
        <ExampleChildrenForContainer />
      </div>
    </PageColumnContainer>
  );
}

// Finds a sidebar link by href anywhere in the document: on a narrow viewport
// the sidebar is a Sheet that portals its content to document.body.
function findSidebarLink(href: string): HTMLAnchorElement | null {
  return document.querySelector<HTMLAnchorElement>(
    `menu a[href="${href}"], [role="dialog"] a[href="${href}"]`,
  );
}

async function expectOnlyActiveSidebarLink(href: string): Promise<void> {
  // A narrow viewport renders the sidebar as a closed Sheet, whose links are
  // not mounted until it is opened. The desktop sidebar is always mounted.
  if (!window.matchMedia("(min-width: 768px)").matches) {
    return;
  }
  await waitFor((): void => {
    const link: HTMLAnchorElement | null = findSidebarLink(href);
    expect(link).not.toBeNull();
    expect(link).toHaveAttribute("aria-current", "page");
    expect(link!.closest("li")).toHaveAttribute("data-active", "true");
  });
  const current: NodeListOf<HTMLAnchorElement> =
    document.querySelectorAll<HTMLAnchorElement>(
      'menu a[aria-current="page"]',
    );
  expect(current).toHaveLength(1);
}

// Resolves a CSS colour the way the browser does, so it can be compared with
// a computed style: a computed `color` is always an `rgb()`/`rgba()` string.
function resolveCssColor(value: string): string {
  const probe: HTMLSpanElement = document.createElement("span");
  probe.style.color = value;
  document.body.appendChild(probe);
  const resolved: string = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
}

// Asserts that the active row's gradient bar runs between the two colours.
async function expectActiveItemGradient(
  start: string,
  end: string,
): Promise<void> {
  // The desktop sidebar is always mounted; the mobile Sheet is not.
  if (!window.matchMedia("(min-width: 768px)").matches) {
    return;
  }
  await waitFor((): void => {
    const bar: HTMLElement | null = document.querySelector<HTMLElement>(
      'menu li[data-active="true"] [data-slot="dashboard-sidebar-active-item-bar"]',
    );
    expect(bar).not.toBeNull();
    const gradient: string = getComputedStyle(bar!).backgroundImage;
    expect(gradient).toContain(resolveCssColor(start));
    expect(gradient).toContain(resolveCssColor(end));
  });
}

export const ActiveItem: Story = {
  args: {
    sidebarItems: activeItemSidebarItems,
    topBarTitle: "Reports",
    activeHref: "/analytics/reports",
    children: <ActiveItemPageContent activeHref="/analytics/reports" />,
  } satisfies Partial<DashboardLayoutProps>,
  play: async (): Promise<void> => {
    await expectOnlyActiveSidebarLink("/analytics/reports");

    // The gradient comes from the theme's tokens, which default to the brand
    // colours...
    expect(resolveCssColor("var(--sidebar-active-start)")).toBe(
      resolveCssColor("var(--schemavaults-brand-blue)"),
    );
    expect(resolveCssColor("var(--sidebar-active-end)")).toBe(
      resolveCssColor("var(--schemavaults-brand-red)"),
    );
    await expectActiveItemGradient(
      "var(--schemavaults-brand-blue)",
      "var(--schemavaults-brand-red)",
    );

    // ...and follows a deployment's theme overrides on <html>.
    const overrides: Record<string, string> = {
      "--sv-theme-light-sidebar-active-start": "#10b981",
      "--sv-theme-dark-sidebar-active-start": "#10b981",
      "--sv-theme-light-sidebar-active-end": "#8b5cf6",
      "--sv-theme-dark-sidebar-active-end": "#8b5cf6",
    };
    const root: HTMLElement = document.documentElement;
    try {
      for (const [name, value] of Object.entries(overrides)) {
        root.style.setProperty(name, value);
      }
      await expectActiveItemGradient("#10b981", "#8b5cf6");
    } finally {
      for (const name of Object.keys(overrides)) {
        root.style.removeProperty(name);
      }
    }
  },
};

// An admin-only item keeps its red when it is the active one.
export const ActiveAdminItem: Story = {
  args: {
    sidebarItems: activeItemSidebarItems,
    topBarTitle: "Audit Log",
    activeHref: "/admin/audit-log",
    children: <ActiveItemPageContent activeHref="/admin/audit-log" />,
  } satisfies Partial<DashboardLayoutProps>,
  play: async (): Promise<void> => {
    await expectOnlyActiveSidebarLink("/admin/audit-log");
  },
};

// A deployment re-themes the gradient through the theme's overrides
// (`--sv-theme-light-sidebar-active-start` and friends on <html>, or the
// `THEME_*_SIDEBAR_ACTIVE_*` environment variables). To re-colour a single
// layout instead, set the tokens themselves on an ancestor, as this story does
// with an emerald-to-violet pair.
export const ActiveItemCustomGradient: Story = {
  args: {
    sidebarItems: activeItemSidebarItems,
    topBarTitle: "Reports",
    activeHref: "/analytics/reports",
    children: <ActiveItemPageContent activeHref="/analytics/reports" />,
  } satisfies Partial<DashboardLayoutProps>,
  decorators: [
    (Story, context): ReactElement => (
      <div
        style={
          {
            "--sidebar-active-start": "#10b981",
            "--sidebar-active-end": "#8b5cf6",
          } as CSSProperties
        }
      >
        <Story {...context} />
      </div>
    ),
  ],
  play: async (): Promise<void> => {
    await expectOnlyActiveSidebarLink("/analytics/reports");
    await expectActiveItemGradient("#10b981", "#8b5cf6");
  },
};

// --- The active item follows navigation ---------------------------------
//
// Drives the active item from `usePathname`, the way a Next.js app would: the
// story's Link performs client-side navigation by updating the pathname its
// `usePathname` hook returns. Click around the sidebar and the marker moves.
// A pathname nested beneath an item (`/analytics/reports/q3`) still marks
// that item.

const InAppNavigateContext = createContext<(href: string) => void>(
  (): void => {},
);

function InAppNavigationLink({
  href,
  className,
  onClick,
  children,
  "aria-current": ariaCurrent,
}: LinkComponentProps): ReactElement {
  const navigate = useContext(InAppNavigateContext);
  return (
    <a
      href={href}
      className={className}
      aria-current={ariaCurrent}
      onClick={(e): void => {
        if (typeof onClick === "function") {
          onClick(e);
        }
        if (e.defaultPrevented) {
          return;
        }
        // Client-side navigation: keep the Storybook iframe where it is.
        e.preventDefault();
        navigate(href);
      }}
    >
      {children}
    </a>
  );
}

InAppNavigationLink satisfies LinkComponentType;

function ActiveItemFollowsNavigationRender(
  args: Partial<DashboardLayoutProps>,
): ReactElement {
  const [pathname, setPathname] = useState<string>("/analytics/reports/q3");
  const usePathname = (): string => pathname;
  return (
    <InAppNavigateContext.Provider value={setPathname}>
      <DashboardLayout
        {...(args as DashboardLayoutProps)}
        Link={InAppNavigationLink}
        usePathname={usePathname}
      >
        <PageColumnContainer>
          <div className="flex flex-col gap-4 p-4 items-start">
            <p>
              Current pathname: <code data-testid="pathname">{pathname}</code>
            </p>
            <p className="text-sm text-muted-foreground max-w-prose">
              Click a sidebar link to navigate; the active marker follows the
              pathname returned by <code>usePathname</code>.
            </p>
            <ExampleChildrenForContainer />
          </div>
        </PageColumnContainer>
      </DashboardLayout>
    </InAppNavigateContext.Provider>
  );
}

export const ActiveItemFollowsNavigation: Story = {
  args: {
    sidebarItems: activeItemSidebarItems,
    topBarTitle: "Active item follows navigation",
  } satisfies Partial<DashboardLayoutProps>,
  render: (args): ReactElement => (
    <ActiveItemFollowsNavigationRender {...args} />
  ),
  play: async ({ canvasElement }): Promise<void> => {
    if (!window.matchMedia("(min-width: 768px)").matches) {
      return;
    }
    const canvas = within(canvasElement);

    // Nested beneath /analytics/reports, so Reports is the active item.
    await expectOnlyActiveSidebarLink("/analytics/reports");

    await userEvent.click(findSidebarLink("/team/roles")!);
    await waitFor((): void => {
      expect(canvas.getByTestId("pathname")).toHaveTextContent("/team/roles");
    });
    await expectOnlyActiveSidebarLink("/team/roles");
    expect(findSidebarLink("/analytics/reports")).not.toHaveAttribute(
      "aria-current",
    );
  },
};

// ---------------------------------------------------------------------------
// First paint on either side of the `md` breakpoint
// ---------------------------------------------------------------------------
//
// Which sidebar the layout renders — the persistent desktop <menu> or the
// mobile Sheet — follows `useIsMobile`, and that hook can only read the
// viewport from an effect. The first client render, and the server render,
// therefore always take the desktop branch, even on a phone, and the desktop
// sidebar used to be visible there for a frame (or until hydration) before the
// Sheet replaced it. It is now hidden below `md` in CSS, which the browser
// applies from the first paint.
//
// A `play()` test starts long after that first render, so these stories record
// what the DOM looked like at the moment React first committed it — before any
// effect had run — and assert on the record.

/** A desktop sidebar <menu> as it was at the layout's first commit. */
interface FirstCommitMenuRecord {
  /** Its computed `display`. */
  display: string;
  /** Its rendered width in CSS pixels; `0` while it is not displayed. */
  width: number;
}

const FIRST_COMMIT_MENUS_ATTRIBUTE = "data-first-commit-menus";

/**
 * Records every desktop sidebar <menu> inside it as of the first commit.
 *
 * A parent's layout effect runs once its descendants are in the DOM but before
 * any passive effect anywhere in the tree — `useIsMobile`'s included — so it
 * sees the layout exactly as the browser first paints it. The record is
 * written onto the wrapper as JSON for the `play()` function to read back.
 */
function FirstCommitProbe({ children }: PropsWithChildren): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect((): void => {
    const root: HTMLDivElement | null = ref.current;
    // Record the first commit only; later commits are what `play()` can see
    // for itself.
    if (!root || root.hasAttribute(FIRST_COMMIT_MENUS_ATTRIBUTE)) {
      return;
    }
    const menus: FirstCommitMenuRecord[] = Array.from(
      root.querySelectorAll<HTMLElement>("menu"),
      (menu: HTMLElement): FirstCommitMenuRecord => ({
        display: getComputedStyle(menu).display,
        width: menu.getBoundingClientRect().width,
      }),
    );
    root.setAttribute(FIRST_COMMIT_MENUS_ATTRIBUTE, JSON.stringify(menus));
  }, []);
  return (
    <div ref={ref} className="contents">
      {children}
    </div>
  );
}

function readFirstCommitMenus(
  canvasElement: HTMLElement,
): FirstCommitMenuRecord[] {
  const probe: HTMLElement | null = canvasElement.querySelector<HTMLElement>(
    `[${FIRST_COMMIT_MENUS_ATTRIBUTE}]`,
  );
  expect(
    probe,
    `FirstCommitProbe never wrote its ${FIRST_COMMIT_MENUS_ATTRIBUTE} record: the story did not render through renderWithFirstCommitProbe, or its layout effect did not run`,
  ).not.toBeNull();
  return JSON.parse(
    (probe as HTMLElement).getAttribute(FIRST_COMMIT_MENUS_ATTRIBUTE) as string,
  ) as FirstCommitMenuRecord[];
}

function renderWithFirstCommitProbe(args: DashboardLayoutProps): ReactElement {
  return (
    <FirstCommitProbe>
      <DashboardLayout {...args} />
    </FirstCommitProbe>
  );
}

/** The canvas width a first-paint story is about. */
interface FirstPaintViewport {
  /** A media query that matches only that side of the `md` breakpoint. */
  query: string;
  /** How a failure message describes it. */
  description: string;
}

const PHONE_VIEWPORT: FirstPaintViewport = {
  query: "(max-width: 767px)",
  description: "phone-sized (below the 768px md breakpoint)",
};

const DESKTOP_VIEWPORT: FirstPaintViewport = {
  query: "(min-width: 768px)",
  description: "desktop-sized (at or above the 768px md breakpoint)",
};

/**
 * Wait for the canvas to reach `viewport`, then render the story.
 *
 * Storybook only resizes the canvas to a story's pinned viewport after it has
 * started rendering that story. Clicking from a wide story to a phone-sized
 * one in the Storybook UI therefore rendered — and committed — the layout at
 * the old width and shrank the frame afterwards, so the first-commit record
 * described a desktop and the story failed for a reason that had nothing to
 * do with the layout. Rendering from `play()` with `mount` holds the first
 * commit back until the canvas is the width the story is about. The test
 * runner sizes its page before the story loads, so there this mounts at once.
 */
async function mountAtViewport(
  mount: () => Promise<unknown>,
  viewport: FirstPaintViewport,
): Promise<void> {
  await waitFor(
    (): void => {
      expect(
        window.matchMedia(viewport.query).matches,
        `This story checks first paint on a ${viewport.description} canvas, but the canvas is ${window.innerWidth}px wide. Its viewport global did not take effect: the story must pin it, and Storybook's viewport tool or the test runner must apply it.`,
      ).toBe(true);
    },
    { timeout: 3000 },
  );
  await mount();
}

// Regression test: on a phone, the desktop sidebar must not show for even a
// single frame before `useIsMobile` catches up and the mobile Sheet replaces
// it. The story pins a phone-sized viewport through its globals: Storybook's
// viewport tool applies it in the UI and `.storybook/test-runner.ts` in the
// test runner.
export const MobileFirstPaintHidesDesktopSidebar: Story = {
  tags: ["!autodocs"],
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
  args: {
    sidebarItems: exampleSidebarItems,
    topBarTitle: "First paint on a phone",
  } satisfies Partial<DashboardLayoutProps>,
  render: renderWithFirstCommitProbe,
  play: async ({ canvasElement, mount }): Promise<void> => {
    // Only a narrow viewport puts the media query under test into effect, so
    // a wide one is a broken test setup rather than nothing to check.
    await mountAtViewport(mount, PHONE_VIEWPORT);

    // Whatever React committed first, none of it may have been a visible
    // desktop sidebar.
    readFirstCommitMenus(canvasElement).forEach(
      (menu: FirstCommitMenuRecord, index: number): void => {
        expect(
          menu.display,
          `Desktop sidebar <menu> #${index + 1} was displayed ("display: ${menu.display}") at the layout's first commit on a phone-sized canvas. It must be hidden below md ("max-md:hidden") until useIsMobile swaps in the mobile Sheet.`,
        ).toBe("none");
        expect(
          menu.width,
          `Desktop sidebar <menu> #${index + 1} took up ${menu.width}px at the layout's first commit on a phone-sized canvas. It must take up no space below md.`,
        ).toBe(0);
      },
    );

    // Once `useIsMobile` has read the viewport, the desktop sidebar is gone
    // altogether: the mobile Sheet, closed, renders nothing.
    await waitFor((): void => {
      expect(
        canvasElement.querySelector("menu"),
        "The desktop sidebar <menu> is still mounted on a phone-sized canvas. Once useIsMobile reports a phone, the layout should render the closed mobile Sheet instead, which mounts nothing.",
      ).toBeNull();
    });
  },
};

// The desktop counterpart. The guard must not simply move the flash to the
// other side of the breakpoint: on a wide viewport the sidebar is on screen
// from the first commit, not only once an effect has confirmed it belongs.
export const DesktopFirstPaintShowsSidebar: Story = {
  tags: ["!autodocs"],
  args: {
    sidebarItems: exampleSidebarItems,
    topBarTitle: "First paint on a desktop",
  } satisfies Partial<DashboardLayoutProps>,
  render: renderWithFirstCommitProbe,
  play: async ({ canvasElement, mount }): Promise<void> => {
    // The runner's default viewport is wide, and this story runs right after
    // one that pinned a phone-sized viewport for itself, so this also checks
    // that the runner has reset the page in between. A narrow canvas is a
    // broken test setup rather than nothing to check.
    await mountAtViewport(mount, DESKTOP_VIEWPORT);

    const menus: FirstCommitMenuRecord[] = readFirstCommitMenus(canvasElement);
    expect(
      menus,
      `Expected exactly one desktop sidebar <menu> at the layout's first commit on a desktop-sized canvas, found ${menus.length}.`,
    ).toHaveLength(1);
    expect(
      menus[0]?.display,
      "The desktop sidebar <menu> was hidden at the layout's first commit on a desktop-sized canvas. It must be on screen from the first paint, not only once an effect confirms it belongs there.",
    ).not.toBe("none");

    // Collapsed to the icon-only width, as on every later render.
    const remInPx: number = parseFloat(
      getComputedStyle(document.documentElement).fontSize,
    );
    const firstCommitWidth: number = Math.round(menus[0]?.width ?? 0);
    const collapsedWidth: number = Math.round(4 * remInPx);
    expect(
      firstCommitWidth,
      `The desktop sidebar <menu> was ${firstCommitWidth}px wide at the layout's first commit. It should start collapsed to the 4rem (${collapsedWidth}px) icon-only width.`,
    ).toBe(collapsedWidth);
  },
};

// ---------------------------------------------------------------------------
// The mobile sidebar fills its Sheet
// ---------------------------------------------------------------------------
//
// The Sheet is pinned to the visible area, but on a phone `100vh` is not that
// area: iOS measures it with its toolbars hidden, or shrunk to the keyboard.
// The sidebar <menu> used to be `h-screen` inside the Sheet, so it ended above
// or below the Sheet's bottom edge — clipping the menu links over a blank
// strip of Sheet under the footer, or sliding the footer under the browser's
// toolbar. A desktop browser's `100vh` always matches its visible area, so
// this story resizes the open Sheet away from it, both ways, and checks that
// the menu and its footer follow the Sheet rather than the viewport.
export const MobileSidebarFillsSheet: Story = {
  tags: ["!autodocs"],
  globals: {
    viewport: { value: "mobile1", isRotated: false },
  },
  args: {
    sidebarItems: manyLinksSidebarItems,
    topBarTitle: "Sidebar in a Sheet",
  } satisfies Partial<DashboardLayoutProps>,
  play: async ({ canvasElement }): Promise<void> => {
    await waitFor(
      (): void => {
        expect(
          window.matchMedia(PHONE_VIEWPORT.query).matches,
          `This story checks the mobile Sheet, but the canvas is ${window.innerWidth}px wide. Its viewport global did not take effect.`,
        ).toBe(true);
      },
      { timeout: 3000 },
    );

    await userEvent.click(sidebarTriggerIn(canvasElement));
    const sheet: HTMLElement = await waitFor(
      (): HTMLElement => {
        const element: HTMLElement | null =
          document.querySelector<HTMLElement>('[data-slot="sheet-content"]');
        expect(element).not.toBeNull();
        return element as HTMLElement;
      },
      { timeout: 3000 },
    );
    const menu: HTMLElement | null = sheet.querySelector<HTMLElement>("menu");
    const footer: HTMLElement | null =
      menu?.querySelector<HTMLElement>("footer") ?? null;
    expect(menu).not.toBeNull();
    expect(footer).not.toBeNull();

    for (const scale of [0.7, 1.3]) {
      const sheetHeight: number = Math.round(window.innerHeight * scale);
      sheet.style.height = `${sheetHeight}px`;
      const sheetBottom: number = Math.round(sheet.getBoundingClientRect().bottom);
      const menuBottom: number = Math.round(
        (menu as HTMLElement).getBoundingClientRect().bottom,
      );
      const footerBottom: number = Math.round(
        (footer as HTMLElement).getBoundingClientRect().bottom,
      );
      expect(
        menuBottom,
        `With the Sheet ${sheetHeight}px tall on a ${window.innerHeight}px viewport, the sidebar <menu> ends at ${menuBottom}px instead of the Sheet's bottom edge (${sheetBottom}px). The mobile menu must fill its Sheet, not the viewport.`,
      ).toBe(sheetBottom);
      expect(
        footerBottom,
        `With the Sheet ${sheetHeight}px tall, the sidebar footer ends at ${footerBottom}px instead of the Sheet's bottom edge (${sheetBottom}px).`,
      ).toBe(sheetBottom);
    }
    sheet.style.height = "";
  },
};
