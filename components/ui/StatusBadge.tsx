"use client";

import type { MonitorStatus } from "@/types";

interface StatusBadgeProps {
  status: MonitorStatus;
}

const labelMap: Record<MonitorStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
  unknown: "Unknown",
};

const styleMap: Record<MonitorStatus, string> = {
  operational:
    "bg-green-500/10 text-green-400 ring-1 ring-green-500/30",
  degraded:
    "bg-yellow-500/10 text-yellow-400 ring-1 ring-yellow-500/30",
  down:
    "bg-red-500/10 text-red-400 ring-1 ring-red-500/30",
  unknown:
    "bg-neutral-500/10 text-neutral-400 ring-1 ring-neutral-500/20",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styleMap[status]}`}
    >
      {labelMap[status]}
    </span>
  );
}

