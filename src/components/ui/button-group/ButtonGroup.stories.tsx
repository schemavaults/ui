import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Download,
  Grid3x3,
  Italic,
  LayoutGrid,
  List,
  Minus,
  Plus,
  Rows3,
  Share2,
  Trash2,
  Underline,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  ButtonGroup,
  buttonGroupOrientationIds,
  buttonGroupSpacingIds,
} from "./button-group";

interface DemoProps {
  orientation?: (typeof buttonGroupOrientationIds)[number];
  attached?: boolean;
  spacing?: (typeof buttonGroupSpacingIds)[number];
  fullWidth?: boolean;
}

function DefaultDemo({
  orientation,
  attached,
  spacing,
  fullWidth,
}: DemoProps): ReactElement {
  return (
    <div className={fullWidth ? "w-[420px]" : undefined}>
      <ButtonGroup
        orientation={orientation}
        attached={attached}
        spacing={spacing}
        fullWidth={fullWidth}
        aria-label="Document actions"
      >
        <Button variant="outline">
          <Copy className="mr-2 h-4 w-4" />
          Copy
        </Button>
        <Button variant="outline">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </ButtonGroup>
    </div>
  );
}

const meta = {
  title: "Components/ButtonGroup",
  component: DefaultDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      options: buttonGroupOrientationIds,
      control: { type: "radio" },
    },
    attached: { control: { type: "boolean" } },
    spacing: {
      options: buttonGroupSpacingIds,
      control: { type: "radio" },
      if: { arg: "attached", eq: false },
    },
    fullWidth: { control: { type: "boolean" } },
  },
  args: {
    orientation: "horizontal",
    attached: true,
    spacing: "default",
    fullWidth: false,
  },
} satisfies Meta<typeof DefaultDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Detached: Story = {
  args: { attached: false },
};

export const Vertical: Story = {
  args: { orientation: "vertical" },
};

export const VerticalDetached: Story = {
  args: { orientation: "vertical", attached: false },
};

export const FullWidth: Story = {
  args: { fullWidth: true },
};

function IconOnlyDemo(): ReactElement {
  return (
    <ButtonGroup aria-label="Text alignment">
      <Button variant="outline" size="icon" aria-label="Align left">
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Align center">
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Align right">
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Justify">
        <AlignJustify className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  );
}

export const IconOnly: Story = {
  render: () => <IconOnlyDemo />,
};

function TextFormattingDemo(): ReactElement {
  const [active, setActive] = useState<Set<string>>(new Set(["bold"]));
  const toggle = (key: string): void => {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <ButtonGroup aria-label="Text formatting">
      <Button
        variant={active.has("bold") ? "default" : "outline"}
        size="icon"
        aria-label="Bold"
        aria-pressed={active.has("bold")}
        onClick={(): void => toggle("bold")}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant={active.has("italic") ? "default" : "outline"}
        size="icon"
        aria-label="Italic"
        aria-pressed={active.has("italic")}
        onClick={(): void => toggle("italic")}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant={active.has("underline") ? "default" : "outline"}
        size="icon"
        aria-label="Underline"
        aria-pressed={active.has("underline")}
        onClick={(): void => toggle("underline")}
      >
        <Underline className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  );
}

export const ToggleGroup: Story = {
  render: () => <TextFormattingDemo />,
};

