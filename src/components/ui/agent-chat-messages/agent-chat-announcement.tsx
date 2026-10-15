"use client";

import type { ReactElement, ReactNode, Ref } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AlertOctagon, AlertTriangle, Info } from "lucide-react";
import { m } from "@/framer-motion";

import { cn } from "@/lib/utils";
import {
  type MotionDivAttributes,
  useMessageMotionProps,
} from "./agent-chat-motion";

export const agentChatAnnouncementVariantIds = [
  "default",
  "info",
  "warning",
  "destructive",
] as const satisfies readonly string[];
export type AgentChatAnnouncementVariantId =
  (typeof agentChatAnnouncementVariantIds)[number];

const agentChatAnnouncementVariants = cva(
  "mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium [&>svg]:size-3.5 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border bg-muted/60 text-muted-foreground",
        info: "border-primary/20 bg-primary/10 text-primary [&>svg]:text-primary",
        warning:
          "border-warning/30 bg-warning/10 text-warning [&>svg]:text-warning",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive [&>svg]:text-destructive",
      } satisfies Record<AgentChatAnnouncementVariantId, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const announcementDefaultIcons: Record<
  AgentChatAnnouncementVariantId,
  ReactElement | null
> = {
  default: null,
  info: <Info />,
  warning: <AlertTriangle />,
  destructive: <AlertOctagon />,
};

export interface AgentChatAnnouncementProps
  extends MotionDivAttributes,
    VariantProps<typeof agentChatAnnouncementVariants> {
  /** Override the default icon. Pass `null` to hide the icon. */
  icon?: ReactNode | null;
  ref?: Ref<HTMLDivElement>;
}

function AgentChatAnnouncement({
  className,
  variant = "default",
  icon,
  children,
  ref,
  ...props
}: AgentChatAnnouncementProps): ReactElement {
  const motionProps = useMessageMotionProps();
  const resolvedIcon =
    icon === null
      ? null
      : icon ?? announcementDefaultIcons[variant ?? "default"];

  return (
    <m.div
      ref={ref}
      data-slot="agent-chat-announcement"
      role="status"
      className={cn("flex w-full justify-center", className)}
      {...motionProps}
    >
      <div className={cn(agentChatAnnouncementVariants({ variant }))} {...props}>
        {resolvedIcon}
        <span>{children}</span>
      </div>
    </m.div>
  );
}
AgentChatAnnouncement.displayName = "AgentChatAnnouncement";

export { AgentChatAnnouncement };
