"use client";

import { cn } from "@/lib/utils";
import {
  type MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  FC,
  RefObject,
} from "react";
import type { SplitPaneDirection } from "./split-pane-directions";
import useSplitPaneDirectionOrDefault from "./useSplitPaneDirectionOrDefault";
import {
  EVEN_SPLIT_PERCENTAGE,
  MAX_SPLIT_PERCENTAGE,
  MIN_SPLIT_PERCENTAGE,
} from "./split-pane-acceptable-split-range";

interface SplitPaneSeparatorProps {
  direction: SplitPaneDirection;
  handleMouseDown: MouseEventHandler<HTMLDivElement>;
  splitPercentage: number;
  disabled: boolean;
}

function SplitPaneSeparator({
  direction,
  splitPercentage,
  disabled,
  handleMouseDown,
}: SplitPaneSeparatorProps): ReactElement {
  return (
    <div
      className={cn(
        !disabled
          ? `cursor-${direction === "row" ? "col" : "row"}-resize`
          : "cursor-not-allowed",
        `flex items-center justify-center bg-gray-200`,
        `${direction === "row" ? "w-1" : "h-1"}`,
      )}
      role="separator"
      aria-valuenow={splitPercentage}
      aria-valuemin={10}
      aria-valuemax={90}
      tabIndex={0}
      onMouseDown={handleMouseDown}
    >
      <div className="w-4 h-4 bg-gray-400 rounded-full" />
    </div>
  );
}

export interface SplitPaneProps {
  direction?: SplitPaneDirection;
  splitPercentage?: number;
  setSplitPercentage?: (percentage: number) => void;
  First: () => ReactElement;
  Second: () => ReactElement;
  disabled?: boolean;
  containerClassName?: string;
}

export function SplitPane(props: SplitPaneProps): ReactElement {
  const direction: SplitPaneDirection = useSplitPaneDirectionOrDefault(
    props.direction satisfies SplitPaneDirection | undefined,
  );

  const splitPercentage: number = useMemo(() => {
    if (typeof props.splitPercentage === "number") {
      if (props.splitPercentage <= MIN_SPLIT_PERCENTAGE) {
        return MIN_SPLIT_PERCENTAGE;
      } else if (props.splitPercentage >= MAX_SPLIT_PERCENTAGE) {
        return MAX_SPLIT_PERCENTAGE;
      } else {
        return props.splitPercentage;
      }
    }
    return EVEN_SPLIT_PERCENTAGE;
  }, [props.splitPercentage]);

  const FirstComponent: FC = props.First;
  const SecondComponent: FC = props.Second;

  const disabled: boolean = useMemo(() => {
    return props.disabled || typeof props.setSplitPercentage === "undefined";
  }, [props.disabled, props.setSplitPercentage]);

  const containerRef: RefObject<HTMLDivElement | null> =
    useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = useCallback((): void => {
    if (process.env.NODE_ENV === "development") {
      console.log("[SplitPane] handleMouseDown()");
    }
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent): void => {
      if (!isDragging || !containerRef.current) {
        return;
      }
      if (disabled) {
        // don't readjust size if disabled
        return;
      }

      if (typeof props.setSplitPercentage !== "function") {
        if (process.env.NODE_ENV === "development") {
          console.warn(`[SplitPane] setSplitPercentage is not a function!`);
        }
        return;
      }
      const setSplitPercentage: (p: number) => void = props.setSplitPercentage;

      const containerRect = containerRef.current.getBoundingClientRect();
      const containerSize: number =
        direction === "row" ? containerRect.width : containerRect.height;
      const currentPosition: number =
        direction === "row" ? e.clientX : e.clientY;
      const containerStart: number =
        direction === "row" ? containerRect.left : containerRect.top;

      const newSplitPixels: number = currentPosition - containerStart;
      const newSplitPercentage: number = (newSplitPixels / containerSize) * 100;

      const clampedPercentage: number = Math.min(
        Math.max(newSplitPercentage, 10),
        90,
      );

      if (process.env.NODE_ENV === "development") {
        console.log(`[SplitPane] setSplitPercentage(${clampedPercentage})`);
      }

      setSplitPercentage(clampedPercentage);
    },
    [isDragging, direction, props.setSplitPercentage, disabled],
  );

  const handleMouseUp = useCallback((): void => {
    if (process.env.NODE_ENV === "development") {
      console.log("[SplitPane] handleMouseUp()");
    }
    setIsDragging(false);
  }, []);

  useEffect(() => {
    function onMouseMoveListener(this: Window, ev: MouseEvent): void {
      handleMouseMove(ev);
      return;
    }

    if (isDragging) {
      window.addEventListener("mousemove", onMouseMoveListener);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMoveListener);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMoveListener);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        props.containerClassName ?? "w-full h-full",
      )}
    >
      <div style={{ flexBasis: `${splitPercentage}%` }}>
        <FirstComponent />
      </div>
      <SplitPaneSeparator
        direction={direction}
        splitPercentage={splitPercentage}
        disabled={disabled}
        handleMouseDown={handleMouseDown}
      />
      <div style={{ flexBasis: `${100 - splitPercentage}%` }}>
        <SecondComponent />
      </div>
    </div>
  );
}

export default SplitPane;
