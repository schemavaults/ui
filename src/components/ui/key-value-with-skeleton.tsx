"use client";

import { Skeleton } from "./skeleton";
import { type ReactElement, type ReactNode, type PropsWithChildren, useState, useEffect } from "react";

export interface KeyValueWithSkeletonProps {
  label: string;
  value?: string | Promise<string> | null;
}

function KeyValueFallbackSkeleton(): ReactElement {
  return (
    <Skeleton className="min-w-[100px] md:min-w-[140px] lg:min-w-[200px] min-h-[12px]" />
  );
}

function DisplayValueText({ value }: { value: string }): ReactElement {
  const displayValueClassName = "text-gray-400 grow" as const;

  return <p className={displayValueClassName}>{value}</p>
}

function DisplayValue({ value }: { value: Promise<string> | string | null | undefined }): ReactNode {
  const [loaded, setLoaded] = useState<string | false>(false);

  useEffect(() => {
    if (!value) return;
    if (!!value && typeof value !== 'string') {
      async function observeDisplayValuePromise(): Promise<string> {
        return await (value as Promise<string>);
      }
      observeDisplayValuePromise().then((val: string) => {
        setLoaded(val);
      })
    }
  })

  if (typeof value === 'undefined') return <KeyValueFallbackSkeleton />;

  if (typeof value === 'string') return <DisplayValueText value={value} />;

  if (!loaded) return <KeyValueFallbackSkeleton />;
  return <DisplayValueText value={loaded} />;
}

export function KeyValueWithSkeleton({ label, value }: KeyValueWithSkeletonProps): ReactElement {
  const itemContainerDivClassName = "grow w-full flex flex-row items-center justify-start gap-4" as const;
  const displayValueLabelClassName = "text-lg font-bold" as const;

  function ValueWithLabel({ children }: PropsWithChildren): ReactElement {
    return (
      <div className={itemContainerDivClassName}>
        <p className={displayValueLabelClassName}>{label}:</p>
        {children}
      </div>
    );
  }

  return (
    <ValueWithLabel>
      <DisplayValue value={value} />
    </ValueWithLabel>
  )
}
