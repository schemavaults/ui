# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is `@schemavaults/ui`, a React component library package for SchemaVaults frontend applications. It provides reusable UI components built on Radix UI primitives with TailwindCSS styling.

## Commands

```bash
# Build the package (compiles TypeScript and resolves path aliases)
bun run build

# Run Storybook dev server on port 6006
bun run storybook

# Build Storybook for production
bun run build:storybook

# Type check without emitting
bun run typecheck

# Type check (including .stories.tsx files) without emitting
bun run typecheck:storybook

# Lint source files
bun run lint
```

## Architecture

### Package Structure

- **`src/index.ts`** - Main entry point exporting all public APIs
- **`src/components/ui/`** - Core UI components (button, dialog, form, table, etc.)
- **`src/components/layout/`** - Layout components (DashboardLayout, PageColumnContainer, ThemedPageContainer)
- **`src/components/navigation/`** - Navigation components
- **`src/components/error/`** - Error page components
- **`src/components/hooks/`** - Custom hooks (useToast, useMobile)
- **`src/components/hoc/`** - Higher-order components
- **`src/providers/`** - React context providers (BrightnessThemeProvider, LazyFramerMotionProvider)
- **`src/lib/utils.ts`** - The `cn()` utility combining clsx and tailwind-merge

### Component Pattern

Components follow the shadcn/ui pattern with modifications:

1. Each component lives in its own folder under `src/components/ui/<component-name>/`
2. Main component file is kebab-case (e.g., `button.tsx`)
3. `index.ts` re-exports the component and types
4. Story files use PascalCase (e.g., `Button.stories.ts`)
5. Variant definitions use `class-variance-authority` (cva)

Example structure:
```
src/components/ui/button/
├── button.tsx       # Component implementation
├── index.ts         # Re-exports
└── Button.stories.ts
```

### Key Conventions

- Components use `"use client"` directive for client-side rendering
- Use `cn()` from `@/lib/utils` for merging Tailwind classes
- Path aliases defined in tsconfig: `@/*` → `./src/*`, `@/components/*`, `@/lib/*`, `@/hooks/*`
- Explicit return types on all functions (e.g., `function Button(): ReactElement`)
- Exports include both values and types: `export * from` and `export type * from`

### Dependencies

- **@schemavaults/theme** - Required peer for `globals.css` and TailwindCSS config factory
- **Radix UI** - Primitive components (@radix-ui/react-*)
- **framer-motion** - Animations (re-exported via `src/framer-motion.ts`)
- **react-hook-form** - Form state management
- **@tanstack/react-table** - Data table functionality
- **class-variance-authority** - Component variant definitions

### Build Configuration

- Uses `tsconfig.pkg.json` for package builds (excludes stories)
- `tsc-alias` resolves path aliases post-compilation
- Output goes to `dist/` directory
- Stories are excluded from the package build but included in Storybook
