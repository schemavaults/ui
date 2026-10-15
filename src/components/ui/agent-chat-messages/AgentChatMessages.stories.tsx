import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  type MouseEvent,
  type ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Download, FileSpreadsheet } from "lucide-react";

import {
  AgentChatMessages,
  AgentChatBubble,
  AgentTypingIndicator,
  AgentChatAnnouncement,
  AgentChatHILMessage,
  AgentChatArtifactMessage,
  AgentChatImage,
  AgentChatArtifact,
  agentChatMessagesSpacingIds,
  type AgentChatMessagesSpacingId,
} from ".";
import { Avatar, AvatarFallback } from "../avatar/avatar";
import { Button } from "../button/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../table/table";

interface AgentChatMessagesExampleProps {
  spacing?: AgentChatMessagesSpacingId;
  autoScroll?: boolean;
  showTyping?: boolean;
  showAnnouncement?: boolean;
  showHIL?: boolean;
  showAvatars?: boolean;
  onApprove?: () => void;
  onDeny?: () => void;
}

function UserAvatar(): ReactElement {
  return (
    <Avatar size="sm">
      <AvatarFallback>U</AvatarFallback>
    </Avatar>
  );
}

function AssistantAvatar(): ReactElement {
  return (
    <Avatar size="sm">
      <AvatarFallback>AI</AvatarFallback>
    </Avatar>
  );
}

function AgentChatMessagesExample({
  spacing,
  autoScroll,
  showTyping = false,
  showAnnouncement = false,
  showHIL = false,
  showAvatars = false,
  onApprove,
  onDeny,
}: AgentChatMessagesExampleProps): ReactElement {
  return (
    <div className="h-[480px] w-[520px] rounded-lg border bg-background">
      <AgentChatMessages spacing={spacing} autoScroll={autoScroll}>
        {showAnnouncement ? (
          <AgentChatAnnouncement key="opened" variant="info">
            Conversation started
          </AgentChatAnnouncement>
        ) : null}
        <AgentChatBubble
          key="msg-1"
          from="user"
          avatar={showAvatars ? <UserAvatar /> : undefined}
          senderName={showAvatars ? "You" : undefined}
        >
          Can you help me write a TypeScript helper to debounce a function?
        </AgentChatBubble>
        <AgentChatBubble
          key="msg-2"
          from="assistant"
          avatar={showAvatars ? <AssistantAvatar /> : undefined}
          senderName={showAvatars ? "Claude" : undefined}
        >
          {`Sure — here's a tiny one. It returns a function that delays calls until \`wait\` ms of quiet:\n\nconst debounce = (fn, wait) => {\n  let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };\n};`}
        </AgentChatBubble>
        {showAnnouncement ? (
          <AgentChatAnnouncement key="tool" variant="default">
            Tool call: format_code completed
          </AgentChatAnnouncement>
        ) : null}
        <AgentChatBubble
          key="msg-3"
          from="user"
          avatar={showAvatars ? <UserAvatar /> : undefined}
        >
          Nice. Can you add types?
        </AgentChatBubble>
        {showHIL ? (
          <AgentChatHILMessage
            key="hil"
            tone="warning"
            label="Approval required"
          >
            <div className="space-y-3 text-sm">
              <p>
                The assistant wants to write to{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  src/lib/debounce.ts
                </code>
                . Allow?
              </p>
              <div className="flex gap-2">
                <Button size="sm" onClick={onApprove}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={onDeny}>
                  Deny
                </Button>
              </div>
            </div>
          </AgentChatHILMessage>
        ) : null}
        {showTyping ? (
          <AgentTypingIndicator
            key="typing"
            avatar={showAvatars ? <AssistantAvatar /> : undefined}
          />
        ) : null}
      </AgentChatMessages>
    </div>
  );
}

const meta = {
  title: "AI & Chat/AgentChatMessages",
  component: AgentChatMessagesExample,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    spacing: {
      options: agentChatMessagesSpacingIds,
      control: { type: "radio" },
    },
    autoScroll: { control: { type: "boolean" } },
    showTyping: { control: { type: "boolean" } },
    showAnnouncement: { control: { type: "boolean" } },
    showHIL: { control: { type: "boolean" } },
    showAvatars: { control: { type: "boolean" } },
  },
  args: {
    spacing: "default",
    autoScroll: true,
    showTyping: false,
    showAnnouncement: false,
    showHIL: false,
    showAvatars: false,
    onApprove: fn(),
    onDeny: fn(),
  },
} satisfies Meta<typeof AgentChatMessagesExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WithAvatars: Story = {
  args: {
    showAvatars: true,
  },
};

