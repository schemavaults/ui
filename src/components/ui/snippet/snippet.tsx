"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import { CopyButton, type CopyButtonSize } from "@/components/ui/copy-button";
import {
  snippetSizeIds,
  snippetSymbolGlyphs,
  snippetSymbolIds,
  snippetVariantIds,
  type SnippetSize,
  type SnippetSymbol,
  type SnippetVariant,
} from "./snippet-variants";

const snippetContainerVariants = cva(
  "group/snippet inline-flex w-full max-w-full items-center overflow-hidden rounded-md border font-mono transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground",
        terminal:
          "border-zinc-800 bg-zinc-950 text-zinc-100 dark:border-zinc-700",
        subtle:
          "border-transparent bg-muted/60 text-muted-foreground",
        contrast: "border-foreground/10 bg-foreground text-background",
        brand:
          "border-schemavaults-brand-blue/30 bg-schemavaults-brand-blue/10 text-foreground",
      } satisfies Record<SnippetVariant, string>,
      size: {
        sm: "h-7 gap-1.5 pl-2 pr-1 text-xs",
        md: "h-9 gap-2 pl-3 pr-1.5 text-sm",
        lg: "h-11 gap-2.5 pl-4 pr-2 text-base",
      } satisfies Record<SnippetSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const snippetSymbolVariants = cva(
  "select-none font-mono leading-none",
  {
    variants: {
      variant: {
        default: "text-muted-foreground",
        terminal: "text-emerald-400",
        subtle: "text-muted-foreground/80",
        contrast: "text-background/60",
        brand: "text-schemavaults-brand-blue",
      } satisfies Record<SnippetVariant, string>,
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const snippetCopyButtonSizeByContainer = {
  sm: "icon-sm",
  md: "icon-sm",
  lg: "icon-md",
} satisfies Record<SnippetSize, CopyButtonSize>;

function resolveSymbolText(
  symbol: SnippetProps["symbol"],
): string | null {
  if (symbol === undefined || symbol === null) return snippetSymbolGlyphs.dollar;
  if (symbol === false) return null;
  if (symbol === true) return snippetSymbolGlyphs.dollar;
  if ((snippetSymbolIds as readonly string[]).includes(symbol)) {
    return snippetSymbolGlyphs[symbol as SnippetSymbol];
  }
  return symbol;
}

export interface SnippetProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof snippetContainerVariants> {
  /**
   * The command or single-line value to display. This is also what gets copied
   * to the clipboard unless `copyValue` is provided.
   */
  value: string;
  /**
   * Override the value that gets copied to the clipboard. Use this when the
   * visible value differs from what should actually land on the clipboard
   * (e.g. show `npm install foo` but copy `npm install foo --save-exact`).
   */
  copyValue?: string;
  /**
   * Prefix symbol shown before the value. Pass one of the built-in IDs
   * (e.g. `"dollar"`, `"bun"`, `"git"`) or an arbitrary string to render a
   * custom prompt. Pass `false` to hide the prefix entirely. Defaults to
   * `"dollar"` (`"$"`).
   */
  symbol?: SnippetSymbol | (string & {}) | boolean;
  /**
   * Hide the built-in copy button. Defaults to `false`.
   */
  hideCopyButton?: boolean;
  /**
   * Accessible label for the copy button. Defaults to
   * `"Copy snippet to clipboard"`.
   */
  copyAriaLabel?: string;
  ref?: Ref<HTMLDivElement>;
}

function Snippet({
  value,
  copyValue,
  symbol,
  variant,
  size,
  hideCopyButton = false,
  copyAriaLabel = "Copy snippet to clipboard",
  className,
  ref,
  ...props
}: SnippetProps): ReactElement {
  const symbolText: string | null = resolveSymbolText(symbol);
  const effectiveCopyValue: string = copyValue ?? value;
  const resolvedVariant: SnippetVariant = variant ?? "default";
  const resolvedSize: SnippetSize = size ?? "md";
  const copyButtonSize: CopyButtonSize =
    snippetCopyButtonSizeByContainer[resolvedSize];

  return (
    <div
      ref={ref}
      data-slot="snippet"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      className={cn(
        snippetContainerVariants({ variant, size }),
        className,
      )}
      {...props}
    >
      {symbolText !== null ? (
        <span
          aria-hidden="true"
          data-slot="snippet-symbol"
          className={snippetSymbolVariants({ variant })}
        >
          {symbolText}
        </span>
      ) : null}
      <span
        data-slot="snippet-value"
        className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap leading-none"
        title={value}
      >
        {value}
      </span>
      {hideCopyButton ? null : (
        <CopyButton
          data-slot="snippet-copy-button"
          value={effectiveCopyValue}
          size={copyButtonSize}
          variant="ghost"
          ariaLabel={copyAriaLabel}
          className="shrink-0"
        />
      )}
    </div>
  );
}
Snippet.displayName = "Snippet";

export {
  Snippet,
  snippetContainerVariants as snippetVariants,
  snippetSizeIds,
  snippetSymbolGlyphs,
  snippetSymbolIds,
  snippetVariantIds,
};
export type { SnippetSize, SnippetSymbol, SnippetVariant };

export default Snippet;
