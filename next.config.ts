import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep Next.js workspace discovery scoped to this repository. This avoids
  // accidentally treating an unrelated package-lock.json higher in the home
  // directory as the application root.
  outputFileTracingRoot: process.cwd(),
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
