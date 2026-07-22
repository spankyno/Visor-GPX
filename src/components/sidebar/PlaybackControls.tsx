"use client";

import { useEffect, useRef } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import type { GpxTrack } from "@/lib/gpx/types";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useTracksStore } from "@/lib/store/useTracksStore";
import { formatDistance } from "@/lib/utils";

const SPEED_OPTIONS = [1, 2, 4, 8];

export function PlaybackControls({ track }: { track: GpxTrack }) {
  const playback = useTracksStore((s) => s.playback);
  const startPlayback = useTracksStore((s) => s.startPlayback);
  const pausePlayback = useTracksStore((s) => s.pausePlayback);
  const stopPlayback = useTracksStore((s) => s.stopPlayback);
  const setPlaybackIndex = useTracksStore((s) => s.setPlaybackIndex);
  const setPlaybackSpeed = useTracksStore((s) => s.setPlaybackSpeed);

  const isActive = playback.trackId === track.id;
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || !playback.isPlaying) return;

    const totalPoints = track.points.length;
    let lastTime = performance.now();
    const pointsPerSecond = 20 * playback.speed;

    function tick(now: number) {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      const state = useTracksStore.getState();
      const advance = Math.max(1, Math.round(delta * pointsPerSecond));
      const nextIndex = state.playback.currentIndex + advance;

      if (nextIndex >= totalPoints - 1) {
        setPlaybackIndex(totalPoints - 1);
        pausePlayback();
        return;
      }
      setPlaybackIndex(nextIndex);
      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, playback.isPlaying, playback.speed, track.points.length]);

  const progress = isActive && track.points.length > 1
    ? playback.currentIndex / (track.points.length - 1)
    : 0;

  const currentDistanceKm = isActive
    ? track.elevationProfile[playback.currentIndex]?.distanceKm ?? 0
    : 0;

  return (
    <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          Animación de la ruta
        </h3>
        {isActive && (
          <span className="font-mono text-[11px] text-neutral-500">
            {formatDistance(currentDistanceKm)} / {formatDistance(track.stats.distanceKm)}
          </span>
        )}
      </div>

      <Slider
        min={0}
        max={track.points.length - 1}
        step={1}
        value={[isActive ? playback.currentIndex : 0]}
        onValueChange={([index]) => {
          if (!isActive) startPlayback(track.id);
          setPlaybackIndex(index);
        }}
      />

      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant={isActive && playback.isPlaying ? "secondary" : "default"}
          onClick={() => {
            if (!isActive) {
              startPlayback(track.id);
            } else if (playback.isPlaying) {
              pausePlayback();
            } else {
              useTracksStore.setState((s) => ({
                playback: { ...s.playback, isPlaying: true },
              }));
            }
          }}
          aria-label={isActive && playback.isPlaying ? "Pausar" : "Reproducir"}
        >
          {isActive && playback.isPlaying ? <Pause /> : <Play />}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          onClick={stopPlayback}
          disabled={!isActive}
          aria-label="Reiniciar"
        >
          <RotateCcw />
        </Button>

        <div className="ml-auto flex items-center gap-1">
          {SPEED_OPTIONS.map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`rounded-md px-2 py-1 text-xs font-mono transition-colors ${
                playback.speed === speed
                  ? "bg-amber-500 text-neutral-950"
                  : "text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300"
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full bg-amber-500 transition-[width]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
