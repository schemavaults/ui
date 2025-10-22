// .storybook/main.ts
// Defines the Storybook.js site configuration for @schemavaults/ui preview site!

import type { StorybookConfig } from "@storybook/react-webpack5";
import type { Options as SwcOptions } from "@swc/core";
import { resolve } from "path";
import webpack from "webpack";

type StorybookWebpackConfig = Awaited<
  ReturnType<NonNullable<StorybookConfig["webpackFinal"]>>
>;

// Where to find static assets for the Storybook.js site config (e.g. logo.png)
const storybookAssetsDirectory: string = resolve(
  __dirname,
  "../storybook-assets",
);

// @schemavaults/ui Storybook.js site config
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
  webpackFinal: async (
    config: webpack.Configuration,
  ): Promise<StorybookWebpackConfig> => {
    const existingModule = config.module;

    let existingModuleRules = Array.isArray(config.module?.rules)
      ? config.module.rules
      : [];

    const webpackPlugins: NonNullable<StorybookWebpackConfig["plugins"]> = [
      ...(config.plugins || []),
    ];

    const bufferPolyfillPlugin = new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    });

    webpackPlugins.push(bufferPolyfillPlugin as any);

    const finalConfig: StorybookWebpackConfig = {
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
      plugins: webpackPlugins,
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
        fallback: {
          ...config.resolve?.fallback,
          buffer: require.resolve("buffer/"),
        },
      },
    };
    return finalConfig;
  },
  swc: (config: SwcOptions): SwcOptions => {
    return {
      ...config,
      // Apply your custom SWC configuration
    };
  },
};
export default config;
