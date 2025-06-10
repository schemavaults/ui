"use client";

// UI Utilities
export * from "./lib/utils";
export type * from "./lib/utils";

// Components
export * from "./components/ui";
export type * from "./components/ui";

// Navigation Components (which depend on /components/ui)
export * from "./components/navigation";
export type * from "./components/navigation";

// Component Hooks
export * from "./components/hooks";
export type * from "./components/hooks";

// Error Components
export * from "./components/error";
export type * from "./components/error";

// Layout Components
export * from "./components/layout";
export type * from "./components/layout";

// Providers for UI functionality
export * from "./providers";
export type * from "./providers";

// Higher-Order Components (useful for creating scoped providers and hooks)
export * from "./components/hoc";
export type * from "./components/hoc";

// Framer Motion Components
export { m, AnimatePresence } from "./framer-motion";
export type * from "./framer-motion";
