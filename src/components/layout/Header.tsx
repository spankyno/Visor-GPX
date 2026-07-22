"use client";

import { Compass, PanelRightOpen, PanelRightClose } from "lucide-react";
import { GpxUploader } from "@/components/upload/GpxUploader";
import { useTracksStore } from "@/lib/store/useTracksStore";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function Header({ sidebarOpen, onToggleSidebar }: HeaderProps) {
  const trackCount = useTracksStore((s) => s.tracks.length);

  return (
    <header className="z-[1200] flex h-14 shrink-0 items-center justify-between border-b border-neutral-800 bg-neutral-950/90 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
          <Compass className="size-4.5" />
        </div>
        <div className="leading-none">
          <h1 className="font-display text-base font-semibold text-neutral-100">
            Visor GPX
          </h1>
          <p className="text-[10px] text-neutral-500">Explora tus rutas GPS</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {trackCount > 0 && <GpxUploader compact />}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onToggleSidebar}
          aria-label="Alternar panel"
        >
          {sidebarOpen ? <PanelRightClose /> : <PanelRightOpen />}
        </Button>
      </div>
    </header>
  );
}
