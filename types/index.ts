// ─── Monitor config (from pingflow.config.json) ───────────────────────────
export interface MonitorConfig {
  id: string;
  name: string;
  url: string;
  expectedStatus: number;
}

export interface PingFlowConfig {
  monitors: MonitorConfig[];
}

// ─── Runtime status returned by the API ───────────────────────────────────
export type MonitorStatus = "operational" | "degraded" | "down" | "unknown";

export interface MonitorResult {
  id: string;
  name: string;
  url: string;
  status: MonitorStatus;
  httpStatus: number | null;
  responseTime: number | null; // ms
  checkedAt: string; // ISO-8601
  sslValid: boolean | null;
  sslExpiresAt: string | null; // ISO-8601 or null
}

export interface StatusResponse {
  overall: MonitorStatus;
  monitors: MonitorResult[];
  checkedAt: string;
}
