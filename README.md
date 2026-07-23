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
- 📋 **Gestor de rutas**: mostrar/ocultar/eliminar cada track cargada.
- ⬇️ **Exportación** a GPX y GeoJSON.
- 📱 **100% responsive**: panel lateral fijo en escritorio, *bottom sheet* deslizable en móvil.
- ⚡ **PWA instalable**, con manifest y *service worker* para el shell de la app.
- 🧯 Estados de carga y error amigables.

## 🛠️ Stack técnico

| Capa | Tecnología |
|---|---|
| Framework | [Next.js 15](https://nextjs.org) (App Router) + TypeScript |
| Estilos | [Tailwind CSS v4](https://tailwindcss.com) + componentes propios estilo shadcn/ui (Radix UI + CVA) |
| Mapa | [Leaflet](https://leafletjs.com) + [React-Leaflet](https://react-leaflet.js.org) |
| Gráficos | [Recharts](https://recharts.org) |
| Estado global | [Zustand](https://zustand-demo.pmnd.rs) |
| Iconos | [Lucide](https://lucide.dev) |
| Despliegue | [Vercel](https://vercel.com) |

## 📁 Estructura del proyecto

```
src/
├── app/                      # App Router (layout, página principal, metadata/PWA)
├── components/
│   ├── layout/               # AppShell, Header, overlays de error/carga, SW register
│   ├── map/                  # MapView, capas de track, iconos, fitBounds
│   ├── sidebar/              # Lista de tracks, stats, perfil elevación, estilo, playback, export
│   ├── upload/                # Selector / drag&drop de archivos GPX
│   └── ui/                   # Primitivas (button, card, slider, switch, tabs)
└── lib/
    ├── gpx/                  # types, parser, stats (Haversine, elevación), export GPX/GeoJSON
    ├── store/                 # useTracksStore (Zustand)
    ├── constants/             # Definición de capas base (basemaps)
    └── utils.ts               # Helpers de formato (fecha, distancia, duración...)
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
3. Framework detectado automáticamente: **Next.js**. No se necesitan variables de entorno.
4. Deploy 🚀.

> **Nota de red:** las fuentes (Fraunces, Manrope, JetBrains Mono) se cargan mediante `next/font/google`, que las descarga y auto-hospeda **en tiempo de build**. Esto requiere que el entorno de build tenga acceso a `fonts.googleapis.com` / `fonts.gstatic.com` — Vercel lo tiene por defecto.

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
- **IGN Mapa Base** — WMTS oficial del IGN (`ign-base`, capa `IGNBaseTodo`).
- **IGN Ortofoto (PNOA)** — WMTS oficial del IGN (`pnoa-ma`, capa `OI.OrthoimageCoverage`).
- **Google Maps** y **Google Satélite** — tiles públicos de Google (`/vt/lyrs=...`).

> **Historial de este apartado — bugs reales encontrados y corregidos:**
> 1. **Google no se mostraba**: los subdominios se pasaban como el string `"mt0,mt1,mt2,mt3"`. Leaflet no separa por comas — trata un string de subdominios como una lista de caracteres sueltos (`"abc"` → `a`, `b`, `c`), así que ese valor generaba URLs inválidas como `m.google.com`, `t.google.com`... Corregido pasándolo como array: `["mt0", "mt1", "mt2", "mt3"]`.
> 2. **IGN no se mostraba**: los nombres de los parámetros de la query WMTS (`TileMatrixSet`, `TileMatrix`, `TileRow`, `TileCol`) estaban en camelCase. El servidor del IGN los requiere en **minúsculas** (`tilematrixset`, `tilematrix`, `tilerow`, `tilecol`) — los *valores* sí conservan su capitalización exacta (`GetTile`, `IGNBaseTodo`, `GoogleMapsCompatible`...). Confirmado contra el proveedor oficial `IGNBase.Todo` de [leaflet-providersESP / mapSpain](https://dieghernan.github.io/leaflet-providersESP/).
> 3. **El selector de capas no estaba conectado al estado global**: `MapView` solo usaba el estado interno de `<LayersControl.BaseLayer>`, sin sincronizarlo con `basemapId`/`setBasemap` del store de Zustand. Se añadió `BasemapSync` (`src/components/map/BasemapSync.tsx`), que escucha el evento `baselayerchange` de Leaflet y actualiza el store; y la capa marcada como `checked` ahora lee `basemapId` del store en vez de un valor fijo.
>
> Ten en cuenta que los tiles de **Google** vía `/vt/lyrs=...` son un endpoint no documentado oficialmente por Google — funciona en la práctica en proyectos personales/demo, pero para uso comercial o de alto tráfico lo recomendable es migrar a [Google Maps Platform](https://developers.google.com/maps) con tu propia clave. **IGN** es un servicio público gubernamental: puede tener cortes puntuales de mantenimiento.

Puedes añadir fácilmente Thunderforest o Stadia Maps con una entrada más en `src/lib/constants/basemaps.ts` (requieren API key gratuita).

## 🧩 Extender la app

- **Nueva capa base:** añade un objeto en `BASEMAPS` (`src/lib/constants/basemaps.ts`).
- **Nueva estadística:** añade un `StatItem` en `src/components/sidebar/StatsCards.tsx` y, si hace falta, el cálculo correspondiente en `src/lib/gpx/stats.ts`.
- **Nuevo formato de exportación:** añade una función en `src/lib/gpx/export.ts` y un botón en `ExportButtons.tsx`.
- **Edición de tracks:** el store (`useTracksStore`) ya expone `updateTrackStyle`, fácil de ampliar para edición de puntos/waypoints.

## 📄 Licencia

MIT — usa, modifica y comparte libremente.
