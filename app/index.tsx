import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CreateRecording from "../components/CreateRecording";
import DisplayRecording from "../components/DisplayRecording";
import SignOutCard from "../components/SignOutCard";
import { usePlayer } from "../hooks/usePlayer";
import { useAuth } from "../context/AuthContext";
import { Recording } from "../types/recording";

export default function Index() {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [signOutVisible, setSignOutVisible] = useState(false);
  const { playbackState, play, pause, resume, stop } = usePlayer();
  const { user, signOut } = useAuth();

  const handleSave = (recording: Recording) => {
    setRecordings((prev) => [recording, ...prev]);
  };

  const handleDelete = (id: string) => {
    if (playbackState.recordingId === id) stop();
    setRecordings((prev) => prev.filter((r) => r.id !== id));
  };

  const handleConfirmSignOut = () => {
    setSignOutVisible(false);
    signOut();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Voice Notes</Text>
          <Text style={styles.subheading}>
            {recordings.length === 0
              ? "Tap the mic to record"
              : `${recordings.length} recording${recordings.length !== 1 ? "s" : ""}`}
          </Text>
        </View>

        {user && (
          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => setSignOutVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarInitial}>
              {user.displayName.charAt(0).toUpperCase()}
            </Text>
            <View style={styles.signOutBadge}>
              <Ionicons name="log-out-outline" size={10} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <DisplayRecording
        recordings={recordings}
        playbackState={playbackState}
        onPlay={play}
        onPause={pause}
        onResume={resume}
        onDelete={handleDelete}
      />

      <CreateRecording onSave={handleSave} />

      <SignOutCard
        visible={signOutVisible}
        displayName={user?.displayName ?? ""}
        onConfirm={handleConfirmSignOut}
        onCancel={() => setSignOutVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1819",
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  heading: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subheading: {
    color: "#555",
    fontSize: 13,
    marginTop: 2,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF8C00",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  signOutBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#333",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a1819",
  },
});