"use client";

import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useTracksStore } from "@/lib/store/useTracksStore";
import { cn, formatDistance } from "@/lib/utils";

export function TrackList() {
  const tracks = useTracksStore((s) => s.tracks);
  const activeTrackId = useTracksStore((s) => s.activeTrackId);
  const setActiveTrack = useTracksStore((s) => s.setActiveTrack);
  const toggleTrackVisibility = useTracksStore((s) => s.toggleTrackVisibility);
  const removeTrack = useTracksStore((s) => s.removeTrack);

  if (tracks.length === 0) return null;

  return (
    <div className="space-y-1.5">
      <h3 className="px-1 text-xs font-medium uppercase tracking-wide text-neutral-500">
        Rutas cargadas ({tracks.length})
      </h3>
      <div className="space-y-1">
        {tracks.map((track) => (
          <div
            key={track.id}
            onClick={() => setActiveTrack(track.id)}
            className={cn(
              "group flex cursor-pointer items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-colors",
              activeTrackId === track.id
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-transparent bg-neutral-900/40 hover:bg-neutral-900"
            )}
          >
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: track.style.color }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-neutral-200">{track.name}</p>
              <p className="font-mono text-[11px] text-neutral-500">
                {formatDistance(track.stats.distanceKm)}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleTrackVisibility(track.id);
              }}
              className="rounded-md p-1.5 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
              aria-label="Alternar visibilidad"
            >
              {track.visible ? (
                <Eye className="size-3.5" />
              ) : (
                <EyeOff className="size-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTrack(track.id);
              }}
              className="rounded-md p-1.5 text-neutral-500 hover:bg-red-500/10 hover:text-red-400"
              aria-label="Eliminar track"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
