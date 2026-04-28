"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  useMemo,
} from "react";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/copy-button";
import {
  type CodeBlockSize,
  type CodeBlockVariant,
  codeBlockSizeIds,
  codeBlockVariantIds,
} from "./code-block-variants";

const codeBlockVariants = cva(
  "relative overflow-hidden rounded-md border font-mono",
  {
    variants: {
      variant: {
        default:
          "border-border bg-muted text-foreground",
        terminal:
          "border-zinc-800 bg-zinc-950 text-zinc-100 dark:border-zinc-700",
        subtle:
          "border-transparent bg-muted/60 text-muted-foreground",
        contrast:
          "border-foreground/10 bg-foreground text-background",
      } satisfies Record<CodeBlockVariant, string>,
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      } satisfies Record<CodeBlockSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const codeBlockHeaderVariants = cva(
  "flex items-center justify-between gap-2 border-b px-3 py-2",
  {
    variants: {
      variant: {
        default: "border-border/60 bg-background/40",
        terminal: "border-zinc-800 bg-zinc-900/60",
        subtle: "border-transparent bg-transparent",
        contrast: "border-background/15 bg-foreground/95",
      } satisfies Record<CodeBlockVariant, string>,
      size: {
        sm: "text-[11px]",
        md: "text-xs",
        lg: "text-sm",
      } satisfies Record<CodeBlockSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const codeBlockBodyVariants = cva("overflow-auto", {
  variants: {
    size: {
      sm: "p-3 leading-5",
      md: "p-4 leading-6",
      lg: "p-5 leading-7",
    } satisfies Record<CodeBlockSize, string>,
    wrap: {
      true: "whitespace-pre-wrap break-words",
      false: "whitespace-pre",
    },
  },
  defaultVariants: {
    size: "md",
    wrap: false,
  },
});

const lineNumberVariants = cva(
  "select-none pr-4 text-right tabular-nums",
  {
    variants: {
      variant: {
        default: "text-muted-foreground/60",
        terminal: "text-zinc-500",
        subtle: "text-muted-foreground/50",
        contrast: "text-background/50",
      } satisfies Record<CodeBlockVariant, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface CodeBlockProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "title">,
    VariantProps<typeof codeBlockVariants> {
  /** The code/text content to render inside the block. */
  value: string;
  /**
   * Optional language label (e.g. "ts", "json", "bash") rendered in the
   * header. When provided, the header is shown.
   */
  language?: string;
  /**
   * Optional title (e.g. a file path) rendered in the header. When provided,
   * the header is shown.
   */
  title?: ReactNode;
  /** When true, displays line numbers in the gutter. Defaults to false. */
  showLineNumbers?: boolean;
  /**
   * When true, includes a copy-to-clipboard button in the header. Defaults
   * to true.
   */
  showCopyButton?: boolean;
  /**
   * When true, long lines wrap rather than scroll horizontally. Defaults to
   * false.
   */
  wrap?: boolean;
  /**
   * Optional max-height applied to the scroll container, e.g. "20rem".
   */
  maxHeight?: string;
  /**
   * Optional render function that returns highlighted nodes for a piece of
   * code. When omitted, code is rendered as plain text. When `showLineNumbers`
   * is enabled this is invoked once per line (with the line's text); when
   * disabled it is invoked once with the full `value`. The `language` prop is
   * passed through unchanged so consumers can dispatch on it.
   *
   * Example using a third-party highlighter:
   *
   *     <CodeBlock
   *       value={code}
   *       language="ts"
   *       highlight={(code, lang) => <SyntaxHighlighter language={lang}>{code}</SyntaxHighlighter>}
   *     />
   */
  highlight?: (value: string, language?: string) => ReactNode;
  /**
   * Optional ref to the outermost wrapper element.
   */
  ref?: Ref<HTMLDivElement>;
}

function CodeBlock({
  value,
  language,
  title,
  variant,
  size,
  showLineNumbers = false,
  showCopyButton = true,
  wrap = false,
  maxHeight,
  highlight,
  className,
  ref,
  ...props
}: CodeBlockProps): ReactElement {
  const lines: string[] = useMemo(
    (): string[] => value.split("\n"),
    [value],
  );

  const hasHeader: boolean =
    language !== undefined || title !== undefined || showCopyButton;

  const resolvedVariant: CodeBlockVariant = variant ?? "default";

  return (
    <div
      ref={ref}
      data-slot="code-block"
      data-variant={resolvedVariant}
      className={cn(codeBlockVariants({ variant, size }), className)}
      {...props}
    >
      {hasHeader && (
        <div
          data-slot="code-block-header"
          className={cn(codeBlockHeaderVariants({ variant, size }))}
        >
          <div className="flex min-w-0 items-center gap-2">
            {language !== undefined && (
              <span
                data-slot="code-block-language"
                className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[0.7em] font-semibold uppercase tracking-wide"
              >
                {language}
              </span>
            )}
            {title !== undefined && (
              <span
                data-slot="code-block-title"
                className="truncate font-sans text-[0.95em] font-medium opacity-90"
              >
                {title}
              </span>
            )}
          </div>
          {showCopyButton && (
            <CopyButton
              value={value}
              size="icon-sm"
              variant={resolvedVariant === "terminal" ? "ghost" : "ghost"}
              className={cn(
                resolvedVariant === "terminal" &&
                  "text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 data-[copied=true]:text-green-400",
                resolvedVariant === "contrast" &&
                  "text-background hover:bg-background/10 hover:text-background data-[copied=true]:text-background",
              )}
            />
          )}
        </div>
      )}

      <div
        data-slot="code-block-body"
        className={cn(codeBlockBodyVariants({ size, wrap }))}
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        <pre className="m-0 min-w-full">
          {showLineNumbers ? (
            <code className="grid grid-cols-[auto_1fr]">
              {lines.map((line, idx): ReactElement => (
                <LineRow
                  key={idx}
                  number={idx + 1}
                  content={highlight ? highlight(line, language) : line}
                  empty={line.length === 0}
                  variant={resolvedVariant}
                />
              ))}
            </code>
          ) : (
            <code>{highlight ? highlight(value, language) : value}</code>
          )}
        </pre>
      </div>
    </div>
  );
}
CodeBlock.displayName = "CodeBlock";

interface LineRowProps {
  number: number;
  content: ReactNode;
  empty: boolean;
  variant: CodeBlockVariant;
}

function LineRow({
  number,
  content,
  empty,
  variant,
}: LineRowProps): ReactElement {
  return (
    <>
      <span
        aria-hidden="true"
        data-slot="code-block-line-number"
        className={cn(lineNumberVariants({ variant }))}
      >
        {number}
      </span>
      <span data-slot="code-block-line">{empty ? "​" : content}</span>
    </>
  );
}

export {
  CodeBlock,
  codeBlockVariants,
  codeBlockSizeIds,
  codeBlockVariantIds,
};
export type { CodeBlockSize, CodeBlockVariant };

export default CodeBlock;
