"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GpxTrack } from "@/lib/gpx/types";
import { downsampleProfile } from "@/lib/gpx/stats";
import { useTracksStore } from "@/lib/store/useTracksStore";

interface ElevationProfileProps {
  track: GpxTrack;
}

interface TooltipPayloadItem {
  payload: { distanceKm: number; elevation: number; index: number };
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const { distanceKm, elevation } = payload[0].payload;
  return (
    <div className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs shadow-xl">
      <p className="font-mono text-neutral-300">{distanceKm.toFixed(2)} km</p>
      <p className="font-mono font-semibold text-amber-400">{Math.round(elevation)} m</p>
    </div>
  );
}

export function ElevationProfile({ track }: ElevationProfileProps) {
  const setHoveredPoint = useTracksStore((s) => s.setHoveredPoint);
  const data = useMemo(
    () => downsampleProfile(track.elevationProfile, 300),
    [track.elevationProfile]
  );

  const hasElevation = track.stats.maxElevation !== null;

  if (!hasElevation || data.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/40 text-sm text-neutral-500">
        Esta track no incluye datos de elevación
      </div>
    );
  }

  return (
    <div className="h-44 rounded-xl border border-neutral-800 bg-neutral-900/60 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 8, bottom: 0, left: -20 }}
          onMouseMove={(state: unknown) => {
            const payload = (
              state as { activePayload?: TooltipPayloadItem[] }
            )?.activePayload?.[0]?.payload;
            if (payload && typeof payload.index === "number") {
              setHoveredPoint({ trackId: track.id, index: payload.index });
            }
          }}
          onMouseLeave={() => setHoveredPoint(null)}
        >
          <defs>
            <linearGradient id={`fill-${track.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={track.style.color} stopOpacity={0.5} />
              <stop offset="100%" stopColor={track.style.color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="distanceKm"
            tickFormatter={(v: number) => `${v.toFixed(0)}km`}
            stroke="#525252"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            dataKey="elevation"
            stroke="#525252"
            fontSize={10}
            width={38}
            tickLine={false}
            axisLine={false}
            domain={["dataMin - 20", "dataMax + 20"]}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="elevation"
            stroke={track.style.color}
            strokeWidth={2}
            fill={`url(#fill-${track.id})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
