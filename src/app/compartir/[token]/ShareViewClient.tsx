"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo } from "react";
import { Compass } from "lucide-react";
import { parseGpxString } from "@/lib/gpx/parseGpx";
import { formatDistance, formatDuration, formatElevation } from "@/lib/utils";

const ShareMapView = dynamic(
  () => import("@/components/map/ShareMapView").then((m) => m.ShareMapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-neutral-950 text-sm text-neutral-500">
        Cargando mapa…
      </div>
    ),
  }
);

interface ShareViewClientProps {
  fileName: string;
  trackName: string | null;
  content: string;
}

export function ShareViewClient({ fileName, trackName, content }: ShareViewClientProps) {
  const track = useMemo(() => parseGpxString(content, fileName), [content, fileName]);

  return (
    <div className="flex h-dvh flex-col bg-neutral-950">
      <header className="z-[1200] flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950/90 px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
            <Compass className="size-4.5" />
          </div>
          <div className="leading-none">
            <h1 className="truncate font-display text-base font-semibold text-neutral-100">
              {trackName || track.name}
            </h1>
            <p className="text-[10px] text-neutral-500">Ruta compartida · Visor GPX</p>
          </div>
        </div>
        <Link
          href="/"
          className="rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800"
        >
          Abrir mi propio visor →
        </Link>
      </header>

      <div className="relative flex-1">
        <ShareMapView track={track} />

        <div className="absolute bottom-4 left-1/2 z-[1200] flex -translate-x-1/2 flex-wrap items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950/90 px-4 py-2 text-xs text-neutral-300 backdrop-blur-sm">
          <span>{formatDistance(track.stats.distanceKm)}</span>
          <span className="text-neutral-600">·</span>
          <span>{formatDuration(track.stats.durationSeconds)}</span>
          <span className="text-neutral-600">·</span>
          <span>↑ {formatElevation(track.stats.elevationGain)}</span>
          <span className="text-neutral-600">·</span>
          <span>↓ {formatElevation(track.stats.elevationLoss)}</span>
        </div>
      </div>
    </div>
  );
}
