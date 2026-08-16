export const environmentIds = [
  "production",
  "staging",
  "preview",
  "development",
  "test",
  "local",
  "sandbox",
] as const satisfies readonly string[];
export type Environment = (typeof environmentIds)[number];

export const environmentBadgeAppearanceIds = [
  "solid",
  "soft",
  "outline",
] as const satisfies readonly string[];
export type EnvironmentBadgeAppearance =
  (typeof environmentBadgeAppearanceIds)[number];

export const environmentBadgeSizeIds = [
  "sm",
  "md",
  "lg",
] as const satisfies readonly string[];
export type EnvironmentBadgeSize = (typeof environmentBadgeSizeIds)[number];

export const environmentBadgeShapeIds = [
  "rounded",
  "pill",
] as const satisfies readonly string[];
export type EnvironmentBadgeShape = (typeof environmentBadgeShapeIds)[number];

const environmentLabels: Record<Environment, string> = {
  production: "Production",
  staging: "Staging",
  preview: "Preview",
  development: "Development",
  test: "Test",
  local: "Local",
  sandbox: "Sandbox",
};

export function getDefaultEnvironmentLabel(env: Environment): string {
  return environmentLabels[env];
}
