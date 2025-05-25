"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, m } from "framer-motion";
import {
  createContext,
  type FC,
  type PropsWithChildren,
  type ReactElement,
  type RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export interface IAnyPositionContextMenuHOCInput<
  T extends object,
  ContextMenuContentComponentType extends Node,
> {
  getKey: (data: T) => string; // get key for an open node
  initialData?: T | null;
  initialPosition?: { x: number; y: number } | null;
  ContextMenuContent: FC<{
    data: T;
    ref: RefObject<ContextMenuContentComponentType | null>;
    close: () => void;
  }>;
}

export interface IAnyPositionContextMenuHOCOutput<T extends object> {
  AnyPositionContextMenuProvider: FC;
  useContextMenuData: () => T | null;
  useCloseContextMenu: () => () => void;
  useOpenContextMenu: () => (
    position: { x: number; y: number },
    data: T,
  ) => void;
}

function useContextMenuDebug(): boolean {
  return useMemo(() => {
    let isDebug: boolean = false;
    try {
      if (process.env.NODE_ENV === "development") {
        isDebug = true;
      }
    } catch (e: unknown) {}
    return isDebug;
  }, []);
}

export function AnyPositionContextMenuHOC<
  T extends object,
  ContextMenuContentComponentType extends Node,
>({
  initialData,
  initialPosition,
  ContextMenuContent,
}: IAnyPositionContextMenuHOCInput<
  T,
  ContextMenuContentComponentType
>): IAnyPositionContextMenuHOCOutput<T> {
  const debug: boolean = useContextMenuDebug();

  const PositionContext = createContext<{ x: number; y: number } | null>(null);
  const ContextMenuDataContext = createContext<T | null>(null);

  const [state, setState] = useState<{
    position: { x: number; y: number } | null;
    data: T | null;
  }>({
    position: initialPosition ?? null,
    data: initialData ?? null,
  });

  const contextMenuData = useMemo((): T | null => {
    return state.data;
  }, [state]);

  const contextMenuPosition = useMemo((): { x: number; y: number } | null => {
    return state.position;
  }, [state]);

  const closeContextMenuCallback = useCallback((): void => {
    if (debug) {
      console.log("[AnyPositionContextMenuHOC] closeContextMenuCallback()");
    }
    setState({
      position: null,
      data: null,
    });
    return;
  }, [setState]);

  function AnyPositionContextMenuRenderer({
    hideContextMenu,
  }: {
    hideContextMenu: () => void;
  }): ReactElement {
    const position: { x: number; y: number } | null =
      useContext(PositionContext);
    const data: T | null = useContext(ContextMenuDataContext);
    const menuRef = useRef<ContextMenuContentComponentType | null>(null);

    useEffect(() => {
      function handleClickOutside(event: MouseEvent): void {
        if (!menuRef || !menuRef.current) {
          return;
        }
        try {
          if (debug) {
            console.log(
              "[AnyPositionContextMenuHOC] handleClickOutside() menuRef:",
              menuRef,
              "eventTarget:",
              event.target,
            );
          }
          if (
            menuRef.current &&
            !menuRef.current.contains(event.target as Node)
          ) {
            if (debug) {
              console.log(
                "[AnyPositionContextMenuHOC] handleClickOutside() - closing context menu...",
              );
            }
            hideContextMenu();
          } else {
            if (debug) {
              console.log(
                "[AnyPositionContextMenuHOC] handleClickOutside() - click appears to be within context menu boundary - pass...",
              );
            }
            return;
          }
        } catch (e: unknown) {
          console.warn(
            "Failed to check if context menu should be closed based on clicking outside of menu!",
            e,
          );
        }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [hideContextMenu]);

    return (
      <AnimatePresence mode="wait">
        {position && data && (
          <m.div
            key={`s`}
            animate={{
              opacity: 1,
              scale: "100%",
            }}
            exit={{
              opacity: 0,
              scale: "0%",
            }}
            initial={{
              opacity: 0,
              scale: "0%",
            }}
            style={{
              top: position.y,
              left: position.x,
              position: "absolute",
              pointerEvents: "auto",
            }}
          >
            <ContextMenuContent
              data={data}
              ref={menuRef}
              close={closeContextMenuCallback}
            />
          </m.div>
        )}
      </AnimatePresence>
    );
  }

  function AnyPositionContextMenuProvider(): ReactElement {
    return (
      <PositionContext.Provider value={contextMenuPosition}>
        <ContextMenuDataContext.Provider value={contextMenuData}>
          <AnyPositionContextMenuRenderer
            hideContextMenu={closeContextMenuCallback}
          />
        </ContextMenuDataContext.Provider>
      </PositionContext.Provider>
    );
  }

  const openContextMenuCallback = useCallback(
    (position: { x: number; y: number }, data: T) => {
      if (debug) {
        console.log(
          "[AnyPositionContextMenuHOC] openContextMenuCallback(",
          position,
          data,
          ")",
        );
      }
      setState({
        position,
        data,
      });
    },
    [setState],
  );

  return {
    AnyPositionContextMenuProvider,
    useCloseContextMenu() {
      return closeContextMenuCallback;
    },
    useContextMenuData() {
      return contextMenuData;
    },
    useOpenContextMenu() {
      return openContextMenuCallback;
    },
  };
}
