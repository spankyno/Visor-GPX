"use client";

import { Loader2 } from "lucide-react";
import { useTracksStore } from "@/lib/store/useTracksStore";

export function LoadingOverlay() {
  const isLoading = useTracksStore((s) => s.isLoading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900 px-8 py-6">
        <Loader2 className="size-6 animate-spin text-amber-400" />
        <p className="text-sm text-neutral-300">Procesando archivo GPX…</p>
      </div>
    </div>
  );
}
