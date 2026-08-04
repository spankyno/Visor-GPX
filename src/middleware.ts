import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Rutas que requieren sesión iniciada. El resto de la app (visor, compartir,
// acerca de) es pública: los usuarios sin registro pueden seguir usándola.
const isProtectedRoute = createRouteMatcher([
  "/mis-rutas(.*)",
  "/api/gpx(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Salta los archivos internos de Next.js y los estáticos, salvo que se
    // encuentren en query params (búsquedas).
    "/((?!_next|.*\\.[\\w]+$).*)",
    "/(api|trpc)(.*)",
  ],
};
