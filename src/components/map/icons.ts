import L from "leaflet";

function divIcon(html: string, size: [number, number], anchor: [number, number]) {
  return L.divIcon({
    html,
    className: "gpx-marker-icon",
    iconSize: size,
    iconAnchor: anchor,
  });
}

export const startIcon = divIcon(
  `<div class="gpx-pin gpx-pin--start"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 3v18l14-9L5 3z"/></svg></div>`,
  [28, 28],
  [14, 26]
);

export const endIcon = divIcon(
  `<div class="gpx-pin gpx-pin--end"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg></div>`,
  [28, 28],
  [14, 26]
);

export const waypointIcon = divIcon(
  `<div class="gpx-pin gpx-pin--waypoint"><svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg></div>`,
  [22, 22],
  [11, 20]
);

export function playbackIcon(color: string) {
  return L.divIcon({
    html: `<div class="gpx-playback-marker" style="--marker-color:${color}"></div>`,
    className: "gpx-playback-icon",
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}
