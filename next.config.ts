import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // Derived dictionary data is read from disk by server code; make sure it ships
  // with every server function when deployed.
  outputFileTracingIncludes: {
    "/**": ["./data/generated/**"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
