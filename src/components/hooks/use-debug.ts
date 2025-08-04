"use client";

export function useDebug(): boolean {
  try {
    if (process.env.NODE_ENV === "development") {
      return true;
    }
  } catch (e: unknown) {}
  try {
    if (
      typeof process.env.SCHEMAVAULTS_UI_DEBUG === "string" &&
      process.env.SCHEMAVAULTS_UI_DEBUG.includes("true")
    ) {
      return true;
    }
    if (
      typeof process.env.NEXT_PUBLIC_SCHEMAVAULTS_UI_DEBUG === "string" &&
      process.env.NEXT_PUBLIC_SCHEMAVAULTS_UI_DEBUG.includes("true")
    ) {
      return true;
    }
  } catch (e: unknown) {}

  return false;
}

export default useDebug;
