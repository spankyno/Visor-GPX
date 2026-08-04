"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Trash2,
  MapPinned,
  Share2,
  Copy,
  Check,
  Compass,
  Pencil,
  X,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { parseGpxString } from "@/lib/gpx/parseGpx";
import { useTracksStore } from "@/lib/store/useTracksStore";
import type { GpxFileMeta } from "@/lib/gpx/store-server";
import { maxFilesForPlan, PLAN_LABELS, type Plan } from "@/lib/plans";
import { AUTHOR_CONTACT_URL } from "@/lib/constants/site";
import { formatDistance } from "@/lib/utils";

interface MyRoutesClientProps {
  initialFiles: GpxFileMeta[];
  plan: Plan;
}

export function MyRoutesClient({ initialFiles, plan }: MyRoutesClientProps) {
  const [files, setFiles] = useState(initialFiles);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setErrorLocal] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const editInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const addTracks = useTracksStore((s) => s.addTracks);

  useEffect(() => {
    if (editingId) editInputRef.current?.focus();
  }, [editingId]);

  const limit = maxFilesForPlan(plan);
  const quotaLabel = limit === null ? `${files.length} guardadas · ilimitado` : `${files.length} / ${limit} guardadas`;

  function startRename(file: GpxFileMeta) {
    setEditingId(file.id);
    setDraftName(file.track_name || file.file_name);
    setErrorLocal(null);
  }

  function cancelRename() {
    setEditingId(null);
    setDraftName("");
  }

  async function confirmRename(id: string) {
    const trackName = draftName.trim();
    if (!trackName) {
      setErrorLocal("El nombre no puede estar vacío.");
      return;
    }
    setBusyId(id);
    setErrorLocal(null);
    try {
      const res = await fetch(`/api/gpx/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo renombrar la ruta.");
      setFiles((prev) => prev.map((f) => (f.id === id ? data.file : f)));
      setEditingId(null);
    } catch (err) {
      setErrorLocal(err instanceof Error ? err.message : "No se pudo renombrar la ruta.");
    } finally {
      setBusyId(null);
    }
  }

  async function loadIntoViewer(id: string) {
    setBusyId(id);
    setErrorLocal(null);
    try {
      const res = await fetch(`/api/gpx/${id}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo cargar la ruta.");
      const track = parseGpxString(data.file.content, data.file.file_name);
      // El GPX puede traer su propio <name> interno; si el usuario ha
      // renombrado la ruta desde "Mis rutas", ese nombre (track_name) debe
      // prevalecer sobre el que venga dentro del archivo.
      if (data.file.track_name) track.name = data.file.track_name;
      track.remoteId = data.file.id;
      track.shareToken = data.file.share_token;

      // Si esta misma ruta (por remoteId) ya estaba cargada en el visor de
      // una navegación anterior en esta misma pestaña, la quitamos primero
      // para que no quede una copia vieja con el nombre antiguo.
      const { tracks, removeTrack } = useTracksStore.getState();
      const stale = tracks.find((t) => t.remoteId === track.remoteId);
      if (stale) removeTrack(stale.id);

      addTracks([track]);
      router.push("/");
    } catch (err) {
      setErrorLocal(err instanceof Error ? err.message : "No se pudo cargar la ruta.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: string) {
    setBusyId(id);
    setErrorLocal(null);
    try {
      const res = await fetch(`/api/gpx/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo borrar la ruta.");
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      setErrorLocal(err instanceof Error ? err.message : "No se pudo borrar la ruta.");
    } finally {
      setBusyId(null);
    }
  }

  async function handleShare(id: string, enable: boolean) {
    setBusyId(id);
    setErrorLocal(null);
    try {
      const res = await fetch(`/api/gpx/${id}/share`, { method: enable ? "POST" : "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo actualizar la compartición.");
      setFiles((prev) => prev.map((f) => (f.id === id ? data.file : f)));
    } catch (err) {
      setErrorLocal(err instanceof Error ? err.message : "No se pudo actualizar la compartición.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100">
      <header className="flex h-14 items-center justify-between border-b border-neutral-800 px-4">
        <Link href="/" className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200">
          <ArrowLeft className="size-4" />
          Volver al visor
        </Link>
        <div className="flex items-center gap-2">
          <Compass className="size-4 text-amber-400" />
          <span className="font-display text-sm font-semibold">Mis rutas</span>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl font-semibold">Tus archivos guardados</h1>
            <p className="text-sm text-neutral-500">
              Plan <span className="text-amber-400">{PLAN_LABELS[plan]}</span> · {quotaLabel}
            </p>
          </div>
          {plan === "registered" && (
            <a
              href={AUTHOR_CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:underline"
            >
              Solicitar plan Pro (almacenamiento ilimitado + compartir) →
            </a>
          )}
        </div>

        {error && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        {files.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-neutral-800 p-10 text-center text-neutral-500">
            <MapPinned className="size-8 text-neutral-700" />
            <p className="text-sm">
              Todavía no has guardado ninguna ruta. Carga un GPX en el visor y pulsa
              &quot;Guardar en mi cuenta&quot;.
            </p>
            <Button asChild size="sm">
              <Link href="/">Ir al visor</Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {files.map((file) => {
              const shareUrl =
                file.share_enabled && file.share_token && typeof window !== "undefined"
                  ? `${window.location.origin}/compartir/${file.share_token}`
                  : null;
              return (
                <li
                  key={file.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    {editingId === file.id ? (
                      <div className="flex min-w-0 flex-1 items-center gap-1.5">
                        <input
                          ref={editInputRef}
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") confirmRename(file.id);
                            if (e.key === "Escape") cancelRename();
                          }}
                          maxLength={120}
                          className="min-w-0 flex-1 rounded-md border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm text-neutral-100 outline-none focus:border-amber-500/60"
                        />
                        <Button
                          size="sm"
                          onClick={() => confirmRename(file.id)}
                          disabled={busyId === file.id}
                        >
                          <Check className="size-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelRename}>
                          <X className="size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <button
                        onClick={() => loadIntoViewer(file.id)}
                        className="min-w-0 flex-1 text-left"
                        disabled={busyId === file.id}
                      >
                        <p className="truncate text-sm font-medium text-neutral-100">
                          {file.track_name || file.file_name}
                        </p>
                        <p className="font-mono text-[11px] text-neutral-500">
                          {file.distance_km ? formatDistance(file.distance_km) : "—"} ·{" "}
                          {new Date(file.created_at).toLocaleDateString("es-ES")}
                        </p>
                      </button>
                    )}

                    <div className="flex shrink-0 items-center gap-1.5">
                      {editingId !== file.id && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startRename(file)}
                          disabled={busyId === file.id}
                          title="Renombrar ruta"
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                      )}
                      {plan === "pro" && (
                        <Button
                          size="sm"
                          variant={file.share_enabled ? "secondary" : "ghost"}
                          onClick={() => handleShare(file.id, !file.share_enabled)}
                          disabled={busyId === file.id}
                          title={file.share_enabled ? "Dejar de compartir" : "Compartir con una URL"}
                        >
                          <Share2 className="size-3.5" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(file.id)}
                        disabled={busyId === file.id}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>

                  {shareUrl && (
                    <div className="mt-2 flex items-center gap-1.5 border-t border-neutral-800 pt-2">
                      <input
                        readOnly
                        value={shareUrl}
                        className="flex-1 truncate rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-300"
                      />
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          setCopiedId(file.id);
                          setTimeout(() => setCopiedId(null), 1500);
                        }}
                      >
                        {copiedId === file.id ? (
                          <Check className="size-3.5" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
