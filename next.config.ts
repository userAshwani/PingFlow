import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained build in .next/standalone so Docker images
  // don't need the full node_modules tree at runtime. Skip this on Vercel,
  // whose own build tracing conflicts with the standalone output and fails
  // looking for .next/next-server.js.nft.json.
  output: process.env.VERCEL ? undefined : "standalone",
};

export default nextConfig;
