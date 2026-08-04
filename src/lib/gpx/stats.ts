import type { ElevationPoint, TrackPoint, TrackStats } from "./types";

const EARTH_RADIUS_M = 6371000;

/** Distancia Haversine entre dos puntos, en metros */
export function haversineDistance(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);

  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_M * c;
}

/** Umbral de velocidad (m/s) bajo el cual se considera que no hay movimiento */
const MOVING_SPEED_THRESHOLD_MS = 0.3;
/** Umbral mínimo de variación de elevación para contar como ascenso/descenso (filtra ruido de GPS) */
const ELEVATION_NOISE_THRESHOLD_M = 0.5;

export function computeTrackStats(points: TrackPoint[]): TrackStats {
  let distanceM = 0;
  let elevationGain = 0;
  let elevationLoss = 0;
  let minElevation: number | null = null;
  let maxElevation: number | null = null;
  let movingTimeSeconds = 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const segmentDistance = haversineDistance(prev, curr);
    distanceM += segmentDistance;

    if (curr.ele !== null) {
      if (minElevation === null || curr.ele < minElevation) minElevation = curr.ele;
      if (maxElevation === null || curr.ele > maxElevation) maxElevation = curr.ele;
    }

    if (prev.ele !== null && curr.ele !== null) {
      const diff = curr.ele - prev.ele;
      if (diff > ELEVATION_NOISE_THRESHOLD_M) elevationGain += diff;
      else if (diff < -ELEVATION_NOISE_THRESHOLD_M) elevationLoss += Math.abs(diff);
    }

    if (prev.time && curr.time) {
      const dtSeconds = (curr.time.getTime() - prev.time.getTime()) / 1000;
      if (dtSeconds > 0) {
        const speedMs = segmentDistance / dtSeconds;
        if (speedMs >= MOVING_SPEED_THRESHOLD_MS) {
          movingTimeSeconds += dtSeconds;
        }
      }
    }
  }

  const startTime = points.find((p) => p.time)?.time ?? null;
  const endTime = [...points].reverse().find((p) => p.time)?.time ?? null;
  const durationSeconds =
    startTime && endTime ? (endTime.getTime() - startTime.getTime()) / 1000 : 0;

  const distanceKm = distanceM / 1000;
  const avgSpeedKmh = durationSeconds > 0 ? distanceKm / (durationSeconds / 3600) : 0;
  const avgMovingSpeedKmh =
    movingTimeSeconds > 0 ? distanceKm / (movingTimeSeconds / 3600) : 0;

  return {
    distanceKm,
    durationSeconds,
    movingTimeSeconds,
    avgSpeedKmh,
    avgMovingSpeedKmh,
    elevationGain,
    elevationLoss,
    minElevation,
    maxElevation,
    startTime,
    endTime,
  };
}

export function computeElevationProfile(points: TrackPoint[]): ElevationPoint[] {
  const profile: ElevationPoint[] = [];
  let cumulativeKm = 0;

  points.forEach((point, index) => {
    if (index > 0) {
      cumulativeKm += haversineDistance(points[index - 1], point) / 1000;
    }
    profile.push({
      distanceKm: cumulativeKm,
      elevation: point.ele ?? 0,
      lat: point.lat,
      lon: point.lon,
      index,
    });
  });

  return profile;
}

/** Reduce el número de puntos de un perfil para renderizado eficiente en gráficos */
export function downsampleProfile(
  profile: ElevationPoint[],
  maxPoints = 400
): ElevationPoint[] {
  if (profile.length <= maxPoints) return profile;
  const step = Math.ceil(profile.length / maxPoints);
  const result: ElevationPoint[] = [];
  for (let i = 0; i < profile.length; i += step) {
    result.push(profile[i]);
  }
  const last = profile[profile.length - 1];
  if (result[result.length - 1] !== last) result.push(last);
  return result;
}
