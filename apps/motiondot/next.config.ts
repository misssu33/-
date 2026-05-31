import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@motiondot/shared",
    "@motiondot/presets",
    "@motiondot/queue",
    "@motiondot/ffmpeg",
    "@motiondot/remotion",
  ],
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
