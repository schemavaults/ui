import type { Meta, StoryObj } from "@storybook/react";
import { useState, type ReactElement } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationControls,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import {
  paginationShapeIds,
  paginationSizeIds,
  paginationVariantIds,
  type PaginationShape,
  type PaginationSize,
  type PaginationVariant,
} from "./pagination-variants";

interface PaginationExampleProps {
  totalPages?: number;
  initialPage?: number;
  size?: PaginationSize;
  variant?: PaginationVariant;
  shape?: PaginationShape;
  siblingCount?: number;
  boundaryCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  iconOnlyPrevNext?: boolean;
  disabled?: boolean;
}

function PaginationExample({
  totalPages = 10,
  initialPage = 1,
  size,
  variant,
  shape,
  siblingCount,
  boundaryCount,
  showFirstLast,
  showPrevNext,
  iconOnlyPrevNext,
  disabled,
}: PaginationExampleProps): ReactElement {
  const [page, setPage] = useState<number>(initialPage);
  return (
    <div className="flex flex-col items-center gap-3">
      <PaginationControls
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        size={size}
        variant={variant}
        shape={shape}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        showFirstLast={showFirstLast}
        showPrevNext={showPrevNext}
        iconOnlyPrevNext={iconOnlyPrevNext}
        disabled={disabled}
      />
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </p>
    </div>
  );
}

const meta = {
  title: "Components/Pagination",
  component: PaginationExample,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    totalPages: {
      control: { type: "number", min: 1, max: 200, step: 1 },
    },
    initialPage: {
      control: { type: "number", min: 1, step: 1 },
    },
    size: {
      options: paginationSizeIds,
      control: { type: "radio" },
    },
    variant: {
      options: paginationVariantIds,
      control: { type: "radio" },
    },
    shape: {
      options: paginationShapeIds,
      control: { type: "radio" },
    },
    siblingCount: {
      control: { type: "number", min: 0, max: 4, step: 1 },
    },
    boundaryCount: {
      control: { type: "number", min: 0, max: 4, step: 1 },
    },
    showFirstLast: { control: { type: "boolean" } },
    showPrevNext: { control: { type: "boolean" } },
    iconOnlyPrevNext: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    totalPages: 10,
    initialPage: 1,
    size: "default",
    variant: "default",
    shape: "rounded",
    siblingCount: 1,
    boundaryCount: 1,
    showFirstLast: false,
    showPrevNext: true,
    iconOnlyPrevNext: false,
    disabled: false,
  },
} satisfies Meta<typeof PaginationExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultPagination: Story = {};

export const ManyPages: Story = {
  args: {
    totalPages: 50,
    initialPage: 17,
  },
};

export const FewPages: Story = {
  args: {
    totalPages: 4,
    initialPage: 2,
  },
};

export const OutlineVariant: Story = {
  args: {
    variant: "outline",
    totalPages: 12,
    initialPage: 5,
  },
};

export const GhostVariant: Story = {
  args: {
    variant: "ghost",
    totalPages: 12,
    initialPage: 5,
  },
};

export const SmallSize: Story = {
  args: {
    size: "sm",
    totalPages: 20,
    initialPage: 8,
  },
};

export const LargeSize: Story = {
  args: {
    size: "lg",
    totalPages: 8,
    initialPage: 3,
  },
};

export const PillShape: Story = {
  args: {
    shape: "pill",
    variant: "outline",
    totalPages: 14,
    initialPage: 7,
  },
};

export const SquareShape: Story = {
  args: {
    shape: "square",
    variant: "outline",
    totalPages: 14,
    initialPage: 7,
  },
};

export const WithFirstLastJump: Story = {
  args: {
    showFirstLast: true,
    totalPages: 30,
    initialPage: 12,
  },
};

export const IconOnlyPrevNext: Story = {
  args: {
    iconOnlyPrevNext: true,
    totalPages: 20,
    initialPage: 5,
  },
};

export const WiderSiblings: Story = {
  args: {
    siblingCount: 2,
    boundaryCount: 1,
    totalPages: 30,
    initialPage: 15,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    totalPages: 12,
    initialPage: 4,
  },
};

export const ComposedManually: Story = {
  render: (): ReactElement => (
    <Pagination variant="outline">
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">7</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            8
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">9</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">42</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};
