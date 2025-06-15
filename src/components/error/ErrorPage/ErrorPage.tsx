"use client";

import type { ReactElement } from "react";
import { Wordmark } from "@/components/ui/wordmark";

export type ErrorPageProps = {
  error: Error;
} | {
  error: number | string;
  message: string;
};

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
  return (
    <div className="w-full grow flex flex-col justify-center items-center min-h-screen p-2 md:p-4 lg:p-8">
      <h1 className="text-xl flex flex-row gap-4">
        <Wordmark /> Error
      </h1>

      <p className="text-md">{errorMsg}</p>
    </div>
  );
}

export default ErrorPage;
