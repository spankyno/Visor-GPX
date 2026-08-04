import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Evita que la respuesta anuncie "X-Powered-By: Next.js" (menos
  // información gratuita para quien esté buscando huellas del stack).
  poweredByHeader: false,
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
  async headers() {
    return [
      {
        // Se aplican a toda la app. No se usa una CSP estricta con
        // "default-src 'none'" porque la app carga tiles de mapas de varios
        // orígenes (OSM, CARTO, IGN vía nuestro proxy, Google) y el script
        // de analítica de Aitor's Hub; una CSP mal calibrada rompería el
        // mapa. Sí se fijan las cabeceras que no tienen ese riesgo.
        source: "/:path*",
        headers: [
          // Evita que la app se embeba en un <iframe> de otro origen
          // (protección contra clickjacking).
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          // Evita que el navegador intente adivinar el tipo de un recurso
          // ignorando el Content-Type declarado.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // No enviar la URL completa de origen a terceros al navegar fuera.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Desactiva APIs del navegador que esta app no necesita.
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
