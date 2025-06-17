import {
  getScreenBreakpoint,
  type ScreenBreakpointID,
} from "@schemavaults/theme/ScreenBreakpoints";

export function getScreenWidthBreakpoint(
  breakpoint: ScreenBreakpointID,
): number {
  return getScreenBreakpoint(breakpoint);
}
