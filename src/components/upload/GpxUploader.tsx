"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseGpxFile, GpxParseError } from "@/lib/gpx/parseGpx";
import { useTracksStore } from "@/lib/store/useTracksStore";

interface GpxUploaderProps {
  /** Variante compacta para mostrar en la cabecera cuando ya hay tracks cargadas */
  compact?: boolean;
}

export function GpxUploader({ compact = false }: GpxUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const addTracks = useTracksStore((s) => s.addTracks);
  const setLoading = useTracksStore((s) => s.setLoading);
  const setError = useTracksStore((s) => s.setError);
  const existingCount = useTracksStore((s) => s.tracks.length);

  const handleFiles = useCallback(
    async (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const files = Array.from(fileList).filter((f) =>
        f.name.toLowerCase().endsWith(".gpx")
      );

      if (files.length === 0) {
        setError("Selecciona archivos con extensión .gpx");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const parsed = await Promise.all(
          files.map((file, i) => parseGpxFile(file, existingCount + i))
        );
        addTracks(parsed);
      } catch (err) {
        const message =
          err instanceof GpxParseError
            ? err.message
            : "No se pudo procesar uno de los archivos GPX.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [addTracks, existingCount, setError, setLoading]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  if (compact) {
    return (
      <>
        <input
          ref={inputRef}
          type="file"
          accept=".gpx"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
          <UploadCloud className="size-4" />
          Añadir GPX
        </Button>
      </>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
      className={cn(
        "relative flex flex-1 flex-col items-center justify-center gap-6 rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
        isDragging
          ? "border-amber-500 bg-amber-500/5"
          : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".gpx"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex size-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
        <MapPinned className="size-8" />
      </div>

      <div className="space-y-1.5">
        <h2 className="font-display text-2xl font-semibold text-neutral-100">
          Arrastra tus archivos GPX aquí
        </h2>
        <p className="text-sm text-neutral-400">
          O selecciona uno o varios archivos desde tu dispositivo
        </p>
      </div>

      <Button size="lg" onClick={() => inputRef.current?.click()}>
        <UploadCloud className="size-5" />
        Seleccionar archivo GPX
      </Button>

      <p className="text-xs text-neutral-500">
        Puedes cargar varias rutas a la vez para compararlas sobre el mapa
      </p>
    </div>
  );
}
