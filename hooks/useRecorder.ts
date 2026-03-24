import { useState, useRef, useCallback } from "react";
import { Alert } from "react-native";
import { Audio } from "expo-av";
import { Recording } from "../types/recording";
import { RECORDING_OPTIONS } from "../utils/recordingOptions";
import { generateId, formatTime, formatDate } from "../utils/format";

interface UseRecorderReturn {
  isRecording: boolean;
  elapsedMs: number;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Recording | null>;
}

export function useRecorder(): UseRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimer = () => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = useCallback(async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert("Permission Required", "Microphone access is needed to record voice notes.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(RECORDING_OPTIONS);
      await rec.startAsync();

      recordingRef.current = rec;
      startTimeRef.current = Date.now();
      setElapsedMs(0);
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setElapsedMs(Date.now() - startTimeRef.current);
      }, 200);
    } catch (err) {
      console.error("[useRecorder] startRecording error:", err);
      Alert.alert("Error", "Failed to start recording. Please try again.");
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<Recording | null> => {
    try {
      const rec = recordingRef.current;
      if (!rec) return null;

      clearTimer();
      const durationMs = Date.now() - startTimeRef.current;

      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();

      recordingRef.current = null;
      setIsRecording(false);
      setElapsedMs(0);

      // Restore audio mode for playback
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      if (!uri) {
        Alert.alert("Error", "Recording URI was not available.");
        return null;
      }

      const now = new Date();
      const newRecording: Recording = {
        id: generateId(),
        uri,
        timestamp: formatTime(now),
        date: formatDate(now),
        durationMs,
      };

      return newRecording;
    } catch (err) {
      console.error("[useRecorder] stopRecording error:", err);
      Alert.alert("Error", "Failed to stop recording.");
      return null;
    }
  }, []);

  return { isRecording, elapsedMs, startRecording, stopRecording };
}