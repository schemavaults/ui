import { useEffect, useState } from "react";

export function useIsMobile(mobileBreakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql: MediaQueryList = window.matchMedia(
      `(max-width: ${mobileBreakpoint - 1}px)`,
    );
    const onChange = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < mobileBreakpoint);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

export default useIsMobile;
