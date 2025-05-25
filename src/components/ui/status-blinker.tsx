import type { ReactElement } from "react";

function getStatusColor(status?: 'green' | 'yellow' | 'red') {
  switch (status) {
    case 'green':
      return 'bg-green-500';
    case 'yellow':
      return 'bg-yellow-500';
    case 'red':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}

export interface StatusBlinkerProps {
  status?: 'green' | 'yellow' | 'red';
}

export function StatusBlinker(
  { status }: StatusBlinkerProps
): ReactElement {
  return (
    <div
      className={`w-3 h-3 ${getStatusColor(status)} rounded-full animate-pulse mr-2`}
    />
  )
}
