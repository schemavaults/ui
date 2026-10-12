// .storybook/test-runner.ts
// Configures @storybook/test-runner (Playwright) for the @schemavaults/ui
// Storybook test suite.

import type { TestRunnerConfig } from "@storybook/test-runner";
import { getStoryContext } from "@storybook/test-runner";
import { MINIMAL_VIEWPORTS, type Viewport } from "storybook/viewport";

interface ViewportSize {
  width: number;
  height: number;
}

/**
 * The viewport a story is tested at unless it pins a preset for itself:
 * Playwright's own default page size.
 */
const DEFAULT_VIEWPORT_SIZE: ViewportSize = { width: 1280, height: 720 };

/**
 * A story that pins one of Storybook's viewport presets through its globals,
 *
 * ```ts
 * globals: { viewport: { value: "mobile1", isRotated: false } },
 * ```
 *
 * is tested at that preset's size — the size Storybook's viewport tool shows
 * it at — so a `play()` test can exercise a `max-md:` media query, or anything
 * else that depends on the width of the page rather than of the component.
 * The presets are the `MINIMAL_VIEWPORTS` the viewport tool offers by default:
 * `mobile1`, `mobile2`, `tablet` and `desktop`.
 *
 * Every other story is reset to the default, because the viewport is a
 * property of the page and the runner reuses a page across the stories in a
 * file.
 */
function viewportSizeForStory(
  storyGlobals: Record<string, unknown> | undefined,
): ViewportSize {
  const viewportGlobal: unknown = storyGlobals?.["viewport"];
  if (typeof viewportGlobal !== "object" || viewportGlobal === null) {
    return DEFAULT_VIEWPORT_SIZE;
  }
  const { value, isRotated } = viewportGlobal as {
    value?: unknown;
    isRotated?: unknown;
  };
  const preset: Viewport | undefined =
    typeof value === "string"
      ? (MINIMAL_VIEWPORTS as Record<string, Viewport | undefined>)[value]
      : undefined;
  if (!preset) {
    return DEFAULT_VIEWPORT_SIZE;
  }
  const width: number = Number.parseInt(preset.styles.width, 10);
  const height: number = Number.parseInt(preset.styles.height, 10);
  return isRotated === true ? { width: height, height: width } : { width, height };
}

/**
 * A story opts into being rendered as though the viewer had asked their
 * operating system for reduced motion with:
 *
 * ```ts
 * parameters: { emulateReducedMotion: true }
 * ```
 *
 * Playwright's media emulation is the only way to exercise the
 * `prefers-reduced-motion` media query for real: nothing inside the browser
 * can set it, so a story cannot emulate it for itself.
 *
 * Every other story is explicitly reset to `no-preference`, because the
 * emulation is a property of the page and the runner reuses a page across the
 * stories in a file.
 */
const config: TestRunnerConfig = {
  async preVisit(page, context): Promise<void> {
    const storyContext = await getStoryContext(page, context);

    // `getStoryContext` is typed as the enhancer-time context, which predates
    // story-level globals, but the preview hands back the full story context.
    // Fall back to the merged globals, which carry a story's own overrides too.
    const { storyGlobals, globals } = storyContext as {
      storyGlobals?: Record<string, unknown>;
      globals?: Record<string, unknown>;
    };
    await page.setViewportSize(viewportSizeForStory(storyGlobals ?? globals));

    const emulateReducedMotion: boolean =
      storyContext.parameters?.["emulateReducedMotion"] === true;

    // `matchMedia(...).matches` flips as soon as the emulation changes, but
    // the query's `change` event is only dispatched a few frames later. Framer
    // Motion caches the preference from that event, so a story that mounts in
    // between reads reduced motion in CSS and in `play()` but still animates
    // in JavaScript. Wait for the event before the story renders.
    const changing: boolean = await page.evaluate(
      (reduce: boolean): boolean => {
        const query: MediaQueryList = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        );
        if (query.matches === reduce) {
          return false;
        }
        const flagged = window as Window & { __reducedMotionChanged?: boolean };
        flagged.__reducedMotionChanged = false;
        query.addEventListener(
          "change",
          (): void => {
            flagged.__reducedMotionChanged = true;
          },
          { once: true },
        );
        return true;
      },
      emulateReducedMotion,
    );

    await page.emulateMedia({
      reducedMotion: emulateReducedMotion ? "reduce" : "no-preference",
    });

    if (changing) {
      await page.waitForFunction(
        (): boolean =>
          (window as Window & { __reducedMotionChanged?: boolean })
            .__reducedMotionChanged === true,
      );
    }
  },
};

export default config;
