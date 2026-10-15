/**
 * Auto-resize for `<PromptInputTextarea>`, kept free of React and of a real
 * DOM so it can be unit tested: a test stands in for the `<textarea>` and
 * supplies the `scrollHeight` and computed style that only a browser can lay
 * out.
 *
 * Heights are border-box heights — what the textarea measures on the page —
 * unless a name says otherwise.
 */

/** The parts of a `<textarea>` the sizing reads and writes. */
export interface PromptInputTextareaSizingTarget {
  readonly style: { height: string; minHeight: string; overflowY: string };
  /** Content plus padding, as `HTMLElement.scrollHeight` reports it. */
  readonly scrollHeight: number;
  /** Padding-box height, as `HTMLElement.clientHeight` reports it. */
  readonly clientHeight: number;
  /** Border-box height, as `HTMLElement.offsetHeight` reports it. */
  readonly offsetHeight: number;
}

/**
 * The computed style properties the sizing reads. Live, the way
 * `getComputedStyle` returns them: the sizing clears its own inline
 * `min-height` before it reads `minHeight`, to see the stylesheet's.
 */
export type PromptInputTextareaComputedStyle = Pick<
  CSSStyleDeclaration,
  | "boxSizing"
  | "lineHeight"
  | "fontSize"
  | "minHeight"
  | "paddingTop"
  | "paddingBottom"
  | "borderTopWidth"
  | "borderBottomWidth"
>;

/** What the sizing remembers about one textarea between runs. */
export interface PromptInputTextareaSizingState {
  /**
   * The inline `height` as the sizing last wrote or saw it. Any other value
   * was set by someone else: in practice the user dragging the resize
   * handle, which the browser applies as an inline `height`.
   */
  lastInlineHeight: string | null;
  /** The height the user last dragged the textarea to, if they have. */
  userHeightPx: number | null;
  /**
   * The inline `min-height` the sizing last wrote, or null if it has none
   * in place. Only that value is ever cleared, never a consumer's own.
   */
  lastInlineMinHeight: string | null;
}

export type PromptInputTextareaRowsMinHeightOptions = Pick<
  PromptInputTextareaSizingOptions,
  "rows" | "resizable"
>;

export interface PromptInputTextareaSizingOptions {
  /** Fewest lines of text to show. */
  rows: number;
  /** Where auto-grow stops and the textarea starts scrolling. */
  maxHeightPx: number;
  /** Keep the height the user drags the textarea to as its floor. */
  resizable: boolean;
}

