"use client";

import {
  Route,
  Clock,
  Gauge,
  TrendingUp,
  TrendingDown,
  ArrowUpToLine,
  ArrowDownToLine,
  CalendarDays,
} from "lucide-react";
import type { GpxTrack } from "@/lib/gpx/types";
import {
  formatDate,
  formatDistance,
  formatDuration,
  formatElevation,
  formatSpeed,
} from "@/lib/utils";
import { cn } from "@/lib/utils";

interface StatItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
}

export function StatsCards({ track }: { track: GpxTrack }) {
  const s = track.stats;

  const items: StatItem[] = [
    { icon: <Route />, label: "Distancia", value: formatDistance(s.distanceKm) },
    { icon: <Clock />, label: "Duración total", value: formatDuration(s.durationSeconds) },
    { icon: <Gauge />, label: "Velocidad media", value: formatSpeed(s.avgSpeedKmh) },
    {
      icon: <Gauge />,
      label: "Vel. media en mov.",
      value: formatSpeed(s.avgMovingSpeedKmh),
    },
    {
      icon: <TrendingUp />,
      label: "Ascenso acumulado",
      value: formatElevation(s.elevationGain),
      accent: "text-emerald-400",
    },
    {
      icon: <TrendingDown />,
      label: "Descenso acumulado",
      value: formatElevation(s.elevationLoss),
      accent: "text-rose-400",
    },
    {
      icon: <ArrowDownToLine />,
      label: "Elevación mínima",
      value: s.minElevation !== null ? formatElevation(s.minElevation) : "—",
    },
    {
      icon: <ArrowUpToLine />,
      label: "Elevación máxima",
      value: s.maxElevation !== null ? formatElevation(s.maxElevation) : "—",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-2 px-1">
        <div>
          <h2 className="font-display text-lg font-semibold text-neutral-100 leading-tight">
            {track.name}
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-500">
            <CalendarDays className="size-3.5" />
            {formatDate(s.startTime)}
          </p>
        </div>
        <span
          className="mt-1 size-3 shrink-0 rounded-full ring-2 ring-neutral-950"
          style={{ backgroundColor: track.style.color }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3"
          >
            <div
              className={cn(
                "mb-1.5 flex items-center gap-1.5 text-neutral-500 [&_svg]:size-3.5",
                item.accent
              )}
            >
              {item.icon}
              <span className="text-[11px] uppercase tracking-wide">{item.label}</span>
            </div>
            <p className="font-mono text-lg font-semibold text-neutral-100">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
