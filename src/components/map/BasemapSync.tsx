"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import type L from "leaflet";
import { BASEMAPS, type BasemapDef } from "@/lib/constants/basemaps";
import { useTracksStore } from "@/lib/store/useTracksStore";

/** Construye la misma etiqueta que se usa como `name` en LayersControl.BaseLayer */
export function basemapLabel(bm: BasemapDef): string {
  return `${bm.group === "Estándar" ? "" : `${bm.group} · `}${bm.name}`;
}

/**
 * Escucha el evento nativo de Leaflet `baselayerchange` y actualiza el store de
 * Zustand (`basemapId`) para que el resto de la app pueda saber/reaccionar a
 * qué capa base está activa en cada momento. Antes este estado del store
 * existía pero nunca se actualizaba desde el mapa (quedaba "muerto").
 */
export function BasemapSync() {
  const map = useMap();
  const setBasemap = useTracksStore((s) => s.setBasemap);

  useEffect(() => {
    const labelToId = new Map(BASEMAPS.map((bm) => [basemapLabel(bm), bm.id]));

    function handleBaseLayerChange(e: L.LayersControlEvent) {
      const id = labelToId.get(e.name);
      if (id) setBasemap(id);
    }

    map.on("baselayerchange", handleBaseLayerChange);
    return () => {
      map.off("baselayerchange", handleBaseLayerChange);
    };
  }, [map, setBasemap]);

  return null;
}