export const WithTypingIndicator: Story = {
  args: {
    showTyping: true,
    showAvatars: true,
  },
};

export const WithAnnouncement: Story = {
  args: {
    showAnnouncement: true,
  },
};

export const WithHILMessage: Story = {
  args: {
    showHIL: true,
    showAvatars: true,
  },
};

export const Everything: Story = {
  args: {
    showTyping: true,
    showAnnouncement: true,
    showHIL: true,
    showAvatars: true,
  },
};

/* -------------------------------------------------------------- */
/* Bubble width regression                                        */
/* -------------------------------------------------------------- */

const CHAT_WIDTH = 520;
/** Marker class so the play function can grab the colored bubble element. */
const BUBBLE_PROBE_CLASS = "story-bubble-probe";

function BubbleWidthExample(): ReactElement {
  return (
    <div
      className="h-[480px] rounded-lg border bg-background"
      style={{ width: CHAT_WIDTH }}
    >
      <AgentChatMessages>
        <AgentChatBubble
          key="short"
          from="user"
          data-testid="short-bubble"
          bubbleClassName={BUBBLE_PROBE_CLASS}
        >
          yeah
        </AgentChatBubble>
        <AgentChatBubble
          key="short-avatar"
          from="assistant"
          avatar={<AssistantAvatar />}
          data-testid="short-avatar-bubble"
          bubbleClassName={BUBBLE_PROBE_CLASS}
        >
          ok
        </AgentChatBubble>
        <AgentChatBubble
          key="long"
          from="assistant"
          data-testid="long-bubble"
          bubbleClassName={BUBBLE_PROBE_CLASS}
        >
          This is a much longer assistant message that should wrap against the
          width of the chat area rather than being force-broken mid-word at the
          bubble&apos;s own intrinsic width.
        </AgentChatBubble>
      </AgentChatMessages>
    </div>
  );
}

/**
 * Regression coverage: a bubble's `max-w-[80%]` must resolve against the chat
 * row, not against the bubble's own intrinsic width. When the inner column
 * wrapper shrink-to-fits, every bubble is capped at 80% of its own text width
 * and `break-words` splits short words ("yeah" renders as "ye" / "ah").
 */
export const BubbleWidths: StoryObj<typeof BubbleWidthExample> = {
  render: (): ReactElement => <BubbleWidthExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);

    const bubbleOf = (testId: string): HTMLElement => {
      const row = canvas.getByTestId(testId);
      const bubble = row.querySelector<HTMLElement>(`.${BUBBLE_PROBE_CLASS}`);
      if (!bubble) throw new Error(`No bubble element found in ${testId}`);
      return bubble;
    };

    const lineCount = (el: HTMLElement): number => {
      const styles = getComputedStyle(el);
      const inner =
        el.getBoundingClientRect().height -
        parseFloat(styles.paddingTop) -
        parseFloat(styles.paddingBottom);
      return Math.round(inner / parseFloat(styles.lineHeight));
    };

    // Short messages keep their natural width and stay on a single line.
    expect(lineCount(bubbleOf("short-bubble"))).toBe(1);
    expect(lineCount(bubbleOf("short-avatar-bubble"))).toBe(1);

    // Long messages are capped at 80% of the chat area, not 80% of themselves.
    const longWidth = bubbleOf("long-bubble").getBoundingClientRect().width;
    expect(longWidth).toBeGreaterThan(CHAT_WIDTH * 0.6);
    expect(longWidth).toBeLessThanOrEqual(CHAT_WIDTH * 0.8);
  },
};

/* -------------------------------------------------------------- */
/* Auto-scroll demo                                               */
/* -------------------------------------------------------------- */

interface LongConversationExampleProps {
  autoScroll?: boolean;
}

