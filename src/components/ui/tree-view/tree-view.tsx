"use client";

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  treeViewSizeIds,
  treeViewVariantIds,
  type TreeViewSize,
  type TreeViewVariant,
} from "./tree-view-variants";

export { treeViewSizeIds, treeViewVariantIds };
export type { TreeViewSize, TreeViewVariant };

export interface TreeNode {
  /** Stable unique identifier for the node. */
  id: string;
  /** Visible label. Strings enable type-ahead navigation. */
  label: ReactNode;
  /** Optional icon rendered before the label. */
  icon?: ReactNode;
  /**
   * Child nodes. A defined `children` array (even when empty) marks the
   * node as an expandable branch; omit it for leaf nodes.
   */
  children?: TreeNode[];
  /** Disable interaction (selection / expansion) for this node. */
  disabled?: boolean;
}

export const treeViewVariants = cva("w-full select-none", {
  variants: {
    size: {
      sm: "text-xs",
      default: "text-sm",
      lg: "text-base",
    } satisfies Record<TreeViewSize, string>,
  },
  defaultVariants: {
    size: "default",
  },
});

export const treeViewItemVariants = cva(
  "group/tree-item relative flex w-full cursor-pointer items-center gap-1.5 rounded-md outline-none ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "min-h-7 py-1 pr-2 text-xs",
        default: "min-h-8 py-1.5 pr-2.5 text-sm",
        lg: "min-h-10 py-2 pr-3 text-base",
      } satisfies Record<TreeViewSize, string>,
      variant: {
        default:
          "text-foreground hover:bg-muted aria-selected:bg-accent aria-selected:text-accent-foreground aria-selected:hover:bg-accent",
        ghost:
          "text-muted-foreground hover:bg-muted hover:text-foreground aria-selected:bg-transparent aria-selected:font-semibold aria-selected:text-foreground",
      } satisfies Record<TreeViewVariant, string>,
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  },
);

interface FlatNode {
  node: TreeNode;
  level: number;
  parentId: string | null;
  isBranch: boolean;
}

function isBranchNode(node: TreeNode): boolean {
  return Array.isArray(node.children);
}

function flattenVisible(
  nodes: TreeNode[],
  expanded: ReadonlySet<string>,
  level: number,
  parentId: string | null,
  acc: FlatNode[],
): void {
  for (const node of nodes) {
    const branch = isBranchNode(node);
    acc.push({ node, level, parentId, isBranch: branch });
    if (branch && expanded.has(node.id) && node.children) {
      flattenVisible(node.children, expanded, level + 1, node.id, acc);
    }
  }
}

interface TreeViewContextValue {
  selectedId: string | null;
  focusedId: string | null;
  expandedIds: ReadonlySet<string>;
  size: TreeViewSize;
  variant: TreeViewVariant;
  showGuides: boolean;
  flat: FlatNode[];
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  toggleExpanded: (id: string) => void;
  select: (id: string) => void;
  focusNode: (id: string) => void;
  handleKeyDown: (event: KeyboardEvent<HTMLDivElement>, id: string) => void;
}

const TreeViewContext = createContext<TreeViewContextValue | null>(null);

function useTreeViewContext(): TreeViewContextValue {
  const ctx = useContext(TreeViewContext);
  if (!ctx) {
    throw new Error("TreeView items must be rendered inside a <TreeView />");
  }
  return ctx;
}

export interface TreeViewProps
  extends Omit<
      HTMLAttributes<HTMLUListElement>,
      "onSelect" | "defaultValue"
    >,
    VariantProps<typeof treeViewVariants> {
  /** Hierarchical node data. */
  data: TreeNode[];
  /** Controlled set of expanded node ids. */
  expandedIds?: string[];
  /** Initial expanded node ids when uncontrolled. */
  defaultExpandedIds?: string[];
  /** Called whenever the expanded set changes. */
  onExpandedChange?: (ids: string[]) => void;
  /** Controlled selected node id (`null` for none). */
  selectedId?: string | null;
  /** Initial selected node id when uncontrolled. */
  defaultSelectedId?: string | null;
  /** Called when the selected node changes. */
  onSelectionChange?: (id: string | null) => void;
  /** Render vertical indent guide lines. Defaults to `true`. */
  showGuides?: boolean;
  /** Visual styling variant. */
  variant?: TreeViewVariant;
  ref?: Ref<HTMLUListElement>;
}

