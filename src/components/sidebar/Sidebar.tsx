"use client";

import { MountainSnow } from "lucide-react";
import { useTracksStore } from "@/lib/store/useTracksStore";
import { TrackList } from "./TrackList";
import { StatsCards } from "./StatsCards";
import { ElevationProfile } from "./ElevationProfile";
import { TrackStyleEditor } from "./TrackStyleEditor";
import { PlaybackControls } from "./PlaybackControls";
import { ExportButtons } from "./ExportButtons";

export function Sidebar() {
  const tracks = useTracksStore((s) => s.tracks);
  const activeTrackId = useTracksStore((s) => s.activeTrackId);
  const activeTrack = tracks.find((t) => t.id === activeTrackId) ?? tracks[0];

  if (tracks.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center text-neutral-500">
        <MountainSnow className="size-10 text-neutral-700" />
        <p className="text-sm">
          Carga un archivo GPX para ver aquí sus estadísticas, el perfil de elevación y
          las opciones de personalización.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      <TrackList />

      {activeTrack && (
        <>
          <div className="h-px bg-neutral-800" />
          <StatsCards track={activeTrack} />
          <ElevationProfile track={activeTrack} />
          <PlaybackControls track={activeTrack} />
          <TrackStyleEditor track={activeTrack} />
          <ExportButtons track={activeTrack} />
        </>
      )}
    </div>
  );
}
