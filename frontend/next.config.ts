import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Proxy removido - modo mock sem backend
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/backend/:path*",
  //       destination: "http://localhost:3001/:path*",
  //     },
  //   ];
  // },
};

export default nextConfig;
