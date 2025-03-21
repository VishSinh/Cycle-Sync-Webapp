import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // swcMinify: true,
  compress: true,
  // productionBrowserSourceMaps: false, // Optional for smaller builds

  images: {
    unoptimized: true, // Disable optimization
    domains: ["images.pexels.com"], // Allow images from these domains
  },

};

export default nextConfig;
