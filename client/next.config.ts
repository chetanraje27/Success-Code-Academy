import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/courses/1",
        destination: "/courses/neet-fresher",
        permanent: true,
      },
      {
        source: "/courses/3",
        destination: "/courses/neet-repeaters",
        permanent: true,
      },
      {
        source: "/courses/4",
        destination: "/courses/online-test-series",
        permanent: true,
      },
      {
        source: "/courses/5",
        destination: "/courses/offline-test-series",
        permanent: true,
      },
    ];
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oicllytbkouwwvgrxgoz.supabase.co",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
