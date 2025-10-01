console.log("@schemavaults/ui - tailwind.config.ts");

import type { Config } from "tailwindcss";
// Import the config factory
import { SchemaVaultsTailwindConfigFactory } from "@schemavaults/theme";

let config: Config;
try {
  // Generate and export the config
  config = new SchemaVaultsTailwindConfigFactory().createConfig({
    content: ["./src/**/*.{tsx,jsx,js,ts,mdx}"],
  }) satisfies Config;
} catch (e) {
  console.error(
    "Failed to generate TailwindCSS config using @schemavaults/theme module!",
    e,
  );
  process.exit(1);
}

export default config;
