import { computeElevationProfile, computeTrackStats } from "./stats";
import type { GpxTrack, TrackPoint, Waypoint } from "./types";
import { nextTrackColor, randomId } from "@/lib/utils";

export class GpxParseError extends Error {}

function textOf(el: Element | null | undefined): string | null {
  const text = el?.textContent?.trim();
  return text ? text : null;
}

function parseNumber(value: string | null): number | null {
  if (value === null) return null;
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : null;
}

function parsePoint(el: Element): TrackPoint | null {
  const lat = parseNumber(el.getAttribute("lat"));
  const lon = parseNumber(el.getAttribute("lon"));
  if (lat === null || lon === null) return null;

  const eleEl = el.getElementsByTagName("ele")[0];
  const timeEl = el.getElementsByTagName("time")[0];
  const ele = parseNumber(textOf(eleEl));
  const timeText = textOf(timeEl);

  return {
    lat,
    lon,
    ele,
    time: timeText ? new Date(timeText) : null,
  };
}

function parseWaypointEl(el: Element): Waypoint | null {
  const lat = parseNumber(el.getAttribute("lat"));
  const lon = parseNumber(el.getAttribute("lon"));
  if (lat === null || lon === null) return null;

  const eleEl = el.getElementsByTagName("ele")[0];
  const nameEl = el.getElementsByTagName("name")[0];
  const descEl = el.getElementsByTagName("desc")[0];
  const symEl = el.getElementsByTagName("sym")[0];

  return {
    lat,
    lon,
    ele: parseNumber(textOf(eleEl)),
    name: textOf(nameEl) ?? "Waypoint",
    desc: textOf(descEl) ?? undefined,
    symbol: textOf(symEl) ?? undefined,
  };
}

/**
 * Parsea el contenido de un archivo GPX y devuelve un GpxTrack completo,
 * con estadísticas y perfil de elevación ya calculados.
 */
export function parseGpxString(xml: string, fileName: string, colorIndex = 0): GpxTrack {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");

  const parserError = doc.getElementsByTagName("parsererror")[0];
  if (parserError) {
    throw new GpxParseError(`El archivo "${fileName}" no es un GPX válido.`);
  }

  const trkptEls = Array.from(doc.getElementsByTagName("trkpt"));
  // Fallback: algunos GPX solo tienen ruta (rte) en lugar de track (trk)
  const rteptEls = Array.from(doc.getElementsByTagName("rtept"));
  const pointEls = trkptEls.length > 0 ? trkptEls : rteptEls;

  if (pointEls.length === 0) {
    throw new GpxParseError(
      `El archivo "${fileName}" no contiene puntos de track (trkpt) ni de ruta (rtept).`
    );
  }

  const points = pointEls
    .map(parsePoint)
    .filter((p): p is TrackPoint => p !== null);

  const waypointEls = Array.from(doc.getElementsByTagName("wpt"));
  const waypoints = waypointEls
    .map(parseWaypointEl)
    .filter((w): w is Waypoint => w !== null);

  const nameEl =
    doc.getElementsByTagName("trk")[0]?.getElementsByTagName("name")[0] ??
    doc.getElementsByTagName("metadata")[0]?.getElementsByTagName("name")[0];
  const name = textOf(nameEl) ?? fileName.replace(/\.gpx$/i, "");

  const stats = computeTrackStats(points);
  const elevationProfile = computeElevationProfile(points);

  return {
    id: randomId(),
    fileName,
    name,
    points,
    waypoints,
    stats,
    elevationProfile,
    style: {
      color: nextTrackColor(colorIndex),
      weight: 4,
      opacity: 0.9,
      showPoints: false,
    },
    visible: true,
    rawXml: xml,
  };
}

export async function parseGpxFile(file: File, colorIndex = 0): Promise<GpxTrack> {
  const text = await file.text();
  return parseGpxString(text, file.name, colorIndex);
}
