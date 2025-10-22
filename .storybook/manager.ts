// .storybook/manager.ts

import { addons } from "@storybook/manager-api";
import { create as createTheme } from "@storybook/theming";

addons.setConfig({
  theme: createTheme({
    base: "light",
    brandTitle: "@schemavaults/ui",
    brandUrl: "https://ui.schemavaults.com",
    brandImage: "https://ui.schemavaults.com/media/brand.png",
    brandTarget: "_self",
  }),
});
