import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Local server images
      {
        protocol: "http",
        hostname: "10.10.7.102",
        port: "5001",
        pathname: "/image/**",
      },

      // ibb image hosting
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
          {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
          {
        protocol: 'http',
        hostname: '10.10.7.101',
        pathname: '/**',
      },
    ],
  //     remotePatterns: [
  //   {
  //     protocol: "https",
  //     hostname: "**",
  //   },
  // ],
  },
};

export default nextConfig;

