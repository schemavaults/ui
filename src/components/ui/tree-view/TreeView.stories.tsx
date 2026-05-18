import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import { File, FileCode, FileText, Folder } from "lucide-react";

import {
  TreeView,
  type TreeNode,
  treeViewSizeIds,
  treeViewVariantIds,
} from "./tree-view";

const fileTree: TreeNode[] = [
  {
    id: "src",
    label: "src",
    icon: <Folder />,
    children: [
      {
        id: "components",
        label: "components",
        icon: <Folder />,
        children: [
          { id: "button.tsx", label: "button.tsx", icon: <FileCode /> },
          { id: "tree-view.tsx", label: "tree-view.tsx", icon: <FileCode /> },
        ],
      },
      {
        id: "lib",
        label: "lib",
        icon: <Folder />,
        children: [{ id: "utils.ts", label: "utils.ts", icon: <FileCode /> }],
      },
      { id: "index.ts", label: "index.ts", icon: <FileCode /> },
    ],
  },
  {
    id: "public",
    label: "public",
    icon: <Folder />,
    children: [{ id: "logo.svg", label: "logo.svg", icon: <File /> }],
  },
  { id: "package.json", label: "package.json", icon: <FileText /> },
  { id: "README.md", label: "README.md", icon: <FileText /> },
];

interface DemoProps {
  size?: (typeof treeViewSizeIds)[number];
  variant?: (typeof treeViewVariantIds)[number];
  showGuides?: boolean;
}

function FileExplorerDemo({
  size,
  variant,
  showGuides,
}: DemoProps): ReactElement {
  const [selected, setSelected] = useState<string | null>("tree-view.tsx");
  return (
    <div className="w-80 rounded-lg border border-border bg-background p-2">
      <TreeView
        aria-label="Project files"
        data={fileTree}
        size={size}
        variant={variant}
        showGuides={showGuides}
        defaultExpandedIds={["src", "components"]}
        selectedId={selected}
        onSelectionChange={setSelected}
      />
      <p className="mt-3 px-2 text-xs text-muted-foreground">
        Selected:{" "}
        <span className="font-medium text-foreground">
          {selected ?? "none"}
        </span>
      </p>
    </div>
  );
}

const meta = {
  title: "Components/TreeView",
  component: FileExplorerDemo,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { options: treeViewSizeIds, control: { type: "radio" } },
    variant: { options: treeViewVariantIds, control: { type: "radio" } },
    showGuides: { control: { type: "boolean" } },
  },
  args: {
    size: "default",
    variant: "default",
    showGuides: true,
  },
} satisfies Meta<typeof FileExplorerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GhostVariant: Story = {
  args: { variant: "ghost" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const NoIndentGuides: Story = {
  args: { showGuides: false },
};

function UncontrolledDemo(): ReactElement {
  return (
    <div className="w-80 rounded-lg border border-border bg-background p-2">
      <TreeView
        aria-label="Uncontrolled file tree"
        data={fileTree}
        defaultExpandedIds={["src"]}
        defaultSelectedId="index.ts"
      />
    </div>
  );
}

export const Uncontrolled: Story = {
  render: () => <UncontrolledDemo />,
};

function SizesDemo(): ReactElement {
  return (
    <div className="flex items-start gap-6">
      {treeViewSizeIds.map((size) => (
        <div
          key={size}
          className="w-64 rounded-lg border border-border bg-background p-2"
        >
          <span className="mb-1 block px-2 text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <TreeView
            aria-label={`File tree ${size}`}
            data={fileTree}
            size={size}
            defaultExpandedIds={["src", "components"]}
            defaultSelectedId="tree-view.tsx"
          />
        </div>
      ))}
    </div>
  );
}

export const AllSizes: Story = {
  render: () => <SizesDemo />,
};