function LongConversationExample({
  autoScroll,
}: LongConversationExampleProps): ReactElement {
  const initialMessages = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: `seed-${i}`,
        from: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
        text:
          i % 2 === 0
            ? `Question #${i + 1}: how does this work?`
            : `Answer #${i + 1}: like this — short and to the point.`,
      })),
    [],
  );
  const [messages, setMessages] = useState(initialMessages);

  const addMessage = useCallback((): void => {
    setMessages((prev) => [
      ...prev,
      {
        id: `new-${prev.length}`,
        from:
          prev[prev.length - 1]?.from === "user"
            ? ("assistant" as const)
            : ("user" as const),
        text: `New message #${prev.length + 1} appended at ${new Date().toLocaleTimeString()}`,
      },
    ]);
  }, []);

  return (
    <div className="flex w-[520px] flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          autoScroll: {String(autoScroll ?? true)}
        </span>
        <Button size="sm" onClick={addMessage}>
          Append message
        </Button>
      </div>
      <div className="h-[420px] rounded-lg border bg-background">
        <AgentChatMessages autoScroll={autoScroll}>
          {messages.map((m) => (
            <AgentChatBubble key={m.id} from={m.from}>
              {m.text}
            </AgentChatBubble>
          ))}
        </AgentChatMessages>
      </div>
    </div>
  );
}

export const LongConversationAutoScroll: Story = {
  render: () => <LongConversationExample autoScroll />,
  args: {},
};

export const LongConversationNoAutoScroll: Story = {
  render: () => <LongConversationExample autoScroll={false} />,
  args: {},
};

/* -------------------------------------------------------------- */
/* Auto-scroll: content that grows in place                       */
/* -------------------------------------------------------------- */

function GrowingContentExample(): ReactElement {
  const [extraHeight, setExtraHeight] = useState(0);
  const seedMessages = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: `seed-${i}`,
        from: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
        text: `Message #${i + 1}`,
      })),
    [],
  );

  return (
    <div className="flex w-[520px] flex-col gap-3">
      <div className="flex justify-end">
        <Button size="sm" onClick={(): void => setExtraHeight((h) => h + 240)}>
          Grow last message
        </Button>
      </div>
      <div className="h-[360px] rounded-lg border bg-background">
        <AgentChatMessages>
          {seedMessages.map((message) => (
            <AgentChatBubble key={message.id} from={message.from}>
              {message.text}
            </AgentChatBubble>
          ))}
          <AgentChatBubble key="growing" from="assistant">
            Rendering a chart…
            <div style={{ height: extraHeight }} />
          </AgentChatBubble>
        </AgentChatMessages>
      </div>
    </div>
  );
}

/**
 * Regression coverage: messages grow without a new one arriving — an image
 * finishes loading, a reply streams in. A transcript pinned to the bottom must
 * follow that growth, including growth that lands while the smooth scroll from
 * the previous one is still under way. A reader who scrolled up stays put.
 */
export const StaysPinnedWhileContentGrows: StoryObj<
  typeof GrowingContentExample
> = {
  render: (): ReactElement => <GrowingContentExample />,
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-slot="agent-chat-messages-viewport"]',
    );
    if (!viewport) throw new Error("No chat viewport found");

    const distanceFromBottom = (): number =>
      viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
    const nextScroll = (): Promise<void> =>
      new Promise((resolve) => {
        viewport.addEventListener("scroll", (): void => resolve(), {
          once: true,
        });
      });
    const grow = canvas.getByRole("button", { name: "Grow last message" });

    await waitFor(() => expect(distanceFromBottom()).toBeLessThanOrEqual(1));

    const scrolling = nextScroll();
    await userEvent.click(grow);
    await scrolling;
    await userEvent.click(grow);
    await waitFor(() => expect(distanceFromBottom()).toBeLessThanOrEqual(1));

    const scrolledUp = nextScroll();
    viewport.scrollTo({ top: 0 });
    await scrolledUp;
    await userEvent.click(grow);
    await new Promise((resolve) => setTimeout(resolve, 300));
    expect(viewport.scrollTop).toBe(0);
  },
};

/* -------------------------------------------------------------- */
/* Artifacts: images                                              */
/* -------------------------------------------------------------- */

