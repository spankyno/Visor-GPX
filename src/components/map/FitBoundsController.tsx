"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { GpxTrack } from "@/lib/gpx/types";

interface FitBoundsControllerProps {
  tracks: GpxTrack[];
}

/**
 * Ajusta automáticamente el viewport del mapa a los límites de las tracks visibles.
 * Solo se ejecuta cuando cambia el conjunto de ids visibles (no en cada render).
 */
export function FitBoundsController({ tracks }: FitBoundsControllerProps) {
  const map = useMap();
  const lastKeyRef = useRef<string>("");

  useEffect(() => {
    const visible = tracks.filter((t) => t.visible && t.points.length > 0);
    const key = visible.map((t) => t.id).join(",");
    if (key === lastKeyRef.current || visible.length === 0) return;
    lastKeyRef.current = key;

    const points = visible.flatMap((t) =>
      t.points.map((p) => [p.lat, p.lon] as [number, number])
    );
    if (points.length === 0) return;

    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 17 });
  }, [tracks, map]);

  return null;
}
