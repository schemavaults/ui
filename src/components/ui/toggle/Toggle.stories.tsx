import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";
import {
  Bell,
  BellOff,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Eye,
  EyeOff,
  Heart,
  Star,
  Bookmark,
  Pin,
  LayoutGrid,
  List,
  Rows,
  Columns,
  Wifi,
  Bluetooth,
  Plane,
  MoonStar,
  Volume2,
  VolumeX,
} from "lucide-react";

import {
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
  toggleSizeIds,
  toggleVariantIds,
} from "./index";

interface DemoProps {
  variant?: (typeof toggleVariantIds)[number];
  size?: (typeof toggleSizeIds)[number];
  disabled?: boolean;
}

function PlaygroundDemo({
  variant,
  size,
  disabled,
}: DemoProps): ReactElement {
  const [pressed, setPressed] = useState<boolean>(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <Toggle
        variant={variant}
        size={size}
        disabled={disabled}
        pressed={pressed}
        onPressedChange={setPressed}
        aria-label="Toggle bold"
      >
        <Bold />
        {size !== "icon" ? <span>Bold</span> : null}
      </Toggle>
      <p className="text-sm text-muted-foreground">
        Pressed:{" "}
        <span className="font-medium text-foreground">
          {pressed ? "true" : "false"}
        </span>
      </p>
    </div>
  );
}

const meta = {
  title: "Components/Toggle",
  component: PlaygroundDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: toggleVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: toggleSizeIds,
      control: { type: "radio" },
    },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    variant: "default",
    size: "default",
    disabled: false,
  },
} satisfies Meta<typeof PlaygroundDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="grid grid-cols-[auto,1fr] items-center gap-x-6 gap-y-3">
      {toggleVariantIds.map((variant) => (
        <RowEntry key={variant} variant={variant} />
      ))}
    </div>
  ),
};

function RowEntry({
  variant,
}: {
  variant: (typeof toggleVariantIds)[number];
}): ReactElement {
  return (
    <>
      <span className="text-sm font-medium text-muted-foreground capitalize">
        {variant}
      </span>
      <div className="flex items-center gap-2">
        <Toggle variant={variant} aria-label={`${variant} off`}>
          <Bell />
          <span>Off</span>
        </Toggle>
        <Toggle
          variant={variant}
          defaultPressed
          aria-label={`${variant} on`}
        >
          <Bell />
          <span>On</span>
        </Toggle>
        <Toggle
          variant={variant}
          disabled
          aria-label={`${variant} disabled`}
        >
          <BellOff />
          <span>Disabled</span>
        </Toggle>
      </div>
    </>
  );
}

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex items-center gap-3">
      <Toggle size="sm" defaultPressed aria-label="Small toggle">
        <Star />
        <span>Small</span>
      </Toggle>
      <Toggle size="default" defaultPressed aria-label="Default toggle">
        <Star />
        <span>Default</span>
      </Toggle>
      <Toggle size="lg" defaultPressed aria-label="Large toggle">
        <Star />
        <span>Large</span>
      </Toggle>
      <Toggle size="icon" defaultPressed aria-label="Icon toggle">
        <Star />
      </Toggle>
    </div>
  ),
};