function TreeView({
  data,
  className,
  size,
  variant,
  expandedIds: expandedProp,
  defaultExpandedIds,
  onExpandedChange,
  selectedId: selectedProp,
  defaultSelectedId = null,
  onSelectionChange,
  showGuides = true,
  "aria-label": ariaLabel,
  ref,
  ...props
}: TreeViewProps): ReactElement {
  const labelId = useId();
  const resolvedSize: TreeViewSize = size ?? "default";
  const resolvedVariant: TreeViewVariant = variant ?? "default";

  const [uncontrolledExpanded, setUncontrolledExpanded] = useState<Set<string>>(
    () => new Set(defaultExpandedIds ?? []),
  );
  const isExpandedControlled = expandedProp !== undefined;
  const expandedIds = useMemo<ReadonlySet<string>>(
    () => (isExpandedControlled ? new Set(expandedProp) : uncontrolledExpanded),
    [isExpandedControlled, expandedProp, uncontrolledExpanded],
  );

  const [uncontrolledSelected, setUncontrolledSelected] = useState<
    string | null
  >(defaultSelectedId);
  const isSelectionControlled = selectedProp !== undefined;
  const selectedId = isSelectionControlled
    ? (selectedProp ?? null)
    : uncontrolledSelected;

  const [focusedId, setFocusedId] = useState<string | null>(null);

  const refMap = useRef<Map<string, HTMLDivElement>>(new Map());
  const registerRef = useCallback(
    (id: string, el: HTMLDivElement | null): void => {
      if (el) {
        refMap.current.set(id, el);
      } else {
        refMap.current.delete(id);
      }
    },
    [],
  );

  const flat = useMemo<FlatNode[]>(() => {
    const acc: FlatNode[] = [];
    flattenVisible(data, expandedIds, 0, null, acc);
    return acc;
  }, [data, expandedIds]);

  const toggleExpanded = useCallback(
    (id: string): void => {
      const next = new Set(expandedIds);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      if (!isExpandedControlled) {
        setUncontrolledExpanded(next);
      }
      onExpandedChange?.(Array.from(next));
    },
    [expandedIds, isExpandedControlled, onExpandedChange],
  );

  const setExpanded = useCallback(
    (id: string, shouldExpand: boolean): void => {
      const has = expandedIds.has(id);
      if (has === shouldExpand) return;
      toggleExpanded(id);
    },
    [expandedIds, toggleExpanded],
  );

  const select = useCallback(
    (id: string): void => {
      if (!isSelectionControlled) {
        setUncontrolledSelected(id);
      }
      onSelectionChange?.(id);
    },
    [isSelectionControlled, onSelectionChange],
  );

  const focusNode = useCallback((id: string): void => {
    setFocusedId(id);
    refMap.current.get(id)?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>, id: string): void => {
      const index = flat.findIndex((f) => f.node.id === id);
      if (index === -1) return;
      const current = flat[index];

      const moveTo = (target: number): void => {
        for (let i = target; i >= 0 && i < flat.length; ) {
          const candidate = flat[i];
          if (!candidate.node.disabled) {
            event.preventDefault();
            focusNode(candidate.node.id);
            return;
          }
          i += target >= index ? 1 : -1;
        }
      };

      switch (event.key) {
        case "ArrowDown":
          moveTo(index + 1);
          break;
        case "ArrowUp":
          moveTo(index - 1);
          break;
        case "Home":
          moveTo(0);
          break;
        case "End":
          moveTo(flat.length - 1);
          break;
        case "ArrowRight": {
          if (current.node.disabled) break;
          if (current.isBranch && !expandedIds.has(id)) {
            event.preventDefault();
            setExpanded(id, true);
          } else if (current.isBranch) {
            moveTo(index + 1);
          }
          break;
        }
        case "ArrowLeft": {
          if (current.node.disabled) break;
          if (current.isBranch && expandedIds.has(id)) {
            event.preventDefault();
            setExpanded(id, false);
          } else if (current.parentId) {
            event.preventDefault();
            focusNode(current.parentId);
          }
          break;
        }
        case "Enter":
        case " ": {
          if (current.node.disabled) break;
          event.preventDefault();
          select(id);
          if (current.isBranch) {
            toggleExpanded(id);
          }
          break;
        }
        default: {
          if (event.key.length === 1 && /\S/.test(event.key)) {
            const lower = event.key.toLowerCase();
            const ordered = [
              ...flat.slice(index + 1),
              ...flat.slice(0, index + 1),
            ];
            const match = ordered.find(
              (f) =>
                !f.node.disabled &&
                typeof f.node.label === "string" &&
                f.node.label.toLowerCase().startsWith(lower),
            );
            if (match) {
              event.preventDefault();
              focusNode(match.node.id);
            }
          }
        }
      }
    },
    [
      flat,
      expandedIds,
      focusNode,
      setExpanded,
      toggleExpanded,
      select,
    ],
  );

  const firstFocusableId = useMemo<string | null>(() => {
    const first = flat.find((f) => !f.node.disabled);
    return first ? first.node.id : null;
  }, [flat]);

  const ctx = useMemo<TreeViewContextValue>(
    () => ({
      selectedId,
      focusedId: focusedId ?? selectedId ?? firstFocusableId,
      expandedIds,
      size: resolvedSize,
      variant: resolvedVariant,
      showGuides,
      flat,
      registerRef,
      toggleExpanded,
      select,
      focusNode,
      handleKeyDown,
    }),
    [
      selectedId,
      focusedId,
      firstFocusableId,
      expandedIds,
      resolvedSize,
      resolvedVariant,
      showGuides,
      flat,
      registerRef,
      toggleExpanded,
      select,
      focusNode,
      handleKeyDown,
    ],
  );

  return (
    <TreeViewContext.Provider value={ctx}>
      <ul
        ref={ref}
        role="tree"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : labelId}
        className={cn(treeViewVariants({ size: resolvedSize }), className)}
        {...props}
      >
        {data.map((node) => (
          <TreeViewItem key={node.id} node={node} level={0} />
        ))}
      </ul>
    </TreeViewContext.Provider>
  );
}
TreeView.displayName = "TreeView";