function px(value: string): number {
  const parsed: number = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * The computed line height in pixels. `normal` depends on the font, so it
 * falls back to the usual 1.2 × font size.
 */
export function resolveLineHeightPx(lineHeight: string, fontSize: string): number {
  if (lineHeight.endsWith("px")) return px(lineHeight);
  const multiplier: number = Number.parseFloat(lineHeight);
  return (Number.isFinite(multiplier) ? multiplier : 1.2) * px(fontSize);
}

function verticalPaddingPx(style: PromptInputTextareaComputedStyle): number {
  return px(style.paddingTop) + px(style.paddingBottom);
}

function verticalBorderPx(style: PromptInputTextareaComputedStyle): number {
  return px(style.borderTopWidth) + px(style.borderBottomWidth);
}

/**
 * The height that shows `rows` lines of text: the floor `rows` puts under
 * auto-resize. One row needs no floor of its own, because even an empty
 * textarea measures a line tall.
 */
export function rowsMinHeightPx(
  rows: number,
  style: PromptInputTextareaComputedStyle,
): number {
  if (!Number.isFinite(rows) || rows <= 1) return 0;
  return (
    rows * resolveLineHeightPx(style.lineHeight, style.fontSize) +
    verticalPaddingPx(style) +
    verticalBorderPx(style)
  );
}

/** Convert a border-box height to what `style.height`/`min-height` take. */
function styleHeightPx(
  borderBoxHeightPx: number,
  style: PromptInputTextareaComputedStyle,
): number {
  return style.boxSizing === "content-box"
    ? borderBoxHeightPx - verticalPaddingPx(style) - verticalBorderPx(style)
    : borderBoxHeightPx;
}

/**
 * While the textarea is resizable, make the `rows` floor a CSS minimum, so
 * the browser stops a drag of the resize handle there rather than at the
 * size's `min-h-*`. The inline style is written only when the floor is taller
 * than the stylesheet's own minimum, which it would otherwise override.
 * Without `resizable` nothing can be dragged, and the textarea has no inline
 * `min-height` from the sizing.
 *
 * Run whenever anything the floor depends on changes: `rows`, `resizable`,
 * or the font, line height and padding that come with the size.
 */
export function syncPromptInputTextareaRowsMinHeight(
  target: PromptInputTextareaSizingTarget,
  style: PromptInputTextareaComputedStyle,
  { rows, resizable }: PromptInputTextareaRowsMinHeightOptions,
  state: PromptInputTextareaSizingState,
): void {
  // Clear our own minimum, so `style.minHeight` reports the stylesheet's.
  if (
    state.lastInlineMinHeight !== null &&
    target.style.minHeight === state.lastInlineMinHeight
  ) {
    target.style.minHeight = "";
  }
  state.lastInlineMinHeight = null;

  if (!resizable) return;
  const floorPx: number = rowsMinHeightPx(rows, style);
  if (floorPx === 0) return;

  const floorStylePx: number = styleHeightPx(floorPx, style);
  const cssMinHeight: string = style.minHeight;
  let minHeight: string = `${floorStylePx}px`;
  if (cssMinHeight.endsWith("px")) {
    // The stylesheet's minimum already holds the floor: leave it in charge.
    if (px(cssMinHeight) >= floorStylePx) return;
  } else if (cssMinHeight.endsWith("%") || cssMinHeight.startsWith("calc(")) {
    // Not comparable in pixels here; let the browser take the larger.
    minHeight = `max(${minHeight}, ${cssMinHeight})`;
  }

  target.style.minHeight = minHeight;
  // Read back: the browser normalizes what was written.
  state.lastInlineMinHeight = target.style.minHeight;
}

export interface PromptInputTextareaHeightInput {
  /**
   * The height the content needs, measured with the textarea collapsed, so
   * it already respects any CSS `min-height`.
   */
  contentHeightPx: number;
  /** The floor from `rows`. */
  rowsMinHeightPx: number;
  /** The height the user dragged the textarea to, or null. */
  userHeightPx: number | null;
  /** Where auto-grow stops and the textarea starts scrolling. */
  maxHeightPx: number;
}

export interface PromptInputTextareaHeight {
  heightPx: number;
  overflowY: "auto" | "hidden";
}

/**
 * Grow with the content between a floor and a cap. The floor is `rows`, or
 * the user's dragged height if that is taller; the cap is `maxHeightPx`, or
 * the floor if that is taller. Past the cap the textarea scrolls.
 */
export function computePromptInputTextareaHeight({
  contentHeightPx,
  rowsMinHeightPx,
  userHeightPx,
  maxHeightPx,
}: PromptInputTextareaHeightInput): PromptInputTextareaHeight {
  const floorPx: number = Math.max(rowsMinHeightPx, userHeightPx ?? 0);
  const capPx: number = Math.max(maxHeightPx, floorPx);
  return {
    heightPx: Math.min(Math.max(contentHeightPx, floorPx), capPx),
    overflowY: contentHeightPx > capPx ? "auto" : "hidden",
  };
}

/**
 * Notice an inline height someone else gave the textarea since the sizing
 * last touched it, and remember it as the user's dragged height. Returns
 * whether there was one. While resizable, the textarea's inline `min-height`
 * has already stopped the drag at the `rows` floor.
 */
export function capturePromptInputTextareaUserResize(
  target: PromptInputTextareaSizingTarget,
  state: PromptInputTextareaSizingState,
): boolean {
  const inlineHeight: string = target.style.height;
  if (
    state.lastInlineHeight === null ||
    inlineHeight === state.lastInlineHeight
  ) {
    return false;
  }
  state.lastInlineHeight = inlineHeight;
  // Measured rather than parsed, so CSS min/max-height clamping is included.
  state.userHeightPx = target.offsetHeight;
  return true;
}

/**
 * Run while the user drags the resize handle: remember the new height, and
 * show a scrollbar if it hides some of the content. The next value change
 * sizes the textarea from the content again.
 */
export function syncPromptInputTextareaUserResize(
  target: PromptInputTextareaSizingTarget,
  state: PromptInputTextareaSizingState,
): void {
  if (!capturePromptInputTextareaUserResize(target, state)) return;
  target.style.overflowY =
    target.scrollHeight > target.clientHeight ? "auto" : "hidden";
}

/**
 * Size the textarea to its content, and keep its `rows` minimum in step.
 * Run whenever the value changes.
 */
export function sizePromptInputTextarea(
  target: PromptInputTextareaSizingTarget,
  style: PromptInputTextareaComputedStyle,
  { rows, maxHeightPx, resizable }: PromptInputTextareaSizingOptions,
  state: PromptInputTextareaSizingState,
): void {
  // A drag the resize observer has not reported yet still counts.
  if (resizable) {
    capturePromptInputTextareaUserResize(target, state);
  } else {
    state.userHeightPx = null;
  }

  syncPromptInputTextareaRowsMinHeight(
    target,
    style,
    { rows, resizable },
    state,
  );

  // Collapse first, so scrollHeight reports what the content needs rather
  // than the current height.
  target.style.height = "0px";
  const { heightPx, overflowY } = computePromptInputTextareaHeight({
    contentHeightPx: target.scrollHeight + verticalBorderPx(style),
    rowsMinHeightPx: rowsMinHeightPx(rows, style),
    userHeightPx: state.userHeightPx,
    maxHeightPx,
  });

  target.style.height = `${styleHeightPx(heightPx, style)}px`;
  target.style.overflowY = overflowY;
  // Read back: the browser normalizes what was written.
  state.lastInlineHeight = target.style.height;
}
