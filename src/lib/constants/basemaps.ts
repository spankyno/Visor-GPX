export interface BasemapDef {
  id: string;
  name: string;
  group: "Estándar" | "España (IGN)" | "Google" | "Relieve";
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
    // Endpoint WMTS oficial y vigente del IGN (IGNBaseTodo), verificado a través
    // del proveedor "IGNBase.Todo" del paquete rOpenSpain/mapSpain.
    url: "https://www.ign.es/wmts/ign-base?service=WMTS&request=GetTile&version=1.0.0&layer=IGNBaseTodo&style=default&format=image/png&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}",
    attribution:
      "CC BY 4.0 scne.es &middot; Instituto Geográfico Nacional (IGN)",
    maxZoom: 20,
  },
  {
    id: "ign-pnoa",
    name: "IGN Ortofoto (PNOA)",
    group: "España (IGN)",
    url: "https://www.ign.es/wmts/pnoa-ma?service=WMTS&request=GetTile&version=1.0.0&layer=OI.OrthoimageCoverage&style=default&format=image/jpeg&TileMatrixSet=GoogleMapsCompatible&TileMatrix={z}&TileRow={y}&TileCol={x}",
    attribution:
      "CC BY 4.0 scne.es &middot; Instituto Geográfico Nacional (IGN) - PNOA",
    maxZoom: 19,
  },
  {
    id: "google-roadmap",
    name: "Google Maps",
    group: "Google",
    url: "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "&copy; Google",
    maxZoom: 20,
    // Array, NO string separado por comas (ver nota en la interfaz).
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
  {
    id: "opentopo",
    name: "OpenTopoMap (relieve)",
    group: "Relieve",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: '&copy; OpenTopoMap (CC-BY-SA) &copy; OpenStreetMap',
    maxZoom: 17,
    subdomains: "abc",
  },
];

export const DEFAULT_BASEMAP_ID = "carto-dark";

export const SPAIN_CENTER: [number, number] = [40.2, -3.7];
export const SPAIN_ZOOM = 6;
