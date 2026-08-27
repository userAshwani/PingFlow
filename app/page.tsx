"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MonitorResult, StatusResponse } from "@/types";
import { HeaderBanner } from "@/components/HeaderBanner";
import { MonitorCard } from "@/components/MonitorCard";

// ─── Constants ───────────────────────────────────────────────────────────────

/** Polling interval in ms */
const POLL_INTERVAL = 30_000;

// ─── History store ───────────────────────────────────────────────────────────
// Map of monitorId → array of response times (newest last, max 30 entries)
type HistoryMap = Record<string, (number | null)[]>;

function appendHistory(
  prev: HistoryMap,
  monitors: MonitorResult[],
): HistoryMap {
  const next = { ...prev };
  for (const m of monitors) {
    const existing = next[m.id] ?? [];
    next[m.id] = [...existing, m.responseTime].slice(-30);
  }
  return next;
}

// ─── Stats helpers ────────────────────────────────────────────────────────────

function avgResponseTime(monitors: MonitorResult[]): number | null {
  const times = monitors
    .map((m) => m.responseTime)
    .filter((t): t is number => t !== null);
  if (times.length === 0) return null;
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-[#2a2a2a] bg-[#111111] px-5 py-4 animate-pulse"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="h-3 w-3 rounded-full bg-neutral-800" />
            <div className="h-3 w-32 rounded bg-neutral-800" />
          </div>
          <div className="h-8 w-full rounded bg-neutral-800/50 mb-3" />
          <div className="flex justify-between">
            <div className="h-3 w-16 rounded bg-neutral-800" />
            <div className="h-3 w-12 rounded bg-neutral-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function StatusPage() {
  const [data, setData] = useState<StatusResponse | null>(null);
  const [history, setHistory] = useState<HistoryMap>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/status", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: StatusResponse = await res.json();
      setData(json);
      setHistory((prev) => appendHistory(prev, json.monitors));
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch status.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    timerRef.current = setInterval(fetchStatus, POLL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchStatus]);

  // Derived stats
  const operational = data?.monitors.filter((m) => m.status === "operational").length ?? 0;
  const total = data?.monitors.length ?? 0;
  const avg = data ? avgResponseTime(data.monitors) : null;

  return (
    <div className="min-h-screen bg-[#0a0a0a]" style={{ colorScheme: "dark" }}>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── Site header ── */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-2xl" aria-hidden="true">⚡</span>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              PingFlow
            </h1>
          </div>
          <p className="text-neutral-500 text-sm">
            Real-time uptime &amp; SSL monitoring
          </p>
        </header>

        {/* ── Error state ── */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
            ⚠ Could not reach the status API: <span className="font-mono">{error}</span>
          </div>
        )}

        {/* ── Overall banner ── */}
        <div className="mb-8">
          <HeaderBanner
            overall={data?.overall ?? "unknown"}
            lastChecked={data?.checkedAt ?? null}
          />
        </div>

        {/* ── Stats row ── */}
        {data && (
          <div className="mb-6 grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Monitors", value: String(total) },
              {
                label: "Operational",
                value: `${operational}/${total}`,
              },
              {
                label: "Avg Response",
                value: avg !== null ? `${avg} ms` : "—",
              },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-xl border border-[#2a2a2a] bg-[#111111] px-4 py-3"
              >
                <p className="text-lg font-semibold tabular-nums text-neutral-100">
                  {value}
                </p>
                <p className="text-xs text-neutral-500">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Monitor list ── */}
        <section aria-label="Monitor list">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-600">
              Monitors
            </h2>
            {!loading && (
              <button
                onClick={fetchStatus}
                className="text-xs text-neutral-600 hover:text-neutral-300 transition-colors"
                aria-label="Refresh status"
              >
                ↻ Refresh
              </button>
            )}
          </div>

          {loading ? (
            <Skeleton />
          ) : (
            <div className="flex flex-col gap-3">
              {data?.monitors.map((monitor) => (
                <MonitorCard
                  key={monitor.id}
                  monitor={monitor}
                  history={history[monitor.id] ?? []}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Footer ── */}
        <footer className="mt-14 flex flex-col items-center gap-2 text-xs text-neutral-700">
          <div className="flex items-center gap-1">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span>Polling every {POLL_INTERVAL / 1000}s</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-neutral-400 transition-colors"
            >
              ★ GitHub
            </a>
            <span>·</span>
            <span>Open-source · MIT</span>
            <span>·</span>
            <span>
              Built with{" "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noreferrer"
                className="hover:text-neutral-400 transition-colors"
              >
                Next.js
              </a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
