import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL("https://fakestoreapi.com/img/**")],
  },

  // The app has no landing page; `/` is resolved before any rendering happens.
  async redirects() {
    return [{ source: "/", destination: "/products", permanent: false }];
  },
};

export default nextConfig;
