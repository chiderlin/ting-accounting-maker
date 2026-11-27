import type { NextConfig } from "next";

const pages = process.env.GITHUB_PAGES === "true";
const nextConfig: NextConfig = {
  ...(pages ? {
    output: "export",
    basePath: process.env.PAGES_BASE_PATH || "/ting-accounting-maker",
    trailingSlash: true,
    images: { unoptimized: true },
  } : {}),
};

export default nextConfig;
