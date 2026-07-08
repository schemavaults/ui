import type { Meta, StoryObj } from "@storybook/react";
import type { ReactElement } from "react";

import {
  TerminalFrame,
  TerminalFrameBody,
  TerminalFrameControls,
  TerminalFrameCursor,
  TerminalFrameHeader,
  TerminalFrameOutput,
  TerminalFramePrompt,
  TerminalFrameTitle,
  terminalFrameSizeIds,
  terminalFrameThemeIds,
  terminalFrameVariantIds,
} from "./terminal-frame";

const meta = {
  title: "Components/TerminalFrame",
  component: TerminalFrame,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: terminalFrameVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: terminalFrameSizeIds,
      control: { type: "radio" },
    },
    theme: {
      options: terminalFrameThemeIds,
      control: { type: "radio" },
    },
  },
} satisfies Meta<typeof TerminalFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

function PlaceholderSession(): ReactElement {
  return (
    <>
      <TerminalFramePrompt prompt="$" promptTone="success">
        schemavaults auth login
      </TerminalFramePrompt>
      <TerminalFrameOutput tone="muted">
        Opening browser for authentication…
      </TerminalFrameOutput>
      <TerminalFrameOutput tone="success">
        ✔ Signed in as jalexwhitman@gmail.com
      </TerminalFrameOutput>
      <TerminalFramePrompt prompt="$" promptTone="success" cursor>
        schemavaults schemas list
      </TerminalFramePrompt>
    </>
  );
}

export const Default: Story = {
  args: {
    variant: "macos",
    size: "md",
    theme: "default",
  },
  render: (args): ReactElement => {
    const variant = args.variant ?? "macos";
    const size = args.size ?? "md";
    const theme = args.theme ?? "default";
    return (
      <TerminalFrame {...args} className="max-w-3xl">
        <TerminalFrameHeader variant={variant} size={size} theme={theme}>
          <TerminalFrameControls variant={variant} />
          <TerminalFrameTitle>bash — schemavaults</TerminalFrameTitle>
        </TerminalFrameHeader>
        <TerminalFrameBody size={size} theme={theme}>
          <PlaceholderSession />
        </TerminalFrameBody>
      </TerminalFrame>
    );
  },
};

export const MacOS: Story = {
  render: (): ReactElement => (
    <TerminalFrame variant="macos" className="max-w-3xl">
      <TerminalFrameHeader variant="macos">
        <TerminalFrameControls variant="macos" />
        <TerminalFrameTitle>zsh — ~/projects/schemavaults</TerminalFrameTitle>
      </TerminalFrameHeader>
      <TerminalFrameBody>
        <PlaceholderSession />
      </TerminalFrameBody>
    </TerminalFrame>
  ),
};

export const Windows: Story = {
  render: (): ReactElement => (
    <TerminalFrame variant="windows" className="max-w-3xl">
      <TerminalFrameHeader variant="windows">
        <TerminalFrameTitle>PowerShell — schemavaults</TerminalFrameTitle>
        <TerminalFrameControls variant="windows" />
      </TerminalFrameHeader>
      <TerminalFrameBody>
        <TerminalFramePrompt prompt="PS C:\Users\dev>" promptTone="info">
          schemavaults --version
        </TerminalFramePrompt>
        <TerminalFrameOutput>@schemavaults/cli v0.79.4</TerminalFrameOutput>
        <TerminalFramePrompt prompt="PS C:\Users\dev>" promptTone="info" cursor />
      </TerminalFrameBody>
    </TerminalFrame>
  ),
};

export const Minimal: Story = {
  render: (): ReactElement => (
    <TerminalFrame variant="minimal" className="max-w-3xl">
      <TerminalFrameBody>
        <TerminalFramePrompt prompt="➜" promptTone="primary">
          bun install @schemavaults/ui
        </TerminalFramePrompt>
        <TerminalFrameOutput tone="muted">
          bun install v1.3.11
        </TerminalFrameOutput>
        <TerminalFrameOutput tone="success">
          + @schemavaults/ui@0.80.0
        </TerminalFrameOutput>
        <TerminalFrameOutput tone="muted">
          Done in 2.34s.
        </TerminalFrameOutput>
      </TerminalFrameBody>
    </TerminalFrame>
  ),
};

