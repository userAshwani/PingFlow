"use client";

import type { MonitorStatus } from "@/types";

interface StatusDotProps {
  status: MonitorStatus;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-2 w-2",
  md: "h-3 w-3",
  lg: "h-4 w-4",
};

const colorMap: Record<MonitorStatus, string> = {
  operational: "bg-green-500",
  degraded: "bg-yellow-500",
  down: "bg-red-500",
  unknown: "bg-neutral-500",
};

const glowMap: Record<MonitorStatus, string> = {
  operational:
    "shadow-[0_0_6px_2px_rgba(34,197,94,0.55)]",
  degraded:
    "shadow-[0_0_6px_2px_rgba(234,179,8,0.55)]",
  down:
    "shadow-[0_0_6px_2px_rgba(239,68,68,0.55)]",
  unknown: "",
};

export function StatusDot({ status, size = "md" }: StatusDotProps) {
  return (
    <span className="relative flex items-center justify-center">
      {status === "operational" && (
        <span
          className={`absolute inline-block rounded-full ${sizeMap[size]} ${colorMap[status]} animate-ping opacity-60`}
        />
      )}
      <span
        className={`relative inline-block rounded-full ${sizeMap[size]} ${colorMap[status]} ${glowMap[status]}`}
      />
    </span>
  );
}

