// .storybook/test-runner.ts
// Configures @storybook/test-runner (Playwright) for the @schemavaults/ui
// Storybook test suite.

import type { TestRunnerConfig } from "@storybook/test-runner";
import { getStoryContext } from "@storybook/test-runner";

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
    const emulateReducedMotion: boolean =
      storyContext.parameters?.["emulateReducedMotion"] === true;

    await page.emulateMedia({
      reducedMotion: emulateReducedMotion ? "reduce" : "no-preference",
    });
  },
};

export default config;
