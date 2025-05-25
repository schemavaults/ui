"use client";

import { cn } from "@/lib/utils";
import { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState, type ReactElement } from "react";

type SplitPaneDirection = 'row' | 'col'

interface SplitPaneSeparatorProps {
  direction: SplitPaneDirection;
  handleMouseDown: MouseEventHandler<HTMLDivElement>;
  splitPercentage: number;
  disabled: boolean;
}

function SplitPaneSeparator({ direction, splitPercentage, disabled, handleMouseDown }: SplitPaneSeparatorProps): ReactElement {

  return (
    <div
      className={cn(
        !disabled ? `cursor-${direction === 'row' ? 'col' : 'row'}-resize` : 'cursor-not-allowed',
        `flex items-center justify-center bg-gray-200`,
        `${direction === 'row' ? 'w-1' : 'h-1'}`
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
  )
}

export interface SplitPaneProps {
  direction?: SplitPaneDirection;
  splitPercentage?: number;
  setSplitPercentage?: (percentage: number) => void;
  First: () => ReactElement;
  Second: () => ReactElement;
  disabled?: boolean;
}

const MIN_SPLIT_PERCENTAGE: number = 10;
const MAX_SPLIT_PERCENTAGE: number = 90;
const EVEN_SPLIT_PERCENTAGE: number = 50;

export function SplitPane(props: SplitPaneProps): ReactElement {
  const direction: SplitPaneDirection = useMemo((): SplitPaneDirection => {
    if (!props.direction) return 'row';
    if (typeof props.direction !== 'string' || props.direction.length !== 3) {
      throw new Error("If defined, expect props.direction to be a 3 letter string ('row'/'col')")
    }
    if (props.direction === 'row') return 'row';
    else if (props.direction === 'col') return 'col';
    else throw new Error("Failed to determine direction for SplitPane component layout!")
  }, [props.direction]);

  const splitPercentage: number = useMemo(() => {
    if (typeof props.splitPercentage === 'number') {
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

  const FirstComponent = props.First;
  const SecondComponent = props.Second;

  const disabled: boolean = useMemo(() => {
    return props.disabled || typeof props.setSplitPercentage === 'undefined'
  }, [props.disabled, props.setSplitPercentage]);

  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback((): void => {
    setIsDragging(true)
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent): void => {
    if (!isDragging || !containerRef.current) return
    if (typeof props.setSplitPercentage !== 'function') return;
    const setSplitPercentage = props.setSplitPercentage;


    const containerRect = containerRef.current.getBoundingClientRect()
    const containerSize = direction === 'row' ? containerRect.width : containerRect.height
    const currentPosition = direction === 'row' ? e.clientX : e.clientY
    const containerStart = direction === 'row' ? containerRect.left : containerRect.top

    const newSplitPixels = currentPosition - containerStart
    const newSplitPercentage = (newSplitPixels / containerSize) * 100

    const clampedPercentage = Math.min(Math.max(newSplitPercentage, 10), 90)

    setSplitPercentage(clampedPercentage)
  }, [isDragging, direction, props.setSplitPercentage])

  const handleMouseUp = useCallback((): void => {
    setIsDragging(false)
  }, []);

  useEffect(() => {
    function onMouseMoveListener(this: Window, ev: MouseEvent): void {
      handleMouseMove(ev);
      return;
    }

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMoveListener)
      window.addEventListener('mouseup', handleMouseUp)
    } else {
      window.removeEventListener('mousemove', onMouseMoveListener)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMoveListener)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div
      className={cn(
        'flex',
        direction === 'row' ? 'flex-row' : 'flex-col',
        'w-full h-full'
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
  )
}
