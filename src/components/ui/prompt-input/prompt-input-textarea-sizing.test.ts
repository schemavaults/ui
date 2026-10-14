/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test";

import {
  computePromptInputTextareaHeight,
  resolveLineHeightPx,
  rowsMinHeightPx,
  sizePromptInputTextarea,
  syncPromptInputTextareaUserResize,
  type PromptInputTextareaComputedStyle,
  type PromptInputTextareaSizingOptions,
  type PromptInputTextareaSizingState,
  type PromptInputTextareaSizingTarget,
} from "./prompt-input-textarea-sizing";

/** The default size: `text-sm` (20px lines), `pt-3 pb-1.5`, `min-h-[56px]`. */
const LINE_HEIGHT_PX = 20;
const PADDING_TOP_PX = 12;
const PADDING_BOTTOM_PX = 6;
const MIN_HEIGHT_PX = 56;

interface FakeTextareaOptions {
  lines?: number;
  rows?: number;
  borderPx?: number;
  boxSizing?: "border-box" | "content-box";
  minHeightPx?: number;
}

/**
 * Stands in for a laid-out `<textarea>`: it works out `scrollHeight`,
 * `clientHeight` and `offsetHeight` from its inline height, CSS min-height,
 * `rows` and how many lines of text it holds, the way a browser would.
 */
class FakeTextarea implements PromptInputTextareaSizingTarget {
  readonly style = { height: "", overflowY: "" };
  lines: number;
  readonly rows: number;
  readonly borderPx: number;
  readonly boxSizing: "border-box" | "content-box";
  readonly minHeightPx: number;

  constructor({
    lines = 1,
    rows = 1,
    borderPx = 0,
    boxSizing = "border-box",
    minHeightPx = MIN_HEIGHT_PX,
  }: FakeTextareaOptions = {}) {
    this.lines = lines;
    this.rows = rows;
    this.borderPx = borderPx;
    this.boxSizing = boxSizing;
    this.minHeightPx = minHeightPx;
  }

  get computedStyle(): PromptInputTextareaComputedStyle {
    return {
      boxSizing: this.boxSizing,
      lineHeight: `${LINE_HEIGHT_PX}px`,
      fontSize: "14px",
      paddingTop: `${PADDING_TOP_PX}px`,
      paddingBottom: `${PADDING_BOTTOM_PX}px`,
      borderTopWidth: `${this.borderPx}px`,
      borderBottomWidth: `${this.borderPx}px`,
    };
  }

  private get chromePx(): number {
    return PADDING_TOP_PX + PADDING_BOTTOM_PX + 2 * this.borderPx;
  }

  get offsetHeight(): number {
    const inline: number = Number.parseFloat(this.style.height);
    const specified: number = Number.isFinite(inline)
      ? this.boxSizing === "border-box"
        ? inline
        : inline + this.chromePx
      : this.rows * LINE_HEIGHT_PX + this.chromePx;
    const minimum: number =
      this.boxSizing === "border-box"
        ? this.minHeightPx
        : this.minHeightPx + this.chromePx;
    return Math.max(specified, minimum, this.chromePx);
  }

  get clientHeight(): number {
    return this.offsetHeight - 2 * this.borderPx;
  }

  get scrollHeight(): number {
    const content: number =
      Math.max(this.lines, 1) * LINE_HEIGHT_PX +
      PADDING_TOP_PX +
      PADDING_BOTTOM_PX;
    return Math.max(content, this.clientHeight);
  }

  /** What the browser does while the user drags the resize handle. */
  drag(heightPx: number): void {
    this.style.height = `${heightPx}px`;
  }
}

function newState(): PromptInputTextareaSizingState {
  return { lastInlineHeight: null, userHeightPx: null };
}

/** A textarea plus its sizing state, sized the way the component does it. */
function setup(
  textareaOptions: FakeTextareaOptions = {},
  sizingOptions: Partial<PromptInputTextareaSizingOptions> = {},
): {
  textarea: FakeTextarea;
  state: PromptInputTextareaSizingState;
  /** Simulate a value change: set the line count, then re-run the sizing. */
  type: (lines: number) => void;
} {
  const textarea = new FakeTextarea(textareaOptions);
  const state = newState();
  const options: PromptInputTextareaSizingOptions = {
    rows: textareaOptions.rows ?? 1,
    maxHeightPx: 240,
    resizable: false,
    ...sizingOptions,
  };
  const type = (lines: number): void => {
    textarea.lines = lines;
    sizePromptInputTextarea(textarea, textarea.computedStyle, options, state);
  };
  type(textarea.lines);
  return { textarea, state, type };
}

