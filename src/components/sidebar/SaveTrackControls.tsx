"use client";

import { useState } from "react";
import { Save, Share2, Trash2, Copy, Check, Lock } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useTracksStore } from "@/lib/store/useTracksStore";
import { usePlan } from "@/lib/hooks/usePlan";
import type { GpxTrack } from "@/lib/gpx/types";

interface SaveTrackControlsProps {
  track: GpxTrack;
}

export function SaveTrackControls({ track }: SaveTrackControlsProps) {
  const { isSignedIn, plan } = usePlan();
  const setTrackRemoteInfo = useTracksStore((s) => s.setTrackRemoteInfo);
  const setError = useTracksStore((s) => s.setError);
  const [busy, setBusy] = useState<"save" | "delete" | "share" | "unshare" | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-xs text-neutral-400">
        <span>Inicia sesión para guardar esta ruta en tu cuenta.</span>
        <SignInButton mode="modal">
          <Button size="sm" variant="secondary">
            Iniciar sesión
          </Button>
        </SignInButton>
      </div>
    );
  }

  async function handleSave() {
    setBusy("save");
    try {
      const res = await fetch("/api/gpx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: track.fileName,
          trackName: track.name,
          content: track.rawXml,
          distanceKm: track.stats.distanceKm,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo guardar la ruta.");
      setTrackRemoteInfo(track.id, { remoteId: data.file.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la ruta.");
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    if (!track.remoteId) return;
    setBusy("delete");
    try {
      const res = await fetch(`/api/gpx/${track.remoteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo quitar la ruta de tu cuenta.");
      setTrackRemoteInfo(track.id, { remoteId: null, shareToken: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo quitar la ruta.");
    } finally {
      setBusy(null);
    }
  }

  async function handleShare() {
    if (!track.remoteId) return;
    setBusy("share");
    try {
      const res = await fetch(`/api/gpx/${track.remoteId}/share`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "No se pudo activar la compartición.");
      setTrackRemoteInfo(track.id, { shareToken: data.file.share_token });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo compartir la ruta.");
    } finally {
      setBusy(null);
    }
  }

  async function handleUnshare() {
    if (!track.remoteId) return;
    setBusy("unshare");
    try {
      const res = await fetch(`/api/gpx/${track.remoteId}/share`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo desactivar la compartición.");
      setTrackRemoteInfo(track.id, { shareToken: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo desactivar la compartición.");
    } finally {
      setBusy(null);
    }
  }

  const shareUrl =
    track.shareToken && typeof window !== "undefined"
      ? `${window.location.origin}/compartir/${track.shareToken}`
      : null;

  return (
    <div className="space-y-2 rounded-xl border border-neutral-800 bg-neutral-900/40 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-neutral-400">
          {track.remoteId ? "Guardada en tu cuenta" : "No guardada en tu cuenta"}
        </span>

        {track.remoteId ? (
          <Button size="sm" variant="ghost" onClick={handleDelete} disabled={busy !== null}>
            <Trash2 className="size-3.5" />
            {busy === "delete" ? "Quitando…" : "Quitar"}
          </Button>
        ) : (
          <Button size="sm" onClick={handleSave} disabled={busy !== null}>
            <Save className="size-3.5" />
            {busy === "save" ? "Guardando…" : "Guardar en mi cuenta"}
          </Button>
        )}
      </div>

      {plan !== "pro" ? (
        <p className="flex items-center gap-1.5 text-[11px] text-neutral-500">
          <Lock className="size-3" />
          Compartir por URL es una función del plan Pro.
        </p>
      ) : (
        <div className="space-y-1.5 border-t border-neutral-800 pt-2">
          {track.shareToken ? (
            <>
              <div className="flex items-center gap-1.5">
                <input
                  readOnly
                  value={shareUrl ?? ""}
                  className="flex-1 truncate rounded-md border border-neutral-800 bg-neutral-950 px-2 py-1 text-[11px] text-neutral-300"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    if (!shareUrl) return;
                    navigator.clipboard.writeText(shareUrl);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </Button>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={handleUnshare}
                disabled={busy !== null}
              >
                {busy === "unshare" ? "Desactivando…" : "Dejar de compartir"}
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={handleShare}
              disabled={busy !== null || !track.remoteId}
              title={!track.remoteId ? "Guarda primero la ruta en tu cuenta" : undefined}
            >
              <Share2 className="size-3.5" />
              {busy === "share" ? "Generando enlace…" : "Compartir con una URL"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
