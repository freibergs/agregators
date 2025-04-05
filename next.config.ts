import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
// Specific flag for GitHub Pages build to enable static export
const isGithubPagesBuild = process.env.IS_GITHUB_PAGES_BUILD === 'true';

const nextConfig: NextConfig = {
  // Enable static export only when IS_GITHUB_PAGES_BUILD is true
  output: isGithubPagesBuild ? "export" : undefined,
  // basePath and assetPrefix are needed for GitHub Pages (production)
  basePath: isProd ? "/agregators" : undefined,
  assetPrefix: isProd ? "/agregators/" : undefined,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  /* config options here */
};

export default nextConfig;
