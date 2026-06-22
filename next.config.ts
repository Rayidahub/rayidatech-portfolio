import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "grtvnrqzmbndbjljramm.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "*.wordpress.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
