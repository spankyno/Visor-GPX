import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // El linting se ejecuta en CI/build; no bloquea rutas de desarrollo.
    ignoreDuringBuilds: false,
  },
  // Next.js optimiza automáticamente (vía "barrel optimization") los imports
  // de una lista interna de paquetes, entre ellos "recharts". Con la versión
  // de React usada aquí, esa optimización rompe la resolución de la
  // dependencia interna "react-is" de recharts en producción
  // ("Cannot find module 'react-is'"). Al fijar la lista a vacío se
  // desactiva esa optimización automática y el import normal de recharts
  // funciona sin problema (el bundle es unos KB más grande, sin impacto
  // real para esta app).
  experimental: {
    optimizePackageImports: [],
  },
};

export default nextConfig;