const SKY_PREVIEW_SRC = "/media/example_images/milky-way-400x300.webp";
const SKY_FULLSCREEN_SRC = "/media/example_images/milky-way-1920x1080.webp";
const SKY_ALT = "Render of the Milky Way above the observatory ridge";

function DownloadImageButton({
  href,
  fileName,
}: {
  href: string;
  fileName: string;
}): ReactElement {
  return (
    <Button
      asChild
      size="icon"
      variant="secondary"
      className="size-8 bg-background/80 backdrop-blur hover:bg-background"
    >
      <a href={href} download={fileName} aria-label={`Download ${fileName}`}>
        <Download className="size-4" />
      </a>
    </Button>
  );
}

interface ImageFromAgentExampleProps {
  onImageClick?: () => void;
  onViewerOpenChange?: (open: boolean) => void;
}

function ImageFromAgentExample({
  onImageClick,
  onViewerOpenChange,
}: ImageFromAgentExampleProps): ReactElement {
  return (
    <div className="h-[560px] w-[560px] rounded-lg border bg-background">
      <AgentChatMessages>
        <AgentChatBubble key="ask" from="user" avatar={<UserAvatar />}>
          Render tonight&apos;s sky over the observatory so I can check the
          framing.
        </AgentChatBubble>
        <AgentChatBubble key="reply" from="assistant" avatar={<AssistantAvatar />}>
          Here&apos;s the render. Click it to see the full 1920 × 1080 frame.
        </AgentChatBubble>
        <AgentChatArtifactMessage key="render" avatar={<AssistantAvatar />}>
          <AgentChatImage
            src={SKY_PREVIEW_SRC}
            fullscreenSrc={SKY_FULLSCREEN_SRC}
            width={400}
            height={300}
            alt={SKY_ALT}
            caption="milky-way.webp · 1920 × 1080"
            onClick={onImageClick}
            onOpenChange={onViewerOpenChange}
            actions={
              <DownloadImageButton
                href={SKY_FULLSCREEN_SRC}
                fileName="milky-way.webp"
              />
            }
          />
        </AgentChatArtifactMessage>
        <AgentChatBubble key="thanks" from="user" avatar={<UserAvatar />}>
          Perfect — the ridge line sits right where I wanted it.
        </AgentChatBubble>
      </AgentChatMessages>
    </div>
  );
}

/**
 * An image the agent produced. The transcript loads a small preview (`src`);
 * clicking it opens the full-resolution original (`fullscreenSrc`) in a
 * fullscreen viewer, which only then fetches it. `width`/`height` reserve the
 * preview's space before it loads, and `actions` overlay a download button.
 */
export const ImageFromAgent: StoryObj<typeof ImageFromAgentExample> = {
  render: (args): ReactElement => <ImageFromAgentExample {...args} />,
  args: {
    onImageClick: fn(),
    onViewerOpenChange: fn(),
  },
};

/**
 * Interaction test for `ImageFromAgent`: the preview loads `src`, a click
 * opens the viewer on `fullscreenSrc`, and Escape closes it and returns focus
 * to the preview. Kept apart from the showcase because Storybook runs `play()`
 * every time a story renders, which would open the viewer on load; and out of
 * the autodocs page, as a test rather than an example.
 */
export const ImageViewerOpensFullSize: StoryObj<
  typeof ImageFromAgentExample
