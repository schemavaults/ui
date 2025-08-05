"use client";

import { domAnimation, LazyMotion } from "@/framer-motion";
import type { PropsWithChildren, ReactElement } from "react";

export { LazyMotion } from "@/framer-motion";

export interface LazyFramerMotionProviderProps extends PropsWithChildren {
  strict?: boolean;
}

export function LazyFramerMotionProvider({
  children,
  strict,
}: LazyFramerMotionProviderProps): ReactElement {
  return (
    <LazyMotion features={domAnimation} strict={strict}>
      {children}
    </LazyMotion>
  );
}

export default LazyFramerMotionProvider;
