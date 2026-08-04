// Service worker mínimo: cachea el shell de la app para permitir instalación y
// una carga inicial más rápida en visitas repetidas. No cachea datos de mapas/tiles
// ni respuestas de la API (/api/*), que son siempre dinámicas y específicas del
// usuario (rutas guardadas, nombres, compartición...); cachearlas dejaría al
// usuario viendo datos obsoletos para siempre, ya que nunca se refrescarían.
const CACHE_NAME = "visor-gpx-shell-v2";
const SHELL_URLS = ["/", "/manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  // Nunca interceptar la API: siempre debe ir a red, nunca a caché.
  if (url.pathname.startsWith("/api/")) return;

  // Network-first: intenta siempre la red primero (para no servir shell
  // desactualizado tras un despliegue) y solo cae a la caché si no hay
  // conexión.
  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      })
      .catch(() => caches.match(request))
  );
});
