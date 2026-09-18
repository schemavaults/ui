import type { Preview } from "@storybook/react";

import "@schemavaults/theme/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        /**
         * The order the top-level story groups appear in the sidebar.
         *
         * Without this, Storybook sorts groups alphabetically, which buries
         * the introductory pages and scatters related components. The order
         * below runs roughly from "what you click" through "what you show
         * data with" to the theming reference.
         *
         * `"*"` is the bucket for anything unlisted, so a story given a brand
         * new group lands at the bottom of the sidebar rather than silently
         * wedging itself between two existing groups. See `CLAUDE.md` for
         * what belongs in each group.
         *
         * NOTE: Storybook reads this list by statically parsing this file
         * while building the story index, so it must stay an inline array
         * literal — pulling it out into a named constant makes the index
         * build fail with "Unexpected identifier".
         */
        order: [
          "About",
          "Installation",
          "Actions",
          "Forms",
          "Date & Time",
          "Data Display",
          "Charts & Graphs",
          "Navigation",
          "Overlays",
          "Feedback",
          "Developer Tools",
          "AI & Chat",
          "Media & Frames",
          "Layout",
          "Motion & Effects",
          "Theme",
          "*",
        ],
      },
    },
  },
};

export default preview;
