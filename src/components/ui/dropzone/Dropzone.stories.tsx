import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { FileImage, FileText, ImagePlus } from "lucide-react";
import { useState, type ReactElement } from "react";

import { Dropzone, type DropzoneRejection } from "./dropzone";
import {
  dropzoneSizeIds,
  dropzoneVariantIds,
} from "./dropzone-variants";
import { Badge } from "../badge";
import { Button } from "../button";
import { Label } from "../label";

const meta = {
  title: "Components/Dropzone",
  component: Dropzone,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A large drag-and-drop file target that also opens the native file picker on click or keyboard activation. Handles validation (accepted MIME types / extensions, max size, max count) up-front and exposes both the accepted and rejected sides of the drop via `onDrop`. Uses `border`, `muted`, `primary`, `destructive`, and `ring` theme tokens so it lands correctly in both light and dark modes, and stays in-brand across SchemaVaults apps.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      options: dropzoneVariantIds,
      control: { type: "radio" },
    },
    size: {
      options: dropzoneSizeIds,
      control: { type: "radio" },
    },
    multiple: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
    maxSize: { control: { type: "number" } },
    maxFiles: { control: { type: "number" } },
    accept: { control: { type: "text" } },
    label: { control: { type: "text" } },
    hint: { control: { type: "text" } },
  },
  args: {
    variant: "default",
    size: "default",
    multiple: false,
    disabled: false,
  },
  decorators: [
    (Story): ReactElement => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const Multiple: Story = {
  args: {
    multiple: true,
    hint: "Drop up to 5 files here — images, PDFs, or ZIP archives",
  },
};

export const AcceptImagesOnly: Story = {
  args: {
    accept: "image/*",
    label: "Drop an image",
    hint: "PNG, JPG, GIF, WEBP · up to 5 MB",
    maxSize: 5 * 1024 * 1024,
    icon: <ImagePlus aria-hidden="true" />,
  },
};

export const AcceptDocuments: Story = {
  args: {
    accept: [".pdf", ".doc", ".docx", ".md"],
    multiple: true,
    maxFiles: 3,
    label: "Attach up to 3 documents",
    hint: "PDF, DOC, DOCX, MD · 10 MB each",
    maxSize: 10 * 1024 * 1024,
    icon: <FileText aria-hidden="true" />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    hint: "Uploading is temporarily disabled",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    label: "Upload your dataset",
    hint: "Drop a CSV or Parquet file (or click to browse) — up to 100 MB",
    accept: [".csv", ".parquet"],
    maxSize: 100 * 1024 * 1024,
    icon: <FileImage aria-hidden="true" />,
  },
};

export const AllVariants: Story = {
  render: (): ReactElement => (
    <div className="flex w-[420px] flex-col gap-4">
      {dropzoneVariantIds.map(
        (variant): ReactElement => (
          <div key={variant} className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">{variant}</span>
            <Dropzone
              variant={variant}
              hint={`Variant: ${variant}`}
            />
          </div>
        ),
      )}
    </div>
  ),
};

export const AllSizes: Story = {
  render: (): ReactElement => (
    <div className="flex w-[420px] flex-col gap-4">
      {dropzoneSizeIds.map(
        (size): ReactElement => (
          <div key={size} className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">{size}</span>
            <Dropzone size={size} hint={`Size: ${size}`} />
          </div>
        ),
      )}
    </div>
  ),
};

function ControlledExample(): ReactElement {
  const [accepted, setAccepted] = useState<File[]>([]);
  const [rejected, setRejected] = useState<DropzoneRejection[]>([]);

  return (
    <div className="flex w-[420px] flex-col gap-3">
      <Label>Attachments</Label>
      <Dropzone
        multiple
        maxFiles={5}
        maxSize={2 * 1024 * 1024}
        accept={["image/*", ".pdf"]}
        hint="Images or PDFs · up to 2 MB each · 5 files max"
        onDrop={(next, rejections): void => {
          setAccepted((prev): File[] => [...prev, ...next]);
          setRejected(rejections);
        }}
      />
      {accepted.length > 0 ? (
        <ul
          data-testid="accepted-list"
          className="flex flex-wrap gap-2 text-xs text-foreground"
        >
          {accepted.map(
            (file, index): ReactElement => (
              <li key={`${file.name}-${index}`}>
                <Badge variant="secondary">
                  {file.name}
                </Badge>
              </li>
            ),
          )}
        </ul>
      ) : null}
      {rejected.length > 0 ? (
        <ul
          data-testid="rejected-list"
          className="flex flex-col gap-1 text-xs text-destructive"
        >
          {rejected.map(
            (entry, index): ReactElement => (
              <li key={`${entry.file.name}-${index}`}>
                <strong>{entry.file.name}</strong> · {entry.message}
              </li>
            ),
          )}
        </ul>
      ) : null}
      {accepted.length > 0 ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={(): void => {
            setAccepted([]);
            setRejected([]);
          }}
        >
          Clear
        </Button>
      ) : null}
    </div>
  );
}

