"use client";

import type { ReactElement } from "react";
import type { IconProps } from "./IconProps";
import Skeleton from "@/components/ui/skeleton";

function IconSkeleton({ size }: Pick<IconProps, "size">): ReactElement {
  return <Skeleton style={{ width: size, height: size }} />;
}

export default IconSkeleton;
