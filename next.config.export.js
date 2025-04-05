// next.config.export.js
// Config specifically for static export for GitHub Pages

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/agregators",
  assetPrefix: "/agregators/",
  // Add other production-specific config if needed
};

export default nextConfig; 