import {
  type AnimationScope,
  type MotionValue,
  m,
  useAnimate,
  useMotionValue,
  usePresence,
  useTransform,
} from "@/framer-motion";
import { type ReactElement, useEffect, useRef } from "react";
import { CursorBlinker } from "./cursor-blinker";
import { cn } from "@/lib/utils";

export interface TypewriterEffectProps {
  message: string[];
  onComplete: (animationCompleted: "enter" | "exit") => void; // called whenever the typewriter effect finishes entering OR exiting
  duration: number; // how long should enter/exit take in seconds
  className?: string;
  initial?: boolean; // whether to play initial enter animation (inherited from AnimatePresence)
}

export function TypewriterEffect({
  message,
  onComplete,
  duration,
  className,
  initial = true,
}: TypewriterEffectProps): ReactElement {
  const [isPresent, safeToRemove] = usePresence();
  const hasInitialized = useRef(false);

  const count: MotionValue<number> = useMotionValue<number>(0);
  const rounded: MotionValue<number> = useTransform(count, (latest): number =>
    Math.max(0, Math.round(latest)),
  );
  const displayText: MotionValue<string> = useTransform(
    rounded,
    (latest: number): string => {
      return message.slice(0, latest).join("");
    },
  );
  const [scope, animate] = useAnimate<HTMLSpanElement>();

  // Effect that controls enter & exit animation
  useEffect(() => {
    if (!isPresent) {
      // Exit animation: animate from current count to 0
      const keyframes: number = 0;
      const controls = animate<number>(count, keyframes, {
        type: "tween",
        duration,
        ease: "easeInOut",
        onComplete: (): void => {
          if (count.get() < 1) {
            onComplete("exit");
            safeToRemove();
          }
        },
      });
      return controls.stop;
    } else {
      // Entry animation: animate from 0 to message.length

      console.assert(
        isPresent,
        "Expected AnimatePresence to have marked this component as present if this point was reached!",
      );

      const keyframes: number = message.length;

      // If this is the initial render and initial={false}, skip animation
      if (!hasInitialized.current && !initial) {
        hasInitialized.current = true;
        count.set(keyframes);
        onComplete("enter");
        return;
      }

      hasInitialized.current = true;

      const controls = animate<number>(count, keyframes, {
        type: "tween",
        duration,
        ease: "easeInOut",
        onComplete: (): void => {
          onComplete("enter");
        },
      });
      return controls.stop;
    }
  }, [
    animate,
    count,
    duration,
    message.length,
    isPresent,
    onComplete,
    safeToRemove,
    initial,
  ]);

  return (
    <m.h1 className={cn("flex flex-row flex-nowrap items-center", className)}>
      <m.span ref={scope satisfies AnimationScope<HTMLSpanElement>}>
        {displayText}
      </m.span>
      <CursorBlinker />
    </m.h1>
  );
}

export default TypewriterEffect;