interface TreeViewItemProps {
  node: TreeNode;
  level: number;
}

function TreeViewItem({ node, level }: TreeViewItemProps): ReactElement {
  const {
    selectedId,
    focusedId,
    expandedIds,
    size,
    variant,
    showGuides,
    registerRef,
    toggleExpanded,
    select,
    focusNode,
    handleKeyDown,
  } = useTreeViewContext();

  const branch = isBranchNode(node);
  const expanded = branch && expandedIds.has(node.id);
  const selected = selectedId === node.id;
  const isTabbable = focusedId === node.id;
  const disabled = node.disabled ?? false;

  const indentStep =
    size === "sm" ? 14 : size === "lg" ? 22 : 18;
  const paddingLeft = level * indentStep + 8;

  const onRowClick = useCallback(
    (event: MouseEvent<HTMLDivElement>): void => {
      if (disabled) return;
      event.stopPropagation();
      focusNode(node.id);
      select(node.id);
      if (branch) {
        toggleExpanded(node.id);
      }
    },
    [disabled, branch, node.id, focusNode, select, toggleExpanded],
  );

  const onChevronClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation();
      if (disabled) return;
      focusNode(node.id);
      toggleExpanded(node.id);
    },
    [disabled, node.id, focusNode, toggleExpanded],
  );

  return (
    <li role="none">
      <div
        ref={(el): void => registerRef(node.id, el)}
        role="treeitem"
        aria-selected={selected}
        aria-expanded={branch ? expanded : undefined}
        aria-disabled={disabled || undefined}
        aria-level={level + 1}
        tabIndex={isTabbable && !disabled ? 0 : -1}
        data-state={selected ? "selected" : "idle"}
        onClick={onRowClick}
        onKeyDown={(event): void => handleKeyDown(event, node.id)}
        style={{ paddingLeft }}
        className={cn(treeViewItemVariants({ size, variant }))}
      >
        {showGuides && level > 0 ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex"
          >
            {Array.from({ length: level }).map((_, i) => (
              <span
                key={i}
                className="border-l border-border/60"
                style={{ width: indentStep, marginLeft: i === 0 ? 8 : 0 }}
              />
            ))}
          </span>
        ) : null}

        {branch ? (
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            disabled={disabled}
            onClick={onChevronClick}
            className="flex size-4 shrink-0 items-center justify-center rounded text-muted-foreground transition-transform hover:text-foreground"
          >
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform duration-150",
                expanded && "rotate-90",
              )}
            />
          </button>
        ) : (
          <span aria-hidden="true" className="size-4 shrink-0" />
        )}

        {node.icon ? (
          <span className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4 group-aria-selected/tree-item:text-current">
            {node.icon}
          </span>
        ) : null}

        <span className="truncate">{node.label}</span>
      </div>

      {branch && expanded && node.children && node.children.length > 0 ? (
        <ul role="group">
          {node.children.map((child) => (
            <TreeViewItem key={child.id} node={child} level={level + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}
TreeViewItem.displayName = "TreeViewItem";

export { TreeView, TreeViewItem };
