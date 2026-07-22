import { create } from "zustand";
import type { GpxTrack, TrackStyle } from "@/lib/gpx/types";
import { DEFAULT_BASEMAP_ID } from "@/lib/constants/basemaps";

interface PlaybackState {
  trackId: string | null;
  isPlaying: boolean;
  /** índice del punto actual en la track que se reproduce */
  currentIndex: number;
  /** velocidad de reproducción, en puntos por tick */
  speed: number;
}

interface HoveredPoint {
  trackId: string;
  index: number;
}

interface TracksState {
  tracks: GpxTrack[];
  activeTrackId: string | null;
  basemapId: string;
  isLoading: boolean;
  error: string | null;
  playback: PlaybackState;
  hoveredPoint: HoveredPoint | null;
  setHoveredPoint: (point: HoveredPoint | null) => void;

  addTracks: (tracks: GpxTrack[]) => void;
  removeTrack: (id: string) => void;
  toggleTrackVisibility: (id: string) => void;
  updateTrackStyle: (id: string, style: Partial<TrackStyle>) => void;
  setActiveTrack: (id: string | null) => void;
  setBasemap: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAll: () => void;

  startPlayback: (trackId: string) => void;
  pausePlayback: () => void;
  stopPlayback: () => void;
  setPlaybackIndex: (index: number) => void;
  setPlaybackSpeed: (speed: number) => void;
}

export const useTracksStore = create<TracksState>((set, get) => ({
  tracks: [],
  activeTrackId: null,
  basemapId: DEFAULT_BASEMAP_ID,
  isLoading: false,
  error: null,
  playback: { trackId: null, isPlaying: false, currentIndex: 0, speed: 1 },
  hoveredPoint: null,
  setHoveredPoint: (point) => set({ hoveredPoint: point }),

  addTracks: (newTracks) =>
    set((state) => {
      const tracks = [...state.tracks, ...newTracks];
      return {
        tracks,
        activeTrackId: state.activeTrackId ?? newTracks[0]?.id ?? null,
        error: null,
      };
    }),

  removeTrack: (id) =>
    set((state) => {
      const tracks = state.tracks.filter((t) => t.id !== id);
      const activeTrackId =
        state.activeTrackId === id ? tracks[0]?.id ?? null : state.activeTrackId;
      const playback =
        state.playback.trackId === id
          ? { trackId: null, isPlaying: false, currentIndex: 0, speed: 1 }
          : state.playback;
      return { tracks, activeTrackId, playback };
    }),

  toggleTrackVisibility: (id) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === id ? { ...t, visible: !t.visible } : t
      ),
    })),

  updateTrackStyle: (id, style) =>
    set((state) => ({
      tracks: state.tracks.map((t) =>
        t.id === id ? { ...t, style: { ...t.style, ...style } } : t
      ),
    })),

  setActiveTrack: (id) => set({ activeTrackId: id }),
  setBasemap: (id) => set({ basemapId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearAll: () =>
    set({
      tracks: [],
      activeTrackId: null,
      playback: { trackId: null, isPlaying: false, currentIndex: 0, speed: 1 },
    }),

  startPlayback: (trackId) => {
    const track = get().tracks.find((t) => t.id === trackId);
    if (!track) return;
    set({ playback: { trackId, isPlaying: true, currentIndex: 0, speed: 1 } });
  },
  pausePlayback: () =>
    set((state) => ({ playback: { ...state.playback, isPlaying: false } })),
  stopPlayback: () =>
    set({ playback: { trackId: null, isPlaying: false, currentIndex: 0, speed: 1 } }),
  setPlaybackIndex: (index) =>
    set((state) => ({ playback: { ...state.playback, currentIndex: index } })),
  setPlaybackSpeed: (speed) =>
    set((state) => ({ playback: { ...state.playback, speed } })),
}));
