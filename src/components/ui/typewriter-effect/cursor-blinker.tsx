"use client";

import { m } from "@/framer-motion";
import type { ReactElement } from "react";

export interface CursorBlinkerProps {}

export function CursorBlinker({}: CursorBlinkerProps): ReactElement {
  return (
    <m.span
      variants={{
        hidden: {
          opacity: 0,
          visibility: "hidden",
          display: "none",
        },
        blinking: {
          opacity: [0, 0, 1, 1],
          transition: {
            duration: 1,
            repeat: Infinity,
            repeatDelay: 0,
            ease: "linear",
            times: [0, 0.5, 0.5, 1],
          },
          visibility: "visible",
          display: "inline-block",
        },
      }}
      initial="hidden"
      animate={"blinking"}
      exit="hidden"
      className="text-primary"
      role="presentation"
    >
      |
    </m.span>
  );
}

export default CursorBlinker;