export const DarkTheme: Story = {
  render: (): ReactElement => (
    <TerminalFrame variant="macos" theme="dark" className="max-w-3xl">
      <TerminalFrameHeader variant="macos" theme="dark">
        <TerminalFrameControls variant="macos" />
        <TerminalFrameTitle>bash — schemavaults</TerminalFrameTitle>
      </TerminalFrameHeader>
      <TerminalFrameBody theme="dark">
        <PlaceholderSession />
      </TerminalFrameBody>
    </TerminalFrame>
  ),
};

export const MatrixTheme: Story = {
  render: (): ReactElement => (
    <TerminalFrame variant="minimal" theme="matrix" className="max-w-3xl">
      <TerminalFrameBody theme="matrix">
        <TerminalFrameOutput>Wake up, Neo…</TerminalFrameOutput>
        <TerminalFrameOutput>
          The Matrix has you. Follow the white rabbit.
        </TerminalFrameOutput>
        <TerminalFramePrompt prompt=">" promptTone="success" cursor>
          knock knock
        </TerminalFramePrompt>
      </TerminalFrameBody>
    </TerminalFrame>
  ),
};

export const AmberTheme: Story = {
  render: (): ReactElement => (
    <TerminalFrame variant="minimal" theme="amber" className="max-w-3xl">
      <TerminalFrameBody theme="amber">
        <TerminalFrameOutput>
          SchemaVaults BIOS v1.0 — vintage terminal mode
        </TerminalFrameOutput>
        <TerminalFramePrompt prompt=">" promptTone="warning" cursor>
          RUN LEGACY.EXE
        </TerminalFramePrompt>
      </TerminalFrameBody>
    </TerminalFrame>
  ),
};

export const OutputTones: Story = {
  render: (): ReactElement => (
    <TerminalFrame variant="macos" className="max-w-3xl">
      <TerminalFrameHeader variant="macos">
        <TerminalFrameControls variant="macos" />
        <TerminalFrameTitle>output-tones</TerminalFrameTitle>
      </TerminalFrameHeader>
      <TerminalFrameBody>
        <TerminalFrameOutput tone="default">
          default: plain informational output
        </TerminalFrameOutput>
        <TerminalFrameOutput tone="muted">
          muted: dimmed, secondary detail
        </TerminalFrameOutput>
        <TerminalFrameOutput tone="info">
          info: neutral status message
        </TerminalFrameOutput>
        <TerminalFrameOutput tone="success">
          success: ✔ operation succeeded
        </TerminalFrameOutput>
        <TerminalFrameOutput tone="warning">
          warning: ⚠ deprecated flag `--force`
        </TerminalFrameOutput>
        <TerminalFrameOutput tone="danger">
          danger: ✘ error: unable to connect
        </TerminalFrameOutput>
      </TerminalFrameBody>
    </TerminalFrame>
  ),
};

export const PromptTones: Story = {
  render: (): ReactElement => (
    <TerminalFrame variant="macos" className="max-w-3xl">
      <TerminalFrameHeader variant="macos">
        <TerminalFrameControls variant="macos" />
        <TerminalFrameTitle>prompt-tones</TerminalFrameTitle>
      </TerminalFrameHeader>
      <TerminalFrameBody>
        <TerminalFramePrompt prompt="$" promptTone="success">
          echo &quot;success prompt (default)&quot;
        </TerminalFramePrompt>
        <TerminalFramePrompt prompt="#" promptTone="danger">
          sudo rm -rf /tmp/scratch
        </TerminalFramePrompt>
        <TerminalFramePrompt prompt="➜" promptTone="primary">
          git checkout main
        </TerminalFramePrompt>
        <TerminalFramePrompt prompt="user@host:~$" promptTone="info">
          uname -a
        </TerminalFramePrompt>
        <TerminalFramePrompt prompt=">" promptTone="warning">
          run --experimental
        </TerminalFramePrompt>
        <TerminalFramePrompt prompt="$" promptTone="muted">
          history | tail -5
        </TerminalFramePrompt>
      </TerminalFrameBody>
    </TerminalFrame>
  ),
};

export const InteractiveCursor: Story = {
  render: (): ReactElement => (
    <TerminalFrame variant="macos" className="max-w-3xl">
      <TerminalFrameHeader variant="macos">
        <TerminalFrameControls variant="macos" />
        <TerminalFrameTitle>awaiting input…</TerminalFrameTitle>
      </TerminalFrameHeader>
      <TerminalFrameBody>
        <TerminalFrameOutput tone="muted">
          Press any key to continue.
        </TerminalFrameOutput>
        <TerminalFramePrompt prompt="$" promptTone="success">
          <span className="inline-flex items-center">
            waiting for input
            <TerminalFrameCursor className="ml-1" />
          </span>
        </TerminalFramePrompt>
      </TerminalFrameBody>
    </TerminalFrame>
  ),
};