/** The auto-resize effect as it was before `resizable` and `rows` support. */
function legacySize(el: FakeTextarea, maxHeightPx: number): void {
  el.style.height = "0px";
  const nextHeight = Math.min(el.scrollHeight, maxHeightPx);
  el.style.height = `${nextHeight}px`;
  el.style.overflowY = el.scrollHeight > maxHeightPx ? "auto" : "hidden";
}

describe("resolveLineHeightPx", () => {
  test("reads a pixel line height", () => {
    expect(resolveLineHeightPx("20px", "14px")).toBe(20);
  });

  test("multiplies a unitless line height by the font size", () => {
    expect(resolveLineHeightPx("1.5", "16px")).toBe(24);
  });

  test("falls back to 1.2 × font size for `normal`", () => {
    expect(resolveLineHeightPx("normal", "20px")).toBe(24);
  });
});

describe("rowsMinHeightPx", () => {
  const style = new FakeTextarea().computedStyle;

  test("is rows × line height plus vertical padding", () => {
    expect(rowsMinHeightPx(4, style)).toBe(4 * 20 + 12 + 6);
  });

  test("includes the vertical border", () => {
    const bordered = new FakeTextarea({ borderPx: 1 }).computedStyle;
    expect(rowsMinHeightPx(4, bordered)).toBe(4 * 20 + 12 + 6 + 2);
  });

  test("adds no floor for a single row, or for a nonsense value", () => {
    expect(rowsMinHeightPx(1, style)).toBe(0);
    expect(rowsMinHeightPx(0, style)).toBe(0);
    expect(rowsMinHeightPx(Number.NaN, style)).toBe(0);
  });
});

describe("computePromptInputTextareaHeight", () => {
  test("follows the content between the floor and maxHeightPx", () => {
    expect(
      computePromptInputTextareaHeight({
        contentHeightPx: 100,
        rowsMinHeightPx: 0,
        userHeightPx: null,
        maxHeightPx: 240,
      }),
    ).toEqual({ heightPx: 100, overflowY: "hidden" });
  });

  test("stops at maxHeightPx and scrolls past it", () => {
    expect(
      computePromptInputTextareaHeight({
        contentHeightPx: 400,
        rowsMinHeightPx: 0,
        userHeightPx: null,
        maxHeightPx: 240,
      }),
    ).toEqual({ heightPx: 240, overflowY: "auto" });
  });

  test("a dragged height taller than maxHeightPx becomes the cap", () => {
    expect(
      computePromptInputTextareaHeight({
        contentHeightPx: 400,
        rowsMinHeightPx: 0,
        userHeightPx: 300,
        maxHeightPx: 240,
      }),
    ).toEqual({ heightPx: 300, overflowY: "auto" });
  });

  test("a rows floor taller than maxHeightPx becomes the cap", () => {
    expect(
      computePromptInputTextareaHeight({
        contentHeightPx: 56,
        rowsMinHeightPx: 418,
        userHeightPx: null,
        maxHeightPx: 240,
      }),
    ).toEqual({ heightPx: 418, overflowY: "hidden" });
  });
});

describe("sizePromptInputTextarea without resizable", () => {
  test("matches the previous auto-resize for every content height", () => {
    for (const maxHeightPx of [40, 120, 240]) {
      for (let lines = 0; lines <= 16; lines += 1) {
        const { textarea } = setup({ lines }, { maxHeightPx });
        const legacy = new FakeTextarea({ lines });
        legacySize(legacy, maxHeightPx);
        expect(textarea.style).toEqual(legacy.style);
      }
    }
  });

  test("an outside height is replaced on the next value change, as before", () => {
    const { textarea, type } = setup({ lines: 2 });
    expect(textarea.offsetHeight).toBe(58);

    textarea.drag(300);
    type(3);

    expect(textarea.offsetHeight).toBe(78);
  });
});

