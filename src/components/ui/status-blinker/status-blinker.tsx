"use client";

import type { ReactElement } from "react";

export const availableStatusBlinkerColors = [
  "green",
  "yellow",
  "red",
] as const satisfies readonly string[];

export type AvailableStatusBlinkerColors =
  (typeof availableStatusBlinkerColors)[number];

function getStatusColor(status?: AvailableStatusBlinkerColors) {
  switch (status) {
    case "green":
      return "bg-green-500";
    case "yellow":
      return "bg-yellow-500";
    case "red":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

export interface StatusBlinkerProps {
  status?: AvailableStatusBlinkerColors;
}

export function StatusBlinker({ status }: StatusBlinkerProps): ReactElement {
  return (
    <div
      className={`w-3 h-3 ${getStatusColor(
        status satisfies AvailableStatusBlinkerColors | undefined,
      )} rounded-full animate-pulse mr-2`}
    />
  );
}

export default StatusBlinker;