export const InstallCommand: Story = {
  name: "Real world: install command",
  render: (): ReactElement => (
    <TerminalFrame variant="macos" size="md" className="max-w-2xl">
      <TerminalFrameHeader variant="macos">
        <TerminalFrameControls variant="macos" />
        <TerminalFrameTitle>~/schemavaults</TerminalFrameTitle>
      </TerminalFrameHeader>
      <TerminalFrameBody>
        <TerminalFramePrompt prompt="$" promptTone="success">
          bun add @schemavaults/ui
        </TerminalFramePrompt>
        <TerminalFrameOutput tone="muted">
          bun add v1.3.11
        </TerminalFrameOutput>
        <TerminalFrameOutput>
          {" installed @schemavaults/ui@0.80.0"}
        </TerminalFrameOutput>
        <TerminalFrameOutput tone="success">
          Done in 1.87s.
        </TerminalFrameOutput>
        <TerminalFramePrompt prompt="$" promptTone="success" cursor />
      </TerminalFrameBody>
    </TerminalFrame>
  ),
};

function AllVariantsExample(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      {terminalFrameVariantIds.map((variant) => (
        <div key={variant} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {variant}
          </span>
          <TerminalFrame variant={variant} className="max-w-3xl">
            <TerminalFrameHeader variant={variant}>
              {variant === "macos" ? (
                <TerminalFrameControls variant={variant} />
              ) : null}
              <TerminalFrameTitle>bash — {variant}</TerminalFrameTitle>
              {variant === "windows" ? (
                <TerminalFrameControls variant={variant} />
              ) : null}
            </TerminalFrameHeader>
            <TerminalFrameBody>
              <TerminalFramePrompt prompt="$" promptTone="success">
                echo &quot;hello, {variant}&quot;
              </TerminalFramePrompt>
              <TerminalFrameOutput>hello, {variant}</TerminalFrameOutput>
            </TerminalFrameBody>
          </TerminalFrame>
        </div>
      ))}
    </div>
  );
}

export const AllVariants: Story = {
  render: (): ReactElement => <AllVariantsExample />,
};

function AllThemesExample(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      {terminalFrameThemeIds.map((theme) => (
        <div key={theme} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {theme}
          </span>
          <TerminalFrame variant="macos" theme={theme} className="max-w-3xl">
            <TerminalFrameHeader variant="macos" theme={theme}>
              <TerminalFrameControls variant="macos" />
              <TerminalFrameTitle>bash — {theme}</TerminalFrameTitle>
            </TerminalFrameHeader>
            <TerminalFrameBody theme={theme}>
              <TerminalFramePrompt prompt="$" promptTone="success">
                schemavaults --theme {theme}
              </TerminalFramePrompt>
              <TerminalFrameOutput>
                Rendering with the {theme} palette.
              </TerminalFrameOutput>
              <TerminalFramePrompt prompt="$" promptTone="success" cursor />
            </TerminalFrameBody>
          </TerminalFrame>
        </div>
      ))}
    </div>
  );
}

export const AllThemes: Story = {
  render: (): ReactElement => <AllThemesExample />,
};

function AllSizesExample(): ReactElement {
  return (
    <div className="flex flex-col gap-8">
      {terminalFrameSizeIds.map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {size}
          </span>
          <TerminalFrame variant="macos" size={size} className="max-w-3xl">
            <TerminalFrameHeader variant="macos" size={size}>
              <TerminalFrameControls variant="macos" />
              <TerminalFrameTitle>bash — {size}</TerminalFrameTitle>
            </TerminalFrameHeader>
            <TerminalFrameBody size={size}>
              <TerminalFramePrompt prompt="$" promptTone="success">
                echo &quot;{size} size&quot;
              </TerminalFramePrompt>
              <TerminalFrameOutput>{size} size</TerminalFrameOutput>
            </TerminalFrameBody>
          </TerminalFrame>
        </div>
      ))}
    </div>
  );
}

export const AllSizes: Story = {
  render: (): ReactElement => <AllSizesExample />,
};
