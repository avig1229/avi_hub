import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sanity Studio pulls in jsdom (via isomorphic-dompurify), which reads its
  // own CSS file from disk and breaks when bundled into .next.
  serverExternalPackages: ["isomorphic-dompurify", "jsdom"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
