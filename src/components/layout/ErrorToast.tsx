"use client";

import { AlertTriangle, X } from "lucide-react";
import { useTracksStore } from "@/lib/store/useTracksStore";

export function ErrorToast() {
  const error = useTracksStore((s) => s.error);
  const setError = useTracksStore((s) => s.setError);

  if (!error) return null;

  return (
    <div className="pointer-events-auto fixed bottom-4 left-1/2 z-[1300] flex w-[min(90vw,26rem)] -translate-x-1/2 items-start gap-3 rounded-xl border border-red-500/30 bg-neutral-900 p-4 shadow-2xl shadow-black/50">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-400" />
      <p className="flex-1 text-sm text-neutral-200">{error}</p>
      <button
        onClick={() => setError(null)}
        className="rounded-md p-1 text-neutral-500 hover:bg-neutral-800 hover:text-neutral-200"
        aria-label="Cerrar"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