describe("sizePromptInputTextarea with resizable", () => {
  test("a dragged height survives the next value change", () => {
    const { textarea, type } = setup({ lines: 3 }, { resizable: true });
    expect(textarea.offsetHeight).toBe(78);

    textarea.drag(300);
    type(3);

    expect(textarea.offsetHeight).toBe(300);
    expect(textarea.style.overflowY).toBe("hidden");
  });

  test("the dragged height survives the value being cleared", () => {
    const { textarea, type } = setup({ lines: 3 }, { resizable: true });

    textarea.drag(300);
    type(0);

    expect(textarea.offsetHeight).toBe(300);
  });

  test("content grows past the dragged height, up to maxHeightPx", () => {
    const { textarea, type } = setup(
      { lines: 1 },
      { resizable: true, maxHeightPx: 400 },
    );

    textarea.drag(150);
    type(10);
    expect(textarea.offsetHeight).toBe(218);
    expect(textarea.style.overflowY).toBe("hidden");

    type(30);
    expect(textarea.offsetHeight).toBe(400);
    expect(textarea.style.overflowY).toBe("auto");

    type(0);
    expect(textarea.offsetHeight).toBe(150);
  });

  test("a dragged height taller than maxHeightPx raises the cap to it", () => {
    const { textarea, type } = setup(
      { lines: 1 },
      { resizable: true, maxHeightPx: 240 },
    );

    textarea.drag(300);
    type(30);

    expect(textarea.offsetHeight).toBe(300);
    expect(textarea.style.overflowY).toBe("auto");
  });

  test("dragging smaller lowers the floor", () => {
    const { textarea, type } = setup({ lines: 1 }, { resizable: true });

    textarea.drag(300);
    type(1);
    textarea.drag(120);
    type(2);

    expect(textarea.offsetHeight).toBe(120);
  });

  test("dragging back to the last auto height is still a drag", () => {
    const { textarea, state, type } = setup({ lines: 3 }, { resizable: true });
    expect(textarea.offsetHeight).toBe(78);

    textarea.drag(300);
    syncPromptInputTextareaUserResize(textarea, state);
    textarea.drag(78);
    syncPromptInputTextareaUserResize(textarea, state);
    type(3);

    expect(textarea.offsetHeight).toBe(78);
  });

  test("the floor never drops below the CSS min-height", () => {
    const { textarea, type } = setup({ lines: 1 }, { resizable: true });

    textarea.drag(10);
    type(1);

    expect(textarea.offsetHeight).toBe(MIN_HEIGHT_PX);
  });

  test("the floor never drops below rows", () => {
    const { textarea, type } = setup(
      { lines: 1, rows: 4 },
      { resizable: true },
    );

    textarea.drag(60);
    type(1);

    expect(textarea.offsetHeight).toBe(98);
  });

  test("turning resizable off forgets the dragged height", () => {
    const textarea = new FakeTextarea({ lines: 1 });
    const state = newState();
    const size = (resizable: boolean): void =>
      sizePromptInputTextarea(
        textarea,
        textarea.computedStyle,
        { rows: 1, maxHeightPx: 240, resizable },
        state,
      );
    size(true);
    textarea.drag(300);
    size(true);
    expect(textarea.offsetHeight).toBe(300);

    size(false);
    expect(textarea.offsetHeight).toBe(MIN_HEIGHT_PX);

    size(true);
    expect(textarea.offsetHeight).toBe(MIN_HEIGHT_PX);
  });
});

describe("rows", () => {
  test("rows={4} rests at least 4 lines tall", () => {
    const { textarea, type } = setup({ lines: 0, rows: 4 });

    expect(textarea.offsetHeight).toBeGreaterThanOrEqual(
      4 * LINE_HEIGHT_PX + PADDING_TOP_PX + PADDING_BOTTOM_PX,
    );

    type(2);
    expect(textarea.offsetHeight).toBe(98);
  });

  test("content still grows past rows", () => {
    const { textarea } = setup({ lines: 6, rows: 4 });
    expect(textarea.offsetHeight).toBe(6 * 20 + 18);
  });

  test("the default rows={1} leaves the min-height in charge", () => {
    const { textarea } = setup({ lines: 0, rows: 1 });
    expect(textarea.offsetHeight).toBe(MIN_HEIGHT_PX);
  });

  test("sets a content-box height that shows the same rows", () => {
    const { textarea } = setup({
      lines: 0,
      rows: 4,
      borderPx: 1,
      boxSizing: "content-box",
      minHeightPx: 0,
    });
    expect(textarea.style.height).toBe(`${4 * LINE_HEIGHT_PX}px`);
    expect(textarea.offsetHeight).toBe(4 * 20 + 18 + 2);
  });

  test("sets a border-box height that includes the border", () => {
    const { textarea } = setup({ lines: 0, rows: 4, borderPx: 1 });
    expect(textarea.offsetHeight).toBe(4 * 20 + 18 + 2);
    expect(textarea.scrollHeight).toBe(textarea.clientHeight);
  });
});

describe("syncPromptInputTextareaUserResize", () => {
  test("ignores the sizing's own height", () => {
    const { textarea, state } = setup({ lines: 2 }, { resizable: true });

    syncPromptInputTextareaUserResize(textarea, state);

    expect(state.userHeightPx).toBeNull();
  });

  test("records a drag and shows a scrollbar when it hides content", () => {
    const { textarea, state } = setup({ lines: 6 }, { resizable: true });
    expect(textarea.style.overflowY).toBe("hidden");

    textarea.drag(80);
    syncPromptInputTextareaUserResize(textarea, state);

    expect(state.userHeightPx).toBe(80);
    expect(textarea.style.overflowY).toBe("auto");

    textarea.drag(200);
    syncPromptInputTextareaUserResize(textarea, state);

    expect(state.userHeightPx).toBe(200);
    expect(textarea.style.overflowY).toBe("hidden");
  });
});
