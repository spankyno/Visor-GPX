export interface BasemapDef {
  id: string;
  name: string;
  group: "Estándar" | "España (IGN)" | "Google" | "Relieve";
  url: string;
  attribution: string;
  maxZoom?: number;
  subdomains?: string;
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
    name: "OSM (Oscuro)",
    group: "Estándar",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap',
    maxZoom: 20,
    subdomains: "abcd",
  },
  {
    id: "ign-mapa",
    name: "IGN Mapa Base",
    group: "España (IGN)",
    url: "https://www.ign.es/wmts/mapa-raster?service=WMTS&request=GetTile&version=1.0.0&layer=MTN&style=default&tilematrixset=GoogleMapsCompatible&tilematrix={z}&tilerow={y}&tilecol={x}&format=image/jpeg",
    attribution: "&copy; Instituto Geográfico Nacional de España",
    maxZoom: 19,
  },
  {
    id: "ign-ortofoto",
    name: "IGN Ortofoto (PNOA)",
    group: "España (IGN)",
    url: "https://www.ign.es/wmts/pnoa-ma?service=WMTS&request=GetTile&version=1.0.0&layer=OI.OrthoimageCoverage&style=default&tilematrixset=GoogleMapsCompatible&tilematrix={z}&tilerow={y}&tilecol={x}&format=image/jpeg",
    attribution: "&copy; Instituto Geográfico Nacional de España (PNOA)",
    maxZoom: 19,
  },
  {
    id: "google-roadmap",
    name: "Google Roadmap",
    group: "Google",
    url: "https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "&copy; Google",
    maxZoom: 20,
    subdomains: "mt0,mt1,mt2,mt3",
  },
  {
    id: "google-satellite",
    name: "Google Satélite",
    group: "Google",
    url: "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
    attribution: "&copy; Google",
    maxZoom: 20,
    subdomains: "mt0,mt1,mt2,mt3",
  },
  {
    id: "google-terrain",
    name: "Google Terreno",
    group: "Google",
    url: "https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}",
    attribution: "&copy; Google",
    maxZoom: 20,
    subdomains: "mt0,mt1,mt2,mt3",
  },
  {
    id: "google-hybrid",
    name: "Google Híbrido",
    group: "Google",
    url: "https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}",
    attribution: "&copy; Google",
    maxZoom: 20,
    subdomains: "mt0,mt1,mt2,mt3",
  },
  {
    id: "opentopo",
    name: "OpenTopoMap",
    group: "Relieve",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; OpenTopoMap (CC-BY-SA) &copy; OpenStreetMap',
    maxZoom: 17,
    subdomains: "abc",
  },
];

export const DEFAULT_BASEMAP_ID = "carto-dark";

export const SPAIN_CENTER: [number, number] = [40.2, -3.7];
export const SPAIN_ZOOM = 6;
