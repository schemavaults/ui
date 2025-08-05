"use client";

import { domAnimation, LazyMotion } from "@/framer-motion";
import type { PropsWithChildren, ReactElement } from "react";

export interface LazyFramerMotionProviderProps extends PropsWithChildren {
  strict?: boolean;
}

export function LazyFramerMotionProvider({
  children,
  ...props
}: LazyFramerMotionProviderProps): ReactElement {
  return (
    <LazyMotion features={domAnimation} strict={props.strict}>
      {children}
    </LazyMotion>
  );
}

export default LazyFramerMotionProvider;
