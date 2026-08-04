export interface BasemapDef {
  id: string;
  name: string;
  group: "Estándar" | "España (IGN)" | "Google";
  url: string;
  attribution: string;
  maxZoom?: number;
  /**
   * Subdominios para el balanceo de tiles. IMPORTANTE: Leaflet trata un string
   * como una lista de caracteres individuales (p.ej. "abc" -> a, b, c), así que
   * los subdominios de varios caracteres (p.ej. Google: mt0, mt1...) deben
   * pasarse SIEMPRE como array, nunca como "mt0,mt1,mt2,mt3".
   */
  subdomains?: string | string[];
}

export const BASEMAPS: BasemapDef[] = [
  {
    id: "osm",
    name: "OpenStreetMap",
    group: "Estándar",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19,
    subdomains: "abc",
  },
  {
    id: "carto-dark",
    name: "Oscuro (CARTO)",
    group: "Estándar",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap',
    maxZoom: 20,
    subdomains: "abcd",
  },
  {
    id: "ign-base",
    name: "IGN Mapa Base",
    group: "España (IGN)",
    // Servido a través de nuestro propio proxy (/api/ign-tile) en vez de pedirlo
    // directamente al IGN desde el navegador: el GetTile del IGN devuelve 400
    // sin un Referer propio, mientras que GetCapabilities sí responde sin él.
    // Ver src/app/api/ign-tile/[layer]/[z]/[x]/[y]/route.ts.
    url: "/api/ign-tile/base/{z}/{x}/{y}",
    attribution: "CC BY 4.0 scne.es &middot; Instituto Geográfico Nacional (IGN)",
    maxZoom: 20,
  },
  {
    id: "ign-pnoa",
    name: "IGN Ortofoto (PNOA)",
    group: "España (IGN)",
    url: "/api/ign-tile/pnoa/{z}/{x}/{y}",
    attribution: "CC BY 4.0 scne.es &middot; Instituto Geográfico Nacional (IGN) - PNOA",
    maxZoom: 19,
  },
  {
    id: "google-roadmap",
    name: "Google Maps",
    group: "Google",
    url: "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "&copy; Google",
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  },
  {
    id: "google-satellite",
    name: "Google Satélite",
    group: "Google",
    url: "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    attribution: "&copy; Google",
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  },
];

export const DEFAULT_BASEMAP_ID = "osm";

export const SPAIN_CENTER: [number, number] = [40.2, -3.7];
export const SPAIN_ZOOM = 6;
