"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, LayersControl, TileLayer, ZoomControl } from "react-leaflet";
import { useMemo } from "react";
import { BASEMAPS, SPAIN_CENTER, SPAIN_ZOOM } from "@/lib/constants/basemaps";
import { useTracksStore } from "@/lib/store/useTracksStore";
import { TrackLayer } from "./TrackLayer";
import { FitBoundsController } from "./FitBoundsController";

export function MapView() {
  const tracks = useTracksStore((s) => s.tracks);

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
        {Array.from(groupedBasemaps.entries()).map(([group, basemaps]) =>
          basemaps.map((bm) => (
            <LayersControl.BaseLayer
              key={bm.id}
              name={`${group === "Estándar" ? "" : `${group} · `}${bm.name}`}
              checked={bm.id === "carto-dark"}
            >
              <TileLayer
                url={bm.url}
                attribution={bm.attribution}
                maxZoom={bm.maxZoom ?? 19}
                subdomains={bm.subdomains}
              />
            </LayersControl.BaseLayer>
          ))
        )}
      </LayersControl>

      <FitBoundsController tracks={tracks} />

      {tracks.map((track) => (
        <TrackLayer key={track.id} track={track} />
      ))}
    </MapContainer>
  );
}
