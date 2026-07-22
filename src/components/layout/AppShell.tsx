"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { GpxUploader } from "@/components/upload/GpxUploader";
import { ErrorToast } from "./ErrorToast";
import { LoadingOverlay } from "./LoadingOverlay";
import { useTracksStore } from "@/lib/store/useTracksStore";
import { cn } from "@/lib/utils";

const MapView = dynamic(
  () => import("@/components/map/MapView").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-neutral-950 text-sm text-neutral-500">
        Cargando mapa…
      </div>
    ),
  }
);

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const trackCount = useTracksStore((s) => s.tracks.length);

  return (
    <div className="flex h-dvh flex-col bg-neutral-950">
      <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

      <div className="relative flex flex-1 overflow-hidden">
        <main className="relative flex-1">
          {trackCount === 0 ? (
            <div className="flex h-full items-center justify-center p-6">
              <GpxUploader />
            </div>
          ) : (
            <MapView />
          )}
        </main>

        {/* Panel lateral — desktop */}
        <aside className="hidden w-[22rem] shrink-0 border-l border-neutral-800 bg-neutral-950 lg:block">
          <Sidebar />
        </aside>

        {/* Panel lateral — móvil (bottom sheet) */}
        {trackCount > 0 && (
          <div
            className={cn(
              "fixed inset-x-0 bottom-0 z-[1250] max-h-[75dvh] rounded-t-2xl border-t border-neutral-800 bg-neutral-950 shadow-2xl transition-transform duration-300 lg:hidden",
              sidebarOpen ? "translate-y-0" : "translate-y-[calc(100%-3.25rem)]"
            )}
          >
            <button
              className="flex w-full items-center justify-center py-2"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label="Abrir panel de detalles"
            >
              <span className="h-1.5 w-10 rounded-full bg-neutral-700" />
            </button>
            <div className="h-[calc(75dvh-2rem)]">
              <Sidebar />
            </div>
          </div>
        )}
      </div>

      <ErrorToast />
      <LoadingOverlay />
    </div>
  );
}
