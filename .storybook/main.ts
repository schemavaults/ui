import type { StorybookConfig } from "@storybook/react-webpack5";
import type { Options } from "@swc/core";
import { resolve } from "path";

const storybookAssetsDirectory: string = resolve(
  __dirname,
  "../storybook-assets",
);

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-webpack5-compiler-swc",
  ],
  staticDirs: [storybookAssetsDirectory],
  core: {
    disableTelemetry: true,
  },
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
  webpackFinal: async (config) => {
    // finalConfig.module.rules.push({
    //   test: /\.(js\.map|md)$/,
    //   type: "asset/resource",
    //   use: [
    //     {
    //       loader: "ignore-loader",
    //     },
    //   ],
    // });

    const existingModule = config.module;

    let existingModuleRules = Array.isArray(config.module?.rules)
      ? config.module.rules
      : [];

    return {
      ...config,
      module: {
        ...existingModule,
        rules: [
          ...existingModuleRules,
          {
            test: /\.css$/,
            use: ["postcss-loader"],
          },
        ],
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          "@/components": resolve(__dirname, "../src/components"),
          "@/hooks": resolve(__dirname, "../src/components/hooks"),
          "@/lib": resolve(__dirname, "../src/lib"),
          "@/lib/utils": resolve(__dirname, "../src/lib/utils"),
          "@/providers": resolve(__dirname, "../src/providers"),
          "@/stories": resolve(__dirname, "../src/stories"),
          "@/framer-motion": resolve(__dirname, "../src/framer-motion"),
        },
      },
    };
  },
  swc: (config: Options, options): Options => {
    return {
      ...config,
      // Apply your custom SWC configuration
    };
  },
};
export default config;
