import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  compress: true,
  // productionBrowserSourceMaps: false, // Optional for smaller builds

  images: {
    unoptimized: true, // Disable optimization
  },

};

export default nextConfig;
