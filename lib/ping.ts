import https from "https";
import type { MonitorConfig, MonitorResult, MonitorStatus } from "@/types";

/** How long (ms) to wait before aborting a check */
const TIMEOUT_MS = 10_000;

// ─── SSL helper ────────────────────────────────────────────────────────────

/**
 * Returns the TLS certificate expiry date for a given hostname, or null if
 * it cannot be determined (HTTP sites, errors, etc.).
 */
function getSslExpiry(hostname: string): Promise<Date | null> {
  return new Promise((resolve) => {
    const req = https.request(
      { host: hostname, port: 443, method: "HEAD", path: "/" },
      (res) => {
        // The socket is available on the response after TLS negotiation
        const socket = res.socket as import("tls").TLSSocket;
        if (socket && typeof socket.getPeerCertificate === "function") {
          const cert = socket.getPeerCertificate();
          if (cert && cert.valid_to) {
            resolve(new Date(cert.valid_to));
            req.destroy();
            return;
          }
        }
        resolve(null);
        req.destroy();
      },
    );

    req.on("error", () => resolve(null));
    req.setTimeout(TIMEOUT_MS, () => {
      req.destroy();
      resolve(null);
    });
    req.end();
  });
}

// ─── Status resolver ───────────────────────────────────────────────────────

function resolveStatus(
  httpStatus: number | null,
  expectedStatus: number,
  responseTime: number | null,
): MonitorStatus {
  if (httpStatus === null) return "down";
  if (httpStatus === expectedStatus) {
    // Flag as degraded if response time exceeds 3 s
    if (responseTime !== null && responseTime > 3_000) return "degraded";
    return "operational";
  }
  // 5xx → down, anything else unexpected → degraded
  if (httpStatus >= 500) return "down";
  return "degraded";
}

// ─── Main ping function ────────────────────────────────────────────────────

/**
 * Pings a single monitor and returns its full result.
 * Never throws — all errors are captured in the returned object.
 */
export async function pingMonitor(monitor: MonitorConfig): Promise<MonitorResult> {
  const { id, name, url, expectedStatus } = monitor;
  const checkedAt = new Date().toISOString();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let httpStatus: number | null = null;
  let responseTime: number | null = null;
  let sslValid: boolean | null = null;
  let sslExpiresAt: string | null = null;

  try {
    const start = performance.now();

    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      // Disable Next.js fetch cache — we always want a fresh result
      cache: "no-store",
      headers: {
        "User-Agent": "PingFlow/1.0 (+https://github.com/pingflow)",
      },
    });

    responseTime = Math.round(performance.now() - start);
    httpStatus = response.status;

    // SSL check (only for HTTPS)
    if (url.startsWith("https://")) {
      try {
        const parsed = new URL(url);
        const expiry = await getSslExpiry(parsed.hostname);
        if (expiry) {
          const daysUntilExpiry =
            (expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
          sslValid = daysUntilExpiry > 0;
          sslExpiresAt = expiry.toISOString();
        }
      } catch {
        // SSL check failure is non-fatal
      }
    }
  } catch (err: unknown) {
    // AbortError → timeout; network errors → down
    if (err instanceof Error && err.name === "AbortError") {
      responseTime = TIMEOUT_MS; // treat timeout as max latency
    }
    // httpStatus stays null → status will resolve to "down"
  } finally {
    clearTimeout(timeout);
  }

  const status = resolveStatus(httpStatus, expectedStatus, responseTime);

  return {
    id,
    name,
    url,
    status,
    httpStatus,
    responseTime,
    checkedAt,
    sslValid,
    sslExpiresAt,
  };
}
