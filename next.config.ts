import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // El linting se ejecuta en CI/build; no bloquea rutas de desarrollo.
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
