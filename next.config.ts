import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/",
      // TODO:
      // destination: "https://valorease.site",
      destination: "/login",
      permanent: false,
    },
  ],
};

export default nextConfig;
