import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import {
  type ReactElement,
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  AgentChatMessages,
  AgentChatBubble,
  AgentTypingIndicator,
  AgentChatAnnouncement,
  AgentChatHILMessage,
  agentChatMessagesSpacingIds,
  type AgentChatMessagesSpacingId,
} from "./agent-chat-messages";
import { Avatar, AvatarFallback } from "../avatar/avatar";
import { Button } from "../button/button";

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
  title: "Components/AgentChatMessages",
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
