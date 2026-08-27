"use client";

import type { MonitorStatus } from "@/types";
import { StatusDot } from "@/components/ui/StatusDot";

interface HeaderBannerProps {
  overall: MonitorStatus;
  lastChecked: string | null; // ISO-8601
}

const bannerConfig: Record<
  MonitorStatus,
  { label: string; sub: string; border: string; bg: string }
> = {
  operational: {
    label: "All Systems Operational",
    sub: "Every monitor is running within normal parameters.",
    border: "border-green-500/20",
    bg: "bg-green-500/5",
  },
  degraded: {
    label: "Partial Degradation",
    sub: "Some monitors are reporting slower than expected response times.",
    border: "border-yellow-500/20",
    bg: "bg-yellow-500/5",
  },
  down: {
    label: "Service Disruption",
    sub: "One or more monitors are reporting outages.",
    border: "border-red-500/20",
    bg: "bg-red-500/5",
  },
  unknown: {
    label: "Status Unknown",
    sub: "Waiting for the first check to complete…",
    border: "border-neutral-700",
    bg: "bg-neutral-800/30",
  },
};

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 10) return "just now";
  if (diff < 60) return `${diff}s ago`;
  return `${Math.floor(diff / 60)}m ago`;
}

export function HeaderBanner({ overall, lastChecked }: HeaderBannerProps) {
  const cfg = bannerConfig[overall];

  return (
    <div
      className={`w-full rounded-2xl border px-6 py-5 ${cfg.border} ${cfg.bg}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <StatusDot status={overall} size="lg" />
          <div>
            <h2 className="text-lg font-semibold text-neutral-100">
              {cfg.label}
            </h2>
            <p className="text-sm text-neutral-400">{cfg.sub}</p>
          </div>
        </div>

        {lastChecked && (
          <p className="shrink-0 text-xs text-neutral-600 sm:text-right">
            Last checked{" "}
            <span className="text-neutral-500 font-medium">
              {timeAgo(lastChecked)}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
