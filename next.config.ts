import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  basePath: isProd ? "/agregators" : undefined,
  assetPrefix: isProd ? "/agregators/" : undefined,
  // output: "export", // Removed for local development, handled in build script/workflow
  /* config options here */
};

export default nextConfig;
