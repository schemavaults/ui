"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type HTMLAttributes,
  type ReactElement,
  type Ref,
} from "react";

import { cn } from "@/lib/utils";
import { CopyButton } from "@/components/ui/copy-button";
import {
  type JsonViewerSize,
  type JsonViewerVariant,
  jsonViewerSizeIds,
  jsonViewerVariantIds,
} from "./json-viewer-variants";

const jsonViewerVariants = cva(
  "relative overflow-hidden rounded-md border font-mono",
  {
    variants: {
      variant: {
        default: "border-border bg-muted text-foreground",
        terminal:
          "border-zinc-800 bg-zinc-950 text-zinc-100 dark:border-zinc-700",
        subtle: "border-transparent bg-muted/60 text-muted-foreground",
        contrast: "border-foreground/10 bg-foreground text-background",
      } satisfies Record<JsonViewerVariant, string>,
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      } satisfies Record<JsonViewerSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

const jsonViewerHeaderVariants = cva(
  "flex items-center justify-between gap-2 border-b px-3 py-2",
  {
    variants: {
      variant: {
        default: "border-border bg-background/40",
        terminal: "border-zinc-800 bg-zinc-900/80 text-zinc-200",
        subtle: "border-transparent bg-transparent",
        contrast: "border-foreground/10 bg-foreground/5 text-background",
      } satisfies Record<JsonViewerVariant, string>,
    },
    defaultVariants: { variant: "default" },
  },
);

const jsonViewerBodyVariants = cva("overflow-auto", {
  variants: {
    size: {
      sm: "px-3 py-2",
      md: "px-4 py-3",
      lg: "px-5 py-4",
    } satisfies Record<JsonViewerSize, string>,
  },
  defaultVariants: { size: "md" },
});

type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface JsonViewerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof jsonViewerVariants> {
  /** The JSON-serializable value to render. */
  value: JsonValue;
  /** Optional title shown in the header. */
  title?: string;
  /**
   * Expand nodes up to this depth by default. `Infinity` to expand all.
   * @default 1
   */
  defaultExpandLevel?: number;
  /** Show the copy-to-clipboard button. Defaults to true. */
  showCopyButton?: boolean;
  /** Show a header bar (only rendered when there is content to display). */
  showHeader?: boolean;
  /** Optional max-height for the body. Pass a CSS value e.g. "20rem". */
  maxHeight?: string;
  /** Show the number of items next to each object/array preview. */
  showItemCount?: boolean;
  /** Pretty-print indentation used by the copy button payload. Defaults to 2. */
  copyIndent?: number;
  /** Ref to the outermost wrapper. */
  ref?: Ref<HTMLDivElement>;
}

function JsonViewer({
  value,
  title,
  variant,
  size,
  defaultExpandLevel = 1,
  showCopyButton = true,
  showHeader,
  maxHeight,
  showItemCount = true,
  copyIndent = 2,
  className,
  ref,
  ...props
}: JsonViewerProps): ReactElement {
  const resolvedVariant: JsonViewerVariant = variant ?? "default";
  const resolvedSize: JsonViewerSize = size ?? "md";

  const copyPayload: string = useMemo(
    (): string => safeStringify(value, copyIndent),
    [value, copyIndent],
  );

  const headerVisible: boolean =
    showHeader ?? (title !== undefined || showCopyButton);

  return (
    <div
      ref={ref}
      data-slot="json-viewer"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      className={cn(jsonViewerVariants({ variant, size }), className)}
      {...props}
    >
      {headerVisible && (
        <div
          data-slot="json-viewer-header"
          className={cn(jsonViewerHeaderVariants({ variant: resolvedVariant }))}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span
              data-slot="json-viewer-language"
              className="rounded bg-foreground/10 px-1.5 py-0.5 font-mono text-[0.7em] font-semibold uppercase tracking-wide"
            >
              JSON
            </span>
            {title !== undefined && (
              <span
                data-slot="json-viewer-title"
                className="truncate font-sans text-[0.95em] font-medium opacity-90"
              >
                {title}
              </span>
            )}
          </div>
          {showCopyButton && (
            <CopyButton
              value={copyPayload}
              size="icon-sm"
              variant="ghost"
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
        data-slot="json-viewer-body"
        className={cn(jsonViewerBodyVariants({ size: resolvedSize }))}
        style={maxHeight !== undefined ? { maxHeight } : undefined}
      >
        <JsonNode
          value={value}
          depth={0}
          defaultExpandLevel={defaultExpandLevel}
          variant={resolvedVariant}
          showItemCount={showItemCount}
          isLast
        />
      </div>
    </div>
  );
}
JsonViewer.displayName = "JsonViewer";

interface JsonNodeProps {
  value: JsonValue;
  depth: number;
  defaultExpandLevel: number;
  variant: JsonViewerVariant;
  showItemCount: boolean;
  /** Optional object key when this node is a property of a parent object. */
  propertyKey?: string;
  /** Whether this is the last child in its parent (for the trailing comma). */
  isLast: boolean;
}

const JsonNode = memo(function JsonNode({
  value,
  depth,
  defaultExpandLevel,
  variant,
  showItemCount,
  propertyKey,
  isLast,
}: JsonNodeProps): ReactElement {
  const kind: JsonKind = getKind(value);
  const isComposite: boolean = kind === "object" || kind === "array";
  const [open, setOpen] = useState<boolean>(depth < defaultExpandLevel);

  const toggle = useCallback((): void => {
    setOpen((prev) => !prev);
  }, []);

  if (!isComposite) {
    return (
      <div className="flex items-start whitespace-pre-wrap break-words leading-relaxed">
        {propertyKey !== undefined && (
          <PropertyKey name={propertyKey} variant={variant} />
        )}
        <PrimitiveValue value={value as JsonPrimitive} variant={variant} />
        {!isLast && <Punct variant={variant}>,</Punct>}
      </div>
    );
  }

  const items: ReadonlyArray<[string, JsonValue]> =
    kind === "array"
      ? (value as JsonValue[]).map((v, i): [string, JsonValue] => [String(i), v])
      : Object.entries(value as { [key: string]: JsonValue });

  const openBracket: string = kind === "array" ? "[" : "{";
  const closeBracket: string = kind === "array" ? "]" : "}";
  const empty: boolean = items.length === 0;
  const itemCount: number = items.length;

  return (
    <div className="leading-relaxed">
      <div className="flex items-start whitespace-pre-wrap break-words">
        <button
          type="button"
          onClick={empty ? undefined : toggle}
          aria-expanded={empty ? undefined : open}
          aria-label={open ? "Collapse" : "Expand"}
          data-slot="json-viewer-toggle"
          className={cn(
            "mr-1 mt-[0.15em] inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-colors",
            empty
              ? "cursor-default opacity-30"
              : "cursor-pointer opacity-60 hover:opacity-100 hover:bg-foreground/10",
          )}
        >
          <ChevronRight
            aria-hidden
            className={cn(
              "h-3 w-3 transition-transform",
              open && !empty ? "rotate-90" : "rotate-0",
            )}
          />
        </button>
        {propertyKey !== undefined && (
          <PropertyKey name={propertyKey} variant={variant} />
        )}
        <Punct variant={variant}>{openBracket}</Punct>
        {empty ? (
          <Punct variant={variant}>{closeBracket}</Punct>
        ) : open ? null : (
          <>
            <button
              type="button"
              onClick={toggle}
              aria-label="Expand"
              className={cn(
                "mx-1 cursor-pointer italic opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-sm",
                getMutedClass(variant),
              )}
            >
              {showItemCount
                ? kind === "array"
                  ? `${itemCount} item${itemCount === 1 ? "" : "s"}`
                  : `${itemCount} ${itemCount === 1 ? "key" : "keys"}`
                : "…"}
            </button>
            <Punct variant={variant}>{closeBracket}</Punct>
          </>
        )}
        {!isLast && !open && <Punct variant={variant}>,</Punct>}
      </div>

      {open && !empty && (
        <div
          data-slot="json-viewer-children"
          className={cn(
            "ml-[0.5rem] border-l pl-3",
            getGuideClass(variant),
          )}
        >
          {items.map(([key, child], idx): ReactElement => (
            <JsonNode
              key={key}
              value={child}
              depth={depth + 1}
              defaultExpandLevel={defaultExpandLevel}
              variant={variant}
              showItemCount={showItemCount}
              propertyKey={kind === "object" ? key : undefined}
              isLast={idx === items.length - 1}
            />
          ))}
        </div>
      )}

      {open && !empty && (
        <div className="flex items-start whitespace-pre-wrap break-words">
          <span className="mr-1 inline-block w-4 shrink-0" aria-hidden />
          <Punct variant={variant}>{closeBracket}</Punct>
          {!isLast && <Punct variant={variant}>,</Punct>}
        </div>
      )}
    </div>
  );
});

type JsonKind = "string" | "number" | "boolean" | "null" | "object" | "array";

function getKind(value: JsonValue): JsonKind {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean") return t;
  return "object";
}

function PropertyKey({
  name,
  variant,
}: {
  name: string;
  variant: JsonViewerVariant;
}): ReactElement {
  return (
    <>
      <span
        data-slot="json-viewer-key"
        className={cn("font-medium", getKeyClass(variant))}
      >
        {JSON.stringify(name)}
      </span>
      <Punct variant={variant}>:&nbsp;</Punct>
    </>
  );
}

function PrimitiveValue({
  value,
  variant,
}: {
  value: JsonPrimitive;
  variant: JsonViewerVariant;
}): ReactElement {
  if (value === null) {
    return (
      <span
        data-slot="json-viewer-null"
        className={cn("italic", getNullClass(variant))}
      >
        null
      </span>
    );
  }
  if (typeof value === "string") {
    return (
      <span
        data-slot="json-viewer-string"
        className={getStringClass(variant)}
      >
        {JSON.stringify(value)}
      </span>
    );
  }
  if (typeof value === "number") {
    return (
      <span
        data-slot="json-viewer-number"
        className={getNumberClass(variant)}
      >
        {Number.isFinite(value) ? String(value) : JSON.stringify(value)}
      </span>
    );
  }
  return (
    <span
      data-slot="json-viewer-boolean"
      className={getBooleanClass(variant)}
    >
      {String(value)}
    </span>
  );
}

function Punct({
  variant,
  children,
}: {
  variant: JsonViewerVariant;
  children: string;
}): ReactElement {
  return (
    <span aria-hidden className={getPunctClass(variant)}>
      {children}
    </span>
  );
}

function getKeyClass(variant: JsonViewerVariant): string {
  switch (variant) {
    case "terminal":
      return "text-sky-300";
    case "contrast":
      return "text-background";
    default:
      return "text-foreground";
  }
}

function getStringClass(variant: JsonViewerVariant): string {
  switch (variant) {
    case "terminal":
      return "text-emerald-300";
    case "contrast":
      return "text-background/90";
    default:
      return "text-emerald-700 dark:text-emerald-400";
  }
}

function getNumberClass(variant: JsonViewerVariant): string {
  switch (variant) {
    case "terminal":
      return "text-amber-300";
    case "contrast":
      return "text-background/90";
    default:
      return "text-amber-700 dark:text-amber-400";
  }
}

function getBooleanClass(variant: JsonViewerVariant): string {
  switch (variant) {
    case "terminal":
      return "text-violet-300";
    case "contrast":
      return "text-background/90";
    default:
      return "text-violet-700 dark:text-violet-400";
  }
}

function getNullClass(variant: JsonViewerVariant): string {
  switch (variant) {
    case "terminal":
      return "text-zinc-400";
    case "contrast":
      return "text-background/60";
    default:
      return "text-muted-foreground";
  }
}

function getPunctClass(variant: JsonViewerVariant): string {
  switch (variant) {
    case "terminal":
      return "text-zinc-400";
    case "contrast":
      return "text-background/60";
    default:
      return "text-muted-foreground";
  }
}

function getMutedClass(variant: JsonViewerVariant): string {
  switch (variant) {
    case "terminal":
      return "text-zinc-400";
    case "contrast":
      return "text-background/70";
    default:
      return "text-muted-foreground";
  }
}

function getGuideClass(variant: JsonViewerVariant): string {
  switch (variant) {
    case "terminal":
      return "border-zinc-800";
    case "contrast":
      return "border-background/15";
    default:
      return "border-border";
  }
}

function safeStringify(value: JsonValue, indent: number): string {
  try {
    return JSON.stringify(value, null, indent);
  } catch {
    return "";
  }
}

export {
  JsonViewer,
  jsonViewerVariants,
  jsonViewerVariantIds,
  jsonViewerSizeIds,
};
export type { JsonViewerSize, JsonViewerVariant };

export default JsonViewer;
