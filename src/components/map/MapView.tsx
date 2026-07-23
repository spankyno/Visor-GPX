"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, LayersControl, TileLayer, ZoomControl } from "react-leaflet";
import { useMemo } from "react";
import { BASEMAPS, SPAIN_CENTER, SPAIN_ZOOM } from "@/lib/constants/basemaps";
import { useTracksStore } from "@/lib/store/useTracksStore";
import { TrackLayer } from "./TrackLayer";
import { FitBoundsController } from "./FitBoundsController";
import { BasemapSync, basemapLabel } from "./BasemapSync";

export function MapView() {
  const tracks = useTracksStore((s) => s.tracks);
  // Capa base activa: viene del store (persistida entre cambios de capa),
  // en vez de un valor fijo desconectado del resto de la app.
  const basemapId = useTracksStore((s) => s.basemapId);

  const groupedBasemaps = useMemo(() => {
    const groups = new Map<string, typeof BASEMAPS>();
    for (const bm of BASEMAPS) {
      const list = groups.get(bm.group) ?? [];
      list.push(bm);
      groups.set(bm.group, list);
    }
    return groups;
  }, []);

  return (
    <MapContainer
      center={SPAIN_CENTER}
      zoom={SPAIN_ZOOM}
      zoomControl={false}
      className="h-full w-full bg-neutral-950"
      preferCanvas
    >
      <ZoomControl position="bottomright" />

      <LayersControl position="topright">
        {Array.from(groupedBasemaps.entries()).map(([, basemaps]) =>
          basemaps.map((bm) => (
            <LayersControl.BaseLayer
              key={bm.id}
              name={basemapLabel(bm)}
              checked={bm.id === basemapId}
            >
              <TileLayer
                url={bm.url}
                attribution={bm.attribution}
                maxZoom={bm.maxZoom ?? 19}
                // IMPORTANTE: nunca pasar subdomains={undefined} explícitamente.
                // Leaflet siempre calcula un subdominio internamente (aunque la
                // URL no tenga {s}) y options.subdomains=undefined pisa su
                // default interno 'abc', provocando "Cannot read properties of
                // undefined (reading 'length')" en _getSubdomain. Por eso el
                // prop solo se incluye cuando bm.subdomains está definido.
                {...(bm.subdomains ? { subdomains: bm.subdomains } : {})}
              />
            </LayersControl.BaseLayer>
          ))
        )}
      </LayersControl>

      <BasemapSync />
      <FitBoundsController tracks={tracks} />

      {tracks.map((track) => (
        <TrackLayer key={track.id} track={track} />
      ))}
    </MapContainer>
  );
}
