"use client";

interface ResponseBarsProps {
  /** Array of response times in ms (newest last). Max ~30 shown. */
  history: (number | null)[];
}

/** Cap used for bar height scaling (ms). Anything >= this = full-height red bar. */
const MAX_MS = 2000;

function barColor(ms: number | null): string {
  if (ms === null) return "bg-neutral-700";
  if (ms < 500) return "bg-green-500";
  if (ms < 1500) return "bg-yellow-500";
  return "bg-red-500";
}

function barHeight(ms: number | null): number {
  if (ms === null) return 20; // neutral short bar for missing data
  return Math.min(100, Math.round((ms / MAX_MS) * 100));
}

export function ResponseBars({ history }: ResponseBarsProps) {
  // Keep last 30 readings
  const visible = history.slice(-30);

  // Pad left with nulls so we always show 30 slots
  const padded: (number | null)[] = [
    ...Array<null>(Math.max(0, 30 - visible.length)).fill(null),
    ...visible,
  ];

  return (
    <div
      className="flex items-end gap-[2px] h-8"
      aria-label="Response time history"
      role="img"
    >
      {padded.map((ms, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-sm transition-all duration-300 ${barColor(ms)}`}
          style={{ height: `${barHeight(ms)}%` }}
          title={ms !== null ? `${ms} ms` : "No data"}
        />
      ))}
    </div>
  );
}
