import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    globalNotFound: true,
    cpus: 2,
    proxyClientMaxBodySize: "52mb",
  },
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
