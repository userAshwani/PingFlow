"use client";

import type { MonitorResult } from "@/types";
import { StatusDot } from "@/components/ui/StatusDot";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ResponseBars } from "@/components/ui/ResponseBars";
import { SslBadge } from "@/components/ui/SslBadge";

interface MonitorCardProps {
  monitor: MonitorResult;
  /** Client-accumulated response time history (newest last) */
  history: (number | null)[];
}

export function MonitorCard({ monitor, history }: MonitorCardProps) {
  const { name, url, status, httpStatus, responseTime, sslValid, sslExpiresAt } =
    monitor;

  // Strip protocol for display
  const displayUrl = url.replace(/^https?:\/\//, "");

  return (
    <div className="group relative flex flex-col gap-3 rounded-xl border border-[#2a2a2a] bg-[#111111] px-5 py-4 transition-colors duration-200 hover:border-[#3a3a3a] hover:bg-[#141414]">
      {/* ── Row 1: Identity + status ── */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <StatusDot status={status} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-neutral-100">
              {name}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="block truncate text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              {displayUrl}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* ── Row 2: Sparkline ── */}
      <ResponseBars history={history} />

      {/* ── Row 3: Metrics footer ── */}
      <div className="flex items-center justify-between text-xs text-neutral-500">
        <div className="flex items-center gap-3">
          {/* Response time */}
          {responseTime !== null ? (
            <span className="font-mono">
              <span
                className={
                  responseTime < 500
                    ? "text-green-400"
                    : responseTime < 1500
                      ? "text-yellow-400"
                      : "text-red-400"
                }
              >
                {responseTime}
              </span>{" "}
              ms
            </span>
          ) : (
            <span className="text-neutral-600 font-mono">— ms</span>
          )}

          {/* HTTP status code pill */}
          {httpStatus !== null && (
            <span
              className={`font-mono ${
                httpStatus >= 200 && httpStatus < 300
                  ? "text-green-500/70"
                  : httpStatus >= 500
                    ? "text-red-500/70"
                    : "text-yellow-500/70"
              }`}
            >
              HTTP {httpStatus}
            </span>
          )}
        </div>

        {/* SSL badge */}
        <SslBadge sslValid={sslValid} sslExpiresAt={sslExpiresAt} />
      </div>
    </div>
  );
}
