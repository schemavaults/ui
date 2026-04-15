"use client";

import type { ReactElement } from "react";

import { Spinner } from "../spinner";

export interface LoadingPageProps {
  message?: string;
}

export function LoadingPage({ message }: LoadingPageProps): ReactElement {
  return (
    <div className="w-full h-full flex grow flex-col items-center justify-center gap-4 min-h-[75vh]">
      <Spinner size="lg" label={message ?? "Loading"} />
      {message && (
        <p className="text-xs font-light text-muted-foreground">{message}</p>
      )}
    </div>
  );
}

export default LoadingPage;
