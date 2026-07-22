"use client";

import { FileJson, FileDown } from "lucide-react";
import type { GpxTrack } from "@/lib/gpx/types";
import { Button } from "@/components/ui/button";
import { downloadTrackAsGeoJSON, downloadTrackAsGpx } from "@/lib/gpx/export";

export function ExportButtons({ track }: { track: GpxTrack }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="outline" size="sm" onClick={() => downloadTrackAsGpx(track)}>
        <FileDown className="size-4" />
        GPX
      </Button>
      <Button variant="outline" size="sm" onClick={() => downloadTrackAsGeoJSON(track)}>
        <FileJson className="size-4" />
        GeoJSON
      </Button>
    </div>
  );
}
