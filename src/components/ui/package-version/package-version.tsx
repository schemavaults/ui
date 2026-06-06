"use client";

import { useEffect, useState, type ReactElement } from "react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export interface PackageVersionProps {
  className?: string;
  /**
   * URL to fetch the `package.json` from. Defaults to `/package.json`, which the
   * deployed Storybook site serves from its root (see `.storybook/main.ts`).
   */
  packageJsonUrl?: string;
  /** Text rendered immediately before the version number. Defaults to `"v"`. */
  prefix?: string;
}

type PackageVersionState =
  | { status: "loading" }
  | { status: "success"; version: string }
  | { status: "error" };

function extractVersion(data: unknown): string | undefined {
  if (
    typeof data === "object" &&
    data !== null &&
    "version" in data &&
    typeof (data as { version: unknown }).version === "string"
  ) {
    return (data as { version: string }).version;
  }
  return undefined;
}

/**
 * Fetches the latest semver from `GET /package.json` (the `.version` field) and
 * renders it as a badge. Shows a skeleton while loading and a fallback badge if
 * the request fails or no version is present.
 */
export function PackageVersion({
  className,
  packageJsonUrl = "/package.json",
  prefix = "v",
}: PackageVersionProps): ReactElement {
  const [state, setState] = useState<PackageVersionState>({
    status: "loading",
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchVersion(): Promise<void> {
      try {
        const response = await fetch(packageJsonUrl, {
          headers: { Accept: "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const version = extractVersion(await response.json());
        if (!version) {
          throw new Error("No 'version' field found in package.json");
        }
        if (!cancelled) {
          setState({ status: "success", version });
        }
      } catch {
        if (!cancelled) {
          setState({ status: "error" });
        }
      }
    }

    void fetchVersion();

    return (): void => {
      cancelled = true;
    };
  }, [packageJsonUrl]);

  if (state.status === "loading") {
    return (
      <Skeleton
        className={cn("inline-block h-5 w-16 align-middle", className)}
      />
    );
  }

  if (state.status === "error") {
    return (
      <Badge variant="destructive" className={className}>
        version unavailable
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={cn("font-mono", className)}>
      {prefix}
      {state.version}
    </Badge>
  );
}

export default PackageVersion;
