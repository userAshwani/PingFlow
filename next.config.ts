import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained build in .next/standalone so Docker images
  // don't need the full node_modules tree at runtime.
  output: "standalone",
};

export default nextConfig;
