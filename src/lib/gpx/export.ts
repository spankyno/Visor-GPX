import type { GpxTrack } from "./types";

export function trackToGeoJSON(track: GpxTrack): GeoJSON.FeatureCollection {
  const lineFeature: GeoJSON.Feature = {
    type: "Feature",
    properties: {
      name: track.name,
      color: track.style.color,
      distanceKm: track.stats.distanceKm,
    },
    geometry: {
      type: "LineString",
      coordinates: track.points.map((p) => [p.lon, p.lat, p.ele ?? 0]),
    },
  };

  const waypointFeatures: GeoJSON.Feature[] = track.waypoints.map((w) => ({
    type: "Feature",
    properties: { name: w.name, desc: w.desc ?? null },
    geometry: {
      type: "Point",
      coordinates: [w.lon, w.lat, w.ele ?? 0],
    },
  }));

  return {
    type: "FeatureCollection",
    features: [lineFeature, ...waypointFeatures],
  };
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Regenera un GPX a partir de los puntos actuales de la track (útil tras ediciones futuras) */
export function trackToGpxString(track: GpxTrack): string {
  const trkpts = track.points
    .map((p) => {
      const ele = p.ele !== null ? `<ele>${p.ele}</ele>` : "";
      const time = p.time ? `<time>${p.time.toISOString()}</time>` : "";
      return `      <trkpt lat="${p.lat}" lon="${p.lon}">${ele}${time}</trkpt>`;
    })
    .join("\n");

  const wpts = track.waypoints
    .map(
      (w) =>
        `  <wpt lat="${w.lat}" lon="${w.lon}">${
          w.ele !== null ? `<ele>${w.ele}</ele>` : ""
        }<name>${escapeXml(w.name)}</name></wpt>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Visor GPX" xmlns="http://www.topografix.com/GPX/1/1">
${wpts}
  <trk>
    <name>${escapeXml(track.name)}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`;
}

export function downloadBlob(content: string, fileName: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadTrackAsGeoJSON(track: GpxTrack) {
  const geojson = trackToGeoJSON(track);
  downloadBlob(
    JSON.stringify(geojson, null, 2),
    `${track.name || "track"}.geojson`,
    "application/geo+json"
  );
}

export function downloadTrackAsGpx(track: GpxTrack) {
  downloadBlob(trackToGpxString(track), `${track.name || "track"}.gpx`, "application/gpx+xml");
}
