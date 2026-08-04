"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import type { GpxTrack } from "@/lib/gpx/types";
import { BASEMAPS, SPAIN_CENTER, SPAIN_ZOOM } from "@/lib/constants/basemaps";
import { TrackLayer } from "./TrackLayer";
import { FitBoundsController } from "./FitBoundsController";

// El visor público de rutas compartidas siempre usa OpenStreetMap como capa
// base — no expone el selector de capas ni las capas de IGN/Google, para
// mantener el enlace compartido simple y sin dependencias adicionales.
const osm = BASEMAPS.find((b) => b.id === "osm")!;

interface ShareMapViewProps {
  track: GpxTrack;
}

export function ShareMapView({ track }: ShareMapViewProps) {
  return (
    <MapContainer
      center={SPAIN_CENTER}
      zoom={SPAIN_ZOOM}
      zoomControl={false}
      className="h-full w-full bg-neutral-950"
      preferCanvas
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        url={osm.url}
        attribution={osm.attribution}
        maxZoom={osm.maxZoom ?? 19}
        {...(osm.subdomains ? { subdomains: osm.subdomains } : {})}
      />
      <FitBoundsController tracks={[track]} activeTrackId={track.id} />
      <TrackLayer track={track} />
    </MapContainer>
  );
}
