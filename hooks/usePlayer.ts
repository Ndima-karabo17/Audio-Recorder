import { useState, useRef, useCallback, useEffect } from "react";
import { Audio, AVPlaybackStatus } from "expo-av";
import { PlaybackState, PlaybackStatus } from "../types/recording";

interface UsePlayerReturn {
  playbackState: PlaybackState;
  play: (id: string, uri: string) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  seek: (positionMs: number) => Promise<void>;
}

const INITIAL_STATE: PlaybackState = {
  recordingId: null,
  status: "idle",
  positionMs: 0,
  durationMs: 0,
};

export function usePlayer(): UsePlayerReturn {
  const [playbackState, setPlaybackState] = useState<PlaybackState>(INITIAL_STATE);
  const soundRef = useRef<Audio.Sound | null>(null);

  const unloadSound = useCallback(async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      unloadSound();
    };
  }, [unloadSound]);

  const handleStatusUpdate = useCallback(
    (id: string, status: AVPlaybackStatus) => {
      if (!status.isLoaded) {
        if (status.error) {
          setPlaybackState((prev) => ({
            ...prev,
            status: "error",
          }));
        }
        return;
      }

      const playStatus: PlaybackStatus = status.didJustFinish
        ? "finished"
        : status.isPlaying
        ? "playing"
        : "paused";

      setPlaybackState({
        recordingId: id,
        status: playStatus,
        positionMs: status.positionMillis ?? 0,
        durationMs: status.durationMillis ?? 0,
      });

      if (status.didJustFinish) {
        unloadSound();
        setPlaybackState(INITIAL_STATE);
      }
    },
    [unloadSound]
  );

  const play = useCallback(
    async (id: string, uri: string) => {
      await unloadSound();

      setPlaybackState({
        recordingId: id,
        status: "loading",
        positionMs: 0,
        durationMs: 0,
      });

      try {
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });

        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true },
          (status) => handleStatusUpdate(id, status)
        );

        soundRef.current = sound;
      } catch (err) {
        console.error("[usePlayer] play error:", err);
        setPlaybackState((prev) => ({ ...prev, status: "error" }));
      }
    },
    [unloadSound, handleStatusUpdate]
  );

  const pause = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.pauseAsync();
    } catch (err) {
      console.error("[usePlayer] pause error:", err);
    }
  }, []);

  const resume = useCallback(async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.playAsync();
    } catch (err) {
      console.error("[usePlayer] resume error:", err);
    }
  }, []);

  const stop = useCallback(async () => {
    await unloadSound();
    setPlaybackState(INITIAL_STATE);
  }, [unloadSound]);

  const seek = useCallback(async (positionMs: number) => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.setPositionAsync(positionMs);
    } catch (err) {
      console.error("[usePlayer] seek error:", err);
    }
  }, []);

  return { playbackState, play, pause, resume, stop, seek };
}