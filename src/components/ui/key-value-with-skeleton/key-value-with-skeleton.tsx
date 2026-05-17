"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  type ReactElement,
  type ReactNode,
  type PropsWithChildren,
  useState,
  useEffect,
  useRef,
} from "react";

export interface KeyValueWithSkeletonProps {
  label: string;
  value?: string | Promise<string> | null;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

function KeyValueFallbackSkeleton(): ReactElement {
  return (
    <Skeleton className="min-w-[100px] md:min-w-[140px] lg:min-w-[200px] min-h-[12px]" />
  );
}

function DisplayValueText({
  value,
  className,
}: {
  value: string;
  className?: string;
}): ReactElement {
  return <p className={cn("text-gray-400 grow", className)}>{value}</p>;
}

function DisplayValue({
  value,
  className,
}: {
  value: Promise<string> | string | null | undefined;
  className?: string;
}): ReactNode {
  const [loaded, setLoaded] = useState<string | false>(false);
  const cancelSetValueRef = useRef<boolean>(false);

  useEffect(() => {
    if (!value) return;
    if (!!value && typeof value !== "string") {
      async function observeDisplayValuePromise(): Promise<string> {
        return await (value as Promise<string>);
      }
      observeDisplayValuePromise().then((val: string) => {
        const cancelLoadHandler: boolean = cancelSetValueRef.current;
        if (!cancelLoadHandler) {
          setLoaded(val);
        }
      });

      return function unsubscribe(): void {
        cancelSetValueRef.current = true;
      };
    }
  });

  if (typeof value === "undefined") {
    return <KeyValueFallbackSkeleton />;
  } else if (typeof value === "string") {
    return <DisplayValueText value={value} className={className} />;
  } else if (!loaded) {
    return <KeyValueFallbackSkeleton />;
  } else {
    return <DisplayValueText value={loaded} className={className} />;
  }
}

function ValueWithLabel({
  label,
  className,
  labelClassName,
  children,
}: PropsWithChildren<{
  label: string;
  className?: string;
  labelClassName?: string;
}>): ReactElement {
  return (
    <div
      className={cn(
        "grow w-full flex flex-row items-center justify-start gap-4",
        className,
      )}
    >
      <p className={cn("text-lg font-bold", labelClassName)}>{label}:</p>
      {children}
    </div>
  );
}

export function KeyValueWithSkeleton({
  label,
  value,
  className,
  labelClassName,
  valueClassName,
}: KeyValueWithSkeletonProps): ReactElement {
  return (
    <ValueWithLabel
      label={label}
      className={className}
      labelClassName={labelClassName}
    >
      <DisplayValue value={value} className={valueClassName} />
    </ValueWithLabel>
  );
}

export default KeyValueWithSkeleton;
