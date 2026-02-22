import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}/api/:path*`,
      },
      {
        source: "/login/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}/login/:path*`,
      },
       {
        source: "/oauth2/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}/oauth2/:path*`,
      },
      {
        source: "/s/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}/s/:path*`,
      }
    ];
  },
};

export default nextConfig;
