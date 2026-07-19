import { cva, type VariantProps } from "class-variance-authority";

export const promptInputVariantIds = [
  "default",
  "elevated",
  "filled",
  "ghost",
] as const satisfies readonly string[];
export type PromptInputVariant = (typeof promptInputVariantIds)[number];

export const promptInputSizeIds = ["sm", "default", "lg"] as const satisfies readonly string[];
export type PromptInputSize = (typeof promptInputSizeIds)[number];

export const promptInputVariants = cva(
  "group/prompt-input relative flex w-full flex-col overflow-hidden ring-offset-background transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-60",
  {
    variants: {
      variant: {
        default: "rounded-md border border-input bg-background",
        elevated:
          "rounded-2xl border border-input bg-background shadow-md",
        filled:
          "rounded-md border border-transparent bg-muted",
        ghost:
          "rounded-md border border-transparent bg-transparent focus-within:ring-offset-0",
      } satisfies Record<PromptInputVariant, string>,
      size: {
        sm: "text-sm",
        default: "text-sm",
        lg: "text-base",
      } satisfies Record<PromptInputSize, string>,
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type PromptInputVariantProps = VariantProps<typeof promptInputVariants>;

export const promptInputTextareaSizeClass = {
  sm: "min-h-[44px] px-3 pt-2.5 pb-1 text-sm",
  default: "min-h-[56px] px-3.5 pt-3 pb-1.5 text-sm",
  lg: "min-h-[72px] px-4 pt-4 pb-2 text-base",
} satisfies Record<PromptInputSize, string>;

export const promptInputToolbarSizeClass = {
  sm: "px-2 pb-1.5 pt-1 gap-1",
  default: "px-2.5 pb-2 pt-1 gap-2",
  lg: "px-3 pb-2.5 pt-1.5 gap-2",
} satisfies Record<PromptInputSize, string>;
