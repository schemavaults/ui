import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useEffect, useState, type ReactElement } from "react";
import { Eye, MoreHorizontal } from "lucide-react";

import { Button } from "../button/button";
import {
  AttachmentCard,
  AttachmentCardList,
  attachmentCardFileKindIds,
  attachmentCardSizeIds,
  attachmentCardStatusIds,
  attachmentCardVariantIds,
} from "./attachment-card";

const meta = {
  title: "Components/AttachmentCard",
  component: AttachmentCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A file attachment card with an auto-inferred file-type icon, formatted byte size, optional preview thumbnail, and lifecycle states (`uploading`, `error`, `complete`). Sits naturally next to [`FileInput`](?path=/docs/components-fileinput--docs) for the upload flow, and works standalone in email/chat/document lists. Icons and colours come from a curated palette keyed to file kind (image / video / audio / code / archive / spreadsheet / json / pdf / text) and are inferred from the file extension or MIME type when not supplied explicitly. All colours resolve to `@schemavaults/theme` tokens where possible (`bg-card`, `text-foreground`, `border-border`, `bg-primary`, `bg-destructive`, `bg-muted`) so the card tracks the active theme.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: { options: attachmentCardVariantIds, control: { type: "radio" } },
    size: { options: attachmentCardSizeIds, control: { type: "radio" } },
    status: { options: attachmentCardStatusIds, control: { type: "radio" } },
    kind: {
      options: [undefined, ...attachmentCardFileKindIds],
      control: { type: "select" },
    },
    fileType: { control: { type: "text" } },
    bytes: { control: { type: "number" } },
    progress: { control: { type: "number", min: 0, max: 100, step: 1 } },
    href: { control: { type: "text" } },
    previewSrc: { control: { type: "text" } },
    description: { control: { type: "text" } },
    errorMessage: { control: { type: "text" } },
    showDownloadButton: { control: { type: "boolean" } },
  },
  args: {
    name: "quarterly-report.pdf",
    bytes: 1_248_576,
    description: "Uploaded by alice · Jul 27, 2026",
    variant: "default",
    size: "md",
    status: "idle",
  },
  decorators: [
    (Story): ReactElement => (
      <div style={{ width: "460px" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AttachmentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDownloadLink: Story = {
  args: {
    href: "#",
    showDownloadButton: true,
    description: "Ready to download",
  },
};

export const AllSizes: Story = {
  name: "All sizes",
  render: (args): ReactElement => (
    <div className="flex w-full flex-col gap-3">
      {attachmentCardSizeIds.map((s) => (
        <AttachmentCard
          key={s}
          {...args}
          size={s}
          description={`size="${s}"`}
        />
      ))}
    </div>
  ),
};

export const AllVariants: Story = {
  name: "All variants",
  render: (args): ReactElement => (
    <div className="flex w-full flex-col gap-3">
      {attachmentCardVariantIds.map((v) => (
        <AttachmentCard
          key={v}
          {...args}
          variant={v}
          description={`variant="${v}"`}
        />
      ))}
    </div>
  ),
};

export const FileKinds: Story = {
  name: "File kinds",
  parameters: {
    docs: {
      description: {
        story:
          "The icon and colour are inferred from the file extension (or `fileType` MIME type). Set the `kind` prop to override.",
      },
    },
  },
  render: (): ReactElement => (
    <AttachmentCardList>
      <AttachmentCard
        name="cover-photo.png"
        bytes={2_403_251}
        description="Image (auto-detected from extension)"
      />
      <AttachmentCard
        name="product-demo.mp4"
        bytes={48_205_312}
        description="Video"
      />
      <AttachmentCard
        name="podcast-episode-42.mp3"
        bytes={31_457_280}
        description="Audio"
      />
      <AttachmentCard
        name="quarterly-report.pdf"
        bytes={1_248_576}
        description="PDF"
      />
      <AttachmentCard
        name="README.md"
        bytes={4_312}
        description="Text / markdown"
      />
      <AttachmentCard
        name="server.ts"
        bytes={12_450}
        description="Code"
      />
      <AttachmentCard
        name="config.json"
        bytes={824}
        description="JSON"
      />
      <AttachmentCard
        name="assets.zip"
        bytes={104_857_600}
        description="Archive"
      />
      <AttachmentCard
        name="revenue-2026.xlsx"
        bytes={87_294}
        description="Spreadsheet"
      />
      <AttachmentCard
        name="unknown-blob"
        bytes={1024}
        description="Generic fallback"
      />
    </AttachmentCardList>
  ),
};

export const InferFromMimeType: Story = {
  name: "Infer from MIME type",
  args: {
    name: "avatar",
    fileType: "image/png",
    bytes: 44_312,
    description: 'No extension, kind picked from `fileType="image/png"`',
  },
};

export const WithImagePreview: Story = {
  name: "With image preview",
  args: {
    name: "cover-photo.png",
    bytes: 2_403_251,
    previewSrc:
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%236366f1'/%3E%3Cstop offset='100%25' stop-color='%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='40' height='40' fill='url(%23g)'/%3E%3Ccircle cx='14' cy='16' r='4' fill='white' opacity='.9'/%3E%3Cpath d='M4 34 L16 22 L26 30 L36 20 L36 40 L4 40 Z' fill='white' opacity='.85'/%3E%3C/svg%3E",
    description: "Preview replaces the icon when `previewSrc` is set",
  },
};

export const Uploading: Story = {
  args: {
    name: "backup-2026-07-27.tar.gz",
    bytes: 12_582_912,
    status: "uploading",
    progress: 42,
    description: "Uploading…",
  },
};

export const UploadingIndeterminate: Story = {
  name: "Uploading (indeterminate)",
  args: {
    name: "large-dataset.csv",
    bytes: 314_572_800,
    status: "uploading",
    description: "Uploading (unknown progress)",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Omit `progress` while `status=\"uploading\"` to render an indeterminate pulsing bar.",
      },
    },
  },
};

export const Complete: Story = {
  args: {
    name: "invoice-2026-07.pdf",
    bytes: 214_501,
    status: "complete",
    description: "Upload complete",
  },
};

export const ErrorState: Story = {
  name: "Error",
  args: {
    name: "corrupt.zip",
    bytes: 8_388_608,
    status: "error",
    errorMessage: "Upload failed: file exceeds 5 MB limit.",
    onRetry: fn(),
  },
};

export const WithRemove: Story = {
  name: "With remove button",
  args: {
    name: "attachment.pdf",
    bytes: 512_000,
    onRemove: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const removeButton = await waitFor(() =>
      canvas.getByRole("button", { name: /remove attachment\.pdf/i }),
    );
    await userEvent.click(removeButton);
    await waitFor(() => {
      expect(args.onRemove).toHaveBeenCalledTimes(1);
    });
  },
};

export const WithCustomActions: Story = {
  name: "With custom actions",
  args: {
    name: "design-spec.pdf",
    bytes: 728_412,
    href: "#",
    actions: (
      <>
        <Button size="sm" variant="ghost" aria-label="Preview">
          <Eye />
        </Button>
        <Button size="sm" variant="ghost" aria-label="More">
          <MoreHorizontal />
        </Button>
      </>
    ),
  },
};

export const ClickableName: Story = {
  name: "Name as link",
  args: {
    name: "public-schema.sql",
    bytes: 6_142,
    href: "#",
    target: "_blank",
    description: "The file name is a link; hover to see the underline",
  },
};

export const InAList: Story = {
  name: "In a list",
  render: (): ReactElement => (
    <AttachmentCardList>
      <AttachmentCard
        name="proposal.pdf"
        bytes={1_048_576}
        description="Alice · today"
        href="#"
        showDownloadButton
      />
      <AttachmentCard
        name="thumbnail.png"
        bytes={44_312}
        description="Bob · yesterday"
        previewSrc="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' fill='%230ea5e9'/%3E%3Ccircle cx='20' cy='20' r='10' fill='white' opacity='.85'/%3E%3C/svg%3E"
      />
      <AttachmentCard
        name="notes.md"
        bytes={2_048}
        description="Carol · 2 days ago"
        onRemove={fn()}
      />
      <AttachmentCard
        name="pipeline.yaml"
        bytes={1_820}
        description="Dan · 3 days ago"
        status="complete"
      />
      <AttachmentCard
        name="oversized-video.mov"
        bytes={512_000_000}
        status="error"
        errorMessage="File exceeds workspace quota"
        onRetry={fn()}
      />
    </AttachmentCardList>
  ),
};

function LiveUploadDemo(): ReactElement {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<"uploading" | "complete">("uploading");

  useEffect(() => {
    if (status === "complete") return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setStatus("complete");
          return 100;
        }
        return p + 5;
      });
    }, 220);
    return () => clearInterval(interval);
  }, [status]);

  return (
    <div className="flex w-full flex-col gap-3">
      <AttachmentCard
        name="live-upload-demo.mp4"
        bytes={24_010_240}
        status={status}
        progress={status === "uploading" ? progress : undefined}
        description={
          status === "uploading" ? "Uploading…" : "Upload complete"
        }
        onRemove={
          status === "complete"
            ? () => {
                setProgress(0);
                setStatus("uploading");
              }
            : undefined
        }
        removeLabel="Restart demo"
      />
      <p className="text-xs text-muted-foreground">
        The demo auto-restarts when you click the ✕ after it completes.
      </p>
    </div>
  );
}

export const LiveUpload: Story = {
  name: "Live upload (animated)",
  render: (): ReactElement => <LiveUploadDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Drive `progress` from external state (upload SDK, XHR event, WebSocket, etc.). Setting `status=\"complete\"` swaps the progress bar for a success indicator.",
      },
    },
  },
};
