import type { Meta, StoryObj } from "@storybook/react";
import { expect, waitFor } from "storybook/test";

import type { ReactElement } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./Tabs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function TabsExample(): ReactElement {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when you are done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="SchemaVaults Support" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="support@schemavaults.com" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you will be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">New password</Label>
              <Input id="new" type="password" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: "Components/Tabs",
  component: TabsExample,
  parameters: {
    // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
    layout: "centered",
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {},
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
} satisfies Meta<typeof TabsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Example: Story = {
  args: {},
};

/**
 * Regression test for the `className` override bug.
 *
 * `TabsList`, `TabsTrigger`, and `TabsContent` used to spread `...props` (which
 * still contained `className`) *after* setting the merged `className`, so a
 * consumer-supplied `className` replaced the component's default styling
 * entirely instead of extending it. For example `<TabsList className="flex-wrap
 * h-auto">` rendered with only `flex-wrap h-auto` — no `bg-muted`, no
 * `rounded-lg`, no padding.
 *
 * After destructuring `className` out of `props`, the custom classes are merged
 * on top of the defaults via `cn()`/tailwind-merge: non-conflicting defaults
 * survive and conflicting ones (e.g. `h-9`) are overridden by the custom class
 * (`h-auto`).
 */
export const ClassNameMergesWithDefaults: Story = {
  render: (): ReactElement => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="account" className="uppercase">
          Account
        </TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account" className="border">
        Account panel
      </TabsContent>
      <TabsContent value="password">Password panel</TabsContent>
    </Tabs>
  ),
  play: async ({ canvasElement }): Promise<void> => {
    const list = await waitFor((): HTMLElement => {
      const el = canvasElement.querySelector<HTMLElement>('[role="tablist"]');
      if (el === null) {
        throw new Error("tablist has not rendered yet");
      }
      return el;
    });

    // Default TabsList styles survive the custom className...
    for (const cls of [
      "inline-flex",
      "items-center",
      "justify-center",
      "rounded-lg",
      "bg-muted",
      "p-1",
      "text-muted-foreground",
    ]) {
      expect(list.classList.contains(cls)).toBe(true);
    }
    // ...the custom classes are added...
    expect(list.classList.contains("flex-wrap")).toBe(true);
    expect(list.classList.contains("h-auto")).toBe(true);
    // ...and the conflicting default (`h-9`) is dropped by tailwind-merge.
    expect(list.classList.contains("h-9")).toBe(false);

    // TabsTrigger merges the same way.
    const trigger = canvasElement.querySelector<HTMLElement>(
      '[role="tab"][data-state="active"]',
    );
    expect(trigger).not.toBeNull();
    expect(trigger!.classList.contains("uppercase")).toBe(true);
    for (const cls of ["inline-flex", "rounded-md", "text-sm", "font-medium"]) {
      expect(trigger!.classList.contains(cls)).toBe(true);
    }

    // TabsContent merges the same way.
    const panel = canvasElement.querySelector<HTMLElement>(
      '[role="tabpanel"]',
    );
    expect(panel).not.toBeNull();
    expect(panel!.classList.contains("border")).toBe(true);
    for (const cls of ["mt-2", "ring-offset-background"]) {
      expect(panel!.classList.contains(cls)).toBe(true);
    }
  },
};
