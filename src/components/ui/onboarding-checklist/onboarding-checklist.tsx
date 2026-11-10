"use client";

import {
  useCallback,
  useId,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, PartyPopper, X } from "lucide-react";

import { AnimatePresence, m, useReducedMotion } from "@/framer-motion";
import { cn } from "@/lib/utils";
import { CircularProgress } from "@/components/ui/circular-progress";

export const onboardingChecklistVariantIds = [
  "card",
  "plain",
  "accent",
] as const;
export type OnboardingChecklistVariantId =
  (typeof onboardingChecklistVariantIds)[number];

export const onboardingChecklistColorIds = [
  "default",
  "positive",
  "warning",
] as const;
export type OnboardingChecklistColorId =
  (typeof onboardingChecklistColorIds)[number];

export const onboardingChecklistVariants = cva("w-full text-foreground", {
  variants: {
    variant: {
      card: "rounded-lg border bg-card text-card-foreground shadow-sm",
      plain: "",
      accent:
        "rounded-lg border border-schemavaults-brand-blue/40 bg-schemavaults-brand-blue/5 shadow-sm",
    } satisfies Record<OnboardingChecklistVariantId, string>,
  },
  defaultVariants: {
    variant: "card",
  },
});

/** Colours of the "done" check bubble for completed items. */
const checkBubbleColorVariants = cva(
  "flex size-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200",
  {
    variants: {
      color: {
        default:
          "data-[completed=true]:border-schemavaults-brand-blue data-[completed=true]:bg-schemavaults-brand-blue",
        positive:
          "data-[completed=true]:border-emerald-500 data-[completed=true]:bg-emerald-500 dark:data-[completed=true]:border-emerald-400 dark:data-[completed=true]:bg-emerald-400",
        warning:
          "data-[completed=true]:border-warning data-[completed=true]:bg-warning",
      } satisfies Record<OnboardingChecklistColorId, string>,
    },
    defaultVariants: { color: "default" },
  },
);

export interface OnboardingChecklistItem {
  /** Stable identifier for the step. */
  id: string;
  /** Short, imperative title, e.g. "Create your first vault". */
  title: ReactNode;
  /** Longer explanation shown when the step is expanded. */
  description?: ReactNode;
  /** Whether this step has been completed. */
  completed: boolean;
  /**
   * Call-to-action rendered under the description when the step is expanded
   * (typically a `<Button size="sm">`). Hidden once the step is completed.
   */
  action?: ReactNode;
  /** Marks the step as optional; it still counts towards progress. */
  optional?: boolean;
  /** Optional leading icon shown next to the title. */
  icon?: ReactNode;
}

export interface OnboardingChecklistProps
  extends Omit<HTMLAttributes<HTMLElement>, "title" | "color">,
    VariantProps<typeof onboardingChecklistVariants> {
  /** Heading for the checklist. */
  title: ReactNode;
  /** Optional supporting text below the heading. */
  description?: ReactNode;
  /** The steps, in the order the user should complete them. */
  items: OnboardingChecklistItem[];
  /** Accent colour for the progress ring and completed check bubbles. */
  color?: OnboardingChecklistColorId;
  /**
   * When set, each step's check bubble becomes a toggle button that calls
   * this with the step's new completed state (handy for "mark as done").
   * Without it the bubbles are read-only status indicators.
   */
  onItemCompletedChange?: (id: string, completed: boolean) => void;
  /** Controlled id of the expanded step (`null` collapses all steps). */
  expandedItemId?: string | null;
  /** Called when the user expands/collapses a step. */
  onExpandedItemIdChange?: (id: string | null) => void;
  /** Allow the whole list to be collapsed down to its header. */
  collapsible?: boolean;
  /** Initial collapsed state when `collapsible` is set. */
  defaultCollapsed?: boolean;
  /** When provided, renders a dismiss (×) button in the header. */
  onDismiss?: () => void;
  /** Accessible label for the dismiss button. */
  dismissLabel?: string;
  /**
   * Content shown in place of the step list once every step is complete.
   * Pass `null` to keep showing the (all-checked) list instead.
   */
  completedContent?: ReactNode;
}

