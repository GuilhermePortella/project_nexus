import type { NextConfig } from "next";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.NEXT_BASE_PATH || undefined,

  // evita que um aviso novo de lint derrube seu deploy
  eslint: { ignoreDuringBuilds: true },
} as unknown as NextConfig;

export default nextConfig;
