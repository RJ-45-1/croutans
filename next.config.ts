import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.supabase.com",
      },
      // Add specific hostname from environment variable if available
      ...(process.env.NEXT_PUBLIC_SUPABASE_URL 
        ? [{
            protocol: "https" as const,
            hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '').replace('http://', ''),
          }]
        : []),
    ],
  },
};

export default nextConfig;
