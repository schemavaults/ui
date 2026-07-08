import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "storybook/test";
import {
  ArrowUpToLine,
  Copy,
  FileText,
  GitBranch,
  Save,
  Send,
  Trash2,
} from "lucide-react";
import type { ReactElement } from "react";

import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import {
  SplitButton,
  SplitButtonAction,
  SplitButtonContent,
  SplitButtonTrigger,
} from "./split-button";
import {
  splitButtonSizeIds,
  splitButtonVariantIds,
} from "./split-button-variants";

const meta = {
  title: "Components/SplitButton",
  component: SplitButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: splitButtonVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: splitButtonSizeIds,
      control: { type: "radio" },
    },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    variant: "default",
    size: "default",
    disabled: false,
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The canonical SplitButton pattern: a primary action (Save) paired with a
 * dropdown of related, secondary actions.
 */
export const Default: Story = {
  render: (args): ReactElement => (
    <SplitButton {...args}>
      <SplitButtonAction onClick={fn()}>
        <Save aria-hidden="true" className="mr-2 h-4 w-4" />
        Save
      </SplitButtonAction>
      <SplitButtonTrigger />
      <SplitButtonContent>
        <DropdownMenuLabel>Save options</DropdownMenuLabel>
        <DropdownMenuItem onClick={fn()}>
          <FileText aria-hidden="true" className="mr-2 h-4 w-4" />
          Save as draft
          <DropdownMenuShortcut>&#8984;D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={fn()}>
          <Copy aria-hidden="true" className="mr-2 h-4 w-4" />
          Save as template
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={fn()}>
          <GitBranch aria-hidden="true" className="mr-2 h-4 w-4" />
          Save and open in new branch
        </DropdownMenuItem>
      </SplitButtonContent>
    </SplitButton>
  ),
};

export const Destructive: Story = {
  args: { variant: "destructive" },
  render: (args): ReactElement => (
    <SplitButton {...args}>
      <SplitButtonAction onClick={fn()}>
        <Trash2 aria-hidden="true" className="mr-2 h-4 w-4" />
        Delete vault
      </SplitButtonAction>
      <SplitButtonTrigger aria-label="More delete options" />
      <SplitButtonContent>
        <DropdownMenuItem onClick={fn()}>
          Delete and archive
        </DropdownMenuItem>
        <DropdownMenuItem onClick={fn()}>
          Delete and export contents
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={fn()} className="text-destructive">
          Permanently delete now
        </DropdownMenuItem>
      </SplitButtonContent>
    </SplitButton>
  ),
};

export const Outline: Story = {
  args: { variant: "outline" },
  render: (args): ReactElement => (
    <SplitButton {...args}>
      <SplitButtonAction onClick={fn()}>
        <ArrowUpToLine aria-hidden="true" className="mr-2 h-4 w-4" />
        Publish
      </SplitButtonAction>
      <SplitButtonTrigger />
      <SplitButtonContent>
        <DropdownMenuItem onClick={fn()}>Publish to staging</DropdownMenuItem>
        <DropdownMenuItem onClick={fn()}>Publish to preview</DropdownMenuItem>
        <DropdownMenuItem onClick={fn()}>Schedule publish&hellip;</DropdownMenuItem>
      </SplitButtonContent>
    </SplitButton>
  ),
};

export const Secondary: Story = {
  args: { variant: "secondary" },
  render: (args): ReactElement => (
    <SplitButton {...args}>
      <SplitButtonAction onClick={fn()}>Run query</SplitButtonAction>
      <SplitButtonTrigger />
      <SplitButtonContent>
        <DropdownMenuItem onClick={fn()}>Run with sample data</DropdownMenuItem>
        <DropdownMenuItem onClick={fn()}>Run with cache off</DropdownMenuItem>
        <DropdownMenuItem onClick={fn()}>Explain query plan</DropdownMenuItem>
      </SplitButtonContent>
    </SplitButton>
  ),
};

