"use client";

import type { ReactElement } from "react";
import { Button } from "../ui";
import { ArrowLeft } from "lucide-react";

export interface BackButtonProps {
  buttonClassName?: string;
  onClick?: () => void;
}

export function BackButton({ buttonClassName, onClick }: BackButtonProps): ReactElement {
  return (
    <Button
      variant="secondary"
      className={buttonClassName}
      onClick={onClick}
    >
      <ArrowLeft className="h-6 w-6"/>
    </Button>
  );
}
