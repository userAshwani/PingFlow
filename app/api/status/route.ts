import { promises as fs } from "fs";
import path from "path";
import type { PingFlowConfig, MonitorStatus, StatusResponse } from "@/types";
import { pingMonitor } from "@/lib/ping";

// ── Route segment config ────────────────────────────────────────────────────
// Always fetch fresh results; never cache this route on the edge or CDN.
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // needs Node.js TLS APIs for SSL checks

// ─── Config loader ─────────────────────────────────────────────────────────

async function loadConfig(): Promise<PingFlowConfig> {
  const configPath = path.join(process.cwd(), "pingflow.config.json");
  const raw = await fs.readFile(configPath, "utf-8");
  return JSON.parse(raw) as PingFlowConfig;
}

// ─── Overall status resolver ───────────────────────────────────────────────

function resolveOverall(statuses: MonitorStatus[]): MonitorStatus {
  if (statuses.every((s) => s === "operational")) return "operational";
  if (statuses.some((s) => s === "down")) return "down";
  return "degraded";
}

// ─── GET /api/status ───────────────────────────────────────────────────────

export async function GET(): Promise<Response> {
  try {
    const config = await loadConfig();

    // Ping all monitors concurrently; never let one failure block the others
    const results = await Promise.all(
      config.monitors.map((monitor) => pingMonitor(monitor)),
    );

    const overall = resolveOverall(results.map((r) => r.status));

    const body: StatusResponse = {
      overall,
      monitors: results,
      checkedAt: new Date().toISOString(),
    };

    return Response.json(body, {
      headers: {
        // Allow the status page (same origin) to poll freely;
        // also useful if someone embeds a public badge.
        "Cache-Control": "no-store",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("[PingFlow] /api/status error:", err);
    return Response.json(
      { error: "Failed to load monitor configuration or run checks." },
      { status: 500 },
    );
  }
}
