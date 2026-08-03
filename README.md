# 🧭 Visor GPX

Aplicación web moderna para visualizar, analizar y comparar archivos **GPX** sobre mapas interactivos, con foco especial en cartografía de España (IGN).

![Stack](https://img.shields.io/badge/Next.js-15-black) ![TS](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-06B6D4) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Características

- 🗺️ **Mapa interactivo** centrado en España, con control de capas: OpenStreetMap (por defecto), Oscuro (CARTO), IGN (mapa base + ortofoto PNOA), Google Maps y Google Satélite.
- 🌓 **Interfaz en tema oscuro** por defecto (sidebar, controles, tarjetas); el mapa arranca con OpenStreetMap y se puede cambiar a la variante oscura desde el selector de capas.
- 📂 **Carga de GPX** por botón o *drag & drop*, con soporte para **múltiples archivos** superpuestos.
- 🎨 **Personalización de estilo** por track: color, grosor (1–12px), opacidad y visibilidad de puntos.
- 📊 **Cards de estadísticas**: distancia, duración, velocidad media y en movimiento, ascenso/descenso acumulado, elevación mín/máx, fecha y nombre de la ruta.
- 📈 **Perfil de elevación interactivo** (Recharts), sincronizado con el mapa: pasa el ratón por el gráfico y verás el punto resaltado sobre la ruta.
- ▶️ **Animación de reproducción** de la ruta con control de velocidad (1x–8x), play/pause y barra de progreso.
- 📍 **Waypoints** del GPX mostrados como marcadores con nombre y descripción.
- 📋 **Gestor de rutas**: mostrar/ocultar/eliminar cada track cargada; al seleccionar una, el mapa hace zoom automáticamente a esa ruta.
- ⬇️ **Exportación** a GPX y GeoJSON.
- 👤 **Cuentas de usuario (Clerk)** con tres planes — ver sección [Planes de usuario](#-planes-de-usuario-y-almacenamiento) más abajo.
- 💾 **Guardado de rutas en la nube** (Supabase) para usuarios registrados y Pro, accesibles desde cualquier dispositivo en `/mis-rutas`.
- 🔗 **Compartición por URL** (solo plan Pro): genera un enlace público de solo lectura con el mapa (OpenStreetMap) y la ruta, sin que quien lo abra necesite cuenta.
- 📱 **100% responsive**: panel lateral fijo en escritorio, *bottom sheet* deslizable en móvil.
- ⚡ **PWA instalable**, con manifest y *service worker* para el shell de la app.
- 🔍 **SEO completo**: metadata (título/descripción orientados a palabras clave), Open Graph, Twitter Cards, JSON-LD (schema.org), `robots.txt` y `sitemap.xml` dinámicos, verificación de Google Search Console.
- 🧾 **Footer** con copyright, autor y enlaces a Acerca de/contacto/blog/otras apps.
- 🧯 Estados de carga y error amigables.

## 👥 Planes de usuario y almacenamiento

La app tiene tres niveles, gestionados con [Clerk](https://clerk.com):

| Plan | Cómo se obtiene | Ver rutas a la vez | Guardar en la nube | Compartir por URL |
|---|---|---|---|---|
| **Sin registro** | Ninguna acción | Hasta 3 | ❌ | ❌ |
| **Registrado** | Crear una cuenta gratis | Ilimitadas | Hasta 10 archivos | ❌ |
| **Pro** | A solicitud al autor de la app | Ilimitadas | Ilimitados | ✅ |

- El plan **Pro no se autoconcede**: se activa a mano fijando `publicMetadata: { "plan": "pro" }` en el usuario correspondiente, desde el [dashboard de Clerk](https://dashboard.clerk.com) → *Users* → el usuario → *Metadata*. Cualquier usuario autenticado sin ese campo se trata como plan **Registrado**.
- Los usuarios sin registro nunca escriben nada en el servidor: la carga de hasta 3 GPX en el visor ocurre solo en su navegador, exactamente igual que en la versión original de la app.
- El almacenamiento de los GPX guardados usa [Supabase](https://supabase.com) (plan gratuito): el contenido del archivo se guarda como texto en una tabla de Postgres (`gpx_files`), junto con sus metadatos y, si procede, el token de compartición. No se usa Supabase Storage porque un GPX es XML de texto y pesa poco — cientos de rutas caben de sobra en los 500 MB del plan gratuito, y así evitamos gestionar buckets y URLs firmadas por separado.
- La autorización (quién puede leer/borrar/compartir cada archivo) la comprueba siempre nuestro propio backend a partir del `userId` de Clerk — no se usa Row Level Security de Supabase, así que la *service role key* de Supabase nunca debe usarse desde el navegador.

### Configuración de Clerk y Supabase

1. Crea un proyecto en [Clerk](https://dashboard.clerk.com) y copia `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY` desde *API Keys*.
2. Crea un proyecto en [Supabase](https://supabase.com/dashboard), abre el *SQL Editor* y ejecuta el contenido de [`supabase/schema.sql`](./supabase/schema.sql) para crear la tabla `gpx_files`.
3. Copia `SUPABASE_URL` y la `service_role` key (⚠️ no la `anon` key) desde *Project Settings → API*.
4. Copia `.env.example` a `.env.local` y rellena las cuatro variables:

   ```bash
   cp .env.example .env.local
   ```

5. En Vercel, añade esas mismas variables en *Project Settings → Environment Variables* antes de desplegar.

> **Nota:** el proyecto gratuito de Supabase se pausa automáticamente tras 7 días sin actividad (se reactiva con un clic desde su dashboard). Para una app con tráfico regular no debería llegar a pausarse.



## 🛠️ Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) + TypeScript |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com) + componentes propios estilo shadcn/ui (Radix UI + CVA) |
| Mapa | [Leaflet](https://leafletjs.com) + [React-Leaflet](https://react-leaflet.js.org) |
| Gráficos | [Recharts](https://recharts.org) |
| Estado global | [Zustand](https://zustand-demo.pmnd.rs) |
| Autenticación y planes | [Clerk](https://clerk.com) |
| Base de datos (rutas guardadas) | [Supabase](https://supabase.com) (Postgres) |
| Iconos | [Lucide](https://lucide.dev) |
| Despliegue | [Vercel](https://vercel.com) |

## 📁 Estructura del proyecto

```
src/
├── app/                      # App Router (layout, página principal, metadata/PWA)
│   ├── acerca-de/            # Página "Acerca de" (app + planes de usuario)
│   ├── mis-rutas/            # Dashboard de rutas guardadas (registrado/pro)
│   ├── compartir/[token]/    # Visor público de solo lectura de una ruta compartida (pro)
│   ├── sign-in/, sign-up/    # Páginas de autenticación de Clerk
│   └── api/
│       ├── gpx/              # CRUD de archivos guardados (requiere sesión)
│       └── share/[token]/    # Lectura pública de una ruta compartida
├── components/
│   ├── layout/               # AppShell, Header, overlays de error/carga, SW register
│   ├── map/                  # MapView, ShareMapView, capas de track, iconos, fitBounds
│   ├── sidebar/              # Lista de tracks, stats, perfil elevación, estilo, playback, export, guardar/compartir
│   ├── upload/                # Selector / drag&drop de archivos GPX
│   └── ui/                   # Primitivas (button, card, slider, switch, tabs)
└── lib/
    ├── gpx/                  # types, parser, stats (Haversine, elevación), export GPX/GeoJSON, acceso a Supabase
    ├── store/                 # useTracksStore (Zustand)
    ├── supabase/              # Cliente de Supabase (solo servidor, service role key)
    ├── auth/                  # Helper para leer el usuario/plan actual de Clerk
    ├── plans.ts               # Definición de los 3 planes y sus límites
    ├── constants/             # Definición de capas base (basemaps), datos del sitio
    └── utils.ts               # Helpers de formato (fecha, distancia, duración...)

supabase/
└── schema.sql                 # Esquema de la tabla gpx_files (ejecutar una vez en Supabase)
```

El código está organizado por dominio para que sea fácil extender: por ejemplo, añadir una nueva capa base es una línea en `lib/constants/basemaps.ts`, y añadir una nueva estadística es un ítem más en `StatsCards.tsx`.

## 🚀 Puesta en marcha local

Requisitos: Node.js ≥ 18.18.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Scripts disponibles

```bash
npm run dev     # servidor de desarrollo
npm run build   # build de producción
npm run start   # servidor de producción (tras build)
npm run lint    # ESLint
```

## ☁️ Despliegue en Vercel

1. Sube este repositorio a GitHub (ver sección siguiente).
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio.
3. Framework detectado automáticamente: **Next.js**.
4. Añade las 4 variables de entorno de Clerk y Supabase (ver [Configuración de Clerk y Supabase](#configuración-de-clerk-y-supabase) más arriba) en *Environment Variables*.
5. Deploy 🚀.

> **Nota de red:** las fuentes (Fraunces, Manrope, JetBrains Mono) se cargan mediante `next/font/google`, que las descarga y auto-hospeda **en tiempo de build**. Esto requiere que el entorno de build tenga acceso a `fonts.googleapis.com` / `fonts.gstatic.com` — Vercel lo tiene por defecto.

## 🔍 SEO

Toda la configuración de SEO vive centralizada en `src/lib/constants/site.ts` (URL del sitio, título, descripción, datos del autor, código de verificación de Google) — para cambiar cualquier dato (dominio final, título, etc.) solo hay que editar ese archivo.

Incluye:
- **Metadata completa** (`src/app/layout.tsx`): título orientado a palabras clave, metadescripción, `keywords`, `robots`, canonical, `authors`/`creator`/`publisher`.
- **Verificación de Google Search Console**: `verification.google` en el metadata (genera automáticamente el `<meta name="google-site-verification">`).
- **Open Graph y Twitter Cards**: usan `/public/og-image.png` (1200×630).
- **Favicon**: `/public/favicon.svg`, referenciado explícitamente en `metadata.icons` (los archivos sueltos en `public/` no se detectan solos salvo que estén en `src/app/`, así que se enlazan a mano).
- **JSON-LD** (`src/components/layout/JsonLd.tsx`): schema.org `WebApplication` con autor (`Person`), enlaces (`sameAs`) al blog y a Aitor Hub, y `contactPoint` a la página de contacto.
- **`robots.txt`** y **`sitemap.xml`** dinámicos (`src/app/robots.ts`, `src/app/sitemap.ts`), generados con las utilidades nativas de Next.js — no son archivos estáticos, se sirven en `/robots.txt` y `/sitemap.xml`.

> ⚠️ **Assets pendientes de sustituir**: `public/favicon.svg` y `public/og-image.png` se han generado como **placeholders funcionales** (mismo estilo visual que el resto de la app) para que el build no rompa y las meta tags tengan algo real que referenciar. Sustitúyelos por tus diseños definitivos antes de publicar — las rutas y el código ya están todas conectadas, solo hay que reemplazar los archivos manteniendo el mismo nombre y tamaño (`favicon.svg` vectorial; `og-image.png` a 1200×630px).

## 📤 Subir el proyecto a GitHub

```bash
git init
git add .
git commit -m "feat: visor GPX inicial"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/visor-gpx.git
git push -u origin main
```

## 🗺️ Sobre las capas de mapa

- **OpenStreetMap** — capa por defecto.
- **Oscuro (CARTO)** — variante oscura de OSM.
- **IGN Mapa Base** y **IGN Ortofoto (PNOA)** — servidas a través de un proxy propio (`/api/ign-tile/...`), no directamente desde el navegador. Ver explicación abajo.
- **Google Maps** y **Google Satélite** — tiles públicos de Google (`/vt/lyrs=...`).

> **Historial de este apartado — bugs reales encontrados y corregidos:**
> 1. **Google no se mostraba**: los subdominios se pasaban como el string `"mt0,mt1,mt2,mt3"`. Leaflet no separa por comas — trata un string de subdominios como una lista de caracteres sueltos, generando URLs inválidas. Corregido pasándolo como array: `["mt0", "mt1", "mt2", "mt3"]`. **Confirmado funcionando.**
> 2. **El selector de capas no estaba conectado al estado global**: `MapView` solo usaba el estado interno de `<LayersControl.BaseLayer>`, sin sincronizar `basemapId`/`setBasemap` del store de Zustand. Se añadió `BasemapSync` (`src/components/map/BasemapSync.tsx`), que escucha `baselayerchange` de Leaflet y actualiza el store.
> 3. **IGN seguía sin mostrarse** tras corregir el *casing* de los parámetros. Se verificó **directamente contra el servidor del IGN** (no por inferencia): `GetCapabilities` responde 200 OK con un XML válido (confirma que la capa `IGNBaseTodo` existe y soporta `GoogleMapsCompatible`), pero **`GetTile` devuelve HTTP 400 en cualquier variante de *casing*, incluso en la tesela más trivial posible (z=0, x=0, y=0)**. Este patrón — metadatos accesibles, teselas bloqueadas — es típico de una protección "hotlink" por *Referer* en servicios de tiles institucionales: aceptan consultas de metadatos desde cualquier origen, pero exigen que la petición de la imagen real venga con un `Referer` de su propio dominio.
>
>    **Solución aplicada**: en vez de pedir las teselas directamente desde el navegador, se añadió una ruta API de Next.js (`src/app/api/ign-tile/[layer]/[z]/[x]/[y]/route.ts`) que actúa de proxy: nuestro propio servidor pide la tesela al IGN (fijando `Referer: https://www.ign.es/`) y la retransmite al navegador. Como el navegador solo habla con nuestro dominio, no hay bloqueo de *referer* posible desde su lado. **Esto no se ha podido verificar en vivo**: el entorno de desarrollo desde el que se ha construido esta app no tiene salida de red hacia `ign.es`, así que la hipótesis del *Referer* está bien fundamentada pero no 100% confirmada — hace falta comprobarlo en el despliegue real de Vercel.

Puedes añadir fácilmente Thunderforest o Stadia Maps con una entrada más en `src/lib/constants/basemaps.ts` (requieren API key gratuita).

### Si el proxy de IGN tampoco funciona

Si tras desplegar sigues viendo gris en las capas IGN:
1. Abre las herramientas de desarrollador del navegador → pestaña **Network**, recarga el mapa con la capa IGN activa y busca una petición a `/api/ign-tile/...`.
2. Mira su código de estado: si es **200** pero la imagen es un cuadrado gris/vacío de 1x1, el proxy está funcionando pero el IGN sigue rechazando la petición (el header `X-Ign-Proxy-Upstream-Status` en la respuesta indica el código real que devolvió el IGN a nuestro servidor).
3. Si es un error 500, revisa los logs de la función en el dashboard de Vercel (pestaña *Functions* del proyecto) para ver el motivo exacto.

Con esa información concreta puedo ajustar el proxy con precisión, en vez de seguir probando a ciegas.

## 🧩 Extender la app

- **Nueva capa base:** añade un objeto en `BASEMAPS` (`src/lib/constants/basemaps.ts`).
- **Nueva estadística:** añade un `StatItem` en `src/components/sidebar/StatsCards.tsx` y, si hace falta, el cálculo correspondiente en `src/lib/gpx/stats.ts`.
- **Nuevo formato de exportación:** añade una función en `src/lib/gpx/export.ts` y un botón en `ExportButtons.tsx`.
- **Edición de tracks:** el store (`useTracksStore`) ya expone `updateTrackStyle`, fácil de ampliar para edición de puntos/waypoints.
- **Cambiar los límites de los planes:** edita las constantes `ANONYMOUS_MAX_TRACKS` y `REGISTERED_MAX_FILES` en `src/lib/plans.ts`.
- **Marcar a un usuario como Pro:** dashboard de Clerk → *Users* → el usuario → *Metadata* → *Public metadata* → `{ "plan": "pro" }`.
- **Migrar a Supabase Storage:** si en el futuro los GPX crecen mucho, se puede sustituir la columna `content` de `gpx_files` por un `storage_path` a un bucket de Supabase Storage sin tocar el resto de la app — la única pieza a cambiar es `src/lib/gpx/store-server.ts`.

## 📄 Licencia

MIT — usa, modifica y comparte libremente.
