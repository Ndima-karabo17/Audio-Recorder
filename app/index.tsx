import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import CreateRecording from "../components/CreateRecording";
import DisplayRecording from "../components/DisplayRecording";
import { usePlayer } from "../hooks/usePlayer";
import { Recording } from "../types/recording";

export default function Index() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const { playbackState, play, pause, resume, stop } = usePlayer();

  const handleSave = (recording: Recording) => {
    setRecordings((prev) => [recording, ...prev]);
  };

  const handleDelete = (id: string) => {
    // If this recording is currently playing, stop playback first
    if (playbackState.recordingId === id) {
      stop();
    }
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Voice Notes</Text>
      <Text style={styles.subheading}>
        {recordings.length === 0
          ? "Tap the mic to record"
          : `${recordings.length} recording${recordings.length !== 1 ? "s" : ""}`}
      </Text>

      <DisplayRecording
        recordings={recordings}
        playbackState={playbackState}
        onPlay={play}
        onPause={pause}
        onResume={resume}
        onDelete={handleDelete}
      />

      <CreateRecording onSave={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1819",
    paddingTop: 8,
  },
  heading: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 2,
    marginLeft: 20,
    letterSpacing: -0.5,
  },
  subheading: {
    color: "#555",
    fontSize: 13,
    marginLeft: 20,
    marginBottom: 10,
  },
});