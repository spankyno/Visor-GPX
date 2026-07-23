"use client";

import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { GpxTrack } from "@/lib/gpx/types";

interface FitBoundsControllerProps {
  tracks: GpxTrack[];
  activeTrackId: string | null;
}

/**
 * Controla el encuadre automático del mapa en dos situaciones:
 * 1. Al cargar/quitar tracks: encuadra TODAS las tracks visibles (vista de
 *    comparación), solo cuando cambia el conjunto de ids visibles.
 * 2. Al seleccionar una ruta en la lista (cambia `activeTrackId`): hace zoom
 *    específicamente a esa ruta.
 */
export function FitBoundsController({ tracks, activeTrackId }: FitBoundsControllerProps) {
  const map = useMap();
  const lastVisibleKeyRef = useRef<string>("");
  const lastActiveIdRef = useRef<string | null>(null);

  // 1. Encuadre a todas las tracks visibles cuando cambia el conjunto cargado.
  useEffect(() => {
    const visible = tracks.filter((t) => t.visible && t.points.length > 0);
    const key = visible
      .map((t) => t.id)
      .sort()
      .join(",");
    if (key === lastVisibleKeyRef.current || visible.length === 0) return;
    lastVisibleKeyRef.current = key;

    // Si solo hay una track visible, el efecto 2 (abajo) ya se encarga del
    // zoom a esa track en concreto; aquí solo interesa la vista conjunta
    // cuando hay varias rutas cargadas a la vez.
    if (visible.length < 2) return;

    const points = visible.flatMap((t) =>
      t.points.map((p) => [p.lat, p.lon] as [number, number])
    );
    if (points.length === 0) return;

    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 17 });
  }, [tracks, map]);

  // 2. Zoom a la track activa cuando se selecciona (o se carga por primera vez).
  useEffect(() => {
    if (!activeTrackId || activeTrackId === lastActiveIdRef.current) return;

    const track = tracks.find((t) => t.id === activeTrackId);
    if (!track || track.points.length === 0) return;

    lastActiveIdRef.current = activeTrackId;
    const points = track.points.map((p) => [p.lat, p.lon] as [number, number]);
    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 17 });
  }, [activeTrackId, tracks, map]);

  return null;
}
