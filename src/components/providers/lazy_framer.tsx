"use client";

import { domAnimation, LazyMotion } from "framer-motion";
import type { PropsWithChildren, ReactElement } from "react";

export { LazyMotion } from "framer-motion";

export function LazyFramerMotionProvider({
  children,
}: PropsWithChildren): ReactElement {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}

export default LazyFramerMotionProvider;
