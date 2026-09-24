import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const converterApiUrl = (process.env.CONVERTER_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
    return [
      {
        source: "/api/py/:path*",
        destination: `${converterApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
