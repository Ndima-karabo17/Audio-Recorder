export interface Recording {
  id: string;
  uri: string;
  timestamp: string;
  date: string;
  durationMs?: number;
  label?: string;
}

export type PlaybackStatus = "idle" | "loading" | "playing" | "paused" | "finished" | "error";

export interface PlaybackState {
  recordingId: string | null;
  status: PlaybackStatus;
  positionMs: number;
  durationMs: number;
}