function ViewSwitcherDemo(): ReactElement {
  const [view, setView] = useState<"grid" | "list" | "gallery" | "rows">(
    "grid",
  );
  return (
    <ButtonGroup aria-label="Layout">
      <Button
        variant={view === "grid" ? "default" : "outline"}
        size="sm"
        aria-pressed={view === "grid"}
        onClick={(): void => setView("grid")}
      >
        <LayoutGrid className="mr-2 h-3.5 w-3.5" />
        Grid
      </Button>
      <Button
        variant={view === "list" ? "default" : "outline"}
        size="sm"
        aria-pressed={view === "list"}
        onClick={(): void => setView("list")}
      >
        <List className="mr-2 h-3.5 w-3.5" />
        List
      </Button>
      <Button
        variant={view === "gallery" ? "default" : "outline"}
        size="sm"
        aria-pressed={view === "gallery"}
        onClick={(): void => setView("gallery")}
      >
        <Grid3x3 className="mr-2 h-3.5 w-3.5" />
        Gallery
      </Button>
      <Button
        variant={view === "rows" ? "default" : "outline"}
        size="sm"
        aria-pressed={view === "rows"}
        onClick={(): void => setView("rows")}
      >
        <Rows3 className="mr-2 h-3.5 w-3.5" />
        Rows
      </Button>
    </ButtonGroup>
  );
}

export const ViewSwitcher: Story = {
  render: () => <ViewSwitcherDemo />,
};

function PaginationDemo(): ReactElement {
  const [page, setPage] = useState<number>(3);
  const totalPages = 7;
  return (
    <div className="flex flex-col items-center gap-3">
      <ButtonGroup aria-label="Pagination">
        <Button
          variant="outline"
          size="icon"
          aria-label="First page"
          disabled={page === 1}
          onClick={(): void => setPage(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous page"
          disabled={page === 1}
          onClick={(): void => setPage((p) => Math.max(1, p - 1))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <Button
            key={n}
            variant={n === page ? "default" : "outline"}
            size="icon"
            aria-label={`Page ${n}`}
            aria-current={n === page ? "page" : undefined}
            onClick={(): void => setPage(n)}
          >
            {n}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          aria-label="Next page"
          disabled={page === totalPages}
          onClick={(): void =>
            setPage((p) => Math.min(totalPages, p + 1))
          }
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Last page"
          disabled={page === totalPages}
          onClick={(): void => setPage(totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </ButtonGroup>
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        {totalPages}
      </p>
    </div>
  );
}

export const Pagination: Story = {
  render: () => <PaginationDemo />,
};

function StepperDemo(): ReactElement {
  const [count, setCount] = useState<number>(1);
  return (
    <ButtonGroup aria-label="Quantity">
      <Button
        variant="outline"
        size="icon"
        aria-label="Decrease"
        disabled={count <= 0}
        onClick={(): void => setCount((c) => Math.max(0, c - 1))}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        aria-live="polite"
        aria-label={`Current count: ${count}`}
        className="min-w-[3rem] cursor-default pointer-events-none tabular-nums"
        tabIndex={-1}
      >
        {count}
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Increase"
        onClick={(): void => setCount((c) => c + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  );
}

export const NumericStepper: Story = {
  render: () => <StepperDemo />,
};

function MixedVariantDemo(): ReactElement {
  return (
    <ButtonGroup aria-label="Record actions">
      <Button variant="default">Save</Button>
      <Button variant="outline">Duplicate</Button>
      <Button variant="destructive">
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </Button>
    </ButtonGroup>
  );
}

export const MixedVariants: Story = {
  render: () => <MixedVariantDemo />,
};

function AllSizesDemo(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <ButtonGroup aria-label={`${size} sample`}>
            <Button variant="outline" size={size}>
              One
            </Button>
            <Button variant="outline" size={size}>
              Two
            </Button>
            <Button variant="outline" size={size}>
              Three
            </Button>
          </ButtonGroup>
        </div>
      ))}
    </div>
  );
}

export const AllSizes: Story = {
  render: () => <AllSizesDemo />,
};

function VerticalIconDemo(): ReactElement {
  return (
    <ButtonGroup orientation="vertical" aria-label="Zoom controls">
      <Button variant="outline" size="icon" aria-label="Zoom in">
        <Plus className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" aria-label="Zoom out">
        <Minus className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  );
}

export const VerticalIconStack: Story = {
  render: () => <VerticalIconDemo />,
};
