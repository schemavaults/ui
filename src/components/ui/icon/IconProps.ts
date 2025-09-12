"use client";

import type { ComponentProps } from "react";

export interface IconProps {
  src: string | SVGSVGElement;
  size?: number;
  className?: string;
  style?: ComponentProps<"img">["style"];
}
