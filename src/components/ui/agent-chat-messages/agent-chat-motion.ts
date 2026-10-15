"use client";

/**
 * Internal: the entrance/exit animation every transcript message shares, and
 * the div attributes those motion components accept. Not part of the public
 * API — the package index doesn't re-export this module.
 */

import type { HTMLAttributes } from "react";
import { useReducedMotion } from "@/framer-motion";

/**
 * Native HTML div attributes without the handlers that framer-motion's
 * `m.div` overloads (drag/animation events). Spreading these props onto
 * `m.div` otherwise causes a type conflict.
 */
export type MotionDivAttributes = Omit<
  HTMLAttributes<HTMLDivElement>,
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration"
>;

const messageMotionProps = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.18, ease: "easeOut" as const },
};

const reducedMotionProps = {
  initial: false as const,
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0 },
};

export function useMessageMotionProps(): typeof messageMotionProps | typeof reducedMotionProps {
  const reduced = useReducedMotion();
  return reduced ? reducedMotionProps : messageMotionProps;
}
