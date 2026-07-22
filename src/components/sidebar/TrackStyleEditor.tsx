"use client";

import { Paintbrush } from "lucide-react";
import type { GpxTrack } from "@/lib/gpx/types";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useTracksStore } from "@/lib/store/useTracksStore";

const COLOR_PRESETS = [
  "#ef4444",
  "#f59e0b",
  "#22d3ee",
  "#a3e635",
  "#e879f9",
  "#60a5fa",
  "#fb923c",
  "#34d399",
];

export function TrackStyleEditor({ track }: { track: GpxTrack }) {
  const updateTrackStyle = useTracksStore((s) => s.updateTrackStyle);

  return (
    <div className="space-y-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="flex items-center gap-2 text-neutral-300">
        <Paintbrush className="size-4" />
        <h3 className="text-xs font-medium uppercase tracking-wide">Estilo de la ruta</h3>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-neutral-500">Color</p>
        <div className="flex flex-wrap items-center gap-2">
          {COLOR_PRESETS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`Color ${color}`}
              onClick={() => updateTrackStyle(track.id, { color })}
              className="size-6 rounded-full ring-offset-2 ring-offset-neutral-900 transition-transform hover:scale-110"
              style={{
                backgroundColor: color,
                boxShadow:
                  track.style.color === color ? `0 0 0 2px #fafafa` : undefined,
              }}
            />
          ))}
          <input
            type="color"
            value={track.style.color}
            onChange={(e) => updateTrackStyle(track.id, { color: e.target.value })}
            className="size-6 cursor-pointer rounded-full border border-neutral-700 bg-transparent"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>Grosor de línea</span>
          <span className="font-mono text-neutral-300">{track.style.weight}px</span>
        </div>
        <Slider
          min={1}
          max={12}
          step={1}
          value={[track.style.weight]}
          onValueChange={([weight]) => updateTrackStyle(track.id, { weight })}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span>Opacidad</span>
          <span className="font-mono text-neutral-300">
            {Math.round(track.style.opacity * 100)}%
          </span>
        </div>
        <Slider
          min={0.1}
          max={1}
          step={0.05}
          value={[track.style.opacity]}
          onValueChange={([opacity]) => updateTrackStyle(track.id, { opacity })}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-neutral-500">Mostrar puntos de track</span>
        <Switch
          checked={track.style.showPoints}
          onCheckedChange={(showPoints) => updateTrackStyle(track.id, { showPoints })}
        />
      </div>
    </div>
  );
}
