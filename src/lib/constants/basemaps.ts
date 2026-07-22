export interface BasemapDef {
  id: string;
  name: string;
  group: "Estándar" | "Relieve";
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
    name: "Oscuro (CARTO)",
    group: "Estándar",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution:
      '&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; OpenStreetMap',
    maxZoom: 20,
    subdomains: "abcd",
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
