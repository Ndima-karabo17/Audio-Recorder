import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Recording } from "../types/recording";
import { PlaybackState } from "../types/recording";
import { formatDuration } from "../utils/format";

interface Props {
  recordings: Recording[];
  playbackState: PlaybackState;
  onPlay: (id: string, uri: string) => void;
  onPause: () => void;
  onResume: () => void;
  onDelete?: (id: string) => void;
}

export default function DisplayRecording({
  recordings,
  playbackState,
  onPlay,
  onPause,
  onResume,
  onDelete,
}: Props) {
  const handleTogglePlay = (item: Recording) => {
    const isThisOne = playbackState.recordingId === item.id;
    if (isThisOne && playbackState.status === "playing") {
      onPause();
    } else if (isThisOne && playbackState.status === "paused") {
      onResume();
    } else {
      onPlay(item.id, item.uri);
    }
  };

  const isActive = (id: string) => playbackState.recordingId === id;
  const isPlaying = (id: string) =>
    isActive(id) && playbackState.status === "playing";

  return (
    <FlatList
      data={recordings}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingBottom: 110 }}
      renderItem={({ item }) => {
        const active = isActive(item.id);
        const playing = isPlaying(item.id);
        const progress =
          active && playbackState.durationMs > 0
            ? playbackState.positionMs / playbackState.durationMs
            : 0;
        const displayDuration = active
          ? formatDuration(playbackState.positionMs)
          : item.durationMs
          ? formatDuration(item.durationMs)
          : null;

        return (
          <View style={[styles.card, active && styles.cardActive]}>
            <View style={styles.cardTop}>
              <View style={styles.textContainer}>
                <Text style={styles.dateText}>{item.date}</Text>
                <Text style={styles.timeText}>{item.timestamp}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.playButton, playing && styles.playButtonActive]}
                  onPress={() => handleTogglePlay(item)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={playing ? "pause" : "play"}
                    size={22}
                    color={playing ? "white" : "black"}
                  />
                </TouchableOpacity>

                {onDelete && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(item.id)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="trash-outline" size={18} color="#888" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Progress bar — visible only when active */}
            {active && (
              <View style={styles.progressRow}>
                <View style={styles.progressTrack}>
                  <View
                    style={[styles.progressFill, { width: `${progress * 100}%` }]}
                  />
                </View>
                {displayDuration && (
                  <Text style={styles.durationText}>{displayDuration}</Text>
                )}
              </View>
            )}
          </View>
        );
      }}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="mic-outline" size={52} color="#333" />
          <Text style={styles.emptyTitle}>No recordings yet</Text>
          <Text style={styles.emptySubtitle}>Tap the mic button to get started</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#242122",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2e2b2c",
  },
  cardActive: {
    borderColor: "#FF8C00",
    borderWidth: 1,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: { flex: 1 },
  dateText: { color: "#ece1e1", fontSize: 15, fontWeight: "600" },
  timeText: { color: "#888", fontSize: 12, marginTop: 2 },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  playButton: {
    backgroundColor: "#FF8C00",
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonActive: {
    backgroundColor: "#cc6f00",
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1819",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 3,
    backgroundColor: "#3a3738",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FF8C00",
    borderRadius: 2,
  },
  durationText: {
    color: "#888",
    fontSize: 11,
    fontVariant: ["tabular-nums"],
    minWidth: 36,
    textAlign: "right",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    gap: 8,
  },
  emptyTitle: {
    color: "#555",
    fontSize: 17,
    fontWeight: "600",
    marginTop: 8,
  },
  emptySubtitle: {
    color: "#444",
    fontSize: 13,
  },
});