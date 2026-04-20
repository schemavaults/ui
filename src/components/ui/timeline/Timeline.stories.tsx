import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement, ReactNode } from "react";
import {
  AlertTriangle,
  Check,
  GitCommit,
  KeyRound,
  RefreshCw,
  ShieldAlert,
  UserPlus,
  XCircle,
} from "lucide-react";

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  timelineSizeIds,
  timelineVariantIds,
  type TimelineSizeId,
  type TimelineVariantId,
} from "./timeline";

interface TimelineEntry {
  variant: TimelineVariantId;
  title: string;
  time: string;
  dateTime: string;
  description?: string;
  icon?: ReactNode;
}

interface TimelineDemoProps {
  size?: TimelineSizeId;
  filled?: boolean;
  entries?: TimelineEntry[];
}

const defaultEntries: TimelineEntry[] = [
  {
    variant: "primary",
    title: "Vault created",
    time: "Apr 19 · 09:14",
    dateTime: "2026-04-19T09:14:00Z",
    description:
      "You created the `acme-production` vault and set the default encryption algorithm to AES-256-GCM.",
    icon: <KeyRound />,
  },
  {
    variant: "default",
    title: "Invited 3 team members",
    time: "Apr 19 · 10:02",
    dateTime: "2026-04-19T10:02:00Z",
    description:
      "jordan@acme.co, priya@acme.co, and sam@acme.co were invited as Vault Editors.",
    icon: <UserPlus />,
  },
  {
    variant: "warning",
    title: "Signing key rotated",
    time: "Apr 19 · 12:36",
    dateTime: "2026-04-19T12:36:00Z",
    description:
      "The vault signing key was automatically rotated. Old signatures remain valid until Jul 18, 2026.",
    icon: <RefreshCw />,
  },
  {
    variant: "destructive",
    title: "Suspicious sign-in blocked",
    time: "Apr 19 · 13:10",
    dateTime: "2026-04-19T13:10:00Z",
    description:
      "A sign-in attempt from an unrecognised device in São Paulo, BR was blocked by device policy.",
    icon: <ShieldAlert />,
  },
  {
    variant: "muted",
    title: "Nightly backup completed",
    time: "Apr 19 · 23:58",
    dateTime: "2026-04-19T23:58:00Z",
    description:
      "Encrypted snapshot uploaded to replicated object storage. Duration 42s, 18.3 MB.",
    icon: <Check />,
  },
];

function TimelineDemo({
  size = "md",
  filled = true,
  entries = defaultEntries,
}: TimelineDemoProps): ReactElement {
  return (
    <Timeline className="max-w-xl">
      {entries.map((entry, index): ReactElement => {
        const isLast = index === entries.length - 1;
        return (
          <TimelineItem
            key={`${entry.dateTime}-${entry.title}`}
            size={size}
          >
            <TimelineIndicator size={size}>
              <TimelineDot
                variant={entry.variant}
                size={size}
                filled={filled}
              >
                {entry.icon}
              </TimelineDot>
              {isLast ? null : <TimelineConnector variant={entry.variant} />}
            </TimelineIndicator>
            <TimelineContent>
              <TimelineHeader>
                <TimelineTitle>{entry.title}</TimelineTitle>
                <TimelineTime dateTime={entry.dateTime}>
                  {entry.time}
                </TimelineTime>
              </TimelineHeader>
              {entry.description ? (
                <TimelineDescription>{entry.description}</TimelineDescription>
              ) : null}
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
}

const meta = {
  title: "Components/Timeline",
  component: TimelineDemo,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      options: timelineSizeIds,
      control: { type: "radio" },
    },
    filled: {
      control: { type: "boolean" },
    },
  },
  args: {
    size: "md",
    filled: true,
  },
} satisfies Meta<typeof TimelineDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const OutlineDots: Story = {
  args: {
    filled: false,
  },
};

export const AllVariants: Story = {
  args: {
    entries: timelineVariantIds.map(
      (variant): TimelineEntry => ({
        variant,
        title: `${variant.charAt(0).toUpperCase()}${variant.slice(1)} event`,
        time: "Just now",
        dateTime: "2026-04-19T12:00:00Z",
        description: `Sample description rendered with the "${variant}" variant so you can preview the dot and connector color.`,
        icon: <GitCommit />,
      }),
    ),
  },
};

function DeploymentTimeline(): ReactElement {
  return (
    <Timeline className="max-w-xl">
      <TimelineItem>
        <TimelineIndicator>
          <TimelineDot variant="primary">
            <Check />
          </TimelineDot>
          <TimelineConnector variant="primary" />
        </TimelineIndicator>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Build succeeded</TimelineTitle>
            <TimelineTime dateTime="2026-04-19T08:00:00Z">
              2m 14s
            </TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            Pipeline #1284 compiled the package and produced 3 artifacts.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineIndicator>
          <TimelineDot variant="primary">
            <Check />
          </TimelineDot>
          <TimelineConnector variant="warning" />
        </TimelineIndicator>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Tests passed</TimelineTitle>
            <TimelineTime dateTime="2026-04-19T08:03:00Z">
              1m 48s
            </TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            412 unit tests and 38 integration tests passed on node 22.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineIndicator>
          <TimelineDot variant="warning" filled={false}>
            <AlertTriangle />
          </TimelineDot>
          <TimelineConnector variant="muted" />
        </TimelineIndicator>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Deploy awaiting approval</TimelineTitle>
            <TimelineTime dateTime="2026-04-19T08:05:00Z">
              Waiting
            </TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            Manual approval from a Release Captain is required before staging
            can roll forward to production.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineIndicator>
          <TimelineDot variant="muted" filled={false} />
        </TimelineIndicator>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Promote to production</TimelineTitle>
            <TimelineTime>Pending</TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            Will run once the previous step is approved.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}

export const DeploymentPipeline: StoryObj = {
  render: (): ReactElement => <DeploymentTimeline />,
};

function IncidentTimeline(): ReactElement {
  return (
    <Timeline className="max-w-xl">
      <TimelineItem>
        <TimelineIndicator>
          <TimelineDot variant="destructive">
            <XCircle />
          </TimelineDot>
          <TimelineConnector variant="destructive" />
        </TimelineIndicator>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Incident detected</TimelineTitle>
            <TimelineTime dateTime="2026-04-19T14:02:00Z">
              14:02 UTC
            </TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            Error rate on `vault.read` spiked above 5% for 3 consecutive
            minutes.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineIndicator>
          <TimelineDot variant="warning">
            <AlertTriangle />
          </TimelineDot>
          <TimelineConnector variant="warning" />
        </TimelineIndicator>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Investigating</TimelineTitle>
            <TimelineTime dateTime="2026-04-19T14:09:00Z">
              14:09 UTC
            </TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            On-call engineer acknowledged the page and began investigating a
            recent deploy as the probable cause.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>

      <TimelineItem>
        <TimelineIndicator>
          <TimelineDot variant="primary">
            <Check />
          </TimelineDot>
        </TimelineIndicator>
        <TimelineContent>
          <TimelineHeader>
            <TimelineTitle>Resolved</TimelineTitle>
            <TimelineTime dateTime="2026-04-19T14:24:00Z">
              14:24 UTC
            </TimelineTime>
          </TimelineHeader>
          <TimelineDescription>
            Rolled back to release `v2.38.1`. Error rate returned to baseline
            within 90 seconds.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  );
}

export const IncidentReport: StoryObj = {
  render: (): ReactElement => <IncidentTimeline />,
};
