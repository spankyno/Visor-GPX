"use client";

import { useMemo } from "react";
import { CircleMarker, Marker, Polyline, Popup } from "react-leaflet";
import type { GpxTrack } from "@/lib/gpx/types";
import { endIcon, playbackIcon, startIcon, waypointIcon } from "./icons";
import { formatDate, formatDistance, formatElevation } from "@/lib/utils";
import { useTracksStore } from "@/lib/store/useTracksStore";

interface TrackLayerProps {
  track: GpxTrack;
}

export function TrackLayer({ track }: TrackLayerProps) {
  const hoveredPoint = useTracksStore((s) => s.hoveredPoint);
  const playback = useTracksStore((s) => s.playback);
  const setHoveredPoint = useTracksStore((s) => s.setHoveredPoint);

  const latLngs = useMemo(
    () => track.points.map((p) => [p.lat, p.lon] as [number, number]),
    [track.points]
  );

  if (!track.visible || track.points.length === 0) return null;

  const first = track.points[0];
  const last = track.points[track.points.length - 1];

  const hovered =
    hoveredPoint?.trackId === track.id ? track.points[hoveredPoint.index] : null;

  const playbackPoint =
    playback.trackId === track.id ? track.points[playback.currentIndex] : null;

  return (
    <>
      <Polyline
        positions={latLngs}
        pathOptions={{
          color: track.style.color,
          weight: track.style.weight,
          opacity: track.style.opacity,
          lineCap: "round",
          lineJoin: "round",
        }}
        eventHandlers={{
          mouseout: () => setHoveredPoint(null),
        }}
      />

      {track.style.showPoints &&
        track.points.map((p, i) => (
          <CircleMarker
            key={i}
            center={[p.lat, p.lon]}
            radius={2.5}
            pathOptions={{
              color: track.style.color,
              fillColor: track.style.color,
              fillOpacity: 0.9,
              weight: 0,
            }}
          />
        ))}

      {hovered && (
        <CircleMarker
          center={[hovered.lat, hovered.lon]}
          radius={7}
          pathOptions={{
            color: "#ffffff",
            weight: 2,
            fillColor: track.style.color,
            fillOpacity: 1,
          }}
        />
      )}

      {playbackPoint && (
        <Marker
          position={[playbackPoint.lat, playbackPoint.lon]}
          icon={playbackIcon(track.style.color)}
          zIndexOffset={1000}
        />
      )}

      <Marker position={[first.lat, first.lon]} icon={startIcon}>
        <Popup>
          <strong>Inicio · {track.name}</strong>
          <br />
          {formatDate(track.stats.startTime)}
        </Popup>
      </Marker>

      <Marker position={[last.lat, last.lon]} icon={endIcon}>
        <Popup>
          <strong>Fin · {track.name}</strong>
          <br />
          {formatDate(track.stats.endTime)}
          <br />
          Distancia total: {formatDistance(track.stats.distanceKm)}
        </Popup>
      </Marker>

      {track.waypoints.map((wpt, i) => (
        <Marker key={i} position={[wpt.lat, wpt.lon]} icon={waypointIcon}>
          <Popup>
            <strong>{wpt.name}</strong>
            {wpt.ele !== null && (
              <>
                <br />
                Elevación: {formatElevation(wpt.ele)}
              </>
            )}
            {wpt.desc && (
              <>
                <br />
                {wpt.desc}
              </>
            )}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