export const Controlled: Story = {
  render: (): ReactElement => <ControlledExample />,
  parameters: {
    docs: {
      description: {
        story:
          "A realistic wiring: the parent keeps its own `accepted` / `rejected` state and renders both sides. Rejections come with a stable `reason` code so the caller can localize / group them, and a human-readable `message` for direct display.",
      },
    },
  },
};

function ValidationPlayExample(): ReactElement {
  const [accepted, setAccepted] = useState<File[]>([]);
  const [rejected, setRejected] = useState<DropzoneRejection[]>([]);
  return (
    <div className="flex w-[420px] flex-col gap-3">
      <Dropzone
        data-testid="dropzone"
        multiple
        maxFiles={2}
        maxSize={1024}
        accept={["text/plain"]}
        onDrop={(next, rejections): void => {
          setAccepted(next);
          setRejected(rejections);
        }}
      />
      <output data-testid="accepted-count">{accepted.length}</output>
      <output data-testid="rejected-count">{rejected.length}</output>
      <ul data-testid="rejection-reasons">
        {rejected.map(
          (entry, index): ReactElement => (
            <li key={`${entry.file.name}-${index}`} data-reason={entry.reason}>
              {entry.file.name}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

export const ValidationBehavior: Story = {
  render: (): ReactElement => <ValidationPlayExample />,
  parameters: {
    docs: {
      description: {
        story:
          "Drives the hidden file input directly to verify that validation partitions dropped files correctly by MIME type, size, and count.",
      },
    },
  },
  play: async ({ canvasElement }): Promise<void> => {
    const canvas = within(canvasElement);
    const dropzone = canvas.getByTestId("dropzone");
    const input = dropzone.querySelector<HTMLInputElement>("input[type='file']");
    expect(input).not.toBeNull();
    if (!input) return;

    // Idle at first.
    await waitFor((): void => {
      expect(dropzone).toHaveAttribute("data-state", "idle");
    });

    const acceptedFile = new File(["hi"], "hello.txt", { type: "text/plain" });
    const tooLarge = new File([new Uint8Array(2048)], "big.txt", { type: "text/plain" });
    const wrongType = new File(["png"], "photo.png", { type: "image/png" });

    // Upload one valid + one too-large + one wrong-type in a single go, with
    // maxFiles=2: acceptedFile passes, tooLarge fails size, wrongType fails
    // type — none are over the count cap because only 1 slot was consumed.
    await userEvent.upload(input, [acceptedFile, tooLarge, wrongType]);

    await waitFor((): void => {
      expect(canvas.getByTestId("accepted-count")).toHaveTextContent("1");
      expect(canvas.getByTestId("rejected-count")).toHaveTextContent("2");
    });

    const reasons = canvas.getByTestId("rejection-reasons");
    expect(reasons.querySelector('[data-reason="file-too-large"]')).not.toBeNull();
    expect(reasons.querySelector('[data-reason="file-invalid-type"]')).not.toBeNull();

    // A wholly-rejected drop flips the visual state to `error`.
    await userEvent.upload(input, [wrongType]);
    await waitFor((): void => {
      expect(dropzone).toHaveAttribute("data-state", "error");
    });
  },
};

export const CustomRender: Story = {
  render: (): ReactElement => (
    <Dropzone
      multiple
      size="lg"
      variant="outline"
      accept="image/*"
      render={({ isDragActive, openPicker }): ReactElement => (
        <div className="flex w-full flex-col items-center gap-3">
          <ImagePlus
            className={
              isDragActive
                ? "text-primary transition-transform"
                : "text-muted-foreground transition-transform"
            }
          />
          <div className="flex flex-col items-center gap-1">
            <p className="text-base font-semibold text-foreground">
              {isDragActive ? "Release to drop images" : "Drag &amp; drop your images"}
            </p>
            <p className="text-xs text-muted-foreground">
              Or click below to browse — PNG, JPG, GIF, WEBP
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={(event): void => {
              // The click on the dropzone would open the picker too, but the
              // button variant makes it stand out and demoes wiring through
              // the render-prop's `openPicker` helper.
              event.stopPropagation();
              openPicker();
            }}
          >
            Choose files
          </Button>
        </div>
      )}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The `render` prop takes over the entire body. The dropzone still handles drag events, keyboard activation, and the hidden file input; the render prop just paints the content and receives the resolved state so it can react to drags.",
      },
    },
  },
};
