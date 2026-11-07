import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { useState, type ReactElement } from "react";
import { KeyRound, Mail, Users, Vault, Webhook } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LazyFramerMotionProvider } from "@/providers/lazy_framer";
import {
  OnboardingChecklist,
  onboardingChecklistColorIds,
  onboardingChecklistVariantIds,
  type OnboardingChecklistItem,
  type OnboardingChecklistProps,
} from "./onboarding-checklist";

function buildItems(completedIds: string[]): OnboardingChecklistItem[] {
  const done = (id: string): boolean => completedIds.includes(id);
  return [
    {
      id: "verify-email",
      title: "Verify your email address",
      description: "We sent a confirmation link to your inbox.",
      icon: <Mail />,
      completed: done("verify-email"),
      action: (
        <Button size="sm" variant="outline">
          Resend email
        </Button>
      ),
    },
    {
      id: "create-vault",
      title: "Create your first vault",
      description:
        "Vaults hold your schemas and secrets. Start with one per environment.",
      icon: <Vault />,
      completed: done("create-vault"),
      action: <Button size="sm">Create vault</Button>,
    },
    {
      id: "api-key",
      title: "Generate an API key",
      description: "Use an API key to read schemas from your CI pipeline.",
      icon: <KeyRound />,
      completed: done("api-key"),
      action: <Button size="sm">Generate key</Button>,
    },
    {
      id: "invite",
      title: "Invite your team",
      description: "Collaborators can review and approve schema changes.",
      icon: <Users />,
      completed: done("invite"),
      action: (
        <Button size="sm" variant="secondary">
          Invite teammates
        </Button>
      ),
    },
    {
      id: "webhook",
      title: "Connect a webhook",
      description: "Get notified whenever a schema version is published.",
      icon: <Webhook />,
      optional: true,
      completed: done("webhook"),
      action: (
        <Button size="sm" variant="ghost">
          Add webhook
        </Button>
      ),
    },
  ];
}

const meta = {
  title: "Feedback/OnboardingChecklist",
  component: OnboardingChecklist,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A \"getting started\" checklist for onboarding flows. The header pairs a [CircularProgress](?path=/docs/charts-graphs-circularprogress--docs) ring with an \"N of M complete\" summary, and the steps below form an accordion: the first incomplete step is expanded automatically so its description and call-to-action are front and centre, and the list advances on its own as steps are completed.\n\nPass `onItemCompletedChange` to turn each step's check bubble into a toggle (`role=\"checkbox\"`); without it the bubbles are read-only. Supports `collapsible`, a dismiss button via `onDismiss`, custom `completedContent` once every step is done, three variants (`card`, `plain`, `accent`) and three accent colours (`default`, `positive`, `warning`).",
      },
    },
  },
  tags: ["autodocs"],
  decorators: [
    (Story): ReactElement => (
      <LazyFramerMotionProvider>
        <div className="w-[26rem] max-w-[calc(100vw-2rem)]">
          <Story />
        </div>
      </LazyFramerMotionProvider>
    ),
  ],
  argTypes: {
    variant: { options: onboardingChecklistVariantIds, control: { type: "radio" } },
    color: { options: onboardingChecklistColorIds, control: { type: "radio" } },
    collapsible: { control: { type: "boolean" } },
  },
  args: {
    title: "Get started with SchemaVaults",
    description: "Finish these steps to get the most out of your workspace.",
    items: buildItems(["verify-email", "create-vault"]),
    variant: "card",
    color: "default",
  },
} satisfies Meta<typeof OnboardingChecklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("progress reflects completed steps", async () => {
      await expect(
        canvas.getByRole("progressbar", { name: "2 of 5 steps complete" }),
      ).toBeInTheDocument();
      await expect(canvas.getByText("2 of 5 complete")).toBeInTheDocument();
    });
    await step("first incomplete step is expanded", async () => {
      const trigger = canvas.getByRole("button", { name: /Generate an API key/ });
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await expect(
        canvas.getByRole("button", { name: "Generate key" }),
      ).toBeVisible();
    });
    await step("clicking another step expands it instead", async () => {
      const invite = canvas.getByRole("button", { name: /Invite your team/ });
      await userEvent.click(invite);
      await expect(invite).toHaveAttribute("aria-expanded", "true");
      await expect(
        canvas.getByRole("button", { name: /Generate an API key/ }),
      ).toHaveAttribute("aria-expanded", "false");
    });
  },
};