export const Ghost: Story = {
  args: { variant: "ghost" },
  render: (args): ReactElement => (
    <SplitButton {...args}>
      <SplitButtonAction onClick={fn()}>Share</SplitButtonAction>
      <SplitButtonTrigger />
      <SplitButtonContent>
        <DropdownMenuItem onClick={fn()}>Copy shareable link</DropdownMenuItem>
        <DropdownMenuItem onClick={fn()}>Invite by email&hellip;</DropdownMenuItem>
        <DropdownMenuItem onClick={fn()}>Generate embed code</DropdownMenuItem>
      </SplitButtonContent>
    </SplitButton>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args): ReactElement => (
    <SplitButton {...args}>
      <SplitButtonAction>Deploy</SplitButtonAction>
      <SplitButtonTrigger />
      <SplitButtonContent>
        <DropdownMenuItem>Deploy to staging</DropdownMenuItem>
        <DropdownMenuItem>Deploy to production</DropdownMenuItem>
      </SplitButtonContent>
    </SplitButton>
  ),
};

/**
 * All variants stacked so a reviewer can eyeball colour and divider treatment
 * side-by-side.
 */
export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-4 p-4">
      {splitButtonVariantIds.map((variant) => (
        <div key={variant} className="flex items-center gap-4">
          <span className="w-24 text-sm text-muted-foreground capitalize">
            {variant}
          </span>
          <SplitButton variant={variant}>
            <SplitButtonAction onClick={fn()}>
              <Send aria-hidden="true" className="mr-2 h-4 w-4" />
              Send
            </SplitButtonAction>
            <SplitButtonTrigger />
            <SplitButtonContent>
              <DropdownMenuItem onClick={fn()}>Send now</DropdownMenuItem>
              <DropdownMenuItem onClick={fn()}>Schedule&hellip;</DropdownMenuItem>
              <DropdownMenuItem onClick={fn()}>Save draft</DropdownMenuItem>
            </SplitButtonContent>
          </SplitButton>
        </div>
      ))}
    </div>
  ),
};

/**
 * All sizes side-by-side so vertical rhythm and chevron scaling are easy to
 * check against the standard Button sizes.
 */
export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex items-end gap-4 p-4">
      {splitButtonSizeIds.map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase text-muted-foreground">
            {size}
          </span>
          <SplitButton size={size} variant="default">
            <SplitButtonAction onClick={fn()}>Save</SplitButtonAction>
            <SplitButtonTrigger />
            <SplitButtonContent>
              <DropdownMenuItem onClick={fn()}>Save as draft</DropdownMenuItem>
              <DropdownMenuItem onClick={fn()}>
                Save as template
              </DropdownMenuItem>
            </SplitButtonContent>
          </SplitButton>
        </div>
      ))}
    </div>
  ),
};

/**
 * A real-world example: schema migration UI where the primary action is
 * "Apply migration" and the dropdown offers safer or more granular variants.
 */
export const SchemaMigrationExample: Story = {
  render: (): ReactElement => (
    <div className="flex w-[420px] flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm">
      <div>
        <div className="text-sm font-semibold">users → users_v2</div>
        <div className="text-xs text-muted-foreground">
          3 columns added, 1 renamed, 0 dropped
        </div>
      </div>
      <div className="flex items-center justify-end gap-2">
        <SplitButton variant="default">
          <SplitButtonAction onClick={fn()}>Apply migration</SplitButtonAction>
          <SplitButtonTrigger aria-label="More migration options" />
          <SplitButtonContent>
            <DropdownMenuItem onClick={fn()}>Dry-run only</DropdownMenuItem>
            <DropdownMenuItem onClick={fn()}>Apply and snapshot</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={fn()}>
              Export migration SQL
            </DropdownMenuItem>
          </SplitButtonContent>
        </SplitButton>
      </div>
    </div>
  ),
};
