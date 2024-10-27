import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/",
      destination: "https://valorease.site",
      permanent: true,
    },
  ],
};

export default nextConfig;
