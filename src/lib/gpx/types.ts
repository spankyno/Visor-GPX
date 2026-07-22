export interface TrackPoint {
  lat: number;
  lon: number;
  ele: number | null;
  time: Date | null;
}

export interface Waypoint {
  lat: number;
  lon: number;
  ele: number | null;
  name: string;
  desc?: string;
  symbol?: string;
}

export interface TrackStats {
  distanceKm: number;
  durationSeconds: number;
  movingTimeSeconds: number;
  avgSpeedKmh: number;
  avgMovingSpeedKmh: number;
  elevationGain: number;
  elevationLoss: number;
  minElevation: number | null;
  maxElevation: number | null;
  startTime: Date | null;
  endTime: Date | null;
}

export interface ElevationPoint {
  /** distancia acumulada en km */
  distanceKm: number;
  elevation: number;
  lat: number;
  lon: number;
  index: number;
}

export interface TrackStyle {
  color: string;
  weight: number;
  opacity: number;
  showPoints: boolean;
}

export interface GpxTrack {
  id: string;
  fileName: string;
  name: string;
  points: TrackPoint[];
  waypoints: Waypoint[];
  stats: TrackStats;
  elevationProfile: ElevationPoint[];
  style: TrackStyle;
  visible: boolean;
  rawXml: string;
}
