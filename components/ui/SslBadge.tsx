"use client";

interface SslBadgeProps {
  sslValid: boolean | null;
  sslExpiresAt: string | null;
}

export function SslBadge({ sslValid, sslExpiresAt }: SslBadgeProps) {
  if (sslValid === null) {
    // HTTP site or check failed
    return (
      <span className="text-xs text-neutral-600 font-mono">HTTP</span>
    );
  }

  const daysLeft = sslExpiresAt
    ? Math.ceil(
        (new Date(sslExpiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
      )
    : null;

  const isExpiringSoon = daysLeft !== null && daysLeft < 30;

  if (!sslValid) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
        <span>🔴</span> SSL Expired
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        isExpiringSoon ? "text-yellow-400" : "text-green-400"
      }`}
    >
      <span>🔒</span>
      {daysLeft !== null ? `${daysLeft}d` : "SSL OK"}
    </span>
  );
}
