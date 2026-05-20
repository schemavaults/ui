"use client";

import type { ReactElement, ReactNode } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/ui/wordmark";

type ErrorPageCommonProps = {
  reset?: () => void;
  resetButtonLabel?: string;
  additionalButtons?: ReactNode[];
};

export type ErrorPageProps = ({
  error: Error;
} | {
  error: number | string;
  message: string;
}) & ErrorPageCommonProps;

export function ErrorPage(props: ErrorPageProps): ReactElement {
  if (!("error" in props)) {
    throw new Error("ErrorPage did not receive an `error` prop")
  }

  const error = props.error;
  let errorMsg: string;
  if (
    typeof error === "number"
    ||
    typeof error === 'string'
  ) {
    const message: string = (props as { error: number, message: string }).message;
    errorMsg = `${error}: ${message}`;
  } else if (error instanceof Error) {
    errorMsg = error.message;
  } else {
    errorMsg = "An unknown error occurred!" as const;
  }
  const resetButtonLabel: string = props.resetButtonLabel ?? "Try Again";
  const additionalButtons: ReactNode[] = props.additionalButtons ?? [];
  return (
    <div className="w-full grow flex flex-col justify-center items-center min-h-screen p-2 md:p-4 lg:p-8">
      <h1 className="text-xl flex flex-row gap-4">
        <Wordmark /> Error
      </h1>

      <p className="text-md">{errorMsg}</p>
      {(props.reset || additionalButtons.length > 0) && (
        <div className="mt-4 flex flex-row gap-2">
          {props.reset && (
            <Button onClick={props.reset} className="flex flex-row gap-2">
              <RotateCcw size={16} /> {resetButtonLabel}
            </Button>
          )}
          {additionalButtons.map((button, index) => (
            <div key={index}>{button}</div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ErrorPage;