> = {
  ...ImageFromAgent,
  tags: ["!autodocs"],
  play: async ({ args, canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const trigger = canvas.getByRole("button", {
      name: `View full size: ${SKY_ALT}`,
    });

    // The transcript only loads the small preview.
    expect(within(trigger).getByRole("img", { name: SKY_ALT })).toHaveAttribute(
      "src",
      SKY_PREVIEW_SRC,
    );

    await userEvent.click(trigger);
    expect(args.onImageClick).toHaveBeenCalledTimes(1);
    expect(args.onViewerOpenChange).toHaveBeenLastCalledWith(true);

    // The viewer shows the full-resolution original.
    const viewer = await body.findByRole("dialog", { name: SKY_ALT });
    expect(within(viewer).getByRole("img", { name: SKY_ALT })).toHaveAttribute(
      "src",
      SKY_FULLSCREEN_SRC,
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    expect(args.onViewerOpenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

interface ImageCustomClickExampleProps {
  onInspect?: (imageId: string) => void;
}

function ImageCustomClickExample({
  onInspect,
}: ImageCustomClickExampleProps): ReactElement {
  const [inspected, setInspected] = useState<string | null>(null);

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    // Keep the built-in viewer closed: this app inspects images in a panel.
    event.preventDefault();
    setInspected(SKY_FULLSCREEN_SRC);
    onInspect?.("sky-render");
  };

  return (
    <div className="flex gap-3">
      <div className="h-[480px] w-[480px] rounded-lg border bg-background">
        <AgentChatMessages>
          <AgentChatBubble key="reply" from="assistant">
            Done — click the render to inspect it alongside the chat.
          </AgentChatBubble>
          <AgentChatArtifactMessage key="render">
            <AgentChatImage
              src={SKY_PREVIEW_SRC}
              width={400}
              height={300}
              alt={SKY_ALT}
              expandLabel={`Inspect: ${SKY_ALT}`}
              onClick={handleClick}
            />
          </AgentChatArtifactMessage>
        </AgentChatMessages>
      </div>
      <aside
        aria-label="Inspector"
        className="flex w-[280px] flex-col gap-3 rounded-lg border bg-card p-4 text-sm"
      >
        <h3 className="font-semibold">Inspector</h3>
        {inspected ? (
          <>
            <img
              src={inspected}
              alt={SKY_ALT}
              className="w-full rounded-md border"
            />
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
              <dt className="text-muted-foreground">File</dt>
              <dd>milky-way.webp</dd>
              <dt className="text-muted-foreground">Size</dt>
              <dd>1920 × 1080</dd>
            </dl>
          </>
        ) : (
          <p className="text-muted-foreground">Nothing selected.</p>
        )}
      </aside>
    </div>
  );
}

/**
 * `onClick` runs before the fullscreen viewer opens. Calling
 * `event.preventDefault()` keeps the viewer closed, so the click can do
 * something else entirely — here, load the image into an inspector panel.
 * (`disableFullscreen` removes the viewer outright.)
 */
export const ImageWithCustomClick: StoryObj<typeof ImageCustomClickExample> = {
  render: (args): ReactElement => <ImageCustomClickExample {...args} />,
  args: {
    onInspect: fn(),
  },
};

/**
 * Interaction test for `ImageWithCustomClick`: `preventDefault()` in `onClick`
 * keeps the viewer closed and the click reaches the inspector instead. Kept
 * apart from the showcase so the inspector starts empty there.
 */
export const ImageCustomClickSkipsViewer: StoryObj<
  typeof ImageCustomClickExample
> = {
  ...ImageWithCustomClick,
  tags: ["!autodocs"],
  play: async ({ args, canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const inspector = canvas.getByRole("complementary", { name: "Inspector" });
    expect(inspector).toHaveTextContent("Nothing selected.");

    await userEvent.click(
      canvas.getByRole("button", { name: `Inspect: ${SKY_ALT}` }),
    );

    expect(args.onInspect).toHaveBeenCalledWith("sky-render");
    expect(within(inspector).getByRole("img", { name: SKY_ALT })).toBeVisible();
    expect(within(document.body).queryByRole("dialog")).toBeNull();
  },
};

interface MockScreenshot {
  id: string;
  label: string;
  width: number;
  height: number;
}

const RESPONSIVE_SCREENSHOTS: readonly MockScreenshot[] = [
  { id: "desktop", label: "Desktop", width: 1440, height: 900 },
  { id: "laptop", label: "Laptop", width: 1280, height: 800 },
  { id: "tablet", label: "Tablet", width: 834, height: 1112 },
  { id: "mobile", label: "Mobile", width: 390, height: 844 },
];

/** Draws a stand-in "screenshot" of a dashboard at the given size, as an SVG data URL. */
function mockScreenshotSrc({ label, width, height }: MockScreenshot): string {
  const headerHeight = 56;
  const sidebarWidth = width >= 1000 ? 220 : 0;
  const gap = 20;
  const columns = width >= 1000 ? 3 : width >= 700 ? 2 : 1;
  const mainWidth = width - sidebarWidth - gap * 2;
  const cardWidth = (mainWidth - gap * (columns - 1)) / columns;
  const cardHeight = 140;

  const cards: string[] = [];
  for (
    let y = headerHeight + gap;
    y + cardHeight <= height - gap;
    y += cardHeight + gap
  ) {
    for (let column = 0; column < columns; column++) {
      const x = sidebarWidth + gap + column * (cardWidth + gap);
      cards.push(
        `<rect x="${x}" y="${y}" width="${cardWidth}" height="${cardHeight}" rx="10" fill="#ffffff" stroke="#e2e8f0"/>`,
        `<rect x="${x + 16}" y="${y + 20}" width="${cardWidth * 0.4}" height="10" rx="5" fill="#cbd5e1"/>`,
        `<rect x="${x + 16}" y="${y + 44}" width="${cardWidth * 0.6}" height="24" rx="6" fill="#6366f1"/>`,
      );
    }
  }

  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" fill="#f1f5f9"/>`,
    `<rect width="${width}" height="${headerHeight}" fill="#0f172a"/>`,
    `<text x="${gap}" y="36" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="#f8fafc">${label} · ${width}×${height}</text>`,
    sidebarWidth > 0
      ? `<rect y="${headerHeight}" width="${sidebarWidth}" height="${height - headerHeight}" fill="#e2e8f0"/>`
      : "",
    ...cards,
    "</svg>",
  ].join("");
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function ScreenshotGridExample(): ReactElement {
  return (
    <div className="h-[560px] w-[560px] rounded-lg border bg-background">
      <AgentChatMessages>
        <AgentChatBubble key="ask" from="user">
          Can you check the dashboard at each breakpoint?
        </AgentChatBubble>
        <AgentChatBubble key="reply" from="assistant">
          Captured all four. The cards reflow cleanly; the sidebar collapses
          below 1000px as expected.
        </AgentChatBubble>
        <AgentChatArtifactMessage key="screenshots" layout="grid">
          {RESPONSIVE_SCREENSHOTS.map((shot) => (
            <AgentChatImage
              key={shot.id}
              src={mockScreenshotSrc(shot)}
              alt={`Dashboard screenshot at the ${shot.label.toLowerCase()} breakpoint`}
              aspectRatio="4 / 3"
              fit="contain"
              caption={`${shot.label} · ${shot.width} × ${shot.height}`}
            />
          ))}
        </AgentChatArtifactMessage>
      </AgentChatMessages>
    </div>
  );
}

/**
 * Several screenshots in one message, tiled with `layout="grid"`. Each image
 * gets the same `aspectRatio` so the tiles line up, with `fit="contain"` to
 * show every screenshot whole. Each opens fullscreen on click.
 */
export const ScreenshotGrid: StoryObj<typeof ScreenshotGridExample> = {
  render: (): ReactElement => <ScreenshotGridExample />,
};

/* -------------------------------------------------------------- */
/* Artifacts: files                                               */
/* -------------------------------------------------------------- */

/** Parses RFC 4180 CSV: quoted fields may hold commas, newlines and `""`. */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text.charAt(i);
    if (inQuotes) {
      if (char === '"' && text.charAt(i + 1) === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text.charAt(i + 1) === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const CSV_FILE_NAME = "q3-revenue-by-region.csv";
const CSV_CONTENT = [
  "region,orders,revenue_usd,avg_order_usd,growth_pct",
  "North America,1284,482910.50,376.10,12.4",
  "Europe,964,351220.00,364.34,8.1",
  "Asia Pacific,1102,398775.25,361.87,15.9",
  "Latin America,412,121004.80,293.70,4.3",
  '"Middle East, Africa",289,97340.10,336.82,-1.2',
].join("\n");
const CSV_HREF = `data:text/csv;charset=utf-8,${encodeURIComponent(CSV_CONTENT)}`;
const [CSV_HEADER = [], ...CSV_BODY] = parseCsv(CSV_CONTENT);
const CSV_SUMMARY = `CSV · ${CSV_BODY.length} rows · ${CSV_HEADER.length} columns`;

const isNumeric = (value: string): boolean => /^-?\d+(\.\d+)?$/.test(value);

interface CsvArtifactExampleProps {
  onOpenArtifact?: (fileName: string) => void;
}

function CsvArtifactExample({
  onOpenArtifact,
}: CsvArtifactExampleProps): ReactElement {
  const [open, setOpen] = useState(false);
  // The dialog has no DialogTrigger, so Radix has nowhere to return focus
  // when it closes. Remember the card that opened it instead.
  const openerRef = useRef<HTMLElement | null>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>): void => {
    openerRef.current = event.currentTarget;
    setOpen(true);
    onOpenArtifact?.(CSV_FILE_NAME);
  };

  return (
    <>
      <div className="h-[480px] w-[520px] rounded-lg border bg-background">
        <AgentChatMessages>
          <AgentChatBubble key="ask" from="user">
            Can you export Q3 revenue by region?
          </AgentChatBubble>
          <AgentChatBubble key="reply" from="assistant">
            Here you go — click the file to preview it.
          </AgentChatBubble>
          <AgentChatArtifactMessage key="export">
            <AgentChatArtifact
              title={CSV_FILE_NAME}
              description={CSV_SUMMARY}
              onClick={handleOpen}
              actions={
                <Button asChild variant="ghost" size="icon" className="size-8">
                  <a
                    href={CSV_HREF}
                    download={CSV_FILE_NAME}
                    aria-label={`Download ${CSV_FILE_NAME}`}
                  >
                    <Download className="size-4" />
                  </a>
                </Button>
              }
            />
          </AgentChatArtifactMessage>
        </AgentChatMessages>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="max-w-3xl"
          onCloseAutoFocus={(event): void => {
            event.preventDefault();
            openerRef.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet
                aria-hidden="true"
                className="size-5 text-lime-700 dark:text-lime-300"
              />
              {CSV_FILE_NAME}
            </DialogTitle>
            <DialogDescription>{CSV_SUMMARY}</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-background">
                <TableRow>
                  {CSV_HEADER.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {CSV_BODY.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row.map((value, columnIndex) => (
                      <TableCell
                        key={columnIndex}
                        className={
                          isNumeric(value) ? "text-right tabular-nums" : undefined
                        }
                      >
                        {value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button asChild variant="outline">
              <a href={CSV_HREF} download={CSV_FILE_NAME}>
                <Download className="mr-2 size-4" />
                Download CSV
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * A file the agent produced, as an `AgentChatArtifact` card. Its kind — and so
 * the spreadsheet icon — is inferred from the `.csv` file name. Clicking the
 * card runs `onClick`, which here opens the CSV as a table in a dialog; the
 * download button in `actions` sits above the card's click target.
 */
export const CsvInDialog: StoryObj<typeof CsvArtifactExample> = {
  render: (args): ReactElement => <CsvArtifactExample {...args} />,
  args: {
    onOpenArtifact: fn(),
  },
};

/**
 * Interaction test for `CsvInDialog`: clicking the card opens the parsed CSV
 * as a table, and closing the dialog returns focus to the card. Kept apart
 * from the showcase so the dialog doesn't open on load there.
 */
export const CsvArtifactOpensTable: StoryObj<
  typeof CsvArtifactExample
> = {
  ...CsvInDialog,
  tags: ["!autodocs"],
  play: async ({ args, canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const card = canvas.getByRole("button", { name: CSV_FILE_NAME });
    expect(card).toHaveAccessibleDescription(CSV_SUMMARY);

    await userEvent.click(card);
    expect(args.onOpenArtifact).toHaveBeenCalledWith(CSV_FILE_NAME);

    const dialog = await body.findByRole("dialog", { name: CSV_FILE_NAME });
    const table = within(dialog).getByRole("table");
    expect(
      within(table)
        .getAllByRole("columnheader")
        .map((cell) => cell.textContent),
    ).toEqual(["region", "orders", "revenue_usd", "avg_order_usd", "growth_pct"]);
    // Header row plus one row per record.
    expect(within(table).getAllByRole("row")).toHaveLength(6);
    // The quoted field kept its comma.
    expect(
      within(table).getByRole("cell", { name: "Middle East, Africa" }),
    ).toBeInTheDocument();

    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }));
    await waitFor(() => expect(body.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(card).toHaveFocus());
  },
};