export const TextFormattingToolbar: Story = {
  render: (): ReactElement => {
    function ToolbarDemo(): ReactElement {
      const [marks, setMarks] = useState<string[]>(["bold"]);
      const [align, setAlign] = useState<string>("left");
      return (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="multiple"
              variant="outline"
              size="icon"
              value={marks}
              onValueChange={setMarks}
              aria-label="Text formatting"
            >
              <ToggleGroupItem value="bold" aria-label="Bold">
                <Bold />
              </ToggleGroupItem>
              <ToggleGroupItem value="italic" aria-label="Italic">
                <Italic />
              </ToggleGroupItem>
              <ToggleGroupItem value="underline" aria-label="Underline">
                <Underline />
              </ToggleGroupItem>
              <ToggleGroupItem value="strikethrough" aria-label="Strikethrough">
                <Strikethrough />
              </ToggleGroupItem>
            </ToggleGroup>
            <div className="h-6 w-px bg-border" aria-hidden />
            <ToggleGroup
              type="single"
              variant="outline"
              size="icon"
              value={align}
              onValueChange={(v) => setAlign(v || "left")}
              aria-label="Text alignment"
            >
              <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight />
              </ToggleGroupItem>
              <ToggleGroupItem value="justify" aria-label="Justify">
                <AlignJustify />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div
            className={[
              "min-h-[80px] rounded-md border border-border bg-background p-3 text-sm text-foreground",
              marks.includes("bold") ? "font-bold" : "",
              marks.includes("italic") ? "italic" : "",
              marks.includes("underline") ? "underline" : "",
              marks.includes("strikethrough") ? "line-through" : "",
              align === "left" ? "text-left" : "",
              align === "center" ? "text-center" : "",
              align === "right" ? "text-right" : "",
              align === "justify" ? "text-justify" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            The quick brown fox jumps over the lazy dog. Edit the toggles above
            to change formatting and alignment.
          </div>
        </div>
      );
    }
    return <ToolbarDemo />;
  },
};

export const ViewSwitcher: Story = {
  render: (): ReactElement => {
    function ViewDemo(): ReactElement {
      const [view, setView] = useState<string>("grid");
      return (
        <div className="flex flex-col items-center gap-3">
          <ToggleGroup
            type="single"
            variant="outline"
            value={view}
            onValueChange={(v) => setView(v || "grid")}
            aria-label="View mode"
          >
            <ToggleGroupItem value="grid">
              <LayoutGrid />
              <span>Grid</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="list">
              <List />
              <span>List</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="rows">
              <Rows />
              <span>Rows</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="columns">
              <Columns />
              <span>Columns</span>
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-sm text-muted-foreground">
            Active view:{" "}
            <span className="font-medium text-foreground">{view}</span>
          </p>
        </div>
      );
    }
    return <ViewDemo />;
  },
};

export const QuickSettings: Story = {
  render: (): ReactElement => {
    function SettingsDemo(): ReactElement {
      const [active, setActive] = useState<string[]>(["wifi"]);
      return (
        <div className="flex flex-col items-center gap-3">
          <ToggleGroup
            type="multiple"
            variant="primary"
            size="lg"
            value={active}
            onValueChange={setActive}
            aria-label="Quick settings"
          >
            <ToggleGroupItem value="wifi" aria-label="Wi-Fi">
              <Wifi />
              <span>Wi-Fi</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="bluetooth" aria-label="Bluetooth">
              <Bluetooth />
              <span>Bluetooth</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="airplane" aria-label="Airplane mode">
              <Plane />
              <span>Airplane</span>
            </ToggleGroupItem>
            <ToggleGroupItem value="dnd" aria-label="Do not disturb">
              <MoonStar />
              <span>Focus</span>
            </ToggleGroupItem>
          </ToggleGroup>
          <p className="text-sm text-muted-foreground">
            On:{" "}
            <span className="font-medium text-foreground">
              {active.length > 0 ? active.join(", ") : "none"}
            </span>
          </p>
        </div>
      );
    }
    return <SettingsDemo />;
  },
};

export const StandaloneToggles: Story = {
  render: (): ReactElement => {
    function StandaloneDemo(): ReactElement {
      const [muted, setMuted] = useState<boolean>(false);
      const [hidden, setHidden] = useState<boolean>(false);
      const [favorited, setFavorited] = useState<boolean>(true);
      const [bookmarked, setBookmarked] = useState<boolean>(false);
      const [pinned, setPinned] = useState<boolean>(false);
      return (
        <div className="flex flex-wrap items-center gap-3">
          <Toggle
            variant="outline"
            pressed={muted}
            onPressedChange={setMuted}
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX /> : <Volume2 />}
            <span>{muted ? "Muted" : "Sound on"}</span>
          </Toggle>
          <Toggle
            variant="outline"
            pressed={hidden}
            onPressedChange={setHidden}
            aria-label={hidden ? "Show" : "Hide"}
          >
            {hidden ? <EyeOff /> : <Eye />}
            <span>{hidden ? "Hidden" : "Visible"}</span>
          </Toggle>
          <Toggle
            variant="destructive"
            pressed={favorited}
            onPressedChange={setFavorited}
            aria-label={favorited ? "Unfavorite" : "Favorite"}
          >
            <Heart />
            <span>{favorited ? "Favorited" : "Favorite"}</span>
          </Toggle>
          <Toggle
            variant="primary"
            pressed={bookmarked}
            onPressedChange={setBookmarked}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark"}
          >
            <Bookmark />
            <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
          </Toggle>
          <Toggle
            variant="ghost"
            pressed={pinned}
            onPressedChange={setPinned}
            aria-label={pinned ? "Unpin" : "Pin"}
          >
            <Pin />
            <span>{pinned ? "Pinned" : "Pin"}</span>
          </Toggle>
        </div>
      );
    }
    return <StandaloneDemo />;
  },
};

export const Disabled: Story = {
  render: (): ReactElement => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Toggle disabled aria-label="Disabled off">
          <Bell />
          <span>Off (disabled)</span>
        </Toggle>
        <Toggle disabled defaultPressed aria-label="Disabled on">
          <Bell />
          <span>On (disabled)</span>
        </Toggle>
      </div>
      <ToggleGroup
        type="single"
        variant="outline"
        defaultValue="grid"
        disabled
        aria-label="Disabled view group"
      >
        <ToggleGroupItem value="grid">
          <LayoutGrid />
          <span>Grid</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="list">
          <List />
          <span>List</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};
