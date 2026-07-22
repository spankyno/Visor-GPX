import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea segundos a HH:mm:ss */
export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "00:00:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

export function formatDistance(km: number): string {
  return `${km.toFixed(2)} km`;
}

export function formatSpeed(kmh: number): string {
  if (!Number.isFinite(kmh)) return "0.0 km/h";
  return `${kmh.toFixed(1)} km/h`;
}

export function formatElevation(m: number): string {
  return `${Math.round(m)} m`;
}

export function formatDate(date: Date | null): string {
  if (!date) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Genera un color aleatorio agradable para nuevas tracks */
const TRACK_PALETTE = [
  "#ef4444",
  "#f59e0b",
  "#22d3ee",
  "#a3e635",
  "#e879f9",
  "#60a5fa",
  "#fb923c",
  "#34d399",
];

export function nextTrackColor(index: number): string {
  return TRACK_PALETTE[index % TRACK_PALETTE.length];
}

export function randomId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
