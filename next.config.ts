import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ac.goit.global",
        port: "",
        pathname: "/fullstack/career/campers/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
