export default function StatusPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      {/* ── Header ── */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          {/* Logo mark */}
          <span className="text-3xl">⚡</span>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            PingFlow
          </h1>
        </div>
        <p className="text-neutral-400 text-lg">
          Uptime &amp; SSL monitoring — simple, open-source, self-hostable.
        </p>
      </header>

      {/* ── Coming soon card ── */}
      <div className="w-full max-w-md rounded-2xl border border-[#2a2a2a] bg-[#111111] p-8 text-center shadow-2xl">
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.6)] animate-pulse" />
          <span className="text-sm font-medium text-neutral-300">
            Phase 1 scaffold is live
          </span>
        </div>
        <p className="text-neutral-500 text-sm">
          The status dashboard is being wired up in Phase 2. Come back soon!
        </p>
      </div>

      {/* ── Footer ── */}
      <footer className="mt-16 text-neutral-600 text-xs">
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-neutral-400 transition-colors"
        >
          ★ Star on GitHub
        </a>
        {" · "}
        <span>Open-source · MIT License</span>
      </footer>
    </main>
  );
}