function firstIncompleteId(items: OnboardingChecklistItem[]): string | null {
  return items.find((item) => !item.completed)?.id ?? null;
}

function DefaultCompletedContent(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
      <PartyPopper
        className="size-8 text-schemavaults-brand-blue"
        aria-hidden="true"
      />
      <p className="font-medium">You&apos;re all set!</p>
      <p className="text-sm text-muted-foreground">
        Every step is complete. You can dismiss this checklist.
      </p>
    </div>
  );
}

/**
 * A "getting started" checklist for onboarding flows: a heading with a
 * progress ring and "2 of 5 complete" summary, followed by an accordion of
 * steps. The first incomplete step is expanded by default so its description
 * and call-to-action are front and centre; completed steps are struck through.
 */
export function OnboardingChecklist({
  title,
  description,
  items,
  variant,
  color = "default",
  onItemCompletedChange,
  expandedItemId: expandedItemIdProp,
  onExpandedItemIdChange,
  collapsible = false,
  defaultCollapsed = false,
  onDismiss,
  dismissLabel = "Dismiss checklist",
  completedContent,
  className,
  ...props
}: OnboardingChecklistProps): ReactElement {
  const baseId: string = useId();
  const headingId = `${baseId}-heading`;
  const listId = `${baseId}-list`;
  const reduceMotion: boolean | null = useReducedMotion();

  const total: number = items.length;
  const completedCount: number = useMemo(
    () => items.filter((item) => item.completed).length,
    [items],
  );
  const allComplete: boolean = total > 0 && completedCount === total;
  const percent: number = total === 0 ? 0 : (completedCount / total) * 100;

  // Uncontrolled expansion: `undefined` means "follow the first incomplete
  // step", so the checklist advances on its own as steps get completed.
  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<
    string | null | undefined
  >(undefined);
  const isControlled: boolean = expandedItemIdProp !== undefined;
  const expandedItemId: string | null = isControlled
    ? (expandedItemIdProp ?? null)
    : uncontrolledExpanded === undefined ||
        items.find((i) => i.id === uncontrolledExpanded)?.completed
      ? firstIncompleteId(items)
      : uncontrolledExpanded;

  const setExpanded = useCallback(
    (id: string | null): void => {
      if (!isControlled) setUncontrolledExpanded(id);
      onExpandedItemIdChange?.(id);
    },
    [isControlled, onExpandedItemIdChange],
  );

  const [collapsed, setCollapsed] = useState<boolean>(
    collapsible && defaultCollapsed,
  );
  const listVisible: boolean = !collapsible || !collapsed;

  const showCompletedContent: boolean =
    allComplete && completedContent !== null;

  const duration: number = reduceMotion ? 0 : 0.2;

  return (
    <section
      aria-labelledby={headingId}
      data-complete={allComplete || undefined}
      className={cn(onboardingChecklistVariants({ variant }), className)}
      {...props}
    >
      <header className="flex items-start gap-3 p-4">
        <CircularProgress
          size="sm"
          value={percent}
          label={`${completedCount} of ${total} steps complete`}
          color={color}
          showValue={false}
        >
          <span className="text-[0.65rem] font-semibold tabular-nums">
            {completedCount}/{total}
          </span>
        </CircularProgress>
        <div className="min-w-0 flex-1">
          <h3 id={headingId} className="font-semibold leading-tight">
            {title}
          </h3>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          ) : null}
          <p
            className="mt-1 text-xs text-muted-foreground tabular-nums"
            aria-live="polite"
          >
            {completedCount} of {total} complete
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {collapsible ? (
            <button
              type="button"
              aria-expanded={listVisible}
              aria-controls={listId}
              aria-label={listVisible ? "Collapse checklist" : "Expand checklist"}
              onClick={() => setCollapsed((c) => !c)}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ChevronDown
                className={cn(
                  "size-4 transition-transform duration-200",
                  listVisible && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>
          ) : null}
          {onDismiss ? (
            <button
              type="button"
              aria-label={dismissLabel}
              onClick={onDismiss}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </header>

      <AnimatePresence initial={false}>
        {listVisible ? (
          <m.div
            key="list"
            id={listId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration }}
            className="overflow-hidden"
          >
            {showCompletedContent ? (
              <div className="border-t">
                {completedContent ?? <DefaultCompletedContent />}
              </div>
            ) : (
              <ol className="border-t">
                {items.map((item, index) => (
                  <OnboardingChecklistStep
                    key={item.id}
                    item={item}
                    index={index}
                    baseId={baseId}
                    color={color}
                    expanded={expandedItemId === item.id}
                    duration={duration}
                    onToggleExpanded={() =>
                      setExpanded(expandedItemId === item.id ? null : item.id)
                    }
                    onCompletedChange={onItemCompletedChange}
                  />
                ))}
              </ol>
            )}
          </m.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

OnboardingChecklist.displayName = "OnboardingChecklist";

interface OnboardingChecklistStepProps {
  item: OnboardingChecklistItem;
  index: number;
  baseId: string;
  color: OnboardingChecklistColorId;
  expanded: boolean;
  duration: number;
  onToggleExpanded: () => void;
  onCompletedChange?: (id: string, completed: boolean) => void;
}

function OnboardingChecklistStep({
  item,
  index,
  baseId,
  color,
  expanded,
  duration,
  onToggleExpanded,
  onCompletedChange,
}: OnboardingChecklistStepProps): ReactElement {
  const panelId = `${baseId}-step-${index}-panel`;
  const triggerId = `${baseId}-step-${index}-trigger`;
  const hasPanel: boolean =
    Boolean(item.description) || (Boolean(item.action) && !item.completed);

  const bubbleClassName: string = cn(
    checkBubbleColorVariants({ color }),
    !item.completed && "border-muted-foreground/40",
  );
  const bubbleContent: ReactElement = (
    <AnimatePresence initial={false}>
      {item.completed ? (
        <m.span
          key="check"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ duration }}
          className="flex"
        >
          <Check className="size-3.5 text-white" strokeWidth={3} aria-hidden="true" />
        </m.span>
      ) : null}
    </AnimatePresence>
  );

  return (
    <li
      data-completed={item.completed}
      data-expanded={expanded}
      className="border-b last:border-b-0 data-[expanded=true]:bg-muted/40"
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {onCompletedChange ? (
          <button
            type="button"
            role="checkbox"
            aria-checked={item.completed}
            aria-labelledby={triggerId}
            data-completed={item.completed}
            onClick={() => onCompletedChange(item.id, !item.completed)}
            className={cn(
              bubbleClassName,
              "hover:border-schemavaults-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            {bubbleContent}
          </button>
        ) : (
          <span
            data-completed={item.completed}
            className={bubbleClassName}
            aria-hidden="true"
          >
            {bubbleContent}
          </span>
        )}

        <button
          type="button"
          id={triggerId}
          aria-expanded={hasPanel ? expanded : undefined}
          aria-controls={hasPanel ? panelId : undefined}
          disabled={!hasPanel}
          onClick={onToggleExpanded}
          className="flex min-w-0 flex-1 items-center gap-2 rounded-sm text-left text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default"
        >
          {item.icon ? (
            <span className="shrink-0 text-muted-foreground [&_svg]:size-4" aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
          <span
            className={cn(
              "min-w-0 flex-1 truncate",
              item.completed && "text-muted-foreground line-through",
            )}
          >
            {item.title}
            {onCompletedChange ? null : (
              <span className="sr-only">
                {item.completed ? " (completed)" : " (not completed)"}
              </span>
            )}
          </span>
          {item.optional ? (
            <span className="shrink-0 rounded-full border px-2 py-0.5 text-[0.65rem] font-normal uppercase tracking-wide text-muted-foreground">
              Optional
            </span>
          ) : null}
          {hasPanel ? (
            <ChevronDown
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
                expanded && "rotate-180",
              )}
              aria-hidden="true"
            />
          ) : null}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {hasPanel && expanded ? (
          <m.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={triggerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration }}
            className="overflow-hidden"
          >
            <div className="space-y-3 pb-4 pl-[3.25rem] pr-4">
              {item.description ? (
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
              ) : null}
              {item.action && !item.completed ? <div>{item.action}</div> : null}
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