function InteractiveChecklist(
  props: Partial<OnboardingChecklistProps>,
): ReactElement {
  const [completed, setCompleted] = useState<string[]>(["verify-email"]);
  const [dismissed, setDismissed] = useState<boolean>(false);
  if (dismissed) {
    return (
      <Button variant="outline" onClick={() => setDismissed(false)}>
        Show checklist again
      </Button>
    );
  }
  return (
    <OnboardingChecklist
      title="Get started with SchemaVaults"
      description="Tick a step off to watch the checklist advance."
      {...props}
      items={buildItems(completed)}
      onItemCompletedChange={(id, isDone) =>
        setCompleted((prev) =>
          isDone ? [...prev, id] : prev.filter((x) => x !== id),
        )
      }
      onDismiss={() => setDismissed(true)}
    />
  );
}

export const Interactive: Story = {
  render: (args) => <InteractiveChecklist variant={args.variant} color={args.color} />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step("ticking the expanded step advances to the next one", async () => {
      const checkbox = canvas.getByRole("checkbox", { name: /Create your first vault/ });
      await expect(checkbox).toHaveAttribute("aria-checked", "false");
      await userEvent.click(checkbox);
      await expect(checkbox).toHaveAttribute("aria-checked", "true");
      await expect(canvas.getByText("2 of 5 complete")).toBeInTheDocument();
      await expect(
        canvas.getByRole("button", { name: /Generate an API key/ }),
      ).toHaveAttribute("aria-expanded", "true");
    });
    await step("completing every step shows the completed content", async () => {
      for (const name of [/Generate an API key/, /Invite your team/, /Connect a webhook/]) {
        await userEvent.click(canvas.getByRole("checkbox", { name }));
      }
      await expect(await canvas.findByText("You're all set!")).toBeInTheDocument();
    });
    await step("dismiss hides the checklist", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Dismiss checklist" }));
      await expect(
        canvas.getByRole("button", { name: "Show checklist again" }),
      ).toBeInTheDocument();
    });
  },
};

export const Collapsible: Story = {
  args: { collapsible: true, defaultCollapsed: true, onDismiss: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("list")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Expand checklist" }));
    await expect(await canvas.findByRole("list")).toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss checklist" }));
    await expect(args.onDismiss).toHaveBeenCalledOnce();
  },
};

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {onboardingChecklistVariantIds.map((variant) => (
        <OnboardingChecklist
          key={variant}
          {...args}
          variant={variant}
          title={`variant="${variant}"`}
          expandedItemId={null}
        />
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {onboardingChecklistColorIds.map((color) => (
        <OnboardingChecklist
          key={color}
          {...args}
          color={color}
          title={`color="${color}"`}
          items={buildItems(["verify-email", "create-vault", "api-key"])}
          expandedItemId={null}
        />
      ))}
    </div>
  ),
};

export const AllComplete: Story = {
  args: {
    items: buildItems(["verify-email", "create-vault", "api-key", "invite", "webhook"]),
    color: "positive",
    onDismiss: fn(),
  },
};

export const AllCompleteShowingList: Story = {
  name: "All Complete (list kept)",
  args: {
    items: buildItems(["verify-email", "create-vault", "api-key", "invite", "webhook"]),
    completedContent: null,
  },
};

export const ReducedMotion: Story = {
  parameters: { emulateReducedMotion: true },
  render: (args) => <InteractiveChecklist variant={args.variant} color={args.color} />,
};
